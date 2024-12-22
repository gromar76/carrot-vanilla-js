// BACKEND

const express = require("express");
const router = express.Router();

const { ejecutarConsultaEnCarrot } = require("../conexion");

//Mostrar un listado de todos los clientes y el total de ventas de cada uno

router.post("/", async (req, res) => {
  const nombre = req.body.nombre;
  const descripcion = "";
  const costo = req.body.costo;
  const precio = req.body.precio;
  const categoria = req.body.categoria;

  try {
    let consulta = `INSERT INTO productos(nombre, descripcion, costo, precio, id_categoria) 
                    VALUES (?, ?, ?, ?,? )                                  
        `;

    const valores = [nombre, descripcion, costo, precio, categoria];

    const datos = await ejecutarConsultaEnCarrot(consulta, valores);

    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al dar de alta el producto", error });
  }
});

// visible es para saber si en la WEB lo tengo que visualizar o no al producto
router.get("/busqueda/", async (req, res) => {
  const buscar = req.query.buscar;
  try {
    let consulta = `SELECT pro.id, pro.nombre, pro.costo, pro.precio, cat.id as id_categoria,
                          cat.nombre as categoria, mar.nombre as marca, pro.visible as visible
                          FROM productos pro
                          INNER JOIN categorias_productos cat
                          ON pro.id_categoria=cat.id
                          LEFT JOIN marcas_productos mar
                          ON pro.id_marca=mar.id
                          WHERE (pro.nombre like '%${buscar}%') and pro.visible=1
                          ORDER by pro.nombre`;

    /*     let consulta = `select pro.id as id, pro.nombre as nombre, pro.precio, pro.costo
                          FROM productos pro
                          WHERE (pro.nombre like '%${buscar}%')     
                          ORDER BY pro.nombre`;*/

    const datos = await ejecutarConsultaEnCarrot(consulta);
    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el listado de productos", error });
  }
});

router.get("/todos/", async (req, res) => {
  try {
    let consulta = `SELECT pro.id, pro.nombre, pro.costo, 
                    pro.precio, cat.nombre as categoria, id_categoria,
                    mar.nombre as marca, mar.id as idMarca, pro.visible as visible
                    FROM productos pro
                    INNER JOIN categorias_productos cat
                    ON pro.id_categoria=cat.id
                    LEFT JOIN marcas_productos mar
                    ON pro.id_marca=mar.id
                    WHERE pro.visible=1
                    ORDER by pro.nombre`;

    //REFACTOR
    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

// visible es para saber si en la WEB lo tengo que visualizar o no al producto
router.get("/destacados/", async (req, res) => {
  try {
    let consulta = `SELECT pro.id, pro.nombre, pro.costo, 
                    pro.precio, cat.nombre as categoria, id_categoria,
                    mar.id as idMarca, mar.nombre as marca, pro.visible as visible
                    FROM productos pro
                    INNER JOIN categorias_productos cat
                    ON pro.id_categoria=cat.id
                    LEFT JOIN marcas_productos mar
                    ON pro.id_marca=mar.id
                    WHERE pro.destacado=1 and pro.visible=1
                    ORDER by pro.nombre`;

    //REFACTOR
    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

// visible es para saber si en la WEB lo tengo que visualizar o no al producto
router.get("/categoria/:categoria", async (req, res) => {
  let codigo = req.params.categoria;

  try {
    let consulta = `SELECT pro.id, pro.nombre, pro.costo, pro.precio, cat.id as id_categoria,
                    cat.nombre as categoria, 
                    mar.id as idMarca, mar.nombre as marca, pro.visible as visible
                    FROM productos pro
                    INNER JOIN categorias_productos cat
                    ON pro.id_categoria=cat.id
                    LEFT JOIN marcas_productos mar
                    ON pro.id_marca=mar.id
                    WHERE pro.id_categoria=${codigo} and pro.visible=1
                    ORDER by pro.nombre`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

router.get("/:codigo", async (req, res) => {
  let codigo = req.params.codigo;

  try {
    let consulta = `SELECT pro.id, pro.nombre, pro.costo, pro.precio, cat.id as id_categoria,
                    cat.nombre as categoria, mar.id as idMarca, mar.nombre as marca, pro.visible as visible
                    FROM productos pro
                    INNER JOIN categorias_productos cat
                    ON pro.id_categoria=cat.id
                    LEFT JOIN marcas_productos mar
                    ON pro.id_marca=mar.id
                    WHERE pro.id=${codigo} and pro.visible=1
                    ORDER by pro.nombre`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos[0]);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

router.delete("/:codigo", async (req, res) => {
  try {
    let consulta = `DELETE 
                    FROM productos                    
                    WHERE id = ${req.params.codigo}
        `;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el listado de productos", error });
  }
});

router.put("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  const nombre = req.body.nombre;
  const costo = req.body.costo;
  const precio = req.body.precio;
  const categoria = req.body.categoria;

  try {
    let consulta = `UPDATE productos
                    SET nombre=?, costo=?, precio=?, id_categoria=?
                    WHERE id = ?
        `;

    const valores = [nombre, costo, precio, categoria, codigo];

    const datos = await ejecutarConsultaEnCarrot(consulta, valores);

    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el listado de productos", error });
  }
});

router.put("/campo/:codigo", async (req, res) => {
  idProducto = req.params.codigo;
  campo = req.body.campo;
  valor = req.body.valor;

  const valores = [valor, idProducto];

  let consulta = `UPDATE productos
                SET ${campo}=?
                WHERE id =?`;

  const datos = await ejecutarConsultaEnCarrot(consulta, valores);
  res.json(datos);
});

module.exports = router;
