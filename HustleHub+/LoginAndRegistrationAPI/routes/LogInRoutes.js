const express = require('express');
const router = express.Router();

const { LogInValidityChecks, ResetPasswordValidityChecks, ForgotPasswordValidityChecks } = require('./../middleware/LogInValidation');
const LogIn = require('./../controllers/LogIn');
const GetProfile = require('./../controllers/userInfo/GetProfile')
const VerifyLoginOtp = require('./../controllers/userVerification/VerifyLoginOtp');
const ClassifyDevice = require('./../controllers/userVerification/ClassifyDevice');
const ForgotPassword = require('./../controllers/passwords/ForgotPassword');
const ResetPassword = require('./../controllers/passwords/ResetPassword');
const ResendLoginOtp = require('./../controllers/userVerification/ResendLoginOtp');

//Rate Limiting
const { LogInLimiter, ProfileInfoLimiter, OtpLimiter, ClassifyDeviceLimiter, ForgotPasswordLimiter, ResetPasswordLimiter } = require('./../middleware/rateLimiting/AuthRateLimiter');

//RBAC enforcement
const { protect } = require('./../middleware/tokens/AuthMiddleware');

//Declared /login as the endpoint to access login fucntionalities
//(The IIE, 2026)

//Used to log a user in based on entered username and password, creates JWT
router.post('/login', LogInLimiter, LogInValidityChecks, LogIn);

//Used to retrieve the details of a profile
router.get('/me', ProfileInfoLimiter, protect, GetProfile)

//Used to verify an otp during Login
router.post('/verify-login-otp', OtpLimiter, VerifyLoginOtp);

//Used to classify a device after login
router.post('/classify-device', ClassifyDeviceLimiter, ClassifyDevice);

//Used by a user to request a password reset after they have forgotten it
router.post('/forgot-password', ForgotPasswordLimiter, ForgotPasswordValidityChecks, ForgotPassword);

//Used to reset a user's password after they have forgotten it.
router.post('/reset-password', ResetPasswordLimiter, ResetPasswordValidityChecks, ResetPassword)

//Route to resend the LogIn OTP
router.post('/resend-login-otp', OtpLimiter, ResendLoginOtp);

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