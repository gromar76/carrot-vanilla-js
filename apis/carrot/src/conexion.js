let mysql = require("mysql2/promise");

let conexion;

async function conectar() {
  conexion = await mysql.createConnection({
    host: "107.180.39.236",
    database: "carrot",
    user: "pablojs",
    password: "mercadoG1*",
  });

  conexion.connect(function (err) {
    if (err) {
      console.error("Error de conexion: " + err.stack);
      return;
    }
    console.log("Conectado con el identificador " + conexion.threadId);
  });
}
async function ejecutarConsultaEnCarrot(consulta, valores, setearEspaniol = false) {
  await conectar();

  if (setearEspaniol) {
    let seteaIdioma = `SET lc_time_names = 'es_ES'`;

    await conexion.query(seteaIdioma);
  }

  const [registros, campos] = await conexion.query(consulta, valores);

  conexion.destroy();

  return registros;
}

module.exports = { ejecutarConsultaEnCarrot };
