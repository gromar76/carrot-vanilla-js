// requiero Express y Cors

const express = require("express");
const cors = require("cors");

const morgan = require("morgan");

const rutasClientes = require("./rutas/clientes");
const rutasProductos = require("./rutas/productos");
const rutasProvincias = require("./rutas/provincias");
const rutasLocalidades = require("./rutas/localidades");
const rutasVentas = require("./rutas/ventas");
const rutasEmails = require("./rutas/emails");
const rutasCategorias = require("./rutas/categorias");
const rutasMarcas = require("./rutas/marcas");
const rutasEstadisticaVentas = require("./rutas/estadisticas/ventas");
const rutasPaises = require("./rutas/paises");
const rutasPagos = require("./rutas/pagos");

const app = express();

app.use(morgan("dev"));

app.use(express.static("./public"));

app.use(cors());
app.use(express.json()); //Habilito que lea el JSON que viene en el body

app.use("/clientes", rutasClientes);
app.use("/productos", rutasProductos);
app.use("/ventas", rutasVentas);
app.use("/emails", rutasEmails);
app.use("/categorias", rutasCategorias);
app.use("/marcas", rutasMarcas);
app.use("/localidades", rutasLocalidades);
app.use("/provincias", rutasProvincias);
app.use("/estadisticas/ventas", rutasEstadisticaVentas);
app.use("/paises", rutasPaises);
app.use("/pagos", rutasPagos);

app.listen(7000, () => {
  console.log("La API de CARROT escuchando en el puerto 7000");
});
