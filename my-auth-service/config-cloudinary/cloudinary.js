const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// 🔁 Primero: reconstruye desde CLOUDINARY_URL si existe
if (process.env.CLOUDINARY_URL) {
  const parsed = new URL(process.env.CLOUDINARY_URL);
  process.env.CLOUDINARY_CLOUD_NAME = parsed.hostname;
  process.env.CLOUDINARY_API_KEY = parsed.username;
  process.env.CLOUDINARY_API_SECRET = parsed.password;
}

// 🔍 Luego: diagnóstico
const missingVars = [
  !process.env.CLOUDINARY_CLOUD_NAME && 'CLOUDINARY_CLOUD_NAME',
  !process.env.CLOUDINARY_API_KEY && 'CLOUDINARY_API_KEY',
  !process.env.CLOUDINARY_API_SECRET && 'CLOUDINARY_API_SECRET'
].filter(Boolean);

if (missingVars.length > 0) {
  console.warn(`⚠️ Variables faltantes: ${missingVars.join(', ')}`);
}

// ✅ Configuración
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