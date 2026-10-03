import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Categoria, DatosNoticias, Noticia, NoticiaNueva } from '../models/noticia.model';
import { CLAVES, guardarJSON, leerJSON } from './almacenamiento';
import { FavoritosService } from './favoritos.service';

type EstadoCarga = 'cargando' | 'listo' | 'error';

/**
 * Carga las noticias desde public/data/noticias.json una sola vez
 * y las comparte con todas las páginas mediante signals.
 *
 * Desde el panel de administración se pueden crear, editar y eliminar noticias.
 * Esos cambios se guardan en localStorage y tienen prioridad sobre el JSON
 * hasta que se restablezcan las noticias originales.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);
  private readonly favoritos = inject(FavoritosService);
  private readonly lista = signal<Noticia[]>([]);
  private readonly listaCategorias = signal<Categoria[]>([]);
  private originales: Noticia[] = [];

  readonly estado = signal<EstadoCarga>('cargando');

  /** true si las noticias vienen de cambios hechos en el panel de administración. */
  readonly modificadas = signal(leerJSON<Noticia[] | null>(CLAVES.NOTICIAS, null) !== null);

  /** Noticias ordenadas de la más reciente a la más antigua. */
  readonly noticias = computed<Noticia[]>(() =>
    [...this.lista()].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id)
  );

  readonly categorias = this.listaCategorias.asReadonly();

  /** Las 3 destacadas más recientes, para la página de inicio. */
  readonly destacadas = computed(() => this.noticias().filter(n => n.destacada).slice(0, 3));

  constructor() {
    this.http.get<DatosNoticias>('data/noticias.json').subscribe({
      next: datos => {
        this.originales = datos.noticias;
        this.listaCategorias.set(datos.categorias);
        this.lista.set(leerJSON<Noticia[] | null>(CLAVES.NOTICIAS, null) ?? datos.noticias);
        this.estado.set('listo');
      },
      error: error => {
        console.error('No se pudo cargar noticias.json', error);
        this.estado.set('error');
      }
    });
  }

  buscarPorId(id: number): Noticia | undefined {
    return this.lista().find(n => n.id === id);
  }

  contarPorCategoria(categoria: string): number {
    return this.lista().filter(n => n.categoria === categoria).length;
  }

  /**
   * Hasta `cantidad` noticias para leer después de `noticia`: primero las de su
   * misma categoría y, si no alcanzan, las más recientes de las demás.
   */
  relacionadas(noticia: Noticia, cantidad = 3): Noticia[] {
    const otras = this.noticias().filter(n => n.id !== noticia.id);
    const misma = otras.filter(n => n.categoria === noticia.categoria);
    const resto = otras.filter(n => n.categoria !== noticia.categoria);
    return [...misma, ...resto].slice(0, cantidad);
  }

  /* ----------------------- Administración (CRUD) ----------------------- */

  crear(datos: NoticiaNueva): Noticia {
    const id = Math.max(0, ...this.lista().map(n => n.id)) + 1;
    const noticia: Noticia = { ...datos, id };
    this.guardar([...this.lista(), noticia]);
    return noticia;
  }

  actualizar(id: number, datos: NoticiaNueva): void {
    this.guardar(this.lista().map(n => (n.id === id ? { ...datos, id } : n)));
  }

  eliminar(id: number): void {
    this.guardar(this.lista().filter(n => n.id !== id));
    this.favoritos.quitar(id);
  }

  /** Descarta los cambios del panel y vuelve a las noticias del JSON. */
  restablecer(): void {
    localStorage.removeItem(CLAVES.NOTICIAS);
    this.lista.set(this.originales);
    this.modificadas.set(false);
  }

  private guardar(noticias: Noticia[]): void {
    this.lista.set(noticias);
    guardarJSON(CLAVES.NOTICIAS, noticias);
    this.modificadas.set(true);
  }
}
