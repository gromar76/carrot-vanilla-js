// FRONTEND

const config = dameConfig();
let USUARIO_ACTIVO = -1;
let CATEGORIA_ACTIVA = -1;

//tomo control del botonEjecutar y de los inputFecha
let botonEjecutar = document.getElementById("botonEjecutar");
let inputFechaDesde = document.getElementById("fechadesde");
let inputFechaHasta = document.getElementById("fechahasta");
let seleccionUsuarios = document.getElementById("select-usuarios");
let seleccionCategorias = document.getElementById("select-categorias");

//escucho el boton Ejecutar
botonEjecutar.addEventListener("click", ejecutar);
seleccionUsuarios.addEventListener("change", ejecutarCambioUsuarios);

let FechaDiaHoy = formatearFecha(null, "EN");
inputFechaDesde.value = FechaDiaHoy;
inputFechaHasta.value = FechaDiaHoy;

function ejecutarCambioUsuarios(event) {
  let idUsuario = event.target.value;
  console.log("Seleccione usuario " + idUsuario);
  USUARIO_ACTIVO = idUsuario;
}

async function dameCategorias() {
  let url = `${config.URL_API}/categorias/productos`;
  let paquete = await fetch(url);
  let datos = await paquete.json();
  return datos;
}

async function dameHtmlCategorias(categorias) {
  let html = "";
  html += `<select id="categorias">`;
  html += `<option value="-1">Todas las Categorias</option>`;
  for (i = 0; i < categorias.length; i++) {
    // console.log("Categ Activa1 ", CATEGORIA_ACTIVA);
    // console.log("Categ Selecc1 ", categorias[i].id);
    if (parseInt(CATEGORIA_ACTIVA) === parseInt(categorias[i].id)) {
      // console.log("Categ Activa2 ", CATEGORIA_ACTIVA);
      // console.log("Categ Selecc2 ", categorias[i].id);
      html += `<option value="${categorias[i].id}" selected>${categorias[i].nombre}</option>`;
    } else {
      html += `<option value="${categorias[i].id}">${categorias[i].nombre}</option>`;
    }
  }

  html += `</select>`;
  return html;
}

async function cambioCategoria(event) {
  idCategoria = event.target.value;
  CATEGORIA_ACTIVA = idCategoria;
}

async function ejecutar() {
  let categorias = await dameCategorias();
  seleccionCategorias.innerHTML = await dameHtmlCategorias(categorias);
  let selCategorias = document.getElementById("categorias");
  selCategorias.addEventListener("change", cambioCategoria);

  let desde = dameFechaFormateadaEsp(inputFechaDesde.value);
  let hasta = dameFechaFormateadaEsp(inputFechaHasta.value);

  //la base de datos de Carrot espera un string en la fecha con el formato anio-mes-dia
  //desde = `2023-01-01`;
  // hasta = `2023-09-30`;

  desde = dameVueltaFecha(desde);
  hasta = dameVueltaFecha(hasta);

  actualizarDash(desde, hasta);
}

// dado un json de datos armo una tabla y muestro los datos
function armarTabla(datos) {
  //quiero saber cuantas cabezas es el total
  let totalCab = 0;
  for (let i = 0; i < datos.length; i++) {
    totalCab += +datos[i].cabezas;
  }

  const columnas = [
    "Id",
    "Nombre",
    "Apellido",
    "Provincia",
    "Localidad",
    "Whats App",
    "Ultima Compra",
    "Usuario",
    "Cant. Compras",
  ];

  let encabezadosColumnas = "";
  for (i = 0; i < columnas.length; i++) {
    encabezadosColumnas += `<th scope="col">${columnas[i]}</th>`;
  }

  let comienzoTabla = `<table class="table align-middle table-striped table-hover">`;
  let finalTabla = `</table>`;

  //Pasar a funciones tabla compartido (dameEncabezadoTabla(columnas))
  let columnasTabla = `<thead>
                           <tr class="table-success">                            
                              ${encabezadosColumnas}
                          </tr>
                       </thead>`;

  let comienzoBody = `<tbody>`;
  let finBody = `</tbody>`;

  let dat = "";

  for (let i = 0; i < datos.length; i++) {
    dat += `<tr class="table-secondary">`;
    dat += `<td>` + datos[i].id + `</td>`;
    dat += `<td>` + datos[i].nombre + `</td>`;
    dat += `<td>` + datos[i].apellido + `</td>`;
    dat += `<td>` + datos[i].provincia + `</td>`;
    dat += `<td>` + datos[i].localidad + `</td>`;
    dat += `<td>` + datos[i].whatsapp + `</td>`;
    dat += `<td>` + datos[i].ultima + `</td>`;
    dat += `<td>` + datos[i].usuario + `</td>`;
    dat += `<td>` + datos[i].ventas + `</td>`;
    dat += `</tr>`;
  }

  //dat += `<td></td>`;
  // dat += `<td></td>`;

  datosColumnas = dat;

  let tablaHtml = comienzoTabla;
  tablaHtml += columnasTabla;
  tablaHtml += comienzoBody;
  tablaHtml += datosColumnas;
  tablaHtml += finBody;
  tablaHtml += finalTabla;

  return tablaHtml;
}

async function actualizarDash(desde, hasta) {
  const datos = await dameDatos(desde, hasta);

  //console.log("DATOS", datos);

  //esperando = false;
  let tabla = armarTabla(datos);
  document.getElementById("datos").innerHTML = tabla;
}

async function dameDatos(desde, hasta) {
  let url = `${config.URL_API}/estadisticas/ventas/ultimaCompra`;
  let paquete = await fetch(url);
  let datos = await paquete.json();
  return datos;
}
