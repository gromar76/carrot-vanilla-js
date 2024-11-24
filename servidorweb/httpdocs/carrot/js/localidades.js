// donde yo tenga que poner los datos
let registrosPorPantalla = 13;
let comenzarDesdePagina = 1;
// aca le estoy enviando el campo id pero en columna como null para que no lo muestre...
let columnas = [null, "Nombre", "Provincia"];
let campos = ["id", "nombre", "provincia"];
let tiposCampos = [null, "text", "select"]; //Si es select, busco el id en la columna que se llame id_categoria (o el nombre que sea)
let funcionesDetalle = [null, detalleLocalidad, detalleProvincia];
let funcionesSelect = [null, null, cargarSelectProvinciasEdicion];
const nombrePantalla = "Localidad";
//

// traigo variables de configuracion como la url
const config = dameConfig();

//modos en los cuales voy estando
const MODO_VER = 1;
const MODO_EDITAR = 2;
const MODO_NUEVO = 3;

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

//a partir de esta linea puedo manejar el modal
const modal = new bootstrap.Modal(document.getElementById("modal-localidad"), {
  backdrop: false,
});

let datosJson = [];

// tomo control de los controles del formulario
const codigo = document.getElementById("codigoloc");
const nombre = document.getElementById("nombreloc");
const provincia = document.getElementById("provincia");

//tomo control del botonEjecutar y de los inputFecha
let campoBusqueda = document.getElementById("campoBusqueda");
// tomo control de los botones del modal
let botonNuevo = document.getElementById("boton-agregar");
let botonGrabarCambios = document.getElementById("grabar-cambios");
let botonEditar = document.getElementById("editar");
let botonCerrarModal = document.getElementById("cerrar-modal");

const tituloModal = document.getElementById("titulo-modal");
const contenedorCodigo = document.getElementById("contenedor-codigo");

botonGrabarCambios.style.display = "none";
botonNuevo.style.display = "block";

let cantRegistros = 0;

//escucho el boton Ejecutar
campoBusqueda.addEventListener("input", buscar);
botonNuevo.addEventListener("click", nuevoRegistro);

// botones del modal
botonEditar.addEventListener("click", editar);
botonCerrarModal.addEventListener("click", cerrarModal);
botonGrabarCambios.addEventListener("click", validarCampos);

////////////////////////////////////////////////////////////////////////////////////////////

/*function clickBotonCancelarNombre(valor, td) {
  deshabilitarBotonesAcciones(false);
  td.innerHTML = valor;
  editandoCampo = false;
}*/

async function clickBotonGuardarProvincia(td) {
  let id = td.getAttribute("data-id");

  const select = document.getElementById("editor-td");
  const dato2 = "id_provincia";

  let valor = select.value;
  console.log("en el id ", id);
  console.log("modifica provincia a id ", valor);

  Swal.fire({
    text: "Guardando",
    showConfirmButton: false,
    willOpen: async () => {
      Swal.showLoading();
      await modificarCampo(id, dato2, valor);
      deshabilitarBotonesAcciones(false);

      // en valor guardo el text que es la palabra no el id de la categoria
      const indiceSelect = select.selectedIndex;
      td.innerHTML = select.options[indiceSelect].text;
      td.setAttribute("data-select-provincia", valor);

      editandoCampo = false;
      Swal.close();
      Swal.fire({
        text: "Guardado correctamente",
        icon: "success",
      });
    },
  });
}

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

async function cargarSelectProvinciasEdicion(idSeleccionado, idSelect) {
  let url = `${config.URL_API}/provincias`;
  let paquete = await fetch(url);
  //console.log(paquete);
  let datos = await paquete.json();
  //console.log(datos);

  modoModal = 2;
  console.log("Modo Modal ", modoModal);
  console.log("Id Seleccionado ", idSeleccionado);
  console.log("Id Select ", idSelect);

  let html = `<select class="form-select" id="${idSelect}">`;
  //html += `<option value="-1">Seleccione una categoria</option>`;
  console.log("Estoy en modo ", modoModal);
  for (i = 0; i < datos.length; i++) {
    if (datos[i].id === idSeleccionado && modoModal != 3) {
      html += `<option value="${datos[i].id}" selected>${datos[i].nombre}</option>`;
    } else {
      html += `<option value="${datos[i].id}">${datos[i].nombre}</option>`;
    }
  }
  html += `</select>`;
  html += `<button id="btn-guardar-td" data-id="${idSeleccionado}">Guardar</button>  
          <button id="btn-cancelar-td" data-id="${idSeleccionado}">Cancelar</button>`;

  //categoria.innerHTML = html;
  return html;
}

function detalleLocalidad(event) {
  console.log("EJECUTANDO EN LOCALIDADES");

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

async function detalleProvincia(event) {
  if (!editandoCampo) {
    editandoCampo = true;

    deshabilitarBotonesAcciones(true);

    let id = parseInt(event.target.getAttribute("data-id"));
    let id2 = parseInt(event.target.getAttribute("data-select-provincia"));
    console.log("ID 1 " + id);
    console.log("ID 2 " + id2);

    let nombre = event.target.innerHTML;
    const tdClickeado = event.target;

    /* event.target.innerHTML = `<input data-id="${id}" id="editor-td" type="text" value="${nombre}"/>
                              <button id="btn-guardar-td" data-id="${id}">Guardar</button>  
                              <button id="btn-cancelar-td" data-id="${id}">Cancelar</button>`;*/

    let htmlSelect = await cargarSelectProvinciasEdicion(id2, "editor-td");

    //console.log(htmlSelect);
    event.target.innerHTML = htmlSelect;

    const botonCancelar = document.getElementById("btn-cancelar-td");
    const botonGuardar = document.getElementById("btn-guardar-td");
    const editorTd = document.getElementById("editor-td");

    botonCancelar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonCancelarNombre(nombre, tdClickeado);
    });

    botonGuardar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonGuardarProvincia(tdClickeado);
    });

    editorTd.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        clickBotonGuardarProvincia(tdClickeado);
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

