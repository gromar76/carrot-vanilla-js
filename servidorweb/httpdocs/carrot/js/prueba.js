let url = "";

async function dameProd() {
  url = `http://192.168.10.85:7000/productos/todos`;
  let paquete = await fetch(url);
  let datos = await paquete.json();
  return datos;
}

async function iniciar() {
  let datos = await dameProd();

  console.log(datos);
}

iniciar();
