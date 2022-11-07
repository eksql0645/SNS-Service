const { Router } = require('express');
// const { loginRequired } = require('../middlewares/loginRequired');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

try {
  fs.readdirSync('public/uploads');
} catch (err) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('public/uploads');
}

const imageRouter = Router();

// 이미지 업로드 설정
const upload = multer({
  storage: multer.diskStorage({
    // 이미지 파일 저장 위치
    destination(req, file, done) {
      done(null, 'public/uploads/');
    },
    // 이미지 파일 이름 설정
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 하나만 생성
imageRouter.post('/', upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `uploads/${req.file.filename}` });
});

module.exports = imageRouter;
