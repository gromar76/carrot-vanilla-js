// esta es la tabla de productos COMPLETA

let editandoCampo = false;

function dibujarTabla({
  datos,
  columnas,
  campos,
  tiposCampos,
  titulo,
  mostrarPaginador = true,
  cantidadRegistrosPorPagina,
  paginaDesde,
  idContenedor,
  mostrarBotones,
}) {
  console.log({ tiposCampos });

  let columnasTabla = `<thead> <h3>${titulo ? titulo : "Registros"}</h3>
                               <tr class="table-success">`;
  let registros = "";
  for (let i = 0; i < columnas.length; i++) {
    // si en columnas[i] hay algo... ( no es null )
    if (columnas[i]) {
      registros += `<th scope="col">${columnas[i]}</th>`;
    }
  }

  if (mostrarBotones) {
    registros += `<th scope="col">Acciones</th>`;
  }

  columnasTabla += registros += `</tr>
                          </thead>`;

  let comienzoBody = `<tbody>`;
  let finBody = `</tbody>`;
  let dat = "";

  const registroDesde = (paginaDesde - 1) * cantidadRegistrosPorPagina;
  let registroHasta = registroDesde + cantidadRegistrosPorPagina;

  if (registroHasta > datos.length) {
    registroHasta = datos.length;
  }

  //console.log("Campos ", campos);

  for (let i = registroDesde; i < registroHasta; i++) {
    dat += `<tr class="table-secondary">`;
    // aca con el forEach campos recibe el objeto campo con todos los datos de ese objeto
    // y la j seria el indice
    campos.forEach((campo, j, array) => {
      if (columnas[j]) {
        //console.log("Tipo campo:", campo, tiposCampos[j]);
        if (tiposCampos[j] === "select") {
          const nombreIdSelectCampo = "id_" + campo;
          const idSelectCampo = datos[i][nombreIdSelectCampo];
          //console.log("Tipo campo", idSelectCampo);

          dat += `<td class="col-${campo}" data-id="${datos[i].id}" data-select-${campo}="${idSelectCampo}">${datos[i][campo]}</td>`;
        } else {
          dat += `<td class="col-${campo}" data-id="${datos[i].id}">${datos[i][campo]}</td>`;
        }
      }
    });

    if (mostrarBotones) {
      dat += `<td><button class="btnDetalle" data-id="${datos[i].id}">Detalle</button>    <button class="btnEliminar" data-id="${datos[i].id}">Eliminar</button></td>`;
    }

    dat += `</tr>`;
  }

  let comienzoTabla = `<table class="table">`;
  let finalTabla = `</table>`;
  let datosColumnas = dat;

  let tablaHtml =
    comienzoTabla +
    columnasTabla +
    comienzoBody +
    datosColumnas +
    finBody +
    finalTabla;

  let cantidadDePaginasTotales = dameCantidadDePaginasDePaginador(
    datos.length,
    cantidadRegistrosPorPagina
  );

  let links = "";

  if (mostrarPaginador) {
    for (let i = 1; i <= cantidadDePaginasTotales; i++) {
      const color = paginaDesde === i ? `red` : `blue`;
      links += `<a href="#" data-pagina-id=" ${i}" class="link-paginador" style="color: ${color}" > ${i} </a>`;
    }
  }

  // nuevo codigo paginador

  //console.log("Paginas Totales ", cantidadDePaginasTotales);
  //console.log("Estoy en la pagina ", paginaDesde);

  // fin codigo link nuevo

  const destino = document.getElementById(idContenedor);
  destino.innerHTML = tablaHtml + links;

  const linksPaginador = document.getElementsByClassName("link-paginador");

  // edicion de columnas con un click
  const colCosto = document.getElementsByClassName("col-costo");
  const colPrecio = document.getElementsByClassName("col-precio");
  const colNombre = document.getElementsByClassName("col-nombre");
  const colCategoria = document.getElementsByClassName("col-categoria");

  for (i = 0; i < colCosto.length; i++) {
    colCosto[i].addEventListener("click", detalleCosto);
    colPrecio[i].addEventListener("click", detallePrecio);
    colNombre[i].addEventListener("click", detalleNombre);
    colCategoria[i].addEventListener("click", detalleCategoria);
  }

  //console.log("COLUMNA Nombre  ", colNombre);

  // fin edicion columnas con un click

  if (mostrarBotones) {
    const botonDetalle = document.getElementsByClassName("btnDetalle");
    const botonEliminar = document.getElementsByClassName("btnEliminar");

    for (i = 0; i < botonDetalle.length; i++) {
      botonDetalle[i].addEventListener("click", verDetalle);
      botonEliminar[i].addEventListener("click", accionEliminar);
    }
  }

  for (i = 0; i < linksPaginador.length; i++) {
    linksPaginador[i].addEventListener("click", (event) => {
      const paginaId = parseInt(event.target.getAttribute("data-pagina-id"));

      event.preventDefault();
      dibujarTabla({
        datos,
        columnas,
        campos,
        tiposCampos,
        titulo,
        mostrarPaginador,
        cantidadRegistrosPorPagina,
        paginaDesde: paginaId,
        idContenedor,
        mostrarBotones,
      });
    });
  }
}

