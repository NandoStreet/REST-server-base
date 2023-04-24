import mongoose from 'mongoose';
import { Role } from '../models/role.js';
import { Usuario } from '../models/usuario.js';

const esRolValido = async(rol='') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${ rol } no está registrado en la DB`);
    }
}

const emailExiste = async(correo='') => {
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ){
        throw new Error(`El correo ${ correo } ya está registrado`);
    }
}

const existeUsuarioPorId = async(id) => {
    if(mongoose.Types.ObjectId.isValid(id)){
        const existeUsuario = await Usuario.findById( id );

        if ( !existeUsuario ){
            throw new Error(`El id ${ id } no existe en la DB`);
        }
    }else{
        throw new Error(`El id ${ id } no es válido`);
    }
        
}

export { esRolValido, emailExiste, existeUsuarioPorId };