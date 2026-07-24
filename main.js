// ========================================
// PARTICLE BACKGROUND SYSTEM
// ========================================

const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;

  // Resize canvas to full viewport
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
  }

  // Particle class
  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
      this.opacity = Math.random() * 0.4 + 0.3;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.size = Math.random() * 1.5 + 0.8;
      this.speedY = Math.random() * 0.3 + 0.1;
      this.speedX = Math.random() * 0.2 - 0.1;
      this.opacity = Math.random() * 0.4 + 0.3;
      this.color = Math.random() > 0.9 ? 'rgba(255, 138, 0, ' : 'rgba(255, 255, 255, ';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Drift effect
      this.x += Math.sin(this.y * 0.005) * 0.15;

      // Reset if particle goes off screen
      if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
        this.reset();
      }
    }

    draw() {
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  // Initialize particles
  function init() {
    resizeCanvas();
    particles = [];
    // Reduce particle count for better performance
    const particleCount = Math.floor((canvas.width * canvas.height) / 25000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Animation loop with performance optimization
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      init();
    }, 250);
  });

  // Start animation
  init();
  animate();
}

// ========================================
// CORE SETUP
// ========================================

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Preloader & Page Load Safety
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 600);
  }
  document.body.classList.add('is-loaded');
}

if (document.readyState === 'complete') {
  initPreloader();
} else {
  window.addEventListener('load', initPreloader, { once: true });
  setTimeout(initPreloader, 1500);
}

// ========================================
// TYPING ANIMATION
// ========================================

const typingElement = document.getElementById('typing');
if (typingElement) {
  const roles = [
    'Java Developer',
    'Backend Engineer',
    'Aspiring Software Engineer'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  function startTyping() {
    typingElement.textContent = '';
    typeEffect();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(startTyping, 500);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(startTyping, 500), { once: true });
    window.addEventListener('load', () => setTimeout(startTyping, 500), { once: true });
  }
}

// ========================================
// MOBILE MENU TOGGLE
// ========================================

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('is-active');
    mobileNav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open');
  });

  // Close menu when link is clicked
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('is-active');
      mobileNav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('is-active');
      mobileNav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }
  });
}

// ========================================
// SCROLL PROGRESS BAR
// ========================================

const scrollProgressEl = document.querySelector('.scroll-progress span');

window.addEventListener('scroll', () => {
  if (scrollProgressEl) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    scrollProgressEl.style.width = scrolled + '%';
  }
}, { passive: true });

// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================

const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header?.classList.add('is-scrolled');
  } else {
    header?.classList.remove('is-scrolled');
  }
}, { passive: true });

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================

const navLinks = document.querySelectorAll('.nav a[data-nav]');
const navSections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];

function updateActiveNav() {
  const scrollPos = window.scrollY + 150;
  
  navSections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    const link = document.querySelector(`a[data-nav="${sectionId}"]`);
    
    if (section && link) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav(); // Call on load

// ========================================
// REVEAL ANIMATIONS ON SCROLL (BIDIRECTIONAL LEFT/RIGHT)
// ========================================

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    } else {
      // Remove is-visible when element leaves viewport so it animates back out
      // and re-animates smoothly when scrolling back into view (up or down)
      entry.target.classList.remove('is-visible');
    }
  });
}, { 
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

// Select all reveal elements
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal--left, .reveal--right, .reveal--up');

revealElements.forEach((el, index) => {
  // If element doesn't have an explicit directional class, assign left/right based on layout/grid position
  if (!el.classList.contains('reveal-left') && 
      !el.classList.contains('reveal-right') && 
      !el.classList.contains('reveal-up') &&
      !el.classList.contains('reveal--left') && 
      !el.classList.contains('reveal--right') &&
      !el.classList.contains('reveal--up')) {
    
    const parentGrid = el.closest('.about__grid, .contact__grid, .hero__grid');
    if (parentGrid) {
      const children = Array.from(parentGrid.children);
      const childIndex = children.indexOf(el);
      if (childIndex === 0) {
        el.classList.add('reveal-left');
      } else {
        el.classList.add('reveal-right');
      }
    } else {
      // Fallback alternating left/right for items
      if (index % 2 === 0) {
        el.classList.add('reveal-left');
      } else {
        el.classList.add('reveal-right');
      }
    }
  }

  revealObserver.observe(el);
});

// ========================================
// FORM SUBMISSION (Formspree)
// ========================================

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const formButton = contactForm.querySelector('button[type="submit"]');
    const originalText = formButton.textContent;

    try {
      formButton.disabled = true;
      formButton.textContent = 'Sending...';

      const response = await fetch('https://formspree.io/f/xwpkjbka', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        formStatus.className = 'form-note success';
        formStatus.hidden = false;
        contactForm.reset();

        setTimeout(() => {
          formStatus.hidden = true;
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      formStatus.textContent = '✗ Something went wrong. Please try again or email me directly.';
      formStatus.className = 'form-note error';
      formStatus.hidden = false;

      setTimeout(() => {
        formStatus.hidden = true;
      }, 5000);
    } finally {
      formButton.disabled = false;
      formButton.textContent = originalText;
    }
  });
}

// ========================================
// CUSTOM CURSOR (Desktop only)
// ========================================

if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768) {
  let cursor = document.querySelector('.cursor');
  let cursorX = 0, cursorY = 0;

  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
  }

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursor.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });

  // Add hover effect on clickable elements
  document.querySelectorAll('a, button, input, textarea, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
}

// ========================================
// ORB MOUSE TRACKING
// ========================================

const orbs = document.querySelectorAll('.hero__orb');

document.addEventListener('mousemove', (e) => {
  if (window.innerWidth <= 768) return; // Disable on mobile

  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  orbs.forEach((orb, index) => {
    const offset = (index + 1) * 10;
    const x = mouseX * offset;
    const y = mouseY * offset;
    orb.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// ========================================
// CONSOLE
// ========================================

console.log('✓ Portfolio loaded successfully');

// ========================================
// LUCIDE ICONS INITIALIZATION
// ========================================

if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}
