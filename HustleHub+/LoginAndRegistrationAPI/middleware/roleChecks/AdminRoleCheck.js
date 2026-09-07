const AdminRoleCheck = ( req, res, next ) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(403).json({
            message: 'Admin privileges required to use this method'

        });        

        next();

    }

}

module.exports = AdminRoleCheck;