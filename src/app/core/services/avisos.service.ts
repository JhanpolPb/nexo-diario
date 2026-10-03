import { Injectable } from '@angular/core';

/**
 * Pasa un mensaje de una pantalla a otra (por ejemplo, "Noticia publicada"
 * del formulario al panel). El mensaje se entrega una sola vez, así que no
 * reaparece al recargar la página.
 */
@Injectable({ providedIn: 'root' })
export class AvisosService {
  private pendiente = '';

  dejar(mensaje: string): void {
    this.pendiente = mensaje;
  }

  /** Devuelve el mensaje pendiente y lo borra. */
  tomar(): string {
    const mensaje = this.pendiente;
    this.pendiente = '';
    return mensaje;
  }
}
