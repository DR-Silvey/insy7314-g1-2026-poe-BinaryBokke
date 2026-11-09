const logger = require("./../utils/inputs/Logger");

const CommonInputValidator = require('./../utils/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

//No Inputs required for tax estimation

const FindTaxRecordValidityChecks = (req, res, next) => {
    const { taxID, taxYearStart, taxYearEnd, calculationDateStart, calculationDateEnd } = req.query;

    //Ensuring that all the user input is valid in terms of data type and is non malicious, validation should occur only on supplied filters
    //(w3 Schools, s.a.)
   if ((taxID !== undefined) && !(inputValidator.CommonInputValidation(taxID))) 
    {
        logger.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'

        });

    }

    if ((taxYearStart !== undefined) && !(inputValidator.CommonInputValidation(taxYearStart))) 
    {
        logger.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'

        });

    }

    if ((taxYearEnd !== undefined) && !(inputValidator.CommonInputValidation(taxYearEnd))) 
    {
        logger.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'

        });

    }

    if ((calculationDateStart !== undefined) && !(inputValidator.CommonInputValidation(calculationDateStart))) 
    {
        logger.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'  
        
        });
    
    }

    if ((calculationDateEnd !== undefined) && !(inputValidator.CommonInputValidation(calculationDateEnd))) 
    {
        logger.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Input (Does not meet common criteria)'
                
        });

    }

    if ((taxID !== undefined) && !(inputValidator.isValidString(taxID))) 
    {
        logger.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Tax ID does not meet length Requirements)'

        });

    }

    if ((taxYearStart !== undefined) && !(inputValidator.isValidString(taxYearStart))) 
    {
        logger.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Tax Year Start does not meet length Requirements)'

        });

    }

    if ((taxYearEnd !== undefined) && !(inputValidator.isValidString(taxYearEnd))) 
    {
        logger.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid String Input (Tax Year End does not meet length Requirements)'

        });     

    }

    if ((calculationDateStart !== undefined) && !(inputValidator.isDate(calculationDateStart))) 
    {
        logger.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Date Input (Calculation Date Start is not a valid date)'
                
        });

    }

    if ((calculationDateEnd !== undefined) && !(inputValidator.isDate(calculationDateEnd))) 
    {
        logger.error('User attempted an input that does not meet common criteria');
            return res.status(400).json({
                error: 'Invalid Date Input (Calculation Date End is not a valid date)'

        });

    }

    logger.log('Tax Record Viewing attempt met the input requirements');
    next();

};

module.exports = { FindTaxRecordValidityChecks };

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/