//Loading required utils
const EncryptionHandler = require('../utils/passwords/EncryptionHandler');
const encryptionHandler = new EncryptionHandler();

//Temp to store and retreive data relating to user
const users = require('../models/users');

//Method logs user in if their username and corelating password matches a saved one
const logUserIn =  async (req, res) => {
    const { username, password } = req.body;
    
    //Seeing if the entered username is in the database
    const user = users.find(user => user.username === username);

    //User doesn't exist
    if(!user){
        return res.status(401).json({message: 'Invalid Username or Password'});

    }

    //If user does exist comparre the hasehed version of the netered password to the related stored password
    const passwordMatches = await encryptionHandler.ComparePassword(password, user.password);

    //Passwords don't match
    if(!passwordMatches){
        return res.status(401).json({message: 'Invalid Username or Password'});

    }

    return res.status(200).json({message: 'LogIn attempt was SUCCESSFULL'});

}

module.exports = logUserIn;

