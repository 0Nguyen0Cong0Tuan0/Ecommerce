import Slider from "react-slick";
import InnerImageZoom from 'react-inner-image-zoom';
import { useRef } from "react";


const ProductZoom = ({ images }) => {

    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    const goto = (index) => {
        if (zoomSlider.current && zoomSliderBig.current) {
            zoomSlider.current.slickGoTo(index);
            zoomSliderBig.current.slickGoTo(index);
        }
    };

    const settings = {
        dots: false,
        infinite: true, // Disable infinite scroll
        speed: 200,
        slidesToShow: 4,
        slidesToScroll: 1,
        fade: false,
        arrows: true,
        beforeChange: (current, next) => goto(next),
    };


    const settings2 = {
        dots: false,
        infinite: false, // Disable infinite scroll
        speed: 200,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
        arrows: false,
    };

    return (
        <>
            <div className="productZoom">
                <Slider {...settings2} className='zoomSliderBig' ref={zoomSliderBig}>
                    {images.map((src, index) => (
                        <div className="item" key={index}>
                            <InnerImageZoom zoomType='hover' zoomScale={1} src={src.url} />
                        </div>
                    ))}
                </Slider>
            </div>

            <Slider {...settings} className='zoomSlider' ref={zoomSlider}>
                {images.map((src, index) => (
                    <div className="item" key={index}>
                        <img src={src.url} alt='product view' onClick={() => goto(index)} />
                    </div>
                ))}
            </Slider>
        </>
    )
}

export default ProductZoom;