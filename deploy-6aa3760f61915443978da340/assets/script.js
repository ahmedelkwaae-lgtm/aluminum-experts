/* =========================================================
   ae metall – Main JavaScript v3.0
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Progressive enhancement ────────────────────────── */
  const analyticsConfig = document.createElement('script');
  analyticsConfig.src = '/assets/analytics-config.js?v=1';
  analyticsConfig.onload = () => {
    const measurementId = window.AE_ANALYTICS_ID;
    if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return;
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(gtagScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { anonymize_ip: true });
  };
  document.head.appendChild(analyticsConfig);

  const languagePage = location.pathname.split('/').pop() || 'index.html';
  const languagePairs = {
    'index.html': 'index-en.html', 'index-en.html': 'index.html',
    'about.html': 'about-en.html', 'about-en.html': 'about.html',
    'services.html': 'services-en.html', 'services-en.html': 'services.html',
    'portfolio.html': 'portfolio-en.html', 'portfolio-en.html': 'portfolio.html',
    'contact.html': 'contact-en.html', 'contact-en.html': 'contact.html',
    'catalogue.html': 'catalogue-en.html', 'catalogue-en.html': 'catalogue.html',
    'design2027.html': 'design2027-en.html', 'design2027-en.html': 'design2027.html',
    'privacy.html': 'privacy-en.html', 'privacy-en.html': 'privacy.html',
    'terms.html': 'terms-en.html', 'terms-en.html': 'terms.html',
    'blog-aluminium-tech.html': 'blog-aluminium-tech-en.html', 'blog-aluminium-tech-en.html': 'blog-aluminium-tech.html',
    'blog-buying-guide.html': 'blog-buying-guide-en.html', 'blog-buying-guide-en.html': 'blog-buying-guide.html',
    'blog-maintenance.html': 'blog-maintenance-en.html', 'blog-maintenance-en.html': 'blog-maintenance.html'
  };
  const pairedPage = languagePairs[languagePage];
  if (pairedPage) {
    const alternate = document.createElement('link');
    alternate.rel = 'alternate';
    alternate.hreflang = languagePage.endsWith('-en.html') ? 'ar' : 'en';
    alternate.href = pairedPage;
    document.head.appendChild(alternate);
  }
  const faqQuestions = [...document.querySelectorAll('.faq-question span:first-child')].map(item => item.textContent.trim());
  const faqAnswers = [...document.querySelectorAll('.faq-answer')].map(item => item.textContent.trim());
  if (faqQuestions.length && faqQuestions.length === faqAnswers.length) {
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqQuestions.map((question, index) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: faqAnswers[index] } })) });
    document.head.appendChild(schema);
  }
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
    if (!img.hasAttribute('loading') && !img.closest('.hero, header')) img.loading = 'lazy';
    img.addEventListener('error', () => img.classList.add('image-load-error'), { once: true });
  });
  document.querySelectorAll('a[href^="https://wa.me"], a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof window.gtag === 'function') window.gtag('event', 'contact_click', { destination: link.href });
    });
  });

  /* ── Mobile Menu Toggle ──────────────────────────────── */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.textContent = isOpen ? '✕' : '☰';
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
    // Close on nav link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });
  }

  /* ── Header Scroll Effect ────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── Scroll Reveal (Intersection Observer) ───────────── */
  const revealEls = document.querySelectorAll(
    '.scroll-reveal, .stat-item, .testimonial-card, .faq-item, ' +
    '.feature-card, .service-card, .project-card, .blog-card'
  );
  if (revealEls.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 0.08}s`;
      revealObs.observe(el);
    });
  }


  /* ── Animated Stats Counter ──────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObs.observe(el));
  }

  function animateCounter(el) {
    const raw = el.textContent.trim();
    const suffix = raw.replace(/[0-9]/g, '');
    const target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    if (isNaN(target)) return;
    const duration = 2000;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── FAQ Accordion ───────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(f => f.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
      question.setAttribute('aria-expanded', String(!isOpen));
    });
    // Keyboard accessibility
    question.setAttribute('tabindex', '0');
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', 'false');
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  /* ── Floating WhatsApp Button ────────────────────────── */
  const floatBtn = document.querySelector('.floating-cta.whatsapp');
  if (floatBtn) {
    // Click handler
    floatBtn.addEventListener('click', () => {
      const phone = floatBtn.dataset.phone || '+201001382022';
      const msg = encodeURIComponent(floatBtn.dataset.message || 'مرحباً، أود الاستفسار عن خدماتكم');
      window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    });
    // Show/hide on scroll direction
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 300) {
        floatBtn.classList.add('hidden');
      } else {
        floatBtn.classList.remove('hidden');
      }
      lastScrollY = currentY;
    }, { passive: true });
  }


  /* ── Contact Form Validation ─────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      const action = form.getAttribute('action') || '';
      const usesFormspree = action.includes('formspree.io');
      const usesNetlify = form.dataset.netlify === 'true';
      if (!usesFormspree && !usesNetlify) e.preventDefault();
      if (usesNetlify) e.preventDefault();

      const nameEl    = form.querySelector('#name');
      const emailEl   = form.querySelector('#email');
      const messageEl = form.querySelector('#message');
      const status    = document.getElementById('formStatus');
      if (form.dataset.submitting === 'true') { e.preventDefault(); return; }
      let valid = true;

      if (nameEl)    { const ok = nameEl.value.trim().length >= 2;    setError(nameEl, !ok);    if (!ok) valid = false; }
      if (emailEl)   { const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim()); setError(emailEl, !ok); if (!ok) valid = false; }
      if (messageEl) { const ok = messageEl.value.trim().length >= 10; setError(messageEl, !ok); if (!ok) valid = false; }

      if (!valid) {
        if (status) {
          status.textContent = document.documentElement.lang === 'en'
            ? 'Please complete the required fields correctly.'
            : 'يرجى إكمال جميع الحقول بشكل صحيح.';
          status.className = 'form-status error-status';
          status.style.display = 'block';
        }
        return;
      }

      if (usesNetlify) {
        form.dataset.submitting = 'true';
        const submitButton = form.querySelector('button[type="submit"]');
        const isEnglish = document.documentElement.lang === 'en';
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.setAttribute('aria-busy', 'true');
        }
        if (status) {
          status.textContent = isEnglish ? 'Sending your request...' : 'جارٍ إرسال طلبك...';
          status.className = 'form-status';
          status.style.display = 'block';
        }

        const formData = new FormData(form);
        fetch(form.action || window.location.pathname, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        }).then(response => {
          if (!response.ok) throw new Error('Form submission failed');
          form.reset();
          if (status) {
            status.textContent = isEnglish
              ? 'Thank you. Your request has been sent successfully.'
              : 'شكراً لك. تم إرسال طلبك بنجاح.';
            status.className = 'form-status success';
          }
        }).catch(() => {
          if (status) {
            status.textContent = isEnglish
              ? 'We could not send your request. Please contact us directly by WhatsApp or email.'
              : 'تعذر إرسال الطلب حالياً. يرجى التواصل معنا مباشرة عبر واتساب أو البريد الإلكتروني.';
            status.className = 'form-status error-status';
          }
        }).finally(() => {
          form.dataset.submitting = 'false';
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
          }
        });
      }
    });
  }

  function setError(input, show) {
    const msg = input.parentElement.querySelector('.error-msg');
    if (msg) msg.style.display = show ? 'block' : 'none';
    input.style.borderColor = show ? '#dc3545' : '';
  }

  /* ── Newsletter Form ─────────────────────────────────── */
  const newsletter = document.querySelector('.newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletter.querySelector('input[type="email"]');
      const btn   = newsletter.querySelector('button');
      if (!input || !input.value.trim()) return;
      const original = btn.textContent;
      btn.textContent = '✓ شكراً!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; input.value = ''; }, 3000);
    });
  }

  /* ── Large Portfolio Gallery ─────────────────────────── */
  // Generate local image paths for the portfolio
  const localImagePool = [];
  for (let i = 1; i <= 1000; i++) {
    const paddedNum = String(i).padStart(4, '0');
    localImagePool.push(`assets/images/portfolio/aluminium-${paddedNum}.jpg`);
  }

  const galleryCategories = [
    { key: 'windows', title: 'شبابيك', description: 'حلول نوافذ ألومنيوم عصرية بعزل حراري ممتاز' },
    { key: 'doors', title: 'أبواب', description: 'أبواب منزلقة وأمنية أنيقة ومقاومة' },
    { key: 'facades', title: 'واجهات', description: 'واجهات زجاجية وألومنيوم حديثة ومشرقة' },
    { key: 'kitchens', title: 'مطابخ', description: 'مطابخ ألومنيوم عمليّة وجمالية وموفرة للمساحة' },
    { key: 'curtain', title: 'جدران زجاجية', description: 'أعمال جدران زجاجية متطورة ومميزة' },
    { key: 'security', title: 'سيكوريت', description: 'أنظمة حماية متكاملة للأبواب والشبابيك' }
  ];

  const galleryTitleMap = {
    windows: [
      'شبابيك بانورامية - عزل حراري متقدم',
      'نوافذ ألومنيوم فاخرة - تصميم عصري',
      'شبابيك كاسيت منزلقة - أداء عالي',
      'نوافذ ألومنيوم عازلة - صوتية وحرارية',
      'شبابيك فرنسية فاخرة - إطلالات جميلة',
      'نظام نوافذ حديثة - مقاسات مخصصة',
      'شبابيك متحركة - تهوية ذكية',
      'نوافذ زجاجية معزولة - جودة أوروبية',
      'شبابيك أنيقة - أرضيات وعلويات',
      'نظام شبابيك متقدم - تشطيب فاخر'
    ],
    doors: [
      'أبواب منزلقة فاخرة - تصميم حديث',
      'أبواب ألومنيوم أمنية - حماية عالية',
      'بابأ زجاجي - مدخل استقبال',
      'أبواب فرنسية ضعف - أناقة العصر',
      'باب دخول رئيسي - تشطيب فاخر',
      'أبواب منزلقة - نظام تلقائي اختياري',
      'باب مجلسي زجاجي - ديكور عصري',
      'أبواب أمنية معزولة - حماية وراحة',
      'باب تراس منزلق - إطلالات مفتوحة',
      'نظام أبواب حديثة - تصاميم مخصصة'
    ],
    facades: [
      'واجهة زجاجية حديثة - بناء تجاري',
      'واجهة ألومنيوم فاخرة - هندسية دقيقة',
      'غلاف خارجي معماري - تصميم معاصر',
      'واجهة مبنى سكني - مظهر أنيق',
      'واجهة تجارية - عاكسة للضوء',
      'غلاف معدني فاخر - حماية ومظهر',
      'واجهة معاصرة - ألومنيوم وزجاج',
      'واجهة فندقية - نمط كلاسيكي حديث',
      'واجهة سكنية - عزل حراري فعّال',
      'نظام واجهات متطورة - متوافق بيئي'
    ],
    kitchens: [
      'مطبخ ألومنيوم - تصميم عصري',
      'دولاب مطبخ معدني - تخزين ذكي',
      'خزائن مطبخ حديثة - ألومنيوم فاخر',
      'مطبخ مفتوح - تصميم معياري',
      'طقم مطبخ ألومنيوم - جودة عالية',
      'مطبخ مودرن - إضاءة متكاملة',
      'دولاب مطبخ فاخر - تشطيب لامع',
      'مطبخ مخصص - حسب الطلب',
      'خزائن ألومنيوم - أرفف منظمة',
      'نظام مطبخ متقدم - تجهيزات كاملة'
    ],
    curtain: [
      'جدار زجاجي - فاصل ديكوري',
      'واجهة بانورامية - إطلالة شاملة',
      'سور زجاجي ألومنيوم - حماية عصرية',
      'جدار شفاف - فصل ذكي للمساحات',
      'واجهة فندقية - لوبي استقبال',
      'جدار زجاجي تجاري - مكاتب عصرية',
      'واجهة داخلية - فصل بدون عوازل',
      'جدار زجاجي مكتب - شفافية وأناقة',
      'سور ألومنيوم - حماية وجمال',
      'نظام جدران زجاجية - مرونة معمارية'
    ],
    security: [
      'نظام سيكوريت - حماية عالية',
      'باب أمني معزول - حماية مضمونة',
      'مقفل ألومنيوم - نظام أمان متقدم',
      'باب حماية - تأمين كامل',
      'نظام أمان فائق - دخول محكوم',
      'غلاف أمني - حماية شاملة',
      'باب دخول آمن - حديد وزجاج',
      'شباك سيكوريت - حماية الخصوصية',
      'نظام حماية متكامل - راحة نفسية',
      'باب وشباك أمني - جودة موثوقة'
    ]
  };

  const portfolioGrid = document.getElementById('portfolioGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sliderCards = document.querySelectorAll('.spotlight-card');
  const sliderPrev = document.querySelector('.slider-btn.prev');
  const sliderNext = document.querySelector('.slider-btn.next');
  let activeFilter = 'all';
  let visibleCount = 48;
  let activeSlide = 0;

  function buildImageUrl(categoryKey, index) {
    // Use loremflickr for reliable photos with relevant keywords
    const keywordMap = {
      windows: 'window-aluminum',
      doors: 'door-glass',
      facades: 'building-exterior',
      kitchens: 'kitchen-modern',
      curtain: 'glass-wall',
      security: 'security-door'
    };
    
    const keyword = keywordMap[categoryKey] || 'architecture';
    const randomizer = (index * 7919) % 1000; // consistent pseudo-random
    
    return `https://loremflickr.com/1200/900/${keyword}?lock=${randomizer}`;
  }

  function buildGalleryData() {
    const data = [];
    const totalCards = 1200;
    
    const descriptionTemplates = {
      windows: [
        'نظام نوافذ عالي الأداء مع عزل حراري متقدم وتقنيات حديثة لتوفير الطاقة.',
        'شبابيك ألومنيوم فاخرة بمواصفات أوروبية وتشطيب عالي الجودة.',
        'نوافذ معزولة صوتياً وحرارياً مع إطارات قوية وقابلة للتخصيص.',
        'شباك بانورامية تمنح إطلالات رائعة مع الحفاظ على العزل المثالي.',
        'نظام نوافذ حديث مع تصاميم مرنة تناسب جميع أنماط البناء.'
      ],
      doors: [
        'أبواب ألومنيوم عالية الأمان مع أقفال متقدمة وتصاميم معاصرة.',
        'نظام أبواب منزلقة سلس وهادئ مع تشطيب فاخر.',
        'أبواب أمنية معزولة توفر حماية شاملة مع مظهر أنيق.',
        'باب دخول فاخر بتصميم مخصص يعكس ذوق عالي.',
        'نظام أبواب متقدم بخيارات تلقائية واختيارية حسب الحاجة.'
      ],
      facades: [
        'واجهة معمارية عصرية بألومنيوم وزجاج عالي الجودة.',
        'غلاف خارجي فاخر يجمع بين الأناقة والحماية الكاملة.',
        'واجهة حديثة مع نظام عزل حراري فعّال وموفر للطاقة.',
        'تصميم واجهة معاصر يعطي مظهراً احترافياً للمبنى.',
        'نظام واجهات متكامل مع تقنيات حديثة ومواد عالية الجودة.'
      ],
      kitchens: [
        'مطبخ ألومنيوم حديث مع تخزين ذكي وتصميم عملي فاخر.',
        'دولاب مطبخ معدني عالي الجودة مع إضاءة متكاملة.',
        'خزائن مطبخ ألومنيوم بتشطيب لامع وأرفف منظمة.',
        'نظام مطبخ مخصص يجمع بين الوظيفة والجمال.',
        'تصميم مطبخ معياري قابل للتعديل حسب احتياجاتك.'
      ],
      curtain: [
        'جدار زجاجي ألومنيوم يفصل المساحات مع الحفاظ على الشفافية.',
        'واجهة بانورامية تمنح إطلالات مفتوحة مع حماية معمارية.',
        'نظام جدران زجاجية مرن لتقسيم المساحات التجارية والسكنية.',
        'سور زجاجي عصري يجمع بين الأمان والتصميم المعاصر.',
        'واجهة داخلية بألومنيوم وزجاج توفر مرونة معمارية عالية.'
      ],
      security: [
        'نظام سيكوريت متقدم يوفر حماية كاملة مع راحة نفسية.',
        'باب أمني معزول بمقفل ذكي وتصميم قوي وأنيق.',
        'حماية شاملة للأبواب والشبابيك مع نظام أمان موثوق.',
        'نظام حماية متكامل يجمع بين الأمان والجمال المعماري.',
        'تأمين عالي الجودة للمداخل والمخارج مع ضمانات موثوقة.'
      ]
    };

    for (let i = 0; i < totalCards; i++) {
      const category = galleryCategories[i % galleryCategories.length];
      const titleVariants = galleryTitleMap[category.key];
      const variant = titleVariants[i % titleVariants.length];
      const descriptions = descriptionTemplates[category.key];
      const description = descriptions[i % descriptions.length];
      const image = buildImageUrl(category.key, i);

      data.push({
        category: category.key,
        title: variant,
        description: description,
        image: image,
        alt: `${variant} - ${category.title} مشروع`,
        system: `ألومنيوم 6063 و 6061`,
        finish: `تشطيب ${category.title} عالي الجودة`
      });
    }

    return data;
  }

  const galleryData = buildGalleryData();
  const portfolioModal = document.getElementById('portfolioModal');

  function openPortfolioModal(item) {
    if (!portfolioModal) return;
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalCategory = document.getElementById('modalCategory');
    const modalSystem = document.getElementById('modalSystem');
    const modalFinish = document.getElementById('modalFinish');

    if (modalImage) modalImage.src = item.image;
    if (modalImage) modalImage.alt = item.alt;
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalDescription) modalDescription.textContent = item.description;
    if (modalCategory) modalCategory.textContent = item.system || 'مشروع';
    if (modalSystem) modalSystem.textContent = item.system || 'ألومنيوم';
    if (modalFinish) modalFinish.textContent = item.finish || 'تشطيب مخصص';

    portfolioModal.classList.add('open');
    portfolioModal.setAttribute('aria-hidden', 'false');
  }

  function closePortfolioModal() {
    if (!portfolioModal) return;
    portfolioModal.classList.remove('open');
    portfolioModal.setAttribute('aria-hidden', 'true');
  }

  function renderGallery() {
    if (!portfolioGrid) return;

    const filtered = activeFilter === 'all'
      ? galleryData
      : galleryData.filter(item => item.category === activeFilter);

    portfolioGrid.innerHTML = '';
    const itemsToShow = filtered.slice(0, visibleCount);

    itemsToShow.forEach(item => {
      const article = document.createElement('article');
      article.className = 'project-card';
      article.dataset.category = item.category;
      article.dataset.title = item.title;
      article.dataset.description = item.description;
      article.dataset.image = item.image;
      article.dataset.system = item.system || 'ألومنيوم';
      article.dataset.finish = item.finish || 'تشطيب مخصص';
      article.innerHTML = `
        <div class="img-wrap">
          <img src="${item.image}" alt="${item.alt}" loading="lazy">
          <span class="project-cat">${galleryCategories.find(cat => cat.key === item.category)?.title || 'مشروع'}</span>
          <div class="img-overlay"></div>
        </div>
        <div class="info">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="project-actions">
            <button type="button" class="mini-btn" data-open-project="${encodeURIComponent(item.title)}">عرض التفاصيل</button>
            <a href="contact.html" class="mini-btn">طلب عرض سعر</a>
          </div>
        </div>
      `;
      portfolioGrid.appendChild(article);
    });

    if (loadMoreBtn) {
      const hasMore = filtered.length > visibleCount;
      loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
    }
  }

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter || 'all';
        visibleCount = 36;
        renderGallery();
      });
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const filtered = activeFilter === 'all' ? galleryData : galleryData.filter(item => item.category === activeFilter);
      visibleCount = Math.min(visibleCount + 36, filtered.length);
      renderGallery();
    });
  }

  document.addEventListener('click', (event) => {
    const openBtn = event.target.closest('[data-open-project]');
    if (openBtn) {
      const title = decodeURIComponent(openBtn.dataset.openProject || '');
      const match = galleryData.find(item => item.title === title);
      if (match) openPortfolioModal(match);
      return;
    }

    if (event.target.matches('[data-close="modal"]') || event.target.closest('.portfolio-modal-close')) {
      closePortfolioModal();
    }

    if (event.target.closest('.project-card')) {
      const card = event.target.closest('.project-card');
      const title = card.dataset.title || '';
      const match = galleryData.find(item => item.title === title);
      if (match) openPortfolioModal(match);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && portfolioModal && portfolioModal.classList.contains('open')) {
      closePortfolioModal();
    }
  });

  if (sliderCards.length > 0 && sliderPrev && sliderNext) {
    function showSlide(index) {
      sliderCards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
      });
    }

    sliderPrev.addEventListener('click', () => {
      activeSlide = (activeSlide - 1 + sliderCards.length) % sliderCards.length;
      showSlide(activeSlide);
    });

    sliderNext.addEventListener('click', () => {
      activeSlide = (activeSlide + 1) % sliderCards.length;
      showSlide(activeSlide);
    });

    setInterval(() => {
      activeSlide = (activeSlide + 1) % sliderCards.length;
      showSlide(activeSlide);
    }, 5000);
  }

  renderGallery();

  /* ── Smooth Anchor Scroll ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Image Lazy-load Fade ────────────────────────────── */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    if (img.complete) img.style.opacity = '1';
  });

}); // end DOMContentLoaded
