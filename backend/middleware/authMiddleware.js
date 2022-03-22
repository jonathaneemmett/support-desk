const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            // verify
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // get user
            req.user = await User.findById(decoded.id).select('-password');
            next();

        } catch (e) {
            res.status(401);
            return next(new Error('Not Authorized'));
        }
    }

    if(!token){
        res.status(401);
        return next(new Error('Not Authorized'));
    }

}

module.exports = {
    protect
}