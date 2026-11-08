const express = require('express');
const router = express.Router();

//RBAC enforcement
const { protect, authorizeRoles } = require('../middleware/auth/AuthMiddleware');

//Rate Limiting
const { CreateTaxBracketLimiter, ViewTaxBracketLimiter, UpdateTaxBracketLimiter } = require('../middleware/rateLimiting/TaxBracketRateLimiter')

const TaxBracketValidityChecks = require('../middleware/TaxBracketValidation');
const TaxBracket = require('../controllers/TaxBracketController');

//Declared /tax-brackets as the endpoint to access tax bracket functionalities
//(The IIE, 2026)

//Route used to create a tax bracket within the db
router.post('/tax-brackets', CreateTaxBracketLimiter, protect, authorizeRoles('admin'), TaxBracketValidityChecks.CreateTaxBracketValidityChecks, TaxBracket.CreateTaxBracket);

//Route used to view a tax bracket(s) within the db
router.get('/tax-brackets', ViewTaxBracketLimiter, protect, authorizeRoles('admin'), TaxBracketValidityChecks.FindTaxBracketValidityChecks, TaxBracket.FindTaxBracket);

//Route used to update a tax bracket within the db
router.put('/tax-brackets/:id', UpdateTaxBracketLimiter, protect, authorizeRoles('admin'), TaxBracketValidityChecks.UpdateTaxBracketChecks, TaxBracket.UpdateTaxBracket);

module.exports = router;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 8 November 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 8 November 2026]. 

*/