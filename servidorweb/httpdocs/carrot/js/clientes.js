// traigo variables de configuracion como la url
const config = dameConfig();

//modos en los cuales voy estando
const MODO_VER = 1;
const MODO_EDITAR = 2;
const MODO_NUEVO = 3;

// mostrar botones de Detalle y Eliminar
const mostrarBotones = true;

const botones = [
  { texto: "Detalle", funcionEjecutar: verDetalle, clase: "btnDetalle" },
  {
    texto: "Eliminar",
    funcionEjecutar: accionEliminar,
    clase: "btnEliminar",
  },
];

// comienzo en modo ver
let modoModal = MODO_VER;

// comienzo con un array vacio
let datosJson = [];

// donde yo tenga que poner los datos
let registrosPorPantalla = 13;
let comenzarDesdePagina = 1;
const nombrePantalla = "Clientes";

// columnas son las columnas a mostrar en la tabla por pantalla
let columnas = [
  "ID",
  "Nombre",
  "Apellido",
  "Whats App",
  "DNI",
  "Cpostal",
  "Provincia",
  "Localidad",
];

// campos en el formulario del modal
let campos = [
  "id",
  "nombre",
  "apellido",
  "whatsapp",
  "dni",
  "cpostal",
  "provincia",
  "localidad",
];

// aca le estoy enviando el campo id pero en columna como null para que no lo muestre...
// tipoCampos le digo de que tipo es para luego saber como tratarlos
let tiposCampos = [
  "number",
  "text",
  "text",
  "text",
  "text",
  "text",
  "select",
  "select",
]; //Si es select, busco el id en la columna que se llame id_categoria (o el nombre que sea)

// las funciones que debe utilizar cuando hago click en esa celda
let funcionesDetalle = [null, detalleNombre, detalleApellido];

// estas son las funciones que van asociados a los selects
let funcionesSelect = [null, null, null, null, null];

//a partir de esta linea puedo manejar el modal de cliente
const modal = new bootstrap.Modal(document.getElementById("modal-cliente"), {
  backdrop: false,
});

//a partir de esta linea puedo manejar el modal de localidad
const modalLocalidad = new bootstrap.Modal(
  document.getElementById("modal-localidad"),
  {
    backdrop: false,
  }
);

// tomo control de los controles del formulario
const id = document.getElementById("id");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const whatsapp = document.getElementById("whatsapp");
const dni = document.getElementById("dni");
const email = document.getElementById("email");
const domicilio = document.getElementById("domicilio");
const cpostal = document.getElementById("cpostal");
const pais = document.getElementById("pais");
const provincia = document.getElementById("provincia");
const localidad = document.getElementById("localidad");
const observaciones = document.getElementById("observaciones");

// tomo control del botonEjecutar y de los inputFecha
let campoBusqueda = document.getElementById("campoBusqueda");
// tomo control de los botones del modal cliente
let botonNuevo = document.getElementById("boton-agregar");
let botonGrabarCambios = document.getElementById("grabar-cambios");
let botonEditar = document.getElementById("editar");
let botonCerrarModal = document.getElementById("cerrar-modal");

let nombreNuevaLocalidad = document.getElementById("nombre-localidad");

// tomo control de los botones del modal localidades
const botonAgregarLocalidad = document.getElementById("agregarLocalidad");
const botonCerrarModalLocalidad = document.getElementById(
  "cerrar-modal-localidad"
);
const botonGrabarCambiosLocalidad = document.getElementById(
  "grabar-cambios-localidad"
);
const tituloModal = document.getElementById("titulo-modal");
const contenedorCodigo = document.getElementById("contenedor-codigo");

botonGrabarCambios.style.display = "none";
botonNuevo.style.display = "block";

let cantRegistros = 0;

campoBusqueda.addEventListener("input", buscar);
botonNuevo.addEventListener("click", nuevoRegistro);

