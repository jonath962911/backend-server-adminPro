
var express = require('express');
var bcrypt = require('bcryptjs');


// libreria para json web token
var jwt =require('jsonwebtoken');

var mdAutenticacion =require ('../middlewares/autenticacion');

var app = express();

var userEsquema = require('../models/user');


// ===============================
//  OBTENER TODOS LOS USUSARIOS
// ===============================
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    userEsquema.find({  },  'nombre email img role')
    
    .skip(desde)
    .limit(5)
    .exec(        
        (error, users) => {

        if ( error ) {
            return  response.status(500).json({
                ok: false,
                mensaje: 'Error db al momento de cargar usuarios',
                errors: error
            });
        }

        userEsquema.count({}, (err, conteo) => {

            response.status(200).json({
                ok: true,
                mensaje: 'Get de ususarios',
                users: users,
                total: conteo
            });

        });
    })

    

} )


// ===============================
//  cREAR UN NUEVO USUSARIO
// ===============================
app.post('/',  (req, res) => {

    var body = req.body; /*Lo usamos para parserar la informacion - Es un libreria externa*/

    var user = new userEsquema( {  /* Definicion para crear un nuevo ususario en la base de datos */
        nombre: body.nombre,
        email: body.email,
        pass: bcrypt.hashSync( body.pass, 10),
        img: body.img,
        role: body.role
    })

    user.save( (error, usuarioGuardado) => { 

       if( error ) {
           return res.status(400).json({
               ok: false,
               mensaje: 'Error db- Al crear un ususairo',
               errors: error
           });
       } 

       res.status(201).json({
           ok: true,
           user: usuarioGuardado,
           usuariotoken: req.usuario,
           body: body
       });

     } );


})


//====================
//ACTUALIZAR USUSARIO
//====================

app.put('/:id', mdAutenticacion.verificaToken, (req, res)=> {

    var id = req.params.id;
    var body = req.body;


    //Verificar si un usuario existe con ese id
     userEsquema.findById( id,  ( error, usuario )=> {
        
       if( error ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        } 

        if ( !usuario ) {

            return res.status(500).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                errors: {  message: 'No existe el ususario con ese ID ' }
            });            
        }


        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (error, usuarioGuardado) => {

            if( error ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: error
                });
            }   

            usuarioGuardado.password = ':)';
            
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        } );
     } );

} );

//====================
//BORRAR UN USUARIO
//====================


app.delete( '/:id' , mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;


    userEsquema.findByIdAndRemove(id, (error, userDelete) => {

        if( error ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: error
            });
        }   
        

        if( !userDelete ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'Recarga la pagina del listado de ususarios para verificar su existencia' }
            });
        }   

        res.status(200).json({
            ok: true,
            usuario: userDelete
        });

    })

} )


module.exports = app;