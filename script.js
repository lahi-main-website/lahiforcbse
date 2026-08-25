function directionIconMarkup(direction, className) {
  return '<svg class="direction-icon ' + (className || '') + '" viewBox="0 0 256 256" aria-hidden="true" focusable="false">' +
    '<use href="#direction-arrow-' + direction + '"></use>' +
    '</svg>';
}

// ── Hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-overlay a');
  const mobileResources = document.querySelector('.mobile-nav-dropdown');
  const mobileResourcesToggle = document.querySelector('.mobile-dropdown-toggle');
  const mobileHeaderCta = document.querySelector('.mobile-header-cta');

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

  if (mobileHeaderCta) {
    mobileHeaderCta.addEventListener('click', closeMobileNav);
  }

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
    const stateField  = document.getElementById('state');
    const state       = stateField ? stateField.value.trim() : '';
    const mobile      = document.getElementById('mobile').value.trim();
    const email       = document.getElementById('email').value.trim();
    const interest    = document.getElementById('interest').value.trim();
    const message     = document.getElementById('message').value.trim();
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
const BROCHURE_DISPLAY_CONFIG = Object.freeze([
  Object.freeze({
    title: 'CSL',
    description: 'Composite Skill Lab model and implementation support for schools.',
    aliases: ['csl', 'cbse vocational guide', 'cbse skill education brochure'],
    fallbackFileURL: './assets/brochures/CSL%20Flier%2001.pdf',
    forceFallbackFileURL: true,
    type: 'PDF',
    icon: '🧰'
  }),
  Object.freeze({
    title: 'Teacher Training',
    description: 'Teacher training for Kaushal Bodh and Kaushal Vikas.',
    aliases: ['teacher training', 'teacher manual'],
    fallbackFileURL: 'https://drive.google.com/file/d/1LzEohWU76m0J8wdRooUPH7Z73lX3q6ev/view?usp=sharing',
    icon: '👩‍🏫'
  }),
  Object.freeze({
    title: 'Karigar',
    description: 'Hands-on, skill-based learning through the Karigar School of Applied Learning.',
    aliases: ['karigar', 'karigar programme brochure'],
    fallbackFileURL: './assets/brochures/karigar-brochure.pdf',
    forceFallbackFileURL: true,
    icon: '🏫'
  }),
  Object.freeze({
    title: 'SOW',
    description: 'Mobile skill education through hands-on, experiential learning.',
    aliases: ['sow', 'scope of work (sow)'],
    fallbackFileURL: 'https://drive.google.com/file/d/14t1x4ae4fEfa-8Ojczp48-315IMwWnci/view?usp=sharing',
    icon: '🛻'
  }),
  Object.freeze({
    title: 'Internships',
    description: 'Real-world exposure through structured student internships.',
    aliases: ['internships', 'internship'],
    fallbackFileURL: 'https://drive.google.com/file/d/18l_X1CnciIEJ38PprdzZFAqvK_1OrKnR/view?usp=sharing',
    icon: '👷🏼‍♀️'
  })
]);

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
          '<span class="faq-q-arrow" aria-hidden="true">' + directionIconMarkup('up', 'toggle-arrow-icon') + '</span>' +
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
var LOCAL_WEBINAR_THUMBNAILS = {
  'thumb1.jpg': './assets/webinar-thumbnails/Webinar Thumbnails - Lahi For Schools.png',
  'thumb2.jpg': './assets/webinar-thumbnails/Webinar Thumbnails - Lahi For Schools (1).png',
  'thumb3.jpg': './assets/webinar-thumbnails/Webinar Thumbnails - Lahi For Schools (2).png'
};

