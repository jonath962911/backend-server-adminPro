//Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// requires rutas
var appRoutes = require('./routes/app.routes');
var userRoutes = require('./routes/user.routes');
var loginRoutes = require('./routes/login.routes');
var hopitalesRoutes = require('./routes/hopitales.routes');
var medicosRoutes = require('./routes/medicos.routes');
var busquedaRoutes = require('./routes/busqueda.routes');
var upload = require('./routes/upload.routes');


// Inicializar varaibles
var app = express();


// BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// Coneccion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDb', { useNewUrlParser: true }, ( err, res) => {
    if ( err ) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m ', 'online');
   });



//====================
//IMPORTACION DE TODAS LAS RUTAS
//====================
// rutas usuarrios
app.use('/user', userRoutes);
// ruta login
app.use('/login', loginRoutes);
// ruta Hospitales
app.use('/hospitales', hopitalesRoutes );
//Ruta de medicos
app.use('/medicos', medicosRoutes);
//Ruta de busquedas 
app.use('/busqueda', busquedaRoutes);
// Cargar imagenes al servidor
app.use('/upload', upload);
// Ruta general
app.use('/', appRoutes);







// Escuchar peticiones
app.listen(3000, ()=>{
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m ', 'online')
})



