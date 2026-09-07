//Loading required utils
const EncryptionHandler = require('../utils/passwords/EncryptionHandler');
const encryptionHandler = new EncryptionHandler();

const TokenCreation = require('../utils/tokens/TokenCreation');

//Temp to store and retreive data relating to user
const user = require('../models/Users');

//Method logs user in if their username and corelating password matches a saved one
const logUserIn =  async (req, res) => {
    try{
    const { username, password } = req.body;
    
    //Seeing if the entered username is in the database
    const foundUser = await user.findOne({ username });

    //User doesn't exist
    if(!foundUser){
        console.error(`Username ${username} not found within db`);
        return res.status(401).json({
            error: 'Invalid Username or Password'
        
        });

    }

    //If user does exist comparre the hasehed version of the netered password to the related stored password
    const passwordMatches = await encryptionHandler.ComparePassword(password, foundUser.password);

    //Passwords don't match
    if(!passwordMatches){
        console.error(`The Password does not match the correlating user's (${username})`);
        return res.status(401).json({
            error: 'Invalid Username or Password'
        
        });

    }

    //creating a jason web toke if the user's login credential were found and matched
    const token = TokenCreation.CreateToken(username, "GENERIC"); //All users generic at this stage

    console.log(`Login Attempt for ${username} was a success`);
    return res.status(200).json({
        message: 'LogIn attempt was SUCCESSFULL', token
    
    });

    }
    catch(error){
        console.error(`Internal Server Error`);
        return res.status(500).json({
            error: 'Something went wrong'
        
        });

    }

}

module.exports = logUserIn;

