const express = require('express');
const {
  register,
  login,
  getMe
} = require('../Controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { 
  registerValidation, 
  loginValidation 
} = require('../validators/authValidator');

const router = express.Router();

// Routes dengan validation dari file terpisah
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

module.exports = router;