// botones del modal clientes
botonEditar.addEventListener("click", editar);
botonCerrarModal.addEventListener("click", cerrarModal);
botonGrabarCambios.addEventListener("click", validarCampos);

// botones del modal de localidades
botonAgregarLocalidad.addEventListener("click", agregarLocalidad);
botonCerrarModalLocalidad.addEventListener("click", cerrarModalLocalidad);
botonGrabarCambiosLocalidad.addEventListener("click", grabarCambiosLocalidad);

pais.addEventListener("change", manejarSelectProvincias);
provincia.addEventListener("change", manejarSelectLocalidades);

//////////////////////////////      F U N C I O N E S       //////////////////////////////

function agregarLocalidad() {
  modalLocalidad.show();
  nombreNuevaLocalidad.disabled = false;
}

async function grabarCambiosLocalidad() {
  console.log("Localidad ", nombreNuevaLocalidad.value);
  // dar de alta localidad
  const idNuevaLocalidad = await insertarLocalidad(
    nombreNuevaLocalidad.value,
    provincia.value
  );

  console.log(idNuevaLocalidad);
  modalLocalidad.hide();
  // recargar localidades con la seleccionada
  cargarSelectLocalidades(provincia.value, idNuevaLocalidad);
}

async function insertarLocalidad(nombreLocalidad, id_provincia) {
  const datosEnvio = {
    nombre: nombreLocalidad,
    provincia: id_provincia,
  };
  url = `${config.URL_API}/localidades`;
  const paquete = await fetch(url, {
    method: "POST",
    body: JSON.stringify(datosEnvio),
    headers: { "Content-Type": "application/json" },
  });

  const datos = await paquete.json();

  return datos.insertId;
}

// FUNCIONES SELECTS

function cargarSelect(datos, idSeleccionar, nombreSelect, texto) {
  //console.log("ID SELECCIONAR ", idSeleccionar);
  //console.log("DATOS ", datos);
  //console.log("MODO MODAL ", modoModal);

  let html = ``;
  if (modoModal === 3 || modoModal === 2) {
    //nuevo o editando
    nombreSelect.innerHTML = "";
    html += `<option value="-1">${texto}</option>`;
  }

  for (i = 0; i < datos.length; i++) {
    //if (idSeleccionar && datos[i].id === idSeleccionar && modoModal != 3) {
    if (idSeleccionar && datos[i].id === idSeleccionar) {
      html += `<option value=${datos[i].id} selected>${datos[i].nombre}</option>`;
    } else {
      html += `<option value=${datos[i].id}>${datos[i].nombre}</option>`;
    }
  }

  nombreSelect.innerHTML = html;
}

async function cargarSelectLocalidades(id_provincia, id_localidad) {
  let url = `${config.URL_API}/localidades/provincia/${id_provincia}`;
  let paquete = await fetch(url);
  let datos = await paquete.json();

  await cargarSelect(
    datos,
    id_localidad,
    localidad,
    "Seleccione una localidad"
  );
  botonAgregarLocalidad.disabled = false;
}

function manejarSelectProvincias(event) {
  let id_pais = event.target.value;
  cargarSelectProvincias(id_pais);
}

function manejarSelectLocalidades(event) {
  let id_provincia = event.target.value;
  cargarSelectLocalidades(id_provincia);
}

async function cargarSelectProvincias(id_pais, id_provincia) {
  //console.log("ID PAIS ", id_pais);
  let url = `${config.URL_API}/provincias/pais/${id_pais}`;
  let paquete = await fetch(url);
  let datos = await paquete.json();

  cargarSelect(datos, id_provincia, provincia, "Seleccione una provincia");

  localidad.innerHTML = "";
  botonAgregarLocalidad.disabled = true;
}

