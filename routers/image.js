const { Router } = require('express');
const { loginRequired } = require('../middlewares/loginRequired');
const multer = require('multer');
const { s3Upload } = require('../utils/awsclient');
const errorCodes = require('../utils/errorCodes');

const imageRouter = Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log('fileFilter', file);
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new multer.MulterError(errorCodes.multerError), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

// 이미지 하나만 생성
imageRouter.post(
  '/',
  loginRequired,
  upload.single('file'),
  async (req, res) => {
    const file = req.file;
    try {
      const { result, filename } = await s3Upload(file);
      console.log(result);
      return res.json({ url: `${process.env.AWS_S3_URL}${filename}` });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = imageRouter;
