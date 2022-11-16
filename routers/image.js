const { Router } = require('express');
const { loginRequired } = require('../middlewares/loginRequired');
const multer = require('multer');
const multerS3 = require('multer-s3');
const errorCodes = require('../utils/errorCodes');
const { S3Client } = require('@aws-sdk/client-s3');
const path = require('path');

const imageRouter = Router();

const s3Instance = new S3Client();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new multer.MulterError(errorCodes.multerError), false);
  }
};

const upload = multer({
  storage: multerS3({
    s3: s3Instance,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}${path.basename(file.originalname)}`);
    },
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

// 이미지 하나만 생성
imageRouter.post(
  '/',
  loginRequired,
  upload.single('file'),
  async (req, res) => {
    try {
      return res.json({ url: req.file.location });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = imageRouter;
