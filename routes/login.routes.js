var express = require('express');
var bcrypt = require('bcryptjs');
// libreria para json web token
var jwt =require('jsonwebtoken');

// Traemos la constante cemilla paramterizada desde un arhcivo de configuración
var SEED = require('../config/config').SEED;

var app = express();

var userEsquema = require('../models/user');



//====================
//CREAR UN LOGIN PARA EL USUSARIO
//====================
app.post('/', ( req, res ) => {

    var body = req.body;

    userEsquema.findOne({ email: body.email }, ( err, userDb ) => {

        // verificar si viene un error desde la base de datos
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ususarios en nuestra base de datos',
                errors: err
            });
        }

        // varificar o validar si existe el ususario en la base de datos
        if ( !userDb ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al verificar usuario, verifique sus credenciales - email',
                errors: err
            });
        }

        // verificar la contrasenia de ese ususario
        if (!bcrypt.compareSync (body.pass, userDb.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al verificar usuario, verifique sus credenciales - password',
                errors: err
            });
        }


        // Crear un token
        userDb.pass = ':)';
        var token = jwt.sign( { user: userDb }, SEED, {expiresIn: 1400} )

        res.status(200).json({
            ok: true,
            user: userDb,
            token: token,
            id: userDb._id
        });
    

    });

    
})









module.exports =  app;