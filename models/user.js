'use strict'

//ORT:  mapeo relacional de objetos, capa de abstraccion sobre la cual tenemos clases, metodos propiedades que agilizan la interaccion con la base de datos

var moongose = require('mongoose'); // importamos moongose que es para intecractuar con la base de datos
var Schema = moongose.Schema; //permite crear esquemas en la base


//En esta variable esquema creamos un nuevo esquema pasando un json que seran las propiedades que queremos
var UserSchema = Schema({

    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    roles: String,
});

//Eportar el modulo  para luego importarlo en cualquier otro archivo

module.exports = moongose.model('User', UserSchema); //Generar un objeto de usuario con todas las propiedades y esta relaciondo al schema.
//Cuando yo guarde va a crear una nueva coleccion y se guardara: hará un lowercase y pluralizar el nombre es decir se mostrara: users -> documentos con las propiedades definidas
