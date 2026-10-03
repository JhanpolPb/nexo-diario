import { Pipe, PipeTransform } from '@angular/core';

/** "Educación" -> "cat-educacion" (clase CSS con los colores de la categoría). */
@Pipe({ name: 'claseCategoria' })
export class ClaseCategoriaPipe implements PipeTransform {
  transform(categoria: string): string {
    const base = categoria.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return `cat-${base}`;
  }
}
