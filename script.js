// ── Hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
 
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
 
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
 
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
const CMS_API_URL        = 'https://script.google.com/a/macros/lendahandindia.org/s/AKfycbyjh_u6yoaHGtheooh62hFG_ztfNkfKQeuPG2FDBPsDmR9I8RLOSHjU0Vz2J9zL_nyh/exec';
const FAQ_JSON_URL       = './faq-data.json';
const RESOURCES_JSON_URL = './resources.json';
const JSONP_TIMEOUT_MS   = 7000; // 7 s before falling back to local JSON

// ── Global state ──────────────────────────────────────────────
let allFAQs       = [];
let currentCat    = 'All';
let currentSearch = '';
let resourcesData = { webinars: [], brochures: [] };
let cmsLoaded     = false;

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

  // ── Kick off data load ────────────────────────────────────
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
//  Strategy:
//    1. JSONP → Google Apps Script (handles Workspace /a/macros/ domain)
//    2. On failure/timeout → local faq-data.json + resources.json
//    3. On both failures → show friendly error message
// ══════════════════════════════════════════════════════════════
function loadCMSData() {
  if (cmsLoaded) {
    console.log('[LAHI CMS] Already loaded — skipping duplicate call');
    return;
  }
  console.log('[LAHI CMS] Starting data load...');
  console.log('[LAHI CMS] API URL:', CMS_API_URL);
  console.log('[LAHI CMS] Strategy: JSONP first, local JSON fallback');

  var callbackName = '__gasCallback_' + Date.now();
  var settled      = false;
  var scriptEl     = null;

  // Build JSONP URL
  try {
    var jsonpURL = new URL(CMS_API_URL);
    jsonpURL.searchParams.set('callback', callbackName);
    console.log('[LAHI CMS] JSONP URL:', jsonpURL.toString());
  } catch (urlErr) {
    console.error('[LAHI CMS] Invalid API URL — falling back to local JSON immediately:', urlErr.message);
    loadLocalJSON();
    return;
  }

  // Timeout guard
  var timeoutTimer = setTimeout(function() {
    if (settled) return;
    settled = true;
    console.warn('[LAHI CMS] JSONP timed out after ' + JSONP_TIMEOUT_MS + 'ms — falling back to local JSON');
    cleanup();
    loadLocalJSON();
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
      loadLocalJSON();
      return;
    }
    if (data.error) {
      console.error('[LAHI CMS] GAS returned error:', data.error);
      loadLocalJSON();
      return;
    }
    if (!Array.isArray(data.faq)) {
      console.warn('[LAHI CMS] data.faq is not an array:', typeof data.faq, '— will use []');
    }
    if (!Array.isArray(data.webinars)) {
      console.warn('[LAHI CMS] data.webinars is not an array:', typeof data.webinars, '— will use []');
    }
    if (!Array.isArray(data.brochures)) {
      console.warn('[LAHI CMS] data.brochures is not an array:', typeof data.brochures, '— will use []');
    }

    allFAQs = Array.isArray(data.faq) ? data.faq : [];
    resourcesData = {
      webinars:  Array.isArray(data.webinars)  ? data.webinars  : [],
      brochures: Array.isArray(data.brochures) ? data.brochures : []
    };

    console.log('[LAHI CMS] Data from GAS — FAQs:', allFAQs.length,
      '| Webinars:', resourcesData.webinars.length,
      '| Brochures:', resourcesData.brochures.length);

    // Status filter check
    var activeCheck = allFAQs.filter(function(f) { return f.status && f.status.toLowerCase() === 'active'; });
    console.log('[LAHI CMS] Active FAQs after status filter:', activeCheck.length, '(if 0 but total>0, check Status column)');

    if (allFAQs.length > 0 && activeCheck.length === 0) {
      console.error('[LAHI CMS] ⚠ All FAQs filtered out by status! Check the "Status" column in Google Sheet — values must be exactly "Active"');
      console.log('[LAHI CMS] Sample status values from sheet:', allFAQs.slice(0,3).map(function(f){return f.status;}));
    }

    cmsLoaded = true;
    renderFAQs();
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
    console.warn('[LAHI CMS] JSONP script tag failed to load (network/CORS/auth block) — falling back to local JSON');
    console.warn('[LAHI CMS] Script error event:', e);
    loadLocalJSON();
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

// ── Local JSON fallback ───────────────────────────────────────
function loadLocalJSON() {
  console.log('[LAHI CMS] Loading from local JSON files...');
  console.log('[LAHI CMS] FAQ URL:', FAQ_JSON_URL);
  console.log('[LAHI CMS] Resources URL:', RESOURCES_JSON_URL);

  Promise.all([
    fetch(FAQ_JSON_URL)
      .then(function(r) {
        console.log('[LAHI CMS] faq-data.json HTTP status:', r.status, r.ok ? 'OK' : 'FAIL');
        return r.ok ? r.json() : [];
      })
      .catch(function(err) {
        console.error('[LAHI CMS] faq-data.json fetch error:', err.message);
        return [];
      }),
    fetch(RESOURCES_JSON_URL)
      .then(function(r) {
        console.log('[LAHI CMS] resources.json HTTP status:', r.status, r.ok ? 'OK' : 'FAIL');
        return r.ok ? r.json() : {};
      })
      .catch(function(err) {
        console.error('[LAHI CMS] resources.json fetch error:', err.message);
        return {};
      })
  ]).then(function(results) {
    var faqData = results[0];
    var resData = results[1];

    console.log('[LAHI CMS] Local FAQ data type:', typeof faqData, '| isArray:', Array.isArray(faqData));
    console.log('[LAHI CMS] Local resources data type:', typeof resData);

    allFAQs = Array.isArray(faqData) ? faqData : [];
    resourcesData = {
      webinars:  Array.isArray(resData.webinars)  ? resData.webinars  : [],
      brochures: Array.isArray(resData.brochures) ? resData.brochures : []
    };

    console.log('[LAHI CMS] ✅ Local JSON loaded — FAQs:', allFAQs.length,
      '| Webinars:', resourcesData.webinars.length,
      '| Brochures:', resourcesData.brochures.length);

    if (allFAQs.length === 0) {
      console.warn('[LAHI CMS] ⚠ FAQ array is empty from local JSON — check faq-data.json exists and is valid');
    }

    cmsLoaded = true;
    renderFAQs();
    renderWebinars();
    renderBrochures();

  }).catch(function(err) {
    console.error('[LAHI CMS] ❌ Both GAS and local JSON failed:', err.message);
    showFAQError();
    showWebinarError();
    showBrochureError();
  });
}

// ══════════════════════════════════════════════════════════════
//  FAQ RENDERING
// ══════════════════════════════════════════════════════════════
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

  // Filter FAQs
  var filtered = allFAQs.filter(function(faq) {
    // Status check — only show Active records
    var statusOk = !faq.status || faq.status.toLowerCase() === 'active';
    if (!statusOk) {
      console.log('[LAHI FAQ] Filtered out by status:', faq.question && faq.question.substring(0,40), '— status:', faq.status);
      return false;
    }
    // Category check
    var matchCat = (currentCat === 'All') || (faq.category === currentCat);
    // Search check
    var term = currentSearch.toLowerCase().trim();
    var matchSearch = !term
      || (faq.question && faq.question.toLowerCase().includes(term))
      || (faq.answer   && faq.answer.toLowerCase().includes(term))
      || (faq.category && faq.category.toLowerCase().includes(term));

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

  list.innerHTML = filtered.map(function(faq, i) {
    return (
      '<div class="faq-item" id="faq-item-' + i + '">' +
        '<button class="faq-q-btn" onclick="toggleFAQ(' + i + ')" aria-expanded="false">' +
          '<span class="faq-q-cat-badge">' + escapeHTML(faq.category || '') + '</span>' +
          '<span class="faq-q-text">'     + escapeHTML(faq.question  || '') + '</span>' +
          '<span class="faq-q-arrow">↓</span>' +
        '</button>' +
        '<div class="faq-answer" id="faq-ans-' + i + '">' +
          '<div class="faq-answer-inner">' + escapeHTML(faq.answer || '') + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  console.log('[LAHI FAQ] ✅ Rendered', filtered.length, 'FAQ items into #faq-list');
}

function toggleFAQ(i) {
  var item = document.getElementById('faq-item-' + i);
  if (!item) { console.warn('[LAHI FAQ] toggleFAQ: item not found at index', i); return; }
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

function filterFAQs() {
  var searchEl = document.getElementById('faq-search');
  currentSearch = searchEl ? searchEl.value : '';
  console.log('[LAHI FAQ] Search filter changed:', currentSearch);
  renderFAQs();
}

function setFAQCat(btn) {
  currentCat = btn.dataset.cat;
  console.log('[LAHI FAQ] Category changed to:', currentCat);
  document.querySelectorAll('.faq-cat').forEach(function(b) {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  renderFAQs();
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
