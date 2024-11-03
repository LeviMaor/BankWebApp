const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

// Limit to 3 signup attempts per IP per hour
const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 signup requests per hour
    message: {
        message: 'Too many signup attempts from this IP, please try again after an hour.',
    },
    handler: (req, res, next, options) => {
        logEvents(
            `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
            'errLog.log'
        );
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = signupLimiter;
