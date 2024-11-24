// FUNCIONES VARIAS EN EL FRONTEND

// arma una tabla, le debo pasar el JSON con los datos
// y luego las columnas y campos -   columnas["APELLIDO"] - campos["apellido"]
function armarTabla_copia(datos, columnas, campos, titulo) {
  let columnasTabla = `<thead> <h3>${titulo ? titulo : "Registros"}</h3>
                             <tr class="table-success">`;
  for (let i = 0; i < columnas.length; i++) {
    //console.log(columnas[i]);
    columnasTabla += `<th scope="col">${columnas[i]}</th>`;
  }
  columnasTabla += `</tr>
                        </thead>`;
  let comienzoBody = `<tbody>`;
  let finBody = `</tbody>`;

  let dat = "";
  /*   for (let i = 0; i < datos.length; i++) {
    dat += `<tr class="table-secondary">`;
    for (let c = 0; c < campos.length; c++) {
      //console.log(campos[c]);
      dat += `<td>${datos[i][campos[c]]}</td>`;
    }

    dat += `</tr>`;
  } */

  datos.forEach((elemento) => {
    dat += `<tr class="table-secondary">`;
    campos.forEach((campo) => {
      dat += `<td>${elemento[campo]}</td>`;
    });
  });

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

  return tablaHtml;
}

function armarTabla(
  datos,
  columnas,
  campos,
  titulo,
  registros_x_pantalla,
  mostrarDesde
) {
  // averiguo cuantas paginas voy a tener
  let paginas = damePaginasDePaginador(datos.length, registros_x_pantalla);

  console.log("Datos ", datos);

  // aca se que PAGINAS contiene el nro de paginas que tiene que tener mi paginador

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

  /*datos.forEach((elemento) => {
    dat += `<tr class="table-secondary">`;
    campos.forEach((campo) => {
      dat += `<td>${elemento[campo]}</td>`;
    });
  });*/

  let hasta = mostrarDesde + registros_x_pantalla;

  //console.log("LLEGAMOS HASTA ", hasta);

  if (hasta > datos.length) {
    hasta = datos.length + 1;
  }

  //console.log("DATOS A DIBUJAR ARMARTABLA ", datos);
  //console.log("REGISTROS ", datos.length);
  //console.log("DESDE ", mostrarDesde);
  // console.log("HASTA ", hasta);

  //for (let i = 0; i < hasta; i++) {
  //console.log(datos[i], i, hasta);
  for (let i = mostrarDesde - 1; i < hasta - 1; i++) {
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

  let estoy_en_pagina = Math.ceil(mostrarDesde / registros_x_pantalla);

  //console.log("Estoy en pagina ", estoy_en_pagina);
  //console.log("PAGINAS TOTALES ", paginas);

  let codigoH = "";
  let ultimoLink = "";

  for (let i = 1; i <= paginas; i++) {
    const desde = (i - 1) * registros_x_pantalla + 1;
    const hasta = desde + registros_x_pantalla - 1;

    if (estoy_en_pagina === i) {
      codigoH += `<a data-pagina="${desde}" class="link-paginador" style="color: red" href="Desde Reg ${desde} hasta ${hasta}"> ${i} </a>`;
    } else {
      codigoH += `<a data-pagina="${desde}" class="link-paginador" style="color: blue" href="Desde Reg ${desde} hasta ${hasta}"> ${i} </a>`;
      ultimoLink = desde;
    }
  }

  let primeraPagina = `<a data-pagina="1" class="link-paginador" href=""> PRIMERA </a>`;
  let ultimaPagina = `<a data-pagina="${ultimoLink}" class="link-paginador" href=""> ULTIMA </a>`;

  let paginacion = primeraPagina + codigoH + ultimaPagina;
  return tablaHtml + paginacion;
}

// FUNCIONES DEL PAGINADOR

// esta funcion dado el total de registros a paginar y los que quiero mostrar por pantalle me dice exactamente
// la cantidad de paginas que va a tener el paginador
function damePaginasDePaginador(total_registros, mostrar_x_pantalla) {
  let paginas = total_registros / mostrar_x_pantalla;
  // si hay resto suma una pagina mas....
  if (total_registros % mostrar_x_pantalla > 0) {
    paginas = paginas + 1;
  }
  return paginas;
}

// FIN FUNCIONES PAGINADOR
