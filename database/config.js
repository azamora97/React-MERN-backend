const mongoose = require('mongoose');


const dbConnection = async () => {

    try{
        // conexión apartir de versión mongo 7
        await mongoose.connect( process.env.DB_CNN );

        // conexión de antes en versiones viejas
        // await mongoose.connect( process.env.DB_CNN, {
        //     useNewUrlParser: true,
        //     useUnifiedTipology: true,
        //     useCreateIndex: true
        // });

        console.log('DB Online')

    }
    catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar DB');
    }

}

module.exports = {
    dbConnection
 }

