'use strict'

var jwt = require('jwt-simple'); // importamos jwt para tener el token
var moment = require('moment'); // esta sirve para capturar el momento de cuando se genera el tocken y cuando vence

exports.createToken = function (user) {
    var payload = {
        //payload significa todos los datos del usuario que queremos crear y generar el token
        sub: user._id, //id del usuario
        name: user.name,
        surname: user.surname,
        email: user.email,
        roles: user.roles,
        image: user.image,
        iat: moment().unix(), //tiempo o fecha exacta de cuando se creo ese token
        exp: moment().add(30, 'days').unix //expiracion del token
    };

    return jwt.encode(payload, 'clave-secreta-para-generar-el-token-9999'); // codificamos el token pasando la info del payload y un parametro de clave secreta

};

