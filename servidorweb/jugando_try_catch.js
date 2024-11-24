function a(num) {
  if (num > 0) {
    return 1; //bien
  } else if (num === 0) {
    throw new Error("Error: NO PUEDE SER 0!!!!"); //Error
  } else {
    throw new Error("Error: NO PUEDE SER NEGATIVO!!!!"); //Error
  }
}

function b() {
  try {
    a(2);

    a(3);

    a(0);

    a(6);

    a(9);
  } catch (error) {
    console.log(error.message);
  }
}

async function traerDatos() {
  try {
    const respuesta = await fetch("http://134.209.168.61:7000/usuarios/368");

    console.log(respuesta.status);
  } catch {
    console.log("En este momento no se pudieron obtener los datos.");
  }
}

traerDatos();
