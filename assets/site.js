/* Langham.ai — Site JS */
(function () {
  'use strict';

  /* ── Nav scroll state ──────────────────────────────────────────────────── */
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── Scroll reveal ──────────────────────────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Contact Modal ──────────────────────────────────────────────────────── */
  var overlay = document.getElementById('contact-modal');
  if (!overlay) return;

  var form = overlay.querySelector('#contact-form');
  var successEl = overlay.querySelector('.modal-success');
  var closeBtn = overlay.querySelector('.modal-close');
  var triggers = document.querySelectorAll('[data-modal="contact"]');

  /* Rate limit: track submissions per minute in sessionStorage */
  var RATE_KEY = 'lh_sub_times';
  var RATE_LIMIT = 5;

  function getRateCount() {
    try {
      var times = JSON.parse(sessionStorage.getItem(RATE_KEY) || '[]');
      var now = Date.now();
      times = times.filter(function (t) { return now - t < 60000; });
      sessionStorage.setItem(RATE_KEY, JSON.stringify(times));
      return times.length;
    } catch (e) { return 0; }
  }

  function bumpRate() {
    try {
      var times = JSON.parse(sessionStorage.getItem(RATE_KEY) || '[]');
      times.push(Date.now());
      sessionStorage.setItem(RATE_KEY, JSON.stringify(times));
    } catch (e) {}
  }

  /* Focus trap */
  function getFocusable(el) {
    return Array.from(el.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )).filter(function (el) { return !el.closest('.honeypot'); });
  }

  function trapFocus(e) {
    var focusable = getFocusable(overlay);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  }

  function openModal() {
    overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    overlay.removeAttribute('inert');
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('keydown', trapFocus);
    // Focus first field after transition
    setTimeout(function () {
      var first = getFocusable(overlay)[0];
      if (first) first.focus();
    }, 50);
    // Reset success state if reopened
    overlay.classList.remove('success');
    if (form) form.reset();
    clearValidation();
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('inert', '');
    document.body.style.overflow = '';
    overlay.removeEventListener('keydown', trapFocus);
    // Return focus to trigger
    if (lastTrigger) { try { lastTrigger.focus(); } catch (e) {} }
  }

  /* Validation */
  function clearValidation() {
    var fields = overlay.querySelectorAll('.field');
    fields.forEach(function (f) { f.classList.remove('invalid'); });
  }

  function validateForm() {
    var valid = true;
    var nameField = overlay.querySelector('[name="name"]');
    var emailField = overlay.querySelector('[name="email"]');
    var msgField = overlay.querySelector('[name="message"]');

    if (nameField && nameField.value.trim() === '') {
      setInvalid(nameField); valid = false;
    }
    if (emailField) {
      var ev = emailField.value.trim();
      if (!ev || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ev)) {
        setInvalid(emailField); valid = false;
      }
    }
    if (msgField && msgField.value.trim() === '') {
      setInvalid(msgField); valid = false;
    }
    // company required
    var companyField = overlay.querySelector('[name="company"]');
    if (companyField && companyField.value.trim() === '') {
      setInvalid(companyField); valid = false;
    }
    return valid;
  }

  function setInvalid(input) {
    var field = input.closest('.field');
    if (field) field.classList.add('invalid');
  }

  /* Clear invalid on input */
  overlay.addEventListener('input', function (e) {
    var field = e.target.closest('.field');
    if (field) field.classList.remove('invalid');
  });

  /* Open/close triggers */
  var lastTrigger = null;
  triggers.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      lastTrigger = btn;
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () { closeModal(); });
  }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) { closeModal(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) { closeModal(); }
  });

  /* Form submission */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Honeypot check */
      var honey = form.querySelector('[name="website"]');
      if (honey && honey.value !== '') {
        /* Fake success — send nothing */
        overlay.classList.add('success');
        return;
      }

      /* Rate limit */
      if (getRateCount() >= RATE_LIMIT) {
        overlay.classList.add('success');
        return;
      }

      /* Validation */
      if (!validateForm()) return;

      /* Submit to Formspree */
      var btn = form.querySelector('.modal-submit');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending\u2026';
      }

      var data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (resp) {
        if (resp.ok) {
          bumpRate();
          overlay.classList.add('success');
        } else {
          /* Show generic error */
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'START THE CONVERSATION';
          }
          alert('Something went wrong. Please try again.');
        }
      }).catch(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'START THE CONVERSATION';
        }
        alert('Something went wrong. Please try again.');
      });
    });
  }

})();
