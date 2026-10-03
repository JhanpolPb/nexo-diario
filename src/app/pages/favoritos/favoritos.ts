import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FavoritosService } from '../../core/services/favoritos.service';
import { NoticiasService } from '../../core/services/noticias.service';
import { ErrorCarga } from '../../shared/components/error-carga/error-carga';
import { TarjetaNoticia } from '../../shared/components/tarjeta-noticia/tarjeta-noticia';

/**
 * Noticias guardadas en localStorage. Al quitar un corazón la tarjeta
 * desaparece sola y, si no queda ninguna, se muestra el estado vacío.
 */
@Component({
  selector: 'app-favoritos',
  imports: [RouterLink, TarjetaNoticia, ErrorCarga],
  templateUrl: './favoritos.html'
})
export class Favoritos {
  protected readonly servicio = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);

  protected readonly guardadas = computed(() => {
    const ids = this.favoritos.lista();
    return this.servicio.noticias().filter(n => ids.includes(n.id));
  });
}
