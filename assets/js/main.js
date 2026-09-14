/**
 * Siddarth Santosh Personal Website
 * Client Script for Contact Form Handling (Configured for dhyanesh450@gmail.com)
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

/**
 * Initializes contact form handling with direct mailto triggering for local testing
 * Target Recipient: dhyanesh450@gmail.com
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusBox = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Send message';
  
  // Configured recipient for testing
  const RECEIVER_EMAIL = 'dhyanesh450@gmail.com';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check Honeypot spam trap
    const honeypot = form.querySelector('input[name="bot-field"]');
    if (honeypot && honeypot.value) {
      console.warn('Spam submission detected and blocked.');
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
      submitBtn.textContent = 'Opening email client...';
    }
    hideStatus();

    // Construct mailto link
    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n---\nFrom: ${name}\nEmail: ${email}`);
    const mailtoUrl = `mailto:${RECEIVER_EMAIL}?subject=${subject}&body=${body}`;

    try {
      // Trigger user's mail client directly
      window.location.href = mailtoUrl;

      // Display clear status message with fallback link
      showStatusHTML(
        `Opening your email client to send to <strong>${RECEIVER_EMAIL}</strong>. ` +
        `If it didn't open automatically, <a href="${mailtoUrl}" style="text-decoration:underline; font-weight:600; color:inherit;">click here to open your mail app</a>.`,
        'success'
      );
      form.reset();
    } catch (err) {
      console.error('Mailto error:', err);
      showStatusHTML(
        `Please <a href="${mailtoUrl}" style="text-decoration:underline; color:inherit;">click here to email ${RECEIVER_EMAIL}</a> directly.`,
        'error'
      );
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

  function showStatusHTML(html, type) {
    if (!statusBox) return;
    statusBox.innerHTML = html;
    statusBox.className = `form-status ${type}`;
  }

  function hideStatus() {
    if (!statusBox) return;
    statusBox.textContent = '';
    statusBox.className = 'form-status hidden';
  }
}
