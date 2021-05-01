const ServerError = require('../Models/ServerError.js');

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        for (let i = 0; i < roles.length; i++) {
            if (req.user.hasOwnProperty('userRole') && req.user.userRole === roles[i]) {
                    return next();
            }
			if (req.user.hasOwnProperty('role') && req.user.role === roles[i]) {
                    return next();
            }
        }
        throw new ServerError('Nu sunteti autorizat sa accesati resursa!', 401);
    }
};
 
module.exports = {
    authorizeRoles
}