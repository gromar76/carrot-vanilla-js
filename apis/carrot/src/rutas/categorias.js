// BACKEND

const express = require("express");
const router = express.Router();

const { ejecutarConsultaEnCarrot } = require("../conexion");

//Mostrar un listado de todos los clientes y el total de ventas de cada uno

router.get("/productos/", async (req, res) => {
  try {
    let consulta = `SELECT *
                    FROM categorias_productos
                    ORDER BY nombre`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

router.get("/todos/", async (req, res) => {
  try {
    let consulta = `SELECT *
                    FROM categorias_productos
                    WHERE baja=0
                    ORDER BY nombre`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

//me devuelve las categorias que tienen productos asignados
//esto lo uso en ASTRO para mostrar solo las categorias con productos asociados
router.get("/conProductos/", async (req, res) => {
  try {
    let consulta = `SELECT DISTINCT(cat.id), cat.nombre, (SELECT COUNT(*) FROM productos WHERE id_categoria = cat.id) cantidad
                    FROM categorias_productos cat
                    INNER JOIN productos p
                    ON cat.id = p.id_categoria  
                    AND p.visible=1                                 
                    ORDER BY cat.nombre`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

router.get("/:idCategoria", async (req, res) => {
  let idCategoria = req.params.idCategoria;
  try {
    let consulta = `SELECT *
                    FROM categorias_productos
                    WHERE id=${idCategoria}`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    //console.log(datos);

    res.json(datos[0]);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

module.exports = router;
