/* =============================================================
   nav.js — Compartido por todas las páginas
   Controla: menú hamburguesa mobile + sombra al scroll
   ============================================================= */

(function () {
  'use strict';

  const navbar    = document.getElementById('navbar');
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  /* ── Hamburguesa ─────────────────────────────────────────── */
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.style.display === 'flex';

      if (isOpen) {
        cerrarMenu();
      } else {
        abrirMenu();
      }
    });

    /* Cerrar al hacer clic fuera */
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        cerrarMenu();
      }
    });

    /* Cerrar al pulsar Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarMenu();
    });
  }

  function abrirMenu() {
    mobileMenu.style.display = 'flex';
    burgerBtn.textContent = '✕';
    burgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function cerrarMenu() {
    mobileMenu.style.display = '';
    burgerBtn.textContent = '☰';
    burgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  /* ── Sombra al hacer scroll ──────────────────────────────── */
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        navbar.style.boxShadow = '0 4px 32px rgba(25,28,30,.07)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

})();
