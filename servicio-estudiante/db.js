const mysql = require("mysql2");

const conexion = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "12345678",

    database: "universidad_puma"

});

conexion.connect((error)=>{

    if(error){

        console.log("Error al conectar");

        console.log(error);

        return;

    }

    console.log("Conectado correctamente a MySQL");

});

module.exports = conexion;