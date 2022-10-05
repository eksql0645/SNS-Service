const { body, query, param } = require('express-validator');
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
    body('image')
      .isLength({ max: 55 })
      .bail()
      .withMessage(errorCodes.wrongFormat),
    index,
  ];
}

function getPostsValidator() {
  return [
    query('page')
      .notEmpty()
      .bail()
      .withMessage(errorCodes.required)
      .isInt({ min: 1 })
      .withMessage(errorCodes.onlyUseInt),
    query('limit')
      .optional()
      .isIn([10, 30, 50, 70, 100])
      .withMessage(errorCodes.limitFormat)
      .isInt()
      .withMessage(errorCodes.onlyUseInt),
    query('sort')
      .optional()
      .isIn([0, 1, 2])
      .withMessage(errorCodes.sortFormat)
      .isInt()
      .withMessage(errorCodes.onlyUseInt),
    query('seq')
      .optional()
      .isIn([0, 1])
      .withMessage(errorCodes.sortFormat)
      .isInt()
      .withMessage(errorCodes.onlyUseInt),
    query('search')
      .optional()
      .isLength({ max: 20 })
      .bail()
      .withMessage(errorCodes.wrongFormat),
    query('tag')
      .optional()
      .isLength({ max: 30 })
      .bail()
      .withMessage(errorCodes.wrongFormat),
    index,
  ];
}

function paramValidator() {
  return [
    param('id').notEmpty().bail().withMessage(errorCodes.required),
    index,
  ];
}

function setPostValidator() {
  return [
    param('id').notEmpty().bail().withMessage(errorCodes.required),
    body('title')
      .optional()
      .isLength({ max: 60 })
      .withMessage(errorCodes.tooLongTitle),
    body('content')
      .optional()
      .isLength({ max: 200 })
      .withMessage(errorCodes.tooLongContent),
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

module.exports = {
  addPostValidator,
  getPostsValidator,
  paramValidator,
  setPostValidator,
};
