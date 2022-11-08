const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

exports.s3Upload = async (file) => {
  const s3Instance = new S3Client();
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${Date.now()}${path.basename(file.originalname)}`,
    Body: file.buffer,
  };
  const result = await s3Instance.send(new PutObjectCommand(param));
  return { result, filename: param.Key };
};
