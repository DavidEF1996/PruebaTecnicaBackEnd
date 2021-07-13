'use strict'
//IMPORTACIONES
var express = require('express');
var middleware = require('../middlewares/authenticated');
var UserController = require('../controller/user'); //cargamos el controlador con los metodos
var multipart = require('connect-multiparty');


//VARIABLES
var uploadMultipart = multipart({uploadDir: './uploads/users'});

//RUTAS
var router = express.Router(); //usamos el metodo router de express

router.get('/probando2', UserController.probando); // asignamos una ruta para cada metodo de nuestro controlador
router.post('/testeando', UserController.testeando);


//Rutas para el usuario
router.post('/registrar', UserController.registrar);
router.post('/login', UserController.login);
router.put('/update', middleware.authenticated, UserController.update); // se usa put porque es el que se usa para actualziar en el backend
//se pasa el middleware y si todo va bien continuara a update
router.post('/uploadAvatar',[middleware.authenticated,uploadMultipart], UserController.uploadAvatar);//le pasamos un id a la ruta para identificar que usuario sube la imagen
//para la subida de imagenes, pasamos el middleware de autenticacion para obtener el id del usario y el middleware multipart para subir imagenes
router.get('/avatar/:fileName',UserController.avatar ); // extraer el avatar
router.get('/allUsers', UserController.users);
router.get('/usuario/:userId', UserController.getByEmail);


module.exports = router; // esportamos el modulo para ser usado en app.js