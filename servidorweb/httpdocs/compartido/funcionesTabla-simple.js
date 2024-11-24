function dibujarTabla({
  datos,
  columnas,
  campos,
  titulo,
  mostrarPaginador = true,
  cantidadRegistrosPorPagina,
  paginaDesde,
  idContenedor,
}) {
  let columnasTabla = `<thead> <h3>${titulo ? titulo : "Registros"}</h3>
                               <tr class="table-success">`;
  let registros = "";
  for (let i = 0; i < columnas.length; i++) {
    registros += `<th scope="col">${columnas[i]}</th>`;
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

  for (let i = registroDesde; i < registroHasta; i++) {
    dat += `<tr class="table-secondary">`;
    campos.forEach((campo) => {
      dat += `<td>${datos[i][campo]}</td>`;
    });
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

  for (i = 0; i < linksPaginador.length; i++) {
    linksPaginador[i].addEventListener("click", (event) => {
      const paginaId = parseInt(event.target.getAttribute("data-pagina-id"));

      event.preventDefault();
      dibujarTabla({
        datos,
        columnas,
        campos,
        titulo,
        mostrarPaginador,
        cantidadRegistrosPorPagina,
        paginaDesde: paginaId,
        idContenedor,
      });
    });
  }
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
