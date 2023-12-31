import path from 'path';
import fs from 'fs';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: 'dawpgfyy7', 
    api_key: '148613341633556', 
    api_secret: 'c_Fgvqdd79WVmcbti0G7S4FOHg4' 
  });

import { response } from 'express';
import { subirArchivo } from '../helpers/index.js';
import { Usuario, Producto} from '../models/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cargarArchivo = async( req, res=response ) => {

    try {
        //archivos de texto
        //const nombre = await subirArchivo(req.files, [ 'pdf', 'txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre });

    } catch (error) {
        res.status(400).json({error});
    }

    
}

const actualizarImagen = async( req, res=response ) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

        break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //Limpiar imagenes previas
    if ( modelo.img ){
        //hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads/', coleccion, modelo.img );
        if(fs.existsSync( pathImagen )){
            fs.unlinkSync( pathImagen );
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({ modelo });

}

const actualizarImagenCloudinary = async( req, res=response ) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

        break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //Limpiar imagenes previas
    if ( modelo.img ){
        //Hay que borrar la imagen del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id ); 
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;

    await modelo.save();

    res.json( modelo );

}


const mostrarImagen = async(req, res=response)  => {
    
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

        break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //Limpiar imagenes previas
    if ( modelo.img ){
        //hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads/', coleccion, modelo.img );
        if(fs.existsSync( pathImagen )){
            return res.sendFile( pathImagen)
        }
    }

    const placeholder = path.join( __dirname, '../assets/no-image.jpg' );
    return res.sendFile( placeholder);

}

export { cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen };