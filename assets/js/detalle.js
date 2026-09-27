/**
 * detalle.js
 * Muestra una noticia completa a partir del parámetro ?id= de la URL.
 */

function htmlNoEncontrada() {
  return `
    <div class="estado-vacio">
      <div class="estado-vacio-icono"><i class="bi bi-newspaper" aria-hidden="true"></i></div>
      <h1>No encontramos esta noticia</h1>
      <p>Es posible que el enlace esté incompleto o que la noticia ya no esté disponible.</p>
      <a class="btn btn-nexo" href="noticias.html">Ver todas las noticias</a>
    </div>`;
}

function htmlNoticia(noticia) {
  const fecha = formatearFecha(noticia.fecha);
  const parrafos = noticia.contenido
    .split('\n\n')
    .map(parrafo => `<p>${escaparHTML(parrafo)}</p>`)
    .join('');

  return `
    <span class="etiqueta-categoria ${claseCategoria(noticia.categoria)}">${escaparHTML(noticia.categoria)}</span>
    <h1 class="detalle-titulo">${escaparHTML(noticia.titulo)}</h1>

    <div class="detalle-meta">
      <span>Por <strong>${escaparHTML(noticia.autor)}</strong></span>
      <span aria-hidden="true">·</span>
      <time datetime="${noticia.fecha}">${fecha}</time>
      <span aria-hidden="true">·</span>
      <span>${noticia.lecturaMin} min de lectura</span>
    </div>

    <figure class="detalle-imagen">
      <img src="${escaparHTML(noticia.imagen)}" alt="" width="800" height="500">
    </figure>

    <div class="detalle-contenido">${parrafos}</div>

    <section class="detalle-info" aria-labelledby="titulo-info">
      <h2 id="titulo-info">Información adicional</h2>
      <dl>
        <div><dt>Categoría</dt><dd>${escaparHTML(noticia.categoria)}</dd></div>
        <div><dt>Autor</dt><dd>${escaparHTML(noticia.autor)}</dd></div>
        <div><dt>Publicado</dt><dd>${fecha}</dd></div>
        <div><dt>Fuente</dt><dd>Nexo Diario</dd></div>
      </dl>
    </section>

    <div class="detalle-acciones">
      <button type="button" class="btn btn-favorito-detalle" id="btn-favorito-detalle"></button>
      <a class="btn btn-nexo" href="contacto.html">Contactar</a>
    </div>`;
}

/** Actualiza texto, icono y estado del botón grande de favoritos. */
function pintarBotonFavorito(boton, id) {
  const favorita = Favoritos.esFavorito(id);
  boton.setAttribute('aria-pressed', favorita);
  boton.innerHTML = `
    <i class="bi ${favorita ? 'bi-heart-fill' : 'bi-heart'}" aria-hidden="true"></i>
    ${favorita ? 'Guardado en favoritos' : 'Agregar a favoritos'}`;
}

async function cargarDetalle() {
  const contenedor = document.getElementById('noticia');
  const id = Number(new URLSearchParams(location.search).get('id'));

  let noticia;
  try {
    noticia = await obtenerNoticiaPorId(id);
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = htmlErrorCarga();
    return;
  }

  if (!noticia) {
    contenedor.innerHTML = htmlNoEncontrada();
    return;
  }

  document.title = `${noticia.titulo} | Nexo Diario`;
  contenedor.innerHTML = htmlNoticia(noticia);

  const boton = document.getElementById('btn-favorito-detalle');
  pintarBotonFavorito(boton, noticia.id);
  boton.addEventListener('click', () => Favoritos.alternar(noticia.id));
  document.addEventListener('favoritos:cambio', () => pintarBotonFavorito(boton, noticia.id));
}

document.addEventListener('DOMContentLoaded', cargarDetalle);
