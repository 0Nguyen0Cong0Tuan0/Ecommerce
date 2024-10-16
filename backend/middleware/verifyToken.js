// Check for the token if it is valid or not

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
// Once we call the next function [ next() ], it is going to call the next function [checkAuth]
// That's all we do once we hit the path  -> it's going to run this verifyToken and inside it, it will call the next function [ next() ] => it will call the [checkAuth] function.
    const token = req.cookies.token; // Use req.cookies instead of req.cookie
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - no token provided' });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(401).json({ success: false, message: 'Unauthorized - invalid token' });
        }

        req.userID = decode.userID;
        console.log('Decoded userId:', decode.userID); // Add this line
        next();

    } catch (error) {
        console.log('Error in verifyToken', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = verifyToken;