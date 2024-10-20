const express = require('express');
const router = express.Router();
const { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth } = require('../controller/auth.controller.client'); 
const verifyToken = require('../middleware/verifyTokenClient'); 


router.post('/signup', signup);

router.post('/login', login);

router.post('/logout',logout);

router.post('/verify-email', verifyEmail);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.get('/check-auth', verifyToken, checkAuth);


module.exports = router;