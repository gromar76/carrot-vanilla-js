// BACKEND

const express = require("express");
const router = express.Router();

const { ejecutarConsultaEnCarrot } = require("../conexion");

//dado un codigo de venta, me trae todos los pagos

router.get("/pagosDeVenta/:idVenta", async (req, res) => {
  const idVenta = req.params.idVenta;

  console.log(idVenta);

  try {
    let consulta = `select * from pagos where id_venta=${idVenta}`;

    const datos = await ejecutarConsultaEnCarrot(consulta);

    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: error });
  }
});

module.exports = router;
