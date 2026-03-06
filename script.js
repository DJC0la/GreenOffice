const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });

const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  const isOpen = navLinks.style.display === 'flex';
  if (isOpen) {
    navLinks.style.display = 'none';
    burger.classList.remove('open');
  } else {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.padding = '20px 32px';
    navLinks.style.background = 'rgba(10,15,10,0.97)';
    navLinks.style.backdropFilter = 'blur(20px)';
    navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    burger.classList.add('open');
  }
});

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

function animateCounter(el, target, suffix = '', duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const num = entry.target;
      const target = parseInt(num.dataset.target);
      const suffix = num.dataset.suffix || '';
      animateCounter(num, target, suffix, 1800);
      statObserver.unobserve(num);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    // Close burger if open
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    }
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = form.querySelector('.submit-btn');
  const originalHtml = btn.innerHTML;

  btn.innerHTML = `
    <span>Отправляем...</span>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
      <circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"/>
    </svg>
  `;
  btn.style.pointerEvents = 'none';
  btn.style.opacity = '0.8';

  const spinStyle = document.createElement('style');
  spinStyle.textContent = '.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(spinStyle);

  setTimeout(() => {
    form.reset();
    btn.innerHTML = originalHtml;
    btn.style.pointerEvents = '';
    btn.style.opacity = '';
    spinStyle.remove();

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }, 2000);
});

const heroBg = document.querySelector('.hero-bg');
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const scrollY = window.scrollY;
  const heroH = heroSection.offsetHeight;
  if (scrollY < heroH) {
    heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
  }
}, { passive: true });

document.querySelectorAll('.reason-card, .stat-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

window.dispatchEvent(new Event('scroll'));