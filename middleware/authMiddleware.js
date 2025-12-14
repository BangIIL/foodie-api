const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ResponseHandler = require('../utils/responseHandler');

exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return ResponseHandler.error(
      res,
      'Akses ditolak. Token tidak ditemukan',
      401
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return ResponseHandler.error(
        res,
        'User tidak ditemukan',
        404
      );
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ResponseHandler.error(
        res,
        'Token tidak valid',
        401
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return ResponseHandler.error(
        res,
        'Token sudah expired. Silakan login kembali',
        401
      );
    }

    return ResponseHandler.error(
      res,
      'Terjadi kesalahan saat verifikasi token',
      500
    );
  }
};