import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import QuantityBox from "../../Components/QuantityBox";
import ProductZoom from "../../Components/ProductZoom";
import ProductItem from "../../Components/ProductItem";
import GradientCircularProgress from "../../Components/Loading";
import useAuthStore from "../../store/authStore";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineCompareArrows } from "react-icons/md";
import { fetchDataFromApi } from "../../utils/api";

// Import Swiper and its components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import Review from "../../Components/Review";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { MyContext } from "../../App";

const ProductDetails = () => {
  const { id } = useParams();
  const { client } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productRating, setProductRating] = useState(0);  // New state for rating

  let [productQuantity, setProductQuantity] = useState();

  let cartFields = {};

  const context = useContext(MyContext);

  // Fetch product details and rating
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await fetchDataFromApi(`/api/product/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await fetchDataFromApi(`/api/review?productId=${id}`);
      setProductRating(data.averageRating); // Set rating in local state
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      const fetchRelatedProducts = async () => {
        const related = await fetchDataFromApi(
          `/api/product/related?category=${product.category._id}&subcategory=${product.subCategory._id}`
        );
        setRelatedProducts(related);
        setLoading(false);
      };
      fetchRelatedProducts();
    }
  }, [product]);

  if (loading) {
    return <GradientCircularProgress />;
  }

  const discount = (
    (1 - product.price.$numberDecimal / product.oldPrice.$numberDecimal) * 100
  ).toFixed(2);

  const quantity = (val) => {
    setProductQuantity(val);
  }

  const addToCart = () => {
    cartFields.productTitle = product.name;
    cartFields.image = product.images[0].url;
    cartFields.price = product.price.$numberDecimal;
    cartFields.quantity = productQuantity;
    cartFields.subTotal = (product.price.$numberDecimal * productQuantity).toFixed(2);
    cartFields.productId = id;
    cartFields.clientId = client._id; // Update 'userId' to 'clientId' to match your schema

    context.addToCart(cartFields);
  };

  const addToWishList = () => {
    cartFields.productTitle = product.name;
    cartFields.image = product.images[0].url;
    cartFields.price = product.price.$numberDecimal;
    cartFields.productId = id;
    cartFields.clientId = client._id; // Update 'userId' to 'clientId' to match your schema

    context.addToWishList(cartFields);
  };


  const formatDescription = (description) => {
    const firstHyphenIndex = description.indexOf("-");
    if (firstHyphenIndex === -1) {
      return (
        <>
          <h3 className="text-xl font-bold tracking-widest mb-3">Description</h3>
          <p className="text-base leading-relaxed text-justify">
            {description}
          </p>
        </>
      );
    }

    const mainText = description.substring(0, firstHyphenIndex).trim();
    const splitInfo = description
      .substring(firstHyphenIndex)
      .split("-")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    return (
      <>
        <h3 className="text-xl font-bold tracking-widest mb-3">Description</h3>
        <p className="text-base leading-relaxed text-justify">{mainText}</p>
        <ul className="list-disc pl-5 mt-4">
          {splitInfo.map((item, index) => (
            <li key={index} className="text-base leading-relaxed">
              {item.replace(/[-]+/g, "").trim()}
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="container">
      <div className="flex flex-wrap items-start">
        <div className="w-full md:w-2/6">
          <ProductZoom images={product.images} />
        </div>

        <div className="w-full md:w-4/6 pl-16">
          <div className="mb-2">
            <h2 className="text-3xl font-bold mb-6">{product.name}</h2>
            <div><span className="font-bold">Product ID:</span> {id}</div>
            <div><span className="font-bold">Brand:</span> {product.brand}</div>
            <div><span className="font-bold">Category:</span> {`${product.category.name} [ ${product.category._id} ]`}</div>
            <div><span className="font-bold">Sub Category:</span> {`${product.subCategory.name} [ ${product.subCategory._id} ]`}</div>
          </div>
          <Rating
            name="Product Rating"
            value={Number(productRating)}
            readOnly
            size="small"
            precision={0.5}
          />

          <div className="mb-4">
            {discount !== "0.00" ? (
              <div className="flex items-end">
                <span className="text-2xl text-gray-400 line-through">
                  ${product.oldPrice.$numberDecimal}
                </span>
                <span className="text-4xl text-red-500 pl-3">
                  ${product.price.$numberDecimal}
                </span>
                <span className="text-lg bg-blue-500 text-white py-1 px-2 rounded-lg ml-4">
                  {`${discount}% OFF`}
                </span>
              </div>
            ) : (
              <span className="text-4xl text-red-500">
                ${product.price.$numberDecimal}
              </span>
            )}
          </div>

          {product.countInStock > 0 ? (
            <div className="inline-block text-green-600 bg-green-100 py-2 px-4 rounded-full">
              IN STOCK
            </div>
          ) : (
            <div className="inline-block text-red-600 bg-red-100 py-2 px-4 rounded-full">
              OUT OF STOCK
            </div>
          )}

          <div className="my-6">{formatDescription(product.description)}</div>

          <div className="flex items-center mb-4">
            <QuantityBox quantity={quantity} />
            <Button
              sx={{
                background: "#4123ab",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              className="ml-4 hover:bg-red-600"
              onClick={() => addToCart()}
            >
              {
                context.addingInCart === true ? <p className="text-white">Adding...</p> : <p className="text-white">Add to Cart</p>
              }

            </Button>
          </div>

          <div className="flex space-x-20 mb-10">
            <Button
              sx={{
                background: "#4123ab",
                borderRadius: "5px",
                padding: "10px 20px",
              }}
              className="hover:bg-red-600"
              variant="outlined"
              onClick={() => addToWishList()}
            >

              {
                context.addingInWishList === true ? <p className="text-white">Adding...</p> : <><IoIosHeartEmpty className="text-white mr-2" /> <p className="text-white">Add to WishList</p></>
              }
            </Button>

            <Button
              sx={{
                background: "#4123ab",
                borderRadius: "5px",
                padding: "10px 17px",
              }}
              className="hover:bg-red-600"
              variant="outlined"
            >
              <MdOutlineCompareArrows className="text-white" />
              <p className="text-white ml-2">Compare</p>
            </Button>
          </div>
        </div>

        {/* Review Section */}
        <Review />

        {/* Related Products Slider */}
        <div className="container mt-10 mb-20">
          <h3 className="text-xl font-bold mb-4">Related Products</h3>

          <Swiper
            spaceBetween={30}
            slidesPerView={4}
            navigation={true}
            slidesPerGroup={1}
            modules={[Navigation]}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="mySwiper2 px-4">
            {relatedProducts.relatedProducts?.length !== 0 ? (
              relatedProducts.relatedProducts.map((item, index) => (
                <SwiperSlide key={index}>
                  <ProductItem item={item} view={null} />
                </SwiperSlide>
              ))
            ) : (
              <div className="flex justify-center w-full">
                <p>No related products found</p>
              </div>
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
