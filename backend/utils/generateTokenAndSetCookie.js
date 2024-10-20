const jwt = require('jsonwebtoken');

// Function to generate a token and set it in a cookie
const generateTokenAndSetCookie = (res, id, cookieName = "token") => {
    // Create the payload for the JWT based on the cookieName
    const payload = cookieName === 'token' ? { userID: id } : { clientID: id };

    // Sign the token with the payload, secret, and expiration
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });

    // Set the cookie with the generated token and secure options
    res.cookie(cookieName, token, {
        httpOnly: true, // Prevents access via JS, protects against XSS attacks
        secure: process.env.NODE_ENV === "production", // Secure in production (https)
        sameSite: "strict", // Prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return token;
}

module.exports = generateTokenAndSetCookie;
