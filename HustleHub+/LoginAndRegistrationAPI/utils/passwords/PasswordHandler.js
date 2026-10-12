//This class is responsible for checking if password meet the disgnated requirements before encryption
//Checks for
    //Password length (min 12 chars)
    //Password complexity (must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character)
    //Can't be in the common passwords list
    //Shows a basi password strength (weak, medium, strong) based on length

//Checked for in CommonInputValidator before this class is called
    //Password can't contain any SQL injection attempts (e.g. ' or 1=1 --)
    //Password can't contain spaces

class PasswordHandler {
    //Multi method method to check if the password meets all the requirements
    //(w3 Schools, s.a.)
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

        console.log('Password met minum complexity criteria (length, complexity, commonality)')
        return true;

    }
    
    //Check for password length
    ValidLength(password) {
        //Password has to be at least 12 characters long
        if(password.length <= 12) {
            console.error("Password was less than 12 chars");
            return false;

        }

        console.log('Password met length requirement');
        return true;

    }

    //Check for password complexity
    ValidComplexity(password) {
        //Password must contain at least 
            //1 uppercase letter
            //1 lowercase letter
            //1 number
            //1 special character (discluding space chars)

        //Regex pattern to check for password complexity (contains the above metnioned requirements)
        //(w3 Schools, s.a.)
        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]+$/;

        if((!complexityRegex.test(password))) {
            console.error('Password failed to meet complexity standard');
            return false;
        
        }
        
        console.log('Password met complexity standard');
        return true;

    }

    //Check if the password is in the common passwords list (see CommonPasswords.js)
    //(w3 Schools, s.a.)
    PasswordNotCommon(password) {
        try{
            //Import the CommonPasswords class (not yet implmented since i couldnt find a list of coomon passswords that meet our complexity standard)
            const CommonPasswords = require('./CommonPasswords.js');
            const commonPasswords = new CommonPasswords();

            //Check if the password is in the common passwords list
            if(commonPasswords.IsCommonPassword(password)) {
                console.error('Password was too common');
                return false;   

            }

        }
        catch(error) {
            //If we could not import the CommonPasswords class
                //Log the error
                //Fallback to a basic list of 10 common passwords (see below) that still meet the outlined requirements
            
            //Logging the error
            console.error('Error importing CommonPasswords class', error);

            //Fallback to a basic list of common passwords (see below) that still meet the outlined requirements (assumed list of common passwords as I could not find a list of common passwords that would meet our outlined requirements)
            //(w3 Schools, s.a.)
            const fallbackCommonPasswords = [
                'Password123!',
                'P@ssword123',
                'Passw0rd123!',
                'Password#123',
                'Password@123'

            ];

            if(fallbackCommonPasswords.includes(password)) {
                console.error('Password was too common');
                return false;

            }

        }

        console.log('Password met commonality requirement');
        return true;

    }

    //Check for password length and assume extra complexity each 4 chars added (weak, medium, strong)
    //(w3 Schools, s.a.)
    PasswordStrength(password) {
        const length = password.length;

        if(length < 12) {
            console.log('Password is weak');
            return 'weak';

        } else if(length < 16) {
            console.log('Password is medium');
            return 'medium';

        } 
        else 
        {
            console.log('Password is strong');
            return 'strong';

        }

    }

}

module.exports = PasswordHandler;
/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/