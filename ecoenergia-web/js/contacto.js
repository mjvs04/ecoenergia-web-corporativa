/* =============================================================
   contacto.js
   Validación del formulario de contacto (frontend) +
   envío asíncrono a php/procesar.php (fetch/AJAX).
   ============================================================= */

(function () {
  'use strict';

  const form       = document.getElementById('contactForm');
  const formWrap   = document.getElementById('formWrap');
  const successMsg = document.getElementById('successMsg');
  const submitBtn  = document.getElementById('submitBtn');
  const globalErr  = document.getElementById('globalErr');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    enviarFormulario();
  });

  /* ── VALIDACIÓN FRONTEND ─────────────────────────────────── */
  function validarFormulario() {
    let valido = true;

    /* Limpiar errores anteriores */
    limpiarErrores();

    const nombre = campo('nombre');
    const email  = campo('email');

    /* Nombre obligatorio */
    if (!nombre.value.trim()) {
      mostrarError('err-nombre', 'El nombre es obligatorio.');
      valido = false;
    }

    /* Email obligatorio y formato válido */
    if (!email.value.trim()) {
      mostrarError('err-email', 'El email es obligatorio.');
      valido = false;
    } else if (!esEmailValido(email.value.trim())) {
      mostrarError('err-email', 'Introduce un email válido.');
      valido = false;
    }

    /* Si hay errores, mover el foco al primero */
    if (!valido) {
      const primerError = form.querySelector('.cont-field__err:not(:empty)');
      if (primerError) {
        const input = primerError.previousElementSibling;
        if (input) input.focus();
      }
    }

    return valido;
  }

  /* ── ENVÍO ASÍNCRONO A PHP ───────────────────────────────── */
  function enviarFormulario() {
    /* Estado de carga */
    submitBtn.disabled = true;
    submitBtn.classList.add('cont-form__btn--loading');

    const datos = new FormData(form);

    fetch('php/procesar.php', {
      method: 'POST',
      body: datos,
    })
      .then(function (res) {
        /*
         * PHP devuelve JSON: { "ok": true } o { "ok": false, "error": "..." }
         * Si la petición tiene un status HTTP de error, lanzar excepción.
         */
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data.ok) {
          mostrarExito();
        } else {
          mostrarErrorGlobal(data.error || 'Error al enviar. Inténtalo de nuevo.');
        }
      })
      .catch(function (err) {
        console.error('Error de red:', err);
        /*
         * En desarrollo (sin servidor PHP) simulamos el éxito
         * para poder probar la interfaz localmente.
         * ELIMINAR esta línea en producción:
         */
        mostrarExito();

        /* Descomentar en producción:
        mostrarErrorGlobal('Error de conexión. Comprueba tu red e inténtalo de nuevo.');
        */
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.classList.remove('cont-form__btn--loading');
      });
  }

  /* ── MOSTRAR ÉXITO ───────────────────────────────────────── */
  function mostrarExito() {
    if (formWrap)   formWrap.hidden   = true;
    if (successMsg) {
      successMsg.hidden = false;
      successMsg.focus();
    }
  }

  /* ── HELPERS ─────────────────────────────────────────────── */
  function campo(id) {
    return document.getElementById(id) || { value: '' };
  }

  function mostrarError(errId, mensaje) {
    const el = document.getElementById(errId);
    if (el) el.textContent = mensaje;
  }

  function mostrarErrorGlobal(mensaje) {
    if (globalErr) {
      globalErr.textContent = mensaje;
      globalErr.hidden = false;
    }
  }

  function limpiarErrores() {
    form.querySelectorAll('.cont-field__err').forEach(function (el) {
      el.textContent = '';
    });
    if (globalErr) {
      globalErr.textContent = '';
      globalErr.hidden = true;
    }
  }

  function esEmailValido(email) {
    /* Expresión regular básica para validar email */
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ── Validación en tiempo real (on blur) ─────────────────── */
  form.querySelectorAll('.cont-input').forEach(function (input) {
    input.addEventListener('blur', function () {
      /* Limpiar error del campo al salir si ya tiene valor */
      const errId = 'err-' + input.id;
      const errEl = document.getElementById(errId);
      if (errEl && input.value.trim()) {
        errEl.textContent = '';
      }
    });
  });

})();
