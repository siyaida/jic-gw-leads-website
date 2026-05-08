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
    html.setAttribute('data-lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('jic-gw-lang', lang);
    document.querySelectorAll('.lang-toggle').forEach(btn => {
      btn.textContent = lang === 'ar' ? 'EN' : 'عربي';
    });
  }

  // --- Navbar scroll + active link ---
  function initNav() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // Mobile drawer
    const toggle = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const closeBtn = drawer?.querySelector('.close-btn');

    if (toggle && drawer) {
      toggle.addEventListener('click', () => drawer.classList.add('open'));
      closeBtn?.addEventListener('click', () => drawer.classList.remove('open'));
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => drawer.classList.remove('open'));
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

  // --- Scroll reveals ---
  function initReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // --- Animated counters ---
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

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
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

  // --- Accordion ---
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('open');
        // Close siblings if in same group
        const group = header.closest('.accordion-group');
        if (group) {
          group.querySelectorAll('.accordion-item.open').forEach(sib => {
            if (sib !== item) sib.classList.remove('open');
          });
        }
        item.classList.toggle('open', !isOpen);
      });
    });

    // Objection cards
    document.querySelectorAll('.objection-card').forEach(card => {
      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        // Close others in same container
        const container = card.closest('.objection-grid');
        if (container) {
          container.querySelectorAll('.objection-card.open').forEach(sib => {
            if (sib !== card) sib.classList.remove('open');
          });
        }
        card.classList.toggle('open', !isOpen);
      });
    });
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

  // --- Employer filter ---
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
          card.style.display = show ? 'block' : 'none';
        });
      });
    });
  }

  // --- Particles ---
  function initParticles() {
    const container = document.querySelector('.hero');
    if (!container) return;
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      const size = 2 + Math.random() * 4;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      container.appendChild(p);
    }
  }

  // --- Countdown placeholder ---
  function initCountdown() {
    const el = document.querySelector('.countdown');
    if (!el) return;
    // Placeholder: just show static numbers for visual effect
    // In production, set a real target date
  }

  // --- Smooth scroll for anchor links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- Form validation helpers ---
  function initForms() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        const required = form.querySelectorAll('[required]');
        let valid = true;
        required.forEach(field => {
          if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = 'var(--danger)';
          } else {
            field.style.borderColor = '';
          }
        });
        if (!valid) {
          e.preventDefault();
          alert(html.getAttribute('data-lang') === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
        }
      });
    });
  }

  // --- Marquee duplicate for seamless loop ---
  function initMarquee() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    // Clone items to ensure seamless scroll
    const items = Array.from(track.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
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
  });
})();
