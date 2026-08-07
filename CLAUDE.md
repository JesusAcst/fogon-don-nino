# CLAUDE.md — El Fogón de Don Nino

## Rol y forma de trabajar

Sos un desarrollador web senior trabajando en el proyecto de El Fogón de Don Nino.
Trabajás sección por sección. No construyas más de una sección a la vez sin aprobación explícita.
Antes de escribir código, confirmá que entendiste el objetivo de la sección que vas a construir.
Si algo no está claro, preguntá antes de asumir.
No inventes información que el cliente no proporcionó. Usá placeholders claramente identificables con el formato: [PLACEHOLDER: descripción].
No agregues funciones, secciones ni elementos que no estén en la arquitectura aprobada.
Preferí siempre la solución más simple, elegante y profesional.

---

## Información del proyecto

**Cliente:** El Fogón de Don Nino — parrilla de barrio con 40 años de historia.
**Responsables:** Ricardo (dueño, hijo de Don Nino) y Facu (nieto, encargado digital).
**Tipo de web:** Landing page de una sola página (single page), con navegación por anclas.
**Problema principal a resolver:** El lugar existe hace 40 años pero no aparece en búsquedas digitales. La gente joven busca todo desde el celular y no los encuentra.

---

## Identidad de marca

- Auténtico, familiar, barrial. Tres generaciones: abuelo (Don Nino), hijo (Ricardo), nieto (Facu).
- Cálido, directo, sin pretensiones. "De fierro y madera, no de neón."
- 40 años en el mismo barrio. Orgullo de la historia y la continuidad.
- Tono: cercano, con carácter, apetitoso. Nunca frío ni corporativo.

---

## Identidad visual

**Paleta de colores:**
- Rojo brasa: `#8B2500`
- Naranja fuego: `#C4501A`
- Ámbar cálido: `#E8820C`
- Negro carbón: `#1A1A18`
- Madera oscura: `#3D2B1F`
- Crema cálida: `#F5ECD7`

**Tipografía:**
- Display / Títulos: Playfair Display (serif con carácter, transmite historia y tradición)
- Cuerpo: Lato (legible, cálida, sin ser genérica)
- Ambas disponibles en Google Fonts

**Estética general:**
- Cálida, apetitosa, con personalidad. Nada de blanco frío ni sans-serif genérica.
- Imágenes oscuras con overlay para que el texto respire sobre ellas.
- Fondos alternados: negro carbón y crema cálida entre secciones.
- Bordes y detalles en naranja fuego como acento.

---

## Arquitectura de la página (orden aprobado)

1. **Hero** — Identidad + llamado a la carta
2. **Carta / Menú** — Tabs por categoría, precios desde Google Sheet
3. **Cómo pedir** — Tres tarjetas con foto: Salón, Take Away, Delivery
4. **Nuestra Historia** — Texto + foto + 3 hitos visuales
5. **Reseñas** — Carrusel automático + link a Google
6. **Horarios y Ubicación** — Dos columnas: horarios + mapa
7. **Reservas** — WhatsApp con mensaje preescrito
8. **Footer** — Logo + navegación + horarios resumidos + Instagram

---

## Decisiones técnicas clave

**Precios del menú:**
La carta carga los precios en tiempo real desde un Google Sheet público.
El diseño visual de la carta vive en el código. Los datos (nombre, descripción, precio) vienen del Sheet vía fetch a la URL pública de exportación CSV.
Formato de la URL: `https://docs.google.com/spreadsheets/d/[ID]/export?format=csv&gid=[GID]`
Usar [PLACEHOLDER: URL del Google Sheet] hasta que el cliente lo provea.

**Carta — estructura de columnas esperada en el Sheet:**
`categoria | nombre | descripcion | precio`

**Reservas:**
Botón de WhatsApp que abre un mensaje preescrito.
Formato: `https://wa.me/[NUMERO]?text=Hola%2C%20quiero%20reservar%20una%20mesa%20para%20[X%20personas]%20el%20[d%C3%ADa].`
Usar [PLACEHOLDER: número de WhatsApp] hasta que el cliente lo confirme.

**Reseñas:**
Carrusel automático con reseñas manuales (no API).
Debe incluir: nombre del cliente, cantidad de estrellas (1–5), texto de la reseña.
Al final del carrusel: link a Google Maps / Google Business del local.
Usar [PLACEHOLDER: link de Google Business] y reseñas de ejemplo claramente marcadas.

**Mapa:**
Embed de Google Maps con la ubicación del local.
Usar [PLACEHOLDER: dirección exacta y link embed de Google Maps].

