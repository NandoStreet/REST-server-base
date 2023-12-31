import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'jfif'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length  - 1 ];

        //Validar la extension
        if( !extensionesValidas.includes( extension ) ){
            return reject(`La extension ${ extension } no es permitida - Extensiones permitidas: ${ extensionesValidas }`);
        }

        const nombreTemp = uuidv4() + '.' + extension; // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp );

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve( nombreTemp );
        });
    });
    
}

export{ subirArchivo }