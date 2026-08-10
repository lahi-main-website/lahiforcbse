// ── Hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-overlay a');
  const mobileResources = document.querySelector('.mobile-nav-dropdown');
  const mobileResourcesToggle = document.querySelector('.mobile-dropdown-toggle');

  function closeMobileNav() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    if (mobileResources && mobileResourcesToggle) {
      mobileResources.classList.remove('is-open');
      mobileResourcesToggle.setAttribute('aria-expanded', 'false');
    }
  }
 
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', mobileNav.classList.contains('open') ? 'true' : 'false');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
 
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  if (mobileResources && mobileResourcesToggle) {
    mobileResourcesToggle.addEventListener('click', () => {
      const isOpen = mobileResources.classList.toggle('is-open');
      mobileResourcesToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ── Resources dropdown ──
  const resourcesDropdown = document.getElementById('resources-dropdown');
  const resourcesToggle = resourcesDropdown && resourcesDropdown.querySelector('.dropdown-toggle');

  function setResourcesDropdown(open) {
    if (!resourcesDropdown || !resourcesToggle) return;
    resourcesDropdown.classList.toggle('is-open', open);
    resourcesToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (resourcesDropdown && resourcesToggle) {
    resourcesToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      setResourcesDropdown(!resourcesDropdown.classList.contains('is-open'));
    });
    resourcesDropdown.addEventListener('mouseenter', () => setResourcesDropdown(true));
    resourcesDropdown.addEventListener('mouseleave', () => {
      if (!resourcesDropdown.contains(document.activeElement)) setResourcesDropdown(false);
    });
    resourcesDropdown.addEventListener('focusin', () => setResourcesDropdown(true));
    resourcesDropdown.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!resourcesDropdown.contains(document.activeElement)) setResourcesDropdown(false);
      }, 0);
    });
    resourcesDropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setResourcesDropdown(false));
    });
    document.addEventListener('click', (event) => {
      if (!resourcesDropdown.contains(event.target)) setResourcesDropdown(false);
    });
    resourcesDropdown.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setResourcesDropdown(false);
        resourcesToggle.focus();
      }
    });
  }

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));

  // ── Hero checklist animation ──
  const checkItems = document.querySelectorAll('.hero-check-item');
  checkItems.forEach(item => {
    const delay = parseInt(item.dataset.delay) || 0;
    setTimeout(() => item.classList.add('visible'), delay);
  });

  // ── Stat counter animation ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      el.textContent = current + suffix;
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  }

  const statsSection = document.querySelector('.hero-stats-animate');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.stat-num[data-count]').forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // ── Policy deadline countdown ──
  const countdown = document.getElementById('policy-countdown');
  const countdownTarget = Date.parse('2027-08-22T23:59:00+05:30');
  let countdownTimer = null;

  function getCountdownParts(now, target) {
    const remaining = Math.max(0, target - now);
    return {
      remaining,
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000),
    };
  }

  function updateCountdown() {
    if (!countdown) return;
    const parts = getCountdownParts(Date.now(), countdownTarget);
    const widths = { days: 3, hours: 2, minutes: 2, seconds: 2 };
    Object.keys(widths).forEach(unit => {
      const element = countdown.querySelector(`[data-countdown="${unit}"]`);
      if (element) element.textContent = String(parts[unit]).padStart(widths[unit], '0');
    });

    if (parts.remaining === 0) {
      countdown.classList.add('is-expired');
      const status = document.getElementById('countdown-status');
      if (status) status.textContent = 'Deadline reached';
      if (countdownTimer) clearInterval(countdownTimer);
    }
  }

  if (countdown) {
    updateCountdown();
    if (Date.now() < countdownTarget) countdownTimer = setInterval(updateCountdown, 1000);
  }

  // ── Partner Schools stat counter animation ──
  const partnersStats = document.querySelector('.partners-stats');
  if (partnersStats) {
    const partnersStatsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.partners-stat-num[data-count]').forEach(animateCounter);
          partnersStatsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    partnersStatsObserver.observe(partnersStats);
  }

  // ── Programme card accordions ──
  const programmeCards = document.querySelectorAll('.programme-card');

  function setProgrammeCard(card, open) {
    const toggle = card.querySelector('.programme-toggle');
    const details = card.querySelector('.programme-details');
    if (!toggle || !details) return;

    if (open) {
      details.hidden = false;
      requestAnimationFrame(() => card.classList.add('is-expanded'));
    } else {
      card.classList.remove('is-expanded');
      window.setTimeout(() => {
        if (!card.classList.contains('is-expanded')) details.hidden = true;
      }, 460);
    }
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    const label = toggle.querySelector('span:first-child');
    if (label) label.textContent = open ? 'Read less' : 'Read more';
  }

  programmeCards.forEach(card => {
    const toggle = card.querySelector('.programme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const shouldOpen = !card.classList.contains('is-expanded');
      programmeCards.forEach(otherCard => setProgrammeCard(otherCard, false));
      if (shouldOpen) setProgrammeCard(card, true);
    });
  });

  // ── Partner Schools logo modal (click a logo to view name) ──
  (function initPartnerModal() {
    const cards = document.querySelectorAll('.partner-logo-card');
    if (!cards.length) return;

    // Build modal markup once and append to <body> (keeps existing HTML untouched)
    const overlay = document.createElement('div');
    overlay.className = 'partner-modal-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="partner-modal" role="dialog" aria-modal="true" aria-labelledby="partner-modal-name">
        <button type="button" class="partner-modal-close" aria-label="Close">&times;</button>
        <div class="partner-modal-logo-wrap">
          <img class="partner-modal-logo" src="" alt="" />
        </div>
        <div class="partner-modal-name" id="partner-modal-name"></div>
        <span class="partner-modal-badge">Partner School</span>
      </div>
    `;
    document.body.appendChild(overlay);

    const modal      = overlay.querySelector('.partner-modal');
    const closeBtn    = overlay.querySelector('.partner-modal-close');
    const modalImg    = overlay.querySelector('.partner-modal-logo');
    const modalName   = overlay.querySelector('.partner-modal-name');

    let lastFocused = null;

    function getFocusable() {
      return modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    }

    function openModal(card) {
      const img  = card.querySelector('img');
      const name = card.dataset.school || (img ? img.alt : '');
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = name;
      }
      modalName.textContent = name;

      lastFocused = document.activeElement;
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    cards.forEach(card => {
      card.addEventListener('click', () => openModal(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
    });

    closeBtn.addEventListener('click', closeModal);

    // Click outside the modal (on the dark overlay) closes it
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // ESC closes; Tab is trapped within the modal while open
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = Array.from(getFocusable());
        if (!focusable.length) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  })();

  // ── Resource card accordion ──
  document.querySelectorAll('.resource-card-visible').forEach(visible => {
    const card = visible.closest('.resource-card');
    const btn = visible.querySelector('.resource-view-btn');
    visible.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');
      // Close all
      document.querySelectorAll('.resource-card.is-open').forEach(c => {
        c.classList.remove('is-open');
        const b = c.querySelector('.resource-view-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      // Open this one (toggle)
      if (!isOpen) {
        card.classList.add('is-open');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

 
  // ── Form submission → Google Forms ──
  function submitForm() {
    const name        = document.getElementById('principal-name').value.trim();
    const designation = document.getElementById('designation').value.trim();
    const school      = document.getElementById('school-name').value.trim();
    const city        = document.getElementById('city').value.trim();
    const state       = document.getElementById('state').value.trim();
    const mobile      = document.getElementById('mobile').value.trim();
    const email       = document.getElementById('email').value.trim();
    const interest    = document.getElementById('interest').value.trim();
    const message     = document.getElementById('message').value.trim();
    const visitRadio  = document.querySelector('input[name="visit-interest"]:checked');
    const visit       = visitRadio ? visitRadio.value : '';
 
    const visitMap = {
      'yes':   "Yes, I'm interested",
      'maybe': 'Possibly — tell me more',
      'no':    'Not this time'
    };
    const visitValue = visitMap[visit] || '';
 
    if (!name || !school || !mobile || !email || !city) {
      alert('Please fill in all required fields (Name, School, City, Mobile, Email).');
      return;
    }
 
    const FORM_ACTION = 'https://docs.google.com/forms/u/0/d/1IJOLYOuNVDQh9KapRbA--t02vHXOp6-6NmfW8ajwb7w/formResponse';
 
    const data = {
      'entry.1636702703': name,
      'entry.627595311':  designation,
      'entry.1668516713': school,
      'entry.1389543012': city,
      'entry.260021911':  state,
      'entry.981096840':  mobile,
      'entry.330010300':  email,
      'entry.1586340247': interest,
      'entry.1715431669': message,
      'entry.423992715':  visitValue,
      'fvv': '1',
      'fbzx': '5975148213623573533'
    };
 
    let iframe = document.getElementById('gform-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'gform-iframe';
      iframe.name = 'gform-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
 
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = FORM_ACTION;
    form.target = 'gform-iframe';
    form.style.display = 'none';
 
    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
 
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
 
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
  }

// ══════════════════════════════════════════════════════════════
//  LAHI × CBSE — CMS, FAQ, Timetable Modal
//  Complete rewrite — fully debugged with console logs at every stage
//  Original code above is untouched.
// ══════════════════════════════════════════════════════════════

console.log('[LAHI CMS] script.js loaded — initialising CMS module');

// ── Configuration ─────────────────────────────────────────────
// Google Workspace domain GAS URL — uses JSONP strategy (see loadCMSData)
const CMS_API_URL        = 'https://script.google.com/macros/s/AKfycbwdHXBfLPtdxupQVBr6NtZtQQHdt9cMkIX2xi1bqyoaWQdaMSPxZ1P82k8EcgJAiQQy/exec';


const FAQ_JSON_URL       = './faq-data.json';
const RESOURCES_JSON_URL = './resources.json';
const JSONP_TIMEOUT_MS   = 7000; // 7 s before falling back to local JSON

// ── Global state ──────────────────────────────────────────────
let allFAQs       = [];
let currentCat    = 'All';
let currentSearch = '';
let resourcesData = { webinars: [], brochures: [] };

// ══════════════════════════════════════════════════════════════
//  BOOT — single DOMContentLoaded listener
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function initCMS() {
  console.log('[LAHI CMS] DOMContentLoaded fired — starting boot sequence');

  // ── Timetable modal overlay click / ESC ───────────────────
  const overlay = document.getElementById('timetable-modal');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeTimetableModal();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeTimetableModal();
  });

  // ── Verify all required DOM containers exist ──────────────
  const containers = {
    'faq-list':       document.getElementById('faq-list'),
    'faq-empty':      document.getElementById('faq-empty'),
    'faq-error':      document.getElementById('faq-error'),
    'faq-search':     document.getElementById('faq-search'),
    'webinar-cards':  document.getElementById('webinar-cards'),
    'webinar-error':  document.getElementById('webinar-error'),
    'brochure-cards': document.getElementById('brochure-cards'),
    'brochure-error': document.getElementById('brochure-error'),
  };
  Object.entries(containers).forEach(([id, el]) => {
    if (!el) console.warn('[LAHI CMS] ⚠ DOM element not found: #' + id);
    else      console.log('[LAHI CMS] ✓ Found #' + id);
  });

  // ── FAQ controls ───────────────────────────────────────────
  const faqSearch = document.getElementById('faq-search');
  const faqCats = document.getElementById('faq-cats');
  const faqList = document.getElementById('faq-list');

  if (faqSearch) {
    faqSearch.addEventListener('input', function() {
      currentSearch = faqSearch.value;
      renderFAQs();
    });
  }
  if (faqCats) {
    faqCats.addEventListener('click', function(event) {
      const button = event.target.closest('.faq-cat');
      if (!button) return;
      setFAQCat(button);
    });
  }
  if (faqList) {
    faqList.addEventListener('click', function(event) {
      const button = event.target.closest('.faq-q-btn');
      if (!button) return;
      toggleFAQItem(button.closest('.faq-item'));
    });
  }

  // ── Kick off independent FAQ and resource data loads ─────
  loadFAQData();
  loadCMSData();
});

// ══════════════════════════════════════════════════════════════
//  TIMETABLE MODAL
// ══════════════════════════════════════════════════════════════
function openTimetableModal() {
  console.log('[LAHI Timetable] Opening modal');
  var modal = document.getElementById('timetable-modal');
  if (!modal) { console.error('[LAHI Timetable] Modal element not found!'); return; }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeTimetableModal() {
  var modal = document.getElementById('timetable-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  console.log('[LAHI Timetable] Modal closed');
}

// ══════════════════════════════════════════════════════════════
//  CMS DATA LOADER
//  FAQs always come from faq-data.json. Resource strategy:
//    1. JSONP → Google Apps Script (handles Workspace /a/macros/ domain)
//    2. On failure/timeout → local resources.json
//    3. On both failures → show friendly resource error messages
// ══════════════════════════════════════════════════════════════
function loadCMSData() {
  console.log('[LAHI CMS] Starting resource data load...');
  console.log('[LAHI CMS] API URL:', CMS_API_URL);
  console.log('[LAHI CMS] Resource strategy: JSONP first, resources.json fallback');

  var callbackName = '__gasCallback_' + Date.now();
  var settled      = false;
  var scriptEl     = null;

  // Build JSONP URL
  try {
    var jsonpURL = new URL(CMS_API_URL);
    jsonpURL.searchParams.set('callback', callbackName);
    console.log('[LAHI CMS] JSONP URL:', jsonpURL.toString());
  } catch (urlErr) {
    console.error('[LAHI CMS] Invalid API URL — falling back to local resources immediately:', urlErr.message);
    loadLocalResources();
    return;
  }

  // Timeout guard
  var timeoutTimer = setTimeout(function() {
    if (settled) return;
    settled = true;
    console.warn('[LAHI CMS] JSONP timed out after ' + JSONP_TIMEOUT_MS + 'ms — falling back to local resources');
    cleanup();
    loadLocalResources();
  }, JSONP_TIMEOUT_MS);

  // Register global callback that GAS will call
  window[callbackName] = function(data) {
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    cleanup();
    console.log('[LAHI CMS] ✅ JSONP callback received from Google Apps Script');
    console.log('[LAHI CMS] Response keys:', data ? Object.keys(data) : 'null/undefined');

    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error('[LAHI CMS] Invalid response — not an object. Value:', data);
      loadLocalResources();
      return;
    }
    if (data.error) {
      console.error('[LAHI CMS] GAS returned error:', data.error);
      loadLocalResources();
      return;
    }
    if (!Array.isArray(data.webinars)) {
      console.warn('[LAHI CMS] data.webinars is not an array:', typeof data.webinars, '— will use []');
    }
    if (!Array.isArray(data.brochures)) {
      console.warn('[LAHI CMS] data.brochures is not an array:', typeof data.brochures, '— will use []');
    }

    resourcesData = {
      webinars:  Array.isArray(data.webinars)  ? data.webinars  : [],
      brochures: Array.isArray(data.brochures) ? data.brochures : []
    };

    console.log('[LAHI CMS] Resource data from GAS — Webinars:', resourcesData.webinars.length,
      '| Brochures:', resourcesData.brochures.length);

    renderWebinars();
    renderBrochures();
    console.log('[LAHI CMS] lastUpdated from GAS:', data.lastUpdated || 'not provided');
  };

  // Inject script tag
  scriptEl = document.createElement('script');
  scriptEl.src = jsonpURL.toString();
  scriptEl.onerror = function(e) {
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    cleanup();
    console.warn('[LAHI CMS] JSONP script tag failed to load (network/CORS/auth block) — falling back to local resources');
    console.warn('[LAHI CMS] Script error event:', e);
    loadLocalResources();
  };
  document.head.appendChild(scriptEl);
  console.log('[LAHI CMS] JSONP script tag injected into <head>');

  function cleanup() {
    delete window[callbackName];
    if (scriptEl && scriptEl.parentNode) {
      scriptEl.parentNode.removeChild(scriptEl);
    }
    console.log('[LAHI CMS] Cleanup done — callback removed from window');
  }
}

// ── Authoritative local FAQ data ──────────────────────────────
function loadFAQData() {
  console.log('[LAHI FAQ] Loading authoritative local FAQ data...');
  console.log('[LAHI CMS] FAQ URL:', FAQ_JSON_URL);
  fetch(FAQ_JSON_URL)
    .then(function(r) {
      console.log('[LAHI FAQ] faq-data.json HTTP status:', r.status, r.ok ? 'OK' : 'FAIL');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(faqData) {
      if (!Array.isArray(faqData)) {
        throw new TypeError('faq-data.json must contain a JSON array');
      }

      allFAQs = faqData;
      console.log('[LAHI FAQ] ✅ Local FAQ data loaded — FAQs:', allFAQs.length);

      if (allFAQs.length === 0) {
        console.warn('[LAHI FAQ] ⚠ FAQ array is empty — check faq-data.json');
      }

      renderFAQCategories();
      renderFAQs();
    })
    .catch(function(err) {
      console.error('[LAHI FAQ] ❌ faq-data.json failed to load:', err.message);
      showFAQError();
    });
}

// ── Local resource fallback ───────────────────────────────────
function loadLocalResources() {
  console.log('[LAHI CMS] Loading resources from local JSON...');
  console.log('[LAHI CMS] Resources URL:', RESOURCES_JSON_URL);

  fetch(RESOURCES_JSON_URL)
    .then(function(r) {
      console.log('[LAHI CMS] resources.json HTTP status:', r.status, r.ok ? 'OK' : 'FAIL');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(resData) {
      if (!resData || typeof resData !== 'object' || Array.isArray(resData)) {
        throw new TypeError('resources.json must contain a JSON object');
      }

      resourcesData = {
        webinars:  Array.isArray(resData.webinars)  ? resData.webinars  : [],
        brochures: Array.isArray(resData.brochures) ? resData.brochures : []
      };

      console.log('[LAHI CMS] ✅ Local resources loaded — Webinars:', resourcesData.webinars.length,
        '| Brochures:', resourcesData.brochures.length);

      renderWebinars();
      renderBrochures();
    })
    .catch(function(err) {
      console.error('[LAHI CMS] ❌ resources.json failed to load:', err.message);
      showWebinarError();
      showBrochureError();
    });
}

// ══════════════════════════════════════════════════════════════
//  FAQ RENDERING
// ══════════════════════════════════════════════════════════════
function renderFAQCategories() {
  var container = document.getElementById('faq-cats');
  if (!container) return;

  var categoriesByKey = new Map();
  allFAQs.forEach(function(faq) {
    var status = normalizeText(faq && faq.status);
    var category = String(faq && faq.category || '').trim();
    if ((!status || status === 'active') && category) {
      var key = normalizeText(category);
      if (!categoriesByKey.has(key)) categoriesByKey.set(key, category);
    }
  });

  var categories = Array.from(categoriesByKey.values());
  var currentKey = normalizeText(currentCat);
  var currentExists = currentKey === 'all' || categories.some(function(category) {
    return normalizeText(category) === currentKey;
  });
  if (!currentExists) currentCat = 'All';

  var buttons = ['All'].concat(categories);
  container.innerHTML = buttons.map(function(category) {
    var isActive = normalizeText(category) === normalizeText(currentCat);
    return '<button class="faq-cat' + (isActive ? ' active' : '') + '"' +
      ' data-cat="' + escapeHTML(category) + '"' +
      ' role="tab" aria-controls="faq-list" aria-selected="' + (isActive ? 'true' : 'false') + '">' +
      escapeHTML(category) + '</button>';
  }).join('');

  console.log('[LAHI FAQ] Category filters rendered from data:', categories);
}

function renderFAQs() {
  console.log('[LAHI FAQ] renderFAQs() called');
  console.log('[LAHI FAQ] Total FAQs in memory:', allFAQs.length);
  console.log('[LAHI FAQ] Current category filter:', currentCat);
  console.log('[LAHI FAQ] Current search term:', currentSearch || '(none)');

  var list  = document.getElementById('faq-list');
  var empty = document.getElementById('faq-empty');
  var error = document.getElementById('faq-error');

  if (!list) {
    console.error('[LAHI FAQ] ❌ #faq-list not found in DOM!');
    return;
  }

  // Hide error state
  if (error) error.style.display = 'none';

  var normalizedCategory = normalizeText(currentCat);
  var term = normalizeText(currentSearch);

  // Preserve each record's source index so accordion IDs remain stable after filtering.
  var filtered = allFAQs.map(function(faq, sourceIndex) {
    return { faq: faq, sourceIndex: sourceIndex };
  }).filter(function(record) {
    var faq = record.faq || {};
    // Status check — only show Active records
    var status = normalizeText(faq.status);
    var statusOk = !status || status === 'active';
    if (!statusOk) {
      console.log('[LAHI FAQ] Filtered out by status:', faq.question && faq.question.substring(0,40), '— status:', faq.status);
      return false;
    }
    // Category check
    var matchCat = normalizedCategory === 'all' || normalizeText(faq.category) === normalizedCategory;
    // Search check
    var matchSearch = !term
      || normalizeText(faq.question).includes(term)
      || normalizeText(faq.answer).includes(term)
      || normalizeText(faq.category).includes(term);

    return matchCat && matchSearch;
  });

  console.log('[LAHI FAQ] FAQs after filtering:', filtered.length);

  if (filtered.length === 0) {
    list.innerHTML = '';
    if (empty) {
      empty.style.display = 'block';
      empty.querySelector('p').textContent = allFAQs.length === 0
        ? 'FAQs are loading or unavailable. Please refresh the page.'
        : 'No FAQs match your search. Try a different keyword or category.';
    }
    console.log('[LAHI FAQ] No results — showing empty state. Total in memory:', allFAQs.length);
    return;
  }

  if (empty) empty.style.display = 'none';

  list.innerHTML = filtered.map(function(record) {
    var faq = record.faq || {};
    var id = record.sourceIndex;
    return (
      '<div class="faq-item" id="faq-item-' + id + '">' +
        '<button class="faq-q-btn" id="faq-question-' + id + '" aria-expanded="false" aria-controls="faq-answer-' + id + '">' +
          '<span class="faq-q-cat-badge">' + escapeHTML(faq.category || '') + '</span>' +
          '<span class="faq-q-text">'     + escapeHTML(faq.question  || '') + '</span>' +
          '<span class="faq-q-arrow">↓</span>' +
        '</button>' +
        '<div class="faq-answer" id="faq-answer-' + id + '" role="region" aria-labelledby="faq-question-' + id + '">' +
          '<div class="faq-answer-inner">' + escapeHTML(faq.answer || '') + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  console.log('[LAHI FAQ] ✅ Rendered', filtered.length, 'FAQ items into #faq-list');
}

function toggleFAQItem(item) {
  if (!item) return;
  var isOpen = item.classList.contains('open');
  // Close all open items
  document.querySelectorAll('.faq-item.open').forEach(function(el) {
    el.classList.remove('open');
    var btn = el.querySelector('.faq-q-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
  // Open clicked item (toggle)
  if (!isOpen) {
    item.classList.add('open');
    var btn = item.querySelector('.faq-q-btn');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
}

// Retained for compatibility with any external integrations that call it.
function filterFAQs() {
  var searchEl = document.getElementById('faq-search');
  currentSearch = searchEl ? searchEl.value : '';
  console.log('[LAHI FAQ] Search filter changed:', currentSearch);
  renderFAQs();
}

function setFAQCat(btn) {
  if (!btn) return;
  currentCat = String(btn.dataset.cat || 'All').trim();
  console.log('[LAHI FAQ] Category changed to:', currentCat);
  document.querySelectorAll('.faq-cat').forEach(function(b) {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  renderFAQs();
}

function normalizeText(value) {
  return String(value == null ? '' : value).trim().toLocaleLowerCase('en-IN');
}

function showFAQError() {
  console.error('[LAHI FAQ] Showing FAQ error state');
  var list  = document.getElementById('faq-list');
  var err   = document.getElementById('faq-error');
  var empty = document.getElementById('faq-empty');
  if (list)  list.innerHTML = '';
  if (empty) empty.style.display = 'none';
  if (err)   err.style.display = 'block';
}

// ══════════════════════════════════════════════════════════════
//  WEBINAR RENDERING
// ══════════════════════════════════════════════════════════════
function renderWebinars() {
  console.log('[LAHI Webinars] renderWebinars() called');
  var container = document.getElementById('webinar-cards');
  var errEl     = document.getElementById('webinar-error');
  if (!container) { console.error('[LAHI Webinars] ❌ #webinar-cards not found!'); return; }

  var webinars = resourcesData.webinars || [];
  console.log('[LAHI Webinars] Count:', webinars.length);

  if (webinars.length === 0) {
    console.warn('[LAHI Webinars] No webinars to render — showing error/update message');
    showWebinarError();
    return;
  }

  container.innerHTML = webinars.map(function(w) {
    var thumbHtml = w.thumbnail
      ? '<img src="' + escapeHTML(w.thumbnail) + '" alt="' + escapeHTML(w.title || '') + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />'
      : '<div class="webinar-thumb-placeholder"><div class="webinar-play-icon">▶</div><span class="webinar-thumb-label">Webinar Recording</span></div>';

    return (
      '<div class="webinar-card">' +
        '<div class="webinar-thumb">' + thumbHtml + '</div>' +
        '<div class="webinar-body">' +
          '<div class="webinar-title">' + escapeHTML(w.title       || '') + '</div>' +
          '<div class="webinar-desc">'  + escapeHTML(w.description || '') + '</div>' +
          '<a href="' + escapeHTML(w.recordingLink || '#') + '" target="_blank" rel="noopener" class="webinar-watch-btn">▶ Watch Recording</a>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  if (errEl) errEl.style.display = 'none';
  console.log('[LAHI Webinars] ✅ Rendered', webinars.length, 'webinar cards');
}

function showWebinarError() {
  var container = document.getElementById('webinar-cards');
  var err       = document.getElementById('webinar-error');
  if (container) container.innerHTML = '';
  if (err)       err.style.display = 'block';
  console.warn('[LAHI Webinars] Error/empty state shown');
}

// ══════════════════════════════════════════════════════════════
//  BROCHURE RENDERING
// ══════════════════════════════════════════════════════════════
function renderBrochures() {
  console.log('[LAHI Brochures] renderBrochures() called');
  var container = document.getElementById('brochure-cards');
  var errEl     = document.getElementById('brochure-error');
  if (!container) { console.error('[LAHI Brochures] ❌ #brochure-cards not found!'); return; }

  var brochures = resourcesData.brochures || [];
  console.log('[LAHI Brochures] Count:', brochures.length);

  if (brochures.length === 0) {
    console.warn('[LAHI Brochures] No brochures to render — showing error/update message');
    showBrochureError();
    return;
  }

  container.innerHTML = brochures.map(function(b) {
    var isPlaceholder = !b.fileURL || b.fileURL === '#';
    var btnHtml = isPlaceholder
      ? '<span class="brochure-dl-btn" style="opacity:0.5;cursor:default;" title="Coming soon">⏳ Coming Soon</span>'
      : '<a href="' + escapeHTML(b.fileURL) + '" target="_blank" rel="noopener" class="brochure-dl-btn" download>↓ Download PDF</a>';

    return (
      '<div class="brochure-card">' +
        '<div class="brochure-icon-wrap">' + (b.icon || '📄') + '</div>' +
        '<div class="brochure-title">'     + escapeHTML(b.title       || '') + '</div>' +
        '<div class="brochure-desc">'      + escapeHTML(b.description || '') + '</div>' +
        btnHtml +
      '</div>'
    );
  }).join('');

  if (errEl) errEl.style.display = 'none';
  console.log('[LAHI Brochures] ✅ Rendered', brochures.length, 'brochure cards');
}

function showBrochureError() {
  var container = document.getElementById('brochure-cards');
  var err       = document.getElementById('brochure-error');
  if (container) container.innerHTML = '';
  if (err)       err.style.display = 'block';
  console.warn('[LAHI Brochures] Error/empty state shown');
}

// ══════════════════════════════════════════════════════════════
//  RESOURCE TABS
// ══════════════════════════════════════════════════════════════
function switchResTab(btn) {
  var tab = btn.dataset.tab;
  console.log('[LAHI Resources] Tab switched to:', tab);

  document.querySelectorAll('.res-tab').forEach(function(t) {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  ['guides', 'webinars', 'brochures'].forEach(function(name) {
    var panel = document.getElementById('res-panel-' + name);
    if (panel) panel.style.display = (name === tab) ? 'block' : 'none';
  });

  // Lazy-render: if switching to webinars or brochures tab for first time,
  // re-render in case data arrived after initial render attempt
  if (tab === 'webinars' && resourcesData.webinars.length > 0) {
    var wc = document.getElementById('webinar-cards');
    if (wc && !wc.querySelector('.webinar-card')) {
      console.log('[LAHI Resources] Tab webinars: triggering lazy render');
      renderWebinars();
    }
  }
  if (tab === 'brochures' && resourcesData.brochures.length > 0) {
    var bc = document.getElementById('brochure-cards');
    if (bc && !bc.querySelector('.brochure-card')) {
      console.log('[LAHI Resources] Tab brochures: triggering lazy render');
      renderBrochures();
    }
  }
}

// ══════════════════════════════════════════════════════════════
//  UTILITY
// ══════════════════════════════════════════════════════════════
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

console.log('[LAHI CMS] Module definitions complete — waiting for DOMContentLoaded');
