/**
 * componentes.js
 * Piezas de interfaz compartidas por todas las páginas:
 * encabezado, pie de página, tarjeta de noticia y botón de favoritos.
 *
 * Cada página indica cuál es su sección con <body data-pagina="...">
 * para resaltar el enlace activo del menú.
 */

const MENU = [
  { pagina: 'inicio', texto: 'Inicio', url: 'index.html' },
  { pagina: 'noticias', texto: 'Noticias', url: 'noticias.html' },
  { pagina: 'favoritos', texto: 'Favoritos', url: 'favoritos.html' },
  { pagina: 'contacto', texto: 'Contacto', url: 'contacto.html' }
];

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/* ---------------------------- Utilidades ---------------------------- */

/** Escapa texto antes de insertarlo como HTML. */
function escaparHTML(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** "2026-09-12" -> "12 sep 2026" */
function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  return `${dia} ${MESES[mes - 1]} ${anio}`;
}

/** "Educación" -> "cat-educacion" (clase CSS con los colores de la categoría). */
function claseCategoria(categoria) {
  const base = categoria.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return `cat-${base}`;
}

/** Contenido que se muestra cuando no se pudo cargar el JSON de noticias. */
function htmlErrorCarga() {
  return `
    <div class="alert alert-warning" role="alert">
      <strong>No pudimos cargar las noticias.</strong>
      Si abriste el archivo con doble clic, usa un servidor local
      (por ejemplo, la extensión Live Server de VS Code).
    </div>`;
}

/* ---------------------------- Encabezado ---------------------------- */

function renderEncabezado(paginaActiva) {
  const enlaces = MENU.map(item => {
    const activo = item.pagina === paginaActiva;
    return `
      <li class="nav-item">
        <a class="nav-link${activo ? ' active' : ''}" href="${item.url}"${activo ? ' aria-current="page"' : ''}>${item.texto}</a>
      </li>`;
  }).join('');

  return `
    <nav class="navbar navbar-expand-md" aria-label="Navegación principal">
      <div class="container">
        <a class="logo" href="index.html">
          <span class="logo-marca" aria-hidden="true">N</span>
          <span>Nexo<span class="logo-acento">Diario</span></span>
        </a>

        <div class="d-flex align-items-center gap-2 order-md-last">
          <a class="btn-favoritos-header" href="favoritos.html">
            <i class="bi bi-heart" data-icono-favoritos aria-hidden="true"></i>
            <span class="d-none d-sm-inline">Favoritos</span>
            <span class="contador-favoritos d-none" data-contador-favoritos></span>
          </a>
          <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
                  data-bs-target="#menuPrincipal" aria-controls="menuPrincipal"
                  aria-expanded="false" aria-label="Abrir menú">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div class="collapse navbar-collapse justify-content-md-center" id="menuPrincipal">
          <ul class="navbar-nav menu-principal gap-md-1">${enlaces}</ul>
        </div>
      </div>
    </nav>`;
}

/** Refleja en el encabezado cuántas noticias hay guardadas. */
function actualizarContadorFavoritos() {
  const total = Favoritos.obtener().length;
  const contador = document.querySelector('[data-contador-favoritos]');
  const icono = document.querySelector('[data-icono-favoritos]');
  const enlace = document.querySelector('.btn-favoritos-header');
  if (!contador) return;

  contador.textContent = total;
  contador.classList.toggle('d-none', total === 0);
  icono.className = `bi ${total > 0 ? 'bi-heart-fill' : 'bi-heart'}`;
  enlace.setAttribute('aria-label', `Favoritos (${total} guardadas)`);
}

/* ------------------------------- Pie -------------------------------- */

