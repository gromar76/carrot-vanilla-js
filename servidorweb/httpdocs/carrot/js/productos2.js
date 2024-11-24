// FRONTEND

// traigo variables de configuracion como la url
const config = dameConfig();

//modos en los cuales voy estando
const MODO_VER = 1;
const MODO_EDITAR = 2;
const MODO_NUEVO = 3;

const mostrarBotones = true;
// comienzo en modo ver
let modoModal = MODO_VER;

// tomo control de los botones del html
const codigo = document.getElementById("id");
const nombre = document.getElementById("nombre");
const costo = document.getElementById("costo");
const precio = document.getElementById("precio");
const categoria = document.getElementById("categoria");
const tituloModal = document.getElementById("titulo-modal");
const contenedorCodigo = document.getElementById("contenedor-codigo");

//a partir de esta linea puedo manejar el modal
const modalProducto = new bootstrap.Modal(
  document.getElementById("modal-producto"),
  { backdrop: false }
);

let productosPorPantalla = 13;
let comenzarDesdePagina = 1;
// aca le estoy enviando el campo id pero en columna como null para que no lo muestre...
let columnas = [null, "Nombre", "Costo", "Precio", "Categoria"];
let campos = ["id", "nombre", "costo", "precio", "categoria"];
let tiposCampos = [null, "texto", "moneda", "moneda", "select"]; //Si es select, busco el id en la columna que se llame id_categoria (o el nombre que sea)

let datosJson = [];

//console.log("MOSTRAR ES: ", mostrar);

//tomo control del botonEjecutar y de los inputFecha
let campoBusqueda = document.getElementById("campoBusqueda");
// tomo control de los botones del modal
let botonNuevoProducto = document.getElementById("boton-agregar-producto");
let botonGrabarCambios = document.getElementById("grabar-cambios");
let botonEditarProducto = document.getElementById("editar-producto");
let botonCerrarModalProducto = document.getElementById("cerrar-modal-producto");

botonGrabarCambios.style.display = "none";
botonNuevoProducto.style.display = "block";

let cantProductos = 0;

//escucho el boton Ejecutar
campoBusqueda.addEventListener("input", buscar);
botonNuevoProducto.addEventListener("click", nuevoProducto);

// botones del modal
botonEditarProducto.addEventListener("click", editarProducto);
botonCerrarModalProducto.addEventListener("click", cerrarModalProducto);
botonGrabarCambios.addEventListener("click", validarCampos);

actualizarDash();

// paso true y habilito los inputs o false y deshabilito
function manejadorInputsProductos(bandera) {
  nombre.disabled = bandera;
  costo.disabled = bandera;
  precio.disabled = bandera;
  categoria.disabled = bandera;
}

async function validarCampos() {
  let continuar = true;

  // nombre debe existir - precio debe ser numerico pero puede ser 0 - categoria debe ser alguna.. no -1
  console.log("Nombre ", nombre.value);
  console.log("Costo ", costo.value);
  console.log("Precio ", precio.value);
  console.log("Categoria ", categoria.value);

  if (parseInt(categoria.value) === -1) {
    continuar = false;
  }
  if (nombre.value === "") {
    continuar = false;
  }
  // costo y precio deben ser numericos
  // pueden ser cero

  // fin validaciones

  if (continuar) {
    grabarCambios();
  } else {
    await Swal.fire({
      text: "Completar los campos del Formulario",
      icon: "error",
    });
  }
}

async function grabarCambios() {
  let paquete = "";

  const datosEnvio = {
    nombre: nombre.value,
    costo: costo.value ? costo.value : 0,
    precio: precio.value ? precio.value : 0,
    categoria: categoria.value,
  };

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
      const valorCodigo = codigo.value;
      // estoy en nuevo vos con post
      url = `${config.URL_API}/productos`;
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
    await cerrarModalProducto();
    actualizarDash();
  } catch {
    await Swal.fire({ text: "Hubo un error", icon: "error" });
  }
}

