// varialbes necesarioas de express
var express = require('express');
var app = express();


// Variable quye nos traera el Schema de el medico
var medicoSchema = require('../models/medico.model');

// Configuracion de autenticacion por medio del token 
var mdAutenticacion =require ('../middlewares/autenticacion');


//====================
//OBTENER TODOS LOS medicos
//====================
app.get('/', ( req, res, next ) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    medicoSchema.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre usuario')
        .exec(
        ( err, medicos ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar medicos',
                errors: err
            });
        }

        medicoSchema.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true,
                total: conteo,
                medicos: medicos
            })

        });

        

    });

});


//====================
//CREAR UN MEDICO
//====================
app.post('/', mdAutenticacion.verificaToken, ( req, res, next ) => {

    var body = req.body;
    var medico = new medicoSchema ({

        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital

    });


    medico.save( ( err, medicoGuardado ) => {

        if ( err ) {
            return res.status(402).json({
                ok: false,
                mensaje: 'Error en ls BD al crear un nuevo medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
        });

    });

});


//====================
//ACTUALIZAR LOS DATOS DE UN MEDICO 
//====================  
app.put('/:id', mdAutenticacion.verificaToken, ( req, res ) => {

    var id = req.params.id;
    var body = req.body;

    medicoSchema.findById( id, ( err, medico) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar usuario',
                errors: err
            });
        }

        if( !medico ) {
            return res.status(500).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe en la base de datos`,
                errors: err
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario= req.usuario._id;
        medico.hospital = body.hospital;


        medico.save( (err, medicoGuardado) => {

            if( err ) {
                return res.status(400).json({
                    ok:false,
                    mensaje:  'Error al acutalizar el meico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            })

        } );
    });

})

//====================
//BORRAR UN MEDICO
//====================

app.delete('/:id', mdAutenticacion.verificaToken, ( req, res ) => {

    var id = req.params.id;

    medicoSchema.findByIdAndRemove( id, (err, medicoEliminado) =>{

        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al encontrar medico para borrar',
                errors: err
            });
        }

        if ( !medicoEliminado ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese nombre ni Id',
                errors: { message: 'No se encuentra ese mendico' },
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoEliminado
        });
    } );

});












module.exports = app;