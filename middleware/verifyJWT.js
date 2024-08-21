const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // If token is stored in cookies
    const cookieToken = req.cookies.jwt;

    // Use token from the cookie if it's available
    const validToken = token || cookieToken;

    if (!validToken) return res.sendStatus(401);

    jwt.verify(validToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);

        const user = await User.findOne({ email: decoded.UserInfo.email }).exec();
        if (!user) return res.sendStatus(401);

        req.user = user;
        next();
    });
});


module.exports = verifyJWT;
