const CommonInputValidator = require('../utils/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

//Ensures that all inputs relating to a LogIn attempt are valid
//(The IIE, 2026)
const LogInValidityChecks = (req, res, next) => {
    const { username, password} = req.body;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
    //(w3 Schools, s.a.)
        if(!(inputValidator.IsValidUsername(username))){
            console.error('User attempted to enter a username that does not meet the predefined citeria');
            return res.status(400).json({
                error: 'Username is incorrect (has to be string and atleast 3 characters long)'
            
            });

        }

        if(!(inputValidator.IsValidPassword(password))){
            console.error('User attempted to enter a password that does not meet the predefined citeria');
            return res.status(400).json({
                error: 'Password is incorrect (has to be string)'
            
            });

        }

    console.log('LogIn attempt met the input requirements');
    next();

};

module.exports = LogInValidityChecks;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/