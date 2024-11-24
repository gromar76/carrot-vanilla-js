// BACKEND

const express = require("express");
const router = express.Router();

const { ejecutarConsultaEnCarrot } = require("../conexion");

router.get("/todos/", async (req, res) => {
  try {
    let consulta = `SELECT loc.id, loc.nombre, pro.nombre provincia, pro.id id_provincia
                    FROM localidades loc, provincias pro
                    WHERE loc.id_provincia=pro.id
                    ORDER BY loc.nombre`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el listado de localidades" });
  }
});

router.get("/:codigo", async (req, res) => {
  let codigo = req.params.codigo;

  try {
    let consulta = `SELECT *
                    FROM localidades
                    WHERE id=${codigo}
                    `;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos[0]);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

router.put("/campo/:codigo", async (req, res) => {
  id = req.params.codigo;
  campo = req.body.campo;
  valor = req.body.valor;

  const valores = [valor, id];

  let consulta = `UPDATE localidades
                SET ${campo}=?
                WHERE id =?`;

  const datos = await ejecutarConsultaEnCarrot(consulta, valores);
  res.json(datos);
});

router.put("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  const nombre = req.body.nombre;
  const provincia = req.body.provincia;

  try {
    let consulta = `UPDATE localidades
                    SET nombre=?, id_provincia=?
                    WHERE id = ?
        `;

    const valores = [nombre, provincia, codigo];

    const datos = await ejecutarConsultaEnCarrot(consulta, valores);

    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el listado de productos", error });
  }
});

router.post("/", async (req, res) => {
  const nombre = req.body.nombre;
  const provincia = req.body.provincia;

  try {
    let consulta = `INSERT INTO localidades(nombre, id_provincia) 
                    VALUES (?, ? )                                  
        `;

    const valores = [nombre, provincia];

    const datos = await ejecutarConsultaEnCarrot(consulta, valores);

    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al dar de alta la localidad", error });
  }
});

router.delete("/:codigo", async (req, res) => {
  try {
    let consulta = `DELETE 
                    FROM localidades                    
                    WHERE id = ${req.params.codigo}
        `;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el listado de localidades", error });
  }
});

router.get("/provincia/:id_provincia", async (req, res) => {
  let codigo = req.params.id_provincia;
  try {
    let consulta = `select * from localidades where id_provincia=${codigo} order by nombre`;
    const datos = await ejecutarConsultaEnCarrot(consulta);
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

module.exports = router;
