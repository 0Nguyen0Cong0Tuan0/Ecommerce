// Components
import HomeBanner from "../../Components/HomeBanner";
import HomeCat from "../../Components/HomeCat";
import ProductItem from "../../Components/ProductItem";
import NewsLetter from "../../Components/NewsLetter";

import food_banner from "../../assets/food/food_banner_section.png";

import Button from '@mui/material/Button';

import { IoIosArrowRoundForward } from "react-icons/io";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';
import { useContext } from "react";
import { MyContext } from "../../App";


const Home = () => {
    const context = useContext(MyContext);

    return (
        <>
            <HomeBanner />
            {
                context.catData?.categoryList?.length !== 0 && <HomeCat />
            }

            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <div className="w-full">
                            <img src={food_banner} alt={"Food Banner"} className="cursor-pointer w-full rounded-lg overflow-hidden" />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        {/* Featured Products Section */}
                        <div className="flex items-center mb-3">
                            <div className="info">
                                <h2 className="text-xl font-semibold mb-0">FEATURED PRODUCTS</h2>
                                <p className="">Do not miss the current offers until the end of September</p>
                            </div>

                            <Button
                                sx={{
                                    border: '1px solid gray',
                                    borderRadius: '40px',
                                    padding: '5px 20px',
                                }}
                                className='ml-auto'
                            >
                                <p className="text-base text-black">View All</p>
                                <IoIosArrowRoundForward className="text-base text-black" />
                            </Button>
                        </div>

                        <div className="productRow w-full">
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={20}
                                pagination={{ dynamicBullets: true }}
                                modules={[Pagination]}
                                className="mySwiper">
                                {context.featuredProductData?.productList?.length > 0 && context.featuredProductData.productList.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <ProductItem item={item} view={null} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* New Products Section */}
                        <div className="flex items-center mb-3">
                            <div className="info">
                                <h2 className="text-xl font-semibold mb-0">NEW PRODUCTS</h2>
                                <p className="">New products with updated stocks</p>
                            </div>

                            <Button
                                sx={{
                                    border: '1px solid gray',
                                    borderRadius: '40px',
                                    padding: '5px 20px',
                                }}
                                className=' ml-auto'
                            >
                                <p className="text-base text-black">View All</p>
                                <IoIosArrowRoundForward className="text-base text-black" />
                            </Button>
                        </div>

                        <div className="productRow w-full">
                            <Swiper slidesPerView={4} spaceBetween={20} pagination={{ dynamicBullets: true }} modules={[Pagination]} className="mySwiper">
                                {context.productData?.products?.length !== 0 && context.productData?.products?.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <ProductItem item={item} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
            <NewsLetter />
        </>
    )
}

export default Home;