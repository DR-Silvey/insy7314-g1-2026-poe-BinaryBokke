const user = require('../../models/Users');

//We'll use the full required schema and then basically just rerun it rough the registartion's valididty check just to ensure the data's integrity
//(The IIE, 2025)
//(w3 Schools, s.a.)
const UpdateUserInfo =  async ( req, res ) => {
    try {
        const usernameToFind = req.params.username;

        //Finding the username realting to the user whos info we want to update
        const foundUser = await user.findOne({ username: usernameToFind });
        
        if(!foundUser){
            console.error(`Username (${usernameToFind}) not found within db`);
            return res.status(404).json({
                error: 'User not found'

            });

        }

        //Check is the user requested to change their username
        if((req.body.username && req.body.username !== foundUser.username)){
            //Check if the user's requested username already exists
            const usernameExists = await user.findOne({ username: req.body.username });

            if (usernameExists) {
                console.error(`Instance of username ${foundUser} already exists within db as (pk)`);
                return res.status(409).json({
                    error: 'Username Already Exists'

                });

            }

        }

        //Updating user info
        //(w3 Schools, s.a.)
            if(req.body.username){
                foundUser.username = req.body.username;

            }

            if(req.body.password){
                foundUser.password = req.body.password;

            }

            if(req.body.fullname){
                foundUser.fullname = req.body.fullname;

            }

            if(req.body.email){
                foundUser.email = req.body.email;

            }

            if(req.body.age){
                foundUser.age = req.body.age;

            }

        //Saving the updated info to the in memory storage
        //(w3 Schools, s.a.)
        await foundUser.save();

        console.log('User information was successfully updated');
        return res.status(200).json({
            message: 'User Information was SUCCESSFULLY UPDATED'

        })

    }
    catch(error){
        console.error('Internal Server Error');
        return res.status(500).json({
                error: 'Something Went wrong'

        })

    }

}

module.exports = UpdateUserInfo;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/