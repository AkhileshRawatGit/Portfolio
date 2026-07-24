// ========================================
// CODE EDITOR TYPING ANIMATION
// ========================================

const codeLines = [
  { num: 1, tokens: [
    { text: 'public', type: 'keyword' },
    { text: 'class', type: 'keyword' },
    { text: 'Developer', type: 'class-name' },
    { text: '{', type: 'plain' }
  ]},
  { num: 2, tokens: [
    { text: '    private', type: 'keyword' },
    { text: 'String', type: 'class-name' },
    { text: 'name', type: 'plain' },
    { text: '=', type: 'plain' },
    { text: '"Akhilesh Rawat"', type: 'string' },
    { text: ';', type: 'plain' }
  ]},
  { num: 3, tokens: [
    { text: '    private', type: 'keyword' },
    { text: 'String', type: 'class-name' },
    { text: 'role', type: 'plain' },
    { text: '=', type: 'plain' },
    { text: '"Java Developer"', type: 'string' },
    { text: ';', type: 'plain' }
  ]},
  { num: 4, tokens: [] },
  { num: 5, tokens: [
    { text: '    public', type: 'keyword' },
    { text: 'void', type: 'keyword' },
    { text: 'build', type: 'method' },
    { text: '()', type: 'plain' },
    { text: '{', type: 'plain' }
  ]},
  { num: 6, tokens: [
    { text: '        System', type: 'class-name' },
    { text: '.out.', type: 'plain' },
    { text: 'println', type: 'method' },
    { text: '(', type: 'plain' },
    { text: '"Building', type: 'string' }
  ]},
  { num: 7, tokens: [
    { text: '            scalable', type: 'string' },
    { text: 'applications"', type: 'string' },
    { text: ');', type: 'plain' }
  ]},
  { num: 8, tokens: [
    { text: '    }', type: 'plain' }
  ]},
  { num: 9, tokens: [] },
  { num: 10, tokens: [
    { text: '    public', type: 'keyword' },
    { text: 'static', type: 'keyword' },
    { text: 'void', type: 'keyword' },
    { text: 'main', type: 'method' },
    { text: '(', type: 'plain' },
    { text: 'String', type: 'class-name' },
    { text: '[]', type: 'plain' },
    { text: 'args)', type: 'plain' },
    { text: '{', type: 'plain' }
  ]},
  { num: 11, tokens: [
    { text: '        Developer', type: 'class-name' },
    { text: 'dev', type: 'plain' },
    { text: '=', type: 'plain' },
    { text: 'new', type: 'keyword' },
    { text: 'Developer', type: 'method' },
    { text: '();', type: 'plain' }
  ]},
  { num: 12, tokens: [
    { text: '        dev.', type: 'plain' },
    { text: 'build', type: 'method' },
    { text: '();', type: 'plain' }
  ]},
  { num: 13, tokens: [
    { text: '    }', type: 'plain' }
  ]},
  { num: 14, tokens: [
    { text: '}', type: 'plain' }
  ]}
];

class CodeTypingAnimation {
  constructor() {
    this.codeElement = document.getElementById('typing-code');
    if (!this.codeElement) return;
    
    this.currentLineIndex = 0;
    this.currentTokenIndex = 0;
    this.displayedLines = [];
    this.isComplete = false;
    
    this.startTyping();
  }

  startTyping() {
    this.typeNextToken();
  }

  typeNextToken() {
    if (this.currentLineIndex >= codeLines.length) {
      // Animation complete, wait and restart
      setTimeout(() => {
        this.reset();
      }, 3500);
      return;
    }

    const currentLine = codeLines[this.currentLineIndex];
    
    // If line has no tokens (empty line)
    if (currentLine.tokens.length === 0) {
      this.displayedLines[this.currentLineIndex] = { num: currentLine.num, tokens: [] };
      this.currentLineIndex++;
      this.currentTokenIndex = 0;
      this.render();
      setTimeout(() => this.typeNextToken(), 80);
      return;
    }

    // Initialize line if not exists
    if (!this.displayedLines[this.currentLineIndex]) {
      this.displayedLines[this.currentLineIndex] = { num: currentLine.num, tokens: [] };
    }

    // Type current token
    if (this.currentTokenIndex < currentLine.tokens.length) {
      const token = currentLine.tokens[this.currentTokenIndex];
      this.displayedLines[this.currentLineIndex].tokens.push(token);
      this.currentTokenIndex++;
      this.render();
      
      // Smooth and natural delays
      let delay = 80; // Base delay
      
      // Adjust based on token type and length
      if (token.type === 'string') {
        delay = 100; // Strings take slightly longer
      } else if (token.type === 'keyword' || token.type === 'class-name') {
        delay = 85; // Keywords medium speed
      } else if (token.text.length <= 2) {
        delay = 60; // Quick for short tokens like () {} ;
      } else if (token.text.length > 15) {
        delay = 120; // Longer for long strings
      }
      
      setTimeout(() => this.typeNextToken(), delay);
    } else {
      // Move to next line with natural pause
      this.currentLineIndex++;
      this.currentTokenIndex = 0;
      setTimeout(() => this.typeNextToken(), 200);
    }
  }