async function cargarSelectPais(id_pais) {
  let url = `${config.URL_API}/paises/todos`;
  let paquete = await fetch(url);
  let datos = await paquete.json();
  let html = ``;
  if (modoModal === 3) {
    // nuevo
    html += `<option value="-1">Seleccione un pais</option>`;
  }

  html += cargarSelect(datos, id_pais, pais, "Seleccione un pais");

  localidad.innerHTML = "";
  botonAgregarLocalidad.disabled = true;
}

// FIN FUNCIONES SELECT

async function clickBotonGuardarNombre(td) {
  let id = td.getAttribute("data-id");
  let valor = document.getElementById("editor-td").value;

  Swal.fire({
    text: "Guardando",
    showConfirmButton: false,
    willOpen: async () => {
      Swal.showLoading();
      await modificarCampo(id, "nombre", valor);
      deshabilitarBotonesAcciones(false);
      td.innerHTML = valor;
      editandoCampo = false;
      Swal.close();
      Swal.fire({
        text: "Guardado correctamente",
        icon: "success",
      });
    },
  });
}

async function clickBotonGuardarApellido(td) {
  let id = td.getAttribute("data-id");
  let valor = document.getElementById("editor-td").value;

  Swal.fire({
    text: "Guardando",
    showConfirmButton: false,
    willOpen: async () => {
      Swal.showLoading();
      await modificarCampo(id, "apellido", valor);
      deshabilitarBotonesAcciones(false);
      td.innerHTML = valor;
      editandoCampo = false;
      Swal.close();
      Swal.fire({
        text: "Guardado correctamente",
        icon: "success",
      });
    },
  });
}

function detalleNombre(event) {
  if (!editandoCampo) {
    editandoCampo = true;

    deshabilitarBotonesAcciones(true);

    let id = parseInt(event.target.getAttribute("data-id"));
    //alert("ID del Producto " + idProducto);

    let nombre = event.target.innerHTML;
    const tdClickeado = event.target;

    event.target.innerHTML = `<input data-id="${id}" id="editor-td" type="text" value="${nombre}"/>
                              <button id="btn-guardar-td" data-id="${id}">Guardar</button>  
                              <button id="btn-cancelar-td" data-id="${id}">Cancelar</button>`;

    const botonCancelar = document.getElementById("btn-cancelar-td");
    const botonGuardar = document.getElementById("btn-guardar-td");
    const editorTd = document.getElementById("editor-td");

    botonCancelar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonCancelarNombre(nombre, tdClickeado);
    });

    botonGuardar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonGuardarNombre(tdClickeado);
    });

    editorTd.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        clickBotonGuardarNombre(tdClickeado);
      }
    });

    editorTd.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  } else {
    Swal.fire({
      text: "Debe guardar o cancelar para editar otro valor",
      icon: "info",
    });
  }
}

function clickBotonCancelarNombre(valorNombreOriginal, td) {
  deshabilitarBotonesAcciones(false);
  //alert("CANCELAR " + valorCostoOriginal + td);
  //console.log(td);
  td.innerHTML = valorNombreOriginal;

  editandoCampo = false;
}

function detalleApellido(event) {
  if (!editandoCampo) {
    editandoCampo = true;

    deshabilitarBotonesAcciones(true);

    let id = parseInt(event.target.getAttribute("data-id"));
    //alert("ID del Producto " + idProducto);

    let apellido = event.target.innerHTML;
    const tdClickeado = event.target;

    event.target.innerHTML = `<input data-id="${id}" id="editor-td" type="text" value="${apellido}"/>
                              <button id="btn-guardar-td" data-id="${id}">Guardar</button>  
                              <button id="btn-cancelar-td" data-id="${id}">Cancelar</button>`;

    const botonCancelar = document.getElementById("btn-cancelar-td");
    const botonGuardar = document.getElementById("btn-guardar-td");
    const editorTd = document.getElementById("editor-td");

    botonCancelar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonCancelarApellido(apellido, tdClickeado);
    });

    botonGuardar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonGuardarApellido(tdClickeado);
    });

    editorTd.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        clickBotonGuardarApellido(tdClickeado);
      }
    });

    editorTd.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  } else {
    Swal.fire({
      text: "Debe guardar o cancelar para editar otro valor",
      icon: "info",
    });
  }
}

