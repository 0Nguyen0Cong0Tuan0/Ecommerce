// EXPRESS
const express = require('express');
const router = express.Router();

// MODELS
const Order = require('../models/order.model');
const Cart = require('../models/cart');

router.post('/placeOrder', async (req, res) => {
    const { paymentMethod, shippingMethod, shippingFee, vat, total, clientInfo, paymentDetails } = req.body;

    try {
        const clientID = clientInfo.clientId;
        if (!clientID) {
            return res.status(400).json({ success: false, message: "Client ID is required" });
        }

        // Fetch the cart items for the client
        const cartItems = await Cart.find({ 'clientId': clientID });

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ success: false, message: "No cart data found" });
        }

        // Calculate subtotal from cart items
        const subtotal = cartItems.reduce((acc, item) => {
            const subTotalValue = item.subTotal?.$numberDecimal || item.subTotal || 0;
            return acc + Number(subTotalValue);
        }, 0);

        // Remove clientId from clientInfo before saving to order
        const { clientId, ...restOfClientInfo } = clientInfo;

        // Prepare order data
        const orderData = {
            clientId,
            clientInfo: restOfClientInfo,
            paymentMethod,
            shippingMethod,
            shippingFee,
            subtotal,
            vat,
            total,
            cartItems,
            paymentInfo: paymentDetails,
        };

        // Create and save new order
        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();
        console.log("Order saved successfully:", savedOrder); // Log saved item for debugging

        // Clear the cart after placing the order
        await Cart.deleteMany({ clientId });

        // Only return response after deleting the cart
        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: savedOrder,
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
