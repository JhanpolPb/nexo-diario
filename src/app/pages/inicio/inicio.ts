import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NoticiasService } from '../../core/services/noticias.service';
import { ErrorCarga } from '../../shared/components/error-carga/error-carga';
import { TarjetaNoticia } from '../../shared/components/tarjeta-noticia/tarjeta-noticia';
import { ClaseCategoriaPipe } from '../../shared/pipes/clase-categoria.pipe';

/** Página de inicio: bienvenida, noticias destacadas y accesos por categoría. */
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, TarjetaNoticia, ErrorCarga, ClaseCategoriaPipe],
  templateUrl: './inicio.html'
})
export class Inicio {
  protected readonly servicio = inject(NoticiasService);

  /** Dato decorativo del recuadro de la portada (interpolación). */
  protected readonly publicacionesHoy = 24;
}
