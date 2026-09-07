//Loading required utils
const EncryptionHandler = require('../utils/passwords/EncryptionHandler');
const encryptHandler = new EncryptionHandler();

//Temp to store and retreive data relating to user
const user = require('../models/Users');

//Registration route
//Steps
  //Check inputs (flag abnormalities)
  //check if username or email already exists (if username or email already exists, tell the user account laready exists)
  //check if password meets security requirements
  //encrypt password
const RegisterUser = async (req, res) => {
    try{
        const { username, password, fullname, email, age, role } = req.body;
  
        //Checking if the username already exists
        const existingUser = users.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                error: 'User already exists (if this is your account please LogIn)'
            
            });

        }

        //Encrypting the user's chosen password
        const encryptedPassword = await encryptHandler.EncryptPassword(password);

        //Creating a populated instance of the user schema
        const newUser = new user({
            username: username,
            password: password,
            fullname: fullname,
            email: email,
            age: age,
            //Users are all genric at start and can request access for higher privelages

        });

    //Saving the new user to in memory schema
    await newUser.save();

    return res.status(201).json({
        message: 'User Registartion occurred SUCCESSFULLY'
    
    });

    }
    catch(error){
        return res.status(500).json({
            error: 'Something went wrong'
        
        });

    }
    
};

module.exports = RegisterUser;