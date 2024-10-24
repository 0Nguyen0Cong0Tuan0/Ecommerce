// EXPRESS
const express = require('express');
const router = express.Router();

// MODELS
const Cart = require('../models/cart');

router.get('/', async (req, res) => {
    try {
        const cartList = await Cart.find(req.query);

        if (!cartList) {
            res.status(500).json({ success: false })
        }

        return res.status(200).json(cartList);

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/add', async (req, res) => {
    const { productTitle, image, price, quantity, subTotal, productId, clientId } = req.body;

    try {
        // Check if product already exists in the cart for the same client
        const cartItem = await Cart.findOne({ productId, clientId });

        if (cartItem) {
            // Product is already in the cart
            return res.status(409).json({ msg: 'Product already added in the cart' });
        }

        // Check if the image field is missing or empty
        if (!image || image.length === 0) {
            return res.status(400).json({ error: 'Image field is required.' });
        }

        // Create new cart item
        const newCart = new Cart({
            productTitle,
            image,
            price,
            quantity,
            subTotal,
            productId,
            clientId
        });

        // Save to database
        const savedCart = await newCart.save();
        return res.status(201).json(savedCart);

    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/remove', async (req, res) => {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
        res.status(404).json({ error: 'The cart item given id is not found! ' });
    }

    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            error: 'Cart item not found!',
            success: false,
        })
    }

    res.status(200).json({
        success: true,
        message: 'Cart Item deleted',
    })
});

router.put('/:id', async (req, res) => {
    try {
        const cartList = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                productTitle: req.body.productTitle,
                image: req.body.image,  // Use req.body instead of res.body
                price: req.body.price,
                quantity: req.body.quantity,
                subTotal: req.body.subTotal,
                productId: req.body.productId,
                clientId: req.body.clientId,
            },
            { new: true }
        );

        if (!cartList) {
            return res.status(500).json({
                message: 'CartList cannot be updated',
                success: false,
            });
        }

        res.send(cartList);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating the cart',
            error: error.message,
            success: false,
        });
    }
});

router.delete('/:id', async (req, res) => {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
        res.status(404).json({ message: 'The cart item given id is not found!' })
    }

    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            message: 'Cart item not found!',
            success: false,
        })
    }

    res.status(200).json({
        success: true,
        message: 'Cart Item Deleted',
    })
})

module.exports = router;