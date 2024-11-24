const express = require("express");

const app = express();

app.use(express.static("httpdocs"));

app.listen(80, () => {
  console.log("El servidor web de CARROT esta escuchando en el puerto 80");
});
