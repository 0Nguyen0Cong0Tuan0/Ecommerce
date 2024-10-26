import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { fetchDataFromApi } from "../../utils/api";
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { FaStar } from "react-icons/fa";

import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import SortFilter from "../../Components/SortFilter";
import GradientCircularProgress from "../../Components/Loading";



// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const ProductReviews = () => {
  const { id } = useParams();
  // const { client } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Start with true

  const [reviewsData, setReviewsData] = useState(null); // Initialize with null to check if data has been fetched
  const [selectedRatings, setSelectedRatings] = useState([]); // To track selected ratings
  const [sortBy, setSortBy] = useState(''); // Track sorting option

  const context = useContext(MyContext);

  // Fetch product details
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const data = await fetchDataFromApi(`/api/product/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (product) {
          const data = await fetchDataFromApi(`/api/review?productId=${id}&page=${context.pageReview}&limit=${context.itemsPerPageReview}&rating=${selectedRatings}&sortBy=${sortBy}`);
          console.log(`Fetch the review from: /api/review?productId=${id}&page=${context.pageReview}&limit=${context.itemsPerPageReview}&rating=${selectedRatings}&sortBy=${sortBy}`);
          setReviewsData(data); // Set the fetched reviews data
          setLoading(false); // Set loading to false once the reviews have been fetched
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false); // In case of error, stop loading
      }
    };
    fetchReviews();
  }, [
    product,
    id,
    selectedRatings,
    sortBy,
    context.pageReview,
    context.itemsPerPageReview,
  ]);

  const renderRatingCheckboxes = () => (
    <div className="mt-[30px] flex flex-row items-start">
      {[5, 4, 3, 2, 1].map((rating) => (
        <FormControlLabel
          key={rating}
          control={
            <Checkbox
              checked={selectedRatings.includes(rating)}
              onChange={() => handleRatingChange(rating)}
              icon={
                <span className="flex items-center justify-center w-[60px] h-[40px] border-2 border-gray-400 rounded-lg">
                  {rating} <FaStar className="ml-2" />
                </span>
              }
              checkedIcon={
                <span className="flex items-center justify-center w-[60px] h-[40px] bg-blue-500 text-white border-2 border-blue-500 rounded-lg">
                  {rating} <FaStar className="ml-2" />
                </span>
              }
            />
          }
          label=""
        />
      ))}
    </div>
  );
  // LinearProgress with label
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
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: '#3f51b5',
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

  const handleChangePage = (event, value) => {
    context.setPageReview(value);
    context.setIsLoading(true); // Optionally set loading to true if you want to show a loading state
  };

  // Check for loading state
  if (loading) {
    return <GradientCircularProgress />;
  }


  // Handle checkbox selection
  const handleRatingChange = (rating) => {
    if (selectedRatings.includes(rating)) {
      // Remove rating if it's already selected
      setSelectedRatings(selectedRatings.filter((r) => r !== rating));
    } else {
      // Add rating to selectedRatings array
      setSelectedRatings([...selectedRatings, rating]);
    }
  };

  // Return JSX after loading
  return (
    <div className="container mb-[100px]">
      <div className="w-full bg-slate-200 shadow-md p-6 rounded-xl flex items-center gap-4 mb-6">
        <div className="w-20 h-20 overflow-hidden rounded-lg bg-white">
          <img src={product.images[0].url} alt="product" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col ml-3">
          <p className="text-gray-500 text-sm">You are viewing</p>
          <Link
            to={`/product/${id}`}
            className="text-xl font-semibold text-gray-800 no-underline hover:text-indigo-600 hover:no-underline hover:scale-105 transition-all duration-300"
          >
            <h3>{product.name}</h3>
          </Link>
        </div>
      </div>


      <div className='w-full bg-slate-200 shadow-md p-5 rounded-xl'>
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
                        <span className="text-6xl font-bold text-indigo-600">{reviewsData.averageRating === 0 ? '0' : reviewsData.averageRating}</span>
                        <span className="text-2xl text-gray-500">{`out of 5`}</span>
                      </div>
                      <div className="flex items-center space-x-3 mb-4">
                        <Rating value={reviewsData.averageRating} precision={0.5} readOnly size="large" />
                        <span className="text-lg text-gray-700">
                          {reviewsData.totalReviews === 0 ? `0 review` : (reviewsData.totalReviews > 1 ? `${reviewsData.totalReviews} reviews` : `${reviewsData.totalReviews} review`)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Right: Breakdown of Ratings */}
                  <div className="flex flex-col w-2/3 space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-4">
                        <span className="w-12 text-lg font-medium">{`${rating} Stars`}</span>
                        <LinearProgressWithLabel
                          value={((reviewsData.ratingsCount[rating] / reviewsData.totalReviews) * 100).toFixed(2) === 'NaN' ? '0' : ((reviewsData.ratingsCount[rating] / reviewsData.totalReviews) * 100).toFixed(2)}
                        />
                        <span className="w-10 text-right text-gray-600 mb-4">{reviewsData.ratingsCount[rating]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center mb-4">
                  {renderRatingCheckboxes()} {/* Rating checkboxes */}
                  <SortFilter sortBy={sortBy} setSortBy={setSortBy} /> {/* Sort filter */}
                </div>
              </div>
            )}
          </div>

          {reviewsData.totalReviews > 0 ? (
            reviewsData.reviews.map((review, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm">
                <Rating value={review.customerRating} readOnly size="small" />
                <p className="mt-2">{review.review}</p>
                <small className="text-gray-500">Reviewed by {review.customerName}</small>
                <small className="text-gray-500 ml-3">Created at {new Date(review.createdAt).toLocaleDateString()}</small>
                {review.createdAt !== review.updatedAt && (
                  <small className="text-gray-500 ml-3">Updated at {new Date(review.updatedAt).toLocaleDateString()}</small>
                )}
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this product!</p>
          )}

          {reviewsData?.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                count={reviewsData?.totalPages}
                page={context.pageReview}
                onChange={handleChangePage}
                color="primary"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
