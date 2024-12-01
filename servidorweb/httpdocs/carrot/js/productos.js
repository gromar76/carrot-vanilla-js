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
const nombrePantalla = "Productos";

// columnas son las columnas a mostrar en la tabla por pantalla
let columnas = ["ID", "Nombre", "Costo", "Precio", "Categoria"];

// campos en el formulario del modal
let campos = ["id", "nombre", "costo", "precio", "categoria"];

// aca le estoy enviando el campo id pero en columna como null para que no lo muestre...
// tipoCampos le digo de que tipo es para luego saber como tratarlos
let tiposCampos = ["number", "text", "number", "number", "select"]; //Si es select, busco el id en la columna que se llame id_categoria (o el nombre que sea)

// las funciones que debe utilizar cuando hago click en esa celda
let funcionesDetalle = [
  null,
  detalleNombre,
  detalleCosto,
  detallePrecio,
  detalleCategoria,
];

// estas son las funciones que van asociados a los selects
let funcionesSelect = [null, null, null, null, cargarSelectCategoriasEdicion];

//a partir de esta linea puedo manejar el modal
const modal = new bootstrap.Modal(document.getElementById("modal-producto"), {
  backdrop: false,
});

// tomo control de los controles del formulario
const codigo = document.getElementById("id");
const nombre = document.getElementById("nombre");
const costo = document.getElementById("costo");
const precio = document.getElementById("precio");
const categoria = document.getElementById("categoria");

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

campoBusqueda.addEventListener("input", buscar);
botonNuevo.addEventListener("click", nuevoRegistro);

// botones del modal
botonEditar.addEventListener("click", editar);
botonCerrarModal.addEventListener("click", cerrarModal);
botonGrabarCambios.addEventListener("click", validarCampos);

//////////////////////////////      F U N C I O N E S       //////////////////////////////

