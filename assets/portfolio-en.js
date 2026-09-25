/* ==========================================================
   ae metall – portfolio-en.js v4.0 (English version)
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const CATS_EN   = window.GALLERY_CATS_EN  || {};
  const FINISH_EN = window.FINISH_MAP_EN    || {};

  const CATEGORIES_EN = [
    { key: 'all',          label: CATS_EN.all          || 'All Works',                count: 0, icon: '🔷' },
    { key: 'facades',      label: CATS_EN.facades       || 'Aluminium Facades',        count: 0, icon: '🏢' },
    { key: 'curtain_wall', label: CATS_EN.curtain_wall  || 'Securit Glass',            count: 0, icon: '🪟' },
    { key: 'cladding',     label: CATS_EN.cladding      || 'Cladding',                 count: 0, icon: '🏗️' },
    { key: 'windows',      label: CATS_EN.windows       || 'Windows',                  count: 0, icon: '⬜' },
    { key: 'doors',        label: CATS_EN.doors         || 'Doors',                    count: 0, icon: '🚪' },
    { key: 'sliding',      label: CATS_EN.sliding       || 'Sliding Doors',            count: 0, icon: '↔️' },
    { key: 'shower',       label: CATS_EN.shower        || 'Shower Cabins',            count: 0, icon: '🚿' },
    { key: 'kitchens',     label: CATS_EN.kitchens      || 'Kitchens',                 count: 0, icon: '🍳' },
    { key: 'screens',      label: CATS_EN.screens       || 'Mesh & Screens',           count: 0, icon: '🔲' },
    { key: 'sections',     label: CATS_EN.sections      || 'Sections & Accessories',   count: 0, icon: '⚙️' },
    { key: 'railings',     label: CATS_EN.railings      || 'Railings',                 count: 0, icon: '🔩' },
    { key: 'pergola',      label: CATS_EN.pergola       || 'Pergola & Shading',        count: 0, icon: '⛱️' }
  ];

  // Arabic → English title mapping (simple translation patterns)
  function translateTitle(titleAr, catKey) {
    const titleMap = {
      facades:      titleAr.replace('واجهة','Facade').replace('مبنى','Building').replace('برج','Tower').replace('تجاري','Commercial').replace('سكني','Residential').replace('فندق','Hotel').replace('فيلا','Villa'),
      curtain_wall: titleAr.replace('سيكوريت','Securit').replace('واجهة','Facade').replace('زجاج','Glass'),
      cladding:     titleAr.replace('كلادينج','Cladding'),
      windows:      titleAr.replace('شباك','Window').replace('نافذة','Window').replace('نوافذ','Windows'),
      doors:        titleAr.replace('باب','Door').replace('أبواب','Doors'),
      sliding:      titleAr.replace('باب منزلق','Sliding Door').replace('أبواب منزلقة','Sliding Doors').replace('نظام','System'),
      shower:       titleAr.replace('كبينة شاور','Shower Cabin').replace('حمام','Bathroom'),
      kitchens:     titleAr.replace('مطبخ','Kitchen').replace('خزائن','Cabinets').replace('دولاب','Cabinet'),
      screens:      titleAr.replace('شيش','Screen').replace('بليسيه','Pleated').replace('شبك','Mesh'),
      sections:     titleAr.replace('قطاعات','Sections').replace('إكسسوارات','Accessories'),
      railings:     titleAr.replace('درابزين','Railing').replace('حاجز','Barrier'),
      pergola:      titleAr.replace('بيرجولا','Pergola').replace('مظلة','Canopy')
    };
    return titleMap[catKey] || titleAr;
  }

  // Count categories
  if (typeof GALLERY_DATA !== 'undefined') {
    GALLERY_DATA.forEach(item => {
      const cat = CATEGORIES_EN.find(c => c.key === item.category);
      if (cat) cat.count++;
    });
    CATEGORIES_EN[0].count = GALLERY_DATA.length;
  }

  /* ── State ────────────────────────────────────────────── */
  let activeFilter = 'all';
  let searchQuery  = '';
  let sortMode     = 'default';
  let visibleCount = 48;
  const PAGE_SIZE  = 48;
  let filteredData = [];
  let lbIndex      = 0;

  /* ── DOM Refs ─────────────────────────────────────────── */
  const grid         = document.getElementById('galleryGrid');
  const filtersBar   = document.getElementById('filtersBar');
  const catsOverview = document.getElementById('catsOverview');
  const searchInput  = document.getElementById('gallerySearch');
  const shownCount   = document.getElementById('shownCount');
  const totalCount   = document.getElementById('totalCount');
  const loadMoreBtn  = document.getElementById('loadMoreBtn');
  const loadMoreSect = document.getElementById('loadMoreSection');
  const emptyState   = document.getElementById('emptyState');
  const progressText = document.getElementById('progressText');
  const progFill     = document.getElementById('progFill');
  const activeCatName= document.getElementById('activeCatName');
  const sortSelect   = document.getElementById('sortSelect');
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lbImg');
  const lbTitle      = document.getElementById('lbTitle');
  const lbDesc       = document.getElementById('lbDesc');
  const lbCat        = document.getElementById('lbCat');
  const lbFinish     = document.getElementById('lbFinish');
  const lbCatFull    = document.getElementById('lbCatFull');
  const lbCounter    = document.getElementById('lbCounter');
  const lbClose      = document.getElementById('lbClose');
  const lbPrev       = document.getElementById('lbPrev');
  const lbNext       = document.getElementById('lbNext');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  if (!grid || typeof GALLERY_DATA === 'undefined') return;

  const catMap = {};
  CATEGORIES_EN.forEach(c => { catMap[c.key] = c; });

  /* ── Build Overview ───────────────────────────────────── */
  function buildCatsOverview() {
    if (!catsOverview) return;
    catsOverview.innerHTML = CATEGORIES_EN.slice(1).map(cat => `
      <div class="cat-overview-card scroll-reveal" role="listitem"
           data-cat="${cat.key}" tabindex="0" aria-label="${cat.label}: ${cat.count} images">
        <div class="cat-icon" aria-hidden="true">${cat.icon}</div>
        <div class="cat-name">${cat.label}</div>
        <div class="cat-num">${cat.count} images</div>
      </div>
    `).join('');
    catsOverview.querySelectorAll('.cat-overview-card').forEach(card => {
      card.addEventListener('click', () => setFilter(card.dataset.cat));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFilter(card.dataset.cat); }});
    });
  }

  /* ── Build Filters ────────────────────────────────────── */
  function buildFiltersBar() {
    if (!filtersBar) return;
    filtersBar.innerHTML = `<span class="filters-label">Category:</span>` +
      CATEGORIES_EN.map(cat => `
        <button type="button" class="filter-chip ${cat.key === 'all' ? 'active' : ''}"
                data-filter="${cat.key}" aria-pressed="${cat.key === 'all'}">
          ${cat.key !== 'all' ? `<span aria-hidden="true">${cat.icon}</span>` : ''}
          ${cat.label}
          <span class="chip-count">${cat.count}</span>
        </button>
      `).join('');
    filtersBar.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
  }

  /* ── Set Filter ───────────────────────────────────────── */
  function setFilter(catKey) {
    activeFilter = catKey;
    visibleCount = PAGE_SIZE;
    searchInput.value = '';
    searchQuery = '';
    document.querySelectorAll('.filter-chip').forEach(btn => {
      const active = btn.dataset.filter === catKey;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active);
    });
    document.querySelectorAll('.cat-overview-card').forEach(card => {
      card.classList.toggle('active', card.dataset.cat === catKey);
    });
    const activeCat = CATEGORIES_EN.find(c => c.key === catKey);
    if (activeCatName) activeCatName.textContent = catKey !== 'all' ? `— ${activeCat?.label || ''}` : '';
    applyFilterAndRender();
    setTimeout(() => { grid?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120);
  }

  /* ── Apply Filter ─────────────────────────────────────── */
  function applyFilterAndRender() {
    let data = activeFilter === 'all' ? [...GALLERY_DATA] : GALLERY_DATA.filter(i => i.category === activeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(item =>
        translateTitle(item.title_ar, item.category).toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    if (sortMode === 'az') data.sort((a,b) => translateTitle(a.title_ar,a.category).localeCompare(translateTitle(b.title_ar,b.category)));
    if (sortMode === 'za') data.sort((a,b) => translateTitle(b.title_ar,b.category).localeCompare(translateTitle(a.title_ar,a.category)));
    filteredData = data;
    renderCards();
  }

  /* ── Render Cards ─────────────────────────────────────── */
  function renderCards() {
    const toShow = filteredData.slice(0, visibleCount);
    if (toShow.length === 0) {
      grid.innerHTML = '';
      emptyState?.classList.add('visible');
      loadMoreSect && (loadMoreSect.style.display = 'none');
      updateCounts(0, filteredData.length);
      return;
    }
    emptyState?.classList.remove('visible');
    grid.innerHTML = toShow.map((item, idx) => {
      const cat   = catMap[item.category] || { label: item.category, icon: '📷' };
      const title = translateTitle(item.title_ar, item.category);
      return `
        <article class="gal-card" role="listitem"
                 data-id="${item.id}" data-idx="${idx}" tabindex="0"
                 aria-label="${title}"
                 style="animation-delay:${(idx % 12) * 0.04}s">
          <div class="gal-img-wrap">
            <div class="gal-img-skeleton" aria-hidden="true"></div>
            <img data-src="${item.image}"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E"
              alt="${title}" loading="lazy" width="400" height="300">
            <div class="gal-cat-badge" aria-hidden="true">${cat.label}</div>
            <div class="gal-overlay" aria-hidden="true">
              <span class="gal-overlay-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                View
              </span>
            </div>
          </div>
          <div class="gal-info">
            <h3>${title}</h3>
            <p>${cat.label} — High quality aluminium architectural system</p>
          </div>
        </article>
      `;
    }).join('');

    initLazyLoad();
    initScrollReveal();

    grid.querySelectorAll('.gal-card').forEach(card => {
      card.addEventListener('click', () => openLightbox(parseInt(card.dataset.idx)));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(parseInt(card.dataset.idx)); }});
    });

    const hasMore = filteredData.length > visibleCount;
    loadMoreSect && (loadMoreSect.style.display = hasMore ? 'block' : 'none');
    if (loadMoreBtn) loadMoreBtn.disabled = false;
    updateCounts(Math.min(visibleCount, filteredData.length), filteredData.length);
    updateProgress();
  }

  function initLazyLoad() {
    const lazyImgs = grid.querySelectorAll('img[data-src]');
    if (!lazyImgs.length) return;
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const skel = img.previousElementSibling;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.addEventListener('load', () => { img.classList.add('loaded'); skel?.classList.add('hidden'); }, { once: true });
          img.addEventListener('error', () => { img.classList.add('loaded'); skel?.classList.add('hidden'); }, { once: true });
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    lazyImgs.forEach(img => obs.observe(img));
  }

  function initScrollReveal() {
    const els = document.querySelectorAll('.scroll-reveal:not(.visible)');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
  }

  function updateCounts(shown, total) {
    if (shownCount) shownCount.textContent = shown;
    if (totalCount) totalCount.textContent = total;
  }
  function updateProgress() {
    const shown = Math.min(visibleCount, filteredData.length);
    const total = filteredData.length;
    const pct   = total > 0 ? Math.round((shown / total) * 100) : 0;
    if (progressText) progressText.textContent = `Showing ${shown} of ${total}`;
    if (progFill) progFill.style.width = `${pct}%`;
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += PAGE_SIZE;
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'Loading...';
      setTimeout(() => {
        renderCards();
        loadMoreBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          Load More Works
        `;
      }, 200);
    });
  }

  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => { searchQuery = searchInput.value.trim(); visibleCount = PAGE_SIZE; applyFilterAndRender(); }, 280);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => { sortMode = sortSelect.value; visibleCount = PAGE_SIZE; applyFilterAndRender(); });
  }

  // View toggle
  const viewBtns = [{ id:'view4',cls:'view-4col' },{ id:'view3',cls:'view-3col' },{ id:'view2',cls:'view-2col' },{ id:'viewList',cls:'view-list' }];
  viewBtns.forEach(({ id, cls }) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      viewBtns.forEach(v => { document.getElementById(v.id)?.classList.remove('active'); grid?.classList.remove(v.cls); });
      btn.classList.add('active');
      grid?.classList.add(cls);
    });
  });

  /* ── Lightbox ─────────────────────────────────────────── */
  function openLightbox(idx) {
    if (!lightbox || !filteredData.length) return;
    lbIndex = Math.max(0, Math.min(idx, filteredData.length - 1));
    renderLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  }
  function closeLightbox() { lightbox?.classList.remove('open'); lightbox?.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }
  function renderLightbox() {
    const item  = filteredData[lbIndex];
    if (!item) return;
    const cat   = catMap[item.category] || { label: item.category };
    const title = translateTitle(item.title_ar, item.category);
    if (lbImg)     { lbImg.src = item.image; lbImg.alt = title; }
    if (lbTitle)   lbTitle.textContent   = title;
    if (lbDesc)    lbDesc.textContent    = `${cat.label} — High-quality aluminium architectural system with premium finish and durable materials.`;
    if (lbCat)     lbCat.textContent     = cat.label;
    if (lbFinish)  lbFinish.textContent  = FINISH_EN[item.category] || 'Powder Coating';
    if (lbCatFull) lbCatFull.textContent = cat.label;
    if (lbCounter) lbCounter.textContent = `${lbIndex + 1} / ${filteredData.length}`;
  }
  function lbNavigate(dir) { lbIndex = (lbIndex + dir + filteredData.length) % filteredData.length; renderLightbox(); }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', () => lbNavigate(-1));
  if (lbNext)  lbNext.addEventListener('click', () => lbNavigate(1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')    closeLightbox();
    if (e.key === 'ArrowLeft') lbNavigate(-1);
    if (e.key === 'ArrowRight')lbNavigate(1);
  });
  let touchStartX = 0;
  lightbox?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  lightbox?.addEventListener('touchend',   e => { const diff = touchStartX - e.changedTouches[0].screenX; if (Math.abs(diff) > 50) lbNavigate(diff > 0 ? 1 : -1); }, { passive: true });

  /* ── Scroll Top ───────────────────────────────────────── */
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => { scrollTopBtn.classList.toggle('visible', window.scrollY > 500); }, { passive: true });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Header / Float ───────────────────────────────────── */
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); toggle.textContent = open ? '✕' : '☰'; });
    document.addEventListener('click', e => { if (!toggle.contains(e.target) && !nav.contains(e.target)) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.textContent = '☰'; }});
  }
  const header = document.querySelector('.site-header');
  if (header) window.addEventListener('scroll', () => { header.classList.toggle('scrolled', window.scrollY > 60); }, { passive: true });

  const floatBtn = document.querySelector('.floating-cta.whatsapp');
  if (floatBtn) {
    floatBtn.addEventListener('click', () => { window.open(`https://wa.me/${(floatBtn.dataset.phone||'').replace(/[^0-9]/g,'')}?text=${encodeURIComponent(floatBtn.dataset.message||'')}`, '_blank'); });
    let lastY = 0;
    window.addEventListener('scroll', () => { const cur = window.scrollY; floatBtn.classList.toggle('hidden', cur > lastY && cur > 300); lastY = cur; }, { passive: true });
  }

  /* ── Init ─────────────────────────────────────────────── */
  buildCatsOverview();
  buildFiltersBar();
  applyFilterAndRender();
  setTimeout(initScrollReveal, 100);

});
