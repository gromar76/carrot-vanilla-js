const entorno = "p"; //d=desarrollo, p=produccion

// es mejor usar p aunque este en la pc de mi casa ya que no me permite la bd CARROT ser accedida
// remotamente sino es por la ip de digital ocean o la del mercado....
// por eso siempre es mejor y anda poniendo la p de produccion y accediento a esta api desde digital ocean

const configuracion = {
  //Desarrollo
  d: {
    URL_API: "http://localhost:7000",
  },
  //Produccion
  p: {
    URL_API: "http://134.209.168.61:7000",
  },
};

const dameConfig = () => {
  return configuracion[entorno];
};
