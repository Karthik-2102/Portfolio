/* ════════════════════════════════════════
   MAIN.JS — Vikash Kumar Portfolio
════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── AOS INIT ── */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  /* ── LOADER ── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('done'), 600);
  });
  // Fallback in case load already fired
  setTimeout(() => loader?.classList.add('done'), 2500);

  /* ── CUSTOM CURSOR (desktop only) ── */
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouch && cursor && trail) {
    let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
      cursor.style.opacity = '1';
      trail.style.opacity = '1';
    });

    function animateTrail() {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      trail.style.left = trailX + 'px';
      trail.style.top = trailY + 'px';
      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      trail.style.opacity = '0';
    });
  } else {
    // Hide cursor elements entirely on touch devices
    cursor?.remove();
    trail?.remove();
    document.body.style.cursor = 'auto';
  }

  /* ── PARTICLES CANVAS ── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = window.innerWidth < 768 ? 25 : 50;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.5 + 0.1,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) draw();
  }

  /* ── NAVBAR SCROLL STATE ── */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('back-top');

  function onScroll() {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
      backTop?.classList.add('show');
    } else {
      navbar?.classList.remove('scrolled');
      backTop?.classList.remove('show');
    }
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ── MOBILE NAV (HAMBURGER) ── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── BACK TO TOP ── */
  backTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── TYPED TEXT EFFECT (HERO) ── */
  const typedEl = document.getElementById('typed');
  const roles = [
    'BCA Student',
    'Web Developer',
    'AI Enthusiast',
    'Building Jarvis AI',
  ];

  if (typedEl) {
    let roleIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      const current = roles[roleIndex];

      if (!deleting) {
        typedEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1800);
          return;
        }
      } else {
        typedEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 40 : 80);
    }
    typeLoop();
  }

  /* ── ANIMATED SKILL PILL BARS ── */
  const pillFills = document.querySelectorAll('.pill-fill');
  const pillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.w || '0%';
        pillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });
  pillFills.forEach(fill => pillObserver.observe(fill));

  /* ── ANIMATED STAT COUNTERS (ABOUT) ── */
  const statNums = document.querySelectorAll('.astat-n');
  let countersRan = false;

  function runCounters() {
    if (countersRan) return;
    const statsSection = document.querySelector('.about-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight - 50;
    if (!inView) return;

    countersRan = true;

    statNums.forEach((el, i) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      el.textContent = '0';

      setTimeout(() => {
        const duration = 1400;
        const startTime = performance.now();

        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(step);
      }, i * 100); // stagger each counter slightly
    });
  }

  // Check on scroll AND after loader finishes
  window.addEventListener('scroll', runCounters, { passive: true });
  // Wait for loader to be fully hidden before checking viewport
  setTimeout(runCounters, 2800);

  /* ── CONTACT FORM VALIDATION + SUBMIT ── */
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const submitBtn = document.getElementById('submit-btn');
  const btnLabel = document.getElementById('btn-label');

  function showToast(message, isError = false) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function setFieldError(input, errEl, message) {
    if (message) {
      input?.classList.add('error');
      if (errEl) errEl.textContent = message;
    } else {
      input?.classList.remove('error');
      if (errEl) errEl.textContent = '';
    }
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    const nameErr = document.getElementById('name-err');
    const emailErr = document.getElementById('email-err');
    const msgErr = document.getElementById('msg-err');

    let valid = true;

    if (!name.value.trim()) {
      setFieldError(name, nameErr, 'Please enter your name.');
      valid = false;
    } else {
      setFieldError(name, nameErr, '');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
      setFieldError(email, emailErr, 'Please enter a valid email.');
      valid = false;
    } else {
      setFieldError(email, emailErr, '');
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      setFieldError(message, msgErr, 'Message should be at least 10 characters.');
      valid = false;
    } else {
      setFieldError(message, msgErr, '');
    }

    if (!valid) {
      showToast('Please fix the errors and try again.', true);
      return;
    }

    // Simulate submission (replace with real backend / Formspree / EmailJS)
    submitBtn.disabled = true;
    btnLabel.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      btnLabel.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      showToast('Message sent! I\'ll get back to you soon.');
      form.reset();
    }, 1200);
  });

  /* ── SMOOTH SCROLL OFFSET FIX (for fixed navbar) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 70;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

});