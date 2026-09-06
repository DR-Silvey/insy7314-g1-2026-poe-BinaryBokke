//This class is responsible for checking if password meet the disgnated requirements before encryption
//Checks for
    //Password length (min 12 chars)
    //Password complexity (must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character)
    //Can't be in the common passwords list (see CommonPasswords.js)
    //Shows a basi password strength (weak, medium, strong) based on length

//Checked for in CommonInputValidator before this class is called
    //Password can't contain any SQL injection attempts (e.g. ' or 1=1 --)
    //Password can't contain spaces

class PasswordHandler {
    //Check for password length
    ValidLength(password) {
        //Password has to be at least 12 characters long
        if(password.length <= 12) {
            return false;

        }

    }

    //Check for password complexity
    ValidComplexity(password) {
        //Password must contain at least 
            //1 uppercase letter
            //1 lowercase letter
            //1 number
            //1 special character (discluding space chars)

        //Regex pattern to check for password complexity (contains the above metnioned requirements)
        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if((!complexityRegex.test(password))) {
            return false;
        
        }
        
        return true;

    }

    //Check if the password is in the common passwords list (see CommonPasswords.js)
    PasswordNotCommon(password) {
        try{
            //Import the CommonPasswords class
            const CommonPasswords = require('./CommonPasswords.js');
            const commonPasswords = new CommonPasswords();

            //Check if the password is in the common passwords list
            if(commonPasswords.IsCommonPassword(password)) {
                return false;   

            }

        }catch(error) {
            //If we could not import the CommonPasswords class
                //Log the error
                //Fallback to a basic list of 10 common passwords (see below) that still meet the outlined requirements
            
            //Logging the error
            console.error('Error importing CommonPasswords class:', error);

            //Fallback to a basic list of common passwords (see below) that still meet the outlined requirements (assumed list of common passwords as I could not find a list of common passwords that would meet our outlined requirements)
            const fallbackCommonPasswords = [
                'Password123!',
                'P@ssword123',
                'Passw0rd123!',
                'Password#123',
                'Password@123'

            ];

            if(fallbackCommonPasswords.includes(password)) {
                return false;

            }

        }

        return true;

    }

    //Multi method method to check if the password meets all the requirements
    ValidPassword(password) {
        if(!this.ValidLength(password)) {
            return false;
        
        }   

        if(!this.ValidComplexity(password)) {
            return false;

        }

        if(!this.PasswordNotCommon(password)) {
            return false;
            
        }

        return true;

    }

    //Check for password length and assume extra complexity each 4 chars added (weak, medium, strong)
    PasswordStrength(password) {
        const length = password.length;

        if(length < 12) {
            return 'weak';

        } else if(length < 16) {
            return 'medium';

        } 
        else 
        {
            return 'strong';

        }

    }

}