/**
 * noticias.js
 * Listado de noticias con filtro por categoría.
 * El filtro activo se refleja en la URL (?categoria=Turismo) para que
 * los accesos de la página de inicio lleguen ya filtrados.
 */

const TODAS = 'Todas';

async function cargarListado() {
  const contFiltros = document.getElementById('filtros');
  const contListado = document.getElementById('listado');
  const resultado = document.getElementById('resultado-filtro');

  let noticias;
  let categorias;
  try {
    [noticias, categorias] = await Promise.all([obtenerNoticias(), obtenerCategorias()]);
  } catch (error) {
    console.error(error);
    contListado.innerHTML = `<div class="col-12">${htmlErrorCarga()}</div>`;
    return;
  }

  const opciones = [TODAS, ...categorias.map(c => c.nombre)];
  const parametro = new URLSearchParams(location.search).get('categoria');
  let filtroActivo = opciones.includes(parametro) ? parametro : TODAS;

  contFiltros.innerHTML = opciones.map(opcion => `
    <button type="button" class="filtro" data-filtro="${escaparHTML(opcion)}">${escaparHTML(opcion)}</button>
  `).join('');

  function mostrar() {
    const visibles = filtroActivo === TODAS
      ? noticias
      : noticias.filter(n => n.categoria === filtroActivo);

    contFiltros.querySelectorAll('[data-filtro]').forEach(boton => {
      boton.setAttribute('aria-pressed', boton.dataset.filtro === filtroActivo);
    });

    contListado.innerHTML = visibles.length
      ? crearCuadriculaNoticias(visibles)
      : '<p class="col-12 text-center text-secondary py-5">No hay noticias en esta categoría por ahora.</p>';

    resultado.textContent = `${visibles.length} noticias en ${filtroActivo === TODAS ? 'todas las categorías' : filtroActivo}.`;
  }

  contFiltros.addEventListener('click', evento => {
    const boton = evento.target.closest('[data-filtro]');
    if (!boton || boton.dataset.filtro === filtroActivo) return;

    filtroActivo = boton.dataset.filtro;
    const url = new URL(location.href);
    if (filtroActivo === TODAS) {
      url.searchParams.delete('categoria');
    } else {
      url.searchParams.set('categoria', filtroActivo);
    }
    history.replaceState(null, '', url);
    mostrar();
  });

  mostrar();
}

document.addEventListener('DOMContentLoaded', cargarListado);
