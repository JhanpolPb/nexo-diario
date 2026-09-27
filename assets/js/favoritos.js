/**
 * favoritos.js
 * Lista las noticias guardadas en localStorage. Al quitar un corazón,
 * la tarjeta desaparece y, si no queda ninguna, se muestra el estado vacío.
 */

async function cargarFavoritos() {
  const lista = document.getElementById('lista-favoritos');
  const vacio = document.getElementById('favoritos-vacio');
  const titulo = document.querySelector('.titulo-pagina');
  titulo.tabIndex = -1;

  let noticias;
  try {
    noticias = await obtenerNoticias();
  } catch (error) {
    console.error(error);
    lista.innerHTML = `<div class="col-12">${htmlErrorCarga()}</div>`;
    return;
  }

  function guardadas() {
    const ids = Favoritos.obtener();
    return noticias.filter(n => ids.includes(n.id));
  }

  function mostrar() {
    const visibles = guardadas();
    lista.innerHTML = crearCuadriculaNoticias(visibles);
    vacio.classList.toggle('d-none', visibles.length > 0);
  }

  // Al quitar un favorito solo se retira esa tarjeta (sin recargar las imágenes).
  // Si llegó uno nuevo desde otra pestaña, se vuelve a pintar la lista.
  function actualizar() {
    const actuales = guardadas();
    const tarjetas = [...lista.querySelectorAll('.tarjeta-noticia')];
    const hayNuevas = actuales.some(n => !tarjetas.some(t => Number(t.dataset.id) === n.id));
    if (hayNuevas) return mostrar();

    // Si se quitó la tarjeta que tenía el foco, lo devolvemos al título
    const focoPerdido = lista.contains(document.activeElement);
    tarjetas
      .filter(t => !Favoritos.esFavorito(Number(t.dataset.id)))
      .forEach(t => t.parentElement.remove());
    vacio.classList.toggle('d-none', actuales.length > 0);
    if (focoPerdido && !lista.contains(document.activeElement)) titulo.focus();
  }

  document.addEventListener('favoritos:cambio', actualizar);
  mostrar();
}

document.addEventListener('DOMContentLoaded', cargarFavoritos);
