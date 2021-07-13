'use strict'

var secret = 'clave-secreta-para-generar-el-token-9999';
var jwt = require('jwt-simple');
var moment = require('moment');

exports.authenticated = function (req, res, next) {
    //los middleware tienen 3 parametros, el next lo que hace es que salga del middleware y siga el programa

    //PASO1: Comprobar si llega autorización
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: "La peticion no tiene la cabecera de autenticación"
        });
    }

    //PASO2: Limpiar el token y quitar comillas
    var token = req.headers.authorization.replace(/['"]+/g, ''); // esta ya contiene el token sin comillas

    //PASO3: Decodificar el token
    try {
        //Como puede dar error usamos try catch 
        var payload = jwt.decode(token, secret);

        //PASO4: Comprobar la expiración del token
        if (payload.exp <= moment().unix()) {
            return res.status(404).send({
                message: "El token ha expirado"
            });
        }

    } catch (ex) {
        return res.status(404).send({
            message: "El token no es valido"
        });
    }



    //PASO5: Adjuntar usuario identificado a la requiest
    req.user = payload; // creo una propiedad dentro de request y le doy el valor de payload

    //PASO6: Pasar a la accion siguiente
    next();
}