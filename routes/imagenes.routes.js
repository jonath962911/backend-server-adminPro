
var express = require('express');



var app = express();

const path = require ('path');
const fs = require('fs');


// ruta principal
app.get('/:tipo/:img', (request, res, next) => {

    var tipo = request.params.tipo;
    var img = request.params.img;

    // Crear un path para verificar si la imagen existe, sino existe se mostrara una imagen por defecto
    // usaremos una libreira que nos hara esta funcion


    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    // verificar si la imagen existe en ese path

    if ( fs.existsSync( pathImagen ) ) {
        res.sendFile(pathImagen)
    } else {
        var pathNoImage = path.resolve( __dirname, '../assets/img/no-img.jpg');
        res.sendFile(pathNoImage);
    }


} )




module.exports = app;