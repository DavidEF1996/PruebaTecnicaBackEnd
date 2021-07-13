'use strict'

//importar la libreria de moongose para conectarme a mongo
var mongoose = require('mongoose'); //importamos moongose para tener los metodos de conexion a mongoose
var app = require('./app'); //importamos el archivo app.js donde esta la creacion del servidor
var port = process.env.PORT || 3999; //puerto donde se estaran escuchando los datos


mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise; // es para trabajar con promesas, es decir mientras va cumpliendo una se ejecuta otra
mongoose.connect('mongodb://localhost:27017/foro', { useNewUrlParser: true }).then(() => {
    console.log('Conexion Exitosa');

    //Crear el servidor cuando este una conexion exitosa

    app.listen(port, () => {
        //como app esta importando el archivo app.js tiene los metodos de express entonces llamamos a listen que escuchara el puerto si es que todo esta bien
        console.log("El servidor esta corriendo correctamente");
    })
}).catch(error => console.log(error));//sino mandara el error
  //nombre de la base de datos
