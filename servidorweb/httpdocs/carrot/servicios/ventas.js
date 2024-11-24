async function dameVentas(id = 0) {
  //sino paso la variable id, entonces va al else, si la paso entra en el bucle
  // de busqueda x id
  let url = "";

  if (id == 0) {
    //no pase id
    url = `${config.URL_API}/ventas/todos`;
  } else {
    // pase un id
    url = `${config.URL_API}/ventas/${id}`;
  }

  const paquete = await fetch(url);
  const datos = await paquete.json();
  return datos;
}
