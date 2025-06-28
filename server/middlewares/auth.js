const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Handle env-based admin
    if (decoded.role === 'admin') {
      req.user = {
        _id: 'admin-id',
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        isAdmin: true,
      };
      return next();
    }

    // Handle regular user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token is invalid' });
  }
};

module.exports = auth;
