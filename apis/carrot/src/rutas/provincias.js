// BACKEND

const express = require("express");
const router = express.Router();

const { ejecutarConsultaEnCarrot } = require("../conexion");

//Mostrar un listado de todos los clientes y el total de ventas de cada uno

router.get("/:codigo", async (req, res) => {
  let codigo = req.params.codigo;

  try {
    let consulta = `select * from provincias where id=${codigo}`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos[0]);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

router.get("/pais/:id_pais", async (req, res) => {
  let codigo = req.params.id_pais;
  try {
    let consulta = `select * from provincias where pais_id=${codigo} order by nombre`;
    const datos = await ejecutarConsultaEnCarrot(consulta);
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

router.get("/", async (req, res) => {
  try {
    let consulta = `SELECT id, nombre
                    FROM provincias
                    ORDER BY nombre`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

module.exports = router;
