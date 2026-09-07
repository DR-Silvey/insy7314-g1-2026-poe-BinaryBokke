const express = require('express');
const router = express.Router();

const RegistrationValidityChecks = require('../middleware/RegistrationValidation');
const RegisterUser = require('../controllers/Registration');
const UpdateUserInfo = require('../controllers/userInfo/UpdateUserInfo');
const UpdateUserRole = require('../controllers/userInfo/UpdateUserRole');
const TokenCreation = require('../utils/tokens/TokenCreation')
const AdminRoleCheck = require('../middleware/roleChecks/AdminRoleCheck')

//base verb
router.post('/register', RegistrationValidityChecks, RegisterUser);

//verb to patch the user's stored info to change their credentials
router.patch('/register/:username', TokenCreation, AdminRoleCheck, RegistrationValidityChecks, UpdateUserInfo);

//verb to patch the user's stored info to change their role
router.patch('/register/:username/role', TokenCreation, AdminRoleCheck, RegistrationValidityChecks, UpdateUserRole);

module.exports = router;