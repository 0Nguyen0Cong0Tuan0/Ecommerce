import { IoFastFoodOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { RiDiscountPercentLine } from "react-icons/ri";
import { AiOutlineDollar } from "react-icons/ai";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

import { Link } from "react-router-dom";



const Footer = () => {
    return (
        <>
            <footer>
                <div className="container">
                    <div className="topInfo row">
                        <div className="benefits col">
                            <span><IoFastFoodOutline/></span>
                            <span className="message">Every fresh products</span>
                        </div>

                        <div className="benefits col">
                            <span><TbTruckDelivery/></span>
                            <span className="message">Free delivery for order over $70</span>
                        </div>

                        <div className="benefits col">
                            <span><RiDiscountPercentLine/></span>
                            <span className="message">Daily Mega Discount</span>
                        </div>

                        <div className="benefits col">
                            <span><AiOutlineDollar/></span>
                            <span className="message">Best price on the market</span>
                        </div>
                    </div>

                    <div className="footerInfo row">
                        <div className="footerItem col">
                            <h5>Fruit & Vegetables</h5>
                            <ul>
                                <li><Link to='#'>Fresh Vegetables</Link></li>
                                <li><Link to='#'>Herbs & Seasonings</Link></li>
                                <li><Link to='#'>Fresh Fruits</Link></li>
                                <li><Link to='#'>Cuts & Sprouts</Link></li>
                                <li><Link to='#'>Exotic Fruits & Veggies</Link></li>
                                <li><Link to='#'>Packaged Product</Link></li>
                                <li><Link to='#'>Party Trays</Link></li>
                            </ul>
                        </div>

                        <div className="footerItem col">
                            <h5>Breakfast & Dairy</h5>
                            <ul>
                                <li><Link to='#'>Milk & Flavoured Milk</Link></li>
                                <li><Link to='#'>Butter & Margarine</Link></li>
                                <li><Link to='#'>Cheese</Link></li>
                                <li><Link to='#'>Egg Substitutes</Link></li>
                                <li><Link to='#'>Honey</Link></li>
                                <li><Link to='#'>Marmalades</Link></li>
                                <li><Link to='#'>Sour Cream & Dips</Link></li>
                                <li><Link to='#'>Yogurt</Link></li>
                            </ul>
                        </div>

                        <div className="footerItem col">
                            <h5>Meat & Seafood</h5>
                            <ul>
                                <li><Link to='#'>Breakfast Sausage</Link></li>
                                <li><Link to='#'>Dinner Sausage</Link></li>
                                <li><Link to='#'>Beef</Link></li>
                                <li><Link to='#'>Chicken</Link></li>
                                <li><Link to='#'>Sliced Deli Meat</Link></li>
                                <li><Link to='#'>Shrimp</Link></li>
                                <li><Link to='#'>Wild Caught Fillets</Link></li>
                                <li><Link to='#'>Crab & Shellfish</Link></li>
                                <li><Link to='#'>Farm Raised Fillets</Link></li>
                            </ul>
                        </div>


                        <div className="footerItem col">
                            <h5>Beverages & Drinks</h5>
                            <ul>
                                <li><Link to='#'>Water</Link></li>
                                <li><Link to='#'>Sparking Water</Link></li>
                                <li><Link to='#'>Soda & Pop</Link></li>
                                <li><Link to='#'>Coffee</Link></li>
                                <li><Link to='#'>Milk & Plant-Based Mil</Link></li>
                                <li><Link to='#'>Tea & Kombucha</Link></li>
                                <li><Link to='#'>Drink Boxes & Pouches</Link></li>
                                <li><Link to='#'>Craft Beer</Link></li>
                                <li><Link to='#'>Wine</Link></li>
                            </ul>
                        </div>


                        <div className="footerItem col">
                            <h5>Breads & Bakery</h5>
                            <ul>
                                <li><Link to='#'>Milk & Flavoured Milk</Link></li>
                                <li><Link to='#'>Butter & Margarine</Link></li>
                                <li><Link to='#'>Cheese</Link></li>
                                <li><Link to='#'>Egg Substitutes</Link></li>
                                <li><Link to='#'>Honey</Link></li>
                                <li><Link to='#'>Marmalades</Link></li>
                                <li><Link to='#'>Sour Cream & Dips</Link></li>
                                <li><Link to='#'>Yogurt</Link></li>
                            </ul>
                        </div>

                    </div>

                    <div className="copyright">
                        <p>Copyright 2024 © NCT. All rights reserved. Powered by NCT.</p>
                        <ul className="list list-inline">
                            <li className="list-inline-item">
                                <Link to='#'><FaFacebookF/></Link>
                            </li>

                            <li className="list-inline-item">
                                <Link to='#'><FaTwitter/></Link>
                            </li>

                            <li className="list-inline-item">
                                <Link to='#'><FaInstagram/></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;