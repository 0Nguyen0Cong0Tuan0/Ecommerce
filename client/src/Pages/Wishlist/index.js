import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import useAuthStore from "../../store/authStore";
import { MyContext } from "../../App";
import GradientCircularProgress from "../../Components/Loading";

const Wishlist = () => {
    const { client } = useAuthStore();
    const context = useContext(MyContext);

    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRatings = async () => {
            const newRatings = {};
            try {
                for (const item of context.wishListData) {
                    const rating = await fetchDataFromApi(`/api/review?productId=${item.productId}`);
                    
                    newRatings[item.productId] = rating.averageRating || 0;
                }
                setRatings(newRatings);
            } catch (error) {
                console.error("Error fetching ratings:", error);
                // You may want to handle error state here
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, [context.wishListData]);


    const removeItem = (id) => {
        deleteData(`/api/wishlist/${id}`).then((res) => {
            console.log(res);
        });
    };

    if (loading) {
        return <GradientCircularProgress />;
    }

    return (
        <section className="section cartPage">
            <div className="container">
                <h2 className='hd mb-0'>Your Wishlist</h2>
                <p>There are <b>{context.wishListData.length > 0 ? context.wishListData.length : '0'}</b> products in your wishlist</p>

                <div className='row'>
                    <div className="col-md-12 pr-4">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="w-[15%]">Image</th>
                                        <th className="w-[35%]">Product</th>
                                        <th className="w-[15%]">Unit Price</th>
                                        <th className="w-[10%]">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {context.wishListData.length > 0 && context.wishListData?.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="size-20" style={{ width: '80px', height: '80px', overflow: 'hidden' }}>
                                                    <img src={item.image} className="w-100 h-100 object-cover" alt={item.productTitle} />
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

                    
                </div>
            </div>
        </section>
    );
};

export default Wishlist;
