import Pagination from '@mui/material/Pagination';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";

import { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from "../../store/authStore";
import { fetchDataFromApi, postData } from '../../utils/api';

import { MyContext } from "../../App";


const Review = () => {
    const [reviewsData, setReviewsData] = useState([]);
    const [reviewText, setReviewText] = useState(""); // User's comment
    const [reviewRating, setReviewRating] = useState(0); // User's star rating
    const [isShaking, setIsShaking] = useState(false);  // Animation control

    const { id } = useParams();
    const { client } = useAuthStore();
    const context = useContext(MyContext);
    const navigate = useNavigate();

    // Fetch reviews for the product
    useEffect(() => {
        const fetchReviews = async () => {
            const data = await fetchDataFromApi(`/api/review?productId=${id}&page=${context.pageReview}&limit=${context.itemsPerPageReview}`);
            console.log(`Fetch the review from: /api/review?productId=${id}&page=${context.pageReview}&limit=${context.itemsPerPageReview}`);
            setReviewsData(data);  // Set the fetched reviews data
            context.setAverageRating(data.averageRating);

        };
        fetchReviews();
    }, [
        id,
        context.pageReview,
        context.itemsPerPageReview
    ]);

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
            productId: id,
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
                const updatedReviews = await fetchDataFromApi(`/api/review?productId=${id}&page=${context.pageReview}&limit=${context.itemsPerPageReview}`);
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
                        <span>{Math.round(props.value)}%</span> {/* Remove the <p> tag */}
                    </Typography>
                </Box>
            </Box>
        );
    };

    const handleViewAllReview = () => {
        navigate(`/reviews/${id}`);
    }

    const handleChangePage = (event, value) => {
        context.setPageReview(value);

        context.setIsLoading(true); // Optionally set loading to true if you want to show a loading state
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

    return (
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
                                            <Rating value={Number(reviewsData.averageRating || 0)} precision={0.5} readOnly size="large" />
                                            <span className="text-lg text-gray-700">
                                                {reviewsData.totalReviews === 0 ? `0 review` : (reviewsData.totalReviews > 1 ? `${reviewsData.totalReviews} reviews` : `${reviewsData.totalReviews} review`)}
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
                                                value={((reviewsData?.ratingsCount?.[rating] || 0) / reviewsData.totalReviews * 100).toFixed(2) === 'NaN' ? 0 : Number(((reviewsData?.ratingsCount?.[rating] || 0) / reviewsData.totalReviews * 100).toFixed(2))}
                                            />
                                            <span className="w-10 text-right text-gray-600 mb-4">
                                                {reviewsData?.ratingsCount?.[rating] || 0}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}


                </div>

                {reviewsData.totalReviews > 0 ? (
                    reviewsData.reviews.map((review, index) => (
                        <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm">
                            <Rating value={Number(review.customerRating)} readOnly size="small" />
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
    )
}

export default Review;