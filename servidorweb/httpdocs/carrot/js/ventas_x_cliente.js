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

function ejecutarCambioUsuarios(event) {
  let idUsuario = event.target.value;
  console.log("Seleccione usuario " + idUsuario);
  USUARIO_ACTIVO = idUsuario;
}

async function ejecutar() {
  let desde = dameFechaFormateadaEsp(inputFechaDesde.value);
  let hasta = dameFechaFormateadaEsp(inputFechaHasta.value);

  //la base de datos de Carrot espera un string en la fecha con el formato anio-mes-dia
  //desde = `2023-01-01`;
  // hasta = `2023-09-30`;

  desde = dameVueltaFecha(desde);
  hasta = dameVueltaFecha(hasta);

  actualizarDash(desde, hasta);
}

let FechaDiaHoy = formatearFecha(null, "EN");
inputFechaDesde.value = FechaDiaHoy;
inputFechaHasta.value = FechaDiaHoy;

// dado un json de datos armo una tabla y muestro los datos
function armarTabla(datos) {
  console.log("DATOS ", datos);

  //quiero saber cuantas cabezas es el total
  let totalCab = 0;
  for (let i = 0; i < datos.length; i++) {
    totalCab += +datos[i].cabezas;
  }

  const columnas = [
    "Id",
    "Cliente",
    "Cantidad Vendida",
    "Importe",
    "Costo",
    "Ganancia",
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

  let costoTot = 0;
  let precioTot = 0;
  let gananciaTot = 0;

  for (let i = 0; i < datos.length; i++) {
    let nomApe = datos[i].nombre;
    datos[i].apellido ? (nomApe += `, ` + datos[i].apellido) : ``;

    dat += `<tr class="table-secondary">`;
    dat += `<td>` + datos[i].id + `</td>`;
    //dat += `<td>` + datos[i].nombre + `, ` + datos[i].apellido + `</td>`;
    dat += `<td>` + nomApe;
    dat += `<td>` + datos[i].importe_total + `</td>`;
    dat += `<td>` + datos[i].costo_total + `</td>`;
    dat += `<td>` + datos[i].ganancia + `</td>`;

    costoTot += parseInt(datos[i].costo_total);
    precioTot += parseInt(datos[i].importe_total);
    gananciaTot += parseInt(datos[i].ganancia);

    //porc = (datos[i].precio * 100) / precioTot;

    dat += `</tr>`;
  }

  dat += `<td></td>`;
  dat += `<td></td>`;
  dat += `<td>$ ${costoTot}</td>`;
  dat += `<td>$ ${precioTot}</td>`;
  dat += `<td>$ ${gananciaTot}</td>`;

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
  const datos = await dameEstadisticasCategoria(desde, hasta);
  //esperando = false;
  let tabla = armarTabla(datos);
  document.getElementById("datos").innerHTML = tabla;
  crearGrafico(datos);
}

async function dameEstadisticasCategoria(desde, hasta) {
  let url = `${config.URL_API}/estadisticas/ventas/agrupado_cliente/${desde}/${hasta}/${USUARIO_ACTIVO}`;
  let paquete = await fetch(url);
  let datos = await paquete.json();
  return datos;
}

//paso el json y me devuelve solo las columnas
function armadoColumnas(datu, campo) {
  let columnas = [];
  let i = 0;
  // armado de columnas
  for (i === 0; i < datu.length; i++) {
    objeto = datu[i][campo];
    columnas.push(objeto);
  }
  columnas.reverse();
  // fin armado columnas
  return columnas;
}

// paso el json y me devuelve solo el dataset
function armadoDataset(datu, campo) {
  //armado dataset
  let dat = [];
  let i = 0;
  for (i === 0; i < datu.length; i++) {
    dat.push(datu[i][campo]);
  }
  dat.reverse();
  //fin armado dataset
  return dat;
}

async function crearGrafico(datos) {
  //const datu = await dameEntrada(desde, hasta);
  let columnas = armadoColumnas(datos, "nombre");
  let dat = armadoDataset(datos, "importe_total");

  //console.log("Columnas ", columnas);
  //console.log("Categorias ", dat);

  datasets = [
    {
      label: "Cliente",
      data: dat,
    },
  ];
  //console.log("Columnas ", columnas);
  //console.log("Datos ", datasets);

  // tipos de grafico bar, line, pie, doughnut
  const tipoGrafico = "doughnut";
  // llamo a armarGrafico y le paso el id del CANVAS
  armarGrafico("grafico_datos", tipoGrafico, columnas, datasets, "", "");
}
