import food_1 from "../../assets/food/#001/food_1.webp";
import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import QuantityBox from '../../Components/QuantityBox';
import { Link } from "react-router-dom";

import { IoIosClose } from "react-icons/io";
import { IoCartSharp } from "react-icons/io5";

const Cart = () => {
    return(
        <>
            <section className="section cartPage">
                <div className="container">
                    <h2 className='hd mb-0'>Your Cart</h2>
                    <p>There are <b>3</b> products in your cart</p>

                    <div className='row'>
                        <div className="col-md-9 pr-4">

                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Unit Price</th>
                                            <th className="pr-5">Quantity</th>
                                            <th>Subtotal</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>
                                                <Link to='/product/1'>
                                                    <div className="cartItemImgWrapper d-flex align-items-center">
                                                        <div className='imgWrapper'>
                                                            <img src={food_1} className="w-100"/>
                                                        </div>

                                                        <div className='info px-3'>
                                                            <h6>Smucker's Uncrustables Peanut Butter & Grape Jelly Sandwiches, 2 oz, 10 count (Frozen)
                                                            </h6>

                                                            <Rating name='read-only' value={4.5} precision={0.5} readOnly size="small" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td>$3.25</td>
                                            <td>
                                                <QuantityBox />
                                            </td>
                                            <td>$3.25</td>
                                            <td><span className="remove"><IoIosClose/></span></td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <Link to='/product/1'>
                                                    <div className="cartItemImgWrapper d-flex align-items-center">
                                                        <div className='imgWrapper'>
                                                            <img src={food_1} className="w-100"/>
                                                        </div>

                                                        <div className='info px-3'>
                                                            <h6>Smucker's Uncrustables Peanut Butter & Grape Jelly Sandwiches, 2 oz, 10 count (Frozen)
                                                            </h6>

                                                            <Rating name='read-only' value={4.5} precision={0.5} readOnly size="small" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td>$3.25</td>
                                            <td>
                                                <QuantityBox />
                                            </td>
                                            <td>$3.25</td>
                                            <td><span className="remove"><IoIosClose/></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="cartDetails border card shadow p-3">
                                <h4>CART TOTALS</h4>

                                <div className="d-flex align-items-center mb-3">
                                    <span>Subtotal</span>
                                    <span className="ml-auto">$70.99</span>
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
                                    <span className="ml-auto">$70.99</span>
                                </div>

                                <Button className="btn-blue btn-lg btn-big btn-buynow"><IoCartSharp className="mr-2"/>BUY NOW</Button>

                            </div>
                        </div>
                    </div>
                </div> 
            </section>
        </>
    )
}

export default Cart;