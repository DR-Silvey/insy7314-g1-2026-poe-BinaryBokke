//Loading envrionmnet variables from .env file
require('dotenv').config();

const jwt = require('jsonwebtoken');

const protect = ( req, res, next ) => {
    const authHeader = req.headers.authorization;

    if((!authHeader || !authHeader.startsWith('Bearer '))){
        console.error('No JWT token was provided in attempt');
        return res.status(401).json({
            error: 'No token provided'

        });

    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;

        console.log('JWT Auth was a success.');
        next();

    }
    catch(errror){
        console.error('JWT token for attempt is expired or invalid');
        return  res.status(401).json({
            error: 'Invalid or expired token'

        });
    }

};

const authorizeRoles = ( ...allowedRoles ) => {
    return ( req, res, next ) => {
        if((!req.user || !allowedRoles.includes(req.user.role))){
            console.error('User atttempted access beyond their role');
            return res.status(403).json({
                error: 'Access Denied'

            });

        }

        console.log('Role auth was a success');
        next();
        
    };

};

module.exports = { protect, authorizeRoles };