function clickBotonCancelarApellido(valorNombreOriginal, td) {
  deshabilitarBotonesAcciones(false);
  //alert("CANCELAR " + valorCostoOriginal + td);
  //console.log(td);
  td.innerHTML = valorNombreOriginal;
  editandoCampo = false;
}

async function nuevoRegistro() {
  modoModal = MODO_NUEVO;
  tituloModal.innerHTML = "Nuevo";
  modal.show();
  habilitarEdicion();
  botonEditar.style.display = "none";
  botonCerrarModal.innerHTML = "Cerrar";
  botonGrabarCambios.style.display = "block";
  await cargarSelectPais();
}

function habilitarEdicion() {
  //id.disabled = false;
  nombre.disabled = false;
  apellido.disabled = false;
  whatsapp.disabled = false;
  dni.disabled = false;
  email.disabled = false;
  domicilio.disabled = false;
  cpostal.disabled = false;
  pais.disabled = false;
  provincia.disabled = false;
  localidad.disabled = false;
  observaciones.disabled = false;

  // vengo por nuevo producto
  contenedorCodigo.style.display = "none";
  nombre.value = "";
  apellido.value = "";
  whatsapp.value = "";
  dni.value = "";
  email.value = "";
  domicilio.value = "";
  cpostal.value = "";
  pais.value = "";
  provincia.value = "";
  localidad.value = "";
  observaciones.value = "";

  //cargarSelect(categoria.value);
}

