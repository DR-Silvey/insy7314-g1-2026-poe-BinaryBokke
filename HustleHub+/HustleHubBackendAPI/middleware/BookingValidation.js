const CommonInputValidator = require('../utils/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

//Ensures that all inputs relating to a Booking attempt are valid
//(The IIE, 2026)
const CreateBookingValidityChecks = (req, res, next) => {
    const { gigID, usernamePerformer, eventName, capacity, numOfHours, dateTimeToPerform, venue, paymentReceived  } = req.body;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)
    if(!(inputValidator.CommonInputValidation(gigID) && inputValidator.CommonInputValidation(usernamePerformer) && inputValidator.CommonInputValidation(eventName) && inputValidator.CommonInputValidation(venue))){
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

    if(!(inputValidator.isValidString(usernamePerformer))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Performer Username does not meet length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(eventName))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Event Name does not meet length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(venue))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Venue Name does not meet length Requirements)'
            
        });

    }

    //Number Type check
    if(!(inputValidator.isValidNumber(capacity, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Capacity Input (Not a Number)'
            
        });

    }

    if(!(inputValidator.isValidNumber(numOfHours, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Event Duration Input (Not a Number)'
            
        });

    }

    if(!(inputValidator.isValidNumber(paymentReceived, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Payment Received Input (Not a Number)'
            
        });

    }

    //DateTime check
     if(!(inputValidator.isValidDateTime(dateTimeToPerform))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Performance Date Input (Not a Date and Time)'
            
        });

    }

    console.log('Booking Creation attempt met the input requirements');
    next();

};

const FindBookingValidityChecks = (req, res, next) => {
    const { bookingID, gigID, usernameClient, usernamePerformer } = req.query;

    //Ensuring that all the user input is valid in terms of data type and is non malicious, validation should occur only on supplied filters
    //(w3 Schools, s.a.)
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

    console.log('Booking Viewing attempt met the input requirements');
    next();

};

const UpdateBookingValidityChecks = (req, res, next) => {
    const { usernameClient, gigID,  usernamePerformer, eventName, capacity, numOfHours, dateTimeToPerform, venue, paymentReceived  } = req.body;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)
    if(!(inputValidator.CommonInputValidation(gigID) && inputValidator.CommonInputValidation(usernameClient) && inputValidator.CommonInputValidation(usernamePerformer) && inputValidator.CommonInputValidation(eventName) && inputValidator.CommonInputValidation(venue))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'
            
        });

    }     
    
    //Length Check
    if(!(inputValidator.isValidString(usernameClient))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Client Username does not meet length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(gigID))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Gig ID does not meet length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(usernamePerformer))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Performer Username does not meet length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(eventName))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Event Name does not meet length Requirements)'
            
        });

    }

    if(!(inputValidator.isValidString(venue))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Venue Name does not meet length Requirements)'
            
        });

    }

    //Number Type check
    if(!(inputValidator.isValidNumber(capacity, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Capacity Input (Not a Number)'
            
        });

    }

    if(!(inputValidator.isValidNumber(numOfHours, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Event Duration Input (Not a Number)'
            
        });

    }

    if(!(inputValidator.isValidNumber(paymentReceived, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Payment Received Input (Not a Number)'
            
        });

    }

    //DateTime check
     if(!(inputValidator.isValidDateTime(dateTimeToPerform))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Performance Date Input (Not a Date and Time)'
            
        });

    }
        

    console.log('Booking Update attempt met the input requirements');
    next();

};

const RemoveBookingValidityChecks = (req, res, next) => {
    const { bookingID } = req.query;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)
    if(!(inputValidator.CommonInputValidation(bookingID))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'
            
        });

    }   
    
    //Input length check
    if(!(inputValidator.isValidString(bookingID))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Booking ID does not meet length Requirements)'
            
        });

    }

    console.log('Booking Removal attempt met the input requirements');
    next();

};

module.exports = { CreateBookingValidityChecks, FindBookingValidityChecks, UpdateBookingValidityChecks, RemoveBookingValidityChecks };

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/