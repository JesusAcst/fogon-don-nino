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

## Paleta de colores

| Nombre | Hex | Uso |
|---|---|---|
| Negro carbón | `#1A1A18` | Fondo de todas las secciones |
| Naranja fuego | `#C4501A` | Acentos, CTAs, badge destacado |
| Ámbar | `#E8820C` | Labels, iconos, stats |
| Crema | `#F5ECD7` | Texto principal |

## Ver el sitio localmente

No requiere instalación ni build:

```bash
git clone https://github.com/JesusAcst/fogon-don-nino.git
cd fogon-don-nino
```

Abrí con Live Server o cualquier servidor local.
No abrir con `file://` — el fetch a Google Sheets
requiere HTTP.

```bash
# con Node instalado
npx serve .
```

## Ver en producción

🔗 [fogon-don-nino-nine.vercel.app](https://fogon-don-nino-nine.vercel.app)

## Cómo actualizar la carta

El dueño puede actualizar precios sin tocar código:

1. Abrí el Google Sheet de la carta
2. Editá el precio en la columna `precio`
3. Guardá — la web se actualiza en la próxima
   carga de cualquier usuario

## Pendientes antes del lanzamiento real

- [ ] Número de WhatsApp real del restaurante
- [ ] Número de teléfono real
- [ ] Dirección exacta y embed de Maps actualizado
- [ ] Usuario de Instagram real
- [ ] Link a Google Business real
- [ ] Nombre de la app de delivery
- [ ] Fotos reales del local y la familia
- [ ] Logo oficial del restaurante
- [ ] Reseñas reales de clientes

## Licencia

Proyecto privado para El Fogón de Don Nino. Todos los derechos reservados.

---

<div align="center">
Proyecto académico — desarrollado con metodología
de proceso profesional por etapas.<br>
Análisis → Arquitectura → Construcción
→ Revisión → Refinamiento → Deploy
</div>
