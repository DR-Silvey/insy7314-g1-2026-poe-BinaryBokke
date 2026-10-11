const rateLimit = require('express-rate-limit');

//If the user tries to log in more than 5 times in 15 min they are not permitted to attempt again
const logInLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Log-In attempts. Please try again later.'

    }

});

//If the user tries to sign-up/register more than 5 times in 15 min they are not permitted to attempt again
const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Registration/Sign-Up attempts. Please try again later.'
        
    }

});

module.exports = { logInLimiter, registrationLimiter };