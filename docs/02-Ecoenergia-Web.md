# EcoEnergía Local S.L. — Web Corporativa

**Proyecto Final de Grado Medio en Sistemas Microinformáticos y Redes**  
Alumno: Jose Vargas Salazar | Curso: 2025/2026


---

## Estructura de archivos

```
ecoenergía-web/
│
├── servicios.html        ← Página de servicios y precios (inicio)
├── calculadora.html      ← Calculadora de ahorro solar
├── portfolio.html        ← Portfolio de proyectos realizados
├── contacto.html         ← Formulario de contacto
│
├── css/
│   ├── style.css         ← Reset, tokens, navbar, footer, utilidades
│   ├── servicios.css     ← Estilos exclusivos de servicios.html
│   ├── calculadora.css   ← Estilos exclusivos de calculadora.html
│   ├── portfolio.css     ← Estilos exclusivos de portfolio.html
│   └── contacto.css      ← Estilos exclusivos de contacto.html
│
└── js/
    ├── nav.js            ← Menú hamburguesa + sombra al scroll (shared)
    ├── calculadora.js    ← Fórmulas de ahorro + barras + animaciones
    ├── portfolio.js      ← Sistema de filtrado de proyectos
    └── contacto.js       ← Validación de formulario + fetch a PHP

```

---

## Tecnologías

| Tecnología    | Versión | Uso                                          |
|---------------|---------|----------------------------------------------|
| Stitch        | —       | Estructura basica sobre el diseño de la web. |
| Gemini        | —       | Creacionnd imagenes para la web.             |
| HTML5         | —       | Estructura semántica de las 4 páginas        |
| CSS3          | —       | Design system, animaciones, responsive       |
| JavaScript    | ES6+    | Calculadora, filtros, validación, fetch      |

---

## Design System — "Luminous Stewardship" (Stitch)

| Token CSS        | Valor      | Uso                              |
|------------------|------------|----------------------------------|
| `--primary`      | `#006c49`  | Color corporativo, botones       |
| `--secondary`    | `#795900`  | Dorado, barra de progreso ROI    |
| `--sec-cont`     | `#ffc329`  | CTA dorado, botón "Presupuesto"  |
| `--surface`      | `#f7f9fb`  | Fondo principal                  |
| `--surf-low`     | `#f2f4f6`  | Secciones alternas               |
| `--surf-white`   | `#ffffff`  | Cards y elementos flotantes      |
| `--on-surface`   | `#191c1e`  | Texto (no negro puro)            |
| `--outline-var`  | `#bbcabf`  | Ghost borders (al 20–30% opac.)  |

**Reglas clave:**
- Sin bordes 1px sólidos (tonal shifts)
- Ghost borders en inputs: `outline` al 30% → 100% en foco
- Ambient shadows: blur 40px, color al 6%
- Glassmorphism navbar: 90% opacidad + `backdrop-filter: blur(20px)`
- Sunlight Progress Bar: track `#ffdf9f` + progress `#795900` con glow

---

## Grid Responsive (mobile-first)

| Componente       | Móvil  | Tablet  | Desktop |
|------------------|--------|---------|---------|
| Pricing cards    | 1 col  | 2 col   | 3 col   |
| Portfolio        | 1 col  | 2 col   | 3 col*  |
| Servicios extra  | 1 col  | 2 col   | 3 col   |
| Calculadora      | 1 col  | 1 col   | 5+7 fr  |
| Contacto         | 1 col  | 1 col   | 7+5 fr  |
| Footer           | 1 col  | 2 col   | 2+1+1+1 |

*El proyecto destacado ocupa 2 columnas en desktop.

---

## Control de versiones con Git

```bash
# Inicializar repositorio
cd ecoenergía-web
git init
git add .
git commit -m "v1.0 — Web corporativa EcoEnergía Local"

# Subir a GitHub
git remote add origin https://github.com/usuario/ecoenergía-web
git push -u origin main

# Workflow de desarrollo
git add -A
git commit -m "fix: mejora responsive móvil"
git push
```

---

*Jose Vargas Salazar · IES Tierrablanca SMR · 2025/2026*
