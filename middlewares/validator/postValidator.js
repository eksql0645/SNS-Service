const { body } = require('express-validator');
const index = require('./index');
const errorCodes = require('../../utils/errorCodes');

function addPostValidator() {
  return [
    body('title')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ max: 55 })
      .withMessage(errorCodes.wrongFormat),
    body('content')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ max: 190 })
      .withMessage(errorCodes.wrongFormat),
    body('tag')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .trim()
      .isLength({ max: 30 })
      .withMessage(errorCodes.wrongFormat),
    body('password')
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
    body('image')
      .isLength({ max: 55 })
      .bail()
      .withMessage(errorCodes.wrongFormat),
    index,
  ];
}

module.exports = {
  addPostValidator,
};
