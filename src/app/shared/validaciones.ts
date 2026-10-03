import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores para formularios reactivos.
 * Cada uno devuelve null si el valor es válido, o { mensaje: '...' } con el
 * texto que se muestra debajo del campo.
 */

const EXPRESIONES = {
  correo: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
  nombre: /^[a-záéíóúüñ\s]{3,50}$/i
};

function error(mensaje: string): ValidationErrors {
  return { mensaje };
}

function texto(control: AbstractControl): string {
  return String(control.value ?? '').trim();
}

export function validarNombre(control: AbstractControl): ValidationErrors | null {
  const valor = texto(control);
  if (!valor) return error('El nombre es obligatorio.');
  if (!EXPRESIONES.nombre.test(valor)) return error('Use solo letras (entre 3 y 50 caracteres).');
  return null;
}

export function validarCorreo(control: AbstractControl): ValidationErrors | null {
  const valor = texto(control);
  if (!valor) return error('El correo es obligatorio.');
  if (!EXPRESIONES.correo.test(valor)) return error('Ingrese un correo válido, por ejemplo usuario@correo.com.');
  return null;
}

/** Campo obligatorio sin otras reglas (listas, fechas, imágenes). */
export function validarRequerido(mensaje: string): ValidatorFn {
  return control => (texto(control) ? null : error(mensaje));
}

/** Campo obligatorio con longitud mínima y máxima. */
export function validarTexto(etiqueta: string, min: number, max: number): ValidatorFn {
  return control => {
    const largo = texto(control).length;
    if (largo === 0) return error(`${etiqueta} es obligatorio.`);
    if (largo < min) return error(`${etiqueta} debe tener al menos ${min} caracteres.`);
    if (largo > max) return error(`${etiqueta} no puede superar ${max} caracteres.`);
    return null;
  };
}
