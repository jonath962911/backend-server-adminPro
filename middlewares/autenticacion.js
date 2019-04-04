// libreria para json web token
var jwt = require('jsonwebtoken');

// Traemos la constante cemilla parametrizada desde un arhcivo de configuración
var SEED = require('../config/config').SEED;



//====================
//VERIFIVAR TOKEN
//====================

exports.verificaToken = function( req, res, next ){
    
    var token = req.query.token;

    jwt.verify( token, SEED, (error, decoded) => {
        if ( error ) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no valido',
                errors: error
            });
        }

        req.usuario = decoded.user;

        next();
    });
}