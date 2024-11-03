const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');

const SECRET_ADMIN_KEY = process.env.ADMIN_TOKEN_SECRET;

const verificationCodes = new Map(); // Stores reset codes temporarily.

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Signup (with email verification)
const signup = asyncHandler(async (req, res) => {
    const { password } = req.body;
    let { email } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    email = email.toLowerCase();
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        balance: 1000,
    });

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    verificationCodes.set(email, { code: verificationCode, expires: Date.now() + 10 * 60 * 1000 }); // 10-minute expiry

    // Send verification email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${verificationCode}`,
    });

    res.status(201).json({ message: 'User created successfully, verification email sent', userId: newUser._id });
});

const signupWithoutCode = asyncHandler(async (req, res) => {
    const { password } = req.body;
    let { email } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    email = email.toLowerCase();
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        balance: 1000,
        isVerified: true
    });

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
});

// Verify email
const verifyEmail = asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    const record = verificationCodes.get(email);

    if (!record || record.code !== parseInt(code) || record.expires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    await User.updateOne({ email }, { isVerified: true });
    verificationCodes.delete(email); // Remove the code after use

    res.json({ message: 'Email verified successfully' });
});

const signupAdmin = asyncHandler(async (req, res) => {
    const { password } = req.body;
    let { email } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    email = email.toLowerCase();
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        roles: ['admin'],
        isVerified: true
    });

    res.status(201).json({ message: 'Admin created successfully', userId: newUser._id });
});

const signupAdminWithKey = asyncHandler(async (req, res) => {
    const { password, key } = req.body;
    let { email } = req.body;

    if (!email || !password || !key) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (key !== SECRET_ADMIN_KEY) {
        return res.status(403).json({ message: 'Invalid admin key' });
    }

    email = email.toLowerCase();
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        roles: ['admin'],
        isVerified: true
    });

    res.status(201).json({ message: 'Admin created successfully', userId: newUser._id });
});

const login = asyncHandler(async (req, res) => {
    const { password } = req.body;
    let { email } = req.body;

    email = email.toLowerCase();
    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = jwt.sign(
        { UserInfo: { email: user.email, roles: user.roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    res.status(200).json({
        message: 'User logged in successfully',
        userId: user._id,
        accessToken,
        roles: user.roles
    });
});

const logout = (req, res) => {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Logged out' });
};

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    verificationCodes.set(email, { code: resetCode, expires: Date.now() + 10 * 60 * 1000 }); // 10-minute expiry

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${resetCode}`,
    });

    res.json({ message: 'Reset code sent to your email' });
});

const verifyResetCode = asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    const record = verificationCodes.get(email);

    if (!record || record.code !== parseInt(code) || record.expires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired code' });
    }

    res.json({ message: 'Code verified successfully' });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, code, newPassword } = req.body;

    const record = verificationCodes.get(email);
    if (!record || record.code !== parseInt(code) || record.expires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    verificationCodes.delete(email); // Remove the code after use
    res.json({ message: 'Password reset successful' });
});

module.exports = {
    signup,
    signupWithoutCode,
    verifyEmail,
    signupAdmin,
    signupAdminWithKey,
    login,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword
};
