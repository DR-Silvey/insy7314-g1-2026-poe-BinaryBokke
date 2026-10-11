const express = require('express');
const router = express.Router();

const RegistrationValidityChecks = require('../middleware/RegistrationValidation');
const RegisterUser = require('../controllers/Registration');
const UpdateUserInfo = require('../controllers/userInfo/UpdateUserInfo');
const UpdateUserRole = require('../controllers/userInfo/UpdateUserRole');

//RBAC enforcement
const AuthMiddleware = require('../middleware/tokens/AuthMiddleware');

//Rate Limiting
const { RegistrationLimiter } = require('../middleware/rateLimiting/AuthRateLimiter')

//base verb sets /register as endpoint to access registration
//(The IIE, 2026)
router.post('/register', RegistrationLimiter, RegistrationValidityChecks, RegisterUser);

//verb to patch the user's stored info to change their credentials
router.patch('/register/:username', RegistrationLimiter, AuthMiddleware.protect, AuthMiddleware.authorizeRoles('admin'), RegistrationValidityChecks, UpdateUserInfo);

//verb to patch the user's stored info to change their role
router.patch('/register/:username/role', RegistrationLimiter, AuthMiddleware.protect, AuthMiddleware.authorizeRoles('admin'), RegistrationValidityChecks, UpdateUserRole);

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