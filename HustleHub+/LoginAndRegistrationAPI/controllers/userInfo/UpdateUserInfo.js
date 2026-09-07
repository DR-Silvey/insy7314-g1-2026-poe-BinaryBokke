const user = require('../../models/Users');

//We'll use the full required schema and then basically just rerun it rough the registartion's valididty check just to ensure the data's integrity
const UpdateUserInfo =  async ( req, res ) => {
    try {
        const usernameToFind = req.params.username;

        //Finding the username realting to the user whos info we want to update
        const foundUser = await user.findOne({ username: usernameToFind });
        
        if(!foundUser){
            return res.status(404).json({
                message: 'User not found'

            });

        }

        //Check is the user requested to change their username
        if((req.body.username && req.body.username !== user.username)){
            //Check if the user's requested username already exists
            const usernameExists = await user.findOne({ username: req.body.username });

            if (condition) {
                return res.status(409).json({
                    message: 'Username Already Exists'

                });

            }

        }

        //Updating user info
            if(req.body.username){
                user.username = req.body.username;

            }

            if(req.body.password){
                user.password = req.body.password;

            }

            if(req.body.fullname){
                user.fullname = req.body.fullname;

            }

            if(req.body.email){
                user.email = req.body.email;

            }

            if(req.body.age){
                user.age = req.body.age;

            }

        //Saving the updated info to the in memory storage
        await user.save();

        return re.status(200).json({
            message: 'User Information was SUCCESSFULLY UPDATED'

        })

    }
    catch(error){
        return res.status(500).json({
                message: 'Internal Server Error'

        })

    }

}

module.exports = UpdateUserInfo;