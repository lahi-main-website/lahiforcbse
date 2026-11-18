// LAHI blog pages: scroll reveal, mobile nav, dropdowns, pagination.
(function () {
  // ---- scroll reveal (same pattern as the homepage) ----
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var revObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            setTimeout(function () { entry.target.classList.add('visible'); }, i * 60);
            revObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      reveals.forEach(function (el) { revObserver.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  // ---- mobile nav ----
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', mobileNav.classList.contains('open') ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  // ---- mobile resources dropdown ----
  var mRes = document.querySelector('.mobile-nav-dropdown');
  var mTog = document.querySelector('.mobile-dropdown-toggle');
  if (mRes && mTog) {
    mTog.addEventListener('click', function () {
      var open = mRes.classList.toggle('is-open');
      mTog.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // ---- desktop resources dropdown ----
  var dd = document.getElementById('resources-dropdown');
  var ddTog = dd && dd.querySelector('.dropdown-toggle');
  if (dd && ddTog) {
    ddTog.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle('is-open');
      ddTog.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      dd.classList.remove('is-open');
      ddTog.setAttribute('aria-expanded', 'false');
    });
  }
  // ---- article: reading progress bar ----
  var progressBar = document.getElementById('reading-progress-bar');
  var articleBody = document.querySelector('.article-body');
  if (progressBar && articleBody) {
    var pTick = false;
    function updateProgress() {
      pTick = false;
      var rect = articleBody.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var pct;
      if (total <= 0) { pct = rect.top <= 0 ? 1 : 0; }
      else { pct = Math.min(1, Math.max(0, -rect.top / total)); }
      progressBar.style.width = (pct * 100).toFixed(2) + '%';
    }
    window.addEventListener('scroll', function () {
      if (!pTick) { pTick = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  // ---- article: sticky "up next" nudge ----
  var nudge = document.getElementById('next-nudge');
  if (nudge) {
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('lahi-next-nudge') === 'off'; } catch (e) {}
    nudge.hidden = false; // JS present: visibility controlled via class
    var relSection = document.getElementById(nudge.getAttribute('data-related') || '');
    var relVisible = false;
    function pastThreshold() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      return h > 0 && (window.scrollY / h) > 0.55;
    }
    function syncNudge() {
      nudge.classList.toggle('is-visible', !dismissed && !relVisible && pastThreshold());
    }
    if (relSection && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        relVisible = entries[0].isIntersecting;
        syncNudge();
      }, { rootMargin: '0px 0px -10% 0px' }).observe(relSection);
    }
    var closeBtn = nudge.querySelector('.next-nudge-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        dismissed = true;
        try { sessionStorage.setItem('lahi-next-nudge', 'off'); } catch (e2) {}
        syncNudge();
      });
    }
    var nTick = false;
    window.addEventListener('scroll', function () {
      if (!nTick) { nTick = true; requestAnimationFrame(function () { nTick = false; syncNudge(); }); }
    }, { passive: true });
    syncNudge();
  }

  // ---- listing: tag filter + pagination ----
  var PAGE_SIZE = 15;
  var grid = document.getElementById('blog-grid');
  var pager = document.getElementById('blog-pagination');
  var filterBar = document.getElementById('blog-filters');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.blog-card'));
  var filter = 'all';
  var current = 1;

  function matches(card) {
    return filter === 'all' ||
      (card.getAttribute('data-tags') || '').indexOf('|' + filter + '|') !== -1;
  }
  function setPage(page) { current = page; apply(true); }
  function btn(label, page, opts) {
    opts = opts || {};
    var b = document.createElement('button');
    b.className = 'blog-page-btn' + (opts.active ? ' is-active' : '');
    b.textContent = label;
    b.disabled = !!opts.disabled;
    if (opts.active) b.setAttribute('aria-current', 'page');
    if (!opts.disabled && !opts.active) b.addEventListener('click', function () { setPage(page); });
    return b;
  }
  function renderPager(pages) {
    if (!pager) return;
    if (pages <= 1) { pager.hidden = true; pager.innerHTML = ''; return; }
    pager.hidden = false;
    pager.innerHTML = '';
    pager.appendChild(btn('‹ Prev', current - 1, { disabled: current === 1 }));
    for (var p = 1; p <= pages; p++) pager.appendChild(btn(String(p), p, { active: p === current }));
    pager.appendChild(btn('Next ›', current + 1, { disabled: current === pages }));
  }
  function apply(doScroll) {
    var visible = cards.filter(matches);
    var pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
    if (current > pages) current = pages;
    var vi = 0;
    cards.forEach(function (c) {
      if (!matches(c)) { c.style.display = 'none'; return; }
      var page = Math.floor(vi / PAGE_SIZE) + 1; vi++;
      c.style.display = (page === current) ? '' : 'none';
    });
    renderPager(pages);
    if (doScroll) window.scrollTo({ top: grid.offsetTop - 90, behavior: 'smooth' });
  }
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.blog-filter') : null;
      if (!b) return;
      filterBar.querySelectorAll('.blog-filter').forEach(function (x) {
        x.classList.remove('is-active');
        x.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('is-active');
      b.setAttribute('aria-pressed', 'true');
      filter = b.getAttribute('data-filter');
      current = 1;
      apply(false);
    });
  }
  apply(false);
})();
