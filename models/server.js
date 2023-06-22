import express from 'express';
import cors from 'cors';
import { router } from '../routes/usuarios.js'; 
import { routerAuth } from '../routes/auth.js'; 
import { dbConnection } from '../db/config.js';
import { routerCat } from '../routes/categorias.js';
import { routerPro } from '../routes/productos.js';
import { routerBuscar } from '../routes/buscar.js';

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
            productos: '/api/productos'
        }
        //Conectar DB
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Routes de mi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );
    }

    routes(){

        this.app.use(this.paths.auth, routerAuth);
        this.app.use(this.paths.categorias, routerCat);
        this.app.use(this.paths.usuarios, router);
        this.app.use(this.paths.productos, routerPro);
        this.app.use(this.paths.buscar, routerBuscar);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port );
        });
    }
}

export { Server };