//This class is responsible for encrypting and decrypting passwords
class EncryptionHandler {

    //Encryption
    //Steps
        //Hashing using bcrypt
        //Basic extra salts added (extra obfuscation)(see at implmentation)
    EncryptPassword(plaintextPassword) {
        //Hashed password from algorithm
        const hashedPassword = this.HashPassword(plaintextPassword);

        //Hashing failure should return null
        if (hashedPassword !== null) {
            const saltAndHashPassword = this.BasicSalt(hashedPassword)

            //Saltihn failure should return null
            if (saltAndHashPassword !== null) {

                return saltAndHashPassword;

            }
        }

        return null;

    }

    //Responsible for hashing the password using bcrypt
    HashPassword(plaintextPassword) {
        try{
            const bcrypt = require('bcrypt');
                //bcrypt:
                    //Salts the password
                    //Hashes the password

            //Hashing with a computational cost of 12
            const hashedPassword = bcrypt.hashSync(plaintextPassword, 12);

            return hashedPassword;

        }
        catch(error) {
            //If we could not import the bcrypt module
                //Log the error 
                //return null

            console.error('Error importing encryption module:', error);

            return null;

        }

    }

    //Basic Extra salt
    //Steps
        //Each 3rd char add in a random char
        //Each 4th char add in a random char and number
        //Add another random char to the start and end of the password
    BasicSalt(hashedPassword){
        //Datastructures conataining the random chars we'll use to construct salts
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specialChars = '@$!%*?&'

        //Creating a constant tied to the length of the orginal hased password used to compare to the new one to ensure salting occured
        const originalHashedPassLength = hashedPassword.length;

        let saltedHashedPassword = '';

        for (let i = 0; i < hashedPassword.length; i++) {
            //Adding the original char
            saltedHashedPassword += hashedPassword[i];

            //Adding a random char to each 3rd element within the hashed password
            if ((i+1) % 3 ===0) {
                const ranChar = letters[Math.floor(Math.random() * letters.length)]
                saltedHashedPassword += ranChar;

            }

            //Adding a random char to each 4th element within the hashed password
            if ((i+1) % 4 ===0) {
                const ranChar = letters[Math.floor(Math.random() * letters.length)]
                saltedHashedPassword += ranChar;

            }
            
        }

        //Creating the random chars to add to the first and last element of the hashedPassword
        const ranFirst = letters[Math.floor(Math.random() * letters.length)];
        const ranLast = letters[Math.floor(Math.random() * letters.length)];

        //Concatinating salts to the salted and hashed password
        saltedHashedPassword = ranFirst + saltedHashedPassword + ranLast;

        //Ensuring the hashedPassword was salted by comparing it's new length with it's previous one
        if ((saltedHashedPassword.length <= originalHashedPassLength)) {
            //Password wasn't salted

            return null;

        }
        else{
            
            return saltedHashedPassword;

        }

    }

    //Decryption
    //Steps
        //Reverse of what was done in encryption
    DecryptPassword(encryptedPassword) {

    }

    UnsaltHashedPassword(hashedPassword){
        let cleanedHashedPassword = '';

        //Removing the first and last chars
        cleanedHashedPassword = hashedPassword.slice(1, -1);

        //Using the values of the length of the has divided by 3 and 4 to know which chars to remove
        const divThreeLength = Math.floor(cleanedHashedPassword.length / 3);
        const divFourLength = Math.floor(cleanedHashedPassword.length / 4);

        let numOfCharsRemoved = 0;

        //Arrays holding the postions of chars to remove
        const thirdCharsToRemove = [];
        const fourthCharsToRemove = [];

        //Error check to ensure nothing went wrong
        if (divThreeLength > divFourLength) {
            //Populating an array with all the positions of the third and fourth chars from the cleanedHashedPassword that should be removed 
        for (let index = 3; index < modThreeLength; index++) {
            const element = array[index];
            
        }
        }
        else{

            return null;

        }
        
    }

}
