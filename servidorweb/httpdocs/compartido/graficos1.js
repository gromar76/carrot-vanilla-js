let grafico;

function armarGrafico(
  idCanvas,
  tipoGrafico,
  columnasDeDatos,
  dataSet,
  titulo,
  subtitulo
) {
  const ctx = document.getElementById(idCanvas).getContext("2d");

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: tipoGrafico,
    data: { labels: columnasDeDatos, datasets: dataSet },
    options: {
      mantainAspectRadio: false,

      plugins: {
        title: {
          display: true,
          text: titulo,
        },
        subtitle: {
          display: true,
          text: subtitulo,
          color: "red",
        },
      },
    },
  });
}
