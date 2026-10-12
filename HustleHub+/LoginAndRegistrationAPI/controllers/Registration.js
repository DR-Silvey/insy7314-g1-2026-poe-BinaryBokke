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
  
//(The IIE, 2026)
const RegisterUser = async (req, res) => {
    try{
        //(w3 Schools, s.a.)
        const { username, password, fullname, email, age, role } = req.body;
  
        //Checking if the username already exists
        const existingUser = await user.findOne({ username });

        if (existingUser) {
            console.error(`Instance of username ${username} already exists within db as (pk)`);
            return res.status(409).json({
                error: 'User already exists (if this is your account please LogIn)'
            
            });

        }

        //Encrypting the user's chosen password
        const encryptedPassword = await encryptHandler.EncryptPassword(password);

        //Creating a populated instance of the user schema
        //(The IIE, 2026)
        //(w3 Schools, s.a.)
        const newUser = new user({
            username: username,
            password: encryptedPassword,
            fullname: fullname,
            email: email,
            age: age,
            role: role

        });

    //Saving the new user to in memory schema
    await newUser.save();

    console.log(`Registration Attempt for ${username} was a success`);
    return res.status(201).json({
        message: 'User Registartion occurred SUCCESSFULLY'
    
    });

    }
    catch(error){
        console.error('Internal Server Error', error);
        return res.status(500).json({
            error: 'Something went wrong'
        
        });

    }
    
};

module.exports = RegisterUser;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/