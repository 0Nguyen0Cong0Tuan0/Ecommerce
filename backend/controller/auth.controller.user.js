const User = require('../models/user.model'); 
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');

const generateVerificationToken = require('../utils/generateVerificationToken');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require('../mailtrap/emails');

const signup = async(req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        if(userAlreadyExists) {
            return res.status(400).json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        // 123456 -> $_121#%$^&()_123456

        const verificationToken = generateVerificationToken();

        const user = new User ({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours -> 60 minutes per hour -> 60 seconds per minute -> 1000 1000 milliseconds per second -> 86,400,000 milliseconds (the total number of milliseconds in a day).
        })

        await user.save();

        // Now that, we just have the user -> we need to create a token and set a cookie
        // -> that is just going to say: "This user is just being authenticated"

        // It is time to authenticate them in the client by CREATING a token and after that, we will send a verification email with this token -> so that they can verify their accounts

        // jwt
        generateTokenAndSetCookie(res, user._id);

        // send verification email to user
        await sendVerificationEmail(user.email, user.name, verificationToken);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }

}

const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne( {email} );
        if (!user) {
            return res.status(400).json( {success: false, message: 'Invalid credentials'} );
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json( {success: false, message: 'Invalid credentials'} );
        }

        generateTokenAndSetCookie(res, user._id); // for users

        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.log('Error in login ', error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

const logout = async(req, res) => {
    res.clearCookie("token");
    res.status(200).json( {success: true, message: "Logged out successfully"});
}

const verifyEmail = async(req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne( {
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() } // $ gt -> greater than 
        });

        if (!user) {
            return res.status(400).json({success: false, message: 'Invalid or expired verification code'});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log('Error in verify Email ', error);
        res.status(500).json( {success: false, message: 'Server error'} );
    }
}

const forgotPassword = async(req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne( {email} );
        if (!user) {
            res.status(400).json( {success: false, message: 'User not found'});
        }

        // Generate reset password token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        // The second argument: reset password URL 
        // port: 5173
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: 'Password reset link sent to your email' });

    } catch(error) {
        console.log('Error in forgotPassword', error);
        res.status(400).json({ success: false, message: error.message });
    }
}

const resetPassword = async(req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if(!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token '});
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: 'Password reset successful '});
    } catch(error) {
        console.log('Error in reset password ', error);
        res.status(400).json({ success: false, message: error.message });
    }
}

const checkAuth = async(req, res) => {
    try {
        const user = await User.findById(req.userID).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });

    } catch(error) {
        console.log('Error in checkAuth ', error);
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth};