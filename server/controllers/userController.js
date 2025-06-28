const User = require('../models/User');
const jwt = require('jsonwebtoken');

//generate JWT token

const generateToken = (res, userId) =>{
    const token = jwt.sign({id:userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
};


//Register

exports.registerUser = async (req, res) =>{
    const {username, email, password} = req.body;

    try{
        const userExists = await User.findOne({email});
        if(userExists)
            return res.status(400).json({message: 'user already exists'});

        const user = await User.create({username, email, password});
        generateToken(res, user._id);

        res.status(201).json({
            _id:user._id,
            username: user.username,
            email: user.email,
        });
    } catch(err){
        res.status(500).json({message: 'Registration failed', error: err.message})
    }
};


// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    //admin login via env
    if(
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
    ){
        const adminPayload = { id: "admin-id", role: "admin" };
         const token = jwt.sign(adminPayload, process.env.JWT_SECRET,{
            expiresIn:"7d",
         });

         res.cookie("token", token,{
            httpOnly:true,
            sameSite:"Lax",
            secure:process.env.NODE_ENV === "production",
             maxAge: 7 * 24 * 60 * 60 * 1000,
         });

         return res.json({
         _id:"admin-id",
         username: process.env.ADMIN_USERNAME,
         email: process.env.ADMIN_EMAIL,
         role:"admin",
         });
    }

    //regular user login
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    generateToken(res, user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


//logout
exports.logoutUser = (req, res)=>{
    res.clearCookie('token');
    res.json({message: 'logged out successfully'});
}


//get current user
exports.getCurrentUser = async(req, res)=>{
    if(!req.user) return res.status(401).json({message:'not authenticated'});

    res.json({
        _id: req.user._id,
        username:req.user.username,
        email:req.user.email,
    })
}