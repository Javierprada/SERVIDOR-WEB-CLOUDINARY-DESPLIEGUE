const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// 🔁 Reconstrucción desde CLOUDINARY_URL
if (process.env.CLOUDINARY_URL) {
  const parsed = new URL(process.env.CLOUDINARY_URL);
  process.env.CLOUDINARY_CLOUD_NAME = parsed.hostname;
  process.env.CLOUDINARY_API_KEY = parsed.username;
  process.env.CLOUDINARY_API_SECRET = parsed.password;
}

// ✅ Configuración obligatoria
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🧪 Log de confirmación
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '❌ NO DEFINIDO',
  api_key: process.env.CLOUDINARY_API_KEY ? '✅' : '❌',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅' : '❌',
});

module.exports = { cloudinary, streamifier };
