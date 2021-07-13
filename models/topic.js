'use strict'

var moongose = require('mongoose');
const user = require('./user');
var Schema = moongose.Schema;

//Modelo de Comment
var CommentSchema = Schema({
    content: String,
    date: {
        type: Date, default: Date.now
    },
    user: {
        type: Schema.ObjectId, ref: 'User'
    }
});

var Comment = moongose.model('Comment', CommentSchema);

//Modelo de Topic
var TopicSchema = Schema({

    title: String,
    content: String,
    code: String,
    lang: String,
    date: { type: Date, default: Date.now }, //se puede pasar una configuracion por defecto donde mande la fecha actual en caso que no mande nada
    user: {
        type: Schema.ObjectId, ref: 'User' // Esta es una especie de relacion, donde para cada topico relacionamos con un usuario que ha creado el topic
    },
    comments: [CommentSchema] //se guardaran colecciones de datos con las propiedades de los comentarios

});
module.exports = moongose.model('Topic', TopicSchema);