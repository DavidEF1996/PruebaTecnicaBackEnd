'use strict'

//Crear el servidor para receptar las peticiones con express

//Requieres
var express = require('express'); //importamos express que servira para estar escuchando las peticiones
var bodyParser = require('body-parser');//body parser analiza todas las peticiones entrantes


//Ejecutar Express

var app = express(); // iniciamos express en la variable app




//Cargar archivos de rutas
var user_routes = require('./routes/user'); //importamos el archivo de rutas de la carpeta routes user.js



//Middlwares : acciones que se ejecutan antes de llegar a las acciones de los controladores
app.use(bodyParser.urlencoded({ extended: false })); // activar body parser para que convierta lo que lleve de peticiones a objetos de javascript
app.use(bodyParser.json());//convierte los objetos en json

//Configurar Cors: activar  o permitir el dominio o diferentes dominios


//Reescribir rutas

app.use('/api', user_routes); // reescribimos las rutas anteponiendo /api, y luego pasamos el archivo importado de las rutas



//Ruta/metodo  de prueba

/*app.get('/prueba', (req, res) => {
    return res.status(200).send({
        message: "Hola mundo desde el back-end con node",
        nombre: 'David Egas'
    });
});*/






//Exportar el modulo
module.exports = app;



