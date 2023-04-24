import { request, response } from 'express';
import { Usuario } from '../models/usuario.js';
import bcryptjs from 'bcryptjs';

//  GET
const usuariosGet = async(req = request, res = response) => {
    
    //const { q, nombre = 'No name', apikey} = req.query;
    const { limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    //const usuarios = await Usuario.find(query)
    //.skip(desde)
    //.limit(limite);
    
    //const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total,
        usuarios
    });
}
//  PUT
const usuariosPut = async(req, res = response) => {
    
    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;
    
    //TODO validar en la database
    if ( password ){
        //ENCRIPTAR CONTRASEÑA
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json(usuario);
}
//  POST
const usuariosPost = async(req, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;

    const usuario = new Usuario({nombre, correo, password, rol});
  
    //ENCRIPTAR CONTRASEÑA
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //GUARDAR EN DB
    await usuario.save();

    res.status(201).json(usuario);
}
//  PATCH
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - controlador"
    });
}
//  DELETE  
const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json(usuario);
}

export { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosPatch, 
        usuariosDelete };