// traigo variables de configuracion como la url
const config = dameConfig();

let detalleProductos = [];

//modos en los cuales voy estando
const MODO_VER = 1;
const MODO_EDITAR = 2;
const MODO_NUEVO = 3;

// mostrar botones de Detalle y Eliminar
const mostrarBotones = true;

// comienzo en modo ver
let modoModal = MODO_VER;

// comienzo con un array vacio
let datosJson = [];

// donde yo tenga que poner los datos
let registrosPorPantalla = 13;
let comenzarDesdePagina = 1;
const nombrePantalla = "Ventas";

// columnas son las columnas a mostrar en la tabla por pantalla
let columnas = [
  null,
  "Cliente",
  "Fecha",
  "Importe",
  "Pagado",
  "Pendiente",
  "Usuario",
];

// campos en el formulario del modal
let campos = [
  "id",
  "cliente",
  "fecha",
  "importe",
  "pagado",
  "pendiente",
  "usuario",
];

// aca le estoy enviando el campo id pero en columna como null para que no lo muestre...
// tipoCampos le digo de que tipo es para luego saber como tratarlos
let tiposCampos = [null, "text", "date", "moneda", "moneda", "moneda", "text"]; //Si es select, busco el id en la columna que se llame id_categoria (o el nombre que sea)

// las funciones que debe utilizar cuando hago click en esa celda
let funcionesDetalle = [null, null, null, null, null, null, null];

// estas son las funciones que van asociados a los selects
let funcionesSelect = [null, null, null, null, null, null, null];

//a partir de esta linea puedo manejar el modal
const modal = new bootstrap.Modal(document.getElementById("modal-venta"), {
  backdrop: false,
});

const modalProducto = new bootstrap.Modal(
  document.getElementById("modal-producto-nuevo"),
  {
    backdrop: false,
  }
);

// tomo control de los controles del formulario de venta
const fecha = document.getElementById("fecha");
const cliente = document.getElementById("cliente");
const nombre = document.getElementById("nombre");
let botonCerrarModal = document.getElementById("cerrar-modal");
let inputFechaDesde = document.getElementById("desde");
let inputFechaHasta = document.getElementById("hasta");
let pendientes = document.getElementById("pendientes");
let usuarios = document.getElementById("usuarios");
let btnAplicar = document.getElementById("aplicar");
let btnCancelar = document.getElementById("cancelar");
const tituloModal = document.getElementById("titulo-modal");
const tituloModalDetalle = document.getElementById("titulo-modal-detalle");
const contenedorCodigo = document.getElementById("contenedor-codigo");
const clientes = document.getElementById("clientes");
//const listaClientes = document.getElementById("listaClientes");
let fechaVta = document.getElementById("fecha-vta");
let clienteVta = document.getElementById("cliente-vta");
let observacionesVta = document.getElementById("observaciones-vta");
let detalleVenta = document.getElementById("detalle-venta");
let botonGrabarVenta = document.getElementById("grabar-venta");
let botonAgregarVenta = document.getElementById("boton-nueva-venta");
let botonAgregarProducto = document.getElementById(
  "btn-modal-agregar-producto"
);

// detalle venta

let producto = document.getElementById("producto");
let cantidad = document.getElementById("cantidad");
let precio = document.getElementById("precio");
let costo = document.getElementById("costo");
let botonCerrarModalDetalle = document.getElementById("cerrar-modal-detalle");
let botonGrabarModalDetalle = document.getElementById("grabar-cambios-detalle");

// fin botones de venta

botonAgregarVenta.addEventListener("click", nuevoRegistro);
btnAplicar.addEventListener("click", aplicar);
btnCancelar.addEventListener("click", cancelar);
botonCerrarModal.addEventListener("click", cerrarModal);
botonGrabarVenta.addEventListener("click", grabarVenta);
botonAgregarProducto.addEventListener("click", agregarProducto);

botonCerrarModalDetalle.addEventListener("click", cerrarModalDetalle);
botonGrabarModalDetalle.addEventListener("click", agregarProductoDetalle);

console.log("HOY ", dameFechaDeHoy());

fechaVta.disabled = false;
clienteVta.disabled = false;

fechaVta.value = formatearFecha(null, "EN");
clienteVta.value = "Nicola di bari";

// comienzo

botonGrabarModalDetalle.style.display = "block";
botonAgregarVenta.style.display = "block";

let cantRegistros = 0;

let FechaDiaHoy = formatearFecha(null, "EN");
inputFechaDesde.value = FechaDiaHoy;
inputFechaHasta.value = FechaDiaHoy;

