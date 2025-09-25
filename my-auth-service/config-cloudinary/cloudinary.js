    const cloudinary = require('cloudinary') .v2;
    const streamifier = require('streamifier');

    if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    }

    cloudinary.config({
        
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        
    });


    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('❌ Faltan variables de entorno para Cloudinary');
    }



    console.log('Cloudinary config:',{
        
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        
    });


    module.exports = { cloudinary, streamifier };