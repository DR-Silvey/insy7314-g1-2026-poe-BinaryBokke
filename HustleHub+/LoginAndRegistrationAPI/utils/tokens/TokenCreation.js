//Jwst used to create session tokens
const jwt = require('jsonwebtoken');

//Creatin a token to store the user's username, role
//(The IIE, 2026)
const CreateToken = ( username, role ) =>  {
    console.log('Token creation attempt');
    return jwt.sign({
        username: username,
        role: role

        },
            process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'

        }
    
    );

}

module.exports = CreateToken;

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/