//This class is responsible for validating common input fields (username, password, email, fullname, age) before they are processed further in the application. 
//checks for
    //Input can't be undefined, null, empty, have to be string (except for age which has to be number)
    //Input can't contain space chars or any indication of SQL injection (e.g. ' or 1=1 --)
    //Check the length of a username (min 3 chars)

class CommonInputValidator {
    //Checks for undefined, null, empty, space chars, and SQL injection attempts (does not check for data types, except for undefined and null)
    //(w3 Schools, s.a.)
    CommonInputValidation(input) {
        //Input can't be undefined, null, empty
        //(w3 Schools, s.a.)
        if((input === undefined || input === null || input === '')) {
            console.error('An invalid input was entered (undefined, null or empty)');
            return false;
        }

        //String inputs can't contain space chars or any indication of SQL injection (e.g. ' or 1=1 --)
        //(w3 Schools, s.a.)
        if(typeof input === 'string'){
            if((input.includes(' ') || input.includes("'") || input.includes("--"))){
                console.error('An invalid input was entered (possible sql injection attempt)');
                return false;

            }
            
        }

        return true;

    }

    //Multi method checking for validity of username and password
    //(w3 Schools, s.a.)
    IsValidUsernameandPassword(username, password) {
        if((!this.IsValidUsername(username) || !this.IsValidPassword(password))) {    
            //Logged in their own methods 
            return false;

        }else{
            return true;
            
        }

    }

    //Check for common input validation, min length of 3 chars, string only
    //(w3 Schools, s.a.)
    IsValidUsername(username) {
        //Username has to meet the common input validation criteria
        if((!this.CommonInputValidation(username))) {
            console.error('Username did not meet common input validation criteria');
            return false;

        }

        //Username has to be string and > 3 chars
        if((typeof username !== 'string' || username.length < 3)) {
            console.error('Username is not string and shorter than 3 chars');
            return false;

        }

        return true;

    }

    //Check for common input validation, string only
    //(w3 Schools, s.a.)
    IsValidPassword(password) {
        //Password has to meet the common input validation criteria
        if((!this.CommonInputValidation(password))) {
            console.error('Password did not meet common input validation criteria');
            return false;
        
        }

        //Password has to be string
        if(typeof password !== 'string') {
            console.error('Password is not string');
            return false;

        }

        return true;
        
    }

    //Check for common input validation, string only
    //(w3 Schools, s.a.)
    IsValidEmail(email) {
        //Email has to meet the common input validation criteria
        if((!this.CommonInputValidation(email))) {
            console.error('Email did not meet common input validation criteria');
            return false;

        }

        //Email has to be string and contain an @
        if((typeof email !== 'string' && !email.includes("@"))) {
            console.error('Email is either not string or does not contain an @ syboml');
            return false;
        
        }

        return true;
    
    }

    //Check for common input validation, string only
    //(w3 Schools, s.a.)
    IsValidFullname(fullname) {
        //Fullname has to meet the common input validation criteria
        if((!this.CommonInputValidation(fullname))) {
            console.error('Fullname did not meet common input validation criteria');
            return false;
        
        }

        //Fullname has to be string
        if(typeof fullname !== 'string') {
            console.error('Fullname is not string');
            return false;

        }

        return true;

    }

    //Check for common input validation, less than 120, over 16, number only
    //(w3 Schools, s.a.)
    IsValidAge(age) {
        //Age has to meet the common input validation criteria
        if((!this.CommonInputValidation(age))) {
            console.error('Age did not meet common input validation criteria');
            return false;

        } 

        //Age has to be a number, under 120, more than 16, have to be number
        if((typeof age !== 'number'  || age >= 120 || age <= 16)) {
            console.error('Age is either not a number or is smaller than 16 or larger than 120');
            return false;
        
        }

        return true;

    }

}

module.exports = CommonInputValidator;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/