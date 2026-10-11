const express = require('express');
const router = express.Router();

//RBAC enforcement
const { protect, authorizeRoles } = require('../middleware/auth/AuthMiddleware');

//Rate Limiting
const { CreateBookingLimiter, ViewBookingLimiter, UpdateBookingLimiter, RemoveBookingLimiter } = require('../middleware/rateLimiting/BookingRateLimiter')

const BookingValidityChecks = require('../middleware/BookingValidation');
const Booking = require('../controllers/BookingController');

//Declared /booking as the endpoint to access booking functionalities
//(The IIE, 2026)

//Route used to create a booking within the db
router.post('/booking', CreateBookingLimiter, BookingValidityChecks.CreateBookingValidityChecks, Booking.CreateBooking);

//Route used to find a booking(s) wihtin the db, only clients and admin can access this route
router.get('/booking', ViewBookingLimiter, protect, authorizeRoles('admin', 'client'), BookingValidityChecks.FindBookingValidityChecks, Booking.FindBooking);

//Route used to update a booking's info within the db, only clients and admin can access this route
router.put('/booking', UpdateBookingLimiter, protect, authorizeRoles('admin', 'client'), BookingValidityChecks.UpdateBookingValidityChecks, Booking.UpdateBooking);

//Route used to delete a booking's info from the db, only clients and admin can access this route
router.delete('/booking', RemoveBookingLimiter, protect, authorizeRoles('admin', 'client'), BookingValidityChecks.RemoveBookingValidityChecks, Booking.RemoveBooking);

module.exports = router;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/