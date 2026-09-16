/**
 * Siddarth Santosh Personal Website
 * Client Script for Contact Form Handling (Serverless API Email Dispatch)
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initBackToTop();
  initScrollAnimations();
  initContactForm();
});

/**
 * 1. Reading Scroll Progress Bar (Top of Viewport)
 */
function initReadingProgressBar() {
  let bar = document.getElementById('reading-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);
  }

  let ticking = false;
  function updateProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) {
      const scrolled = (window.scrollY / total) * 100;
      bar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

/**
 * 2. Back to Top Floating Button (Bottom Right Corner)
 */
function initBackToTop() {
  let btn = document.getElementById('back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top of page');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    `;
    document.body.appendChild(btn);
  }

  let isVisible = false;
  function toggleBtn() {
    const shouldShow = window.scrollY > 280;
    if (shouldShow !== isVisible) {
      isVisible = shouldShow;
      if (isVisible) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        toggleBtn();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  toggleBtn();
}

/**
 * 3. Scroll Reveal Animation for Content Sections and Cards
 */
function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const targets = document.querySelectorAll('.series, .card, .story-photo-figure, .photo-tile, .pullquote, .stat-row, .next-card, .about, .contact');
  if (targets.length === 0) return;

  // Mark all target elements for scroll reveal
  targets.forEach((el, index) => {
    el.classList.add('scroll-reveal');
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Element is already in viewport on load — reveal with a gentle stagger
      setTimeout(() => {
        el.classList.add('revealed');
      }, index * 40);
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.06
    });

    targets.forEach(el => {
      if (!el.classList.contains('revealed')) {
        observer.observe(el);
      }
    });
  } else {
    targets.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * Initializes automatic serverless API contact form submission
 * Sends email directly in the background without disclosing recipient info.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusBox = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Send message';

  // Configured recipient endpoint
  const target = atob('c2lkZGFydGhzYW50b3NoM0BnbWFpbC5jb20=');
  const apiEndpoint = `https://formsubmit.co/ajax/${target}`;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check Honeypot spam trap
    const honeypot = form.querySelector('input[name="bot-field"]');
    if (honeypot && honeypot.value) {
      return;
    }

    // Client field validation
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showStatus('Please fill out all fields before sending.', 'error');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      if (emailInput) emailInput.focus();
      return;
    }

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    hideStatus();

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New message from ${name} (${email})`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      // Show clean, discreet success confirmation without revealing recipient info
      showStatus('Thank you! Your message has been sent.', 'success');
      form.reset();

      if (submitBtn) {
        submitBtn.textContent = 'Message sent ✓';
        setTimeout(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }, 3000);
      }
    } catch (err) {
      console.error('Submission error:', err);
      showStatus('Unable to send message. Please try again later.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });

  function showStatus(message, type) {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.className = `form-status ${type}`;
  }

  function hideStatus() {
    if (!statusBox) return;
    statusBox.textContent = '';
    statusBox.className = 'form-status hidden';
  }
}
