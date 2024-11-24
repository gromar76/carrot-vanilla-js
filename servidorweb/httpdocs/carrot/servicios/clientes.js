async function dameClientes(id) {
  //sino paso la variable id, entonces va al else, si la paso entra en el bucle
  // de busqueda x id
  let url = "";

  if (id) {
    // pase un id
    url = `${config.URL_API}/clientes/${id}`;
  } else {
    //no pase id
    url = `${config.URL_API}/clientes/todos`;
  }

  const paquete = await fetch(url);
  const datos = await paquete.json();

  if (datos.nombre === "Pepe") {
    throw new Error("Error en el nombre");
  }

  return datos;
}
