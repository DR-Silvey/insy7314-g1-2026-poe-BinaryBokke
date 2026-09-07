const user = require('../../models/Users');

//We'll use the full required schema and then basically just rerun it rough the registartion's valididty check just to ensure the data's integrity
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