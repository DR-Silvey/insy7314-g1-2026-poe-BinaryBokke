const CommonInputValidator = require('../utils/inputs/CommonInputValidator');
const inputValidator = new CommonInputValidator();

const LogInValidityChecks = (req, res, next) => {
    const { username, password} = req.body;

    //Ensuring that all the user input is valid in terms of data type and is non malicious
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