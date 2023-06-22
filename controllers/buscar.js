import { response } from "express";
import { Usuario, Categoria, Producto} from "../models/index.js";
import { Types } from 'mongoose';

const { ObjectId } = Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
    'productosPorCategoria'
];

const buscarUsuarios = async(termino='', res=response) => {
    try{
        const esMongoID = ObjectId.isValid(termino);

        if(esMongoID){
            const usuario = await Usuario.findById(termino).catch((error) => {
                throw error;
            });
            return res.json({
                results: (usuario) ? [usuario] : []
            })
        }

        const regex = new RegExp( termino, 'i' );

        const usuarios = await Usuario.find({ 
            $or: [{ nombre: regex }, { correo: regex }],
            $and: [{estado: true }]
        }).catch((error) => {
            throw error;
        });

        res.json({
            cantidad: usuarios.length,
            results: usuarios
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message: 'Ocurrió un error en el servidor'
        });
    };

}

const buscarCategorias = async(termino='', res=response) => {
    
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({nombre: regex, estado:true});

    res.json({
        cantidad: categorias.length,
        results: categorias
    });

}

const buscarProductos = async(termino='', res=response) => {
    
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const producto = await Producto.findById(termino)
                            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({nombre: regex, estado: true})
                            .populate('categoria', 'nombre');

    return res.json({
        cantidad: productos.length,
        results: productos
    });

}

const buscarProductosPorCategoria = async (termino = '', res = response) => {
    try {
        const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const producto = await Producto.find({categoria: termino})
                            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    
    const categorias = await Categoria.find({nombre: regex, estado:true});

    const productos = await Producto.find({
        $or: [...categorias.map( categoria => ({
            categoria: categoria._id
        }))],
        $and: [{ estado: true }]
    }).populate('categoria', 'nombre');

    return res.json({
        cantidad: productos.length,
        results: productos
    });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg: 'Error en el servidor',
      })
    }
  }

const buscar = (req, res=response) => {

    const { coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
        case 'productosPorCategoria':
            buscarProductosPorCategoria(termino, res);
        break;
        default:
            res.status(500).json({
                msg: 'Búsqueda por desarrollar'
            })
        break;
    }

};

export { buscar };