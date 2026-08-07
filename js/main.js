// ==========================================================================
// El Fogón de Don Nino — main.js
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initNavbarToggle();
  initStatusBadge();
  initEmberParticles();
  initRevealObserver();
  initHeroBackgroundFallback();
  initCartaTabs();
  cargarCarta();
  iniciarCarrusel();
});

// --------------------------------------------------------------------------
// Hero: si ninguna imagen externa carga, usar gradiente cálido de respaldo
// --------------------------------------------------------------------------

function initHeroBackgroundFallback() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const HERO_IMAGES = [
    'https://images.pexels.com/photos/3997609/pexels-photo-3997609.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ];

  let loaded = false;
  let remaining = HERO_IMAGES.length;

  HERO_IMAGES.forEach((src) => {
    const img = new Image();
    img.onload = () => {
      loaded = true;
    };
    img.onerror = () => {
      remaining -= 1;
      if (remaining === 0 && !loaded) {
        hero.classList.add('img-fallback');
      }
    };
    img.src = src;
  });
}

// --------------------------------------------------------------------------
// Navbar: reduce tamaño al hacer scroll
// --------------------------------------------------------------------------

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --------------------------------------------------------------------------
// Navbar: menú hamburguesa (mobile)
// --------------------------------------------------------------------------

function initNavbarToggle() {
  const toggle = document.getElementById('navbar-toggle');
  const nav = document.getElementById('navbar-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// --------------------------------------------------------------------------
// Badge de estado: abierto / cerrado según día y hora
// --------------------------------------------------------------------------

// Horario base: martes(2) a domingo(0). Lunes(1) cerrado.
// Dos grupos: martes a viernes, y sábado/domingo (con otro horario).
const HORARIOS = {
  semana: { // martes a viernes
    mediodia: { desde: 12 * 60, hasta: 15 * 60 + 30 }, // 12:00–15:30
    noche: { desde: 20 * 60, hasta: 23 * 60 + 30 },    // 20:00–23:30
  },
  finde: { // sábado y domingo
    mediodia: { desde: 12 * 60, hasta: 16 * 60 },      // 12:00–16:00
    noche: { desde: 20 * 60, hasta: 24 * 60 + 30 },    // 20:00–00:30 (cruza medianoche)
  },
};

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIA_CERRADO = 1; // lunes
const DIAS_FINDE = [0, 6]; // domingo, sábado

function horarioDelDia(dia) {
  return DIAS_FINDE.includes(dia) ? HORARIOS.finde : HORARIOS.semana;
}

function minutosDelDia(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function estaAbierto(date) {
  const dia = date.getDay();
  const minutos = minutosDelDia(date);

  if (dia !== DIA_CERRADO) {
    const horario = horarioDelDia(dia);
    const dentroDeMediodia = minutos >= horario.mediodia.desde && minutos < horario.mediodia.hasta;
    const dentroDeNoche = minutos >= horario.noche.desde && minutos < Math.min(horario.noche.hasta, 24 * 60);
    if (dentroDeMediodia || dentroDeNoche) return true;
  }

  // La noche del finde cruza medianoche (ej: sábado 20:00–00:30):
  // temprano a la mañana siguiente sigue "abierto" por ese cierre tardío.
  const diaAnterior = (dia + 6) % 7;
  if (diaAnterior !== DIA_CERRADO) {
    const horarioAnterior = horarioDelDia(diaAnterior);
    if (horarioAnterior.noche.hasta > 24 * 60 && minutos < horarioAnterior.noche.hasta - 24 * 60) {
      return true;
    }
  }

  return false;
}

function formatearHora(minutos) {
  const h = Math.floor(minutos / 60) % 24;
  const m = minutos % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function proximaApertura(date) {
  for (let i = 0; i < 8; i++) {
    const dia = (date.getDay() + i) % 7;
    if (dia === DIA_CERRADO) continue;

    const horario = horarioDelDia(dia);
    const minutosActuales = i === 0 ? minutosDelDia(date) : -1;

    if (minutosActuales < horario.mediodia.desde) {
      return { dia, hora: horario.mediodia.desde, esHoy: i === 0 };
    }
    if (minutosActuales < horario.noche.desde) {
      return { dia, hora: horario.noche.desde, esHoy: i === 0 };
    }
  }
  return null;
}

function initStatusBadge() {
  const badge = document.getElementById('status-badge');
  const text = document.getElementById('status-text');
  if (!badge || !text) return;

  const ahora = new Date();

  if (estaAbierto(ahora)) {
    text.textContent = 'Abierto ahora';
    text.classList.add('status-open');
    badge.classList.remove('is-closed');
    return;
  }

  const proxima = proximaApertura(ahora);
  text.classList.remove('status-open');
  badge.classList.add('is-closed');

  if (!proxima) {
    text.textContent = 'Horario no disponible';
    return;
  }

  const diaTexto = proxima.esHoy ? 'hoy' : DIAS[proxima.dia];
  text.textContent = `Abrimos ${diaTexto} a las ${formatearHora(proxima.hora)}`;
}

// --------------------------------------------------------------------------
// Partículas de brasa (elemento signature del Hero)
// --------------------------------------------------------------------------

function initEmberParticles() {
  const canvas = document.getElementById('ember-canvas');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  const COLORS = ['#E8820C', '#C4501A'];
  const PARTICLE_COUNT = 55;
  let particles = [];
  let width = 0;
  let height = 0;

  function resize() {
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function createParticle(resetToBottom) {
    return {
      x: randomBetween(0, width),
      y: resetToBottom ? height + randomBetween(0, 20) : randomBetween(0, height),
      r: randomBetween(0.4, 2.6),
      speed: randomBetween(0.3, 1.0),
      drift: randomBetween(-0.3, 0.3),
      flicker: randomBetween(0, Math.PI * 2),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(false));
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.y -= p.speed;
      p.x += p.drift;
      p.flicker += 0.05;

      const opacity = (Math.sin(p.flicker) + 1) / 2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = opacity;
      ctx.fill();

      if (p.y < -10) {
        Object.assign(p, createParticle(true));
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  resize();
  initParticles();
  window.addEventListener('resize', resize);
  requestAnimationFrame(tick);
}

// --------------------------------------------------------------------------
// Scroll-triggered reveal (preparado para secciones futuras)
// --------------------------------------------------------------------------

let revealObserver = null;

function initRevealObserver() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('section').forEach((section) => {
    observeRevealItems(section.querySelectorAll('.reveal'));
  });
}

// Aplica delay en cascada y registra un grupo de elementos .reveal en el
// observer. Se usa tanto en la carga inicial como al insertar contenido
// dinámico (ej: platos de la carta cargados desde el Sheet).
function observeRevealItems(items) {
  if (!revealObserver) return;
  items.forEach((item, index) => {
    item.style.transitionDelay = `${index * 60}ms`;
    revealObserver.observe(item);
  });
}

// --------------------------------------------------------------------------
// Carta / Menú: tabs de categorías
// --------------------------------------------------------------------------

function initCartaTabs() {
  const tabs = document.querySelectorAll('.tab-btn');

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
}

// --------------------------------------------------------------------------
// Carta / Menú: carga de platos y precios desde Google Sheet
// --------------------------------------------------------------------------

const CARTA_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSgE1vD7o6amo1T90LsZY6PwhEzjIpRgQ8NoD4AFTBPt16BxdAMBj6MowKHxIsJTDY4Anu_ZnMSHJEe/pub?gid=0&single=true&output=csv';

// Datos de respaldo mientras el Sheet no esté disponible.
const CARTA_FALLBACK = [
  { categoria: 'parrilla', nombre: 'Asado de tira', descripcion: 'Corte clásico a las brasas', precio: '$X.XXX' },
  { categoria: 'parrilla', nombre: 'Vacío', descripcion: 'Jugoso y tierno, cocción lenta', precio: '$X.XXX' },
  { categoria: 'parrilla', nombre: 'Chorizo', descripcion: 'Casero, de la parrilla al plato', precio: '$X.XXX' },
  { categoria: 'parrilla', nombre: 'Morcilla', descripcion: 'Tradicional, bien sazonada', precio: '$X.XXX' },
  { categoria: 'parrilla', nombre: 'Provoleta', descripcion: 'Con orégano y aceite de oliva', precio: '$X.XXX' },
  { categoria: 'milanesas', nombre: 'Milanesa napolitana', descripcion: 'Con jamón, mozzarella y salsa', precio: '$X.XXX' },
  { categoria: 'milanesas', nombre: 'Milanesa a caballo', descripcion: 'Con dos huevos fritos', precio: '$X.XXX' },
  { categoria: 'pastas', nombre: 'Fideos caseros al tuco', descripcion: 'Masa fresca, salsa de la casa', precio: '$X.XXX' },
  { categoria: 'pastas', nombre: 'Ñoquis', descripcion: 'Con salsa a elección', precio: '$X.XXX' },
  { categoria: 'ensaladas', nombre: 'Ensalada mixta', descripcion: 'Lechuga, tomate, zanahoria', precio: '$X.XXX' },
  { categoria: 'ensaladas', nombre: 'Ensalada del chef', descripcion: 'Con ingredientes de estación', precio: '$X.XXX' },
  { categoria: 'postres', nombre: 'Flan casero', descripcion: 'El orgullo de la casa, con dulce de leche', precio: '$X.XXX', destacado: true },
  { categoria: 'postres', nombre: 'Ensalada de frutas', descripcion: 'Fresca y natural', precio: '$X.XXX' },
];

async function cargarCarta() {
  const loading = document.getElementById('carta-loading');
  const error = document.getElementById('carta-error');
  if (!loading || !error) return;

  if (CARTA_SHEET_URL.includes('PLACEHOLDER')) {
    renderizarCarta(CARTA_FALLBACK);
    loading.style.display = 'none';
    return;
  }

  try {
    const response = await fetch(CARTA_SHEET_URL);
    const text = await response.text();
    const platos = parsearCSV(text);
    renderizarCarta(platos.length ? platos : CARTA_FALLBACK);
    loading.style.display = 'none';
  } catch (e) {
    renderizarCarta(CARTA_FALLBACK);
    loading.style.display = 'none';
  }
}

// Parsea una línea CSV respetando campos entre comillas (Google Sheets
// envuelve en comillas los valores que contienen comas).
function parsearLineaCSV(linea) {
  const valores = [];
  let actual = '';
  let entreComillas = false;

  for (let i = 0; i < linea.length; i++) {
    const char = linea[i];

    if (char === '"') {
      if (entreComillas && linea[i + 1] === '"') {
        actual += '"';
        i++;
      } else {
        entreComillas = !entreComillas;
      }
    } else if (char === ',' && !entreComillas) {
      valores.push(actual);
      actual = '';
    } else {
      actual += char;
    }
  }
  valores.push(actual);
  return valores;
}

// El Sheet trae el precio como número plano (ej: 4800). Lo convierte a
// formato de pesos argentinos con puntos de miles (ej: $4.800).
function formatearPrecio(valor) {
  const texto = valor?.trim() ?? '';
  const numero = Number(texto.replace(/[^\d.-]/g, ''));
  if (!texto || Number.isNaN(numero)) return texto;
  return `$${numero.toLocaleString('es-AR')}`;
}

function parsearCSV(text) {
  const lineas = text.trim().split('\n').slice(1); // saltar header
  return lineas.map((linea) => {
    const [categoria, nombre, descripcion, precio] = parsearLineaCSV(linea);
    return {
      categoria: categoria?.trim().toLowerCase(),
      nombre: nombre?.trim(),
      descripcion: descripcion?.trim(),
      precio: formatearPrecio(precio),
    };
  });
}

function renderizarCarta(platos) {
  const categorias = ['parrilla', 'milanesas', 'pastas', 'ensaladas', 'postres'];

  categorias.forEach((cat) => {
    const grid = document.getElementById(`platos-${cat}`);
    if (!grid) return;

    const platosCat = platos.filter((p) => p.categoria === cat);
    grid.innerHTML = platosCat
      .map(
        (p) => `
      <div class="plato-card-wrapper${p.destacado ? ' plato-wrapper--destacado' : ''}">
        ${p.destacado ? '<span class="plato-badge">Orgullo de la casa</span>' : ''}
        <div class="plato-card reveal${p.destacado ? ' plato-card--destacado' : ''}">
          <p class="plato-nombre">${p.nombre}</p>
          <p class="plato-descripcion">${p.descripcion}</p>
          <span class="plato-precio">${p.precio}</span>
        </div>
      </div>
    `
      )
      .join('');

    observeRevealItems(grid.querySelectorAll('.reveal'));
  });
}

// --------------------------------------------------------------------------
// Reseñas: carrusel automático
// --------------------------------------------------------------------------

function iniciarCarrusel() {
  const wrapper = document.querySelector('.carrusel-wrapper');
  const track = document.getElementById('carruselTrack');
  const prevBtn = document.getElementById('carruselPrev');
  const nextBtn = document.getElementById('carruselNext');
  if (!wrapper || !track) return;

  const cards = track.querySelectorAll('.resena-card');
  if (!cards.length) return;

  cards[0].classList.add('activa');

  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let indice = 0;
  let intervalo;

  // Desplaza el track al índice pedido, sin pasarse del contenido real
  // (evita el espacio vacío que quedaba al llegar a la última card).
  function irA(nuevoIndice) {
    indice = (nuevoIndice + cards.length) % cards.length;
    const cardWidth = cards[0].getBoundingClientRect().width + 24; // 24px = gap del track
    const maxScroll = Math.max(0, track.scrollWidth - wrapper.clientWidth);
    const desplazamiento = Math.min(indice * cardWidth, maxScroll);
    track.style.transform = `translateX(-${desplazamiento}px)`;
    cards.forEach((c, i) => c.classList.toggle('activa', i === indice));
  }

  function siguiente() {
    irA(indice + 1);
  }

  function anterior() {
    irA(indice - 1);
  }

  function iniciarAutoplay() {
    if (prefiereMenosMovimiento) return;
    intervalo = setInterval(siguiente, 3500);
  }

  function detenerAutoplay() {
    clearInterval(intervalo);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      anterior();
      detenerAutoplay();
      iniciarAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      siguiente();
      detenerAutoplay();
      iniciarAutoplay();
    });
  }

  wrapper.addEventListener('mouseenter', detenerAutoplay);
  wrapper.addEventListener('mouseleave', iniciarAutoplay);

  iniciarAutoplay();
}
