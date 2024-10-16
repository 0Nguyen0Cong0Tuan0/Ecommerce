import React from 'react';
import Button from '@mui/material/Button';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

import { useContext } from 'react';
import { MyContext } from '../../App';

const HomeCat = () => {

    const context = useContext(MyContext);


    return (
        <>
            <section className="mb-5">
                <div className="container">
                    <h2 className='
                        text-lg font-bold pl-2 tracking-widest mb-[20px] ml-[23px]'
                        >FEATURED CATEGORIES</h2>

                    <Swiper 
                        slidesPerView={5} 
                        spaceBetween={0} 
                        navigation={true} 
                        slidesPerGroup={1} 
                        modules={[Navigation]}  
                        className='mySwiper'>
                        {
                            context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div className='text-center mx-3'>
                                            <Button 
                                                style={{ 
                                                    background: cat.color,
                                                    width: '90%',
                                                    height: 'auto',
                                                    borderRadius: '20px',
                                                    zIndex: 1 
                                                }} 
                                                className="w-11/12 rounded-2xl text-black z-10 flex flex-col justify-center items-center">
                                                <img 
                                                    src={cat.images[0].url} 
                                                    alt={cat.images[0]} 
                                                    className="size-10 mx-auto" />
                                                <p className="text-white">{cat.name}</p>
                                            </Button>
                                        </div>
                                    </SwiperSlide>
                                )
                            })
                        }
                    </Swiper>
                </div>
            </section>
        </>
    );
}

export default HomeCat;
