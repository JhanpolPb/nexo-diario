/**
 * data.js
 * Carga las noticias desde el archivo JSON local (data/noticias.json).
 * El resultado se guarda en memoria para no repetir la petición.
 *
 * Importante: fetch() no funciona abriendo el HTML con doble clic (file://)
 * en Chrome/Edge. Use la extensión "Live Server" de VS Code o GitHub Pages.
 */

const RUTA_DATOS = 'data/noticias.json';
let cacheDatos = null;

/** Obtiene el objeto completo { categorias, noticias }. */
async function obtenerDatos() {
  if (cacheDatos) return cacheDatos;

  const respuesta = await fetch(RUTA_DATOS);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al cargar ${RUTA_DATOS}`);
  }
  cacheDatos = await respuesta.json();
  return cacheDatos;
}

/** Devuelve las noticias ordenadas de la más reciente a la más antigua. */
async function obtenerNoticias() {
  const { noticias } = await obtenerDatos();
  return [...noticias].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

async function obtenerCategorias() {
  const { categorias } = await obtenerDatos();
  return categorias;
}

async function obtenerNoticiaPorId(id) {
  const noticias = await obtenerNoticias();
  return noticias.find(n => n.id === id) || null;
}
