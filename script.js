/* ===== script.js ===== */

// ── Custom Cursor Glow ──────────────────────────────────────────────────────
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) {
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top  = glowY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Re-enable default cursor for inputs
document.querySelectorAll('a, button, input, textarea, [role="button"]').forEach(el => {
  el.style.cursor = 'pointer';
});
document.querySelectorAll('input, textarea').forEach(el => {
  el.style.cursor = 'text';
});

// ── Navbar Scroll Effect ────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveLink();
});

// ── Active Nav Link ─────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

// ── Hamburger Menu ──────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksContainer.classList.toggle('open');
});

// Close menu when a link is clicked
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('open');
  });
});

// ── Typed Text Effect ───────────────────────────────────────────────────────
const phrases = [
  'awesome websites.',
  'ML models.',
  'full-stack apps.',
  'open source tools.',
  'creative solutions.'
];

let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  if (!typedEl) return;
  const current = phrases[phraseIdx];
  if (deleting) {
    charIdx--;
    typedEl.textContent = current.substring(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
    } else {
      setTimeout(type, 50);
    }
  } else {
    charIdx++;
    typedEl.textContent = current.substring(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
    } else {
      setTimeout(type, 80);
    }
  }
}
setTimeout(type, 800);

// ── Scroll Reveal Animations ────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Staggered reveal with slight delay based on sibling order
      const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
      const order = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, order * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Stats Counter Animation ─────────────────────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  el.addEventListener('counterStart', () => {
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      el.textContent = isFloat ? val.toFixed(1) : Math.floor(val) + '+';
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isFloat ? target.toFixed(1) + '★' : target + '+';
    }
    requestAnimationFrame(update);
  });
}

// Observe stats section
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const statNums = statsEl.querySelectorAll('.stat-num');
  const targets = [12, 3, 5];
  statNums.forEach((el, i) => animateCounter(el, targets[i]));

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      statsEl.querySelectorAll('.stat-num').forEach(el => el.dispatchEvent(new Event('counterStart')));
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsEl);
}

// ── Hero Avatar Fallback ─────────────────────────────────────────────────────
const heroAvatar = document.getElementById('hero-avatar');
if (heroAvatar) {
  heroAvatar.onerror = () => {
    // Inline SVG avatar fallback
    heroAvatar.style.display = 'none';
    const container = heroAvatar.parentElement;
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg, #6C63FF, #EC4899)';
    container.innerHTML = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:180px;height:180px;">
      <circle cx="100" cy="75" r="45" fill="rgba(255,255,255,0.3)"/>
      <ellipse cx="100" cy="175" rx="65" ry="45" fill="rgba(255,255,255,0.2)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="72" font-family="Inter,sans-serif">🧑‍💻</text>
    </svg>`;
  };
}

// ── Contact Form ─────────────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn   = document.getElementById('submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.innerHTML = '<span>Sending... ⏳</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      formSuccess.style.display = 'block';
      contactForm.reset();
      submitBtn.innerHTML = '<span>Send Message 🚀</span>';
      submitBtn.disabled = false;
      setTimeout(() => { formSuccess.style.display = 'none'; }, 4000);
    }, 1500);
  });
}

// ── Download CV Placeholder ──────────────────────────────────────────────────
document.getElementById('download-cv')?.addEventListener('click', (e) => {
  e.preventDefault();
  alert('CV download coming soon! 📄\nAdd your CV PDF as assets/resume.pdf');
});

// ── Active nav link CSS extension ────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--text-primary); }
.nav-link.active::after { left:20%; right:20%; }`;
document.head.appendChild(style);

// ── Skill card tilt effect ────────────────────────────────────────────────────
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.35s cubic-bezier(0.4,0,0.2,1)';
  });
});

// ── Particle background effect (tiny floating dots) ──────────────────────────
(function createParticles() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 60;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.6 + 0.2
  }));

  const colors = ['108,99,255', '236,72,153', '59,130,246', '139,92,246'];

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const c = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c},${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
