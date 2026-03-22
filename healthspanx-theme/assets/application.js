/* =========================================
   HealthspanX / Radiant Life™ Theme JS
   ========================================= */

(function() {
  'use strict';

  /* --- Accordion --- */
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(function(header) {
      header.addEventListener('click', function() {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        var bodyId = this.getAttribute('aria-controls');
        var body = document.getElementById(bodyId);

        this.setAttribute('aria-expanded', !expanded);

        if (expanded) {
          body.hidden = true;
        } else {
          body.hidden = false;
        }
      });
    });
  }

  /* --- Checkout Gate: Enable button only when all 4 checkboxes checked --- */
  function initCheckoutGate() {
    var form = document.querySelector('[data-checkout-gate]');
    if (!form) return;

    var checkboxes = form.querySelectorAll('[data-required-checkbox]');
    var btn = form.querySelector('[data-checkout-btn]');
    if (!btn || checkboxes.length === 0) return;

    btn.disabled = true;

    function updateButton() {
      var allChecked = Array.from(checkboxes).every(function(cb) {
        return cb.checked;
      });
      btn.disabled = !allChecked;
    }

    checkboxes.forEach(function(cb) {
      cb.addEventListener('change', updateButton);
    });
  }

  /* --- Day 0 Activation Gate --- */
  function initDay0Gate() {
    var section = document.querySelector('[data-day0-gate]');
    if (!section) return;

    var confirmCb = section.querySelector('[data-day0-confirm]');
    var btn = section.querySelector('[data-day0-btn]');
    if (!confirmCb || !btn) return;

    btn.disabled = true;

    confirmCb.addEventListener('change', function() {
      btn.disabled = !this.checked;
    });
  }

  /* --- Mobile Navigation --- */
  function initMobileNav() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    var close = document.querySelector('[data-mobile-close]');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function() {
      nav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    });

    if (close) {
      close.addEventListener('click', function() {
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Close on outside click
    nav.addEventListener('click', function(e) {
      if (e.target === nav) {
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Sticky Header Shadow --- */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  /* --- Fade In on Scroll --- */
  function initFadeIn() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      elements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      elements.forEach(function(el) {
        el.classList.add('is-visible');
      });
    }
  }

  /* --- Product Tile Modal --- */
  function initProductModals() {
    var tiles = document.querySelectorAll('[data-product-tile]');
    var overlay = document.querySelector('[data-modal-overlay]');
    if (!tiles.length || !overlay) return;

    var modal = overlay.querySelector('.modal');
    var modalTitle = overlay.querySelector('[data-modal-title]');
    var modalCategory = overlay.querySelector('[data-modal-category]');
    var modalBody = overlay.querySelector('[data-modal-body]');
    var closeBtn = overlay.querySelector('[data-modal-close]');

    function openModal(tile) {
      var title = tile.getAttribute('data-product-name') || '';
      var category = tile.getAttribute('data-product-category') || '';
      var description = tile.getAttribute('data-product-description') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = category;
      if (modalBody) modalBody.textContent = description;

      overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    tiles.forEach(function(tile) {
      tile.addEventListener('click', function() {
        openModal(this);
      });
      tile.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(this);
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  /* --- Signal Bars Animation --- */
  function initSignalBars() {
    var bars = document.querySelectorAll('.signal-bar__fill');
    if (!bars.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.getAttribute('data-width') || '60%';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      bars.forEach(function(bar) {
        var width = bar.style.width;
        bar.setAttribute('data-width', width);
        bar.style.width = '0';
        observer.observe(bar);
      });
    }
  }

  /* --- Daily Checkin (Tracker) --- */
  function initDailyCheckin() {
    var checkinForm = document.querySelector('[data-daily-checkin]');
    if (!checkinForm) return;

    var checkbox = checkinForm.querySelector('input[type="checkbox"]');
    var status = checkinForm.querySelector('[data-checkin-status]');
    if (!checkbox || !status) return;

    // Load from localStorage
    var today = new Date().toISOString().slice(0, 10);
    var stored = localStorage.getItem('rl100-checkin-' + today);
    if (stored === 'true') {
      checkbox.checked = true;
      status.textContent = 'Recorded';
    }

    checkbox.addEventListener('change', function() {
      if (this.checked) {
        localStorage.setItem('rl100-checkin-' + today, 'true');
        status.textContent = 'Recorded';
      } else {
        localStorage.removeItem('rl100-checkin-' + today);
        status.textContent = '';
      }
    });
  }

  /* --- Init All --- */
  function init() {
    initAccordions();
    initCheckoutGate();
    initDay0Gate();
    initMobileNav();
    initStickyHeader();
    initFadeIn();
    initProductModals();
    initSignalBars();
    initDailyCheckin();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
