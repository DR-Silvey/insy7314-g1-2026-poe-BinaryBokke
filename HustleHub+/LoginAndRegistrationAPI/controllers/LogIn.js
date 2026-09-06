//Loading required utils
const EncryptionHandler = require('./utils/passwords/EncryptionHandler');
const encryptionHandler = new EncryptionHandler();

//Temp to store and retreive data relating to user
const Users = require('./tempdatastorage/users');
const users = new Users();

//
const logUserIn = (req, res) => {
    const { username, password } = req.body;
    

}