function deshabilitarBotonesAcciones(valor) {
  // 0 es Ocultar y 1 es Ver
  // quiero poner detalle y eliminar en disabled

  console.log("VALOR ", valor);

  const botonDetalle = document.getElementsByClassName("btnDetalle");
  const botonEliminar = document.getElementsByClassName("btnEliminar");

  for (i = 0; i < botonDetalle.length; i++) {
    botonDetalle[i].disabled = valor;
    botonEliminar[i].disabled = valor;
  }
  // fin poner botones en disabled
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

async function detalleCategoria(event) {
  if (!editandoCampo) {
    editandoCampo = true;

    deshabilitarBotonesAcciones(true);

    let idCategoria = parseInt(
      event.target.getAttribute("data-select-categoria")
    );

    //alert("ID del Producto " + idProducto);

    let valorCategoriaOriginal = event.target.innerHTML;
    const tdClickeado = event.target;

    // este campo debe transformarse en un select
    /*event.target.innerHTML = `<input data-id="${idProducto}" id="editor-td" type="select" value="${valorCategoriaOriginal}"/>
                              <button id="btn-guardar-td" data-id="${idProducto}">Guardar</button>  
                              <button id="btn-cancelar-td" data-id="${idProducto}">Cancelar</button>`;*/

    let htmlSelect = await cargarSelectCategoriasEdicion(
      idCategoria,
      "editor-td"
    );
    //console.log(htmlSelect);
    event.target.innerHTML = htmlSelect;

    const botonCancelar = document.getElementById("btn-cancelar-td");
    const botonGuardar = document.getElementById("btn-guardar-td");
    const editorTd = document.getElementById("editor-td");

    botonCancelar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonCancelarCategoria(valorCategoriaOriginal, tdClickeado);
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

function detalleCosto(event) {
  if (!editandoCampo) {
    editandoCampo = true;

    deshabilitarBotonesAcciones(true);

    let idProducto = parseInt(event.target.getAttribute("data-id"));
    //alert("ID del Producto " + idProducto);

    let valorCostoOriginal = event.target.innerHTML;
    const tdClickeado = event.target;

    event.target.innerHTML = `<input data-id="${idProducto}" id="editor-td" type="number" value="${valorCostoOriginal}"/>
                              <button id="btn-guardar-td" data-id="${idProducto}">Guardar</button>  
                              <button id="btn-cancelar-td" data-id="${idProducto}">Cancelar</button>`;

    const botonCancelar = document.getElementById("btn-cancelar-td");
    const botonGuardar = document.getElementById("btn-guardar-td");
    const editorTd = document.getElementById("editor-td");

    botonCancelar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonCancelarCosto(valorCostoOriginal, tdClickeado);
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
    let idProducto = parseInt(event.target.getAttribute("data-id"));
    //alert("ID del Producto " + idProducto);

    let valorPrecioOriginal = event.target.innerHTML;
    const tdClickeado = event.target;

    event.target.innerHTML = `<input data-id="${idProducto}" id="editor-td" type="number" value="${valorPrecioOriginal}"/>
                              <button id="btn-guardar-td" data-id="${idProducto}">Guardar</button>  
                              <button id="btn-cancelar-td" data-id="${idProducto}">Cancelar</button>`;

    const botonCancelar = document.getElementById("btn-cancelar-td");
    const botonGuardar = document.getElementById("btn-guardar-td");
    const editorTd = document.getElementById("editor-td");

    botonCancelar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonCancelarPrecio(valorPrecioOriginal, tdClickeado);
    });

    botonGuardar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonGuardarPrecio(tdClickeado);
    });

    editorTd.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    editorTd.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        clickBotonGuardarPrecio(tdClickeado);
      }
    });
  } else {
    Swal.fire({
      text: "Debe guardar o cancelar para editar otro valor",
      icon: "info",
    });
  }
}

