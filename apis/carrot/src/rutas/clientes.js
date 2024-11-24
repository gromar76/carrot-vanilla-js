// BACKEND

const express = require("express");
const router = express.Router();

const { ejecutarConsultaEnCarrot } = require("../conexion");

router.get("/busqueda/", async (req, res) => {
  const buscar = req.query.buscar;
  try {
    let consulta = `select cli.id as id, cli.nombre as nombre, cli.apellido as apellido,
                          cli.whatsapp as whatsapp, loc.nombre as localidad, cli.dni as dni,
                          cli.cpostal as cpostal, pro.nombre as provincia,
                          cli.id_localidad, loc.id_provincia
                          FROM clientes cli, provincias pro, localidades loc
                          WHERE cli.id_localidad=loc.id
                          AND loc.id_provincia=pro.id
                          AND (cli.nombre like '%${buscar}%' or
                              cli.apellido like '%${buscar}%' or
                              cli.whatsapp like '%${buscar}%' or 
                              loc.nombre like '%${buscar}%' or 
                              pro.nombre like '%${buscar}%') 
                          ORDER BY cli.nombre, cli.apellido`;

    const datos = await ejecutarConsultaEnCarrot(consulta);
    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el listado de clientes", error });
  }
});

router.get("/todos/", async (req, res) => {
  try {
    let consulta = `select cli.id as id, cli.nombre as nombre, cli.apellido as apellido,
                 cli.whatsapp as whatsapp, loc.nombre as localidad, cli.dni as dni,
                 cli.cpostal as cpostal, pro.nombre as provincia,
                  cli.id_localidad, loc.id_provincia
                 FROM clientes cli, provincias pro, localidades loc
                 WHERE cli.id_localidad=loc.id
                 AND loc.id_provincia=pro.id
                 ORDER BY cli.nombre, cli.apellido`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el listado de clientes", error });
  }
});

router.get("/:codigo", async (req, res) => {
  let codigo = req.params.codigo;

  try {
    /* let consulta = `SELECT id, apellido, nombre, whatsapp
                    FROM clientes
                    WHERE id=${codigo}
                    `;*/

    let consulta = `
                    select cli.id as id, cli.nombre as nombre, cli.apellido as apellido,
                    cli.whatsapp as whatsapp, cli.id_localidad as id_localidad, cli.dni as dni,
                    cli.email as email, cli.domicilio as domicilio, pro.pais_id as id_pais,
                    cli.cpostal as cpostal, loc.id_provincia as id_provincia, cli.observaciones as observaciones                    
                    FROM clientes cli, provincias pro, localidades loc
                    WHERE cli.id_localidad=loc.id
                    AND loc.id_provincia=pro.id
                    AND cli.id=${codigo}
                    ORDER BY cli.nombre, cli.apellido`;

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

  let consulta = `UPDATE clientes
                SET ${campo}=?
                WHERE id =?`;

  const datos = await ejecutarConsultaEnCarrot(consulta, valores);
  res.json(datos);
});

router.put("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const whatsapp = req.body.whatsapp;
  const dni = req.body.dni;
  const email = req.body.email;
  const domicilio = req.body.domicilio;
  const cpostal = req.body.cpostal;
  const localidad = req.body.localidad;
  const observaciones = req.body.observaciones;

  try {
    let consulta = `UPDATE clientes
                    SET nombre=?, apellido=?, whatsapp=?, dni=?, email=?, domicilio=?, cpostal=?, id_localidad=?, observaciones=?
                    WHERE id = ?`;

    const valores = [
      nombre,
      apellido,
      whatsapp,
      dni,
      email,
      domicilio,
      cpostal,
      localidad,
      observaciones,
      codigo,
    ];

    const datos = await ejecutarConsultaEnCarrot(consulta, valores);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al modificar cliente", error });
  }
});

router.post("/", async (req, res) => {
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const whatsapp = req.body.whatsapp;
  const dni = req.body.dni;
  const email = req.body.email;
  const domicilio = req.body.domicilio;
  const cpostal = req.body.cpostal;
  const localidad = req.body.localidad;
  const observaciones = req.body.observaciones;
  const usuario_alta = 1; // nicolas es 1, marcelo 2

  try {
    let consulta = `INSERT INTO clientes(nombre, apellido, whatsapp, dni, email, domicilio, cpostal, id_localidad, observaciones, usuario_alta) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;

    const valores = [
      nombre,
      apellido,
      whatsapp,
      dni,
      email,
      domicilio,
      cpostal,
      localidad,
      observaciones,
      usuario_alta,
    ];

    const datos = await ejecutarConsultaEnCarrot(consulta, valores);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al dar de alta a cliente", error });
  }
});

router.delete("/:codigo", async (req, res) => {
  try {
    let consulta = `DELETE 
                    FROM clientes                    
                    WHERE id = ${req.params.codigo}
        `;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cliente", error });
  }
});

module.exports = router;
