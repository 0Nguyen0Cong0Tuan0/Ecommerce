// EXPRESS
const express = require('express');
const router = express.Router();

// MODELS
const Wishlist = require('../models/wishlist');

router.get('/', async (req, res) => {
    try {
        // Assuming client ID is in req.user (after authentication) or passed as a query
        const clientId = req.user?._id || req.query.clientId;

        if (!clientId) {
            return res.status(400).json({ success: false, message: "Client ID is required" });
        }

        // Fetch wishlist for the specific client
        const myList = await Wishlist.find({ clientId });


        if (!myList) {
            return res.status(404).json({ success: false, message: "No wishlist data found" })
        }

        return res.status(200).json(myList);

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/add', async (req, res) => {
    const { productTitle, image, price, productId, clientId } = req.body;

    try {
        // Check if product already exists in the wishlist for the same client
        const wishListItem = await Wishlist.findOne({ productId, clientId });


        if (wishListItem) {
            // Product is already in the wishlist
            return res.status(409).json({ msg: 'Product already added in the wishlist' });
        }

        // Check if the image field is missing or empty
        if (!image || image.length === 0) {
            return res.status(400).json({ error: 'Image field is required.' });
        }

        // Create new wishlist item
        const newWishlist = new Wishlist({
            productTitle,
            image,
            price,
            productId,
            clientId
        });

        // Save to database
        const savedWishlist = await newWishlist.save();


        return res.status(201).json(savedWishlist);


    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const wishListItem = await Wishlist.findById(req.params.id);


    if (!wishListItem) {
        res.status(404).json({ message: 'The item given id is not found!' })
    }

    const deletedItem = await Wishlist.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            message: 'Wishlist item not found!',

            success: false,
        })
    }

    res.status(200).json({
        success: true,
        message: 'Wishlist Item Deleted',

    })
})

module.exports = router;