// importacion de express
var express = require('express');
var app = express();


// Importacion del modelo
var hospitalSchema = require('../models/hospital.model');

// Imprtar la veririfcacion del toke
var mdAutenticacion =require ('../middlewares/autenticacion');

//====================
//OBTENER TODOS LOS HOSPITALES
//====================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    hospitalSchema.find({})

        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
        ( err, hospitales ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar Hopitales',
                errors: err
            })
        }

        hospitalSchema.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true,
                total: conteo,
                hospitales: hospitales,
            })

        });

        

    } );

});

//====================
//CREAR HOSPITALES
//====================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new hospitalSchema ({

        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id

    })

    hospital.save( (err, hospitalGuardado) => {

        if( err ) {
            return res.status(402).json({
                ok: false,
                mensaje: 'Error en la BD al crear un hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioToken: req.usuario
        })

    } )

}) 

//====================
//ACTUALIZAR LOS DATOS DE UN HOSPITAL
//====================

app.put('/:id', mdAutenticacion.verificaToken, ( req, res ) => {

    // varaible que nos indicar el ususario que queremos actualizar
    var id = req.params.id;
    // Varaible del body de nuestro modelo
    var body = req.body;

    //Verificar si un usuario existe
    hospitalSchema.findById( id, ( err, hospital ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar este ususario',
                errors: error
            })
        }

        if ( !hospital ) {
            return res.status(500).json({
                ok: false,
                menssaje: `El Hospita con el id ${id} No existe en la base de datos`,
                errors: { mensaje: 'No existe Hospital con ese ID ' }
            })
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id;


        hospital.save( ( err, hospitalGuardado ) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital, try again',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        } );

    } );

} );


//====================
//BORRAR UN HOSPITAL
//====================
app.delete( '/:id', mdAutenticacion.verificaToken, ( req, res ) => {

    var id = req.params.id;

    hospitalSchema.findByIdAndRemove( id, ( err, hospitalDelete ) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
        }

        if ( !hospitalDelete ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un unsuario con ese id para borrar',
                errors: { message: 'Verifica bien el id' }
            });

        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDelete
        })



    });
});


module.exports = app;