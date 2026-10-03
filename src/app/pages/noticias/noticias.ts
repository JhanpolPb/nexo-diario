import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { NoticiasService } from '../../core/services/noticias.service';
import { ErrorCarga } from '../../shared/components/error-carga/error-carga';
import { TarjetaNoticia } from '../../shared/components/tarjeta-noticia/tarjeta-noticia';

const TODAS = 'Todas';

/**
 * Listado de noticias con filtro por categoría.
 * El filtro activo vive en la URL (?categoria=Turismo) para que los accesos
 * de la página de inicio lleguen ya filtrados.
 */
@Component({
  selector: 'app-noticias',
  imports: [TarjetaNoticia, ErrorCarga],
  templateUrl: './noticias.html'
})
export class Noticias {
  protected readonly servicio = inject(NoticiasService);
  private readonly router = inject(Router);

  /** Parámetro ?categoria= de la URL (lo enlaza el router automáticamente). */
  readonly categoria = input<string>();

  protected readonly opciones = computed(() => [TODAS, ...this.servicio.categorias().map(c => c.nombre)]);

  protected readonly filtroActivo = computed(() => {
    const categoria = this.categoria();
    return categoria && this.opciones().includes(categoria) ? categoria : TODAS;
  });

  protected readonly visibles = computed(() => {
    const filtro = this.filtroActivo();
    const noticias = this.servicio.noticias();
    return filtro === TODAS ? noticias : noticias.filter(n => n.categoria === filtro);
  });

  /** Texto para lectores de pantalla con el resultado del filtro. */
  protected readonly resumenFiltro = computed(() => {
    const filtro = this.filtroActivo();
    return `${this.visibles().length} noticias en ${filtro === TODAS ? 'todas las categorías' : filtro}.`;
  });

  filtrar(opcion: string): void {
    this.router.navigate([], {
      queryParams: { categoria: opcion === TODAS ? null : opcion },
      replaceUrl: true
    });
  }
}
