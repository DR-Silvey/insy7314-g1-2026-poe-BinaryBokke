//This class is responsible for validating common input fields (username, password, email, fullname, age) before they are processed further in the application. 
//checks for
    //Input can't be undefined, null, empty, have to be string (except for age which has to be number)
    //Input can't contain space chars or any indication of SQL injection (e.g. ' or 1=1 --)
    //Check the length of a username (min 3 chars)

class CommonInputValidator {
    //Checks for undefined, null, empty, space chars, and SQL injection attempts (does not check for data types, except for undefined and null)
    CommonInputValidation(input) {
        //Input can't be undefined, null, empty
        if((input === undefined || input === null || input === '')) {
            return false;
        }

        //Input can't contain space chars or any indication of SQL injection (e.g. ' or 1=1 --)
        if((input.includes(' ') || input.includes("'") || input.includes("--"))){
            return false;

        }

        return true;

    }

    //Multi method checking for validity of username and password
    IsValidUsernameandPassword(username, password) {
        if((!this.IsValidUsername(username) || !this.IsValidPassword(password))) {      
            return false;

        }else{
            return true;
            
        }

    }

    //Check for common input validation, min length of 3 chars, string only
    IsValidUsername(username) {
        //Username has to meet the common input validation criteria
        if((!this.CommonInputValidation(username))) {
            return false;

        }

        //Username has to be stringm and > 3 chars
        if((typeof username !== 'string' || username.length < 3)) {
            return false;

        }

        return true;

    }

    //Check for common input validation, password handler validation, string only
    IsValidPassword(password) {
        //Password has to meet the common input validation criteria
        if((!this.CommonInputValidation(password))) {
            return false;
        
        }

        //Password has to be string
        if(typeof password !== 'string') {
            return false;

        }

        return true;
        
    }

    //Check for common input validation, string only
    IsValidEmail(email) {
        //Email has to meet the common input validation criteria
        if((!this.CommonInputValidation(email))) {
            return false;

        }

        //Email has to be string
        if(typeof email !== 'string') {
            return false;
        
        }

        return true;
    
    }

    //Check for common input validation, string only
    IsValidFullname(fullname) {
        //Fullname has to meet the common input validation criteria
        if((!this.CommonInputValidation(fullname))) {
            return false;
        
        }

        //Fullname has to be string
        if(typeof fullname !== 'string') {
            return false;

        }

        return true;

    }

    //Check for common input validation, over 120, less than 16, number only
    IsValidAge(age) {
        //Age has to meet the common input validation criteria
        if((CommonInputValidator.CommonInputValidation(age))) {
            return false;

        } 

        //Age has to be a number, under 120, more than 16, have to be number
        if((typeof age !== 'number'  || age >= 120 || age <= 16)) {
            return false;
        
        }

        return true;

    }

}

module.exports = CommonInputValidator;