const rateLimit = require('express-rate-limit');

//If the user tries to create bookings more than 5 times in 15 min they are not permitted to attempt again (The IIE, 2026)
const CreateBookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Booking Creation attempts. Please try again later.'

    }

});

//If the user tries to view bookings more than 100 times in 15 min they are not permitted to attempt again (The IIE, 2026)
const ViewBookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Booking View attempts. Please try again later.'

    }

});

//If the user tries to update bookings more than 20 times in 15 min they are not permitted to attempt again (The IIE, 2026)
const UpdateBookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Booking Update attempts. Please try again later.'

    }

});

//If the user tries to delete bookings more than 10 times in 15 min they are not permitted to attempt again (The IIE, 2026)
const RemoveBookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Booking Removal attempts. Please try again later.'

    }

});

module.exports = { ViewBookingLimiter, CreateBookingLimiter, UpdateBookingLimiter, RemoveBookingLimiter };

/*

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 11 October 2026]. 

*/