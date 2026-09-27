/**
 * inicio.js
 * Página de inicio: noticias destacadas y accesos por categoría.
 */

async function cargarInicio() {
  const contDestacadas = document.getElementById('destacadas');
  const contCategorias = document.getElementById('categorias');

  try {
    const [noticias, categorias] = await Promise.all([obtenerNoticias(), obtenerCategorias()]);

    const destacadas = noticias.filter(n => n.destacada).slice(0, 3);
    contDestacadas.innerHTML = crearCuadriculaNoticias(destacadas);

    contCategorias.innerHTML = categorias.map(categoria => {
      const total = noticias.filter(n => n.categoria === categoria.nombre).length;
      const url = `noticias.html?categoria=${encodeURIComponent(categoria.nombre)}`;
      return `
        <div class="col-6 col-md-3">
          <a class="tarjeta-categoria ${claseCategoria(categoria.nombre)}" href="${url}">
            <div class="tarjeta-categoria-media">
              <img src="${escaparHTML(categoria.imagen)}" alt="" loading="lazy" width="400" height="200">
            </div>
            <div class="tarjeta-categoria-cuerpo">
              <h3>${escaparHTML(categoria.nombre)}</h3>
              <p>${total} ${total === 1 ? 'artículo' : 'artículos'}</p>
            </div>
          </a>
        </div>`;
    }).join('');
  } catch (error) {
    console.error(error);
    contDestacadas.innerHTML = `<div class="col-12">${htmlErrorCarga()}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', cargarInicio);
