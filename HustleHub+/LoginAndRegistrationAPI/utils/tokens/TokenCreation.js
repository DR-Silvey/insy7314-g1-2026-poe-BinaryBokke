//Loading envrionmnet variables from .env file
require('dotenv').config();

//Jwst used to create session tokens
const jwt = require('jsonwebtoken');

//Creatin a token to store the user's username, role
const CreateToken = ( username, role) =>  {
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