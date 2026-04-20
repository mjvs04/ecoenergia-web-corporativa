/* =============================================================
   portfolio.js
   Sistema de filtrado de proyectos con animación.
   ============================================================= */

(function () {
  'use strict';

  const filterBtns = document.querySelectorAll('.port-filter');
  const cards      = document.querySelectorAll('.port-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filtro = btn.getAttribute('data-filter');

      /* Actualizar botones activos */
      filterBtns.forEach(function (b) {
        b.classList.remove('port-filter--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('port-filter--active');
      btn.setAttribute('aria-pressed', 'true');

      /* Filtrar tarjetas */
      cards.forEach(function (card) {
        const tipo = card.getAttribute('data-tipo');

        if (filtro === 'todos' || tipo === filtro) {
          mostrarCard(card);
        } else {
          ocultarCard(card);
        }
      });

      /* Si se filtra, el destacado pierde su span doble */
      const destacada = document.querySelector('.port-card--featured');
      if (destacada) {
        if (filtro === 'todos' && !destacada.classList.contains('port-card--hidden')) {
          destacada.style.gridColumn = 'span 2';
        } else {
          destacada.style.gridColumn = '';
        }
      }
    });
  });

  /* ── Mostrar / ocultar con micro-animación ──────────────── */
  function mostrarCard(card) {
    card.classList.remove('port-card--hidden');
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    /* Forzar reflow para que la animación ocurra */
    void card.offsetHeight;
    card.style.transition = 'opacity .35s ease, transform .35s ease';
    card.style.opacity = '1';
    card.style.transform = 'none';
  }

  function ocultarCard(card) {
    card.style.transition = 'opacity .2s ease';
    card.style.opacity = '0';
    setTimeout(function () {
      card.classList.add('port-card--hidden');
      card.style.opacity = '';
      card.style.transition = '';
    }, 200);
  }

})();
