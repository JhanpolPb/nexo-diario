import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FavoritosService } from '../../../core/services/favoritos.service';
import { MENU } from '../../menu';

/** Barra de navegación superior con el contador de favoritos. */
@Component({
  selector: 'app-encabezado',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './encabezado.html'
})
export class Encabezado {
  protected readonly favoritos = inject(FavoritosService);
  protected readonly menu = MENU;

  /** Controla el menú desplegable en pantallas pequeñas. */
  protected readonly menuAbierto = signal(false);

  alternarMenu(): void {
    this.menuAbierto.update(abierto => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}
