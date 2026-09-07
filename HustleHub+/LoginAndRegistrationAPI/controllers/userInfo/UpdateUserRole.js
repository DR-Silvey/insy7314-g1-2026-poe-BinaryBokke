const user = require('../../models/Users');

//We'll use the full required schema and then basically just rerun it rough the registartion's valididty check just to ensure the data's integrity
const UpdateUserRole =  async ( req, res ) => {
    try {
        const usernameToFind = req.params.username;
        const { role } = req.boy;

        //Finding the username realting to the user whos info we want to update
        const foundUser = await user.findOne({ username: usernameToFind });
        
        if(!foundUser){
            return res.status(404).json({
                error: 'User not found'

            });

        }

        //Updating the user's role
        user.role = role;

        //Saving the updated info to the in memory storage
        await user.save();

        return re.status(200).json({
            message: 'User ROLE was SUCCESSFULLY UPDATED'

        })

    }
    catch(error){
        return res.status(500).json({
                error: 'Something went wrong'

        })

    }

}

module.exports = UpdateUserRole;