function nuevoRegistro() {
  modoModal = MODO_NUEVO;
  tituloModal.innerHTML = "Nuevo";
  modal.show();
  habilitarEdicion();
  botonEditar.style.display = "none";
  botonCerrarModal.innerHTML = "Cerrar";
  botonGrabarCambios.style.display = "block";
}

function habilitarEdicion() {
  nombreloc.disabled = false;
  provincia.disabled = false;

  // vengo por nuevo producto
  contenedorCodigo.style.display = "none";
  nombreloc.value = "";
  provincia.value = "";

  cargarSelect(1);
}

function buscar(event) {
  const textoabuscar = event.target.value.toUpperCase();
  //console.log("datosJson", datosJson);
  let Json2 = [];

  if (textoabuscar.length >= 1) {
    Json2 = datosJson.filter((elemento) => {
      return (
        elemento.nombre.toUpperCase().indexOf(textoabuscar) >= 0 ||
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
    titulo: "Registros de Localidades",
    cantidadRegistrosPorPagina: registrosPorPantalla,
    paginaDesde: 1,
    idContenedor: "localidad",
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

  if (parseInt(provincia.value) === -1) {
    continuar = false;
  }
  if (nombre.value === "") {
    continuar = false;
  }

  // pueden ser cero

  // fin validaciones

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
  codigoloc.disabled = true;
  nombreloc.disabled = bandera;
  provincia.disabled = bandera;
}

function editar() {
  console.log("EDITANDO");
  tituloModal.innerHTML = "Editando " + nombrePantalla;
  botonGrabarCambios.style.display = "block";
  botonEditar.style.display = "none";
  botonCerrarModal.innerHTML = "Cancelar";
  modoModal = MODO_EDITAR;
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
      Swal.fire(nombrePantalla + " Eliminada", "Puede continuar");
      //una vez eliminado el articulo refrescar
      actualizarDash();
    }
  });
  // una vez eliminado refrescar con actualizarDASH()
}

// carga el select en este caso de provincias
async function cargarSelect(idSeleccionado) {
  let url = `${config.URL_API}/provincias/`;
  let paquete = await fetch(url);
  //console.log(paquete);
  let datos = await paquete.json();
  //console.log(datos);
  let html = "";
  html += `<option value="-1">Seleccione una provincia</option>`;
  console.log("Estoy en modo ", modoModal);
  for (i = 0; i < datos.length; i++) {
    if (datos[i].id === idSeleccionado && modoModal != 3) {
      html += `<option value="${datos[i].id}" selected>${datos[i].nombre}</option>`;
    } else {
      html += `<option value="${datos[i].id}">${datos[i].nombre}</option>`;
    }
  }
  provincia.innerHTML = html;
}

async function verDetalle(event) {
  contenedorCodigo.style.display = "block";
  modoModal = MODO_VER;
  tituloModal.innerHTML = "Visualizando " + nombrePantalla;
  let codigoProducto = event.target.getAttribute("data-id");
  let url = `${config.URL_API}/localidades/${codigoProducto}`;
  let paquete = await fetch(url);
  //console.log(paquete);
  let datos = await paquete.json();
  //console.log({ datos });

  // guardo en los inputs el valor que vino del fetch buscando el producto en cuestion
  codigoloc.value = datos.id;
  nombreloc.value = datos.nombre;
  provincia.value = datos.id_provincia;

  await cargarSelect(datos.id_provincia);
  modal.show();
}

// dado un json de datos armo una tabla y muestro los datos
async function actualizarDash() {
  campoBusqueda.value = "";
  datosJson = await dameRegistros();

  //console.log(campos);

  dibujarTabla({
    datos: datosJson,
    columnas: columnas,
    campos,
    tiposCampos,
    titulo: "Registros de Localidades",
    cantidadRegistrosPorPagina: registrosPorPantalla,
    paginaDesde: 1,
    idContenedor: "localidad",
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
  let url = `${config.URL_API}/localidades/todos`;
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
  let url = `${config.URL_API}/localidades/${id}`;

  paquete = await fetch(url, {
    method: "DELETE",
  });

  //let datos = await paquete.json()
  return { mensaje: "Eliminado" };
}

async function modificarCampo(id, campo, valor) {
  let url = `${config.URL_API}/localidades/campo/${id}`;
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
    provincia: provincia.value,
  };

  try {
    if (modoModal === MODO_EDITAR) {
      const valorCodigo = codigo.value;
      // estoy en editar voy con put
      url = `${config.URL_API}/localidades/${valorCodigo}`;

      paquete = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(datosEnvio),
        headers: { "Content-Type": "application/json" },
      });
    }

    if (modoModal === MODO_NUEVO) {
      // const valorCodigo = codigo.value;
      // estoy en nuevo voy con post
      url = `${config.URL_API}/localidades`;
      paquete = await fetch(url, {
        method: "POST",
        body: JSON.stringify(datosEnvio),
        headers: { "Content-Type": "application/json" },
      });
    }

    let datos = paquete.json();

    //console.log(datos);

    await Swal.fire({ text: "Se grabo correctamente", icon: "success" });
    modoModal = MODO_VER;
    await cerrarModal();
    actualizarDash();
  } catch {
    await Swal.fire({ text: "Hubo un error", icon: "error" });
  }
}

actualizarDash();
