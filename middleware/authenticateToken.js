const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const authenticateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.cookies.jwt;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);

        const user = await User.findOne({ email: decoded.UserInfo.email }).exec();
        if (!user) return res.sendStatus(401);

        req.user = user;
        next();
    });
});

module.exports = authenticateToken;
