const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'User not authenticated'})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if(!req.user){
            return res.status(401).json({message: 'User not found'});
        }
        next();
    } catch(err){
        res.status(403).json({message:'Token is invalid'})
    }
};

module.exports = auth;