import { Router } from 'express';
import { check } from 'express-validator';
import {validarCampos,
    validarJWT,
    esAdmin,
    tieneRole} from '../middlewares/index.js';
import { actualizarCategoria, 
    borrarCategoria, 
    crearCategoria, 
    obtenerCategoria, 
    obtenerCategorias } from '../controllers/categorias.js';
import { existeCategoriaPorId } from '../helpers/db-validators.js';

const routerCat = Router();

/**
 * {{url}}/api/categorias
 */

//OBTENER TODAS LAS CATEGORIAS - PUBLICO
routerCat.get('/', obtenerCategorias);

//OBTENER UNA CATEGORIA POR ID - PUBLICO
routerCat.get('/:id', [
    check('id', 'No es un ID de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos    
 ], obtenerCategoria);

//CREAR CATEGORÍA - PRIVADO - CUALQUIER TOKEN VALIDO
routerCat.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//ACTUALIZAR CATEGORIA POR ID - PRIVADO - CUALQUIERA CON TOKEN VALIDO
routerCat.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

//BORRAR LA CATEGORIA - ADMIN
routerCat.delete('/:id', [
    validarJWT,
    esAdmin,
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);


export { routerCat };
