const CommonInputValidator = require('../utils/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

//Ensures that all inputs relating to a Gig attempt are valid
//(The IIE, 2026)
const CreateGigValidityChecks = (req, res, next) => {
    const { gigType, description, stageName, costPerHour, isAvailable } = req.body;
    
    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)

    if(!(inputValidator.CommonInputValidation(gigType) && inputValidator.CommonInputValidation(description) && inputValidator.CommonInputValidation(stageName))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'
            
        });

    }
 
    //Length Checks
    if(!(inputValidator.isValidString(gigType))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Gig Type does not length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(stageName))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Stage Name does not length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(description))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Description does not length Requirements)'
            
        });

    }

    //Number Type check
    if(!(inputValidator.isValidNumber(costPerHour))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Cost Per Hour Input (Not a Number)'
            
        });

    }

    //Bool Type check
    if(!(inputValidator.isValidBool(isAvailable))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Availability Input (Not a True/False)'
            
        });

    }

    console.log('Gig attempt met the input requirements');
    next();

};

//(The IIE, 2026)
const FindGigValidityChecks = (req, res, next) => {
    const { gigID, usernamePerformer } = req.query;

    //Validation should occur only on supplied filters
    if ((gigID !== undefined) && !(inputValidator.CommonInputValidation(gigID))) 
    {
        return res.status(400).json({
            error: 'Invalid Gig ID'

        });

    }

    if ((usernamePerformer !== undefined) && !(inputValidator.CommonInputValidation(usernamePerformer))) 
    {
        return res.status(400).json({
            error: 'Invalid performer username'

        });

    }

    if ((gigID !== undefined) && !(inputValidator.isValidString(gigID))) 
    {
        return res.status(400).json({
            error: 'GigID must be a valid string'

        });

    }

    if ((usernamePerformer !== undefined) && !(inputValidator.isValidString(usernamePerformer))) 
    {
        return res.status(400).json({
            error: 'Performer username must be a valid string'

        });

    }

    console.log('Gig attempt met the input requirements');
    next();

};

//(The IIE, 2026)
const UpdateGigValidityChecks = (req, res, next) => {
    const { gigID, usernamePerformer, gigType, description, stageName, costPerHour, isAvailable } = req.body;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)

    if(!(inputValidator.CommonInputValidation(gigID) && inputValidator.CommonInputValidation(usernamePerformer) && inputValidator.CommonInputValidation(gigType) && inputValidator.CommonInputValidation(description) && inputValidator.CommonInputValidation(stageName))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'
            
        });

    }
 
    //Length Checks
    if(!(inputValidator.isValidString(gigID))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Gig ID not meet length requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(usernamePerformer))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Username of Performer does not meet length requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(gigType))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Gig Type does not length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(stageName))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Stage Name does not length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(description))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Description does not length Requirements)'
            
        });

    }

    //Number Type check
    if(!(inputValidator.isValidNumber(costPerHour))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Cost Per Hour Input (Not a Number)'
            
        });

    }

    //Bool Type check
    if(!(inputValidator.isValidBool(isAvailable))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Availability Input (Not a True/False)'
            
        });

    }

    console.log('Gig attempt met the input requirements');
    next();

};

//(The IIE, 2026)
const RemoveGigValidityChecks = (req, res, next) => {
    const { gigID } = req.body;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)

    if(!(inputValidator.CommonInputValidation(gigID))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'
            
        });

    }

    console.log('Gig attempt met the input requirements');
    next();

};

module.exports = { CreateGigValidityChecks, FindGigValidityChecks, UpdateGigValidityChecks, RemoveGigValidityChecks };

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/