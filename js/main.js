(function() {
  'use strict';

  const html = document.documentElement;

  // --- Language Switcher ---
  function initLang() {
    const saved = localStorage.getItem('jic-gw-lang');
    const defaultLang = saved || 'ar';
    setLang(defaultLang);

    document.querySelectorAll('.lang-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = html.getAttribute('data-lang') === 'ar' ? 'en' : 'ar';
        setLang(next);
      });
    });
  }

  function setLang(lang) {
    // Smooth cross-fade
    document.body.style.opacity = '0';
    setTimeout(() => {
      html.setAttribute('data-lang', lang);
      html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      localStorage.setItem('jic-gw-lang', lang);
      document.querySelectorAll('.lang-toggle').forEach(btn => {
        btn.textContent = lang === 'ar' ? 'EN' : 'عربي';
      });
      document.body.style.transition = 'opacity 0.25s ease';
      document.body.style.opacity = '1';
    }, 150);
  }

  // --- Navbar scroll + active link ---
  function initNav() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // Mobile drawer with focus trap and body scroll lock
    const toggle = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const closeBtn = drawer?.querySelector('.close-btn');
    let lastFocusedEl = null;

    function trapFocus(el) {
      const focusable = el.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      el.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }

    function openDrawer() {
      if (!drawer) return;
      lastFocusedEl = document.activeElement;
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      trapFocus(drawer);
      setTimeout(() => {
        const firstLink = drawer.querySelector('a, button');
        firstLink?.focus();
      }, 100);
    }

    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      lastFocusedEl?.focus();
    }

    if (toggle && drawer) {
      toggle.addEventListener('click', openDrawer);
      closeBtn?.addEventListener('click', closeDrawer);
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeDrawer);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
          closeDrawer();
        }
      });
    }

    // Active link based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- Scroll reveals with IntersectionObserver (rootMargin: -50px) ---
  function initReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '-50px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // --- Animated counters with easeOutExpo ---
  function initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
  }

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutExpo(progress);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // --- Progress bars ---
  function initProgressBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.progress-fill');
          if (fill) fill.style.width = fill.getAttribute('data-width') + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('.progress-item').forEach(el => observer.observe(el));
  }

  // --- Accordion with ARIA states ---
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      const item = header.closest('.accordion-item');
      const body = item?.querySelector('.accordion-body');
      if (item && body) {
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', body.id || generateId(body));
        body.id = header.getAttribute('aria-controls');
        body.setAttribute('role', 'region');
        body.setAttribute('aria-labelledby', header.id || generateId(header));
        header.id = body.getAttribute('aria-labelledby');
      }

      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('open');
        // Close siblings if in same group
        const group = header.closest('.accordion-group');
        if (group) {
          group.querySelectorAll('.accordion-item.open').forEach(sib => {
            if (sib !== item) {
              sib.classList.remove('open');
              const sibHeader = sib.querySelector('.accordion-header');
              if (sibHeader) sibHeader.setAttribute('aria-expanded', 'false');
            }
          });
        }
        item.classList.toggle('open', !isOpen);
        header.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    // Objection cards
    document.querySelectorAll('.objection-card').forEach(card => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        const container = card.closest('.objection-grid');
        if (container) {
          container.querySelectorAll('.objection-card.open').forEach(sib => {
            if (sib !== card) sib.classList.remove('open');
          });
        }
        card.classList.toggle('open', !isOpen);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  function generateId(el) {
    const id = 'gw-jic-' + Math.random().toString(36).slice(2, 9);
    el.id = id;
    return id;
  }

  // --- Magnetic button effect ---
  function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  // --- Employer filter with smooth fade transitions ---
  function initEmployerFilter() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.employer-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const region = tab.getAttribute('data-region');

        cards.forEach(card => {
          const cardRegion = card.getAttribute('data-region');
          const show = region === 'all' || cardRegion === region;
          if (show) {
            card.classList.remove('hidden');
            setTimeout(() => {
              card.style.display = 'block';
            }, 10);
          } else {
            card.classList.add('hidden');
            setTimeout(() => {
              card.style.display = 'none';
            }, 450);
          }
        });
      });
    });
  }

  // --- Particles ---
  function initParticles() {
    const container = document.querySelector('.hero');
    if (!container) return;
    const count = 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const sizeClass = Math.random() > 0.7 ? 'particle--lg' : (Math.random() > 0.5 ? 'particle--sm' : '');
      p.className = 'particle ' + sizeClass;
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.animationDuration = (5 + Math.random() * 8) + 's';
      const size = 2 + Math.random() * 5;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      container.appendChild(p);
    }
  }

  // --- Countdown placeholder ---
  function initCountdown() {
    const el = document.querySelector('.countdown');
    if (!el) return;
  }

  // --- Smooth scroll with header offset ---
  function initSmoothScroll() {
    const headerOffset = 80;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });
  }

  // --- Active nav section highlighting ---
  function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(sec => observer.observe(sec));
  }

  // --- Form validation with real-time feedback ---
  function initForms() {
    document.querySelectorAll('form').forEach(form => {
      const fields = form.querySelectorAll('input, select, textarea');

      fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          const group = field.closest('.form-group');
          if (group && (group.classList.contains('is-valid') || group.classList.contains('is-invalid'))) {
            validateField(field);
          }
        });
      });

      form.addEventListener('submit', (e) => {
        const required = form.querySelectorAll('[required]');
        let valid = true;
        required.forEach(field => {
          if (!validateField(field)) valid = false;
        });
        if (!valid) {
          e.preventDefault();
          const firstInvalid = form.querySelector('.form-group.is-invalid');
          firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          e.preventDefault();
          const btn = form.querySelector('button[type="submit"]');
          if (btn) {
            btn.classList.add('is-loading');
            setTimeout(() => {
              btn.classList.remove('is-loading');
              showSuccessModal();
              form.reset();
            }, 1500);
          }
        }
      });
    });
  }

  function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;
    const isRequired = field.hasAttribute('required');
    const value = field.value.trim();
    let isValid = true;

    if (isRequired && !value) isValid = false;
    if (field.type === 'email' && value) {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if (field.type === 'tel' && value) {
      isValid = /^[+]?[\d\s()-]{7,}$/.test(value);
    }

    // Add validation icon if not present
    if (!group.querySelector('.validation-icon')) {
      const icon = document.createElement('span');
      icon.className = 'validation-icon';
      icon.setAttribute('aria-hidden', 'true');
      group.appendChild(icon);
    }
    const icon = group.querySelector('.validation-icon');

    group.classList.remove('is-valid', 'is-invalid', 'shake');
    if (value) {
      group.classList.add(isValid ? 'is-valid' : 'is-invalid');
      icon.textContent = isValid ? '✓' : '✕';
      if (!isValid) {
        group.classList.add('shake');
        setTimeout(() => group.classList.remove('shake'), 400);
      }
    }
    return isValid || !isRequired;
  }

  // --- Success modal with confetti ---
  function showSuccessModal() {
    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Success');

    const lang = html.getAttribute('data-lang') || 'ar';
    const title = lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Submitted Successfully!';
    const msg = lang === 'ar'
      ? 'شكراً لتواصلك معنا. سنتواصل معك خلال 24 ساعة.'
      : 'Thank you for reaching out. We will contact you within 24 hours.';
    const btnText = lang === 'ar' ? 'حسناً' : 'Got it';

    overlay.innerHTML = `
      <div class="confetti-container"></div>
      <div class="modal-content">
        <div style="font-size:3rem;margin-bottom:1rem;">🎉</div>
        <h3 style="color:var(--white);margin-bottom:0.5rem;font-size:1.3rem;">${title}</h3>
        <p style="color:var(--graytext);margin-bottom:1.5rem;">${msg}</p>
        <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">${btnText}</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Generate confetti pieces
    const confettiContainer = overlay.querySelector('.confetti-container');
    for (let i = 0; i < 20; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = (10 + Math.random() * 80) + '%';
      piece.style.top = (20 + Math.random() * 30) + '%';
      piece.style.animationDelay = (Math.random() * 0.5) + 's';
      piece.style.background = ['var(--gold)', 'var(--success)', 'var(--white)'][Math.floor(Math.random() * 3)];
      piece.style.width = (4 + Math.random() * 6) + 'px';
      piece.style.height = (4 + Math.random() * 6) + 'px';
      confettiContainer.appendChild(piece);
    }

    requestAnimationFrame(() => overlay.classList.add('open'));

    const closeBtn = overlay.querySelector('button');
    closeBtn?.focus();

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', escClose);
      }
    });
  }

  // --- Marquee duplicate for seamless loop ---
  function initMarquee() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    const items = Array.from(track.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  }

  // --- Scroll-to-top button ---
  function initScrollTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Lazy loading for images ---
  function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.setAttribute('src', img.getAttribute('data-src'));
        img.removeAttribute('data-src');
      });
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
      document.body.appendChild(script);
    }
  }

  // --- Parallax layers ---
  function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const parallaxBg = document.querySelector('.parallax-bg');
    const parallaxSlow = document.querySelector('.parallax-slow');
    if (!parallaxBg && !parallaxSlow) return;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (parallaxBg) parallaxBg.style.transform = `translateY(${y * 0.3}px)`;
      if (parallaxSlow) parallaxSlow.style.transform = `translateY(${y * 0.15}px)`;
    }, { passive: true });
  }

  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', () => {
    initLang();
    initNav();
    initReveals();
    initCounters();
    initProgressBars();
    initAccordions();
    initMagnetic();
    initEmployerFilter();
    initParticles();
    initCountdown();
    initSmoothScroll();
    initForms();
    initMarquee();
    initScrollTop();
    initLazyImages();
    initActiveSection();
    initParallax();
  });
})();
