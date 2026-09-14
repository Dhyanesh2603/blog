/**
 * Siddarth Santosh Personal Website
 * Client Script for Contact Form Handling (Serverless API Email Dispatch)
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

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
