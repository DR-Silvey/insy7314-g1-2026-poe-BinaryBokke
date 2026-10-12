const express = require('express');
const router = express.Router();

//RBAC enforcement
const { protect, authorizeRoles } = require('../middleware/auth/AuthMiddleware');

//Rate Limiting
const { CreateTransactionLimiter, ViewTransactionLimiter } = require('../middleware/rateLimiting/TransactionRateLimiter')

const TransactionValidityChecks = require('../middleware/TransactionValidation');
const Transaction = require('../controllers/TransactionController');

//Declared /transaction as the endpoint to access transaction functionalities
//(The IIE, 2026)

//Route used to find a tranmsaction(s) wihtin the db, only clients and admin can access this route
router.get('/transaction', ViewTransactionLimiter, TransactionValidityChecks.FindTransactionValidityChecks, Transaction.FindTransaction);

//Route used to create a transaction within the db
router.post('/transaction', CreateTransactionLimiter, protect, authorizeRoles('admin', 'client'), TransactionValidityChecks.CreateTransactionValidityChecks, Transaction.CreateTransaction);

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