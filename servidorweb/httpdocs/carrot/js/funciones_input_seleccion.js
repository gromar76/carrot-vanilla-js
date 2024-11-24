// funciones del input

const convertirInputBusqueda = (idInput, urlBusqueda, funcionDibujar) => {
  const input = document.getElementById(idInput);
  const padre = input.parentNode;
  const lista = document.createElement("div");
  lista.classList.add("lista-resultados-busqueda");
  padre.insertBefore(lista, input.nextSibling);

  lista.style.display = "none";

  input.addEventListener("keyup", dibujarLista);
  input.addEventListener("click", () => {
    input.value = "";
    input.removeAttribute("data-id");
  });

  const limpiarInput = () => {
    lista.innerHTML = "";
    lista.style.display = "none";
  };

  function irSeleccionado(event) {
    const masDatos = event.target.innerHTML;
    const id = event.target.getAttribute("data-id");

    input.value = masDatos.trim();
    lista.innerHTML = "";
    lista.style.display = "none";
    input.setAttribute("data-id", id);

    console.log("Seleccione ", masDatos);
    console.log("Id ", id);
    console.log("Input ", input.getAttribute("id"));

    if (input.getAttribute("id") == "producto") {
      // es un producto al que hice click en tonces ir a buscar los datos y meterlos en los inputs
      // ir a buscar al producto con id
      setearProd(id);
    }
  }

  // comentarle a pablo que sino ponia el await no escribia bien buscando eliana de forma rapida
  async function dibujarLista(event) {
    const textoBuscar = event.target.value;
    //console.log("Buscando ", textoBuscar);
    if (textoBuscar.length >= 3) {
      let url = `${urlBusqueda}${textoBuscar}`;
      let datos = "";
      let paquete = await fetch(url);
      datos = await paquete.json();

      //console.log("DATOS ", datos);
      if (textoBuscar === input.value) {
        if (datos.length > 0) {
          lista.innerHTML = funcionDibujar(datos);

          const listadoC = document.getElementsByClassName(
            "item-lista-resultados-busqueda"
          ); //CAMBIAR NOMBRE CLASE GENERICA
          for (i = 0; i < listadoC.length; i++) {
            listadoC[i].addEventListener("click", irSeleccionado);
          }
          lista.style.display = "block";
        } else {
          limpiarInput();
        }
      }
    } else {
      limpiarInput();
    }
  }
};

const dameIdCajaSeleccionada = (idInput) => {
  const elemento = document.getElementById(idInput);

  return elemento.getAttribute("data-id")
    ? elemento.getAttribute("data-id")
    : 0;
};
