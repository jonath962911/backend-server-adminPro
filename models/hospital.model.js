// Importacion de mongo
var mongoose = require('mongoose');
// Estrcutura de Schema de mongo
var Schema = mongoose.Schema;
//Libreria para hacer unico un parametro
var uniqueValidator = require('mongoose-unique-validator');



var hospitalSchema = new Schema ( { 
    nombre: { type: String, unique: true, required: [ true, 'El nombre es necesario' ] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'User' }
 }, { collection: 'hospitales' } );

 hospitalSchema.plugin( uniqueValidator, { message: "{PATH} debe ser unico" } );

 module.exports = mongoose.model('Hospital', hospitalSchema);