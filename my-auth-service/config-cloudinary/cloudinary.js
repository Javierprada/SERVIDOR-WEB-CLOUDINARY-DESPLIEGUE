const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log('✅ Cloudinary configurado con:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '❌ NO DEFINIDO',
  api_key: process.env.CLOUDINARY_API_KEY ? '✔️ DEFINIDO' : '❌ NO DEFINIDO',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✔️ DEFINIDO' : '❌ NO DEFINIDO',
});

module.exports = { cloudinary, streamifier };
