import { Pipe, PipeTransform } from '@angular/core';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "2026-09-12" -> "12 sep 2026" */
@Pipe({ name: 'fechaCorta' })
export class FechaCortaPipe implements PipeTransform {
  transform(fechaISO: string): string {
    if (!fechaISO) return '';
    const [anio, mes, dia] = fechaISO.split('-').map(Number);
    return `${dia} ${MESES[mes - 1]} ${anio}`;
  }
}
