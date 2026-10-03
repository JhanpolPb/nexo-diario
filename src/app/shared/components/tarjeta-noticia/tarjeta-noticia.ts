import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Noticia } from '../../../core/models/noticia.model';
import { ClaseCategoriaPipe } from '../../pipes/clase-categoria.pipe';
import { FechaCortaPipe } from '../../pipes/fecha-corta.pipe';
import { BotonFavorito } from '../boton-favorito/boton-favorito';

/** Tarjeta con la imagen, categoría, resumen y enlace al detalle de una noticia. */
@Component({
  selector: 'app-tarjeta-noticia',
  imports: [RouterLink, BotonFavorito, ClaseCategoriaPipe, FechaCortaPipe],
  templateUrl: './tarjeta-noticia.html',
  host: { class: 'd-block h-100' }
})
export class TarjetaNoticia {
  /** Noticia que se muestra (la recibe del componente padre por property binding). */
  readonly noticia = input.required<Noticia>();

  /** En la vista previa del panel de administración la tarjeta no tiene acciones. */
  readonly vistaPrevia = input(false);
}
