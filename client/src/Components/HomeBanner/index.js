import React from "react";
import Slider from "react-slick";

import banner_1 from "../../assets/banner_1.jpg";
import banner_2 from "../../assets/banner_2.jpg";
import banner_3 from "../../assets/banner_3.jpg";

const HomeBanner = () => {
    const settings = {
        speed: 500,
        spaceBetween: 15,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 4000,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    };

    return (
        <div className="container mx-auto mb-10">
            <div className="relative w-full">
                <Slider {...settings}>
                    <div className="overflow-hidden">
                        <img src={banner_1} alt="Banner 1" className="w-full h-[465px] rounded-lg" />
                    </div>
                    <div className="overflow-hidden">
                        <img src={banner_2} alt="Banner 2" className="w-full h-[465px] rounded-lg" />
                    </div>
                    <div className="overflow-hidden">
                        <img src={banner_3} alt="Banner 3" className="w-full h-[465px] rounded-lg" />
                    </div>
                </Slider>
            </div>
        </div>
    );
}

// Custom Next Arrow component
const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className}`}
            style={{ ...style, display: 'block', right: '15px', top: '50%', zIndex: 10 }}
            onClick={onClick}
        >
        </div>
    );
}

// Custom Prev Arrow component
const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className}`}
            style={{ ...style, display: 'block', left: '15px', top: '50%', zIndex: 10 }}
            onClick={onClick}
        >
        </div>
    );
}

export default HomeBanner;
