const express = require('express');
const router = express.Router();

const LogInValidityChecks = require('../middleware/LogInValidation');
const LogIn = require('../controllers/LogIn');

router.post('/login', LogInValidityChecks, LogIn);

module.exports = router;