// aca quiero que la fecha desde sea 6 meses antes....
console.log("Fecha Hoy ", FechaDiaHoy);
let fecha_6_meses_antes = restaleFecha(FechaDiaHoy);
console.log(" Restado ", fecha_6_meses_antes);
inputFechaDesde.value = `2023-11-12`;
inputFechaDesde.value = fecha_6_meses_antes;

aplicar();

//////////////////////////////      F U N C I O N E S       //////////////////////////////

function grabarVenta() {
  // tengo que validar los campos
  // y luego grabar la venta que tengo los datos en....
  console.log("Cliente ", clienteVta.value);
  console.log("Fecha Venta ", fechaVta.value);
  console.log("Productos ", detalleProductos);
  //(z < 18) ? x : y

  console.log("Observaciones ", observacionesVta.value);

  // si todo esta bien y validado....
  //hacer el fetch
  /*url = `${config.URL_API}/venta/${valorCodigo}`;
  paquete = await fetch(url, {
    method: "POST",
    body: JSON.stringify(detalleProductos),
    headers: { "Content-Type": "application/json" },
  });*/
}

// en base al json detalleProducto dibuja
/*const detalleProductos = [
  { id: 1, producto: "Tubo Odea X3", costo: 2300, venta: 3500, cantidad: 2 },  
];*/
function dibujarDetalle() {
  let filas = "";
  let totalFinal = 0;
  detalleProductos.forEach((producto, indice) => {
    const subt = producto.cantidad * producto.precio;
    filas += `<tr>
                <td>${producto.nombre}</td>
                <td class="fila-nro">${producto.cantidad}</td> 
                <td class="fila-nro">${producto.costo}</td> 
                <td class="fila-nro">${producto.precio}</td>                
                <td class="fila-nro">${subt}</td>    
                <td>
                  <button data-indiceArray=${indice} class="btn-editar-fila">Editar</button>
                  <button data-indiceArray=${indice} class="btn-eliminar-fila">Eliminar</button>
                </td>    
             </tr>`;
    totalFinal += subt;
  });
  const tot = `<tr>  
                <td class="fila-nro" colspan="5">${totalFinal}</td>    
                <td></td>    
              </tr>`;
  detalleVenta.innerHTML = filas + tot;

  const filasEditar = document.getElementsByClassName("btn-editar-fila");
  for (i = 0; i < filasEditar.length; i++) {
    filasEditar[i].addEventListener("click", editarFila);
  }

  const filasEliminar = document.getElementsByClassName("btn-eliminar-fila");
  for (i = 0; i < filasEliminar.length; i++) {
    filasEliminar[i].addEventListener("click", eliminarFila);
  }
}

async function editarFila(event) {
  const indice = event.target.getAttribute("data-indiceArray");
  const idProducto = detalleProductos[indice].id;
  //alert("Editando Fila " + indice);
  modoModal = 2; //editar
  tituloModalDetalle.innerHTML = "Editando Producto";
  // ir a buscar al producto con id
  //let url = `${config.URL_API}/productos/${idProducto}`;
  //let datos = "";
  //let paquete = await fetch(url);
  //datos = await paquete.json();
  //console.log("Producto ", datos);
  producto.value = detalleProductos[indice].nombre;
  cantidad.value = detalleProductos[indice].cantidad;
  precio.value = detalleProductos[indice].precio;
  costo.value = detalleProductos[indice].costo;
  modalProducto.show();
}

function eliminarFila(event) {
  const indice = event.target.getAttribute("data-indiceArray");
  Swal.fire({
    title: "Elimina seguro",
    text: "Esta accion no se puede deshacer!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      detalleProductos.splice(indice, 1);
      //Swal.fire("Eliminado", "Puede continuar");
      dibujarDetalle();
      console.log("Productos que quedan ", detalleProductos);
    }
  });
}

function cerrarModalDetalle() {
  modalProducto.hide();
}

function agregarProductoDetalle() {
  //alert("Llame a grabar cambios");

  //botonCerrarModalDetalle.style.display = "block";
  detalleProductos.push({
    id: 3,
    nombre: producto.value,
    //costo: costo.value,
    costo: 100,
    precio: precio.value,
    cantidad: cantidad.value,
  });
  dibujarDetalle();
}

function agregarProducto() {
  producto.value = "";
  cantidad.value = "";
  precio.value = "";
  costo.value = "";
  tituloModalDetalle.innerHTML = "Nuevo Producto";
  modalProducto.show();
}

