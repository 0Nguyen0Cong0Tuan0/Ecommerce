const Reviews = require('../models/productReview.model');

const express = require('express');
const router = express.Router();

// Get the reviews by product IDs
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.limit) || 3; // Set a default limit
        const productId = req.query.productId; // Product ID to filter by
        const starRating = parseInt(req.query.rating); // Filter by star rating (1-5)
        const sortBy = req.query.sortBy || 'date-asc'; // Default sorting by date ascending

        // Initialize the filter object
        const filter = { productId };

        // Add star rating filter if specified
        if (starRating >= 1 && starRating <= 5) {
            filter.customerRating = starRating; // Filter for the specific star rating
        }

        // Determine sort order
        let sortQuery = {};
        if (sortBy === 'rating-asc') sortQuery = { customerRating: 1 };
        else if (sortBy === 'rating-desc') sortQuery = { customerRating: -1 };
        else if (sortBy === 'date-asc') sortQuery = { createdAt: 1 };
        else if (sortBy === 'date-desc') sortQuery = { createdAt: -1 };

        // Step 1: Fetch all reviews matching the filter (no pagination) for total stats
        const allReviews = await Reviews.find(filter).exec();

        // Initialize default values for total reviews, ratings count, and average rating
        let totalReviews = 0;
        const ratingsCount = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        };
        let totalRatingSum = 0;
        let averageRating = 0;

        // If there are reviews, process them
        if (allReviews && allReviews.length > 0) {
            totalReviews = allReviews.length;

            // Calculate total reviews and rating counts for all reviews
            allReviews.forEach(review => {
                const rating = review.customerRating;
                ratingsCount[rating] = (ratingsCount[rating] || 0) + 1;
                totalRatingSum += rating;
            });

            // Calculate the average rating for all reviews
            averageRating = totalRatingSum / totalReviews;
        }

        // Step 2: Fetch paginated reviews based on current page and limit
        const reviews = await Reviews.find(filter)
            .sort(sortQuery)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        // Step 3: Prepare the response data
        const responseData = {
            success: true,
            totalReviews: totalReviews, // Total reviews across all pages
            ratingsCount: ratingsCount, // Ratings count for all reviews
            averageRating: averageRating.toFixed(1), // Average rating across all reviews (rounded to one decimal)
            reviews: reviews, // Paginated reviews for current page
            currentPage: page,
            totalPages: Math.ceil(totalReviews / perPage), // Total pages for pagination
        };

        return res.status(200).json(responseData);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});



// Get the reviews by ID
router.get('/:id', async (req, res) => {
    const review = await Reviews.findById(req.params.id);

    if (!review) {
        return res.status(500).json({ message: 'The review with the given ID was not found ' })
    }

    return res.status(200).send(review);
})

router.post('/add', async (req, res) => {
    const { customerId, customerName, review, customerRating, productId } = req.body;
    
    // Log the received data
    console.log("Received data:", req.body);  // Add this line to log the body

    try {
        const reviewText = new Reviews({
            customerId,
            customerName,
            review,
            customerRating,
            productId,
        });

        const reviewSaved = await reviewText.save();
        res.status(201).json({success: true, reviewSaved});
    } catch (error) {
        console.error("Error saving review:", error);
        res.status(500).json({ success: false, message: "Failed to submit review" });
    }
});


module.exports = router;