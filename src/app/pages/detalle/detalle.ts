import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { FavoritosService } from '../../core/services/favoritos.service';
import { NoticiasService } from '../../core/services/noticias.service';
import { Compartir } from '../../shared/components/compartir/compartir';
import { ErrorCarga } from '../../shared/components/error-carga/error-carga';
import { TarjetaNoticia } from '../../shared/components/tarjeta-noticia/tarjeta-noticia';
import { ClaseCategoriaPipe } from '../../shared/pipes/clase-categoria.pipe';
import { FechaCortaPipe } from '../../shared/pipes/fecha-corta.pipe';

/** Muestra una noticia completa a partir de la ruta /noticia/:id. */
@Component({
  selector: 'app-detalle',
  imports: [RouterLink, Compartir, ErrorCarga, TarjetaNoticia, ClaseCategoriaPipe, FechaCortaPipe],
  templateUrl: './detalle.html'
})
export class Detalle {
  protected readonly servicio = inject(NoticiasService);
  protected readonly favoritos = inject(FavoritosService);
  private readonly titulo = inject(Title);

  /** Parámetro :id de la ruta (lo enlaza el router automáticamente). */
  readonly id = input.required<string>();

  protected readonly noticia = computed(() => this.servicio.buscarPorId(Number(this.id())));

  /** Dirección pública de la noticia, para compartirla. */
  protected readonly enlace = computed(() => new URL(`noticia/${this.id()}`, document.baseURI).href);

  protected readonly relacionadas = computed(() => {
    const noticia = this.noticia();
    return noticia ? this.servicio.relacionadas(noticia) : [];
  });

  protected readonly parrafos = computed(() => this.noticia()?.contenido.split('\n\n') ?? []);

  protected readonly esFavorita = computed(() => {
    const noticia = this.noticia();
    return noticia ? this.favoritos.lista().includes(noticia.id) : false;
  });

  constructor() {
    // Pone el título de la noticia en la pestaña del navegador
    effect(() => {
      const noticia = this.noticia();
      if (noticia) this.titulo.setTitle(`${noticia.titulo} | Nexo Diario`);
    });
  }
}
