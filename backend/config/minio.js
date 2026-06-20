const Minio = require('minio');
require('dotenv').config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

const initBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      const policy = JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
        }]
      });
      await minioClient.setBucketPolicy(BUCKET_NAME, policy);
      console.log(`Bucket "${BUCKET_NAME}" créé avec succès`);
    } else {
      console.log(`Bucket "${BUCKET_NAME}" déjà existant`);
    }
  } catch (error) {
    console.error('Erreur initialisation MinIO:', error.message);
    throw error;
  }
};

module.exports = { minioClient, BUCKET_NAME, initBucket };