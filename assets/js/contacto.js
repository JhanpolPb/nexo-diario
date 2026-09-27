/**
 * contacto.js
 * Valida el formulario de contacto y guarda el mensaje en localStorage.
 * Los errores se muestran al enviar y, a partir de ahí, se actualizan
 * mientras el usuario corrige cada campo.
 */

// Validador de cada campo del formulario (devuelve '' si es válido)
const REGLAS_CONTACTO = {
  nombre: validarNombre,
  correo: validarCorreo,
  asunto: valor => validarRequerido(valor, 'El asunto') || validarLongitud(valor, 3, 100, 'El asunto'),
  mensaje: valor => validarRequerido(valor, 'El mensaje') || validarLongitud(valor, 10, 1000, 'El mensaje')
};

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formulario-contacto');
  const exito = document.getElementById('contacto-exito');

  // Revalida en vivo solo los campos que ya se marcaron alguna vez
  formulario.addEventListener('input', evento => {
    const campo = evento.target;
    const regla = REGLAS_CONTACTO[campo.name];
    if (regla && campo.matches('.is-invalid, .is-valid')) {
      validarCampo(campo, regla);
    }
  });

  // Al salir de un campo con contenido se valida, sin molestar si está vacío
  formulario.addEventListener('focusout', evento => {
    const campo = evento.target;
    const regla = REGLAS_CONTACTO[campo.name];
    if (regla && campo.value.trim()) {
      validarCampo(campo, regla);
    }
  });

  formulario.addEventListener('submit', evento => {
    evento.preventDefault();

    const campos = Object.keys(REGLAS_CONTACTO).map(nombre => formulario.elements[nombre]);
    const resultados = campos.map(campo => validarCampo(campo, REGLAS_CONTACTO[campo.name]));
    const primerInvalido = campos[resultados.indexOf(false)];

    if (primerInvalido) {
      primerInvalido.focus();
      return;
    }

    Mensajes.guardar({
      nombre: formulario.nombre.value.trim(),
      correo: formulario.correo.value.trim().toLowerCase(),
      asunto: formulario.asunto.value.trim(),
      mensaje: formulario.mensaje.value.trim()
    });

    formulario.reset();
    limpiarValidacion(formulario);
    formulario.classList.add('d-none');
    exito.classList.remove('d-none');
    exito.focus();
  });

  document.getElementById('btn-nuevo-mensaje').addEventListener('click', () => {
    exito.classList.add('d-none');
    formulario.classList.remove('d-none');
    formulario.nombre.focus();
  });
});
