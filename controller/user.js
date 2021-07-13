'use strict'

//Serie de acciones y logica del servidor

var validator = require('validator'); // tengo el objeto con los datos para validar 
var User = require('../models/user'); // esta es la importacion del modelo de usuario
var bcrypt = require('bcrypt-nodejs'); // importamos la libreria bcryp para cifrar contraseñas
var jwt = require('../services/jwt');
var fs = require('fs'); // libreria para trabajar con ficheros
var path = require('path'); // trabajar con paths



var controller = {
    //Objeto json donde van las funciones

    probando: function (req, res) {
        //para obtener una respuesta hay que pasar el request y el response
        return res.status(200).send({
            message: "Soy el metodo probando"
        });
    },
    testeando: function (req, res) {
        return res.status(200).send({
            message: "Soy el metodo testeando"
        });
    },

    registrar: function (req, res) {
        var params = req.body; // esta variable recibe los parametros recibidos
        try {        // PRIMER PASO: Recoger los parámetros de la petición
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar",

            });
        }
        // console.log(validate_name, validate_surname, validate_email, validate_password);

        //SEGUNDO PASO: Validar los datos
        if (validate_name && validate_surname && validate_email && validate_password) {

            //TERCER PASO: Crear el objeto de usuario
            var user = new User(); // creamos un nuevo objeto tipo usuario

            //CUARTO PASO: Asignar valores al objeto usuario
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.roles = 'ROLE_USER';
            user.image = null;

            //QUINTO PASO: Comprobar si ya existe
            User.findOne({
                email: user.email
            }, (err, issetUser) => {
                if (err) {
                    return res.status(500).send({
                        message: "Problema al comprobar duplicidad"
                    });
                }
                if (!issetUser) {
                    //SEXTO PASO: Si no existe, cifrar la contraseña 
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;
                        //SEPTIMO PASO: Guardar el Usuario
                        user.save((err, userStored) => {
                            if (err) {
                                return res.status(500).send({
                                    message: "Error al guardar el usuario"
                                });
                            }
                            if (!userStored) {
                                return res.status(400).send({
                                    message: "El usuario no se ha guardado"
                                });
                            }


                            //OCTAVO PASO: Devolver respuesta
                            return res.status(200).send({
                                status: 'success',
                                user: userStored
                            });// close save

                        });//close bcryp


                    });



                } else {
                    return res.status(500).send({
                        message: "El usuario ya existe"
                    });
                }
            });


        } else {
            return res.status(200).send({
                message: "Validacion no esta pasando"
            });
        }


        /*YA NO HACE FALTA PORQUE YA ESTA ENTRANDO EN LAS OTRAS VALIDACIONES 
        return res.status(200).send({
             message: "Registro de usuarios",
             params, //si mandamos directamente en el json params podemos ver todos los datos
             //email:  params.email // podemos ver solo un dato
 
         });*/

    },

    //METODO DE LOGIN
    login: function (req, res) {
        //Recoger los parametros de la peticion
        var params = req.body;

        //Validar los datos
        try {
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar",

            });
        }
        if (!validate_email || !validate_password) {
            return res.status(200).send({
                message: "Los datos son incorrectos"
            });
        }

        //Buscar usuarios que coincidad con el email

        User.findOne({
            //Esta funcion me busca la coincidencia 
            email: params.email.toLowerCase()
        }, (err, user) => {

            if (err) {
                return res.status(500).send({
                    message: "Error al intentar iniciar sesión",
                    user
                });
            }
            if (!user) {
                return res.status(404).send({
                    message: "El usuario no existe",
                    user
                });
            }

            //Si lo encuentra
            //Comprobar la contraseña (coincidencia de email y password )
            bcrypt.compare(params.password, user.password, (err, check) => {
                //esta funcion reciber el error y un check de true o false



                //Si es correcto
                if (check) {
                    //Generar token de jwt y devolverlo (mas tarde)
                    if (params.gettoken) {
                        //si tengo el token devuelvo este 

                        //Devolver los datos
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        //Limpiar el objeto es decir eliminar la contraseña para el usuario
                        user.password = undefined; // esto evita que se muestre la contraseña al cliente

                        //Devolver los datos
                        return res.status(200).send({
                            message: "succes",
                            user
                        });
                    }


                } else {
                    return res.status(404).send({
                        message: "Las credenciales no son correctas",

                    });

                }



            });


        });


    },

    update: function (req, res) {

        //PASO1 : RECOGER DATOS DEL USUARIO
        var params = req.body;

        //PASO 2: Validar los datos
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar",

            });
        }

        //PASO3: Eliminar propiedades innecesarias

        delete params.password;

        //PASO ADICIONAL: Comrpobar si el email es unico
        if(req.user.email!=params.email){
            User.findOne({
                //Esta funcion me busca la coincidencia 
                email: params.email.toLowerCase()
            }, (err, user) => {
    
                if (err) {
                    return res.status(500).send({
                        message: "Error al intentar iniciar sesión",
                        
                    });
                }
                if (user && user.email== params.email) {
                    return res.status(200).send({
                        message: "El email no puede ser modificado",
                        
                    });
                }
                });
        }else{

        //PASO4: Buscar y actualizar documento
        var userId = req.user.sub; //capturammos el id que viene de la base de datos y sub es lo que teniamos en el payload
        User.findOneAndUpdate({
            _id: userId //comparamos los dos id
        }, params, { new: true }, (err, userUpdate) => {

            if (err || !userUpdate) {
                return res.status(200).send({
                    status: 'error',
                    message: 'Error al actualizar'

                });
            }

            if (!userUpdate) {
                return res.status(200).send({
                    status: 'error',
                    message: 'No se a actualizado el usuario'

                });
            }


            return res.status(200).send({
                status: "succes",
                user: userUpdate

            });
        }); //se pasa la condicion, los datos a actualizar, opciones y el callback



}


    },



    //METODO PARA SUBIR EL AVATAR DEL USUARIO

    uploadAvatar: function (req, res) {

        //Configurar el modulo multiparty que es un middleware para subir imagenes
            //Este paso ya se hizo en routes---------------------

        //Recoger el fichero de la peticion
        var file_name = 'Avatar no subido...';

        console.log(req.files);
        if(!req.files){
            console.log("llego");
            return res.status(404).send({
                status:"error",
                message: file_name,
            });
            
            
        }
        console.log("paso");
//Conseguir el nombre y la extension del archivo subido

var file_path=req.files.files.path; //variable para la ruta de la imagen
var file_split= file_path.split('\\'); //separar los trozos de la ruta en segmentos para sacar el nombre del fichero
var file_name = file_split[2];// este ya es el nombre que ira a la base de datos


        //Comprobar la extensión(solo imagenes), si no es valida borrar fichero subido
        var ext_split = file_name.split('\.'); // separamos el nombre de la extension
        var file_ext = ext_split[1]; // guardamos la extension para que solo se suba imagenes

        if(file_ext != 'jpg' && file_ext != 'png' && file_ext != 'jpeg' && file_ext!='gif' ){
                fs.unlink(file_path,(err)=>{
                    return res.status(200).send({
                        status: "error",
                        message: "La extension no es valida"
                    });
                })
        }else{

        //Sacar el id del usuario identificado
        var userId = req.user.sub;

        //Buscar y actualizar documentos de la base de datos
        User.findOneAndUpdate({_id:userId},{
            image:file_name
        },{new:true},(err, userUpdate)=>{

            if(err||!userUpdate){
                return res.status(500).send({
                    message: "Error al actualizar",
                    status: "error"
                });
            }else{
                return res.status(200).send({
                    message: "UPLOAD AVATAR",
                    file: file_split
                });
            }

           
        });
        
        
    
        }

    },

    avatar : function (req, res) {
        var file_name = req.params.fileName;
        var path_file = './uploads/users/' + file_name;

        fs.exists(path_file, (exists)=>{
                if(exists){
                    return res.sendFile(path.resolve(path_file));
                }else{
                    return res.status(404).send({
                        message: "La imagen no existe"
                    });
                }
        });
        
    },


    //Extraer todos los usuarios de la base

    users: function (req, res) {
        User.find().exec((err, users)=>{ //esta funcion extrae todos los usuarios
                if(err || !users){
                    return res.status(404).send({
                        message: "La imagen no existe"
                    });
                }
                    return res.status(200).send({
                        status: "success",
                        users
                    });
                
        });
    },

    //Estraer un solo usuario
    getUser: function (req, res) {

        var userId = req.params.userId;

        User.findById(userId).exec((err, user)=>{

            if(err || !user){
                return res.status(404).send({
                    status:'error',
                    message: 'No se encuentra'
                });
            }
            return res.status(200).send({
                status:'success',
                user
            });
        });
        

    },

    getByEmail: function (req, res) {

        var email = req.params.email;

        User.findOne(email).exec((err, user)=>{

            if(err || !user){
                return res.status(404).send({
                    status:'error',
                    message: 'No se encuentra'
                });
            }
            return res.status(200).send({
                status:'success',
                user
            });
        });
        
    }
    

};

module.exports = controller; // todo el objeto json exportalo como un modulo