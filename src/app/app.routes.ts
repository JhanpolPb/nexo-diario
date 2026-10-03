import { Routes } from '@angular/router';

import { Admin } from './pages/admin/admin';
import { AdminFormulario } from './pages/admin-formulario/admin-formulario';
import { Contacto } from './pages/contacto/contacto';
import { Detalle } from './pages/detalle/detalle';
import { Favoritos } from './pages/favoritos/favoritos';
import { Inicio } from './pages/inicio/inicio';
import { NoEncontrada } from './pages/no-encontrada/no-encontrada';
import { Noticias } from './pages/noticias/noticias';

/** Rutas de la aplicación: cada una corresponde a una pantalla de la maqueta. */
export const routes: Routes = [
  { path: '', component: Inicio, title: 'Nexo Diario | Inicio' },
  { path: 'noticias', component: Noticias, title: 'Nexo Diario | Noticias' },
  { path: 'noticia/:id', component: Detalle, title: 'Nexo Diario | Noticia' },
  { path: 'favoritos', component: Favoritos, title: 'Nexo Diario | Mis favoritos' },
  { path: 'contacto', component: Contacto, title: 'Nexo Diario | Contacto' },
  { path: 'admin', component: Admin, title: 'Nexo Diario | Administración' },
  { path: 'admin/nueva', component: AdminFormulario, title: 'Nexo Diario | Nueva noticia' },
  { path: 'admin/editar/:id', component: AdminFormulario, title: 'Nexo Diario | Editar noticia' },
  { path: '**', component: NoEncontrada, title: 'Nexo Diario | Página no encontrada' }
];
