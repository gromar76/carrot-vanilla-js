// BACKEND

const express = require("express");
const router = express.Router();

const { ejecutarConsultaEnCarrot } = require("../conexion");

//Mostrar un listado de todos los clientes y el total de ventas de cada uno

router.get("/todos/", async (req, res) => {
  try {
    let consulta = `SELECT *
                    FROM marcas_productos
                    ORDER BY nombre`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

module.exports = router;
