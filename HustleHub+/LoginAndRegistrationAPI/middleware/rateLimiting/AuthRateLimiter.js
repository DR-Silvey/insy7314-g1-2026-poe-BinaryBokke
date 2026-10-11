const rateLimit = require('express-rate-limit');

//If the user tries to log in more than 5 times in 15 min they are not permitted to attempt again
const LogInLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Log-In attempts. Please try again later.'

    }

});

//If the user tries to sign-up/register more than 5 times in 15 min they are not permitted to attempt again
const RegistrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Registration/Sign-Up attempts. Please try again later.'
        
    }

});

//If the user tries to retrieve the info of a profile more than 20 times in 15 min they are not permitted to attempt again
const ProfileInfoLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many Registration/Sign-Up attempts. Please try again later.'
        
    }

});

module.exports = { LogInLimiter, RegistrationLimiter, ProfileInfoLimiter };

/*

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 11 October 2026]. 

*/