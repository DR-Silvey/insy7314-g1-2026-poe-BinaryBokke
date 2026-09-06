//Loading required utils
const EncryptionHandler = require('../utils/passwords/EncryptionHandler');
const encryptHandler = new EncryptionHandler();

//Temp to store and retreive data relating to user
const Users = require('../tempdatastorage/users');
const users = new Users();

//Registration route
//Steps
  //Check inputs (flag abnormalities)
  //check if username or email already exists (if username or email already exists, tell the user account laready exists)
  //check if password meets security requirements
  //encrypt password
const RegisterUser = async (req, res) => {
    const { username, password, fullname, email } = req.body;
  
    //Checking if the username already exists
    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        return res.status(409).json({error: 'User already exists (if this is your account please LogIn)'});

    }

    //Encrypting the user's chosen password
    const encryptedPassword = await encryptHandler.EncryptPassword(password);

    users.push(
    {
        username: username,
        password: password,
        fullname: fullname,
        email: email,
        age: age

    });

    return res.status(201).json({message: 'User Registartion occurred SUCCESSFULLY'});

};

module.exports = RegisterUser;