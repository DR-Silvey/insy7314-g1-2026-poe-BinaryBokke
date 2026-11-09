const rateLimit = require('express-rate-limit');

//If the user tries to create tax brackets more than 5 times in 15 min they are not permitted to attempt again (The IIE, 2026)
const CreateTaxBracketLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Tax Bracket Creation attempts. Please try again later.'

    }

});

//If the user tries to view tax brackets more than 20 times in 15 min they are not permitted to attempt again (The IIE, 2026)
const ViewTaxBracketLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Tax Bracket View attempts. Please try again later.'

    }

});

//If the user tries to update tax brackets more than 2 times in 15 min they are not permitted to attempt again (The IIE, 2026)
const UpdateTaxBracketLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Tax Bracket Update attempts. Please try again later.'

    }

});

//If the user tries to delete tax brackets more than 2 times in 15 min they are not permitted to attempt again (The IIE, 2026)
const DeleteTaxBracketLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Tax Bracket Delete attempts. Please try again later.'

    }

});

module.exports = { CreateTaxBracketLimiter, ViewTaxBracketLimiter, UpdateTaxBracketLimiter, DeleteTaxBracketLimiter };

/*

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 8 November 2026]. 

*/