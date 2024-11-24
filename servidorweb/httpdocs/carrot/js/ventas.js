// traigo variables de configuracion como la url
const config = dameConfig();

//estas 2 globales ver con pablo, las cree para poder manejar valores que necesito
let idP = 0;
let indiceA = 0;

let detalleProductos = [];

const MODOS_MODAL = {
  MODO_VER: 1,
  MODO_EDITAR: 2,
  MODO_NUEVO: 3,
};

// mostrar botones de Detalle y Eliminar
const mostrarBotones = true;

// comienzo en modo ver
let modoModal = MODOS_MODAL.MODO_VER;

let modoModalDetalle = MODOS_MODAL.MODO_NUEVO;

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

const botones = [
  { texto: "Detalle", funcionEjecutar: verDetalle, clase: "btnDetalle" },
  {
    texto: "Eliminar",
    funcionEjecutar: accionEliminar,
    clase: "btnEliminar",
  },
  { texto: "Pago", funcionEjecutar: fnPagar, clase: "btnPagar" },
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

let producto = document.getElementById("producto");
let cantidad = document.getElementById("cantidad");
let precio = document.getElementById("precio");
let costo = document.getElementById("costo");
let botonCerrarModalDetalle = document.getElementById("cerrar-modal-detalle");
let botonGrabarModalDetalle = document.getElementById("grabar-cambios-detalle");
let botonEditarCancelarModal = document.getElementById("editar-cancelar-modal");

botonEditarCancelarModal.style.display = "none";

botonEditarCancelarModal.addEventListener("click", cancelarEdicionModal);
botonAgregarVenta.addEventListener("click", nuevoRegistro);
btnAplicar.addEventListener("click", aplicar);
btnCancelar.addEventListener("click", cancelar);
botonCerrarModal.addEventListener("click", cerrarModal);
botonGrabarVenta.addEventListener("click", grabarVenta);
botonAgregarProducto.addEventListener("click", agregarProducto);
//botonEditarModalDetalle.addEventListener("click", editarVenta);

botonCerrarModalDetalle.addEventListener("click", cerrarModalDetalle);
botonGrabarModalDetalle.addEventListener("click", agregarProductoDetalle);

console.log("HOY ", dameFechaDeHoy());

fechaVta.disabled = false;
clienteVta.disabled = false;

fechaVta.value = formatearFecha(null, "EN");

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
//inputFechaDesde.value = `2023-11-12`;
inputFechaDesde.value = fecha_6_meses_antes;

aplicar();

//////////////////////////////      F U N C I O N E S       //////////////////////////////

async function editarVenta() {
  modoModal = MODO_EDITAR;

  botonCerrarModal.innerHTML = "Cancelar";

  habilitarEdicionDetalleVenta();
  botonEditarModalDetalle.style.display = "none";
  botonGrabarVenta.style.display = "block";
  botonEditarCancelarModal.style.display = "block";
  botonCerrarModal.style.display = "none";

  dibujarDetalle();
}

function validarAntesDegrabarVenta(idCliente) {
  let bandera = true;
  if (detalleProductos.length == 0) {
    bandera = false;
    Swal.fire({
      text: "Debe cargar algun producto",
      icon: "error",
    });
  }
  if (idCliente == 0) {
    bandera = false;
    Swal.fire({
      text: "No hay Cliente Cargado.....",
      icon: "error",
    });
  }

  return bandera;
}

async function grabarVenta() {
  const idCliente = dameIdCajaSeleccionada("cliente-vta");

  if (validarAntesDegrabarVenta(idCliente)) {
    // tengo que validar los campos
    // y luego grabar la venta que tengo los datos en....
    console.log("Cliente ", clienteVta.value);
    console.log("Fecha Venta ", fechaVta.value);
    console.log("Observaciones ", observacionesVta.value);
    console.log("Productos ", detalleProductos);
    //(z < 18) ? x : y

    //console.log("Estoy en modo ", modoModal);

    let metodo = "";

    const datosVenta = {
      // tengo que tener el id de la venta por si modifico
      cliente: idCliente,
      fecha: fechaVta.value,
      observaciones: observacionesVta.value,
      detalleProductos,
    };

    let url = `${config.URL_API}/ventas/`;

    if (modoModal == MODOS_MODAL.MODO_EDITAR) {
      metodo = "PUT";
      // tomo el id de la venta que le habia grabado...seteado con setatt...
      const idVenta = botonGrabarVenta.getAttribute("data-id");
      url += idVenta;
      // entro por modo EDITAR
      console.log("Id de la venta es... ");
    }
    if (modoModal == MODOS_MODAL.MODO_NUEVO) {
      // entro por modo NUEVO
      metodo = "POST";
    }

    paquete = await fetch(url, {
      method: metodo,
      body: JSON.stringify(datosVenta),
      headers: { "Content-Type": "application/json" },
    });

    aplicar();
    cerrarModal();
  }
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
    //(z < 18) ? x : y
    let modo = modoModal == MODOS_MODAL.MODO_VER ? `disabled` : "";
    filas += `<tr>
                <td>${indice} - ${producto.nombre}</td>
                <td class="fila-nro">${producto.cantidad}</td> 
                <td class="fila-nro">${producto.costo}</td> 
                <td class="fila-nro">${producto.precio}</td>                
                <td class="fila-nro">${subt}</td>    
                <td>                
                  <button data-indiceArray=${indice} class="btn-editar-fila" ${modo}>Editar</button>
                  <button data-indiceArray=${indice} class="btn-eliminar-fila" ${modo}>Eliminar</button>
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
  indiceA = indice;

  cambiarEstadoModalDetalle(MODOS_MODAL.MODO_EDITAR);
  //modomodoModalDetalle = MODO_EDITAR;

  producto.setAttribute("data-id", detalleProductos[indice].id_articulo);
  let idP = dameIdCajaSeleccionada(`producto`);
  console.log("Id de Producto ", idP);
  console.log("DETALLE PROD ", detalleProductos[indice]);

  //alert("Editando Fila " + indice);
  cambiarEstadoModalDetalle(MODOS_MODAL.MODO_EDITAR); //editar
  tituloModalDetalle.innerHTML = "Editando Producto";

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
  console.log("Indice del array que estoy modificando ", indiceA);
  idP = dameIdCajaSeleccionada("producto");
  console.log("ID del producto ", idP);

  if (dameIdCajaSeleccionada("producto") > 0) {
    // primero validar los campos
    if (producto.value && cantidad.value && precio.value) {
      if (modoModalDetalle == MODOS_MODAL.MODO_NUEVO) {
        detalleProductos.push({
          id_articulo: idP,
          nombre: producto.value,
          costo: parseInt(costo.value),
          precio: parseInt(precio.value),
          cantidad: parseInt(cantidad.value),
        });
      }

      if (modoModalDetalle == MODOS_MODAL.MODO_EDITAR) {
        // aca debo modificarlo
        // primero Borro
        detalleProductos.splice(indiceA, 1);
        // luego agrego
        detalleProductos.push({
          id_articulo: idP,
          nombre: producto.value,
          costo: parseInt(costo.value),
          precio: parseInt(precio.value),
          cantidad: parseInt(cantidad.value),
        });
        modalProducto.hide();
      }

      idP = 0;
      producto.value = "";
      costo.value = "";
      precio.value = "";
      cantidad.value = "";
      dibujarDetalle();
    } else {
      alert("Por favor completar todos los campos");
    }
  } else {
    alert("Seleccione un Articulo.........");
    producto.value = "";
  }
}

function agregarProducto() {
  idP = 0;

  //alert("Modo del modal " + modoModal);
  producto.value = "";
  cantidad.value = "";
  precio.value = "";
  costo.value = "";

  //seteo para que luego cuando GRABE pueda interpretar la accion
  cambiarEstadoModalDetalle(MODOS_MODAL.MODO_NUEVO);
  //modoModalDetalle = MODO_NUEVO;

  tituloModalDetalle.innerHTML = "Nuevo Producto";
  modalProducto.show();
}

async function setearProd(idProducto) {
  console.log("BUSCANDO CODIGO DE PROD ", idProducto);
  idP = idProducto;
  let url = `${config.URL_API}/productos/${idProducto}`;
  let datos = "";
  let paquete = await fetch(url);
  datos = await paquete.json();
  console.log("Producto ", datos);
  cantidad.value = 1;
  precio.value = datos.precio;
  costo.value = datos.costo;
}

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

// con esta funcion creo un input de busqueda
// le paso el id del input ej: clientes
// le paso la url para buscar esos clientes
// le paso la funcion que va a dibujar los clientes en la caja de resultados
// de esa busqueda
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

// hasta aca las funciones que tienen que ver con el input

function cancelar() {
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
    botones,
  });
}

function nuevoRegistro() {
  cambiarEstadoModal(MODOS_MODAL.MODO_NUEVO);

  modal.show();
  habilitarEdicion();
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
    botones,
  });
}

// paso true y habilito los inputs o false y deshabilito
function manejadorInputs(bandera) {
  //id.disabled = true;
  //nombre.disabled = bandera;
}

function editar() {
  console.log("EDITANDO");
  tituloModal.innerHTML = "Editando.. " + nombrePantalla;
  botonGrabarModalDetalle.style.display = "block";

  botonEditarCancelarModal.style.display = "block";
  modoModal = MODO_EDITAR;
  alert("Modo " + modoModal);
  manejadorInputs(false);
}

function cambiarEstadoModalDetalle(estado) {
  console.log("ESTADO ", estado);
  modoModalDetalle = estado;
  //alert("ESTADO " + estado);
  if (estado === modoModalDetalle.MODO_EDITAR) {
    alert("Modo Editando");
  }
  if (estado === modoModalDetalle.MODO_VER) {
    alert("Modo Visualizando");
  }
}

function cambiarEstadoModal(estado) {
  modoModal = estado;

  if (estado === MODOS_MODAL.MODO_NUEVO) {
    detalleProductos = [];
    dibujarDetalle();

    tituloModal.innerHTML = "Nueva Venta";
    //Seteo el estado para nuevo
    //Habilito cajas
    //Tema botones
    clienteVta.disabled = false;
    fechaVta.disabled = false;
    botonAgregarProducto.disabled = false;
    observacionesVta.disabled = false;

    botonAgregarProducto.style.display = "block";
    botonEditarCancelarModal.style.display = "none";
    botonGrabarVenta.style.display = "block";

    observacionesVta.value = "";
    fechaVta.value = formatearFecha(null, "EN");
    clienteVta.value = "";
  } else if (estado === MODOS_MODAL.MODO_EDITAR) {
    tituloModal.innerHTML = "Editando Venta";
    //Seteo el estado para nuevo
    //Habilito cajas
    //Tema botones
    botonEditarCancelarModal.innerHTML = "Cancelar";

    clienteVta.disabled = false;
    fechaVta.disabled = false;
    botonAgregarProducto.disabled = false;
    observacionesVta.disabled = false;

    botonGrabarVenta.style.display = "block";
    botonAgregarProducto.style.display = "block";
    botonCerrarModal.style.display = "none";

    dibujarDetalle();
  } else if (estado === MODOS_MODAL.MODO_VER) {
    tituloModal.innerHTML = "Visualizando Venta";
    //Seteo el estado para nuevo
    //Habilito cajas
    //Tema botones

    clienteVta.disabled = true;
    fechaVta.disabled = true;
    botonAgregarProducto.disabled = true;
    observacionesVta.disabled = true;

    botonCerrarModal.style.display = "block";
    botonEditarCancelarModal.style.display = "none";
    botonGrabarVenta.style.display = "none";

    botonEditarCancelarModal.innerHTML = "Editar";
    botonEditarCancelarModal.style.display = "block";
    dibujarDetalle();
  }
}

function cancelarEdicionModal() {
  if (modoModal == MODOS_MODAL.MODO_EDITAR) {
    cambiarEstadoModal(MODOS_MODAL.MODO_VER);
  } else {
    cambiarEstadoModal(MODOS_MODAL.MODO_EDITAR);
  }
}

function cerrarModal() {
  cambiarEstadoModal(MODOS_MODAL.MODO_VER);

  modal.hide();
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
      //actualizarDash();
      aplicar();
    }
  });
  // una vez eliminado refrescar con actualizarDASH()
}

async function traemeVenta(idVenta) {
  let url = `${config.URL_API}/ventas/${idVenta}`;
  let paquete = await fetch(url);
  let datos = await paquete.json();
  return datos[0];
}

function habilitarEdicionDetalleVenta() {
  clienteVta.disabled = false;
  fechaVta.disabled = false;
  observacionesVta.disabled = false;
  botonAgregarProducto.disabled = false;
}

function desabhilitarEdicionDetalleVenta() {
  clienteVta.disabled = true;
  fechaVta.disabled = true;
  observacionesVta.disabled = true;
  botonAgregarProducto.disabled = true;
}

async function verDetalle(event) {
  //modoModal = MODO_VER;
  cambiarEstadoModal(MODOS_MODAL.MODO_VER);

  let codigoVenta = event.target.getAttribute("data-id");

  // le paso el id de la venta al boton GRABAR
  botonGrabarVenta.setAttribute("data-id", codigoVenta);
  console.log("Cod de venta ", codigoVenta);
  //contenedorCodigo.style.display = "block";

  const datos = await traemeVenta(codigoVenta);
  console.log("Datos ", datos);
  clienteVta.setAttribute("data-id", datos.idCliente);
  clienteVta.value = datos.cliente;
  observacionesVta.value = datos.observaciones ? datos.observaciones : "";

  let fe = dameFechaFormateadaEsp(datos.fechaSola);
  //console.log("Fecha ", fe);
  //console.log("Fecha vuelta ", dameVueltaFecha(fe));
  fechaVta.value = dameVueltaFecha(fe);

  // desabhilitarEdicionDetalleVenta();

  //refactor con pablo
  //esto lo hago para que al editar poder saber que codigo de venta estoy utilizando

  //alert("Editando Venta " + idVenta);
  let url = `${config.URL_API}/ventas/detalle/${codigoVenta}`;
  let detalle = "";
  let paquete = await fetch(url);
  detalle = await paquete.json();
  console.log("Detalle de la venta ", detalle);
  detalleProductos = detalle;
  dibujarDetalle();

  modal.show();
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

function fnPagar(event) {
  idVenta = event.target.getAttribute("data-id");
  //console.log("Pagando de la venta ", idVenta);
  //saltar a pagina nueva
  window.location.href = `pagos.html?idVenta=${idVenta}`;
}