function resolveWebinarThumbnail(thumbnail) {
  var source = String(thumbnail || '').trim();
  if (!source) return '';

  var pathWithoutQuery = source.split(/[?#]/)[0];
  var fileName = pathWithoutQuery.split('/').pop().toLowerCase();
  return LOCAL_WEBINAR_THUMBNAILS[fileName] || source;
}

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
    var thumbnail = resolveWebinarThumbnail(w.thumbnail);
    var thumbHtml = thumbnail
      ? '<img src="' + escapeHTML(thumbnail) + '" alt="' + escapeHTML(w.title || '') + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />'
      : '<div class="webinar-thumb-placeholder"><div class="webinar-play-icon">▶</div><span class="webinar-thumb-label">Webinar Recording</span></div>';

    return (
      '<div class="webinar-card">' +
        '<div class="webinar-thumb">' + thumbHtml + '</div>' +
        '<div class="webinar-body">' +
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

  var brochures = buildDisplayBrochures(resourcesData.brochures || []);
  console.log('[LAHI Brochures] Count:', brochures.length);

  if (brochures.length === 0) {
    console.warn('[LAHI Brochures] No brochures to render — showing error/update message');
    showBrochureError();
    return;
  }

  container.innerHTML = brochures.map(function(b) {
    var isPlaceholder = !b.fileURL || b.fileURL === '#';
    var fileType = String(b.type || '').trim().toUpperCase();
    var downloadLabel = fileType ? 'Download ' + escapeHTML(fileType) : 'Download';
    var downloadIcon = directionIconMarkup('up', 'down-arrow-icon');
    var btnHtml = isPlaceholder
      ? '<span class="brochure-dl-btn" style="opacity:0.5;cursor:default;" title="Coming soon">⏳ Coming Soon</span>'
      : '<a href="' + escapeHTML(b.fileURL) + '" target="_blank" rel="noopener" class="brochure-dl-btn" download>' + downloadIcon + '<span>' + downloadLabel + '</span></a>';

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

function buildDisplayBrochures(sourceBrochures) {
  var available = Array.isArray(sourceBrochures) ? sourceBrochures : [];

  return BROCHURE_DISPLAY_CONFIG.map(function(config) {
    var source = available.find(function(brochure) {
      var sourceTitle = normalizeText(brochure && brochure.title);
      return config.aliases.some(function(alias) {
        return sourceTitle === normalizeText(alias);
      });
    }) || {};

    return {
      title: config.title,
      description: config.description,
      fileURL: config.forceFallbackFileURL
        ? config.fallbackFileURL
        : (source.fileURL || config.fallbackFileURL),
      type: config.type || source.type || 'PDF',
      icon: source.icon || config.icon,
      status: source.status || 'Active'
    };
  });
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

// ══════════════════════════════════════════════════════════════
//  MEDIA GALLERY
//  Replace video records and titles here when final media changes.
// ══════════════════════════════════════════════════════════════
(function initMediaGallery() {
  var albumRoots = document.querySelectorAll('[data-gallery-variant="albums"]');
  if (!albumRoots.length) return;

  var galleryMedia = [
    {
      type: 'video',
      platform: 'youtube',
      videoId: '0jzWxqdk1Qo',
      sourceUrl: 'https://youtube.com/shorts/0jzWxqdk1Qo',
      src: 'https://www.youtube-nocookie.com/embed/0jzWxqdk1Qo',
      poster: 'https://i.ytimg.com/vi/0jzWxqdk1Qo/hqdefault.jpg',
      title: 'CSL Video 1',
      orientation: 'portrait',
      alt: 'Preview of CSL Video 1'
    },
    {
      type: 'video',
      platform: 'instagram',
      reelCode: 'Db2KxLbiFFk',
      sourceUrl: 'https://www.instagram.com/reel/Db2KxLbiFFk/',
      poster: './assets/p1.png',
      title: 'CSL Video 2',
      orientation: 'portrait',
      alt: 'Preview of CSL Video 2'
    },
    {
      type: 'video',
      platform: 'youtube',
      videoId: 'vCq1w-m0In4',
      sourceUrl: 'https://youtu.be/vCq1w-m0In4',
      src: 'https://www.youtube-nocookie.com/embed/vCq1w-m0In4',
      poster: 'https://i.ytimg.com/vi/vCq1w-m0In4/hqdefault.jpg',
      title: 'KB Teacher Training Program 1',
      orientation: 'landscape',
      alt: 'Preview of KB Teacher Training Program 1'
    },
    {
      type: 'video',
      platform: 'youtube',
      videoId: 'dsgbCsgRWcg',
      sourceUrl: 'https://youtu.be/dsgbCsgRWcg',
      src: 'https://www.youtube-nocookie.com/embed/dsgbCsgRWcg',
      poster: 'https://i.ytimg.com/vi/dsgbCsgRWcg/hqdefault.jpg',
      title: 'KB Teacher Training Program 2',
      orientation: 'landscape',
      alt: 'Preview of KB Teacher Training Program 2'
    },
    {
      type: 'video',
      platform: 'youtube',
      videoId: 'T0u5P6yb1G0',
      sourceUrl: 'https://youtu.be/T0u5P6yb1G0',
      src: 'https://www.youtube-nocookie.com/embed/T0u5P6yb1G0',
      poster: 'https://i.ytimg.com/vi/T0u5P6yb1G0/hqdefault.jpg',
      title: 'KV Teacher Training Program',
      orientation: 'landscape',
      alt: 'Preview of KV Teacher Training Program'
    },
    {
      type: 'video',
      platform: 'youtube',
      videoId: 'xQKVwnJ4UPA',
      sourceUrl: 'https://youtu.be/xQKVwnJ4UPA',
      src: 'https://www.youtube-nocookie.com/embed/xQKVwnJ4UPA',
      poster: 'https://i.ytimg.com/vi/xQKVwnJ4UPA/hqdefault.jpg',
      title: 'Aarya Patil',
      orientation: 'portrait',
      alt: 'Preview of Aarya Patil student byte'
    },
    {
      type: 'video',
      platform: 'youtube',
      videoId: 'HYRw98unH98',
      sourceUrl: 'https://youtu.be/HYRw98unH98',
      src: 'https://www.youtube-nocookie.com/embed/HYRw98unH98',
      poster: 'https://i.ytimg.com/vi/HYRw98unH98/hqdefault.jpg',
      title: 'Riyansh Karsagavkar',
      orientation: 'portrait',
      alt: 'Preview of Riyansh Karsagavkar student byte'
    },
    {
      type: 'video',
      platform: 'youtube',
      videoId: 'SbG2NpBurIA',
      sourceUrl: 'https://youtu.be/SbG2NpBurIA',
      src: 'https://www.youtube-nocookie.com/embed/SbG2NpBurIA',
      poster: 'https://i.ytimg.com/vi/SbG2NpBurIA/hqdefault.jpg',
      title: 'Daivik Koshik',
      orientation: 'portrait',
      alt: 'Preview of Daivik Koshik student byte'
    },
    {
      type: 'video',
      platform: 'youtube',
      videoId: 'GR7xn-VknVY',
      sourceUrl: 'https://youtu.be/GR7xn-VknVY',
      src: 'https://www.youtube-nocookie.com/embed/GR7xn-VknVY',
      poster: 'https://i.ytimg.com/vi/GR7xn-VknVY/hqdefault.jpg',
      title: 'Ayush Karle',
      orientation: 'portrait',
      alt: 'Preview of Ayush Karle student byte'
    },
    {
      type: 'video',
      platform: 'youtube',
      videoId: 'RA8UBBWijow',
      sourceUrl: 'https://youtu.be/RA8UBBWijow',
      src: 'https://www.youtube-nocookie.com/embed/RA8UBBWijow',
      poster: 'https://i.ytimg.com/vi/RA8UBBWijow/hqdefault.jpg',
      title: 'Aarna Jain',
      orientation: 'portrait',
      alt: 'Preview of Aarna Jain student byte'
    },
    {
      type: 'video',
      platform: 'instagram',
      reelCode: 'DcDJDIaCs8V',
      sourceUrl: 'https://www.instagram.com/reel/DcDJDIaCs8V/',
      poster: './assets/new1.png',
      title: 'Independence Day Reel',
      orientation: 'portrait',
      alt: 'Preview of the Independence Day reel'
    }
  ];

  var galleryAlbums = [
    {
      id: 'school-ready',
      title: 'Is Your School Ready',
      coverIndex: 0,
      itemIndexes: [0]
    },
    {
      id: 'cbse-ready',
      title: 'CBSE Schools, Are You Ready?',
      coverIndex: 1,
      itemIndexes: [1]
    },
    {
      id: 'july-training',
      title: 'July Teacher Training',
      coverIndex: 2,
      itemIndexes: [2, 3, 4]
    },
    {
      id: 'student-bytes',
      title: 'GG International School Student Bytes',
      coverIndex: 5,
      itemIndexes: [5, 6, 7, 8, 9]
    },
    {
      id: 'events',
      title: 'Events & Celebrations',
      coverIndex: 10,
      itemIndexes: [10]
    }
  ];

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var viewer = createGalleryViewer();

  function imageMarkup(item, className) {
    return '<img class="' + className + '" src="' + escapeHTML(item.poster || item.src) + '" alt="' +
      escapeHTML(item.alt) + '" loading="lazy" decoding="async" />';
  }

  function playMarkup(item) {
    if (item.type !== 'video') return '';
    return '<span class="gallery-play" aria-hidden="true"><span></span></span>';
  }

  function galleryLeftArrowMarkup() {
    return directionIconMarkup('left', 'gallery-chevron');
  }

  function galleryRightArrowMarkup() {
    return directionIconMarkup('right', 'gallery-chevron');
  }

  function normalizedIndex(index, length) {
    return (index + length) % length;
  }

  function setLiveStatus(element, item, index, total) {
    if (element) element.textContent = item.title + ', item ' + (index + 1) + ' of ' + total;
  }

  function addSwipe(element, onPrevious, onNext) {
    var startX = null;
    var startY = null;

    element.addEventListener('pointerdown', function(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      startX = event.clientX;
      startY = event.clientY;
    });

    element.addEventListener('pointerup', function(event) {
      if (startX === null || startY === null) return;
      var deltaX = event.clientX - startX;
      var deltaY = event.clientY - startY;
      startX = null;
      startY = null;
      if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (deltaX > 0) onPrevious();
      else onNext();
    });

    element.addEventListener('pointercancel', function() {
      startX = null;
      startY = null;
    });
  }

  function renderAlbums(root) {
    root.innerHTML =
      '<div class="gallery-album-grid">' +
        galleryAlbums.map(function(album, index) {
          var cover = galleryMedia[album.coverIndex];
          return '<button type="button" class="gallery-album-card gallery-album-card-' + (index + 1) +
            '" data-gallery-album="' + escapeHTML(album.id) + '" aria-label="Open ' + escapeHTML(album.title) + ' album">' +
              imageMarkup(cover, 'gallery-album-cover') +
              '<span class="gallery-album-shade" aria-hidden="true"></span>' +
              '<strong class="gallery-album-title">' + escapeHTML(album.title) + '</strong>' +
            '</button>';
        }).join('') +
      '</div>';

    root.addEventListener('click', function(event) {
      var trigger = event.target.closest('[data-gallery-album]');
      if (!trigger || !root.contains(trigger)) return;
      var album = galleryAlbums.find(function(candidate) {
        return candidate.id === trigger.dataset.galleryAlbum;
      });
      if (album) viewer.open(album, 0, trigger);
    });
  }

  function createGalleryViewer() {
    var overlay = document.createElement('div');
    overlay.className = 'gallery-viewer';
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="gallery-viewer-dialog" role="dialog" aria-modal="true" aria-labelledby="gallery-viewer-title">' +
        '<div class="gallery-viewer-topbar">' +
          '<h2 id="gallery-viewer-title"></h2>' +
          '<button type="button" class="gallery-viewer-close" aria-label="Close album viewer">' +
            '<svg class="gallery-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true" focusable="false">' +
              '<rect width="256" height="256" fill="none"></rect>' +
              '<line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>' +
              '<line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="gallery-viewer-media-shell">' +
          '<button type="button" class="gallery-arrow gallery-viewer-side-arrow gallery-viewer-side-prev" data-viewer-prev aria-label="Previous album item">' + galleryLeftArrowMarkup() + '</button>' +
          '<div class="gallery-viewer-media-stack">' +
            '<div class="gallery-viewer-media-frame">' +
              '<div class="gallery-viewer-stage" role="group" aria-roledescription="slide"></div>' +
            '</div>' +
            '<h3 class="gallery-viewer-media-title"></h3>' +
          '</div>' +
          '<button type="button" class="gallery-arrow gallery-viewer-side-arrow gallery-viewer-side-next" data-viewer-next aria-label="Next album item">' + galleryRightArrowMarkup() + '</button>' +
        '</div>' +
        '<div class="gallery-viewer-filmstrip" role="tablist" aria-label="Choose an album item"></div>' +
        '<p class="gallery-sr-only" aria-live="polite"></p>' +
      '</div>';
    document.body.appendChild(overlay);

    var dialog = overlay.querySelector('.gallery-viewer-dialog');
    var closeButton = overlay.querySelector('.gallery-viewer-close');
    var title = overlay.querySelector('#gallery-viewer-title');
    var stage = overlay.querySelector('.gallery-viewer-stage');
    var mediaTitle = overlay.querySelector('.gallery-viewer-media-title');
    var filmstrip = overlay.querySelector('.gallery-viewer-filmstrip');
    var status = overlay.querySelector('[aria-live]');
    var currentAlbum = null;
    var activeIndex = 0;
    var lastFocused = null;
    var previousOverflow = '';
    var closeTimer = null;
    var activeYouTubePlayer = null;
    var playerRequestId = 0;
    var youtubeApiPromise = null;

    function loadYouTubeApi() {
      if (window.YT && typeof window.YT.Player === 'function') {
        return Promise.resolve(window.YT);
      }
      if (youtubeApiPromise) return youtubeApiPromise;

      youtubeApiPromise = new Promise(function(resolve, reject) {
        var previousReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function() {
          if (typeof previousReady === 'function') previousReady();
          resolve(window.YT);
        };

        var existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
        if (existingScript) return;

        var script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.addEventListener('error', function() {
          youtubeApiPromise = null;
          reject(new Error('YouTube IFrame API failed to load'));
        });
        document.head.appendChild(script);
      });
      return youtubeApiPromise;
    }

    function clearActivePlayer() {
      playerRequestId += 1;
      if (activeYouTubePlayer && typeof activeYouTubePlayer.destroy === 'function') {
        try { activeYouTubePlayer.destroy(); } catch (error) { /* iframe replacement still stops playback */ }
      }
      activeYouTubePlayer = null;
      stage.innerHTML = '';
    }

    function renderYouTube(item, requestId) {
      var videoUrl = new URL(item.src);
      videoUrl.searchParams.set('autoplay', '1');
      videoUrl.searchParams.set('playsinline', '1');
      videoUrl.searchParams.set('rel', '0');
      videoUrl.searchParams.set('enablejsapi', '1');
      if (window.location && /^https?:$/.test(window.location.protocol)) {
        videoUrl.searchParams.set('origin', window.location.origin);
      }

      var playerId = 'gallery-youtube-player-' + requestId;
      stage.innerHTML = '<iframe id="' + playerId + '" src="' + escapeHTML(videoUrl.toString()) +
        '" title="' + escapeHTML(item.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
        'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
      var iframe = stage.querySelector('iframe');

      loadYouTubeApi().then(function(YT) {
        if (requestId !== playerRequestId || !iframe || !iframe.isConnected) return;
        activeYouTubePlayer = new YT.Player(iframe, {
          events: {
            onReady: function(event) {
              if (requestId === playerRequestId) event.target.playVideo();
            },
            onAutoplayBlocked: function(event) {
              if (requestId !== playerRequestId) return;
              event.target.mute();
              event.target.playVideo();
              dialog.classList.add('used-muted-fallback');
            }
          }
        });
      }).catch(function() {
        // The iframe remains fully usable if the optional control API is unavailable.
      });
    }

    function renderInstagram(item) {
      var embedUrl = 'https://www.instagram.com/reel/' + encodeURIComponent(item.reelCode) + '/embed/?autoplay=1';
      stage.innerHTML = '<iframe class="gallery-instagram-frame" src="' + embedUrl + '" title="' +
        escapeHTML(item.title) + '" allow="autoplay; encrypted-media; picture-in-picture" ' +
        'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    }

    function renderStage(announce) {
      var mediaIndex = currentAlbum.itemIndexes[activeIndex];
      var item = galleryMedia[mediaIndex];
      clearActivePlayer();
      var requestId = playerRequestId;

      stage.setAttribute('aria-label', item.title + ', item ' + (activeIndex + 1) + ' of ' + currentAlbum.itemIndexes.length);
      stage.classList.toggle('is-portrait', item.orientation === 'portrait');
      dialog.classList.toggle('is-portrait', item.orientation === 'portrait');
      dialog.classList.remove('used-muted-fallback');
      mediaTitle.textContent = item.title;

      if (item.platform === 'youtube') renderYouTube(item, requestId);
      else if (item.platform === 'instagram') renderInstagram(item);
      else stage.innerHTML = imageMarkup(item, 'gallery-viewer-image');

      Array.from(filmstrip.querySelectorAll('[data-viewer-select]')).forEach(function(tab, index) {
        var selected = index === activeIndex;
        tab.classList.toggle('is-active', selected);
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
        if (selected) tab.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
      });

      var hasMultipleItems = currentAlbum.itemIndexes.length > 1;
      dialog.classList.toggle('has-single-item', !hasMultipleItems);
      if (announce) setLiveStatus(status, item, activeIndex, currentAlbum.itemIndexes.length);
    }

    function select(index, announce) {
      if (!currentAlbum) return;
      activeIndex = normalizedIndex(index, currentAlbum.itemIndexes.length);
      renderStage(announce);
    }

    function open(album, startIndex, trigger) {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      currentAlbum = album;
      activeIndex = normalizedIndex(startIndex || 0, album.itemIndexes.length);
      lastFocused = trigger || document.activeElement;
      previousOverflow = document.body.style.overflow;
      title.textContent = album.title;
      filmstrip.innerHTML = album.itemIndexes.map(function(mediaIndex, index) {
        var item = galleryMedia[mediaIndex];
        return '<button type="button" class="gallery-viewer-thumb" data-viewer-select="' + index +
          '" role="tab" aria-label="Show ' + escapeHTML(item.title) + '">' +
            imageMarkup(item, 'gallery-viewer-thumb-image') + playMarkup(item) +
          '</button>';
      }).join('');
      renderStage(false);

      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(function() {
        overlay.classList.add('is-open');
        closeButton.focus();
      });
    }

    function close() {
      if (overlay.hidden) return;
      clearActivePlayer();
      overlay.classList.remove('is-open');
      document.body.style.overflow = previousOverflow;
      closeTimer = window.setTimeout(function() {
        overlay.hidden = true;
        stage.innerHTML = '';
        filmstrip.innerHTML = '';
        currentAlbum = null;
        closeTimer = null;
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      }, prefersReducedMotion.matches ? 0 : 220);
    }

    closeButton.addEventListener('click', close);
    overlay.querySelector('[data-viewer-prev]').addEventListener('click', function() { select(activeIndex - 1, true); });
    overlay.querySelector('[data-viewer-next]').addEventListener('click', function() { select(activeIndex + 1, true); });
    filmstrip.addEventListener('click', function(event) {
      var tab = event.target.closest('[data-viewer-select]');
      if (tab) select(Number(tab.dataset.viewerSelect), true);
    });
    overlay.addEventListener('click', function(event) {
      if (
        event.target === overlay ||
        event.target === dialog ||
        event.target.classList.contains('gallery-viewer-media-shell') ||
        event.target.classList.contains('gallery-viewer-media-stack')
      ) close();
    });
    addSwipe(stage, function() { select(activeIndex - 1, true); }, function() { select(activeIndex + 1, true); });
    document.addEventListener('keydown', function(event) {
      if (overlay.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        select(activeIndex - 1, true);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        select(activeIndex + 1, true);
        return;
      }
      if (event.key !== 'Tab') return;
      var focusable = Array.from(dialog.querySelectorAll(
        'button:not([disabled]):not([tabindex="-1"]), a[href], iframe, [tabindex]:not([tabindex="-1"])'
      ));
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    return { open: open, close: close };
  }

  albumRoots.forEach(function(root) {
    renderAlbums(root);
  });
})();