function renderPie() {
  const enlaces = MENU.map(item => `<li><a href="${item.url}">${item.texto}</a></li>`).join('');

  return `
    <div class="container">
      <div class="row g-4">
        <div class="col-md-6">
          <a class="logo mb-3" href="index.html">
            <span class="logo-marca" aria-hidden="true">N</span>
            <span>NexoDiario</span>
          </a>
          <p class="pie-descripcion">
            Noticias, experiencias y tendencias en un solo lugar. Tu fuente confiable de información digital.
          </p>
          <div class="redes">
            <a href="#" aria-label="Nexo Diario en X"><i class="bi bi-twitter-x" aria-hidden="true"></i></a>
            <a href="#" aria-label="Nexo Diario en Facebook"><i class="bi bi-facebook" aria-hidden="true"></i></a>
            <a href="#" aria-label="Nexo Diario en LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a>
            <a href="#" aria-label="Nexo Diario en YouTube"><i class="bi bi-youtube" aria-hidden="true"></i></a>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <h2>Navegación</h2>
          <ul>${enlaces}</ul>
        </div>
        <div class="col-6 col-md-3">
          <h2>Contacto</h2>
          <ul>
            <li>contacto@nexodiario.com</li>
            <li>+57 601 234 5678</li>
            <li>Bogotá, Colombia</li>
          </ul>
        </div>
      </div>
      <div class="pie-legal">
        <p class="m-0">© 2026 Nexo Diario. Todos los derechos reservados.</p>
        <small>Diseñado con ❤ en Colombia</small>
      </div>
    </div>`;
}

/* ------------------------- Tarjeta de noticia ------------------------ */

function crearTarjetaNoticia(noticia) {
  const titulo = escaparHTML(noticia.titulo);
  const favorita = Favoritos.esFavorito(noticia.id);

  return `
    <article class="tarjeta-noticia" data-id="${noticia.id}">
      <div class="tarjeta-noticia-media">
        <img src="${escaparHTML(noticia.imagen)}" alt="" loading="lazy" width="800" height="500">
        ${botonFavorito(noticia.id, noticia.titulo, favorita)}
      </div>
      <div class="tarjeta-noticia-cuerpo">
        <span class="etiqueta-categoria ${claseCategoria(noticia.categoria)}">${escaparHTML(noticia.categoria)}</span>
        <h3 class="tarjeta-noticia-titulo">${titulo}</h3>
        <p class="tarjeta-noticia-resumen">${escaparHTML(noticia.resumen)}</p>
        <div class="tarjeta-noticia-pie">
          <time class="tarjeta-noticia-fecha" datetime="${noticia.fecha}">${formatearFecha(noticia.fecha)}</time>
          <a class="btn btn-nexo btn-ver-mas" href="detalle.html?id=${noticia.id}">
            Ver más <span aria-hidden="true">→</span><span class="visually-hidden">: ${titulo}</span>
          </a>
        </div>
      </div>
    </article>`;
}

/** Envuelve cada tarjeta en una columna de la cuadrícula de 3 columnas. */
function crearCuadriculaNoticias(noticias) {
  return noticias
    .map(n => `<div class="col-md-6 col-lg-4">${crearTarjetaNoticia(n)}</div>`)
    .join('');
}

function botonFavorito(id, titulo, favorita) {
  return `
    <button type="button" class="btn-favorito" data-favorito="${id}"
            aria-pressed="${favorita}" aria-label="Guardar en favoritos: ${escaparHTML(titulo)}">
      <i class="bi ${favorita ? 'bi-heart-fill' : 'bi-heart'}" aria-hidden="true"></i>
    </button>`;
}

/** Sincroniza todos los botones de corazón de la página con localStorage. */
function actualizarBotonesFavorito() {
  document.querySelectorAll('[data-favorito]').forEach(boton => {
    const favorita = Favoritos.esFavorito(Number(boton.dataset.favorito));
    boton.setAttribute('aria-pressed', favorita);
    boton.querySelector('i').className = `bi ${favorita ? 'bi-heart-fill' : 'bi-heart'}`;
  });
}

/* --------------------------- Inicialización -------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('encabezado').innerHTML = renderEncabezado(document.body.dataset.pagina);
  document.getElementById('pie').innerHTML = renderPie();
  actualizarContadorFavoritos();
});

// Un solo manejador para todos los corazones, incluso los que se crean después
document.addEventListener('click', evento => {
  const boton = evento.target.closest('[data-favorito]');
  if (!boton) return;
  Favoritos.alternar(Number(boton.dataset.favorito));
});

document.addEventListener('favoritos:cambio', () => {
  actualizarContadorFavoritos();
  actualizarBotonesFavorito();
});

// Mantiene sincronizadas otras pestañas abiertas del sitio
window.addEventListener('storage', evento => {
  if (evento.key === CLAVES.FAVORITOS) {
    document.dispatchEvent(new CustomEvent('favoritos:cambio'));
  }
});
