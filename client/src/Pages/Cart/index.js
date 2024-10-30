import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import QuantityBox from '../../Components/QuantityBox';
import { Link } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { IoCartSharp } from "react-icons/io5";
import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import useAuthStore from "../../store/authStore";
import { MyContext } from "../../App";
import GradientCircularProgress from "../../Components/Loading";

const Cart = () => {
    const { client } = useAuthStore();
    const context = useContext(MyContext);
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);

    const timerId = useRef(null);

    const updateQuantity = (itemId, newQuantity) => {
        clearTimeout(timerId.current);
        timerId.current = setTimeout(() => {
            context.setCartData((prevData) => {
                return prevData.map(item => {
                    if (item._id === itemId) {
                        return {
                            ...item,
                            quantity: newQuantity,
                            subTotal: (item.price.$numberDecimal * newQuantity).toFixed(2)
                        };
                    }
                    return item;
                });
            });
        }, 500); // Set delay to 500ms for debouncing
    };

    const selectedItem = (product) => {
        const cartFields = {
            productTitle: product.productTitle,
            image: product.image,
            price: product.price.$numberDecimal,
            quantity: product.quantity,
            subTotal: (product.price.$numberDecimal * product.quantity).toFixed(2),
            productId: product.productId._id,
            clientId: client._id
        };

        editData(`/api/cart/${product._id}`, cartFields).then(() => {
            console.log('Cart updated successfully');
        }).catch(error => {
            console.error('Error updating cart:', error);
        });
    };

    const totalPrice = useMemo(() => {
        return context.cartData.reduce((total, item) => total + (item.price.$numberDecimal * item.quantity), 0).toFixed(2);
    }, [context.cartData]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const productIds = context.cartData.map(item => item.productId);
                if (productIds.length > 0) {
                    const ratingResponse = await fetchDataFromApi(`/api/review?productIds=${productIds.join(',')}`);
                    if (ratingResponse && ratingResponse.ratings) {
                        setRatings(ratingResponse.ratings);
                    }
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRatings();
    }, [context.cartData]);

    const removeItem = async (id) => {
        try {
            await deleteData(`/api/cart/${id}`);
            context.setCartData(prevData => prevData.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    if (loading) {
        return <GradientCircularProgress />;
    }

    return (
        <section className="section cartPage">
            <div className="container">
                <h2 className='hd mb-0'>Your Cart</h2>
                <p>There are <b>{context.cartData.length > 0 ? context.cartData.length : '0'}</b> products in your cart</p>

                <div className='row'>
                    <div className="col-md-9 pr-4">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="w-[15%]">Image</th>
                                        <th className="w-[35%]">Product</th>
                                        <th className="w-[15%]">Unit Price</th>
                                        <th className="w-[15%] pr-5">Quantity</th>
                                        <th className="w-[10%]">Subtotal</th>
                                        <th className="w-[10%]">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {context.cartData.length > 0 && context.cartData.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="size-20" style={{ width: '80px', height: '80px', overflow: 'hidden' }}>
                                                    <img src={item.image} loading="lazy" className="w-100 h-100 object-cover" alt={item.productTitle} />
                                                </div>
                                            </td>

                                            <td>
                                                <Link to={`/product/${item.productId}`}>
                                                    <div className='info d-flex flex-column justify-content-center' style={{ height: '80px' }}>
                                                        <h6 className="mb-1">{item.productTitle}</h6>
                                                        <Rating
                                                            name='read-only'
                                                            value={Number(ratings[item.productId] || 0)}
                                                            precision={0.5}
                                                            readOnly
                                                            size="small"
                                                        />
                                                    </div>
                                                </Link>
                                            </td>

                                            <td>{`$${item.price.$numberDecimal}`}</td>

                                            <td>
                                                <QuantityBox
                                                    quantity={(val) => updateQuantity(item._id, val)}
                                                    item={item}
                                                    selectedItem={selectedItem}
                                                    initialQuantity={item.quantity}
                                                />
                                            </td>

                                            <td>{`$${(item.price.$numberDecimal * item.quantity).toFixed(2)}`}</td>

                                            <td>
                                                <Button className="remove" onClick={() => removeItem(item._id)}>
                                                    <IoIosClose />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="cartDetails border card shadow p-3">
                            <h4>CART TOTALS</h4>

                            <div className="d-flex align-items-center my-3">
                                <span>Estimated total</span>
                                <span className="ml-auto">{`$${totalPrice}`}</span>
                            </div>

                            <div className="d-flex align-items-center text-red-500">
                                <span>Sales tax will be calculated during checkout where applicable</span>
                            </div>


                            <Link to='/checkout'>
                                <Button className="btn-blue btn-lg btn-big btn-buynow">
                                    <IoCartSharp className="mr-2" />BUY NOW
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cart;
