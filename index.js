const path = require( 'path' );

// condiguracion basica de express
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Diectorio Público
//midelware: una funcion que se ejecuta en el momento en que se hace una peticion al servidor
// Indica la aplicación que se debe servir al ingresar por el puerto 
// Direccion Publica
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Redireciona todas las rutas exepto las del api a la carpte public (aplicativo de React)
// Esto se hace solo si ingreso el build de react a node, en caso de hacerse por separado no es necesario
app.use('*', (req, res) => {
    res.sendFile( path.join( __dirname, 'public/index.html' ) )
})

// Escuchar peticiones
app.listen( process.env.PORT , () => {
    console.log(`Servidor corriendo en puerto ${ 4000 }`)
});