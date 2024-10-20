const Client = require('../models/client.model'); 
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

        const clientAlreadyExists = await Client.findOne({ email });
        if(clientAlreadyExists) {
            return res.status(400).json({success: false, message: "Client already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        // 123456 -> $_121#%$^&()_123456

        const verificationToken = generateVerificationToken();

        const client = new Client ({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours -> 60 minutes per hour -> 60 seconds per minute -> 1000 1000 milliseconds per second -> 86,400,000 milliseconds (the total number of milliseconds in a day).
        })

        await client.save();

        // Now that, we just have the client -> we need to create a token and set a cookie
        // -> that is just going to say: "This client is just being authenticated"

        // It is time to authenticate them in the client by CREATING a token and after that, we will send a verification email with this token -> so that they can verify their accounts

        // jwt
        generateTokenAndSetCookie(res, client._id);

        // send verification email to client
        await sendVerificationEmail(client.email, client.name, verificationToken);

        res.status(201).json({
            success: true,
            message: 'Client created successfully',
            client: {
                ...client._doc,
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
        const client = await Client.findOne( {email} );
        if (!client) {
            return res.status(400).json( {success: false, message: 'Invalid credentials'} );
        }

        const isPasswordValid = await bcryptjs.compare(password, client.password);
        if (!isPasswordValid) {
            return res.status(400).json( {success: false, message: 'Invalid credentials'} );
        }

        generateTokenAndSetCookie(res, client._id, "clientToken"); // for clients

        client.lastLogin = Date.now();
        await client.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            client: {
                ...client._doc,
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
        const client = await Client.findOne( {
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() } // $ gt -> greater than 
        });

        if (!client) {
            return res.status(400).json({success: false, message: 'Invalid or expired verification code'});
        }

        client.isVerified = true;
        client.verificationToken = undefined;
        client.verificationTokenExpiresAt = undefined;
        await client.save();

        await sendWelcomeEmail(client.email, client.name);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            client: {
                ...client._doc,
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
        const client = await Client.findOne( {email} );
        if (!client) {
            res.status(400).json( {success: false, message: 'Client not found'});
        }

        // Generate reset password token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        client.resetPasswordToken = resetToken;
        client.resetPasswordExpiresAt = resetTokenExpiresAt;

        await client.save();

        // send email
        // The second argument: reset password URL 
        // port: 5173
        await sendPasswordResetEmail(client.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

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

        const client = await Client.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if(!client) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token '});
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        client.password = hashedPassword;
        client.resetPasswordToken = undefined;
        client.resetPasswordExpiresAt = undefined;

        await client.save();

        await sendResetSuccessEmail(client.email);

        res.status(200).json({ success: true, message: 'Password reset successful '});
    } catch(error) {
        console.log('Error in reset password ', error);
        res.status(400).json({ success: false, message: error.message });
    }
}

const checkAuth = async(req, res) => {
    try {
        const client = await Client.findById(req.clientID).select("-password");
        if (!client) {
            return res.status(400).json({ success: false, message: 'Client not found' });
        }

        res.status(200).json({ success: true, client });

    } catch(error) {
        console.log('Error in checkAuth ', error);
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth};