/**
 * Siddarth Santosh Personal Website
 * Production Client Script for Contact Form Handling (Serverless API Email Dispatch)
 * Target Recipient: dhyanesh450@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

/**
 * Initializes automatic serverless API contact form submission
 * Sends email directly in the background without opening any mail app.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusBox = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Send message';
  
  // Configured recipient email
  const RECEIVER_EMAIL = 'dhyanesh450@gmail.com';
  const API_ENDPOINT = `https://formsubmit.co/ajax/${RECEIVER_EMAIL}`;

  form.addEventListener('submit', async (e) => {
    // Prevent default form reload and prevent mailto app from opening
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
      submitBtn.textContent = 'Sending message...';
    }
    hideStatus();

    try {
      // Trigger serverless API in background to send email
      const response = await fetch(API_ENDPOINT, {
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

      const data = await response.json();

      if (data.success === 'true' || response.ok) {
        showStatus('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
      } else if (data.message && data.message.includes('Activation')) {
        // First-time activation notice sent to inbox
        showStatus(
          `Form is pending one-time activation. A confirmation link was sent to ${RECEIVER_EMAIL} — please click it once in your inbox to enable instant deliveries.`,
          'success'
        );
        form.reset();
      } else {
        showStatus(data.message || 'Unable to send message at this time. Please try again.', 'error');
      }
    } catch (err) {
      console.error('API Email dispatch error:', err);
      showStatus('Network error while sending. Please check your connection and try again.', 'error');
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
