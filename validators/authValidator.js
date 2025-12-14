const { body } = require('express-validator');

exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nama harus diisi')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nama harus 2-100 karakter'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email harus diisi')
    .isEmail()
    .withMessage('Format email tidak valid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password harus diisi')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter')
];

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email harus diisi')
    .isEmail()
    .withMessage('Format email tidak valid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password harus diisi')
];

exports.changePasswordValidation = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Password lama harus diisi'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('Password baru harus diisi')
    .isLength({ min: 6 })
    .withMessage('Password baru minimal 6 karakter')
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error('Password baru tidak boleh sama dengan password lama');
      }
      return true;
    }),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Konfirmasi password harus diisi')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Konfirmasi password tidak cocok');
      }
      return true;
    })
];