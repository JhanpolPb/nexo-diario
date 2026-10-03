import { Injectable, computed, signal } from '@angular/core';

import { CLAVES, guardarJSON, leerJSON } from './almacenamiento';

/**
 * Guarda los IDs de las noticias favoritas en localStorage.
 * Al ser un signal, el contador del encabezado, los corazones de las tarjetas
 * y la página de favoritos se actualizan solos cuando cambia la lista.
 */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly ids = signal<number[]>(leerJSON<number[]>(CLAVES.FAVORITOS, []));

  readonly lista = this.ids.asReadonly();
  readonly total = computed(() => this.ids().length);

  constructor() {
    // Mantiene sincronizadas otras pestañas abiertas del sitio
    window.addEventListener('storage', evento => {
      if (evento.key === CLAVES.FAVORITOS) {
        this.ids.set(leerJSON<number[]>(CLAVES.FAVORITOS, []));
      }
    });
  }

  esFavorito(id: number): boolean {
    return this.ids().includes(id);
  }

  /** Agrega o quita una noticia. Devuelve true si quedó como favorita. */
  alternar(id: number): boolean {
    const agregar = !this.esFavorito(id);
    this.ids.update(ids => (agregar ? [...ids, id] : ids.filter(actual => actual !== id)));
    guardarJSON(CLAVES.FAVORITOS, this.ids());
    return agregar;
  }
}
