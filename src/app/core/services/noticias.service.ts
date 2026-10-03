import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Categoria, DatosNoticias, Noticia } from '../models/noticia.model';

type EstadoCarga = 'cargando' | 'listo' | 'error';

/**
 * Carga las noticias desde public/data/noticias.json una sola vez
 * y las comparte con todas las páginas mediante signals.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);
  private readonly datos = signal<DatosNoticias | null>(null);

  readonly estado = signal<EstadoCarga>('cargando');

  /** Noticias ordenadas de la más reciente a la más antigua. */
  readonly noticias = computed<Noticia[]>(() =>
    [...(this.datos()?.noticias ?? [])].sort((a, b) => b.fecha.localeCompare(a.fecha))
  );

  readonly categorias = computed<Categoria[]>(() => this.datos()?.categorias ?? []);

  /** Las 3 destacadas más recientes, para la página de inicio. */
  readonly destacadas = computed(() => this.noticias().filter(n => n.destacada).slice(0, 3));

  constructor() {
    this.http.get<DatosNoticias>('data/noticias.json').subscribe({
      next: datos => {
        this.datos.set(datos);
        this.estado.set('listo');
      },
      error: error => {
        console.error('No se pudo cargar noticias.json', error);
        this.estado.set('error');
      }
    });
  }

  buscarPorId(id: number): Noticia | undefined {
    return this.noticias().find(n => n.id === id);
  }

  contarPorCategoria(categoria: string): number {
    return this.noticias().filter(n => n.categoria === categoria).length;
  }
}
