import { Component, ElementRef, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Noticia, NoticiaNueva } from '../../core/models/noticia.model';
import { AvisosService } from '../../core/services/avisos.service';
import { NoticiasService } from '../../core/services/noticias.service';
import { TarjetaNoticia } from '../../shared/components/tarjeta-noticia/tarjeta-noticia';
import { validarRequerido, validarTexto } from '../../shared/validaciones';

type Campo = 'titulo' | 'resumen' | 'contenido' | 'categoria' | 'autor' | 'fecha' | 'imagen' | 'destacada';

/** Palabras por minuto que se usan para estimar el tiempo de lectura. */
const PALABRAS_POR_MINUTO = 200;

/** Fecha de hoy en formato AAAA-MM-DD según la hora local. */
function hoy(): string {
  return new Date().toLocaleDateString('en-CA');
}

/**
 * Formulario para crear (/admin/nueva) o editar (/admin/editar/:id) una noticia.
 * Muestra una vista previa de la tarjeta que se actualiza mientras se escribe.
 */
@Component({
  selector: 'app-admin-formulario',
  imports: [ReactiveFormsModule, RouterLink, TarjetaNoticia],
  templateUrl: './admin-formulario.html'
})
export class AdminFormulario {
  protected readonly servicio = inject(NoticiasService);
  private readonly router = inject(Router);
  private readonly avisos = inject(AvisosService);
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Parámetro :id de la ruta; no existe al crear una noticia nueva. */
  readonly id = input<string>();

  protected readonly formulario = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: validarTexto('El título', 10, 120) }),
    resumen: new FormControl('', { nonNullable: true, validators: validarTexto('El resumen', 20, 250) }),
    contenido: new FormControl('', { nonNullable: true, validators: validarTexto('El contenido', 100, 10000) }),
    categoria: new FormControl('', { nonNullable: true, validators: validarRequerido('Selecciona una categoría.') }),
    autor: new FormControl('', { nonNullable: true, validators: validarTexto('El nombre del autor', 3, 60) }),
    fecha: new FormControl(hoy(), { nonNullable: true, validators: validarRequerido('Indica la fecha de publicación.') }),
    imagen: new FormControl('', { nonNullable: true, validators: validarRequerido('Elige o escribe la dirección de una imagen.') }),
    destacada: new FormControl(false, { nonNullable: true })
  });

  /** Valores del formulario como signal, para la vista previa y el tiempo de lectura. */
  private readonly valores = toSignal(this.formulario.valueChanges, { initialValue: this.formulario.getRawValue() });

  protected readonly editando = computed(() => this.id() !== undefined);

  /** Noticia que se edita; null si no existe (id inválido). */
  protected readonly original = computed<Noticia | null | undefined>(() => {
    if (!this.editando()) return undefined;
    return this.servicio.buscarPorId(Number(this.id())) ?? null;
  });

  protected readonly lecturaMin = computed(() => {
    const palabras = (this.valores().contenido ?? '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(palabras / PALABRAS_POR_MINUTO));
  });

  /** Imágenes disponibles en el proyecto, para elegir con un clic. */
  protected readonly galeria = computed(() => [
    ...new Set([...this.servicio.noticias().map(n => n.imagen), ...this.servicio.categorias().map(c => c.imagen)])
  ]);

  protected readonly vistaPrevia = computed<Noticia>(() => {
    const v = this.valores();
    return {
      id: 0,
      titulo: v.titulo?.trim() || 'Título de la noticia',
      resumen: v.resumen?.trim() || 'Aquí aparecerá el resumen que se muestra en la tarjeta.',
      contenido: '',
      categoria: v.categoria || 'Categoría',
      autor: v.autor ?? '',
      fecha: v.fecha ?? '',
      imagen: v.imagen?.trim() || 'assets/img/hero.jpg',
      destacada: v.destacada ?? false,
      lecturaMin: this.lecturaMin()
    };
  });

  protected readonly intentoGuardar = signal(false);

  constructor() {
    // Al editar, llena el formulario cuando la noticia esté disponible
    effect(() => {
      const noticia = this.original();
      if (noticia) {
        const { id, lecturaMin, ...datos } = noticia;
        this.formulario.setValue(datos);
      }
    });
  }

  protected mostrarError(campo: Campo): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || this.intentoGuardar());
  }

  protected error(campo: Campo): string {
    return this.formulario.controls[campo].errors?.['mensaje'] ?? '';
  }

  protected elegirImagen(ruta: string): void {
    this.formulario.controls.imagen.setValue(ruta);
    this.formulario.controls.imagen.markAsTouched();
  }

  protected guardar(): void {
    this.intentoGuardar.set(true);
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      const primerInvalido = Object.keys(this.formulario.controls).find(
        campo => this.formulario.controls[campo as Campo].invalid
      );
      this.elemento.nativeElement.querySelector<HTMLElement>(`#noticia-${primerInvalido}`)?.focus();
      return;
    }

    const v = this.formulario.getRawValue();
    const datos: NoticiaNueva = {
      titulo: v.titulo.trim(),
      resumen: v.resumen.trim(),
      // Normaliza saltos de línea y deja exactamente una línea en blanco entre párrafos
      contenido: v.contenido.replace(/\r\n/g, '\n').trim().split(/\n\s*\n/).map(p => p.trim()).join('\n\n'),
      categoria: v.categoria,
      autor: v.autor.trim(),
      fecha: v.fecha,
      imagen: v.imagen.trim(),
      destacada: v.destacada,
      lecturaMin: this.lecturaMin()
    };

    const original = this.original();
    if (original) {
      this.servicio.actualizar(original.id, datos);
      this.avisos.dejar(`Se guardaron los cambios de “${datos.titulo}”.`);
    } else {
      this.servicio.crear(datos);
      this.avisos.dejar(`Se publicó la noticia “${datos.titulo}”.`);
    }
    this.router.navigate(['/admin']);
  }
}
