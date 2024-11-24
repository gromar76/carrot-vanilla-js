// traigo variables de configuracion como la url
const config = dameConfig();

//modos en los cuales voy estando
const MODO_VER = 1;
const MODO_EDITAR = 2;
const MODO_NUEVO = 3;

const divVenta = document.getElementById("datosVenta");
const divPagos = document.getElementById("datosPagos");
const urlActual = window.location.href;
const urlPago = new URL(urlActual);
const idVenta = urlPago.searchParams.get("idVenta");

console.log("Pagos de venta con id ", idVenta);

///////////////////////////////////////////////
//
// IMPORTANTE PARA DIBUJAR LA TABLA
//
// donde yo tenga que poner los datos
let registrosPorPantalla = 13;
let comenzarDesdePagina = 1;
let columnas = [null, "Importe", "Fecha"];
let campos = ["id", "importe", "fecha"];
let tiposCampos = [null, "number", "date"]; //Si es select, busco el id en la columna que se llame id_categoria (o el nombre que sea)
let funcionesDetalle = [null, null, null];
let funcionesSelect = [null, null, null];
const nombrePantalla = "Pagos";
const mostrarBotones = true;

const botones = [
  { texto: "Modificar", funcionEjecutar: modificarPago, clase: "btnDetalle" },
  {
    texto: "Eliminar",
    funcionEjecutar: accionEliminar,
    clase: "btnEliminar",
  },
];
///////////////////////////////////////////////
comienzo();

///////////////////   F U N C I O N E S   /////////////////////

function modificarPago() {
  alert("MODIFICAR");
}

function accionEliminar() {
  alert("ELIMINAR");
}

function cerrarModal() {}

function manejadorInputs() {}

async function comienzo() {
  await dibujaDatosDelCliente(idVenta);
  //await dibujaPagosDeLaVenta(idVenta);

  const datosJson = await dameDatosdePagosDeVenta(idVenta);

  dibujarTabla({
    datos: datosJson,
    columnas: columnas,
    campos,
    tiposCampos,
    titulo: "Registro de Pagos",
    cantidadRegistrosPorPagina: registrosPorPantalla,
    paginaDesde: 1,
    idContenedor: "tablaPagos",
    mostrarPaginador: true,
    mostrarBotones: mostrarBotones,
    modificarPago,
    accionEliminar,
    cerrarModal,
    manejadorInputs,
    funcionesDetalle,
    funcionesSelect,
    botones,
  });
}

async function dibujaDatosDelCliente(idVenta) {
  const datosVenta = await dameDatosVenta(idVenta);
  divVenta.innerHTML = await generarDatosVenta(datosVenta);
}

async function dibujaPagosDeLaVenta(idVenta) {
  const pagosVenta = await dameDatosdePagosDeVenta(idVenta);
  divPagos.innerHTML = await generarListaPagos(pagosVenta);
}

// pasado un id de Venta me trae los datos de esa venta
async function dameDatosVenta(idVenta) {
  const url = `${config.URL_API}/ventas/${idVenta}`;
  let datos = "";
  let paquete = await fetch(url);
  datos = await paquete.json();
  return datos[0];
}

// pasado un id de Venta me trae los datos de los pagos de esa venta
async function dameDatosdePagosDeVenta(idVenta) {
  const url = `${config.URL_API}/pagos/pagosDeVenta/${idVenta}`;
  let datos = "";
  let paquete = await fetch(url);
  datos = await paquete.json();
  return datos;
}

//devuelve el html de los datos de la venta
function generarDatosVenta(datosVenta) {
  let html = `<div class="row" style="margin-bottom: 20px !important;">    
    <div class="col">
        Cliente: <b>${datosVenta.cliente}</b>
    </div>
    <div class="col">
        Fecha: <b>${datosVenta.fecha}</b>
    </div>
    <div class="col">
        Total: <b>$ ${datosVenta.importe}</b>
    </div>
    <div class="col">
        Pagado: <b>$ ${datosVenta.pagado}</b>
    </div>
    <div class="col">
        Pendiente: <b style="color: black;">$ ${datosVenta.pendiente}</b>
    </div>
    </div>`;
  return html;
}

//
function generarListaPagos(pagosVenta) {
  let html = ``;
  pagosVenta.forEach((pago) => {
    html += `Fecha ${pago.fecha} - Pago ${pago.importe} $<br>`;
  });
  return html;
}
