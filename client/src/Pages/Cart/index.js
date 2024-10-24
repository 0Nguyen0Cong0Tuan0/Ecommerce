import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import QuantityBox from '../../Components/QuantityBox';
import { Link } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { IoCartSharp } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import useAuthStore from "../../store/authStore";
import { MyContext } from "../../App";

const Cart = () => {
    const { client } = useAuthStore();
    const context = useContext(MyContext);
    const [totalPrice, setTotalPrice] = useState(0);  // Create state for totalPrice

    const updateQuantity = (itemId, newQuantity) => {
        context.setCartData((prevData) => {
            return prevData.map(item => {
                if (item._id === itemId) {
                    return {
                        ...item,
                        quantity: newQuantity,
                        subTotal: (item.price.$numberDecimal * newQuantity).toFixed(2) // Recalculate subtotal
                    };
                }
                return item;
            });
        });
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

        editData(`/api/cart/${product?._id}`, cartFields).then((res) => {
            console.log('OK')
        });
    };

    // Calculate total price when cart data changes
    useEffect(() => {
        const total = context.cartData.reduce((total, item) => {
            return total + (item.price.$numberDecimal * item.quantity);
        }, 0).toFixed(2);
        setTotalPrice(total);  // Set totalPrice state
    }, [context.cartData]);

    const removeItem = (id) => {
        deleteData(`/api/cart/${id}`).then((res) => {
            console.log(res);
        })
    }

    return (
        <section className="section cartPage">
            <div className="container">
                <h2 className='hd mb-0'>Your Cart</h2>
                <p>There are <b>{context.cartData.length}</b> products in your cart</p>

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
                                    {context.cartData.length !== 0 && context.cartData.map((item, index) => (
                                        <tr key={index}>
                                            {/* Image Column */}
                                            <td>
                                                <div className="size-20" style={{ width: '80px', height: '80px', overflow: 'hidden' }}>
                                                    <img src={item.image} className="w-100 h-100 object-cover" alt={item.productTitle} />
                                                </div>
                                            </td>

                                            {/* Product Title & Rating Column */}
                                            <td>
                                                <Link to={`/product/${item.productId}`}>
                                                    <div className='info d-flex flex-column justify-content-center' style={{ height: '80px' }}>
                                                        <h6 className="mb-1">{item.productTitle}</h6>
                                                        <Rating name='read-only' value={4.5} precision={0.5} readOnly size="small" />
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* Unit Price Column */}
                                            <td>{`$${item.price.$numberDecimal}`}</td>

                                            {/* Quantity Column */}
                                            <td>
                                                <QuantityBox
                                                    quantity={(val) => updateQuantity(item._id, val)} // Pass the item ID and new quantity
                                                    item={item}
                                                    selectedItem={selectedItem}
                                                    initialQuantity={item.quantity} // Pass the initial quantity
                                                />
                                            </td>

                                            {/* Subtotal Column */}
                                            <td>{`$${(item.price.$numberDecimal * item.quantity).toFixed(2)}`}</td>

                                            {/* Remove Column */}
                                            <td>
                                                <Button

                                                    className="remove"
                                                    onClick={() => removeItem(item._id)}><IoIosClose /></Button>
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

                            <div className="d-flex align-items-center mb-3">
                                <span>Subtotal</span>
                                <span className="ml-auto">
                                    {`$${totalPrice}`} {/* Display total price from state */}
                                </span>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <span>Shipping</span>
                                <span className="ml-auto"><b>Free</b></span>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <span>Estimate for </span>
                                <span className="ml-auto"><b>United Kingdom</b></span>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <span>Total</span>
                                <span className="ml-auto">
                                    {`$${totalPrice}`} {/* Display total price again */}
                                </span>
                            </div>

                            <Button className="btn-blue btn-lg btn-big btn-buynow">
                                <IoCartSharp className="mr-2" />BUY NOW
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default Cart;

