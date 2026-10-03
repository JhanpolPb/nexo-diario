import { Component, ElementRef, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Encabezado } from './shared/components/encabezado/encabezado';
import { Pie } from './shared/components/pie/pie';

/** Estructura común de todas las páginas: encabezado, contenido y pie. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Encabezado, Pie],
  templateUrl: './app.html'
})
export class App {
  private readonly contenido = viewChild.required<ElementRef<HTMLElement>>('contenido');

  /** Enlace "Saltar al contenido" para quienes navegan con teclado. */
  saltarAlContenido(evento: Event): void {
    evento.preventDefault();
    this.contenido().nativeElement.focus();
  }
}
