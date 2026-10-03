import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MENU } from '../../menu';

/** Pie de página con navegación, redes sociales y datos de contacto. */
@Component({
  selector: 'app-pie',
  imports: [RouterLink],
  templateUrl: './pie.html'
})
export class Pie {
  protected readonly menu = MENU;
  protected readonly anio = new Date().getFullYear();

  protected readonly redes = [
    { nombre: 'X', icono: 'bi-twitter-x' },
    { nombre: 'Facebook', icono: 'bi-facebook' },
    { nombre: 'LinkedIn', icono: 'bi-linkedin' },
    { nombre: 'YouTube', icono: 'bi-youtube' }
  ];
}
