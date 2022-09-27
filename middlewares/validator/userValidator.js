const { body } = require('express-validator');
const index = require('./index');
const errorCodes = require('../../utils/errorCodes');

function signupValidator() {
  return [
    body('nick')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ max: 15 })
      .withMessage(errorCodes.wrongFormat),
    body('email')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isEmail()
      .bail()
      .withMessage(errorCodes.wrongEmailFormat)
      .isLength({ max: 25 })
      .withMessage(errorCodes.wrongFormat),
    body('password')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ min: 8, max: 16 })
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[A-za-z]/)
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[~!@#$%^&*()_+|<>?:{}]/)
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[0-9]/)
      .withMessage(errorCodes.wrongPwdFormat),
    index,
  ];
}

function loginValidator() {
  return [
    body('email')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isEmail()
      .bail()
      .withMessage(errorCodes.wrongEmailFormat)
      .isLength({ max: 25 })
      .withMessage(errorCodes.wrongFormat),
    body('password')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ min: 8, max: 16 })
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[A-za-z]/)
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[~!@#$%^&*()_+|<>?:{}]/)
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[0-9]/)
      .withMessage(errorCodes.wrongPwdFormat),
    index,
  ];
}

function setUserValidator() {
  return [
    body('nick').isLength({ max: 15 }).withMessage(errorCodes.wrongFormat),
    body('email')
      .isEmail()
      .bail()
      .withMessage(errorCodes.wrongEmailFormat)
      .isLength({ max: 25 })
      .withMessage(errorCodes.wrongFormat),
    body('password')
      .notEmpty()
      .isLength({ min: 8, max: 16 })
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[A-za-z]/)
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[~!@#$%^&*()_+|<>?:{}]/)
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[0-9]/)
      .withMessage(errorCodes.wrongPwdFormat),
    body('currentPassword')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ min: 8, max: 16 })
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[A-za-z]/)
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[~!@#$%^&*()_+|<>?:{}]/)
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[0-9]/)
      .withMessage(errorCodes.wrongPwdFormat),
    index,
  ];
}

function deleteUserValidator() {
  return [
    body('currentPassword')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ min: 8, max: 16 })
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[A-za-z]/)
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[~!@#$%^&*()_+|<>?:{}]/)
      .bail()
      .withMessage(errorCodes.wrongPwdFormat)
      .matches(/[0-9]/)
      .withMessage(errorCodes.wrongPwdFormat),
    index,
  ];
}

module.exports = {
  signupValidator,
  loginValidator,
  setUserValidator,
  deleteUserValidator,
};
