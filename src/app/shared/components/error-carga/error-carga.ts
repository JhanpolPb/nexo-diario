import { Component } from '@angular/core';

/** Aviso que se muestra si no se pudo cargar el archivo de noticias. */
@Component({
  selector: 'app-error-carga',
  template: `
    <div class="alert alert-warning" role="alert">
      <strong>No pudimos cargar las noticias.</strong>
      Revisa tu conexión e intenta recargar la página.
    </div>
  `
})
export class ErrorCarga {}
