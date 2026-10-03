/**
 * Modelos de datos de Nexo Diario.
 * Reflejan la estructura del archivo public/data/noticias.json.
 */

export interface Categoria {
  nombre: string;
  clase: string;
  imagen: string;
}

export interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  /** Párrafos separados por una línea en blanco (\n\n). */
  contenido: string;
  categoria: string;
  autor: string;
  /** Fecha en formato ISO: AAAA-MM-DD. */
  fecha: string;
  imagen: string;
  destacada: boolean;
  lecturaMin: number;
}

/** Contenido completo del archivo JSON. */
export interface DatosNoticias {
  categorias: Categoria[];
  noticias: Noticia[];
}

/** Mensaje enviado desde el formulario de contacto. */
export interface MensajeContacto {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}
