const CommonInputValidator = require('../utils/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

//Ensures that all inputs relating to a Tax Bracket Creation attempt are valid
//(The IIE, 2026)
const CreateTaxBracketValidityChecks = (req, res, next) => {
    const { taxYear, minimumIncome, maximumIncome, taxRate, baseTax } = req.body;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)
    if((taxYear !== undefined) && !(inputValidator.CommonInputValidation(taxYear))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'
            
        });

    }     
    
    //Length Check
    if((taxYear !== undefined) && !(inputValidator.isValidString(taxYear))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Tax Year does not meet length Requirements)'
            
        });

    }
    //Number Type check
    if((minimumIncome !== undefined) && !(inputValidator.isValidNumber(minimumIncome, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    //Null check since it cmay be null if the user is creating a tax bracket that has no upper limit
    if((maximumIncome !== undefined) && (maximumIncome !== null) && !(inputValidator.isValidNumber(maximumIncome, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    if((taxRate !== undefined) && !(inputValidator.isValidNumber(taxRate, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    if((baseTax !== undefined) && !(inputValidator.isValidNumber(baseTax, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    console.log('Tax Bracket Creation attempt met the input requirements');
    next();

};

const FindTaxBracketValidityChecks = (req, res, next) => {
    const { taxYear, minimumIncome, maximumIncome, taxRate, baseTax } = req.query;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)
    if((taxYear !== undefined) && !(inputValidator.CommonInputValidation(taxYear))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'
            
        });

    }     
    
    //Length Check
    if((taxYear !== undefined) && !(inputValidator.isValidString(taxYear))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Tax Year does not meet length Requirements)'
            
        });

    }
    //Number Type check
    if((minimumIncome !== undefined) && !(inputValidator.isValidNumber(minimumIncome, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    if((maximumIncome !== undefined) && (maximumIncome !== null) && !(inputValidator.isValidNumber(maximumIncome, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    if((taxRate !== undefined) && !(inputValidator.isValidNumber(taxRate, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    if((baseTax !== undefined) && !(inputValidator.isValidNumber(baseTax, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    console.log('Tax Bracket Viewing attempt met the input requirements');
    next();

};

const UpdateTaxBracketChecks = (req, res, next) => {
    const { taxYear, minimumIncome, maximumIncome, taxRate, baseTax  } = req.body;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)
    if((taxYear !== undefined) && !(inputValidator.CommonInputValidation(taxYear))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'
            
        });

    }     
    
    //Length Check
    if((taxYear !== undefined) && !(inputValidator.isValidString(taxYear))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Tax Year does not meet length Requirements)'
            
        });

    }
    //Number Type check
    if((minimumIncome !== undefined) && !(inputValidator.isValidNumber(minimumIncome, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    if((maximumIncome !== undefined) && (maximumIncome !== null) && !(inputValidator.isValidNumber(maximumIncome, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    if((taxRate !== undefined) && !(inputValidator.isValidNumber(taxRate, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    if((baseTax !== undefined) && !(inputValidator.isValidNumber(baseTax, 0))){
        //(w3 Schools, s.a.)
        console.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Amount Input (Not a Number)'
            
        });

    }

    console.log('Tax Bracket Update attempt met the input requirements');
    next();

};

module.exports = { CreateTaxBracketValidityChecks, FindTaxBracketValidityChecks, UpdateTaxBracketChecks };

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/