# El Fogón de Don Nino 🔥

Landing page de una sola página para **El Fogón de Don Nino**, parrilla de barrio con 40 años de historia. Sitio estático (HTML, CSS y JS vanilla, sin frameworks ni build step) pensado mobile-first, con la carta de precios cargada en tiempo real desde un Google Sheet.

## Sobre el proyecto

El local existe hace 40 años pero no aparecía en búsquedas digitales — el público joven busca todo desde el celular y no lo encontraba. Este sitio resuelve eso: una landing cálida y con carácter (nada de blanco frío ni estética genérica), con navegación por anclas, que muestra la carta, cómo pedir, la historia del lugar, reseñas, horarios/ubicación y reservas por WhatsApp.

## Stack

- **HTML5 + CSS3 + JavaScript vanilla** — sin dependencias, sin build step.
- **Google Sheets como CMS de precios** — la carta se carga vía `fetch` al CSV público del Sheet, con fallback local si el fetch falla o no hay datos.
- **Google Fonts** — Playfair Display (títulos) + Lato (cuerpo).
- **Canvas API** — partículas de brasa animadas en el Hero (`requestAnimationFrame`, sin librerías).
- **IntersectionObserver** — animaciones de entrada al hacer scroll (`.reveal`), con soporte de `prefers-reduced-motion`.

## Estructura

```
/
├── index.html          # Markup único, single-page con anclas
├── css/
│   └── styles.css       # Estilos, mobile-first con breakpoints
├── js/
│   └── main.js           # Carrusel, tabs, fetch a Sheets, badge de horario, animaciones
├── img/                   # Assets locales (vacío por ahora — imágenes vía URL externa)
├── vercel.json            # Config de deploy estático en Vercel
└── favicon.svg
```

## Secciones

1. **Hero** — identidad + badge de "abierto/cerrado" dinámico según horario real
2. **Carta** — tabs por categoría, precios en vivo desde Google Sheets
3. **Cómo pedir** — salón, take away y delivery
4. **Nuestra historia** — tres generaciones, tres hitos
5. **Reseñas** — carrusel con navegación manual
6. **Horarios y ubicación** — mapa embebido de Google Maps
7. **Reservas** — botón directo a WhatsApp con mensaje preescrito
8. **Footer**

## Cómo correrlo local

No requiere instalación. Cualquier servidor estático simple sirve:

```bash
python -m http.server 8000
# o
npx serve .
```

Y abrir `http://localhost:8000`.

> ⚠️ Abrir `index.html` directo con `file://` puede romper el `fetch()` al Google Sheet en algunos navegadores — serví el sitio por HTTP para probarlo como en producción.

## Deploy

Configurado para deploy estático en [Vercel](https://vercel.com) vía `vercel.json` — sin build step, sirve `index.html` y sus assets directamente.

## Carta dinámica

Los precios se cargan desde un Google Sheet publicado como CSV (`categoria,nombre,descripcion,precio`). Si el fetch falla o el Sheet no devuelve filas, el sitio cae automáticamente a una carta de respaldo embebida en `main.js` para que la sección nunca quede vacía.

## Licencia

Proyecto privado para El Fogón de Don Nino. Todos los derechos reservados.