**Badge de horario en Hero:**
Muestra dinámicamente si el local está abierto o cerrado según el día y la hora actual del usuario.
Horario base: martes a domingo, mediodía (12:00–15:30) y noche (20:00–24:00). Lunes cerrado.
Usar [PLACEHOLDER: horarios exactos] hasta que el cliente los confirme.

**Instagram:**
Link al perfil de Instagram del Fogón.
Usar [PLACEHOLDER: usuario de Instagram].

---

## Información pendiente de confirmar con el cliente

Estos datos no fueron proporcionados en el brief. Usar placeholders hasta confirmarlos:

- [ ] Dirección exacta del local
- [ ] Número de WhatsApp para reservas
- [ ] Horario exacto del mediodía (ej: 12:00–15:30)
- [ ] Horario exacto de la noche (ej: 20:00–24:00)
- [ ] Usuario de Instagram
- [ ] Link de Google Business para reseñas
- [ ] URL del Google Sheet con la carta
- [ ] Fotos reales: salón, take away, delivery, familia/historia
- [ ] Logo del local (si existe)
- [ ] Reseñas reales para el carrusel (mínimo 4–5)

---

## Prioridades de desarrollo

1. **Mobile-first obligatorio.** El público objetivo busca desde el celular. Toda sección debe verse y funcionar perfectamente en 375px de ancho antes de pensar en desktop.
2. **Rendimiento.** Imágenes optimizadas, carga rápida. El cliente está en un barrio, la conexión puede ser variable.
3. **Sin dependencias innecesarias.** HTML, CSS y JavaScript vanilla siempre que sea posible. Solo agregar librerías cuando aporten valor real (ej: carrusel).
4. **Accesibilidad básica.** Contraste suficiente, textos alternativos en imágenes, botones con labels claros.
5. **Un solo archivo HTML** como entregable principal, con CSS y JS embebidos o en archivos separados en la misma carpeta.

---

## Animaciones y microinteracciones

Las animaciones tienen personalidad — se notan y refuerzan la identidad del lugar. No son decorativas ni genéricas. Todas deben respetar `prefers-reduced-motion`.

**Elemento signature — Partículas de brasa en el Hero:**
- Canvas de partículas superpuesto al Hero, z-index sobre la imagen y bajo el contenido.
- ~55 partículas en colores `#E8820C` y `#C4501A`, tamaño entre 0.4px y 2.6px de radio.
- Suben lentamente (velocidad 0.3–1.0), con drift lateral suave (±0.3px por frame).
- Cada partícula parpadea individualmente con `Math.sin()` sobre su opacidad — efecto orgánico, no robótico.
- Se reinician al salir por arriba, en posición X aleatoria.
- Implementar con `<canvas>` y `requestAnimationFrame`. Sin librerías externas.

**Scroll-triggered — Entrada de secciones:**
- Cada sección y sus elementos internos aparecen al entrar al viewport.
- Efecto: `opacity 0 → 1` + `translateY(30px) → translateY(0)`.
- Duración: 600ms. Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- Usar `IntersectionObserver` con `threshold: 0.15`.
- Los elementos dentro de una sección se animan en cascada con `delay` incremental de 100ms entre cada uno.
- Clase base: `.reveal` (invisible por defecto). Clase activa: `.reveal.visible` (animado).

**Microinteracciones — Hover en botones:**
- Botón principal: `background` cambia + `transform: scale(1.03)` + transición 200ms.
- Botón WhatsApp: leve `box-shadow` verde + `scale(1.03)`.
- Links de navegación: subrayado deslizante desde la izquierda (pseudo-elemento `::after`).

**Microinteracciones — Hover en tarjetas:**
- Tarjetas de "Cómo pedir": `transform: translateY(-6px)` + sombra cálida `rgba(196, 80, 26, 0.25)`.
- Tabs del menú: fondo fill suave al hover, transición 150ms.
- Reseñas del carrusel: leve escala `1.02` al estar activa.

**Navbar al scroll:**
- Al bajar más de 60px: la navbar reduce su `padding` vertical y aumenta levemente su opacidad de fondo.
- Transición: 300ms ease.

**Flecha "Descubrir" en el Hero:**
- Animación keyframe: `translateY(0) → translateY(8px) → translateY(0)`.
- Duración: 2s, `ease-in-out`, `infinite`.

---

## Lo que NO debe aparecer en la web

- Precios fijos hardcodeados en el HTML (van desde el Sheet)
- Nombre de la app de delivery (el cliente no lo confirmó)
- Información inventada sobre el local (dirección, teléfono, horarios exactos)
- Estética fría, moderna tipo hamburguesería, neón, blanco puro dominante
- Tipografías genéricas sin carácter (ej: solo Arial, Roboto o Open Sans)
- Secciones que el cliente no pidió (blog, galería completa, formulario de contacto)
