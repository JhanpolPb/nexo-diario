/**
 * storage.js
 * Capa de acceso a localStorage y sessionStorage.
 *  - localStorage  -> datos persistentes: favoritos, usuarios registrados, suscriptores.
 *  - sessionStorage -> sesión activa del usuario (se borra al cerrar el navegador).
 *
 * Nota: al ser un prototipo sin servidor, los usuarios se guardan en el navegador.
 * En un entorno real las contraseñas NUNCA deben almacenarse en el cliente.
 */

// Claves usadas en el almacenamiento, centralizadas para evitar errores de tipeo
const CLAVES = {
  FAVORITOS: 'nexo_favoritos',
  USUARIOS: 'nexo_usuarios',
  SUSCRIPTORES: 'nexo_suscriptores',
  MENSAJES: 'nexo_mensajes',
  SESION: 'nexo_sesion'
};

/** Lee y convierte un valor JSON; devuelve `porDefecto` si no existe o está corrupto. */
function leerJSON(almacen, clave, porDefecto) {
  try {
    const valor = almacen.getItem(clave);
    return valor ? JSON.parse(valor) : porDefecto;
  } catch (error) {
    console.warn(`No se pudo leer "${clave}":`, error);
    return porDefecto;
  }
}

/** Convierte un valor a JSON y lo guarda. */
function guardarJSON(almacen, clave, valor) {
  almacen.setItem(clave, JSON.stringify(valor));
}

/* ---------------------------- Favoritos ---------------------------- */
const Favoritos = {
  /** Devuelve el arreglo de IDs de noticias marcadas como favoritas. */
  obtener() {
    return leerJSON(localStorage, CLAVES.FAVORITOS, []);
  },

  esFavorito(id) {
    return this.obtener().includes(id);
  },

  /** Agrega o quita una noticia de favoritos. Devuelve true si quedó como favorita. */
  alternar(id) {
    const favoritos = this.obtener();
    const indice = favoritos.indexOf(id);
    if (indice === -1) {
      favoritos.push(id);
    } else {
      favoritos.splice(indice, 1);
    }
    guardarJSON(localStorage, CLAVES.FAVORITOS, favoritos);
    // Evento personalizado para que el encabezado actualice el contador
    document.dispatchEvent(new CustomEvent('favoritos:cambio'));
    return indice === -1;
  },

  limpiar() {
    guardarJSON(localStorage, CLAVES.FAVORITOS, []);
    document.dispatchEvent(new CustomEvent('favoritos:cambio'));
  }
};

/* ----------------------------- Usuarios ---------------------------- */
const Usuarios = {
  obtener() {
    return leerJSON(localStorage, CLAVES.USUARIOS, []);
  },

  buscarPorCorreo(correo) {
    return this.obtener().find(u => u.correo === correo.toLowerCase());
  },

  registrar({ nombre, correo, clave }) {
    const usuarios = this.obtener();
    usuarios.push({ nombre, correo: correo.toLowerCase(), clave, creado: new Date().toISOString() });
    guardarJSON(localStorage, CLAVES.USUARIOS, usuarios);
  }
};

/* ------------------------------ Sesión ----------------------------- */
const Sesion = {
  /** Devuelve el usuario con sesión activa o null. */
  actual() {
    return leerJSON(sessionStorage, CLAVES.SESION, null);
  },

  iniciar(usuario) {
    guardarJSON(sessionStorage, CLAVES.SESION, { nombre: usuario.nombre, correo: usuario.correo });
  },

  cerrar() {
    sessionStorage.removeItem(CLAVES.SESION);
  }
};

/* --------------------- Suscriptores y mensajes --------------------- */
const Suscriptores = {
  existe(correo) {
    return leerJSON(localStorage, CLAVES.SUSCRIPTORES, []).includes(correo.toLowerCase());
  },

  agregar(correo) {
    const lista = leerJSON(localStorage, CLAVES.SUSCRIPTORES, []);
    lista.push(correo.toLowerCase());
    guardarJSON(localStorage, CLAVES.SUSCRIPTORES, lista);
  }
};

const Mensajes = {
  guardar(mensaje) {
    const lista = leerJSON(localStorage, CLAVES.MENSAJES, []);
    lista.push({ ...mensaje, fecha: new Date().toISOString() });
    guardarJSON(localStorage, CLAVES.MENSAJES, lista);
  }
};