const convertirInputBusqueda = (idInput, urlBusqueda, funcionDibujar) => {
  const input = document.getElementById(idInput);
  const padre = input.parentNode;
  const lista = document.createElement("div");
  lista.classList.add("lista-resultados-busqueda");
  padre.insertBefore(lista, input.nextSibling);

  lista.style.display = "none";

  input.addEventListener("keyup", dibujarLista);
  input.addEventListener("click", () => {
    input.value = "";
    input.removeAttribute("data-id");
  });

  const limpiarInput = () => {
    lista.innerHTML = "";
    lista.style.display = "none";
  };

  function irSeleccionado(event) {
    const masDatos = event.target.innerHTML;
    const id = event.target.getAttribute("data-id");

    input.value = masDatos.trim();
    lista.innerHTML = "";
    lista.style.display = "none";
    input.setAttribute("data-id", id);

    console.log("Seleccione ", masDatos);
    console.log("Id ", id);
    console.log("Input ", input.getAttribute("id"));

    if (input.getAttribute("id") == "producto") {
      // es un producto al que hice click en tonces ir a buscar los datos y meterlos en los inputs
      // ir a buscar al producto con id
      setearProd(id);
    }
  }

  async function setearProd(idProducto) {
    console.log("BUSCANDO CODIGO DE PROD ", idProducto);
    let url = `${config.URL_API}/productos/${idProducto}`;
    let datos = "";
    let paquete = await fetch(url);
    datos = await paquete.json();
    console.log("Producto ", datos);
    cantidad.value = 1;
    precio.value = datos.precio;
    costo.value = datos.costo;
  }

  // comentarle a pablo que sino ponia el await no escribia bien buscando eliana de forma rapida
  async function dibujarLista(event) {
    const textoBuscar = event.target.value;
    //console.log("Buscando ", textoBuscar);
    if (textoBuscar.length >= 3) {
      let url = `${urlBusqueda}${textoBuscar}`;
      let datos = "";
      let paquete = await fetch(url);
      datos = await paquete.json();

      //console.log("DATOS ", datos);
      if (textoBuscar === input.value) {
        if (datos.length > 0) {
          lista.innerHTML = funcionDibujar(datos);

          const listadoC = document.getElementsByClassName(
            "item-lista-resultados-busqueda"
          ); //CAMBIAR NOMBRE CLASE GENERICA
          for (i = 0; i < listadoC.length; i++) {
            listadoC[i].addEventListener("click", irSeleccionado);
          }
          lista.style.display = "block";
        } else {
          limpiarInput();
        }
      }
    } else {
      limpiarInput();
    }
  }
};

convertirInputBusqueda(
  "clientes",
  `${config.URL_API}/clientes/busqueda/?buscar=`,
  dibujarClientes
);

convertirInputBusqueda(
  "cliente-vta",
  `${config.URL_API}/clientes/busqueda/?buscar=`,
  dibujarClientes
);

convertirInputBusqueda(
  "producto",
  `${config.URL_API}/productos/busqueda/?buscar=`,
  dibujarProductos
);

function dibujarProductos(datos) {
  //console.log("Datos a dibujar ", datos);
  let html = `<ul>`;
  datos.forEach((producto) => {
    html += `<li data-id=${producto.id} class="item-lista-resultados-busqueda">
                ${producto.id} - ${producto.nombre.substr(0, 30)} - ${
      producto.precio
    } $
             </li>`;
  });
  return `${html}</ul>`;
}

function dibujarClientes(datos) {
  //console.log("Datos a dibujar ", datos);
  let html = `<ul>`;
  datos.forEach((cliente) => {
    html += `<li data-id=${cliente.id} class="item-lista-resultados-busqueda">
                ${cliente.id} - ${cliente.nombre.substr(
      0,
      20
    )} - ${cliente.apellido.substr(0, 29)} /     WS: ${cliente.whatsapp.substr(
      0,
      20
    )} - ${cliente.provincia} - ${cliente.localidad}
             </li>`;
  });
  return `${html}</ul>`;
}

function cancelar() {
  limpiarClientes;
  clientes.value = "";
  FechaDiaHoy = formatearFecha(null, "EN");
  inputFechaDesde.value = FechaDiaHoy;
  inputFechaHasta.value = FechaDiaHoy;
  pendientes.checked = false;
  usuarios.value = 1;
}

