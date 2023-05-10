
import { Router } from 'express';
import { usuariosDelete, 
        usuariosGet, 
        usuariosPatch, 
        usuariosPost, 
        usuariosPut } from '../controllers/usuarios.js';
import { check } from 'express-validator';

import { emailExiste, esRolValido, existeUsuarioPorId } from '../helpers/db-validators.js';

//import { validarCampos } from '../middlewares/validar-campos.js';
//import { validarJWT } from '../middlewares/validar-jwt.js';
//import { esAdmin, tieneRole } from '../middlewares/validar-roles.js';
import {validarCampos,
        validarJWT,
        esAdmin,
        tieneRole} from '../middlewares/index.js';


const router = Router();

router.get('/', usuariosGet );

router.put('/:id',[
        //check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        //body('rol').custom( esRolValido ),
        validarCampos
] , usuariosPut);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser más de 8 caracteres').isLength({min:8}),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom( emailExiste ),
        //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom( esRolValido ),
        validarCampos
], usuariosPost);

router.delete('/:id', [
        validarJWT,
        //esAdmin,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id').custom(existeUsuarioPorId),
        validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

export { router };