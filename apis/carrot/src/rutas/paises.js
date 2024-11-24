// BACKEND

const express = require("express");
const router = express.Router();

const { ejecutarConsultaEnCarrot } = require("../conexion");

router.get("/todos/", async (req, res) => {
  try {
    let consulta = `select * from paises order by id`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el listado de paises", error });
  }
});

router.get("/:codigo", async (req, res) => {
  let codigo = req.params.codigo;

  try {
    let consulta = `select * from paises where id=${codigo}`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos[0]);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

module.exports = router;
