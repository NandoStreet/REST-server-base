import mongoose from 'mongoose';
import { Categoria, Role, Usuario, Producto } from '../models/index.js';

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

const existeCategoriaPorId = async(id) => {
    if(mongoose.Types.ObjectId.isValid(id)){
        const existeCategoria = await Categoria.findById( id );

        if ( !existeCategoria ){
            throw new Error(`El id ${ id } no existe en la DB`);
        }
    }else{
        throw new Error(`El id ${ id } no es válido`);
    }
        
}

const existeProductoPorId = async(id) => {
    if(mongoose.Types.ObjectId.isValid(id)){
        const existeProducto = await Producto.findById( id );

        if ( !existeProducto ){
            throw new Error(`El id ${ id } no existe en la DB`);
        }
    }else{
        throw new Error(`El id ${ id } no es válido`);
    }
        
}

const coleccionesPermitidas = (coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ){
        throw new Error(`La coleccion ${ coleccion } no es permitida, (${ colecciones })`);
    }

    return true;
}

export { esRolValido, emailExiste, existeUsuarioPorId, existeCategoriaPorId, existeProductoPorId, coleccionesPermitidas };