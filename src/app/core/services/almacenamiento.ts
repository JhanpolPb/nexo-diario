/**
 * Utilidades para leer y escribir JSON en localStorage sin romper la app
 * si el valor guardado está corrupto o el navegador bloquea el acceso.
 */

/** Claves usadas en localStorage, centralizadas para evitar errores de tipeo. */
export const CLAVES = {
  FAVORITOS: 'nexo_favoritos',
  MENSAJES: 'nexo_mensajes',
  NOTICIAS: 'nexo_noticias'
} as const;

export function leerJSON<T>(clave: string, porDefecto: T): T {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? (JSON.parse(valor) as T) : porDefecto;
  } catch (error) {
    console.warn(`No se pudo leer "${clave}":`, error);
    return porDefecto;
  }
}

export function guardarJSON(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.warn(`No se pudo guardar "${clave}":`, error);
  }
}
