//This class is responsible for checking if password meet the disgnated requirements before encryption
//Checks for
    //Password length (min 12 chars)
    //Password complexity (must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character)
    //Can't be in the common passwords list (see CommonPasswords.js)(circa September 2026)

//Checked for in CommonInputValidator before this class is called
    //Password can't contain any SQL injection attempts (e.g. ' or 1=1 --)
    //Password can't contain spaces