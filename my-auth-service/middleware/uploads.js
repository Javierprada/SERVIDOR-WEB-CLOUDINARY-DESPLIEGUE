const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB
  fileFilter: function (req, file, cb) {
    const videoTypes = /mp4|avi|mkv|mov|webm/;
    const imageTypes = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === 'video' && videoTypes.test(ext)) return cb(null, true);
    if (file.fieldname === 'poster' && imageTypes.test(ext)) return cb(null, true);

    return cb(new Error('❌ Archivo no permitido'));
  }
});

module.exports = upload;