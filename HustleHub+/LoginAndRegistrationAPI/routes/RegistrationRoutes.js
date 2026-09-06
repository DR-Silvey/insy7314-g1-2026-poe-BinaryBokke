const express = require('express');
const router = express.Router();

const RegistrationValidityChecks = require('../middleware/RegistrationValidation');
const RegisterUser = require('../controllers/Registration');

router.post('/register', RegistrationValidityChecks, RegisterUser);

module.exports = router;