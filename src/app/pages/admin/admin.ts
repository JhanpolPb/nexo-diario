import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AvisosService } from '../../core/services/avisos.service';
import { NoticiasService } from '../../core/services/noticias.service';
import { ErrorCarga } from '../../shared/components/error-carga/error-carga';
import { ClaseCategoriaPipe } from '../../shared/pipes/clase-categoria.pipe';
import { FechaCortaPipe } from '../../shared/pipes/fecha-corta.pipe';

/**
 * Panel de administración: resumen y tabla de noticias con acciones para
 * crear, editar y eliminar. Los cambios se guardan en este navegador.
 */
@Component({
  selector: 'app-admin',
  imports: [RouterLink, ErrorCarga, ClaseCategoriaPipe, FechaCortaPipe],
  templateUrl: './admin.html'
})
export class Admin {
  protected readonly servicio = inject(NoticiasService);

  /** Mensaje que deja el formulario al guardar, o el resultado de una acción del panel. */
  protected readonly aviso = signal(inject(AvisosService).tomar());

  /** Id de la noticia cuya eliminación se está confirmando. */
  protected readonly confirmando = signal<number | null>(null);
  protected readonly confirmandoRestablecer = signal(false);

  protected readonly resumen = computed(() => [
    { etiqueta: 'Noticias', valor: this.servicio.noticias().length, icono: 'bi-newspaper' },
    { etiqueta: 'Destacadas', valor: this.servicio.noticias().filter(n => n.destacada).length, icono: 'bi-star' },
    ...this.servicio.categorias().map(c => ({
      etiqueta: c.nombre,
      valor: this.servicio.contarPorCategoria(c.nombre),
      icono: 'bi-tag'
    }))
  ]);

  eliminar(id: number, titulo: string): void {
    this.servicio.eliminar(id);
    this.confirmando.set(null);
    this.aviso.set(`Se eliminó la noticia “${titulo}”.`);
  }

  restablecer(): void {
    this.servicio.restablecer();
    this.confirmandoRestablecer.set(false);
    this.aviso.set('Se restablecieron las noticias originales.');
  }
}
