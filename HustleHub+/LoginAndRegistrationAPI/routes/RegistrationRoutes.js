const express = require('express');
const router = express.Router();

const RegistrationValidityChecks = require('../middleware/RegistrationValidation');
const RegisterUser = require('../controllers/Registration');
const UpdateUserInfo = require('../controllers/userInfo/UpdateUserInfo');
const UpdateUserRole = require('../controllers/userInfo/UpdateUserRole');
const AdminRoleCheck = require('../middleware/roleChecks/AdminRoleCheck');
const AuthMiddleware = require('../middleware/tokens/AuthMiddleware');

//base verb
router.post('/register', RegistrationValidityChecks, RegisterUser);

//verb to patch the user's stored info to change their credentials
router.patch('/register/:username', AuthMiddleware.protect, AuthMiddleware.authorizeRoles('ADMIN'), RegistrationValidityChecks, UpdateUserInfo);

//verb to patch the user's stored info to change their role
router.patch('/register/:username/role', AuthMiddleware.protect, AuthMiddleware.authorizeRoles('ADMIN'), RegistrationValidityChecks, UpdateUserRole);

module.exports = router;