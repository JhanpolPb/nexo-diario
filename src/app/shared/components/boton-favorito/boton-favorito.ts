import { Component, computed, inject, input } from '@angular/core';

import { FavoritosService } from '../../../core/services/favoritos.service';

/** Corazón que agrega o quita una noticia de favoritos. */
@Component({
  selector: 'app-boton-favorito',
  template: `
    <button type="button" class="btn-favorito" (click)="favoritos.alternar(id())"
            [attr.aria-pressed]="esFavorita()" [attr.aria-label]="'Guardar en favoritos: ' + titulo()">
      <i class="bi" [class.bi-heart-fill]="esFavorita()" [class.bi-heart]="!esFavorita()" aria-hidden="true"></i>
    </button>
  `
})
export class BotonFavorito {
  protected readonly favoritos = inject(FavoritosService);

  readonly id = input.required<number>();
  readonly titulo = input.required<string>();

  protected readonly esFavorita = computed(() => this.favoritos.lista().includes(this.id()));
}