function buscar(event) {
  const textoabuscar = event.target.value.toUpperCase();
  //console.log("datosJson", datosJson);
  let Json2 = [];

  if (textoabuscar.length >= 1) {
    Json2 = datosJson.filter((elemento) => {
      return (
        elemento.nombre.toUpperCase().indexOf(textoabuscar) >= 0 ||
        elemento.apellido.toUpperCase().indexOf(textoabuscar) >= 0 ||
        elemento.whatsapp.toUpperCase().indexOf(textoabuscar) >= 0 ||
        elemento.localidad.toUpperCase().indexOf(textoabuscar) >= 0 ||
        elemento.provincia.toUpperCase().indexOf(textoabuscar) >= 0
      );
    });
  } else {
    Json2 = datosJson;
  }

  dibujarTabla({
    datos: Json2,
    columnas: columnas,
    campos,
    tiposCampos,
    titulo: "Registros de Clientes",
    cantidadRegistrosPorPagina: registrosPorPantalla,
    paginaDesde: 1,
    idContenedor: "clientes",
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

async function validarCampos() {
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
  id.disabled = true;
  nombre.disabled = bandera;
  apellido.disabled = bandera;
  whatsapp.disabled = bandera;
  dni.disabled = bandera;
  email.disabled = bandera;
  domicilio.disabled = bandera;
  cpostal.disabled = bandera;
  pais.disabled = bandera;
  provincia.disabled = bandera;
  localidad.disabled = bandera;
  observaciones.disabled = bandera;
  botonAgregarLocalidad.disabled = bandera;
}

function editar() {
  console.log("EDITANDO");
  tituloModal.innerHTML = "Editando " + nombrePantalla;
  botonGrabarCambios.style.display = "block";
  botonEditar.style.display = "none";
  botonCerrarModal.innerHTML = "Cancelar";
  modoModal = MODO_EDITAR;
  botonAgregarLocalidad.disabled = false;
  manejadorInputs(false);
}

function cerrarModal() {
  botonCerrarModal.style.display = "block";
  botonEditar.style.display = "block";
  botonGrabarCambios.style.display = "none";
  botonCerrarModal.innerHTML = "Cerrar";
  manejadorInputs(true);

  console.log(modoModal);

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

function cerrarModalLocalidad() {
  modalLocalidad.hide();
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
  let url = `${config.URL_API}/clientes/${codigo}`;
  let paquete = await fetch(url);
  //console.log(paquete);
  let datos = await paquete.json();
  //console.log({ datos });

  //console.log("PAIS ", datos.id_pais);

  // guardo en los inputs el valor que vino del fetch buscando el producto en cuestion
  id.value = datos.id;
  nombre.value = datos.nombre;
  apellido.value = datos.apellido;
  whatsapp.value = datos.whatsapp;
  dni.value = datos.dni;
  email.value = datos.email;
  domicilio.value = datos.domicilio;
  cpostal.value = datos.cpostal;
  // datos de pais provincia y localidad
  // traigo los id de cada uno
  pais.value = datos.id_pais;
  provincia.value = datos.id_provincia;
  localidad.value = datos.id_localidad;
  //
  observaciones.value = datos.observaciones;

  //console.log("Pais ", datos.id_pais);
  //console.log("Provincia ", datos.id_provincia);
  //console.log("Localidad ", datos.id_localidad);

  await cargarSelectPais(datos.id_pais);
  await cargarSelectProvincias(datos.id_pais, datos.id_provincia);
  await cargarSelectLocalidades(datos.id_provincia, datos.id_localidad);

  botonAgregarLocalidad.disabled = true;

  modal.show();
}

// dado un json de datos armo una tabla y muestro los datos
async function actualizarDash() {
  campoBusqueda.value = "";
  //datosJson = await dameRegistros();
  datosJson = await dameClientes();

  //console.log(campos);

  dibujarTabla({
    datos: datosJson,
    columnas: columnas,
    campos,
    tiposCampos,
    titulo: "Registros de Clientes",
    cantidadRegistrosPorPagina: registrosPorPantalla,
    paginaDesde: 1,
    idContenedor: "clientes",
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

async function dameRegistros() {
  let url = `${config.URL_API}/clientes/todos`;
  let datos = "";
  try {
    let paquete = await fetch(url);
    datos = await paquete.json();
    cantProductos = datos.length;
  } catch {}
  return datos;
}

async function eliminar(id) {
  // estoy en nuevo vos con post
  let url = `${config.URL_API}/clientes/${id}`;

  paquete = await fetch(url, {
    method: "DELETE",
  });

  //let datos = await paquete.json()
  return { mensaje: "Eliminado" };
}

async function modificarCampo(id, campo, valor) {
  let url = `${config.URL_API}/clientes/campo/${id}`;
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
    apellido: apellido.value,
    whatsapp: whatsapp.value,
    dni: dni.value,
    email: email.value,
    domicilio: domicilio.value,
    cpostal: cpostal.value,
    localidad: localidad.value,
    observaciones: observaciones.value,
  };

  console.log("Datos envio ", datosEnvio);

  try {
    if (modoModal === MODO_EDITAR) {
      const valorCodigo = id.value;
      // estoy en editar voy con put
      url = `${config.URL_API}/clientes/${valorCodigo}`;
      paquete = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(datosEnvio),
        headers: { "Content-Type": "application/json" },
      });
    }

    if (modoModal === MODO_NUEVO) {
      //const valorCodigo = codigo.value;
      // estoy en nuevo voy con post
      console.log("BACK NUEVO CLIENTE");
      url = `${config.URL_API}/clientes`;
      paquete = await fetch(url, {
        method: "POST",
        body: JSON.stringify(datosEnvio),
        headers: { "Content-Type": "application/json" },
      });
    }

    let datos = paquete.json();

    //console.log(datos);

    await Swal.fire({
      text: "Se grabo correctamente el cliente",
      icon: "success",
    });
    modoModal = MODO_VER;
    await cerrarModal();
    actualizarDash();
  } catch {
    await Swal.fire({ text: "Hubo un error", icon: "error" });
  }
}

actualizarDash();
