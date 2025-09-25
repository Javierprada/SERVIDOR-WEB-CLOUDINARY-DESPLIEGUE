const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// ✅ Configura directamente desde CLOUDINARY_URL
cloudinary.config({
  secure: true
});

console.log('🔍 CLOUDINARY_URL:', process.env.CLOUDINARY_URL || '❌ NO DEFINIDO');

module.exports = { cloudinary, streamifier };

