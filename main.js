/* ============================================
   SPACE DEBRIS CATCHER — MAIN JAVASCRIPT
   ============================================ */

// ---- STARFIELD CANVAS ----
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.4 + 0.05,
        twinkle: Math.random() * 0.02 + 0.005,
        dir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Subtle nebula glow
    const grad = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.6);
    grad.addColorStop(0, 'rgba(0,60,120,0.08)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    stars.forEach(s => {
      s.alpha += s.twinkle * s.dir;
      if (s.alpha <= 0.1 || s.alpha >= 1) s.dir *= -1;
      s.y += s.speed;
      if (s.y > H) { s.y = 0; s.x = Math.random() * W; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,220,255,${s.alpha})`;
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    initStars(220);
    if (animId) cancelAnimationFrame(animId);
    draw();
  }

  window.addEventListener('resize', init);
  init();
})();

// ---- NAVBAR SCROLL ----
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 30
      ? 'rgba(4,10,20,0.97)'
      : 'rgba(4,10,20,0.85)';
  });
})();

// ---- MOBILE MENU TOGGLE ----
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}

// ---- SCROLL REVEAL ----
(function () {
  const items = document.querySelectorAll(
    '.overview-card, .flow-step, .ai-card, .video-block, .phase, .gallery-item, .team-card, .tech-block, .stat'
  );
  items.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  items.forEach(el => observer.observe(el));
})();

// ---- GALLERY FILTER ----
function filterGallery(cat, btn) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Filter items
  document.querySelectorAll('.gallery-item').forEach(item => {
    if (cat === 'all' || item.dataset.cat === cat) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

// ---- LIGHTBOX ----
function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-caption');
  if (!lb) return;

  img.src = src;
  cap.textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  img.onerror = function () {
    cap.textContent = caption + ' — image not found';
    img.alt = 'Image placeholder';
    img.style.display = 'none';
  };
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('lb-img').src = '';
  document.getElementById('lb-img').style.display = 'block';
}

// Close lightbox with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ---- ACTIVE NAV LINK (current page) ----
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();
