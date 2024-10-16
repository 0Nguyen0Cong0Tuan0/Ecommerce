const jwt = require('jsonwebtoken');

// This function will return a token where you call the 'sign' method
// and you're passing a payload that is user ready and we're using this userID so that when we decode the token we know which user has this token. 
// With the help of the userID, we can fetch the user profile from db
const generateTokenAndSetCookie = (res, userID) => {
    // The first argument -> it is the payload (userID)
    // The second argument -> it is the secret (process.env.JWT_SECRET)
    // The third argument -> option
    const token = jwt.sign( { userID }, process.env.JWT_SECRET, {
        expiresIn: '7d', // this token will be invalid after 7 days
    });

// Response.cookie(name: string, val: string, options: CookieOptions): this

// Set cookie name to val, with the given options.

// Options: --- to make this a bit more secure

// maxAge max-age in milliseconds, converted to expires
// signed sign the cookie
// path defaults to "/"
// Examples:

// "Remember Me" for 15 minutes res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });

// save as above res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
    res.cookie("token", token, {
        httpOnly: true, // means this can not be accessible via JS so only HTTP really ---> Cookie can not be accessed by client side js
                        // and this prevents an attack called XSS
        secure: process.env.NODE_ENV === "production", // True only if we are in the production
                                                       // in local host, we have http and in the production we'll have https (s stands for secure)
        sameSite: "strict", // also prevents an attack called CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return token;
}


module.exports = generateTokenAndSetCookie;