  render() {
    let html = '';
    
    this.displayedLines.forEach((line, index) => {
      if (!line) return;
      
      html += `<span class="line-number">${line.num}</span>  `;
      
      line.tokens.forEach((token, tokenIndex) => {
        const className = token.type !== 'plain' ? token.type : '';
        const isLastToken = (index === this.displayedLines.length - 1) && 
                           (tokenIndex === line.tokens.length - 1);
        
        if (className) {
          html += `<span class="${className}">${this.escapeHtml(token.text)}`;
          if (isLastToken && this.currentLineIndex < codeLines.length) {
            html += `<span class="typing-cursor">|</span>`;
          }
          html += `</span> `;
        } else {
          html += `${this.escapeHtml(token.text)}`;
          if (isLastToken && this.currentLineIndex < codeLines.length) {
            html += `<span class="typing-cursor">|</span>`;
          }
          html += ` `;
        }
      });
      
      html += '\n';
    });
    
    this.codeElement.innerHTML = html;
  }

  reset() {
    this.currentLineIndex = 0;
    this.currentTokenIndex = 0;
    this.displayedLines = [];
    this.codeElement.innerHTML = '';
    setTimeout(() => this.startTyping(), 500);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize code typing animation
window.addEventListener('load', () => {
  new CodeTypingAnimation();
});

// ========================================
// PARTICLE BACKGROUND SYSTEM
// ========================================

const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Particle class with smoother movement
  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
      this.opacity = Math.random() * 0.5 + 0.3;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.size = Math.random() * 2.5 + 1;
      this.speedY = Math.random() * 1 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.6 + 0.4;
      this.color = Math.random() > 0.7 ? 'rgba(255, 138, 0, ' : 'rgba(255, 255, 255, ';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Smoother drift effect
      this.x += Math.sin(this.y * 0.005) * 0.3;

      // Reset if particle goes off screen
      if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  function init() {
    resizeCanvas();
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Smooth animation loop with requestAnimationFrame
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
// CUSTOM CURSOR
// ========================================

const cursor = document.createElement('div');
const cursorDot = document.createElement('div');
const cursorGlow = document.createElement('div');
cursor.className = 'custom-cursor';
cursorDot.className = 'custom-cursor-dot';
cursorGlow.className = 'custom-cursor-glow';
document.body.appendChild(cursorGlow);
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let dotX = 0;
let dotY = 0;
let glowX = 0;
let glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Instant position for dot
  dotX = e.clientX;
  dotY = e.clientY;
  
  // Instant position for glow
  glowX = e.clientX;
  glowY = e.clientY;
});

// Smooth cursor follow animation
function animateCursor() {
  // Smooth easing for outer cursor
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top = dotY + 'px';
  
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  
  requestAnimationFrame(animateCursor);
}

animateCursor();

// Hover effects on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, .tech-item, .project-feature, .timeline-item');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover');
    cursorDot.classList.add('cursor-hover');
    cursorGlow.classList.add('cursor-hover');
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover');
    cursorDot.classList.remove('cursor-hover');
    cursorGlow.classList.remove('cursor-hover');
  });
});

// Click effect
document.addEventListener('mousedown', () => {
  cursor.classList.add('cursor-click');
  cursorDot.classList.add('cursor-click');
  cursorGlow.classList.add('cursor-click');
});

document.addEventListener('mouseup', () => {
  cursor.classList.remove('cursor-click');
  cursorDot.classList.remove('cursor-click');
  cursorGlow.classList.remove('cursor-click');
});

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
// CONSOLE
// ========================================

console.log('✓ Portfolio loaded successfully');
