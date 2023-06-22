import { request, response } from "express";
import { Categoria } from "../models/index.js";

const obtenerCategorias = async(req = request, res = response) => {
    //paginado - total - populate
    const { limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre') 
            .exec() 
    ]);

    res.json({
        total,
        categorias
    });
}

const obtenerCategoria = async(req = request, res = response) => {
    
    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate( 'usuario', 'nombre');

    res.json(categoria);
}

const actualizarCategoria = async(req = request, res = response) => {
    const id = req.params.id;
    const { estado, usuario, ...data } = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
    
    res.json(categoria);
}

const borrarCategoria = async(req = request, res = response) => {
    const { id } = req.params;

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, {new: true});

    res.json({categoriaBorrada});
}


const crearCategoria = async(req, res =  response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        });
    }

    //Generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data); 

    //Guardar DB
    await categoria.save();

    res.status(201).json(categoria);
}


export { obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria, crearCategoria }