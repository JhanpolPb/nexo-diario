import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';

/** Botones para compartir una noticia en redes o copiar su enlace. */
@Component({
  selector: 'app-compartir',
  templateUrl: './compartir.html'
})
export class Compartir {
  readonly titulo = input.required<string>();
  /** Dirección completa que se comparte. */
  readonly url = input.required<string>();

  /** Mensaje temporal después de copiar el enlace. */
  protected readonly aviso = signal('');
  /** El menú nativo para compartir solo existe en algunos navegadores (sobre todo en móviles). */
  protected readonly compartirNativo = typeof navigator.share === 'function';

  protected readonly redes = computed(() => {
    const url = encodeURIComponent(this.url());
    const texto = encodeURIComponent(this.titulo());
    return [
      { nombre: 'WhatsApp', icono: 'bi-whatsapp', clase: 'whatsapp', enlace: `https://wa.me/?text=${texto}%20${url}` },
      { nombre: 'X', icono: 'bi-twitter-x', clase: 'x', enlace: `https://twitter.com/intent/tweet?text=${texto}&url=${url}` },
      { nombre: 'Facebook', icono: 'bi-facebook', clase: 'facebook', enlace: `https://www.facebook.com/sharer/sharer.php?u=${url}` }
    ];
  });

  private temporizador?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.temporizador));
  }

  async copiarEnlace(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.url());
      this.mostrarAviso('¡Enlace copiado!');
    } catch {
      this.mostrarAviso('No se pudo copiar el enlace');
    }
  }

  async compartir(): Promise<void> {
    try {
      await navigator.share({ title: this.titulo(), url: this.url() });
    } catch {
      // El usuario cerró el menú de compartir: no es un error
    }
  }

  private mostrarAviso(texto: string): void {
    this.aviso.set(texto);
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.aviso.set(''), 2500);
  }
}
