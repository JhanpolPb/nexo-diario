# Nexo Diario

Periódico digital con noticias de **Tecnología, Educación, Turismo y Comercio**.
Permite explorar y buscar noticias, filtrarlas por categoría, leer el detalle,
compartirlas, guardarlas como favoritas, enviar un mensaje de contacto y
administrar el contenido desde un panel.

**Sitio publicado:** https://jhanpolpb.github.io/nexo-diario/

## Tecnologías

- [Angular 21](https://angular.dev/): componentes *standalone*, signals, router y Reactive Forms
- TypeScript, HTML5 y CSS3
- [Bootstrap 5.3](https://getbootstrap.com/) y Bootstrap Icons (desde CDN)
- Tipografías Inter y Poppins (Google Fonts)
- `localStorage` para favoritos y mensajes de contacto
- GitHub Actions + GitHub Pages para el despliegue

## Cómo ejecutarlo

Requisitos: Node.js 20.19 o superior.

```bash
npm install
npm start          # servidor de desarrollo en http://localhost:4200
npm run build      # compilación de producción en dist/nexo-diario/browser
```

## Despliegue

Cada `push` a `main` ejecuta `.github/workflows/deploy.yml`, que compila con
`npm run build:pages` (usa `--base-href /nexo-diario/`) y publica el resultado en
GitHub Pages. El flujo copia `index.html` como `404.html` para que las rutas de
Angular (por ejemplo `/noticia/3`) funcionen al recargar la página.

## Pantallas (rutas)

| Ruta | Componente | Qué hace |
|---|---|---|
| `/` | `Inicio` | Bienvenida, 3 noticias destacadas, accesos por categoría y llamado a contacto |
| `/noticias` | `Noticias` | Buscador y cuadrícula de noticias con filtros por categoría (`?categoria=Turismo`) |
| `/noticia/:id` | `Detalle` | Noticia completa, favoritos, botones para compartir y noticias relacionadas |
| `/favoritos` | `Favoritos` | Noticias guardadas y estado vacío cuando no hay ninguna |
| `/contacto` | `Contacto` | Formulario validado, mensaje de éxito y panel de información |
| `/admin` | `Admin` | Panel con resumen y tabla de noticias: editar, eliminar y restablecer |
| `/admin/nueva`, `/admin/editar/:id` | `AdminFormulario` | Formulario validado con vista previa en vivo de la tarjeta |
| `**` | `NoEncontrada` | Página 404 |

## Funciones destacadas

- **Buscador:** filtra mientras se escribe por título, resumen, contenido, autor o categoría,
  sin importar tildes ni mayúsculas, y se combina con el filtro de categoría.
- **Compartir:** WhatsApp, X, Facebook, copiar enlace y el menú nativo del teléfono.
- **Noticias relacionadas:** al final del detalle, primero las de la misma categoría.
- **Panel de administración (CRUD):** crear, editar y eliminar noticias con validaciones,
  galería de imágenes y vista previa. Los cambios se guardan en `localStorage` y se pueden
  descartar con *Restablecer noticias originales*. Al no haber servidor, solo afectan a ese
  navegador.

## Estructura

```
src/
├── index.html                 # carga Bootstrap, iconos y fuentes
├── main.ts                    # arranque de la aplicación
├── styles.css                 # identidad visual sobre Bootstrap
└── app/
    ├── app.ts / app.html      # estructura común: encabezado, <router-outlet>, pie
    ├── app.routes.ts          # rutas
    ├── app.config.ts          # router, HttpClient
    ├── core/
    │   ├── models/            # interfaces Noticia, Categoria, MensajeContacto
    │   └── services/          # NoticiasService, FavoritosService, MensajesService, AvisosService
    ├── shared/
    │   ├── components/        # Encabezado, Pie, TarjetaNoticia, BotonFavorito, Compartir, ErrorCarga
    │   ├── pipes/             # fechaCorta, claseCategoria
    │   ├── menu.ts            # enlaces del menú
    │   ├── texto.ts           # normalizar() para búsquedas sin tildes
    │   └── validaciones.ts    # validadores de los formularios
    └── pages/                 # Inicio, Noticias, Detalle, Favoritos, Contacto, Admin, AdminFormulario, NoEncontrada
public/
├── data/noticias.json         # categorías y noticias
└── assets/img/                # imágenes de noticias, categorías y portada
```

### Conceptos de Angular usados

- **Componentes:** cada pantalla y cada pieza reutilizable es un componente *standalone*.
- **Interpolación:** `{{ noticia.titulo }}`, `{{ n.fecha | fechaCorta }}`.
- **Property binding:** `[noticia]="noticia"`, `[src]="n.imagen"`, `[class.show]="menuAbierto()"`.
- **Event binding:** `(click)="favoritos.alternar(id())"`, `(ngSubmit)="enviar()"`.
- **Two-way binding:** el buscador usa `[(ngModel)]="busqueda"` enlazado a un signal.
- **Inputs:** `TarjetaNoticia` recibe la noticia con `input.required<Noticia>()`; el router
  entrega `:id` y `?categoria=` como inputs (`withComponentInputBinding`).
- **Control de flujo:** `@if`, `@for`, `@empty`, `@let`.
- **Servicios e inyección de dependencias:** `inject(NoticiasService)`.
- **Signals:** el estado de favoritos se comparte con `signal` y `computed`, así el contador
  del encabezado, los corazones y la página de favoritos se actualizan solos.
- **Reactive Forms:** los formularios de contacto y de administración usan `FormGroup` y
  validadores propios.

## Agregar una noticia

Añade un objeto al arreglo `noticias` de `public/data/noticias.json`:

```json
{
  "id": 9,
  "titulo": "Título de la noticia",
  "resumen": "Una o dos frases para la tarjeta.",
  "contenido": "Primer párrafo.\n\nSegundo párrafo.",
  "categoria": "Tecnología",
  "autor": "Nombre del autor",
  "fecha": "2026-09-27",
  "imagen": "assets/img/noticias/noticia-9.jpg",
  "destacada": false,
  "lecturaMin": 3
}
```

- `categoria` debe coincidir con un `nombre` del arreglo `categorias`.
- Las destacadas del inicio son las 3 más recientes con `"destacada": true`.
- Los párrafos del contenido se separan con `\n\n`.

## Versión anterior

La primera versión (HTML, CSS y JavaScript sin frameworks) está guardada en la
etiqueta [`v1-html`](https://github.com/JhanpolPb/nexo-diario/tree/v1-html).

## Créditos

Fotografías de [Unsplash](https://unsplash.com/), usadas en la maqueta original.
Las noticias son contenido de ejemplo para fines académicos.

## Autor

Dev. Jhanpol Parra Barreto
