// BACKEND

const express = require("express");
const router = express.Router();

const { ejecutarConsultaEnCarrot } = require("../../conexion");

//Mostrar un listado de todos los clientes y el total de ventas de cada uno

router.get("/venta_x_categoria/:desde/:hasta/:idUsuario", async (req, res) => {
  try {
    let desde = req.params.desde;
    let hasta = req.params.hasta;
    let idUsuario = req.params.idUsuario;

    //desde = `2023-01-01`;
    //hasta = `2023-09-30`;

    let consulta = "";
    if (idUsuario === "-1") {
      consulta = `SELECT cat.nombre as categoria, sum(det.cant) as cantidad, sum(det.cant*det.costo) as costo,
                          sum(det.cant*det.precio) as precio, sum((det.cant*det.precio)-(det.cant*det.costo)) as ganancia
                    FROM detalle_ventas det, productos pro, categorias_productos cat, ventas ven, usuarios usu
                    WHERE det.id_venta=ven.id and pro.id_categoria=cat.id                   
                    AND ven.id_usuario=usu.id   
                    AND pro.id=det.id_articulo 
                    AND (ven.fecha BETWEEN '${desde}' AND '${hasta}')
                    GROUP BY cat.nombre
                    order by sum(det.cant*det.precio) desc
                    `;
    } else {
      consulta = `SELECT cat.nombre as categoria, sum(det.cant) as cantidad, sum(det.cant*det.costo) as costo,
                      sum(det.cant*det.precio) as precio, sum((det.cant*det.precio)-(det.cant*det.costo)) as ganancia
               FROM detalle_ventas det, productos pro, categorias_productos cat, ventas ven, usuarios usu
               WHERE det.id_venta=ven.id and pro.id_categoria=cat.id                   
               AND ven.id_usuario=usu.id   
               AND pro.id=det.id_articulo and id_usuario=${idUsuario}
               AND (ven.fecha BETWEEN '${desde}' AND '${hasta}')
               GROUP BY cat.nombre
               order by sum(det.cant*det.precio) desc
               `;
    }

    const datos = await ejecutarConsultaEnCarrot(consulta);
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

router.get("/venta_total/:desde/:hasta", async (req, res) => {
  try {
    let desde = req.params.desde;
    let hasta = req.params.hasta;

    //desde = `2023-01-01`;
    //hasta = `2023-09-30`;

    let consulta = `select sum(cant*precio) as Total_Vendido
                    from detalle_ventas
                    `;

    consulta = `select sum(importe) as TOTAL from ventas`;
    consulta = `select id_venta from detalle_ventas where id_venta not in (select id from ventas)`;
    consulta = `select year(ven.fecha), month(ven.fecha), day(ven.fecha), sum(det.cant*det.precio) as Vendido
                from detalle_ventas det, ventas ven
                where det.id_venta=ven.id                
                group by year(ven.fecha) desc, month(ven.fecha), day(ven.fecha) desc
                `;

    /* consulta = `select year(ven.fecha), month(ven.fecha), day(ven.fecha), sum(ven.importe) as Vendido
                from ventas ven                
                group by year(ven.fecha) desc, month(ven.fecha), day(ven.fecha) desc
                `;*/

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

router.get(
  "/agrupado_producto/:desde/:hasta/:idUsuario/:idCategoria",
  async (req, res) => {
    let desde = req.params.desde;
    let hasta = req.params.hasta;
    let idUsuario = req.params.idUsuario;
    let idCategoria = req.params.idCategoria;

    try {
      let consulta = `select pro.id id, pro.nombre articulo, cat.nombre as categoria, sum(det.cant) as cantidad_vendida, sum(det.cant*det.precio) as total,
      sum(det.cant) as cantidad, sum(det.cant*det.costo) as costo,
      sum(det.cant*det.precio) as precio, sum((det.cant*det.precio)-(det.cant*det.costo)) as ganancia
      FROM ventas ven, detalle_ventas det, productos pro, usuarios usu, categorias_productos cat
      WHERE ven.id=det.id_venta and pro.id=det.id_articulo
      AND ven.fecha BETWEEN '${desde}' and '${hasta}'
      AND ven.id_usuario=usu.id
      AND cat.id=pro.id_categoria`;
      if (idUsuario != "-1") {
        consulta += ` AND usu.id=${idUsuario}`;
      }
      if (idCategoria != "-1") {
        consulta += ` AND cat.id=${idCategoria}`;
      }

      consulta += ` GROUP BY pro.id, pro.nombre, cat.nombre
                   ORDER BY sum(det.cant*det.precio) desc`;

      const datos = await ejecutarConsultaEnCarrot(consulta);
      res.json(datos);
    } catch (error) {
      res.status(500).json({ mensaje: error });
    }
  }
);

router.get("/agrupado_cliente/:desde/:hasta/:idUsuario", async (req, res) => {
  let desde = req.params.desde;
  let hasta = req.params.hasta;
  let idUsuario = req.params.idUsuario;

  let consulta = "";
  try {
    consulta = `SELECT cli.id id, cli.nombre nombre, sum(det.cant*det.precio) importe_total, sum(det.cant*det.costo) as costo_total,
               sum((det.cant*det.precio)-(det.cant*det.costo)) as ganancia
                FROM ventas ven, clientes cli, detalle_ventas det
                WHERE ven.cliente=cli.id
                AND ven.id=det.id_venta
                AND ven.fecha BETWEEN '${desde}' and '${hasta}'
                       `;
    if (idUsuario != "-1") {
      consulta += ` AND ven.id_usuario=${idUsuario}`;
    }
    consulta += ` GROUP BY cli.id, cli.nombre
                 ORDER BY sum(cant*det.precio) desc
                `;

    /*consulta = `SELECT cli.id id, cli.nombre nombre, sum(det.cant*det.precio) importe_total, sum(det.cant*det.costo) as costo_total,
                sum((det.cant*det.precio)-(det.cant*det.costo)) as ganancia
                FROM ventas ven, clientes cli, detalle_ventas det
                WHERE ven.cliente=cli.id
                AND ven.id=det.id_venta
                AND ven.fecha BETWEEN '${desde}' and '${hasta}'
                GROUP BY cli.id, cli.nombre
                `;*/

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

router.get("/mes_x_mes/", async (req, res) => {
  try {
    let consulta = `select year(ven.fecha) as anio, month(ven.fecha) as mes, sum(ven.importe) as total
                 from ventas ven
                GROUP BY year(ven.fecha), month(ven.fecha)
                ORDER BY year(ven.fecha) desc, month(ven.fecha) desc
                `;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

module.exports = router;
