const user = require('../../models/Users');

//We'll use the full required schema and then basically just rerun it rough the registartion's valididty check just to ensure the data's integrity
const UpdateUserRole =  async ( req, res ) => {
    try {
        //(w3 Schools, s.a.)
        const usernameToFind = req.params.username;
        const { role } = req.boy;

        //Finding the username realting to the user whos info we want to update
        //(w3 Schools, s.a.)
        const foundUser = await user.findOne({ username: usernameToFind });
        
        if(!foundUser){
            console.error(`Username (${usernameToFind}) not found within db`);
            return res.status(404).json({
                error: 'User not found'

            });

        }

        //Updating the user's role
        user.role = role;

        //Saving the updated info to the in memory storage
        //(The IIE, 2026)
        await user.save();

        console.log(`User's role was successfully changed to ${role}`);
        return res.status(200).json({
            message: 'User ROLE was SUCCESSFULLY UPDATED'

        })

    }
    catch(error){
        console.error('Internal Server Error');
        return res.status(500).json({
                error: 'Something went wrong'

        })

    }

}

module.exports = UpdateUserRole;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/