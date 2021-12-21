//-------------------------------------------------------------------
// Entregable 12: Variables de Entorno
// Fecha de entrega: 22-12-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const config = require('../config');

const optionsMariaDB = {
    client: config.credenciales.MARIA_DB_CLIENT,
    connection: {
      host : config.credenciales.MARIA_DB_HOST,
      port : config.credenciales.MARIA_DB_PORT,
      user : config.credenciales.MARIA_DB_USER,
      password : config.credenciales.MARIA_DB_PASSWORD,
      database : config.credenciales.MARIA_DB_DBNAME
    }
  };

  module.exports = { optionsMariaDB }