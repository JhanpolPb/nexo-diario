import { Injectable } from '@angular/core';

import { MensajeContacto } from '../models/noticia.model';
import { CLAVES, guardarJSON, leerJSON } from './almacenamiento';

/** Guarda los mensajes del formulario de contacto (no hay servidor). */
@Injectable({ providedIn: 'root' })
export class MensajesService {
  guardar(mensaje: MensajeContacto): void {
    const lista = leerJSON<unknown[]>(CLAVES.MENSAJES, []);
    lista.push({ ...mensaje, fecha: new Date().toISOString() });
    guardarJSON(CLAVES.MENSAJES, lista);
  }
}
