
var express = require('express');

// Importacion de la libreria para subir archivos
var fileUpload = require('express-fileupload');

var app = express();

// Importacion del fileSistem para borrar el path
var fs = require('fs');

var usuarioShema = require('../models/user');
var medicosSchema = require('../models/medico.model');
var hospitalesSchema = require('../models/hospital.model');

// default options
app.use(fileUpload({
    useTempFiles : true,
}));
// ruta principal
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;  //traemos el tipo de archivo por la url 
    var id = req.params.id  //Traemos el id del ususario que queremos actualizar


    // Validamos que el tipo de colección enviado por url sea valido o unos de los tres sigueintes
    // Tipos de coleccion
    var tiposValidos = [ 'hospitales', 'medicos', 'usuarios'];
    if ( tiposValidos.indexOf( tipo) < 0 ){
        return res.status(400).json({
           ok: false,
           mensaje: 'Tipo de coleccion no valida',
           errors: { message: 'Tipo de coleccion no valida'}
        });
    }



    if( !req.files ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al seleccionr archivos',
            errors: { message: 'debe seleccionar una imagen' }
        });
    }

// Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');     
    var extencionArchivo = nombreCortado[ nombreCortado.length - 1 ];


    // Solo se aceptan las siguiente extenciones
     var extencionesValidas = ['png', 'jgp', 'gif', 'jpg'];

     if ( extencionesValidas.indexOf( extencionArchivo) < 0 ){
         return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida',
            errors: { message: 'Las extenciones permitidas para las imagenes son: png, jpg, gif y jpeg'}
         });
     }


    //  Nombre del archivo personalizado, o renombrar archivo

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${ extencionArchivo }`;

    // Mover el archivo del temporal a un path

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(500).json({
        //     ok: true,
        //     mensaje: 'Archivo movido ',
        // })
    })

} )


function subirPorTipo ( tipo, id, nombreArchivo, res ) {

    if ( tipo === 'usuarios' ) {
        // Buscamos que esxista el ususario en la base de datos
        usuarioShema.findById( id, (err, usuario) => {

            // Validacion para el ususario
            if ( !usuario ) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'El usuario enviado por la url no existe en la basa de datos' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe la imagen la elimina
            if (fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            // Subir el nombre del archivo

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) =>{

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de ususario actualizada',
                    usuario: usuarioActualizado
                });

            })



        } )
    }

    if ( tipo === 'medicos' ) {

        medicosSchema.findById( id, (err, medico) =>{

            if ( !medico ) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'medico no existe',
                    errors: { message: 'El medico enviado por la url no existe en la basa de datos' }
                });
            }
           
            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe la imagen la elimina
            if( fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            // subir el nuevo archivo

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });


            });


            
        });        
        
    }

    if ( tipo === 'hospitales' ) {
        
        hospitalesSchema.findById( id, (err, hospital) =>{

            if ( !hospital ) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'hospital no existe',
                    errors: { message: 'El hospital enviado por la url no existe en la basa de datos' }
                });
            }
           
            var pathViejo = './uploads/hosiptales/' + hospital.img;

            // Si existe la imagen la elimina
            if( fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            // subir el nuevo archivo

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada correctamente',
                    hospital: hospitalActualizado
                });


            });


            
        });        
        
    }

}
 




module.exports = app;