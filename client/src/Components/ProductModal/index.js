import QuantityBox from "../QuantityBox";
import Dialog from "@mui/material/Dialog";
import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import ProductZoom from "../ProductZoom";

import { useContext } from "react";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';

import { MdClose, MdOutlineCompareArrows } from "react-icons/md";
import { IoIosHeartEmpty } from "react-icons/io";

import { MyContext } from "../../App";



const ProductModal = ({ info }) => {
    const context = useContext(MyContext);
    const discount = ((1 - info.price.$numberDecimal / info.oldPrice.$numberDecimal) * 100).toFixed(2);

    const formatDescription = (description) => {
        // Find the index of the first occurrence of ' - '
        const firstHyphenIndex = description.indexOf('-');

        // Check if the hyphen exists
        if (firstHyphenIndex === -1) {
            return (
                <div>
                    <h3 className="text-xl font-bold tracking-widest mb-3">Description</h3>
                    <p className="text-base leading-relaxed text-justify">{description}</p>
                </div>
            );
        }

        // Get the main text (up to the first hyphen)
        const mainText = description.substring(0, firstHyphenIndex).trim();
        const listText = description.substring(firstHyphenIndex);

        // Split the list text into individual items and clean them
        const splitInfo = listText.split('-').map(part => part.trim()).filter(part => part.length > 0);

        return (
            <div>
                <h3 className="text-xl font-bold tracking-widest mb-3">Description</h3>
                <p className="text-base leading-relaxed text-justify">{mainText}</p>
                <ul className="list-disc pl-5 mt-4">
                    {splitInfo.map((item, index) => (
                        <li key={index} className="text-base leading-relaxed">
                            {item.replace(/[-]+/g, "").trim()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <>
            <Dialog open={true} className="productModal" onClose={() => context.setIsOpenProductModal(false)}>
                <Button className='close_' onClick={() => context.setIsOpenProductModal(false)}><MdClose /></Button>

                <h4 className='productName'>{info.name}</h4>

                <div className="productFrom">
                    <div className="productBrand">
                        <span className="title">Brands:</span>
                        <span className="description">{info.brand}</span>
                    </div>

                    <div className="productRating">
                        <Rating name='Product Rating' value={5} readOnly size="small" precision={0.5} />
                    </div>

                    <div className="productID">
                        <span className="productid">ID:</span>
                        <span className="idvalue">{info.id}</span>
                    </div>
                </div>

                <hr class="w-full border border-black rounded-lg mb-6"/>

                <div className="row productDetailedModal">
                    <div className="col-md-5">
                        <ProductZoom images={info.images} />
                    </div>

                    <div className="col-md-7">
                        {
                            discount !== '0.00'
                                ?
                                <div className="flex items-end">
                                    <span className="text-2xl text-gray-400 line-through">${info.oldPrice.$numberDecimal}</span>
                                    <span className="text-4xl text-red-500 pl-3">${info.price.$numberDecimal}</span>
                                    <span className="text-lg tracking-wider ml-4 z-10 bg-blue-500 text-white py-1 px-2 rounded-lg">
                                        {`${discount}%`}
                                    </span>
                                </div>
                                : <div className="text-4xl text-red-500">${info.price.$numberDecimal}</div>


                        }

                        {
                            info.countInStock > 0
                                ?
                                <div className=" inline-block text-sm tracking-wide text-green-600 bg-green-100 mt-3 py-2 px-4 rounded-full">
                                    IN STOCK
                                </div>
                                :
                                <div className=" inline-block text-sm tracking-wide text-red-600 bg-red-100 mt-3 py-2 px-4 rounded-full">
                                    OUT OF STOCK
                                </div>
                        }



                        <div className="my-4">
                            {formatDescription(info.description)}
                        </div>

                        <div className="flex flex-cols mb-4">
                            <QuantityBox />
                            <Button
                                sx={{
                                    background: '#4123ab',
                                    padding: '10px 20px',
                                    borderRadius: '5px',

                                }}
                                className="hover:bg-red-600"
                            ><p className="text-white">Add to Cart</p></Button>
                        </div>

                        <div className="flex flex-cols mb-4">
                            <Button sx={{
                                background: '#4123ab',
                                borderRadius: '5px',
                                padding: '10px 20px',
                                marginRight: '52px',

                            }}
                                className="hover:bg-red-600" variant="outlined">
                                <IoIosHeartEmpty className="text-white" />
                                <p className="text-white">&nbsp; Add to Wishlist</p>
                            </Button>

                            <Button sx={{
                                background: '#4123ab',
                                borderRadius: '5px',
                                padding: '10px 20px',
                            }}
                                className="hover:bg-red-600" variant="outlined">
                                <MdOutlineCompareArrows className="text-white" />
                                <p className="text-white">&nbsp; Compare</p>
                            </Button>
                        </div>

                        <hr class="w-full border border-black rounded-lg"/>

                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ProductModal;
