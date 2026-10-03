import { Component, ElementRef, Injector, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MensajesService } from '../../core/services/mensajes.service';
import { validarCorreo, validarNombre, validarTexto } from '../../shared/validaciones';

type Campo = 'nombre' | 'correo' | 'asunto' | 'mensaje';

/**
 * Formulario de contacto validado con Reactive Forms.
 * Los errores se muestran al salir de un campo con contenido o al enviar,
 * y desde ese momento se actualizan mientras el usuario escribe.
 */
@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.html'
})
export class Contacto {
  private readonly mensajes = inject(MensajesService);
  private readonly injector = inject(Injector);
  private readonly elementoFormulario = viewChild<ElementRef<HTMLFormElement>>('elementoFormulario');
  private readonly panelExito = viewChild<ElementRef<HTMLElement>>('panelExito');

  protected readonly formulario = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: validarNombre }),
    correo: new FormControl('', { nonNullable: true, validators: validarCorreo }),
    asunto: new FormControl('', { nonNullable: true, validators: validarTexto('El asunto', 3, 100) }),
    mensaje: new FormControl('', { nonNullable: true, validators: validarTexto('El mensaje', 10, 1000) })
  });

  protected readonly datosContacto = [
    { icono: 'bi-envelope', etiqueta: 'Correo', valor: 'contacto@nexodiario.com' },
    { icono: 'bi-telephone', etiqueta: 'Teléfono', valor: '+57 601 234 5678' },
    { icono: 'bi-clock', etiqueta: 'Horario de atención', valor: 'Lun–Vie, 8:00 a. m. – 6:00 p. m.' }
  ];

  /** Campos cuyo estado (válido / inválido) ya se le mostró al usuario. */
  protected readonly marcados = signal<ReadonlySet<Campo>>(new Set());
  protected readonly enviado = signal(false);

  protected mostrarEstado(campo: Campo): boolean {
    return this.marcados().has(campo);
  }

  protected error(campo: Campo): string {
    return this.formulario.controls[campo].errors?.['mensaje'] ?? '';
  }

  /** Al salir de un campo con contenido se valida, sin molestar si está vacío. */
  protected alSalir(campo: Campo): void {
    if (this.formulario.controls[campo].value.trim()) this.marcar([campo]);
  }

  protected enviar(): void {
    const campos = Object.keys(this.formulario.controls) as Campo[];
    this.marcar(campos);

    const primerInvalido = campos.find(campo => this.formulario.controls[campo].invalid);
    if (primerInvalido) {
      this.elementoFormulario()?.nativeElement.querySelector<HTMLElement>(`#${primerInvalido}`)?.focus();
      return;
    }

    const valor = this.formulario.getRawValue();
    this.mensajes.guardar({
      nombre: valor.nombre.trim(),
      correo: valor.correo.trim().toLowerCase(),
      asunto: valor.asunto.trim(),
      mensaje: valor.mensaje.trim()
    });

    this.formulario.reset();
    this.marcados.set(new Set());
    this.enviado.set(true);
    afterNextRender(() => this.panelExito()?.nativeElement.focus(), { injector: this.injector });
  }

  protected nuevoMensaje(): void {
    this.enviado.set(false);
    afterNextRender(() => this.elementoFormulario()?.nativeElement.querySelector<HTMLElement>('#nombre')?.focus(), {
      injector: this.injector
    });
  }

  private marcar(campos: Campo[]): void {
    this.marcados.update(actuales => new Set([...actuales, ...campos]));
  }
}
