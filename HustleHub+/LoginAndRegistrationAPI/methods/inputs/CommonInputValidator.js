class CommonInputValidator {
    CommonInputValidation(input) {
        //Input can't be undefined, null, empty 
        if((input === undefined || typeof input !== 'string' || input === null || input === '' || input.length < 3 || input.length > 20)) {
            return false;
        }

        //Input can't contain space chars or any indication of SQL injection (e.g. ' or 1=1 --)
        if(input.includes(' ') || input.includes("'") || input.includes("--")){
            return false;

        }

        return true;

    }

    IsValidUsername(username) {
        //Username has to meet the common input validation criteria
        if(!this.CommonInputValidation(username)) {
            return false;

        }

        //Username has to be string
        if((typeof username !== 'string')) {
            return false;

        }

        return true;

    }

    IsValidPassword(password) {
        //Password has to meet the common input validation criteria
        if(!this.CommonInputValidation(password)) {
            return false;
        
        }

        //Password has to be string
        if((typeof password !== 'string')) {
            return false;

        }

        return true;
        
    }

    IsValidUsernameandPassword(username, password) {
        if(!this.IsValidUsername(username) || !this.IsValidPassword(password)) {      
            return false;

        }else{
            return true;
            
        }

    }

    IsValidEmail(email) {
        //Email has to meet the common input validation criteria
        if(!this.CommonInputValidation(email)) {
            return false;

        }

        //Email can't be undefined, null, empty, have to be string
        if((email === undefined || typeof email !== 'string' || email === null || email === '')) {
            return false;
        
        }

        return true;
    
    }

    IsValidFullname(fullname) {
        //Fullname has to meet the common input validation criteria
        if(!this.CommonInputValidation(fullname)) {
            return false;
        
        }

        //Fullname can't be undefined, null, empty, have to be string
        if((fullname === undefined || typeof fullname !== 'string' || fullname === null || fullname === '')) {
            return false;

        }

        return true;

    }

    IsValidAge(age) {
        //Age can't be undefined, null, empty, over 120, less than 16, have to be number
        if((age === undefined || typeof age !== 'number' || age === null || age === '' || age > 120 || age < 16)) {
            return false;

        }

        return true;

    }

}