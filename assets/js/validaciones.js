/**
 * validaciones.js
 * Funciones reutilizables para validar formularios y mostrar los errores
 * con las clases de Bootstrap (is-invalid / is-valid / invalid-feedback).
 */

const EXPRESIONES = {
  correo: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
  nombre: /^[a-záéíóúüñ\s]{3,50}$/i,
  // Mínimo 8 caracteres, al menos una letra y un número
  clave: /^(?=.*[a-z])(?=.*\d).{8,}$/i
};

/**
 * Marca un campo como válido o inválido y escribe el mensaje de error
 * en el elemento .invalid-feedback que lo acompaña.
 * @returns {boolean} el mismo valor de `esValido`, para encadenar validaciones.
 */
function marcarCampo(campo, esValido, mensaje = '') {
  campo.classList.toggle('is-invalid', !esValido);
  campo.classList.toggle('is-valid', esValido);
  campo.setAttribute('aria-invalid', String(!esValido));

  const feedback = campo.parentElement.querySelector('.invalid-feedback');
  if (feedback) feedback.textContent = mensaje;
  return esValido;
}

/** Quita las marcas de validación de todos los campos de un formulario. */
function limpiarValidacion(formulario) {
  formulario.querySelectorAll('.is-valid, .is-invalid').forEach(campo => {
    campo.classList.remove('is-valid', 'is-invalid');
    campo.removeAttribute('aria-invalid');
  });
}

/* ---------- Validadores: cada uno devuelve '' si es válido o el mensaje de error ---------- */

function validarRequerido(valor, etiqueta) {
  return valor.trim() ? '' : `${etiqueta} es obligatorio.`;
}

function validarNombre(valor) {
  if (!valor.trim()) return 'El nombre es obligatorio.';
  if (!EXPRESIONES.nombre.test(valor.trim())) return 'Use solo letras (entre 3 y 50 caracteres).';
  return '';
}

function validarCorreo(valor) {
  if (!valor.trim()) return 'El correo es obligatorio.';
  if (!EXPRESIONES.correo.test(valor.trim())) return 'Ingrese un correo válido, por ejemplo usuario@correo.com.';
  return '';
}

function validarClave(valor) {
  if (!valor) return 'La contraseña es obligatoria.';
  if (!EXPRESIONES.clave.test(valor)) return 'Mínimo 8 caracteres, con al menos una letra y un número.';
  return '';
}

function validarLongitud(valor, min, max, etiqueta) {
  const largo = valor.trim().length;
  if (largo < min) return `${etiqueta} debe tener al menos ${min} caracteres.`;
  if (largo > max) return `${etiqueta} no puede superar ${max} caracteres.`;
  return '';
}

/**
 * Aplica un validador a un campo y lo marca.
 * @param {HTMLElement} campo
 * @param {(valor:string)=>string} validador
 */
function validarCampo(campo, validador) {
  const error = validador(campo.value);
  return marcarCampo(campo, error === '', error);
}