function detalleNombre(event) {
  if (!editandoCampo) {
    editandoCampo = true;
    deshabilitarBotonesAcciones(true);
    let idProducto = parseInt(event.target.getAttribute("data-id"));
    //alert("ID del Producto " + idProducto);

    let valorNombreOriginal = event.target.innerHTML;
    const tdClickeado = event.target;

    event.target.innerHTML = `<input data-id="${idProducto}" id="editor-td" type="text" value="${valorNombreOriginal}"/>
                              <button id="btn-guardar-td" data-id="${idProducto}">Guardar</button>  
                              <button id="btn-cancelar-td" data-id="${idProducto}">Cancelar</button>`;

    const botonCancelar = document.getElementById("btn-cancelar-td");
    const botonGuardar = document.getElementById("btn-guardar-td");
    const editorTd = document.getElementById("editor-td");

    botonCancelar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonCancelarNombre(valorNombreOriginal, tdClickeado);
    });

    botonGuardar.addEventListener("click", (event) => {
      event.stopPropagation();
      clickBotonGuardarNombre(tdClickeado);
    });

    editorTd.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    editorTd.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        clickBotonGuardarNombre(tdClickeado);
      }
    });
  } else {
    Swal.fire({
      text: "Debe guardar o cancelar para editar otro valor",
      icon: "info",
    });
  }
}

function clickBotonCancelarCategoria(valorCategoriaOriginal, td) {
  deshabilitarBotonesAcciones(false);
  //alert("CANCELAR " + valorCostoOriginal + td);
  //console.log(td);
  td.innerHTML = valorCategoriaOriginal;

  editandoCampo = false;
}

async function clickBotonGuardarCategoria(td) {
  let idProducto = td.getAttribute("data-id");

  const selectCategoria = document.getElementById("editor-td");

  let valor = selectCategoria.value;
  console.log("Producto ", idProducto);
  console.log("Categoria a modif ", valor);

  Swal.fire({
    text: "Guardando",
    showConfirmButton: false,
    willOpen: async () => {
      Swal.showLoading();
      await modificarCampo(idProducto, "id_categoria", valor);
      deshabilitarBotonesAcciones(false);

      // en valor guardo el text que es la palabra no el id de la categoria
      const indiceSelect = selectCategoria.selectedIndex;
      td.innerHTML = selectCategoria.options[indiceSelect].text;
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

function clickBotonCancelarNombre(valorNombreOriginal, td) {
  deshabilitarBotonesAcciones(false);
  //alert("CANCELAR " + valorCostoOriginal + td);
  //console.log(td);
  td.innerHTML = valorNombreOriginal;

  editandoCampo = false;
}

async function clickBotonGuardarNombre(td) {
  let idProducto = td.getAttribute("data-id");
  let valor = document.getElementById("editor-td").value;

  Swal.fire({
    text: "Guardando",
    showConfirmButton: false,
    willOpen: async () => {
      Swal.showLoading();
      await modificarCampo(idProducto, "nombre", valor);
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

function clickBotonCancelarCosto(valorCostoOriginal, td) {
  deshabilitarBotonesAcciones(false);
  //alert("CANCELAR " + valorCostoOriginal + td);
  //console.log(td);
  td.innerHTML = valorCostoOriginal;

  editandoCampo = false;
}

async function clickBotonGuardarCosto(td) {
  let idProducto = td.getAttribute("data-id");
  let valor = document.getElementById("editor-td").value;

  Swal.fire({
    text: "Guardando",
    showConfirmButton: false,
    willOpen: async () => {
      Swal.showLoading();
      await modificarCampo(idProducto, "costo", valor);
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

function clickBotonCancelarPrecio(valorPrecioOriginal, td) {
  deshabilitarBotonesAcciones(false);
  //alert("CANCELAR " + valorCostoOriginal + td);
  //console.log(td);
  td.innerHTML = valorPrecioOriginal;
  editandoCampo = false;
}

async function clickBotonGuardarPrecio(td) {
  let idProducto = td.getAttribute("data-id");
  let valor = document.getElementById("editor-td").value;

  Swal.fire({
    text: "Guardando",
    showConfirmButton: false,
    willOpen: async () => {
      Swal.showLoading();
      try {
        await modificarCampo(idProducto, "precio", valor);
        deshabilitarBotonesAcciones(false);
        td.innerHTML = valor;
        editandoCampo = false;
        Swal.close();
        Swal.fire({
          text: "Guardado correctamente",
          icon: "success",
        });
      } catch (error) {
        Swal.close();
        Swal.fire({
          text: error.message,
          icon: "error",
        });
      }
    },
  });
}

// FUNCIONES DEL PAGINADOR
// esta funcion dado el total de registros a paginar y los que quiero mostrar por pantalle me dice exactamente
// la cantidad de paginas que va a tener el paginador
function dameCantidadDePaginasDePaginador(
  totalRegistros,
  cantidadRegistrosPorPagina
) {
  let cantidadDePaginasTotales = totalRegistros / cantidadRegistrosPorPagina;
  // si hay resto suma una pagina mas....
  if (totalRegistros % cantidadRegistrosPorPagina > 0) {
    cantidadDePaginasTotales = cantidadDePaginasTotales + 1;
  }
  return parseInt(cantidadDePaginasTotales);
}
