const rateLimit = require('express-rate-limit');

//If the user tries to create gigs more than 5 times in 15 min they are not permitted to attempt again
const CreateGigLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Gig Creation attempts. Please try again later.'

    }

});

//If the user tries to view gigs more than 100 times in 15 min they are not permitted to attempt again
const ViewGigLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Gig View attempts. Please try again later.'

    }

});

//If the user tries to update gigs more than 20 times in 15 min they are not permitted to attempt again
const UpdateGigLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Gig Update attempts. Please try again later.'

    }

});

//If the user tries to delete gigs more than 10 times in 15 min they are not permitted to attempt again
const RemoveGigLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Gig Removal attempts. Please try again later.'

    }

});

module.exports = { ViewGigLimiter, CreateGigLimiter, UpdateGigLimiter, RemoveGigLimiter };