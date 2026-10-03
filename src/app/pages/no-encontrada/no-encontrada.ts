import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Se muestra cuando la ruta no existe. */
@Component({
  selector: 'app-no-encontrada',
  imports: [RouterLink],
  template: `
    <div class="container pagina">
      <div class="estado-vacio">
        <div class="estado-vacio-icono"><i class="bi bi-signpost-split" aria-hidden="true"></i></div>
        <h1>Página no encontrada</h1>
        <p>La dirección que buscas no existe o fue movida.</p>
        <a class="btn btn-nexo" routerLink="/">Volver al inicio</a>
      </div>
    </div>
  `
})
export class NoEncontrada {}
