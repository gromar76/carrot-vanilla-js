function menu(idElemento) {
  let m = document.getElementById(idElemento);
  let html = `
  <header class="container-fluid px-0 pt-2">                
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#"><div class="d-flex justify-content-between ps-4">
    <div class="my-2">
        <img src="imagenes/logo-chico2.png"/>
    </div>
</div></a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button> 

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="index.html" id="inicio">Inicio</a>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Tablas
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="clientes.html">Clientes</a></li>
            <li><a class="dropdown-item" href="productos.html">Productos</a></li>                 
            <li><a class="dropdown-item" href="localidades.html">Localidades</a></li>  
            <li><a class="dropdown-item" href="#">Depositos</a></li>  

          </ul>
        <li class="nav-item">
          <a class="nav-link" href="ventas.html">Ventas</a>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Procesos
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="#">Movimiento de Mercaderia</a></li>
            <li><a class="dropdown-item" href="#">xxxxxxxxxxxxxxxxxxxxxxxx</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#">Something else here</a>
            </li>
          </ul>         
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Listados
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="ventas_x_articulo.html">Ventas por Articulo</a></li>
            <li><a class="dropdown-item" href="ventas_x_categoria.html">Ventas por Categoria (Agrupado)</a></li>
            <li><a class="dropdown-item" href="ventas_x_cliente.html">Ventas por Cliente</a></li>
            <li><a class="dropdown-item" href="#">Clientes que no compran hace un tiempo</a></li>
            <li><a class="dropdown-item" href="#">Ver el Stock por Deposito</a></li>
            <li><a class="dropdown-item" href="#">xxxxxxxxxxxxxxxxxxxxxxx</a></li>
            <li><a class="dropdown-item" href="#">xxxxxxxxxxxxxxxxxxxxxxx</a></li>
            <li><a class="dropdown-item" href="#">xxxxxxxxxxxxxxxxxxxxxxx</a></li>
            <li><a class="dropdown-item" href="#">xxxxxxxxxxxxxxxxxxxxxxx</a></li>
            <li><a class="dropdown-item" href="#">xxxxxxxxxxxxxxxxxxxxxxx</a></li>
            <li><a class="dropdown-item" href="#">xxxxxxxxxxxxxxxxxxxxxxx</a></li>
            <li><a class="dropdown-item" href="#">xxxxxxxxxxxxxxxxxxxxxxx</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#">xxxxxxxxxxxxxxxxxxxxxxx</a>
            </li>
          </ul>
          <li class="nav-item">
            <a class="nav-link" href="#">Ayuda</a>
          </li>
        </li>
      </ul>
    </div>
  </div>
</nav>
</header>
  `;

  m.innerHTML = html;
}

menu("menu");
