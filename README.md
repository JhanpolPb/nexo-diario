# Nexo Diario

Periódico digital con noticias de **Tecnología, Educación, Turismo y Comercio**.
Permite explorar noticias, filtrarlas por categoría, leer el detalle, guardarlas
como favoritas y enviar un mensaje de contacto.

## Tecnologías

- HTML5, CSS3 y JavaScript (sin frameworks ni proceso de compilación)
- [Bootstrap 5.3](https://getbootstrap.com/) y Bootstrap Icons (desde CDN)
- Tipografías Inter y Poppins (Google Fonts)
- `localStorage` para favoritos y mensajes de contacto

## Cómo ejecutarlo

Las noticias se cargan con `fetch()` desde `data/noticias.json`, por lo que
**el sitio debe abrirse desde un servidor local**. Si se abre el HTML con doble
clic (`file://`), el navegador bloquea la carga y aparece un aviso.

Cualquiera de estas opciones sirve:

- **VS Code:** extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
- **Node.js:** `npx serve .` y abrir la URL que muestra la consola.
- **Python:** `python -m http.server 5500` y abrir http://localhost:5500

También puede publicarse tal cual en GitHub Pages.

## Páginas

| Archivo | Pantalla | Qué hace |
|---|---|---|
| `index.html` | Inicio | Bienvenida, 3 noticias destacadas, accesos por categoría y llamado a contacto |
| `noticias.html` | Listado | Cuadrícula de noticias con filtros por categoría (`?categoria=Turismo`) |
| `detalle.html` | Detalle | Noticia completa según `?id=N`, con botón de favoritos |
| `favoritos.html` | Favoritos | Noticias guardadas y estado vacío cuando no hay ninguna |
| `contacto.html` | Contacto | Formulario validado, mensaje de éxito y panel de información |

## Estructura

```
nexo-diario/
├── index.html, noticias.html, detalle.html, favoritos.html, contacto.html
├── data/
│   └── noticias.json       # categorías y noticias
└── assets/
    ├── css/estilos.css     # identidad visual sobre Bootstrap
    ├── img/                # imágenes de noticias, categorías y portada
    └── js/
        ├── data.js         # carga y consulta de noticias.json
        ├── storage.js      # acceso a localStorage / sessionStorage
        ├── validaciones.js # validadores de formularios
        ├── componentes.js  # encabezado, pie, tarjeta de noticia y favoritos
        └── inicio.js, noticias.js, detalle.js, favoritos.js, contacto.js
```

Cada página indica su sección con `<body data-pagina="...">`; `componentes.js`
inserta el encabezado y el pie en `#encabezado` y `#pie` y resalta el enlace activo.

## Agregar una noticia

Añade un objeto al arreglo `noticias` de `data/noticias.json`:

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

## Créditos

Fotografías de [Unsplash](https://unsplash.com/), usadas en la maqueta original.
Las noticias son contenido de ejemplo para fines académicos.


## Autor
Dev. Jhanpol Parra Barreto