async function aplicar() {
  let desde = dameFechaFormateadaEsp(inputFechaDesde.value);
  let hasta = dameFechaFormateadaEsp(inputFechaHasta.value);

  //la base de datos de Carrot espera un string en la fecha con el formato anio-mes-dia
  //desde = `2023-01-01`;
  // hasta = `2023-09-30`;
  desde = dameVueltaFecha(desde);
  hasta = dameVueltaFecha(hasta);

  //averiguo si tiene el cliente seleccionado en la caja input
  if (clientes.getAttribute("data-id")) {
    console.log(clientes.getAttribute("data-id"));
    console.log("Desde ", desde);
    console.log("Hasta ", hasta);
    console.log("Pendiente ", pendientes.checked);
    console.log("Usuario Seleccionado ", usuarios.value);
  } else {
    console.log("No hay cliente seleccionado");
  }
  // salir para buscar los datos y refrescar la tabla
  const idCliente = clientes.getAttribute("data-id");
  let pendiente = 0;
  if (pendientes.checked) {
    pendiente = 1;
  } else {
    pendiente = 0;
  }

  let url = `${config.URL_API}/ventas/?desde=${desde}&hasta=${hasta}&pendientes=${pendiente}&usuarios=${usuarios.value}`;

  if (idCliente) {
    url += `&idCliente=${idCliente}`;
  }

  let paquete = await fetch(url);
  let datos = await paquete.json();

  dibujarTabla({
    datos: datos,
    columnas: columnas,
    campos,
    tiposCampos,
    titulo: "Registros de Ventas",
    cantidadRegistrosPorPagina: registrosPorPantalla,
    paginaDesde: 1,
    idContenedor: "ventas",
    mostrarPaginador: true,
    mostrarBotones: mostrarBotones,
    verDetalle,
    accionEliminar,
    cerrarModal,
    manejadorInputs,
    funcionesDetalle,
    funcionesSelect,
  });
}

function nuevoRegistro() {
  modoModal = MODO_NUEVO;
  tituloModal.innerHTML = "Nueva Venta";
  observacionesVta.value = "";
  fechaVta.value = formatearFecha(null, "EN");
  clienteVta.value = "";
  modal.show();
  habilitarEdicion();
  botonCerrarModal.innerHTML = "Cerrar";
  botonAgregarProducto.style.display = "block";
}

function habilitarEdicion() {
  //id.disabled = false;
  //nombre.disabled = false;
  // vengo por nuevo producto
  //contenedorCodigo.style.display = "none";
  //nombre.value = "";
  // apellido.value = 0;
  //whatsapp.value = 0;
  //cargarSelect(categoria.value);
}

function buscar(event) {
  const textoabuscar = event.target.value.toUpperCase();
  //console.log("datosJson", datosJson);
  let Json2 = [];

  if (textoabuscar.length >= 1) {
    Json2 = datosJson.filter((elemento) => {
      return elemento.cliente.toUpperCase().indexOf(textoabuscar) >= 0;
    });
  } else {
    Json2 = datosJson;
  }

  dibujarTabla({
    datos: Json2,
    columnas: columnas,
    campos,
    tiposCampos,
    titulo: "Registros de Ventas",
    cantidadRegistrosPorPagina: registrosPorPantalla,
    paginaDesde: 1,
    idContenedor: "ventas",
    mostrarPaginador: true,
    mostrarBotones: mostrarBotones,
    verDetalle,
    accionEliminar,
    cerrarModal,
    manejadorInputs,
    funcionesDetalle,
    funcionesSelect,
  });
}

async function validarCampos() {
  alert("GRABAR VENTA");

  let continuar = true;

  // if (parseInt(categoria.value) === -1) {
  //   continuar = false;
  // }
  if (nombre.value === "") {
    continuar = false;
  }

  console.log("CONTINUAR ", continuar);

  if (continuar) {
    grabarCambios();
  } else {
    await Swal.fire({
      text: "Completar los campos del Formulario",
      icon: "error",
    });
  }
}

// paso true y habilito los inputs o false y deshabilito
function manejadorInputs(bandera) {
  //id.disabled = true;
  //nombre.disabled = bandera;
}

function editar() {
  console.log("EDITANDO");
  tituloModal.innerHTML = "Editando " + nombrePantalla;
  botonGrabarModalDetalle.style.display = "block";
  botonCerrarModal.innerHTML = "Cancelar";
  modoModal = MODO_EDITAR;
  manejadorInputs(false);
}

