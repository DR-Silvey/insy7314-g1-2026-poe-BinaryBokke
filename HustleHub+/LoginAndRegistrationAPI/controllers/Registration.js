const EncryptionHandler = require('./utils/passwords/EncryptionHandler');
const encryptHandler = new EncryptionHandler();

const PasswordHandler = require('./utils/passwords/PasswordHandler');
const passwordHandler = new EncryptionHandler();

//Temp to store and retreive data relating to user
const Users = require('./tempdatastorage/users');
const users = new Users();