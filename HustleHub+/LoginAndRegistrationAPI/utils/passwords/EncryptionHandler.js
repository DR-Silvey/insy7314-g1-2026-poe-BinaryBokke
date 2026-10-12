const bcrypt = require('bcrypt');

//This class is responsible for encrypting passwords
class EncryptionHandler {
    //Used to compare passwords for user Log-in (the input when hashed should be the same as the saved hashed one)
    async ComparePassword(password, hashedPassword){
        //Comparison should match otherwise incorrect password
        //(The IIE, 2026)
        return await bcrypt.compare(password, hashedPassword);

    }

    //Encryption
    //Steps
        //Hashing using bcrypt
        //Basic extra salts added (extra obfuscation)(see at implmentation)
    async EncryptPassword(plaintextPassword) {
        //Hashed password from algorithm
        const hashedPassword = await this.HashPassword(plaintextPassword);

        //Hashing failure should return null
        if (hashedPassword !== null) {
            const saltAndHashPassword = hashedPassword;

            //Saltihn failure should return null
            if (saltAndHashPassword !== null) {
                console.log('Password encryption wa a success');
                return saltAndHashPassword;

            }
        }

        console.error('Password encrytpion failed');
        return null;

    }

    //Responsible for hashing the password using bcrypt
    async HashPassword(plaintextPassword) {
        try{
            const bcrypt = require('bcrypt');
                //bcrypt: (npm, 2025)
                    //Salts the password
                    //Hashes the password

            //Hashing with a computational cost of 12
            //(The IIE, 2026)(npm, 2025)
            const hashedPassword = bcrypt.hashSync(plaintextPassword, 12);

            console.log('Password successfully hashed');
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
    async BasicSalt(hashedPassword){
        //Datastructures conataining the random chars we'll use to construct salts
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        //Creating a constant tied to the length of the orginal hased password used to compare to the new one to ensure salting occured
        const originalHashedPassLength = hashedPassword.length;

        let saltedHashedPassword = '';

        //(w3 Schools, s.a.)
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
        //(w3 Schools, s.a.)
        const ranFirst = letters[Math.floor(Math.random() * letters.length)];
        const ranLast = letters[Math.floor(Math.random() * letters.length)];

        //Concatinating salts to the salted and hashed password
        saltedHashedPassword = ranFirst + saltedHashedPassword + ranLast;

        //Ensuring the hashedPassword was salted by comparing it's new length with it's previous one
        if ((saltedHashedPassword.length <= originalHashedPassLength)) {
            //Password wasn't salted
            console.error('Password salting failure');
            return null;

        }
        else{
            console.log('Password salting success');
            return saltedHashedPassword;

        }

    }

    async UnsaltHashedPassword(hashedPassword){
        //Removing the first and last chars
        //(w3 Schools, s.a.)
        let cleanedSaltedHashedPassword = hashedPassword.slice(1, -1);

        let unsaltedHashedPassword = '';

        let i = 0;
        let originalCharCount = 0;

        //Uses a variable to build a unslated version of the string from the salted hashed password
        //(w3 Schools, s.a.)
        while(i < cleanedSaltedHashedPassword.length){
            //Extracting an unsalted char from the salted hashed password
            unsaltedHashedPassword += cleanedSaltedHashedPassword[i];

            i++;
            originalCharCount++;

            //Skipping a char if it is a salted one (3rd char)
            if(originalCharCount % 3 === 0){
                i++;

            }

            //Skipping a char if it is a salted one (4th char)
            if(originalCharCount % 4 === 0){
                i+=2;

            }

        }

        console.log('Password unsalting success');
        return unsaltedHashedPassword;

    }

}

module.exports = EncryptionHandler;

/*
npm, 2025. bcrypt.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/