function cerrarModal() {
  detalleProductos = [];
  dibujarDetalle();
  //botonCerrarModal.style.display = "block";
  //botonGrabarModalDetalle.style.display = "none";
  botonCerrarModal.innerHTML = "Cerrar";
  manejadorInputs(true);

  console.log("Modo del Modal ", modoModal);

  switch (modoModal) {
    case MODO_VER:
      // cerrar el modal
      modal.hide();
      break;

    case MODO_EDITAR:
      tituloModal.innerHTML = "Visualizando " + nombrePantalla;
      modoModal = MODO_VER;
      break;

    case MODO_NUEVO:
      // cerrar el modal
      modal.hide();
      break;
  }
}

async function accionEliminar(event) {
  let id = event.target.getAttribute("data-id");

  Swal.fire({
    title: "Elimina seguro",
    text: "Esta accion no se puede deshacer!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await eliminar(id);
      Swal.fire(nombrePantalla + " Eliminado", "Puede continuar");
      //una vez eliminado el articulo refrescar
      actualizarDash();
    }
  });
  // una vez eliminado refrescar con actualizarDASH()
}

async function verDetalle(event) {
  contenedorCodigo.style.display = "block";
  modoModal = MODO_VER;
  tituloModal.innerHTML = "Visualizando " + nombrePantalla;
  let codigo = event.target.getAttribute("data-id");
  let url = `${config.URL_API}/ventas/${codigo}`;
  let paquete = await fetch(url);
  //console.log(paquete);
  let datos = await paquete.json();
  console.log({ datos });

  // guardo en los inputs el valor que vino del fetch buscando el producto en cuestion
  id.value = datos.id;
  nombre.value = datos.nombre;
  apellido.value = datos.apellido;
  whatsapp.value = datos.whatsapp;

  //await cargarSelect(datos.id_categoria);
  modal.show();
}

// dado un json de datos armo una tabla y muestro los datos
async function actualizarDash() {
  //campoBusqueda.value = "";
  datosJson = await dameRegistros();

  //console.log(campos);

  dibujarTabla({
    datos: datosJson,
    columnas: columnas,
    campos,
    tiposCampos,
    titulo: "Registros de Ventas",
    cantidadRegistrosPorPagina: registrosPorPantalla,
    paginaDesde: 1,
    idContenedor: "ventas",
    mostrarPaginador: true,
    mostrarBotones: mostrarBotones,
    verDetalle,
    accionEliminar,
    cerrarModal,
    manejadorInputs,
    funcionesDetalle,
    funcionesSelect,
  });
}

async function dameRegistros() {
  let url = `${config.URL_API}/ventas`;
  let datos = "";
  try {
    let paquete = await fetch(url);
    datos = await paquete.json();
    cantProductos = datos.length;
  } catch {
    //console.log(console.error());
  }
  return datos;
}

async function eliminar(id) {
  // estoy en nuevo vos con post
  let url = `${config.URL_API}/ventas/${id}`;

  paquete = await fetch(url, {
    method: "DELETE",
  });

  //let datos = await paquete.json()
  return { mensaje: "Eliminado" };
}

async function modificarCampo(id, campo, valor) {
  let url = `${config.URL_API}/ventas/campo/${id}`;
  const datosEnvio = {
    campo: campo,
    valor: valor,
  };
  paquete = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(datosEnvio),
    headers: { "Content-Type": "application/json" },
  });
}

async function grabarCambios() {
  let paquete = "";

  const datosEnvio = {
    nombre: nombre.value,
    costo: costo.value ? costo.value : 0,
    precio: precio.value ? precio.value : 0,
    categoria: categoria.value,
  };

  console.log("Datos envio ", datosEnvio);

  try {
    if (modoModal === MODO_EDITAR) {
      const valorCodigo = codigo.value;
      // estoy en editar voy con put
      url = `${config.URL_API}/ventas/${valorCodigo}`;
      paquete = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(datosEnvio),
        headers: { "Content-Type": "application/json" },
      });
    }

    if (modoModal === MODO_NUEVO) {
      //const valorCodigo = codigo.value;
      // estoy en nuevo voy con post
      url = `${config.URL_API}/ventas`;
      paquete = await fetch(url, {
        method: "POST",
        body: JSON.stringify(datosEnvio),
        headers: { "Content-Type": "application/json" },
      });
    }

    let datos = paquete.json();

    //console.log(datos);

    await Swal.fire({
      text: "Se grabo correctamente la venta",
      icon: "success",
    });
    modoModal = MODO_VER;
    await cerrarModal();
    actualizarDash();
  } catch {
    await Swal.fire({ text: "Hubo un error", icon: "error" });
  }
}
