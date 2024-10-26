import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import { useContext, useRef, useState, useEffect } from "react";
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from "../../App";
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductItem = (props) => {
    const [isHovered, setIsHovered] = useState(false);
    const [rating, setRating] = useState(0); // Local state for product rating
    const context = useContext(MyContext);
    const sliderRef = useRef();

    const { client } = useAuthStore();
    let [cartFields, setCartFields] = useState({});

    // Slider settings based on props.view
    const getSliderSettings = () => {
        const imageCount = props.item.images.length;
        switch (props.view) {
            case 'one':
                return {
                    dots: false,
                    infinite: imageCount > 1,
                    speed: 500,
                    slidesToShow: imageCount > 1 ? imageCount : 1,
                    slidesToScroll: 1,
                    autoplay: imageCount > 1,
                    autoplaySpeed: 1000,
                };
            case 'two':
                return {
                    dots: false,
                    infinite: imageCount > 1,
                    speed: 500,
                    slidesToShow: imageCount > 1 ? 2 : 1,
                    slidesToScroll: 1,
                    autoplay: imageCount > 1,
                    autoplaySpeed: 1000,
                };
            case 'three':
            case 'four':
                return {
                    dots: false,
                    infinite: imageCount > 1,
                    speed: 500,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: imageCount > 1,
                    autoplaySpeed: 1000,
                };
            default:
                return {
                    dots: false,
                    infinite: imageCount > 1,
                    speed: 500,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: imageCount > 1,
                    autoplaySpeed: 1000,
                };
        }
    };

    const settings = getSliderSettings();

    const viewProductDetails = (item) => {
        context.setIsOpenProductModal(true);
        context.setProductModalData(item);
    };

    const handleMouseOver = () => {
        setIsHovered(true);
        if (sliderRef.current) {
            sliderRef.current.slickPlay();
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (sliderRef.current) {
            sliderRef.current.slickPause();
        }
    };

    const discount = ((1 - props.item.price.$numberDecimal / props.item.oldPrice.$numberDecimal) * 100).toFixed(2);

    useEffect(() => {
        const fetchReviews = async () => {
            const data = await fetchDataFromApi(`/api/review?productId=${props.item._id}`);
            setRating(data.averageRating); // Set rating in local state
        };
        fetchReviews();
    }, [props.item]);

    const addToCart = () => {
        cartFields.productTitle = props.item.name;
        cartFields.image = props.item.images[0].url;
        cartFields.price = props.item.price.$numberDecimal;
        cartFields.quantity = 1;
        cartFields.subTotal = props.item.price.$numberDecimal * 1;
        cartFields.productId = props.item._id;
        cartFields.clientId = client._id; // Update 'userId' to 'clientId' to match your schema

        context.addToCart(cartFields);
    };

    const addToWishList = () => {
        cartFields.productTitle = props.item.name;
        cartFields.image = props.item.images[0].url;
        cartFields.price = props.item.price.$numberDecimal;
        cartFields.productId = props.item._id;
        cartFields.clientId = client._id; // Update 'userId' to 'clientId' to match your schema

        context.addToWishList(cartFields);
    };

    return (
        <div
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            className={`w-full p-3 border border-gray-400 cursor-pointer relative rounded-lg`}
        >
            {discount !== '0.00' && (
                <span className="text-sm tracking-wider absolute top-3 z-10 bg-blue-500 text-white py-1 px-2 rounded-lg">
                    {`${discount}%`}
                </span>
            )}

            <div className="relative mb-4 pl-4">
                <Link to={`/product/${props.item.id}`}>
                    {isHovered ? (
                        <Slider {...settings} ref={sliderRef}>
                            {props.item?.images?.map((image, index) => (
                                <div className='slick-slide' key={index}>
                                    <img
                                        src={image.url}
                                        className='h-32 px-1'
                                        alt={`${image.url}`}
                                    />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className='flex flex-row justify-around'>
                            {(props.view === 'three' || props.view === 'four' || props.view === null) && (
                                <img
                                    src={props?.item?.images[0].url}
                                    alt={`${props?.item?.images[0].url}`}
                                    className="h-32 px-1"
                                />
                            )}
                            {props.view === 'two' && props.item.images.slice(0, 2).map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`${image.url}`}
                                    className="h-32 px-1"
                                />
                            ))}
                            {props.view === 'one' && props.item.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`${image.url}`}
                                    className="h-32 px-1"
                                />
                            ))}
                        </div>
                    )}
                </Link>
            </div>

            <div className="absolute top-3 right-3 z-10 flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                    onClick={() => viewProductDetails(props.item)}
                    className="bg-white border border-gray-200">
                    <TfiFullscreen className="text-md font-bold text-black hover:text-red-500" />
                </Button>

                <Button
                    className="bg-white border border-gray-200"
                    onClick={() => addToWishList()}>
                    <IoMdHeartEmpty className="text-xl font-bold text-black hover:text-red-500" />
                </Button>
            </div>

            <div>
                <Link to={`/product/${props.item.id}`} className='hover:no-underline'>
                    <p className="font-medium text-sm mb-2">
                        {props.item?.name.length > (props.view === 'four' ? 65 : (props.view === 'three' || props.view === null) ? 90 : 150)
                            ? props.item?.name.substr(0, props.view === 'four' ? 65 : (props.view === 'three' || props.view === null) ? 90 : 150) + '...'
                            : props.item.name.padEnd(props.view === 'four' ? 65 : (props.view === 'three' || props.view === null) ? 90 : 150, '\u00A0')}
                    </p>
                </Link>

                <div className="flex items-center justify-between">
                    {props?.item?.countInStock > 0
                        ? <span className="text-green-500 text-sm">In Stock</span>
                        : <span className="text-red-500 text-sm">Out of Stock</span>}
                    <Rating name='read-only' value={Number(rating)} readOnly size="small" precision={0.5} /> {/* Use local rating */}
                </div>

                <div className="flex items-center my-2">
                    {discount !== '0.00' ? (
                        <>
                            <span className="text-lg text-gray-400 line-through">${props?.item?.oldPrice.$numberDecimal}</span>
                            <span className="text-xl text-red-500 pl-3">${props?.item?.price.$numberDecimal}</span>
                        </>
                    ) : (
                        <span className="text-xl text-red-500">${props?.item?.price.$numberDecimal}</span>
                    )}
                </div>
            </div>

            <div className="w-full flex justify-between">
                <div>
                    <p className='text-xs'>{props.item.category.name}</p>
                    <p className='text-base'>
                        {props.item.subCategory.name.length > 10
                            ? `${props.item.subCategory.name.substr(0, 10)}...`
                            : props.item.subCategory.name}
                    </p>
                </div>

                <Button
                    sx={{
                        background: '#4123ab',
                        borderRadius: '5px',
                    }}
                    onClick={() => addToCart()}
                    className="hover:bg-red-600"
                >
                    <p className='text-white'>Add to Cart</p>
                </Button>
            </div>
        </div>
    );
};

export default ProductItem;
