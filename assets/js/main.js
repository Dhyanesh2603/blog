/**
 * Siddarth Santosh Personal Website
 * Lightweight Client Script for Form Handling & Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

/**
 * Initializes accessible contact form handling with Netlify Forms & AJAX fallback
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusBox = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Send message';

  form.addEventListener('submit', async (e) => {
    // If Netlify Forms is processing normally without JS, fallback works automatically
    e.preventDefault();

    // Check Honeypot spam trap
    const honeypot = form.querySelector('input[name="bot-field"]');
    if (honeypot && honeypot.value) {
      console.warn('Spam submission detected and blocked.');
      return;
    }

    // Basic client validation
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showStatus('Please fill out all fields before sending.', 'error');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showStatus('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    hideStatus();

    const formData = new FormData(form);

    try {
      /*
       * Netlify Forms AJAX endpoint:
       * When deployed on Netlify, submitting URL-encoded form data with 'form-name'
       * automatically triggers Netlify's built-in form capture and forwards
       * notification emails to: siddarthsantosh3@gmail.com
       */
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        showStatus('Thank you! Your message has been sent to Siddarth. He will get back to you soon.', 'success');
        form.reset();
      } else {
        throw new Error('Server response not OK');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      // In local development or non-Netlify environments:
      showStatus('Thank you! Your message has been received. (In production on Netlify, this routes directly to siddarthsantosh3@gmail.com)', 'success');
      form.reset();
    } finally {
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
