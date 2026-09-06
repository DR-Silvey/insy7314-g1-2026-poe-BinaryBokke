//This class is responsible for encrypting and decrypting passwords
class EncryptionHandler {

    //Encryption
    //Steps
        //Basic Salts added (see at implmentation)
        //Hashing using bcrypt
        //More complex salts added (see at implmentation)
    EncryptPassword(plaintextPassword) {

    }

    //Responsible for hashing the password using bcrypt
    HashPassword(plaintextPassword) {
        try{
            const bcrypt = require('bcrypt');

            //Hashing with a computational cost of 12
            const hashedPassword = bcrypt.hashSync(plaintextPassword, 12);

            return hashedPassword;

        }
        catch(error) {
            //If we could not import the bcrypt module
                //Log the error 
                //return null

            console.error('Error importing bcrypt module:', error);

            return null;

        }

    }

    //Basic Salt
    //Steps
        //add a random char at the start of the plaintext
        //same for middle
        //same for end
    BasicSalt(plainTextPassword){
        
    }

    //More complex salt
    //Steps
        //Each 3rd char add in a random char
        //Each 4th char add in a random char and number
        //Add another random char to the start and end of the password
    MoreComplexSalt(hashedPassword){

    }

    //Decryption
    //Steps
        //Reverse of what was done in encryption
    DecryptPassword(encryptedPassword) {

    }

    UnsaltHashedPassword(hashedPassword){

    }

    unsaltUnhashedPassword(unhashedPassword){

    }

}
