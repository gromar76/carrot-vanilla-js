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
  verDetalle,
  accionEliminar,
  cerrarModal,
  manejadorInputs,
  funcionesDetalle,
  funcionesSelect,
  botones,
}) {
  //console.log({ tiposCampos });

  //console.log("FUNCION SELECT ", funcionesSelect);

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

  //console.log("Campos ", campos, tiposCampos);
  //console.log("Datos", datos);
  for (let i = registroDesde; i < registroHasta; i++) {
    dat += `<tr class="table-secondary">`;
    // aca con el forEach campos recibe el objeto campo con todos los datos de ese objeto
    // y la j seria el indice
    campos.forEach((campo, j, array) => {
      //console.log("Tipo campo:", campo, tiposCampos[j], j);
      if (columnas[j]) {
        if (tiposCampos[j] === "select") {
          const nombreIdSelectCampo = "id_" + campo;
          const idSelectCampo = datos[i][nombreIdSelectCampo];
          //console.log("Tipo campo ", idSelectCampo);

          dat += `<td class="col-${campo}" data-id="${datos[i].id}" data-select-${campo}="${idSelectCampo}">${datos[i][campo]}</td>`;
        }
        if (tiposCampos[j] === "number") {
          dat += `<td class="col-${campo}" data-id="${datos[i].id}">${datos[i][campo]}</td>`;
        }

        if (tiposCampos[j] === "moneda") {
          dat += `<td class="col-${campo}" data-id="${datos[i].id}">$ ${datos[i][campo]}</td>`;
        }

        if (tiposCampos[j] === "text") {
          dat += `<td class="col-${campo}" data-id="${datos[i].id}">${
            datos[i][campo] ? datos[i][campo] : ""
          }</td>`;
        }
        if (tiposCampos[j] === "date") {
          dat += `<td class="col-${campo}" data-id="${datos[i].id}">${datos[i][campo]}</td>`;
        }
      }
    });

    if (mostrarBotones) {
      dat += `<td>`;
      botones.forEach((boton) => {
        dat += `<button class=${boton.clase} data-id="${datos[i].id}">
              ${boton.texto}
                      </button>`;
      });

      dat += `</td>`;
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

  const destino = document.getElementById(idContenedor);
  destino.innerHTML = tablaHtml + links;

  const linksPaginador = document.getElementsByClassName("link-paginador");

  campos.forEach((campo, posCampo) => {
    const filas = document.getElementsByClassName(`col-${campo}`);

    for (i = 0; i < filas.length; i++) {
      if (funcionesDetalle[posCampo]) {
        filas[i].addEventListener("click", funcionesDetalle[posCampo]);
      }
    }
  });

  if (mostrarBotones) {
    botones.forEach((boton) => {
      const botonesHTML = document.getElementsByClassName(boton.clase);
      for (i = 0; i < botonesHTML.length; i++) {
        botonesHTML[i].addEventListener("click", boton.funcionEjecutar);
      }
    });
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
        verDetalle,
        accionEliminar,
        cerrarModal,
        manejadorInputs,
        funcionesDetalle,
        funcionesSelect,
        botones,
      });
    });
  }
}

function deshabilitarBotonesAcciones(valor) {
  // 0 es Ocultar y 1 es Ver
  // quiero poner detalle y eliminar en disabled

  // console.log("VALOR ", valor);

  botones.forEach((boton) => {
    const botonesHTML = document.getElementsByClassName(boton.clase);

    for (i = 0; i < botonesHTML.length; i++) {
      botonesHTML[i].disabled = valor;
    }
  });

  // fin poner botones en disabled
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
