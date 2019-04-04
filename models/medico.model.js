// variables requeridas de nuestra base de datos en mongo
var mongoose = require('mongoose');
// varaible para validaciondes 
var uniqueValidator = require('mongoose-unique-validator');


// ariable  que define nuestro schema
var Schema = mongoose.Schema;


var medicoShema = new Schema ( {

    nombre: { type: String, required: [ true, 'El nombre es requerido' ] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'User' },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }

});

module.exports = mongoose.model('Medico', medicoShema);