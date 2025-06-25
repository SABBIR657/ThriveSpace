const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logoutUser, getCurrentUser} = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Logout user
router.post('/logout', auth, logoutUser);

// Get currently logged-in user
router.get('/me', auth, getCurrentUser);

module.exports = router;