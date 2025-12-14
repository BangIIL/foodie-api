const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const ResponseHandler = require('../utils/responseHandler');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.validationError(res, errors);
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return ResponseHandler.error(
        res,
        'Email sudah terdaftar',
        400
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user.id);

    return ResponseHandler.success(
      res,
      {
        user: user.toJSON(),
        token
      },
      'Registrasi berhasil',
      201
    );

  } catch (error) {
    console.error('Register Error:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return ResponseHandler.error(
        res,
        'Validation Error',
        400,
        errors
      );
    }

    return ResponseHandler.error(
      res,
      'Terjadi kesalahan pada server',
      500
    );
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.validationError(res, errors);
    }

    const { email, password } = req.body;

    // Find user (include password untuk compare)
    const user = await User.findOne({ 
      where: { email },
      attributes: { include: ['password'] }
    });

    if (!user) {
      return ResponseHandler.error(
        res,
        'Email atau password salah',
        401
      );
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return ResponseHandler.error(
        res,
        'Email atau password salah',
        401
      );
    }

    // Generate token
    const token = generateToken(user.id);

    return ResponseHandler.success(
      res,
      {
        user: user.toJSON(),
        token
      },
      'Login berhasil'
    );

  } catch (error) {
    console.error('Login Error:', error);
    return ResponseHandler.error(
      res,
      'Terjadi kesalahan pada server',
      500
    );
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return ResponseHandler.error(
        res,
        'User tidak ditemukan',
        404
      );
    }

    return ResponseHandler.success(
      res,
      { user: user.toJSON() },
      'Data user berhasil diambil'
    );

  } catch (error) {
    console.error('GetMe Error:', error);
    return ResponseHandler.error(
      res,
      'Terjadi kesalahan pada server',
      500
    );
  }
};