/* ==========================================================
   ae metall – portfolio.js v4.0
   معرض الأعمال الاحترافي - 1014 صورة، 12 قطاع
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── تعريف القطاعات ──────────────────────────────────── */
  const CATEGORIES = [
    { key: 'all',          ar: 'الكل',                   icon: '🔷', count: 0 },
    { key: 'facades',      ar: 'واجهات ألومنيوم',         icon: '🏢', count: 0 },
    { key: 'curtain_wall', ar: 'وجهات سيكوريت',           icon: '🪟', count: 0 },
    { key: 'cladding',     ar: 'كلادينج',                 icon: '🏗️', count: 0 },
    { key: 'windows',      ar: 'شبابيك ألومنيوم',         icon: '⬜', count: 0 },
    { key: 'doors',        ar: 'أبواب ألومنيوم',          icon: '🚪', count: 0 },
    { key: 'sliding',      ar: 'أبواب منزلقة',            icon: '↔️', count: 0 },
    { key: 'shower',       ar: 'كبائن شاور',              icon: '🚿', count: 0 },
    { key: 'kitchens',     ar: 'مطابخ ألومنيوم',          icon: '🍳', count: 0 },
    { key: 'screens',      ar: 'شيش وبليسيه',             icon: '🔲', count: 0 },
    { key: 'sections',     ar: 'قطاعات وإكسسوارات',       icon: '⚙️', count: 0 },
    { key: 'railings',     ar: 'درابزين وحواجز',          icon: '🔩', count: 0 },
    { key: 'pergola',      ar: 'بيرجولا وظلل',            icon: '⛱️', count: 0 }
  ];

  const FINISH_MAP = {
    facades:      'بودرة كوتينج / أنودايز',
    curtain_wall: 'زجاج تمبر 10مم',
    cladding:     'PVDF / بودرة كوتينج',
    windows:      'أنودايز / بودرة كوتينج',
    doors:        'بودرة كوتينج',
    sliding:      'بودرة كوتينج',
    shower:       'كروم / مطفي / ذهبي',
    kitchens:     'لامع / مط / مرآة',
    screens:      'أنودايز فضي',
    sections:     'أنودايز / بودرة',
    railings:     'أنودايز / بودرة',
    pergola:      'بودرة كوتينج'
  };

  /* ── حساب الأعداد من البيانات ─────────────────────────── */
  if (typeof GALLERY_DATA !== 'undefined') {
    GALLERY_DATA.forEach(item => {
      const cat = CATEGORIES.find(c => c.key === item.category);
      if (cat) cat.count++;
    });
    CATEGORIES[0].count = GALLERY_DATA.length; // "الكل"
  }

  /* ── الحالة ───────────────────────────────────────────── */
  let activeFilter  = 'all';
  let searchQuery   = '';
  let sortMode      = 'default';
  let visibleCount  = 48;
  const PAGE_SIZE   = 48;
  let filteredData  = [];
  let lbIndex       = 0;
  let currentView   = '4col';

  /* ── مراجع DOM ────────────────────────────────────────── */
  const grid          = document.getElementById('galleryGrid');
  const filtersBar    = document.getElementById('filtersBar');
  const catsOverview  = document.getElementById('catsOverview');
  const searchInput   = document.getElementById('gallerySearch');
  const shownCount    = document.getElementById('shownCount');
  const totalCount    = document.getElementById('totalCount');
  const loadMoreBtn   = document.getElementById('loadMoreBtn');
  const loadMoreSect  = document.getElementById('loadMoreSection');
  const emptyState    = document.getElementById('emptyState');
  const progressText  = document.getElementById('progressText');
  const progFill      = document.getElementById('progFill');
  const activeCatName = document.getElementById('activeCatName');
  const sortSelect    = document.getElementById('sortSelect');
  const lightbox      = document.getElementById('lightbox');
  const lbImg         = document.getElementById('lbImg');
  const lbTitle       = document.getElementById('lbTitle');
  const lbDesc        = document.getElementById('lbDesc');
  const lbCat         = document.getElementById('lbCat');
  const lbFinish      = document.getElementById('lbFinish');
  const lbCatFull     = document.getElementById('lbCatFull');
  const lbCounter     = document.getElementById('lbCounter');
  const lbClose       = document.getElementById('lbClose');
  const lbPrev        = document.getElementById('lbPrev');
  const lbNext        = document.getElementById('lbNext');
  const scrollTopBtn  = document.getElementById('scrollTopBtn');

  if (!grid || typeof GALLERY_DATA === 'undefined') return;

  /* ── بناء قسم القطاعات (Overview) ──────────────────────── */
  function buildCatsOverview() {
    if (!catsOverview) return;
    catsOverview.innerHTML = CATEGORIES.slice(1).map(cat => `
      <div class="cat-overview-card scroll-reveal" role="listitem"
           data-cat="${cat.key}" tabindex="0" aria-label="${cat.ar}: ${cat.count} صورة">
        <div class="cat-icon" aria-hidden="true">${cat.icon}</div>
        <div class="cat-name">${cat.ar}</div>
        <div class="cat-num">${cat.count} صورة</div>
      </div>
    `).join('');

    catsOverview.querySelectorAll('.cat-overview-card').forEach(card => {
      card.addEventListener('click', () => setFilter(card.dataset.cat));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFilter(card.dataset.cat); }});
    });
  }

  /* ── بناء شريط الفلترة ──────────────────────────────────── */
  function buildFiltersBar() {
    if (!filtersBar) return;
    filtersBar.innerHTML = `<span class="filters-label">التصنيف:</span>` +
      CATEGORIES.map(cat => `
        <button type="button" class="filter-chip ${cat.key === 'all' ? 'active' : ''}"
                data-filter="${cat.key}" aria-pressed="${cat.key === 'all'}">
          ${cat.key !== 'all' ? `<span aria-hidden="true">${cat.icon}</span>` : ''}
          ${cat.ar}
          <span class="chip-count">${cat.count}</span>
        </button>
      `).join('');

    filtersBar.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
  }

  /* ── تعيين الفلتر ─────────────────────────────────────── */
  function setFilter(catKey) {
    activeFilter = catKey;
    visibleCount = PAGE_SIZE;
    searchInput.value = '';
    searchQuery = '';

    // تحديث الأزرار
    document.querySelectorAll('.filter-chip').forEach(btn => {
      const active = btn.dataset.filter === catKey;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active);
    });

    // تحديث overview cards
    document.querySelectorAll('.cat-overview-card').forEach(card => {
      card.classList.toggle('active', card.dataset.cat === catKey);
    });

    // تحديث اسم القطاع النشط
    const activeCat = CATEGORIES.find(c => c.key === catKey);
    if (activeCatName) {
      activeCatName.textContent = catKey !== 'all' ? `— ${activeCat?.ar || ''}` : '';
    }

    applyFilterAndRender();

    // تمرير إلى المعرض
    setTimeout(() => {
      grid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  /* ── تطبيق الفلتر والترتيب والبحث ───────────────────────── */
  function applyFilterAndRender() {
    if (!GALLERY_DATA) return;

    let data = activeFilter === 'all'
      ? [...GALLERY_DATA]
      : GALLERY_DATA.filter(item => item.category === activeFilter);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(item =>
        item.title_ar.toLowerCase().includes(q) ||
        item.desc_ar.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    if (sortMode === 'az') data.sort((a, b) => a.title_ar.localeCompare(b.title_ar, 'ar'));
    if (sortMode === 'za') data.sort((a, b) => b.title_ar.localeCompare(a.title_ar, 'ar'));

    filteredData = data;
    renderCards();
  }

  /* ── رسم الكروت ───────────────────────────────────────── */
  function renderCards() {
    if (!grid) return;

    const toShow = filteredData.slice(0, visibleCount);
    const catMap = {};
    CATEGORIES.forEach(c => { catMap[c.key] = c; });

    if (toShow.length === 0) {
      grid.innerHTML = '';
      emptyState?.classList.add('visible');
      loadMoreSect && (loadMoreSect.style.display = 'none');
      updateCounts(0, filteredData.length);
      return;
    }

    emptyState?.classList.remove('visible');

    grid.innerHTML = toShow.map((item, idx) => {
      const cat = catMap[item.category] || { ar: item.category, icon: '📷' };
      return `
        <article class="gal-card" role="listitem"
                 data-id="${item.id}" data-idx="${idx}"
                 tabindex="0"
                 aria-label="${item.title_ar}"
                 style="animation-delay:${(idx % 12) * 0.04}s">
          <div class="gal-img-wrap">
            <div class="gal-img-skeleton" aria-hidden="true"></div>
            <img
              data-src="${item.image}"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E"
              alt="${item.title_ar}"
              loading="lazy"
              width="400" height="300"
            >
            <div class="gal-cat-badge" aria-hidden="true">${cat.ar}</div>
            <div class="gal-overlay" aria-hidden="true">
              <span class="gal-overlay-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                عرض
              </span>
            </div>
          </div>
          <div class="gal-info">
            <h3>${item.title_ar}</h3>
            <p>${item.desc_ar}</p>
          </div>
        </article>
      `;
    }).join('');

    // Lazy load بـ IntersectionObserver
    initLazyLoad();

    // Scroll reveal
    initScrollReveal();

    // أحداث الكروت
    grid.querySelectorAll('.gal-card').forEach(card => {
      card.addEventListener('click', () => openLightbox(parseInt(card.dataset.idx)));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(parseInt(card.dataset.idx));
        }
      });
    });

    // Load More
    const hasMore = filteredData.length > visibleCount;
    loadMoreSect && (loadMoreSect.style.display = hasMore ? 'block' : 'none');
    if (loadMoreBtn) loadMoreBtn.disabled = false;

    updateCounts(Math.min(visibleCount, filteredData.length), filteredData.length);
    updateProgress();
  }

  /* ── Lazy Load ────────────────────────────────────────── */
  function initLazyLoad() {
    const lazyImgs = grid.querySelectorAll('img[data-src]');
    if (!lazyImgs.length) return;

    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const skeleton = img.previousElementSibling;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.addEventListener('load', () => {
            img.classList.add('loaded');
            skeleton?.classList.add('hidden');
          }, { once: true });
          img.addEventListener('error', () => {
            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext fill='%23aaa' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3Eألومنيوم%3C/text%3E%3C/svg%3E";
            img.classList.add('loaded');
            skeleton?.classList.add('hidden');
          }, { once: true });
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });

    lazyImgs.forEach(img => obs.observe(img));
  }

  /* ── Scroll Reveal للكروت ─────────────────────────────── */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.scroll-reveal:not(.visible)');
    if (!revealEls.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }

  /* ── تحديث العداد ─────────────────────────────────────── */
  function updateCounts(shown, total) {
    if (shownCount) shownCount.textContent = shown;
    if (totalCount) totalCount.textContent = total;
  }

  function updateProgress() {
    const shown = Math.min(visibleCount, filteredData.length);
    const total = filteredData.length;
    const pct   = total > 0 ? Math.round((shown / total) * 100) : 0;
    if (progressText) progressText.textContent = `عرض ${shown} من ${total}`;
    if (progFill) progFill.style.width = `${pct}%`;
  }

  /* ── Load More ────────────────────────────────────────── */
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += PAGE_SIZE;
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'جاري التحميل...';
      setTimeout(() => {
        renderCards();
        loadMoreBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          عرض المزيد من الأعمال
        `;
      }, 200);
    });
  }

  /* ── البحث ────────────────────────────────────────────── */
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = searchInput.value.trim();
        visibleCount = PAGE_SIZE;
        applyFilterAndRender();
      }, 280);
    });
  }

  /* ── الترتيب ──────────────────────────────────────────── */
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortMode = sortSelect.value;
      visibleCount = PAGE_SIZE;
      applyFilterAndRender();
    });
  }

  /* ── تبديل طريقة العرض ──────────────────────────────────── */
  const viewBtns = [
    { id: 'view4',    cls: 'view-4col' },
    { id: 'view3',    cls: 'view-3col' },
    { id: 'view2',    cls: 'view-2col' },
    { id: 'viewList', cls: 'view-list' }
  ];
  viewBtns.forEach(({ id, cls }) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      viewBtns.forEach(v => {
        document.getElementById(v.id)?.classList.remove('active');
        grid?.classList.remove(v.cls);
      });
      btn.classList.add('active');
      grid?.classList.add(cls);
      currentView = cls;
    });
  });

  /* ── Lightbox ─────────────────────────────────────────── */
  const catMap = {};
  CATEGORIES.forEach(c => { catMap[c.key] = c; });

  function openLightbox(idx) {
    if (!lightbox || !filteredData.length) return;
    lbIndex = Math.max(0, Math.min(idx, filteredData.length - 1));
    renderLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  }

  function closeLightbox() {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    const item = filteredData[lbIndex];
    if (!item) return;
    const cat = catMap[item.category] || { ar: item.category };
    if (lbImg) { lbImg.src = item.image; lbImg.alt = item.title_ar; }
    if (lbTitle)   lbTitle.textContent   = item.title_ar;
    if (lbDesc)    lbDesc.textContent    = item.desc_ar;
    if (lbCat)     lbCat.textContent     = cat.ar;
    if (lbFinish)  lbFinish.textContent  = FINISH_MAP[item.category] || 'بودرة كوتينج';
    if (lbCatFull) lbCatFull.textContent = cat.ar;
    if (lbCounter) lbCounter.textContent = `${lbIndex + 1} / ${filteredData.length}`;
  }

  function lbNavigate(dir) {
    lbIndex = (lbIndex + dir + filteredData.length) % filteredData.length;
    renderLightbox();
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', () => lbNavigate(-1));
  if (lbNext)  lbNext.addEventListener('click', () => lbNavigate(1));

  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') lbNavigate(-1); // RTL
    if (e.key === 'ArrowLeft')  lbNavigate(1);
  });

  // Swipe on mobile
  let touchStartX = 0;
  lightbox?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  lightbox?.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) lbNavigate(diff > 0 ? 1 : -1);
  }, { passive: true });

  /* ── Scroll to Top ────────────────────────────────────── */
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Header Mobile Toggle ─────────────────────────────── */
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? '✕' : '☰';
    });
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  }

  /* ── Header Scroll Effect ─────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── WhatsApp Float ───────────────────────────────────── */
  const floatBtn = document.querySelector('.floating-cta.whatsapp');
  if (floatBtn) {
    floatBtn.addEventListener('click', () => {
      const phone = floatBtn.dataset.phone || '+201001382022';
      const msg   = encodeURIComponent(floatBtn.dataset.message || 'مرحباً، أريد الاستفسار');
      window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    });
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const cur = window.scrollY;
      floatBtn.classList.toggle('hidden', cur > lastY && cur > 300);
      lastY = cur;
    }, { passive: true });
  }

  /* ── تهيئة المعرض ─────────────────────────────────────── */
  buildCatsOverview();
  buildFiltersBar();
  applyFilterAndRender();

  // Scroll reveal للعناصر العامة
  setTimeout(initScrollReveal, 100);

}); // end DOMContentLoaded
