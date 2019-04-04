
var express = require('express');



var app = express();

var hospitalShema = require("../models/hospital.model");
var medicosShema = require('../models/medico.model');
var usuarioShema = require('../models/user');


// ruta principal
app.get('/todo/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var regx = new RegExp( busqueda, 'i' );


    // Buscar en varias colleciones
    Promise.all([
       
        buscarHospitales(busqueda, regx),
        buscarMedicos(busqueda, regx),
        buscarUsuarios(busqueda, regx)
    ])
    .then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });

 
        });


function buscarHospitales (busqueda, regEx) { 
     return new Promise( (resolve, reject) => {
            hospitalShema.find({nombre: regEx}, (err, hospitales) =>{
                if(err){
                    reject('error alc argar hospitales', err);
                } else {
                    resolve(hospitales)
                }
            });
     } );
}

function buscarMedicos (busqueda, regEx) { 
    return new Promise( (resolve, reject) => {
           medicosShema.find({nombre: regEx}, (err, medicos) =>{
               if(err){
                   reject('error al cargar medicos', err);
               } else {
                   resolve(medicos)
               }
           });
    } );
}

function buscarUsuarios (busqueda, regEx) { 
    return new Promise( (resolve, reject) => {
           usuarioShema.find({}, 'nombre email role')
                       .or([ { nombre: regEx}, { email: regEx} ])
                       .exec( (err, usuarios) =>{
                           if(err){
                            reject('Error al cargar usuarios', err)
                       } else {
                           resolve(usuarios)
                       }

                       } );
    } );
}


//====================
//BUSCAR POR COLLECIÓN 
//====================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.param.busqueda;
    var tabla = req.params.tabla;

    var regx = new RegExp( busqueda, 'i' );

    var promesa;

    switch( tabla ){
        case 'ususarios':
        promesa = buscarUsuarios(busqueda, regx);
        break;

        case 'hospitales':
        promesa = buscarHospitales(busqueda, regx);
        break;

        case 'medicos':
        promesa = buscarMedicos(busqueda, regx);
        break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Peticion de buscqueda realizada incorrectaente',
                errors: 'la tabla no fue encontrada'
            })        
    }

    promesa.then( data => {
        res.status(200).json({
            ok: true,
            mensaje: 'Peticion de buscqueda realizada correctamente',
            [tabla]: data
        });
    } );

});


module.exports = app;