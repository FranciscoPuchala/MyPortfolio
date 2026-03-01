/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — Interactive JS
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── LOADER ────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2000);
});
document.body.style.overflow = 'hidden';

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateTrail() {
  trailX += (mouseX - trailX) * 0.18;
  trailY += (mouseY - trailY) * 0.18;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
})();

document.querySelectorAll('a, button, .project-card, .tool-chip').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* ── NAVBAR ────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── PARTICLE CANVAS ───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles;

  const PARTICLE_COUNT = 90;
  const COLORS = ['rgba(108,99,255,', 'rgba(167,139,250,', 'rgba(255,255,255,'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.8 + 0.4,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  let mx = -9999, my = -9999;
  let targetMx = -9999, targetMy = -9999;
  canvas.closest('section').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    targetMx = e.clientX - rect.left;
    targetMy = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Smoothly interpolate mouse position toward real cursor
    mx += (targetMx - mx) * 0.08;
    my += (targetMy - my) * 0.08;

    particles.forEach((p, i) => {
      // Mouse repulsion
      const dx = p.x - mx, dy = p.y - my;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130) {
        const force = (130 - dist) / 130 * 0.5;
        p.vx += dx / dist * force;
        p.vy += dy / dist * force;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(108,99,255,${(1 - d/130) * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
})();

/* ── TYPING ANIMATION ──────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed');
  // ✏️ EDIT: Change these phrases
  const phrases = [
    'web applications.',
    'clean interfaces.',
    'great experiences.',
    'modern websites.',
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        setTimeout(() => { deleting = true; tick(); }, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 45 : 80);
  }
  setTimeout(tick, 800);
})();

/* ── COUNTER ANIMATION ─────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  let current  = 0;
  const step   = Math.ceil(target / 50);
  const timer  = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 35);
}

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // Trigger counters
    if (entry.target.classList.contains('hero-stats')) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
    }

    // Trigger skill bars
    entry.target.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });

    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// Observe hero-stats for counter
const heroStats = document.querySelector('.hero-stats');
if (heroStats) revealObserver.observe(heroStats);

// Trigger skill bars when tab is visible
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('#tab-tech.active .bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  });
}, { threshold: 0.2 });
const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

/* ── SKILL TABS ────────────────────────────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const tab = document.getElementById('tab-' + btn.dataset.tab);
    tab.classList.add('active');

    // Re-trigger bar animation
    tab.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = '0';
      requestAnimationFrame(() => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 50);
      });
    });

    // Re-trigger reveals inside the tab
    tab.querySelectorAll('.reveal-up').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), 50);
    });
  });
});

/* ── PROJECT FILTER ────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('.project-card').forEach(card => {
      const cat = card.dataset.category;
      const show = filter === 'all' || cat === filter;
      card.style.transition = 'opacity .35s ease, transform .35s ease';
      if (show) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => card.classList.add('hidden'), 350);
      }
    });
  });
});

/* ── CONTACT FORM (Formspree) ──────────────────────────────── */
// 👇 Replace YOUR_FORM_ID with the ID from formspree.io (see setup steps)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqedogzo';

document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn  = this.querySelector('button[type=submit]');
  const succ = document.getElementById('formSuccess');

  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending…';

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: new FormData(this),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      succ.classList.add('show');
      this.reset();
      setTimeout(() => succ.classList.remove('show'), 5000);
    } else {
      throw new Error();
    }
  } catch {
    alert('Something went wrong. You can email me directly at franpuchala8@gmail.com');
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
  }
});

/* ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── ACTIVE NAV LINK ON SCROLL ─────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--text)'
      : '';
  });
});

/* ── IFRAME PREVIEW SCALING ────────────────────────────────── */
function scaleProjectIframes() {
  document.querySelectorAll('.project-iframe-wrap').forEach(wrap => {
    const iframe = wrap.querySelector('iframe');
    if (!iframe) return;
    const scale = wrap.offsetWidth / 1280;
    iframe.style.transform = `scale(${scale})`;
  });
}
scaleProjectIframes();
window.addEventListener('resize', scaleProjectIframes);
