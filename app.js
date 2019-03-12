//Requires

var express = require('express');
var mongoose = require('mongoose');


// Inicializar varaibles

var app = express();


// Coneccion a la base de datos

// mongoose.connection.openUri('mongodb://localhost::27017/hospitalDb', (err, res ) => {
    
//     if ( err ) throw err;

//     console.log('Base de datos: \x1b[32m%s\x1b[0m ', 'online');

    

// })

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDb', { useNewUrlParser: true }, ( err, res) => {
    if ( err ) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m ', 'online');
   });


   

// rutas
app.get('/', (request, response, next) => {

    response.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    })

} )




// Escuchar peticiones

app.listen(3000, ()=>{
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m ', 'online')
})