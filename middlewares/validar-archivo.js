
const validarArchivoSubir = (req, res=response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).send('No se ha subido ningún archivo - validarArchivoSubir');
        return;
    }

    next();
}

export{
    validarArchivoSubir
}