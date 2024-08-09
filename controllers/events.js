const { response } = require('express');
const Evento = require('../models/Evento')

const getEventos = async ( req, res = response ) => {

    const eventos = await Evento.find()
                                .populate('user', 'name password') // se especifica luego de la referencia con una ',' los campos que se desean traer adicional al ID (por defecto)
                                //.populate('user', 'name password') // multiples campos de las columnas
                                //.populate('user'); //populate es similar a realizar un join en base a la referencia (Trae todo lo de la tabla referente)


    res.status(200).json({
        ok: true,
        eventos
    });
}

const crearEvento = async ( req, res = response) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.status(200).json({
            ok: true,
            evento: eventoGuardado
        });
        
    } catch (error) {
        console.log(error);
        req.status(500).json({
            ok: false,
            msg: 'Hable con el administtrador'
        });
    }

}

const actualizarEvento = async ( req, res = response) => {
    
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if( !evento ) {
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        }

        if( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        };

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        }); 
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if(!evento) {
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        }

        if(evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const eventoEliminado = await Evento.findByIdAndDelete( eventoId );

        res.json({ ok: true });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}