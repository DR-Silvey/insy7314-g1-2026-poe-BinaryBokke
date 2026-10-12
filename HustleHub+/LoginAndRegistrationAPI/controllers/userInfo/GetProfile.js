//Loading required utils
//(The IIE, 2026)
const EncryptionHandler = require('../../utils/passwords/EncryptionHandler');
const encryptionHandler = new EncryptionHandler();

const TokenCreation = require('../../utils/tokens/TokenCreation');

//Temp to store and retreive data relating to user
const User = require('../../models/Users');

//Method used to retrive an account's details by username
//(The IIE, 2026)
const GetProfile =  async (req, res, next) => {
    try{
    const { username,  } = req.body;
            
        //Seeing if the entered username is in the database
        //(The IIE, 2026)
        const foundUser = await user.findOne({ username });
        
        //User doesn't exist
        if(!foundUser){
           console.error(`Username ${username} not found within db`);
           return res.status(404).json({
            error: 'User not found'
                
           });
        
        }

        return res.status(200).json({ error: 'User not found' });

    }
    catch(error){
        console.error(`Internal Server Error`, error);
        return res.status(500).json({
            error: 'Something went wrong'
        
        });

    }

}

module.exports = GetProfile;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/