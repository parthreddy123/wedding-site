/* ============================================
   Wedding Site — JavaScript
   - Countdown timer
   - RSVP form validation & submission
   - Smooth scroll & nav effects
   ============================================ */

// ======================
// CONFIGURATION
// ======================

// Set your wedding date and time here (local time)
const WEDDING_DATE = new Date('2026-05-09T18:00:00');

// Replace with your Google Apps Script web app URL after deployment
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';


// ======================
// COUNTDOWN TIMER
// ======================

function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };

  if (diff <= 0) {
    els.days.textContent = '0';
    els.hours.textContent = '0';
    els.minutes.textContent = '0';
    els.seconds.textContent = '0';
    document.querySelector('.countdown-section .section-title').textContent = "Today's the Day!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  els.days.textContent = days;
  els.hours.textContent = hours;
  els.minutes.textContent = minutes;
  els.seconds.textContent = seconds;
}

// Start countdown
updateCountdown();
setInterval(updateCountdown, 1000);


// ======================
// NAV SCROLL EFFECT
// ======================

const nav = document.getElementById('nav');

window.addEventListener('scroll', function () {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});


// ======================
// SMOOTH SCROLL
// ======================

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navHeight = nav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});


// ======================
// SCROLL ANIMATIONS
// ======================

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px',
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.detail-card, .map-wrapper, .rsvp-form').forEach(function (el) {
  observer.observe(el);
});


// ======================
// RSVP FORM
// ======================

const form = document.getElementById('rsvp-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('btn-submit');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors();

  // Validate
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const guests = form.querySelector('#guests');
  const attendance = form.querySelector('input[name="attendance"]:checked');

  let valid = true;

  if (!name.value.trim()) {
    showFieldError(name);
    valid = false;
  }

  if (!email.value.trim() || !isValidEmail(email.value)) {
    showFieldError(email);
    valid = false;
  }

  if (!guests.value) {
    showFieldError(guests);
    valid = false;
  }

  if (!attendance) {
    statusEl.textContent = 'Please indicate whether you will attend.';
    statusEl.className = 'form-status error';
    valid = false;
  }

  if (!valid) return;

  // Build data
  const data = {
    name: name.value.trim(),
    email: email.value.trim(),
    guests: guests.value,
    attendance: attendance.value,
    dietary: form.querySelector('#dietary').value.trim(),
    message: form.querySelector('#message').value.trim(),
    timestamp: new Date().toISOString(),
  };

  // Submit
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    // Demo mode — no real endpoint configured
    setTimeout(function () {
      console.log('RSVP data (demo mode):', data);
      statusEl.textContent = 'Demo mode: RSVP logged to console. Set up Google Sheets to save responses.';
      statusEl.className = 'form-status success';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send RSVP';
      form.reset();
    }, 1000);
    return;
  }

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(function () {
      statusEl.textContent = 'Thank you! Your RSVP has been received.';
      statusEl.className = 'form-status success';
      form.reset();
    })
    .catch(function () {
      statusEl.textContent = 'Something went wrong. Please try again or email us directly.';
      statusEl.className = 'form-status error';
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send RSVP';
    });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(el) {
  el.classList.add('error');
}

function clearErrors() {
  form.querySelectorAll('.error').forEach(function (el) {
    el.classList.remove('error');
  });
  statusEl.textContent = '';
  statusEl.className = 'form-status';
}
