// BACKEND

const express = require("express");
const router = express.Router();
const { ejecutarConsultaEnCarrot } = require("../conexion");
const {
  formatearFechaJS,
  dameVueltaFecha,
  dameFechaDeHoy,
} = require("../../../funciones/funcionesFecha");

router.get("/detalle/:id", async (req, res) => {
  let id = req.params.id;
  //console.log("ID Detalle ", id);
  try {
    let consulta = `SELECT det.id_venta, det.id_articulo, pro.nombre as nombre, det.cant as cantidad, 
                    det.precio as precio, det.costo as costo
                  FROM detalle_ventas det, productos pro
                  WHERE det.id_articulo=pro.id
                  AND det.id_venta=${id}`;

    const detalleVenta = await ejecutarConsultaEnCarrot(consulta, [], true);

    res.json(detalleVenta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la venta" });
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let consulta = `SELECT ve.id as id, concat(cli.nombre," ",cli.apellido) as cliente,
                     DATE_FORMAT(ve.fecha, "%W %d/%m/%Y") as fecha, 
                    ve.importe as importe, cli.id as idCliente, 
                    ve.pagado as pagado, ve.importe-ve.pagado as pendiente, usu.nombre as usuario, 
                    ve.comentario as observaciones, ve.fecha as fechaSola
                 FROM ventas ve, clientes cli, usuarios usu
                 WHERE ve.cliente=cli.id and ve.id_usuario=usu.id and ve.id=${id}
                 order by ve.fecha desc, ve.id desc`;

    const datosVenta = await ejecutarConsultaEnCarrot(consulta, [], true);

    // devolver tambien el detalle de la venta

    res.json(datosVenta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la venta" });
  }
});

router.get("/aplicar/", async (req, res) => {
  const idCliente = req.query.idCliente;
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  const pendientes = req.query.pendientes;

  try {
    let consulta = `SELECT *
                 FROM ventas
                 WHERE fecha BETWEEN '${desde}' AND '${hasta}'
                 order by fecha desc
                `;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el listado de ventas" });
  }
});

router.get("/", async (req, res) => {
  const idCliente = req.query.idCliente;
  let desde = req.query.desde;
  let hasta = req.query.hasta;
  const pendientes = req.query.pendientes;
  const usuario = req.query.usuarios;

  console.log("DESDE ORIGINAL", desde);

  if (!desde) {
    desde = dameVueltaFecha(dameFechaDeHoy());
  }
  if (!hasta) {
    hasta = dameVueltaFecha(dameFechaDeHoy());
  }

  console.log("Cliente numero ", idCliente);
  console.log("Pendiente ", pendientes);
  console.log("Usuario ", usuario);

  try {
    let consulta = `SELECT ve.id as id, concat(cli.nombre," ",cli.apellido) as cliente,
                     DATE_FORMAT(ve.fecha, "%W %d/%m/%Y") as fecha, ve.importe as importe,
                     ve.comentario as observaciones, ve.pagado as pagado, 
                     ve.importe-ve.pagado as pendiente, usu.nombre as usuario, ve.fecha as fechaSola
                 FROM ventas ve, clientes cli, usuarios usu
                 WHERE ve.cliente=cli.id and ve.id_usuario=usu.id
                 AND ve.fecha BETWEEN '${desde}' AND '${hasta}'`;

    if (idCliente) {
      console.log("ENTRE....");
      consulta += ` AND ve.cliente=${idCliente}`;
    }

    if (pendientes > 0) {
      consulta += ` AND ve.importe-ve.pagado>0`;
    }

    if (usuario > 0) {
      consulta += ` AND ve.id_usuario=${usuario}`;
    }

    consulta += ` ORDER by ve.fecha desc, ve.id desc`;

    //console.log(consulta);
    const datos = await ejecutarConsultaEnCarrot(consulta, [], true);

    //formatearFechaJS

    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el listado de ventas", error });
  }
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let consulta = ``;
  try {
    consulta = `DELETE FROM detalle_ventas WHERE id_venta=${id}`;
    await ejecutarConsultaEnCarrot(consulta, [], true);
    consulta = `DELETE FROM ventas WHERE id=${id}`;
    await ejecutarConsultaEnCarrot(consulta, [], true);
    // devolver tambien el detalle de la venta

    res.json({ mensaje: "Venta Eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la venta" });
  }
});

router.put("/:idVenta", async (req, res) => {
  /* detalleProductos.push({
    id_articulo: idP,
    nombre: producto.value,
    costo: parseInt(costo.value),
    precio: parseInt(precio.value),
    cantidad: parseInt(cantidad.value),
  });*/

  // utilizo destructuring
  const idVenta = req.params.idVenta;
  const { cliente, fecha, observaciones, detalleProductos } = req.body;

  let importe = 0;
  detalleProductos.forEach((producto) => {
    importe += producto.precio * producto.cantidad;
  });

  /*let sql = `INSERT INTO ventas (cliente, importe, pagado, fecha, id_usuario, comentario)
             VALUES (${cliente}, ${importe}, 0, '${fecha}', 1, '${observaciones}')`;*/

  let sql = `UPDATE ventas set cliente=?, importe=?, pagado=?, fecha=?, comentario=?
             WHERE id=?`;

  let valores = [cliente, importe, 0, fecha, observaciones, idVenta];

  let resultado = await ejecutarConsultaEnCarrot(sql, valores);

  //elimino el detalle y luego lo vuelvo a insertar
  valores = [idVenta];
  sql = `DELETE from detalle_ventas where id_venta = ?`;
  resultado = await ejecutarConsultaEnCarrot(sql, valores);

  // inserto el detalle
  detalleProductos.forEach((producto) => {
    valores = [
      idVenta,
      producto.id_articulo,
      producto.cantidad,
      producto.precio,
      producto.costo,
    ];
    sql = `INSERT INTO detalle_ventas (id_venta, id_articulo, cant, precio, costo, valordolar)
           VALUES (?,?,?,?,?, 0)`;
    ejecutarConsultaEnCarrot(sql, valores);
  });

  res.json({ mensaje: "Venta modificada correctamente" });
});

router.post("/", async (req, res) => {
  /* detalleProductos.push({
    id_articulo: idP,
    nombre: producto.value,
    costo: parseInt(costo.value),
    precio: parseInt(precio.value),
    cantidad: parseInt(cantidad.value),
  });*/

  // utilizo destructuring
  const { cliente, fecha, observaciones, detalleProductos } = req.body;

  let importe = 0;
  detalleProductos.forEach((producto) => {
    importe += producto.precio * producto.cantidad;
  });

  let sql = `INSERT INTO ventas (cliente, importe, pagado, fecha, id_usuario, comentario)
             VALUES (${cliente}, ${importe}, 0, '${fecha}', 1, '${observaciones}')`;

  let resultado = await ejecutarConsultaEnCarrot(sql);
  res.json({ mensaje: "Venta agregada correctamente" });

  const idGrabado = resultado.insertId;

  detalleProductos.forEach((producto) => {
    sql = `INSERT INTO detalle_ventas (id_venta, id_articulo, cant, precio, costo, valordolar)
           VALUES (${idGrabado}, ${producto.id_articulo}, ${producto.cantidad}, ${producto.precio}, ${producto.costo}, 0)`;
    ejecutarConsultaEnCarrot(sql);
  });
});

module.exports = router;
