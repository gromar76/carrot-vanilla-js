//Dado un nro de mes devuelve el dia en STRING!!!
function dameMes(nroMes) {
  let meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  return meses[nroMes - 1];
}

// me devuelve la fecha de hoy en el formato dia-mes-año
// sino paso ninguna fecha tomar el dia de hoy !!
// me la devuelve en formato STRING
function formatearFecha(fecha, formato = "ES") {
  if (!fecha) {
    // crea un nuevo objeto `Date` con la fecha de hoy
    fecha = new Date();
  }

  // `getDate()` devuelve el día del mes (del 1 al 31)
  let day = fecha.getDate();
  // `getMonth()` devuelve el mes (de 0 a 11)
  let month = fecha.getMonth() + 1;
  // `getFullYear()` devuelve el año completo
  const year = fecha.getFullYear();

  // quiero formatear a 15/06/2023 poner el 0 si es menor a 10 el dia o mes
  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  let fechaFormateada = `${day}-${month}-${year}`; //Por defecto en español

  //si pido en formato INGLES entonces formateo como año-mes-dia
  if (formato === "EN") {
    fechaFormateada = `${year}-${month}-${day}`;
  }

  return fechaFormateada;
}

// recibo una fecha en formato STRING en INGLES y la devuelvo en STRING pero en ESPAÑOL
// recibo 2023/08/20 y devuelvo 20/08/2023
// siempre en formato STRING
function dameFechaFormateadaEsp(fecha) {
  fecha = new Date(fecha).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });

  return fecha;
}

// recibo una fecha en formato STRING en ESPAÑOL y la devuelvo en STRING pero en INGLES
// recibo 20/08/2023 y devuelvo 2023/08/20
// siempre en formato STRING

//CHEQUEAR CON PABLO

function dameFechaFormateadaEng(fecha) {
  fecha = new Date(fecha).toLocaleDateString("en-EN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });

  return fecha;
}

// dada una fecha con / la devuelve con -
// si paso 21/08/2023 devuelve 21-08-2023
function dameFechaConGuion(fecha) {
  return fecha.replaceAll("/", "-");
}

function dameFechaDeHoy() {
  // obtengo la fecha del dia de hoy
  let fechaHoy = formatearFecha(null, "EN");
  fechaHoy = dameFechaFormateadaEsp(fechaHoy);
  fechaHoy = dameFechaConGuion(fechaHoy);
  return fechaHoy;
}

//dado un string de tipo 23-09-2023 tiene que devolver un string asi 2023-09-23 ya que la base de datos de
//Carrot espera eso
function dameVueltaFecha(fecha) {
  //fecha = '23-09-2023'
  const anio = fecha.substr(6, 4);
  const mes = fecha.substr(3, 2);
  const dia = fecha.substr(0, 2);
  return anio + "-" + mes + "-" + dia;
}

function formatearFechaJS(fecha) {
  console.log(fecha);
}

// esta funcion recibe una fecha en formato anio-mes-dia
// la transformo a un objeto fecha
// le resto 6 meses y la devuelvo como string
function restaleFecha(fecha) {
  let fecha6mesesAntes = fecha;

  fecha6mesesAntes = new Date();

  // `getDate()` devuelve el día del mes (del 1 al 31)
  let day = fecha6mesesAntes.getDate();
  // `getMonth()` devuelve el mes (de 0 a 11)
  let month = fecha6mesesAntes.getMonth() + 1;
  // `getFullYear()` devuelve el año completo
  let anio = fecha6mesesAntes.getFullYear();

  let meses = month;

  if (meses <= 6) {
    meses = 12 - meses;
    anio = anio - 1;
  } else {
    meses = meses - 6;
  }

  if (meses < 10) {
    meses = "0" + meses;
  }

  let dia = day;
  if (dia < 10) {
    dia = "0" + dia;
  }

  fecha6mesesAntes = `${anio}-${meses}-${dia}`;

  return fecha6mesesAntes;
}