async function clickBotonGuardarCategoria(td) {
  let id = td.getAttribute("data-id");

  const select = document.getElementById("editor-td");
  const dato2 = "id_categoria";

  let valor = select.value;

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
      td.setAttribute("data-select-categoria", valor);

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

async function clickBotonGuardarPrecio(td) {
  let id = td.getAttribute("data-id");
  let valor = document.getElementById("editor-td").value;

  Swal.fire({
    text: "Guardando",
    showConfirmButton: false,
    willOpen: async () => {
      Swal.showLoading();
      await modificarCampo(id, "precio", valor);
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

async function clickBotonGuardarCosto(td) {
  let id = td.getAttribute("data-id");
  let valor = document.getElementById("editor-td").value;

  Swal.fire({
    text: "Guardando",
    showConfirmButton: false,
    willOpen: async () => {
      Swal.showLoading();
      await modificarCampo(id, "costo", valor);
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

async function cargarSelectCategoriasEdicion(idSeleccionado, idSelect) {
  let url = `${config.URL_API}/categorias/productos`;
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

function detalleCosto(event) {
  if (!editandoCampo) {
    editandoCampo = true;

    deshabilitarBotonesAcciones(true);

    let id = parseInt(event.target.getAttribute("data-id"));
    //alert("ID del Producto " + idProducto);

    let costo = event.target.innerHTML;
    const tdClickeado = event.target;

    event.target.innerHTML = `<input data-id="${id}" id="editor-td" type="text" value="${costo}"/>
                              <button id="btn-guardar-td" data-id="${id}">Guardar</button>  
                              <button id="btn-cancelar-td" data-id="${id}">Cancelar</button>`;

    const botonCancelar = document.getElementById("btn-cancelar-td");
    const botonGuardar = document.getElementById("btn-guardar-td");
    const editorTd = document.getElementById("editor-td");

    botonCancelar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonCancelarCosto(costo, tdClickeado);
    });

    botonGuardar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonGuardarCosto(tdClickeado);
    });

    editorTd.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        clickBotonGuardarCosto(tdClickeado);
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

function detallePrecio(event) {
  if (!editandoCampo) {
    editandoCampo = true;

    deshabilitarBotonesAcciones(true);

    let id = parseInt(event.target.getAttribute("data-id"));
    //alert("ID del Producto " + idProducto);

    let precio = event.target.innerHTML;
    const tdClickeado = event.target;

    event.target.innerHTML = `<input data-id="${id}" id="editor-td" type="text" value="${precio}"/>
                              <button id="btn-guardar-td" data-id="${id}">Guardar</button>  
                              <button id="btn-cancelar-td" data-id="${id}">Cancelar</button>`;

    const botonCancelar = document.getElementById("btn-cancelar-td");
    const botonGuardar = document.getElementById("btn-guardar-td");
    const editorTd = document.getElementById("editor-td");

    botonCancelar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonCancelarPrecio(precio, tdClickeado);
    });

    botonGuardar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonGuardarPrecio(tdClickeado);
    });

    editorTd.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        clickBotonGuardarPrecio(tdClickeado);
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

async function detalleCategoria(event) {
  if (!editandoCampo) {
    editandoCampo = true;

    deshabilitarBotonesAcciones(true);

    let id = parseInt(event.target.getAttribute("data-id"));
    let id2 = parseInt(event.target.getAttribute("data-select-categoria"));
    console.log("ID 1 " + id);
    console.log("ID 2 " + id2);

    let nombre = event.target.innerHTML;
    const tdClickeado = event.target;

    let htmlSelect = await cargarSelectCategoriasEdicion(id2, "editor-td");

    event.target.innerHTML = htmlSelect;

    //aca va los botones Guardar y Cancelar....

    const botonCancelar = document.getElementById("btn-cancelar-td");
    const botonGuardar = document.getElementById("btn-guardar-td");
    const editorTd = document.getElementById("editor-td");

    botonCancelar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonCancelarCategoria(nombre, tdClickeado);
    });

    botonGuardar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonGuardarCategoria(tdClickeado);
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

function clickBotonCancelarCosto(valorNombreOriginal, td) {
  deshabilitarBotonesAcciones(false);
  //alert("CANCELAR " + valorCostoOriginal + td);
  //console.log(td);
  td.innerHTML = valorNombreOriginal;

  editandoCampo = false;
}

function clickBotonCancelarPrecio(valorNombreOriginal, td) {
  deshabilitarBotonesAcciones(false);
  //alert("CANCELAR " + valorCostoOriginal + td);
  //console.log(td);
  td.innerHTML = valorNombreOriginal;

  editandoCampo = false;
}

function clickBotonCancelarCategoria(valorNombreOriginal, td) {
  deshabilitarBotonesAcciones(false);
  //alert("CANCELAR " + valorCostoOriginal + td);
  //console.log(td);
  td.innerHTML = valorNombreOriginal;

  editandoCampo = false;
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
  id.disabled = false;
  nombre.disabled = false;
  costo.disabled = false;
  precio.disabled = false;
  categoria.disabled = false;

  // vengo por nuevo producto
  contenedorCodigo.style.display = "none";
  nombre.value = "";
  costo.value = 0;
  precio.value = 0;
  categoria.value = "1";

  cargarSelect(categoria.value);
}

function buscar(event) {
  const textoabuscar = event.target.value.toUpperCase();
  //console.log("datosJson", datosJson);
  let Json2 = [];

  if (textoabuscar.length >= 1) {
    Json2 = datosJson.filter((elemento) => {
      return (
        elemento.nombre.toUpperCase().indexOf(textoabuscar) >= 0 ||
        elemento.categoria.toUpperCase().indexOf(textoabuscar) >= 0
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
    titulo: "Registros de Productos",
    cantidadRegistrosPorPagina: registrosPorPantalla,
    paginaDesde: 1,
    idContenedor: "productos",
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

  if (parseInt(categoria.value) === -1) {
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
  id.disabled = true;
  nombre.disabled = bandera;
  precio.disabled = bandera;
  costo.disabled = bandera;
  categoria.disabled = bandera;
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
      Swal.fire(nombrePantalla + " Eliminado", "Puede continuar");
      //una vez eliminado el articulo refrescar
      actualizarDash();
    }
  });
  // una vez eliminado refrescar con actualizarDASH()
}

// carga el select en este caso de categorias
async function cargarSelect(idSeleccionado) {
  let url = `${config.URL_API}/categorias/productos`;
  let paquete = await fetch(url);
  //console.log(paquete);
  let datos = await paquete.json();
  //console.log(datos);
  let html = "";
  html += `<option value="-1">Seleccione una categoria</option>`;
  console.log("Estoy en modo ", modoModal);
  for (i = 0; i < datos.length; i++) {
    if (datos[i].id === idSeleccionado && modoModal != 3) {
      html += `<option value="${datos[i].id}" selected>${datos[i].nombre}</option>`;
    } else {
      html += `<option value="${datos[i].id}">${datos[i].nombre}</option>`;
    }
  }
  categoria.innerHTML = html;
}

async function verDetalle(event) {
  contenedorCodigo.style.display = "block";
  modoModal = MODO_VER;
  tituloModal.innerHTML = "Visualizando " + nombrePantalla;
  let codigo = event.target.getAttribute("data-id");
  let url = `${config.URL_API}/productos/${codigo}`;
  let paquete = await fetch(url);
  //console.log(paquete);
  let datos = await paquete.json();
  //console.log({ datos });

  // guardo en los inputs el valor que vino del fetch buscando el producto en cuestion
  id.value = datos.id;
  nombre.value = datos.nombre;
  precio.value = datos.precio;
  costo.value = datos.costo;
  categoria.value = datos.id_categoria;

  await cargarSelect(datos.id_categoria);
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
    titulo: "Registros de Productos",
    cantidadRegistrosPorPagina: registrosPorPantalla,
    paginaDesde: 1,
    idContenedor: "productos",
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
  let url = `${config.URL_API}/productos/todos`;
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
  let url = `${config.URL_API}/productos/${id}`;

  paquete = await fetch(url, {
    method: "DELETE",
  });

  //let datos = await paquete.json()
  return { mensaje: "Eliminado" };
}

async function modificarCampo(id, campo, valor) {
  let url = `${config.URL_API}/productos/campo/${id}`;
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
      url = `${config.URL_API}/productos/${valorCodigo}`;
      paquete = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(datosEnvio),
        headers: { "Content-Type": "application/json" },
      });
    }

    if (modoModal === MODO_NUEVO) {
      //const valorCodigo = codigo.value;
      // estoy en nuevo voy con post
      url = `${config.URL_API}/productos`;
      paquete = await fetch(url, {
        method: "POST",
        body: JSON.stringify(datosEnvio),
        headers: { "Content-Type": "application/json" },
      });
    }

    let datos = paquete.json();

    //console.log(datos);

    await Swal.fire({
      text: "Se grabo correctamente el producto",
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
