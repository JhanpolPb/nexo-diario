/** "Educación Rural" -> "educacion rural": sin tildes y en minúsculas, para comparar textos. */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
