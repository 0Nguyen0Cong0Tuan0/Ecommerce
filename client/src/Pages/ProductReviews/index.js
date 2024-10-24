import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import QuantityBox from "../../Components/QuantityBox";
import ProductZoom from "../../Components/ProductZoom";
import ProductItem from "../../Components/ProductItem";
import useAuthStore from "../../store/authStore";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineCompareArrows } from "react-icons/md";
import { editData, fetchDataFromApi, postData } from "../../utils/api";

import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Import Swiper and its components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

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

  const [reviewsData, setReviewsData] = useState([]);
  const [reviewText, setReviewText] = useState(""); // User's comment
  const [reviewRating, setReviewRating] = useState(0); // User's star rating

  const [isShaking, setIsShaking] = useState(false);  // Animation control
  let [productQuantity, setProductQuantity] = useState();

  let cartFields = {};

  const context = useContext(MyContext);
  const navigate = useNavigate();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await fetchDataFromApi(`/api/product/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Check if reviewRating has changed
    if (reviewRating > 0) {
      // Trigger the animation on rating change
      setIsShaking(true);

      // Set a timer to keep the shaking animation for 1 second
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 1000); // Reset shaking after 1 second

      // Cleanup timer on unmount or when reviewRating changes
      return () => clearTimeout(timer);
    }
  }, [reviewRating]);

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      if (product) {
        const data = await fetchDataFromApi(`/api/review?productId=${product._id}`);
        console.log(`Fetch the review from: /api/review?productId=${product._id}`);
        setReviewsData(data);  // Set the fetched reviews data
      }
    };
    fetchReviews();
  }, [product]);

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
    return <div>Loading...</div>;
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
    cartFields.productId = product._id;
    cartFields.clientId = client._id; // Update 'userId' to 'clientId' to match your schema

    context.addToCart(cartFields);
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

  const getRatingText = (rating) => {
    switch (rating) {
      case 5:
        return { text: "Very Good", animation: "animate-shake", backgroundColor: 'bg-green-400', textColor: 'text-white' };
      case 4:
        return { text: "Good", animation: "animate-shake", backgroundColor: 'bg-green-300', textColor: 'text-zinc-900' };
      case 3:
        return { text: "Kinda", animation: "animate-shake", backgroundColor: 'bg-yellow-400', textColor: 'text-zinc-900' };
      case 2:
        return { text: "Bad", animation: "animate-shake", backgroundColor: 'bg-red-300', textColor: 'text-zinc-900' };
      case 1:
        return { text: "Too Bad", animation: "animate-shake", backgroundColor: 'bg-red-600', textColor: 'text-white' };
      default:
        return { text: "", animation: "" };
    }
  };

  const submitReview = async () => {
    if (!reviewText || reviewRating === 0) {
      alert("Please provide both a comment and a rating.");
      return;
    }

    const newReview = {
      customerId: client._id,
      customerName: client.name,
      review: reviewText,
      customerRating: reviewRating,
      productId: product._id,
    };

    // Log the review object to verify it's correctly populated
    console.log("Submitting review:", newReview);

    try {
      const response = await postData("/api/review/add", newReview, false);

      if (response.success) {
        alert("Review submitted!");
        setReviewText("");
        setReviewRating(0);
        // Fetch the updated reviews after submission
        const updatedReviews = await fetchDataFromApi(`/api/review?productId=${product._id}`);
        setReviewsData(updatedReviews);
      } else {
        alert("Error submitting review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const LinearProgressWithLabel = (props) => {
    return (
      <Box className="flex flex-col items-center" sx={{ width: '60%' }}>
        <Box className="w-full">
          <LinearProgress
            variant="determinate"
            {...props}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0', // background color of the track
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: '#3f51b5', // change to your preferred color
              },
            }}
          />
        </Box>
        <Box className="flex justify-between w-full mt-1">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <p>{`${Math.round(props.value)}%`}</p>
          </Typography>
        </Box>
      </Box>
    );
  };

  const handleViewAllReview = () => {
    navigate('/reviews');
  }

  return (
    <div className="container">
      <div className="flex flex-wrap items-start">
        <div className="w-full md:w-2/6">
          <ProductZoom images={product.images} />
        </div>

        <div className="w-full md:w-4/6 pl-16">
          <div className="mb-2">
            <h2 className="text-3xl font-bold mb-6">{product.name}</h2>
            <div><span className="font-bold">Product ID:</span> {product._id}</div>
            <div><span className="font-bold">Brand:</span> {product.brand}</div>
            <div><span className="font-bold">Category:</span> {`${product.category.name} [ ${product.category._id} ]`}</div>
            <div><span className="font-bold">Sub Category:</span> {`${product.subCategory.name} [ ${product.subCategory._id} ]`}</div>
          </div>
          <Rating
            name="Product Rating"
            value={5}
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
            >
              <IoIosHeartEmpty className="text-white" />
              <p className="text-white ml-2">Add to Wishlist</p>
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
        <div className='bg-slate-200 p-5 rounded-xl'>
          <div className="">
            <h3 className="text-xl font-bold mb-4">Rating Points & Customer Reviews</h3>
            <div className="mb-3">

              {reviewsData && (
                <div className="w-full p-6 bg-white shadow-lg rounded-lg">
                  <div className="flex flex-row justify-between space-x-8">

                    {/* Left: Rating Display */}
                    <div className="flex flex-col items-center justify-center w-1/3">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-6xl font-bold text-indigo-600">{reviewsData.averageRating}</span>
                          <span className="text-2xl text-gray-500">{`out of 5`}</span>
                        </div>
                        <div className="flex items-center space-x-3 mb-4">
                          <Rating value={reviewsData.averageRating} precision={0.5} readOnly size="large" />
                          <span className="text-lg text-gray-700">
                            {reviewsData.totalReviews > 1
                              ? `${reviewsData.totalReviews} reviews`
                              : `${reviewsData.totalReviews} review`}
                          </span>
                        </div>
                      </div>

                      {/* View All Reviews Button */}
                      <Button
                        sx={{
                          width: '150px',
                          background: '#4A56E2',
                          padding: '12px 24px',
                          borderRadius: '8px',
                        }}
                        className="hover:bg-indigo-700 text-white font-medium mt-6"
                        onClick={() => handleViewAllReview()}
                      >
                        <p>View All Reviews</p>
                      </Button>
                    </div>

                    {/* Right: Breakdown of Ratings */}
                    <div className="flex flex-col w-2/3 space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-4">
                          <span className="w-12 text-lg font-medium">{`${rating} Stars`}</span>
                          <LinearProgressWithLabel
                            value={((reviewsData.ratingsCount[rating] / reviewsData.totalReviews) * 100).toFixed(2)}
                          />
                          <span className="w-10 text-right text-gray-600 mb-4">{reviewsData.ratingsCount[rating]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}


            </div>

            {reviewsData.reviews.length > 0 ? (
              reviewsData.reviews.map((review, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm">
                  <Rating value={review.customerRating} readOnly size="small" />
                  <p className="mt-2">{review.review}</p>
                  <small className="text-gray-500">Reviewed by {review.customerName}</small>
                  <small className="text-gray-500 ml-3">Created at {new Date(review.createdAt).toLocaleDateString()}</small>
                  {
                    review.createdAt === review.updatedAt ? null : (
                      <small className="text-gray-500 ml-3">Updated at {new Date(review.updatedAt).toLocaleDateString()}</small>
                    )
                  }
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review this product!</p>
            )}
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold">Write a Review</h3>

            <div className="mb-4 flex justify-end items-center">
              {/* Add the shaking animation class dynamically based on the `isShaking` state */}
              {reviewRating > 0 && (
                <div className={`${getRatingText(reviewRating).backgroundColor} min-w-[120px] text-center border border-red-300 shadow-md p-2 rounded-lg mr-4`}>
                  <p
                    className={`${getRatingText(reviewRating).textColor} tracking-widest font-semibold text-lg ${isShaking ? getRatingText(reviewRating).animation : ""
                      }`}
                  >
                    {getRatingText(reviewRating).text}
                  </p>
                </div>
              )}


              <Rating
                name="user-rating"
                value={reviewRating}
                onChange={(event, newValue) => setReviewRating(newValue)}
                size="large"
              />
            </div>

            <textarea
              className="w-full p-3 border rounded mb-4"
              rows="5"
              cols="150"
              placeholder="Write your comment here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              sx={{
                background: "#4123ab",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              className="hover:bg-red-600 text-white"
              onClick={submitReview}
            >
              <p>Submit Review</p>
            </Button>
          </div>
        </div>

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
