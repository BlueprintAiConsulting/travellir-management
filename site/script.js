/* ============================================
   TRAVELLIR — Premier Rentals
   Interactive Script v2.0
   ============================================ */

(function () {
  'use strict';

  // ---- DOM References ----
  const header       = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu      = document.getElementById('nav-menu');
  const navLinks     = document.querySelectorAll('.header__link');
  const revealEls    = document.querySelectorAll('.reveal');

  // ---- Header Scroll Effect ----
  const SCROLL_THRESHOLD = 50;

  function handleScroll() {
    const y = window.scrollY;
    header.classList.toggle('header--scrolled', y > SCROLL_THRESHOLD);
  }

  // ---- Mobile Menu Toggle ----
  function toggleMobileMenu() {
    const isOpen = navMenu.classList.toggle('open');
    mobileToggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---- Smooth Scroll ----
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          const headerH = header.offsetHeight;
          const pos = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
          window.scrollTo({ top: pos, behavior: 'smooth' });
          closeMobileMenu();
        }
      });
    });
  }

  // ---- Scroll Reveal ----
  function setupScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) { obs.observe(el); });
  }

  // ---- Favorite Button Toggle ----
  function setupFavorites() {
    document.querySelectorAll('.property-card__favorite').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isActive = this.classList.toggle('active');
        const svg = this.querySelector('svg path');

        if (isActive) {
          // Pulse animation
          this.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.35)' },
            { transform: 'scale(1)' }
          ], { duration: 280, easing: 'ease-out' });
        }
      });
    });
  }

  // ---- Active Nav Tracking on Scroll ----
  function setupActiveNavTracking() {
    const sections = document.querySelectorAll('section[id]');
    function update() {
      const scrollPos = window.scrollY + 140;
      sections.forEach(function (sec) {
        const top = sec.offsetTop;
        const h   = sec.offsetHeight;
        const id  = sec.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + h) {
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }
    window.addEventListener('scroll', update, { passive: true });
  }

  // ---- Property Filter Tabs ----
  function setupFilters() {
    const tabs  = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.property-card[data-type], .property-card[data-state]');

    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        cards.forEach(function (card) {
          const types = (card.getAttribute('data-type') || '').split(' ');
          const state = card.getAttribute('data-state') || '';

          let show = false;
          if (filter === 'all') {
            show = true;
          } else if (filter === 'wv' || filter === 'az') {
            show = state === filter;
          } else {
            show = types.includes(filter);
          }

          card.style.opacity    = show ? '1' : '0.25';
          card.style.transform  = show ? '' : 'scale(0.97)';
          card.style.pointerEvents = show ? '' : 'none';
        });
      });
    });
  }

  // ---- Property Card click ----
  function setupPropertyCards() {
    document.querySelectorAll('.property-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        // Don't trigger on button/link inside card
        if (e.target.closest('.property-card__favorite') || e.target.closest('.btn')) return;
        const title = this.querySelector('.property-card__title');
        if (title) {
          console.log('[Travellir] Property viewed:', title.textContent.trim());
        }
      });
    });
  }

  // ---- Hero Parallax (mouse glow) ----
  function setupParallax() {
    const gradient = document.querySelector('.hero__gradient');
    if (!gradient) return;

    let ticking = false;
    window.addEventListener('mousemove', function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const x = (e.clientX / window.innerWidth)  * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        gradient.style.background =
          'radial-gradient(ellipse 70% 55% at ' + x + '% ' + y + '%, rgba(184,146,42,0.10) 0%, transparent 60%),' +
          'radial-gradient(ellipse 60% 80% at 10% 80%, rgba(37,64,104,0.35) 0%, transparent 60%),' +
          'linear-gradient(160deg, var(--navy-950) 0%, #0D1E38 45%, var(--navy-800) 100%)';
        ticking = false;
      });
    }, { passive: true });
  }

  // ---- Hero Particle Burst ----
  function setupParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const PARTICLE_COUNT = 12;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'hero__particle';

      const size  = Math.random() * 3 + 1;
      const x     = Math.random() * 100;
      const delay = Math.random() * 8;
      const dur   = Math.random() * 6 + 6;

      p.style.cssText =
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'left:' + x + '%;' +
        'bottom:' + (Math.random() * 30) + '%;' +
        '--duration:' + dur + 's;' +
        '--delay:' + delay + 's;';

      container.appendChild(p);
    }
  }

  // ---- Counter Animation ----
  function animateCounters() {
    const els = document.querySelectorAll('.hero__stat-value');

    els.forEach(function (el) {
      const text    = el.textContent.trim();
      const match   = text.match(/[\d.]+/);
      if (!match) return;

      const target  = parseFloat(match[0]);
      const suffix  = text.replace(match[0], '');
      const isFloat = text.includes('.');
      const dur     = 1800;
      let   start   = null;

      el.textContent = (isFloat ? '0.0' : '0') + suffix;

      const obs = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();

        function step(ts) {
          if (!start) start = ts;
          const pct   = Math.min((ts - start) / dur, 1);
          const eased = 1 - Math.pow(1 - pct, 3);
          const val   = eased * target;
          el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
          if (pct < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      });

      obs.observe(el);
    });
  }

  // ---- Review Card Gold Glow tilt on hover ----
  function setupReviewTilt() {
    document.querySelectorAll('.review-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
        card.style.transform = 'translateY(-5px) rotateX(' + (-y) + 'deg) rotateY(' + x + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s var(--ease-out)';
        setTimeout(function () { card.style.transition = ''; }, 500);
      });
    });
  }

  // ---- Form Email Builder ----
  function setupForm() {
    const submitBtn = document.getElementById('form-submit-btn');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const name     = (document.getElementById('form-name')     || {}).value || '';
      const email    = (document.getElementById('form-email')    || {}).value || '';
      const property = (document.getElementById('form-property') || {}).value || 'Any';
      const type     = (document.getElementById('form-type')     || {}).value || 'Not specified';
      const checkin  = (document.getElementById('form-checkin')  || {}).value || 'TBD';
      const checkout = (document.getElementById('form-checkout') || {}).value || 'TBD';

      const subject = encodeURIComponent('Travellir Booking Inquiry — ' + (property || 'General'));
      const body    = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Property: ' + property + '\n' +
        'Stay Type: ' + type + '\n' +
        'Check-In: ' + checkin + '\n' +
        'Check-Out: ' + checkout
      );

      window.location.href = 'mailto:bookings@travellir.com?subject=' + subject + '&body=' + body;
    });
  }

  // ---- Initialize ----
  function init() {
    // Throttled scroll
    let raf;
    window.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        handleScroll();
        raf = null;
      });
    }, { passive: true });

    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    setupSmoothScroll();
    setupScrollReveal();
    setupFavorites();
    setupActiveNavTracking();
    setupFilters();
    setupPropertyCards();
    setupParallax();
    setupParticles();
    animateCounters();
    setupReviewTilt();
    setupForm();

    console.log('[Travellir] Premier Rentals v2.0 — Site initialized');
  }

  // ---- Boot ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
