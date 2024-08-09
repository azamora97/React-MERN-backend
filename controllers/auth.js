const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt'); 


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try{
        let usuario = await Usuario.findOne({ email: email }) // realiza el select de un elemento = firtsOrDeafults de c#
        
        if( usuario ) {
            return res.status(400).json({
                ok:false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar JWT
        const jwt = await generarJWT( usuario.id, usuario.name );
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: jwt
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            masg: 'Por favor hable con el administrador'
        });
    }


    //manejo de errores
    // const errors = validationResult( req );
    // if( !errors.isEmpty() ){
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     })
    // }
};

const loginUsuario = async (req , res = response) => {

    const { email, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ email: email });
        
        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        //Confirmar los password
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrceto'
            });
        }

        // Generar nuestro JWT
        const jwt = await generarJWT( usuario.id, usuario.name );

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: jwt
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            masg: 'Por favor hable con el administrador'
        });
    }

};

const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;

    // generar JWT
    const jwt = await generarJWT( uid, name );

    res.json({
        ok: true,
        msg: 'renew',
        token: jwt
    });

};


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};