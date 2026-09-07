//Loading required utils
//(The IIE, 2026)
const EncryptionHandler = require('../utils/passwords/EncryptionHandler');
const encryptionHandler = new EncryptionHandler();

const TokenCreation = require('../utils/tokens/TokenCreation');

//Temp to store and retreive data relating to user
const user = require('../models/Users');

//Method logs user in if their username and corelating password matches a saved one
//(The IIE, 2026)
const logUserIn =  async (req, res) => {
    try{
    const { username, password } = req.body;
    
    //Seeing if the entered username is in the database
    //(The IIE, 2026)
    const foundUser = await user.findOne({ username });

    //User doesn't exist
    if(!foundUser){
        console.error(`Username ${username} not found within db`);
        return res.status(401).json({
            error: 'Invalid Username or Password'
        
        });

    }

    //If user does exist comparre the hasehed version of the netered password to the related stored password
    //(w3 Schools, s.a.)
    const passwordMatches = await encryptionHandler.ComparePassword(password, foundUser.password);

    //Passwords don't match
    if(!passwordMatches){
        console.error(`The Password does not match the correlating user's (${username})`);
        return res.status(401).json({
            error: 'Invalid Username or Password'
        
        });

    }

    //creating a jason web toke if the user's login credential were found and matched
    const token = TokenCreation(username, "GENERIC"); //All users generic at this stage

    console.log(`Login Attempt for ${username} was a success`);
    return res.status(200).json({
        message: 'LogIn attempt was SUCCESSFULL', token
    
    });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong'
        
        });

    }

}

module.exports = logUserIn;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/