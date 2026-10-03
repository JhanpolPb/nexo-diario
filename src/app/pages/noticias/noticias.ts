import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NoticiasService } from '../../core/services/noticias.service';
import { ErrorCarga } from '../../shared/components/error-carga/error-carga';
import { TarjetaNoticia } from '../../shared/components/tarjeta-noticia/tarjeta-noticia';
import { normalizar } from '../../shared/texto';

const TODAS = 'Todas';

/**
 * Listado de noticias con buscador y filtro por categoría.
 * El filtro activo vive en la URL (?categoria=Turismo) para que los accesos
 * de la página de inicio lleguen ya filtrados.
 */
@Component({
  selector: 'app-noticias',
  imports: [FormsModule, TarjetaNoticia, ErrorCarga],
  templateUrl: './noticias.html'
})
export class Noticias {
  protected readonly servicio = inject(NoticiasService);
  private readonly router = inject(Router);

  /** Parámetro ?categoria= de la URL (lo enlaza el router automáticamente). */
  readonly categoria = input<string>();

  /** Texto del buscador, enlazado en ambos sentidos con [(ngModel)]. */
  protected readonly busqueda = signal('');

  protected readonly opciones = computed(() => [TODAS, ...this.servicio.categorias().map(c => c.nombre)]);

  protected readonly filtroActivo = computed(() => {
    const categoria = this.categoria();
    return categoria && this.opciones().includes(categoria) ? categoria : TODAS;
  });

  protected readonly visibles = computed(() => {
    const filtro = this.filtroActivo();
    const palabras = normalizar(this.busqueda()).split(/\s+/).filter(Boolean);

    return this.servicio.noticias().filter(n => {
      if (filtro !== TODAS && n.categoria !== filtro) return false;
      // Cada palabra buscada debe aparecer en el título, el resumen, el contenido, el autor o la categoría
      const texto = normalizar(`${n.titulo} ${n.resumen} ${n.contenido} ${n.autor} ${n.categoria}`);
      return palabras.every(palabra => texto.includes(palabra));
    });
  });

  /** Resultado del filtro: visible en pantalla al buscar y anunciado a lectores de pantalla. */
  protected readonly resumenFiltro = computed(() => {
    const total = this.visibles().length;
    const filtro = this.filtroActivo();
    const donde = filtro === TODAS ? 'todas las categorías' : filtro;
    const busqueda = this.busqueda().trim();
    const plural = total === 1 ? 'noticia' : 'noticias';
    return busqueda ? `${total} ${plural} para “${busqueda}” en ${donde}.` : `${total} ${plural} en ${donde}.`;
  });

  filtrar(opcion: string): void {
    this.router.navigate([], {
      queryParams: { categoria: opcion === TODAS ? null : opcion },
      replaceUrl: true
    });
  }

  limpiarBusqueda(campo: HTMLInputElement): void {
    this.busqueda.set('');
    campo.focus();
  }
}
