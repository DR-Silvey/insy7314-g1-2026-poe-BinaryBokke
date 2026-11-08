const jwt = require('jsonwebtoken');

//Esnures that JWT token didnt expire or is invalid
//(The IIE, 2026)
const protect = ( req, res, next ) => {
    const authHeader = req.headers.authorization;

    //Check if a JWT token is prevent
    if((!authHeader || !authHeader.startsWith('Bearer '))){
        console.error('No JWT token was provided in attempt');
        return res.status(401).json({
            error: 'No token provided'

        });

    }

    const token = authHeader.split(' ')[1];

    //Ensures the JWT token is valid andnot expired
    //(The IIE, 2026)
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;

        console.log('JWT Auth was a success.');
        next();

    }
    catch(error){
        console.error('JWT token for attempt is expired or invalid', error);
        return  res.status(401).json({
            error: 'Invalid or expired token'

        });
        
    }

};

//Enforces RBAC trough checking the user's assigned role
//(The IIE, 2026)
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

/*
W3 Schools, s.a. JavaScript Tutorial.
[online] Available at:
<https://www.w3schools.com/js/DEFAULT.asp>
[Accessed 4 Septemeber 2026]

The Independent Institute of Education, 2026. INOFRMATION SYSTEM 3D [INSY7314/w]. nt. [online 
via internal VLE] The Independent Institute of Education. Available at: <https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7B58B815C8-D592-4D47-BDA0-4F6761924E1B%7D&file=INSY7314MM.docx&action=default&mobileredirect=true> 
[Accessed 4 Septemeber 2026]. 

*/