function editarProducto() {
  tituloModal.innerHTML = "Editando Producto";
  botonGrabarCambios.style.display = "block";
  botonEditarProducto.style.display = "none";
  manejadorInputsProductos(false);
  botonCerrarModalProducto.innerHTML = "Cancelar";
  modoModal = MODO_EDITAR;
}

function cerrarModalProducto() {
  botonCerrarModalProducto.style.display = "block";
  botonEditarProducto.style.display = "block";
  botonGrabarCambios.style.display = "none";
  botonCerrarModalProducto.innerHTML = "Cerrar";
  manejadorInputsProductos(true);

  console.log(modoModal);

  switch (modoModal) {
    case MODO_VER:
      // cerrar el modal
      modalProducto.hide();
      break;

    case MODO_EDITAR:
      tituloModal.innerHTML = "Visualizando Producto";
      modoModal = MODO_VER;
      break;

    case MODO_NUEVO:
      // cerrar el modal
      modalProducto.hide();
      break;
  }
}

function nuevoProducto() {
  modoModal = MODO_NUEVO;
  tituloModal.innerHTML = "Producto Nuevo";
  modalProducto.show();
  habilitarEdicion();
  botonEditarProducto.style.display = "none";
  botonCerrarModalProducto.innerHTML = "Cerrar";
  botonGrabarCambios.style.display = "block";
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
    cantidadRegistrosPorPagina: productosPorPantalla,
    paginaDesde: 1,
    idContenedor: "productos",
    mostrarPaginador: true,
    mostrarBotones: mostrarBotones,
  });
}

// dado un json de datos armo una tabla y muestro los datos
async function actualizarDash() {
  campoBusqueda.value = "";
  datosJson = await dameProductos();

  dibujarTabla({
    datos: datosJson,
    columnas: columnas,
    campos,
    tiposCampos,
    titulo: "Registros de Productos",
    cantidadRegistrosPorPagina: productosPorPantalla,
    paginaDesde: 1,
    idContenedor: "productos",
    mostrarPaginador: true,
    mostrarBotones: mostrarBotones,
  });
}

async function dameProductos() {
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

async function verDetalle(event) {
  contenedorCodigo.style.display = "block";
  modoModal = MODO_VER;
  tituloModal.innerHTML = "Visualizando Producto";
  let codigoProducto = event.target.getAttribute("data-id");
  let url = `${config.URL_API}/productos/${codigoProducto}`;
  let paquete = await fetch(url);
  console.log(paquete);
  let datos = await paquete.json();
  console.log({ datos });

  // guardo en los inputs el valor que vino del fetch buscando el producto en cuestion
  codigo.value = datos.id;
  nombre.value = datos.nombre;
  costo.value = datos.costo;
  precio.value = datos.precio;

  await cargarSelectCategorias(datos.id_categoria);
  modalProducto.show();
}

function habilitarEdicion() {
  nombre.disabled = false;
  costo.disabled = false;
  precio.disabled = false;
  categoria.disabled = false;

  // vengo por nuevo producto
  contenedorCodigo.style.display = "none";
  nombre.value = "";
  costo.value = "";
  precio.value = "";
  categoria.value = 1;
  cargarSelectCategorias(1);
}

async function cargarSelectCategorias(idSeleccionado) {
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

async function accionEliminar(event) {
  let idProducto = event.target.getAttribute("data-id");

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
      await eliminarProducto(idProducto);
      Swal.fire("Producto Eliminado", "Puede continuar");
      //una vez eliminado el articulo refrescar
      actualizarDash();
    }
  });
  // una vez eliminado refrescar con actualizarDASH()
}

async function eliminarProducto(idProducto) {
  // estoy en nuevo vos con post
  let url = `${config.URL_API}/productos/${idProducto}`;

  paquete = await fetch(url, {
    method: "DELETE",
  });

  //let datos = await paquete.json()
  return { mensaje: "Eliminado" };
}

async function modificarCampo(idProducto, campo, valor) {
  let url = `${config.URL_API}/productos/campo/${idProducto}`;
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
