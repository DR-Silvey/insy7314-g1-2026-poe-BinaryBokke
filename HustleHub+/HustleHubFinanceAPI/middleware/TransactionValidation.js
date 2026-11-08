const CommonInputValidator = require('../utils/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

//Ensures that all inputs relating to a Transaction attempt are valid
//(The IIE, 2026)
const CreateTransactionValidityChecks = (req, res, next) => {
    const { bookingID, gigID, usernamePerformer, amount } = req.body;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)
    if(!(inputValidator.CommonInputValidation(bookingID) &&inputValidator.CommonInputValidation(gigID) && inputValidator.CommonInputValidation(usernamePerformer))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'
            
        });

    }     
    
    //Length Check
    if(!(inputValidator.isValidString(gigID))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Gig ID does not meet length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(bookingID))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Booking ID does not meet length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(usernamePerformer))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Performer Username does not meet length Requirements)'
            
        });

    }

    //Number Type check
    if(!(inputValidator.isValidNumber(amount, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    console.log('Booking Creation attempt met the input requirements');
    next();

};

const FindTransactionValidityChecks = (req, res, next) => {
    const { transactionID, bookingID, gigID, usernamePerformer, usernameClient } = req.query;

    //Ensuring that all the user input is valid in terms of data type and is non malicious, validation should occur only on supplied filters
    //(w3 Schools, s.a.)
    if ((transactionID !== undefined) && !(inputValidator.CommonInputValidation(transactionID))) 
    {
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'

        });

    }

    if ((bookingID !== undefined) && !(inputValidator.CommonInputValidation(bookingID))) 
    {
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'

        });

    }

    if ((gigID !== undefined) && !(inputValidator.CommonInputValidation(gigID))) 
    {
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'

        });

    }

    if ((usernameClient !== undefined) && !(inputValidator.CommonInputValidation(usernameClient))) 
    {
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'

        });

    }

    if ((usernamePerformer !== undefined) && !(inputValidator.CommonInputValidation(usernamePerformer))) 
    {
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'

        });

    }

    //Length Check
    if ((transactionID !== undefined) && !(inputValidator.isValidString(transactionID))) 
    {
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Transaction ID does not meet length Requirements)'

        });

    }

    if ((bookingID !== undefined) && !(inputValidator.isValidString(bookingID))) 
    {
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Booking ID does not meet length Requirements)'

        });

    }

    if ((gigID !== undefined) && !(inputValidator.isValidString(gigID))) 
    {
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Gig ID does not meet length Requirements)'

        });

    }

    if ((usernameClient !== undefined) && !(inputValidator.isValidString(usernameClient))) 
    {
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Client Username does not meet length Requirements)'

        });

    }

    if ((usernamePerformer !== undefined) && !(inputValidator.isValidString(usernamePerformer))) 
    {
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Performer Username does not meet length Requirements)'

        });

    }

    console.log('Transaction Viewing attempt met the input requirements');
    next();

};

module.exports = { CreateTransactionValidityChecks, FindTransactionValidityChecks };

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/