import { Router } from 'express';
import { check } from 'express-validator';
import {validarCampos,
    validarJWT,
    esAdmin,
    tieneRole} from '../middlewares/index.js';
import { actualizarProducto, 
    borrarProducto, 
    crearProducto, 
    obtenerProducto, 
    obtenerProductos } from '../controllers/productos.js';
import { existeCategoriaPorId, existeProductoPorId } from '../helpers/db-validators.js';

const routerPro = Router();

/**
 * {{url}}/api/categorias
 */

//OBTENER ALL PRODUCTOS - PUBLICO
routerPro.get('/', obtenerProductos);

//OBTENER UN PRODUCTO POR ID - PUBLICO
routerPro.get('/:id', [
    check('id', 'No es un ID de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos   
 ], obtenerProducto);

//CREAR PRODUCTO - PRIVADO - CUALQUIER TOKEN VALIDO
routerPro.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//ACTUALIZAR PRODUCTO POR ID - PRIVADO - CUALQUIERA CON TOKEN VALIDO
routerPro.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

//BORRAR LA CATEGORIA - ADMIN
routerPro.delete('/:id', [
    validarJWT,
    esAdmin,
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);


export { routerPro };
