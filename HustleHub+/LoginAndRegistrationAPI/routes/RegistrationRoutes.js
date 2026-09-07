const express = require('express');
const router = express.Router();

const RegistrationValidityChecks = require('../middleware/RegistrationValidation');
const RegisterUser = require('../controllers/Registration');
const UpdateUserInfo = require('../controllers/userInfo/UpdateUserInfo');
const UpdateUserRole = require('../controllers/userInfo/UpdateUserRole');
const AuthMiddleware = require('../middleware/tokens/AuthMiddleware');

console.log('protect:', typeof AuthMiddleware.protect);
console.log('authorizeRoles:', typeof AuthMiddleware.authorizeRoles);
console.log('RegistrationValidityChecks:', typeof RegistrationValidityChecks);
console.log('UpdateUserInfo:', typeof UpdateUserInfo);
console.log('UpdateUserRole:', typeof UpdateUserRole);

//base verb
router.post('/register', RegistrationValidityChecks, RegisterUser);

//verb to patch the user's stored info to change their credentials
router.patch('/register/:username', AuthMiddleware.protect, AuthMiddleware.authorizeRoles('ADMIN'), RegistrationValidityChecks, UpdateUserInfo);

//verb to patch the user's stored info to change their role
router.patch('/register/:username/role', AuthMiddleware.protect, AuthMiddleware.authorizeRoles('ADMIN'), RegistrationValidityChecks, UpdateUserRole);

module.exports = router;