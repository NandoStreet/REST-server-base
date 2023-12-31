import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { actualizarImagen, actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from '../controllers/uploads.js';
import { coleccionesPermitidas } from '../helpers/db-validators.js';
import { validarArchivoSubir } from '../middlewares/validar-archivo.js';

const routerUP = Router();

routerUP.post('/', validarArchivoSubir, cargarArchivo);

routerUP.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', ' El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagenCloudinary);

routerUP.get('/:coleccion/:id', [
    check('id', ' El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagen);

export { routerUP };
