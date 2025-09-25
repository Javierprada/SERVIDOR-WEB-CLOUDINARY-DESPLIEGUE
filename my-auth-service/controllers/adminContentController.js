const adminContent = require('../models/adminContent'); // Importa el modelo.
const path = require ('path'); // Necesario para path.extname 
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




console.log('Cloudinary config:',{
    
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    
});




const uploadToCloudinary = (buffer, opcions) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(opcions, (error, result)=> {
            if (error) reject(error);
            else resolve(result);
        });
        streamifier.createReadStream(buffer).pipe(stream);
    
    });

};




// Esta funcion añade una nueva MOVIE y maneja la subida de archivos.
const addMovie = async (req, res) => {

    console.log('addMovie - req.body (texto):', req.body);
    console.log('addMovie - req.files (archivos):', req.files); // <-- ESTA SALIDA ES LA CLAVE AHORA

    try {

        const videoBuffer = req.files?.video?.[0]?.buffer;
        const posterBuffer = req.files?.poster?.[0]?.buffer;


        // 1. Verificar autenticación y rol de administrador del usuario (middleware).
        // 2. Procesar los archivos subidos por Multer (req.files o req.file).
        // 3. Mover los archivos a un almacenamiento permanente (local o S3/GCS/Azure).
        // 4. Obtener las URLs finales de los archivos subidos (video_url, poster_url).

        // Se desestructura solo los campos de texto del req.body
        const {title, description, genre, director, actors, release_date, duration_minutes, trailer_url} = req.body;



        // validaciones basicas de los datos.
        if (!title || !videoBuffer) {
            return res.status(400).json({success: false, message: 'Titulo y URL del video son obligatorios.'});
        }




        const existing = await adminContent.findMovieByTitle(title);
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe una movie con este título.',
            });
        }



   

       

        // Subir a cloudinary
       let videoResult;
       try {
         videoResult = await uploadToCloudinary(videoBuffer, {
            resource_type: 'video',
            folder: 'movies/videos',
        });
       } catch (err) {
            console.error('❌ Error al subir el video a Cloudinary:', err);
            return res.status(500).json({
                success: false,
                message: '❌ Error al subir el video a Cloudinary.',
            });
       }




        let posterResult = null;
        if (posterBuffer) {
            try {
              posterResult = await uploadToCloudinary(posterBuffer,{
                resource_type: 'image',
              });
            } catch (err) {
                console.error('❌ Error al subir el poster a Cloudinary:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al subir el poster a Cloudinary.',
                })
            }
        }


        if (isNaN(parseInt(duration_minutes))) {
            return res.status(400).json({
                success: false,
                message: 'La duración debe ser un número válido.',
            });
        }




    



        // Construcción del objeto para guardar en la BD
        const movieData = {
            title,
            description,
            genre,
            director,
            actors,
            release_date,
            trailer_url,
            poster_url: posterResult?.secure_url ?? null,
            video_url: videoResult.secure_url,
            duration_minutes: parseInt(duration_minutes) // Debe de ser un numero.
        };

        const result = await adminContent.addMovie(movieData); // Llama al modelo.

        res.status(201).json({
            success: true,
            message: 'Pelicula añadida exitosamente.',
            movieId: result.insertId,
            movieData: {...movieData, id: result.insertId}
        });

    } catch (error) {
        console.error('❌ Error al añadir pelicula:', error);
        res.status(500).json({success: false, message: 'Error interno del servidor al añadir pelicula.', error: error.message});
    }
};






// Obtener todas las películas
const getAllMovies = async (req, res) => {
    try {
        const movies = await adminContent.getAllMovies();
        res.status(200).json({ success: true, movies });
    } catch (error) {
        console.error('❌ Error al obtener películas:', error);
        res.status(500).json({ success: false, message: 'Error interno al obtener películas.' });
    }
};








// Actualizar una película por ID
const updateMovie = async (req, res) => {
    const { id } = req.params;

    console.log('updateMovie - req.body:', req.body);
    console.log('updateMovie - req.files:', req.files);

    try {
        const { title, description, genre, director, actors, release_date, duration_minutes } = req.body;

        const videoBuffer = req.files?.video?.[0]?.buffer; // buffer del nuevo video, si se subió uno.
        let video_url = null;

        if (videoBuffer) {
            try {
                const videoResult = await uploadToCloudinary(videoBuffer, { resource_type: 'video', folder: 'movies/videos' });
                video_url = videoResult.secure_url;
            } catch (err) {
                console.error('❌ Error al subir nuevo video en updateMovie:', err);
                return res.status(500).json ({success: false, message: 'Error al subir nuevo video.'})
            }
        }

        if (duration_minutes && isNaN(parseInt(duration_minutes))) {
            return res.status(400).json({success: false, message: 'La duración debe ser un número válido.'});
        }
        

        const updatedData = {
            title: title ?? null,
            description: description ?? null,
            genre: genre ?? null,
            director: director ?? null,
            actors: actors ?? null,
            release_date: release_date ?? null,
            
            duration_minutes: duration_minutes ? parseInt(duration_minutes): null,
            ...(video_url && { video_url }),
            
        };

        const result = await adminContent.updateMovie(id, updatedData);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Película actualizada exitosamente.' });
        } else {
            res.status(404).json({ success: false, message: 'Película no encontrada.' });
        }

    } catch (error) {
        console.error('❌ Error al actualizar película:', error);
        res.status(500).json({ success: false, message: 'Error interno al actualizar película.' });
    }
};

















// Eliminar una película por ID
const deleteMovie = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await adminContent.deleteMovie(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Película eliminada correctamente.' });
        } else {
            res.status(404).json({ success: false, message: 'Película no encontrada.' });
        }
    } catch (error) {
        console.error('❌ Error al eliminar película:', error);
        res.status(500).json({ success: false, message: 'Error interno al eliminar película.' });
    }
};






module.exports ={
    addMovie,
    getAllMovies,
    deleteMovie,
    updateMovie
    
    


}