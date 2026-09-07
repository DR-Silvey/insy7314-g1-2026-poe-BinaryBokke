//Loading required utils
const CommonInputValidator = require('../utils/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

const PasswordHandler = require('../utils/passwords/PasswordHandler');
const passwordHandler = new PasswordHandler();

//Esnures that all input realting to a Registration attempt is valid
//(The IIE, 2026)
const RegistrationValidityChecks = (req, res, next) => {
    const { username, password, fullname, email, age } = req.body;

    console.log(req.body);

    //Ensuring that all the user input is valid in terms of data type and is non malicious
        if(!(inputValidator.IsValidUsername(username))){
            //(w3 Schools, s.a.)
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

        if(!(inputValidator.IsValidEmail(email))){
            console.error('User attempted to enter an email that does not meet the predefined citeria');
            return res.status(400).json({
                error: 'Email is incorrect (has to be string and include an @ symbol)'
            
            });

        }

        if(!(inputValidator.IsValidFullname(fullname))){
            console.error('User attempted to enter a fullname that does not meet the predefined citeria');
            return res.status(400).json({
                error: 'Fullname is incorrect (has to be string)'
            
            });

        }

        //(w3 Schools, s.a.)
        if(!(inputValidator.IsValidAge(age))){
            console.error('User attempted to enter an age that does not meet the predefined citeria');
            return res.status(400).json({
                error: 'Age is incorrect (has to be an int between 16 and 120)'
            
            });

        }

    //Ensuring that all the chosen password meets all criteria (length, complexity, commonality)
    if(!(passwordHandler.ValidPassword(password))){
        console.error('User attempted to enter a password that does not meet the predefined complexity citeria');
        return res.status(400).json({
            error: 'Password does not meet the complexity requirements (length, complexity, commonality).'
        
        });

    }

    console.log('Registration attempt met the input requirements');
    next();

};

module.exports = RegistrationValidityChecks;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/