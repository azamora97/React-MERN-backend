/*
    Events Routes
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { ValidarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');

const router = Router();

// Todas tienen que pasar por la validación del JWT
// Con esta linea se especifica que todas las peticiones que esten dabajo de ella debe tener un token
// Pasa por validar token 
router.use( validarJWT );

// Obtener event
router.get('/'
            ,getEventos
        );

// Crear un evento
router.post('/', 
            [ //middlewares
                check('title', 'El tituto es obligatorio').not().isEmpty(),
                check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
                check('end', 'Fecha finalización es obligatoria').custom( isDate ),
                ValidarCampos
            ]
            ,crearEvento 
        ); 

// Actualizar Evento
router.put('/:id',
            [ //middlewares
                check('title', 'El tituto es obligatorio').not().isEmpty(),
                check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
                check('end', 'Fecha finalización es obligatoria').custom( isDate ),
                ValidarCampos
            ],
            actualizarEvento
        );

// Borrar Evento
router.delete('/:id' ,eliminarEvento );

module.exports = router;