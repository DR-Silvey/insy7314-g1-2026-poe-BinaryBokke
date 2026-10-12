const express = require('express');
const router = express.Router();

//RBAC enforcement
const { protect, authorizeRoles } = require('../middleware/auth/AuthMiddleware');

//Rate Limiting
const { CreateGigLimiter, ViewGigLimiter, UpdateGigLimiter, RemoveGigLimiter } = require('../middleware/rateLimiting/GigRateLimiter')

const GigValidityChecks = require('../middleware/GigValidation');
const Gig = require('../controllers/GigController');

//Declared /gig as the endpoint to access gig functionalities
//(The IIE, 2026)

//Route used to find a gig(s) wihtin the db, only freelancers and admin can access this role
router.get('/gig', ViewGigLimiter, GigValidityChecks.FindGigValidityChecks, Gig.FindGig);

//Route used to create agig within the db
router.post('/gig', CreateGigLimiter, protect, authorizeRoles('admin', 'freelancer'), GigValidityChecks.CreateGigValidityChecks, Gig.CreateGig);

//Route used to update a gig's info within the db, only freelancers and admin can access this role
router.put('/gig', UpdateGigLimiter, protect, authorizeRoles('admin', 'freelancer'), GigValidityChecks.UpdateGigValidityChecks, Gig.UpdateGig);

//Route used to delete a gig's info from the db, only freelancers and admin can access this role
router.delete('/gig', RemoveGigLimiter, protect, authorizeRoles('admin', 'freelancer'), GigValidityChecks.RemoveGigValidityChecks, Gig.RemoveGig);

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