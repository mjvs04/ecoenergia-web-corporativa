/* =============================================================
   calculadora.js
   Lógica completa de la calculadora de ahorro solar.
   Fórmulas basadas en datos reales de irradiación y precios.
   ============================================================= */

(function () {
  'use strict';

  /* ── Elementos del DOM ──────────────────────────────────── */
  const facturaInput = document.getElementById('factura');
  const calcBtn      = document.getElementById('calcBtn');
  const orientBtns   = document.querySelectorAll('.calc-orient__btn');

  // Resultados
  const rAhorro    = document.getElementById('r-ahorro');
  const rRetorno   = document.getElementById('r-retorno');
  const rPotencia  = document.getElementById('r-potencia');
  const rInversion = document.getElementById('r-inversion');
  const rCo2       = document.getElementById('r-co2');
  const roiFill    = document.getElementById('roiFill');
  const roiPct     = document.getElementById('roiPct');
  const roiPctLabel = document.getElementById('roiPctLabel');
  const calcBars   = document.getElementById('calcBars');

  let orientacionActual = 'sur';  // Estado actual de orientación

  /* ── Inicializar barras placeholder ──────────────────────── */
  inicializarBarras([0.15, 0.28, 0.44, 0.60, 0.72, 0.80, 0.87, 0.93, 0.97, 1]);

  /* ── Botones de orientación ──────────────────────────────── */
  orientBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      orientBtns.forEach(function (b) {
        b.classList.remove('calc-orient__btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('calc-orient__btn--active');
      btn.setAttribute('aria-pressed', 'true');
      orientacionActual = btn.getAttribute('data-orient');
    });
  });

  /* ── Calcular al pulsar el botón ─────────────────────────── */
  if (calcBtn) {
    calcBtn.addEventListener('click', calcular);
  }

  /* ── Calcular también al pulsar Enter en el input ─────────  */
  if (facturaInput) {
    facturaInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') calcular();
    });
  }

  /* ── FUNCIÓN PRINCIPAL ───────────────────────────────────── */
  function calcular() {
    const factura = parseFloat(facturaInput ? facturaInput.value : 0);

    /* Validación */
    if (!factura || factura < 10) {
      facturaInput.style.borderBottomColor = '#ba1a1a';
      facturaInput.focus();
      setTimeout(function () {
        facturaInput.style.borderBottomColor = '';
      }, 2000);
      return;
    }

    /*
     * FÓRMULAS:
     *  factor   = multiplicador de horas pico solares por orientación
     *  kwhMes   = consumo mensual estimado en kWh (precio medio 0,28 €/kWh)
     *  potencia = kWp necesarios para cubrir el consumo anual
     *             Fórmula: (kWhAnuales) ÷ (1400 h/año × factor)
     *  ahorroAnual = 72% del gasto anual (ahorro medio residencial)
     *  inversion   = ~1200 €/kWp, redondeado a centenas
     *  retorno     = inversión ÷ ahorro anual (payback en años)
     *  co2         = 0,25 kg CO₂/kWh × producción anual → toneladas
     */
    const factor      = orientacionActual === 'sur' ? 1.35 : 1.10;
    const kwhMes      = factura / 0.28;
    const kwhAnual    = kwhMes * 12;
    const potencia    = Math.ceil((kwhAnual / (1400 * factor)) * 10) / 10;
    const ahorroAnual = Math.round(factura * 12 * 0.72);
    const inversion   = Math.round(potencia * 1200 / 100) * 100;
    const retorno     = (inversion / ahorroAnual).toFixed(1);
    const co2         = (potencia * 1400 * factor * 0.00025).toFixed(1);

    /* Porcentaje de retorno (estimado a 3 años) */
    const pct = Math.min(100, Math.round((ahorroAnual * 3) / inversion * 100));

    /* ── Actualizar DOM con animación ────────────────────── */
    animarNumero(rAhorro,   '€' + ahorroAnual.toLocaleString('es'));
    animarNumero(rRetorno,  retorno + ' Años');
    animarNumero(rPotencia, potencia + ' kWp');
    animarNumero(rInversion,'€' + inversion.toLocaleString('es'));
    animarNumero(rCo2,      co2 + ' t/año');

    /* Barra de progreso ROI */
    if (roiFill) {
      roiFill.style.width = pct + '%';
      roiFill.parentElement.setAttribute('aria-valuenow', pct);
    }
    if (roiPct)      roiPct.textContent = pct + '%';
    if (roiPctLabel) roiPctLabel.textContent = 'Recuperado ' + pct + '%';

    /* Barras del gráfico (10 años) */
    const alturas = generarAlturas(ahorroAnual, 10);
    inicializarBarras(alturas);
  }

  /* ── Generar alturas progresivas para las barras ─────────── */
  function generarAlturas(ahorroAnual, años) {
    /*
     * Simula el crecimiento acumulado con curva de aprendizaje:
     * los primeros años el ahorro crece más rápido (panel > rendimiento).
     */
    const curva = [0.10, 0.21, 0.34, 0.48, 0.62, 0.72, 0.81, 0.89, 0.95, 1];
    return curva.slice(0, años);
  }

  /* ── Crear/actualizar barras en el DOM ───────────────────── */
  function inicializarBarras(alturas) {
    if (!calcBars) return;

    calcBars.innerHTML = '';

    alturas.forEach(function (h, i) {
      const bar = document.createElement('div');
      bar.className = 'calc-bars__bar';
      bar.style.height = '8%';  // Empieza en 0 para animar
      bar.setAttribute('role', 'presentation');
      bar.title = 'Año ' + (i + 1);

      /* Color según altura */
      if (h >= 0.95) {
        bar.classList.add('calc-bars__bar--full');
      } else if (h >= 0.55) {
        bar.classList.add('calc-bars__bar--mid');
      }

      calcBars.appendChild(bar);

      /* Animar con retraso escalonado */
      setTimeout(function () {
        bar.style.height = (h * 100) + '%';
      }, i * 60 + 50);
    });
  }

  /* ── Animación de número (fade + cambio) ─────────────────── */
  function animarNumero(el, valor) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(function () {
      el.textContent = valor;
      el.style.transition = 'opacity .35s ease, transform .35s ease';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 150);
  }

})();
