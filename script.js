/**
 * Thiên Phúc Engineering — Main JavaScript
 * Handles: Hero slider, scroll animations, stats counter, mobile nav, sticky header
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================
  // HERO SLIDER
  // ========================
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots button');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Reset zoom animation
    const bg = slides[currentSlide].querySelector('.hero-slide-bg');
    if (bg) {
      bg.style.animation = 'none';
      bg.offsetHeight; // trigger reflow
      bg.style.animation = '';
    }
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); });
  });

  if (slides.length > 1) startAutoSlide();

  // ========================
  // STICKY HEADER
  // ========================
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', st > 80);
    }
    lastScroll = st;
  }, { passive: true });

  // ========================
  // MOBILE MENU
  // ========================
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');

  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      // Animate hamburger
      const spans = mobileBtn.querySelectorAll('span');
      mobileBtn.classList.toggle('open');
      if (mobileBtn.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Mobile dropdown toggle
    const dropdownLinks = mainNav.querySelectorAll('li > a');
    dropdownLinks.forEach(link => {
      const parent = link.parentElement;
      const dropdown = parent.querySelector('.dropdown');
      if (dropdown && window.innerWidth <= 768) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            parent.classList.toggle('drop-open');
          }
        });
      }
    });
  }

  // ========================
  // SMOOTH SCROLL (for anchor links)
  // ========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        // Close mobile menu
        if (mainNav) mainNav.classList.remove('active');
        if (mobileBtn) {
          mobileBtn.classList.remove('open');
          const spans = mobileBtn.querySelectorAll('span');
          spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
        
        const headerH = header ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ========================
  // BACK TO TOP
  // ========================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========================
  // SCROLL REVEAL ANIMATIONS
  // ========================
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  function checkReveal() {
    const windowH = window.innerHeight;
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      const triggerPoint = windowH * 0.85;
      if (top < triggerPoint) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal(); // Run on load

  // ========================
  // ANIMATED COUNTER
  // ========================
  const counters = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;

    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      countersAnimated = true;

      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'), 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out quad
          const eased = 1 - (1 - progress) * (1 - progress);
          const current = Math.floor(eased * target);
          counter.textContent = current.toLocaleString() + '+';
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();

  // ========================
  // CONTACT FORM (demo handler)
  // ========================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      
      // Show success message
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        Đã gửi thành công!
      `;
      btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
      btn.style.boxShadow = '0 4px 15px rgba(16,185,129,0.35)';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  // ========================
  // ACTIVE NAV on SCROLL
  // ========================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav > li');

  function highlightNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(li => {
          li.classList.remove('active');
          const link = li.querySelector('a');
          if (link && link.getAttribute('href') === '#' + id) {
            li.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

});
