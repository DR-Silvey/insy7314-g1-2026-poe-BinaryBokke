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
            if((input.includes("'") || input.includes("--"))){
                console.error('An invalid input was entered (possible sql injection attempt)');
                return false;

            }
            
        }

        return true;

    }

    //Ensures a string is valid in terms of length
    //(w3 Schools, s.a.)
    isValidString = (value, maxLength = 1000) => {
        return ((typeof value === 'string') && (value.trim().length > 0) && (value.length <= maxLength));

    };

    //Ensures an input is a num where neccesary
    //(w3 Schools, s.a.)
    isValidNumber = (value, min, max = Infinity) => {
        return ((typeof value === 'number') && (Number.isFinite(value)) && (value >= min) && (value <= max));

    };

    //Ensures an input is a bool where neccesary
    //(w3 Schools, s.a.)
    isValidBool = (value) => {
        return typeof value === 'boolean';
        
    };  

    //Ensures an input is a date-time where neccesary
    //(w3 Schools, s.a.)
    isValidDateTime = (value) => {
        if (typeof value !== 'string' || value.trim() === '') {
            return false;
            
        }

        const dateTime = new Date(value);

        return !Number.isNaN(dateTime.getTime());

    }; 

}

module.exports = CommonInputValidator;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 11 October 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 11 October 2026]. 

*/