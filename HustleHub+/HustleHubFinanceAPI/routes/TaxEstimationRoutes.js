const express = require('express');
const router = express.Router();

//RBAC enforcement
const { protect, authorizeRoles } = require('./../middleware/auth/AuthMiddleware');

//Rate Limiting
const { EstimateTaxLimiter, ViewTaxRecordLimiter } = require('./../middleware/rateLimiting/TaxEstimationLimiter')

const TaxEstimationValidityChecks = require('./../middleware/TaxEstimationValidation');
const TaxEstimation = require('./../controllers/TaxEstimationController');

//Declared /tax as the endpoint to access tax estimation functionalities
//(The IIE, 2026)

//Route used to view a tax record(s) within the db, only clients and admin can access this route
router.get('/tax-records', ViewTaxRecordLimiter, protect, authorizeRoles('freelancer'), TaxEstimationValidityChecks.FindTaxRecordValidityChecks, TaxEstimation.FindTaxRecord);

//Route used to estimate tax based on transaction amount
router.post('/tax-estimation', EstimateTaxLimiter, protect, authorizeRoles('freelancer'), TaxEstimation.EstimateTax);

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