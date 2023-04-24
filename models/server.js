import express from 'express';
import cors from 'cors';
import { router } from '../routes/usuarios.js'; 
import { dbConnection } from '../db/config.js';

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

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

        this.app.use(this.usuariosPath, router);
        
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port );
        });
    }
}

export { Server };