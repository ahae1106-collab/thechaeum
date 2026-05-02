/* ===================================
   NAVIGATION — scroll & mobile
=================================== */
const nav = document.getElementById('main-nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const navOverlay = document.getElementById('nav-overlay');
const floatingCta = document.getElementById('floating-cta');

// nav 스크롤 감지 (index.html에서만 투명 → 스크롤 시 frosted glass)
if (nav && !nav.classList.contains('scrolled')) {
  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();
}

// 플로팅 CTA — hero 지나친 후 표시
if (floatingCta) {
  function handleFloatingCta() {
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 400;
    if (window.scrollY > heroHeight * 0.6) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  }

  // hero 없는 페이지는 바로 표시
  if (!document.querySelector('.hero')) {
    floatingCta.classList.add('visible');
  } else {
    window.addEventListener('scroll', handleFloatingCta, { passive: true });
    handleFloatingCta();
  }
}

// 모바일 메뉴 토글
function openMobileMenu() {
  hamburger?.classList.add('open');
  mobileMenu?.classList.add('open');
  navOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  hamburger?.classList.remove('open');
  mobileMenu?.classList.remove('open');
  navOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  if (mobileMenu?.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

navOverlay?.addEventListener('click', closeMobileMenu);

// 모바일 메뉴 링크 클릭 시 닫기
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ===================================
   SCROLL ANIMATIONS — IntersectionObserver
=================================== */
const fadeEls = document.querySelectorAll('.fade-up');

if (fadeEls.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  fadeEls.forEach(el => observer.observe(el));
}

/* ===================================
   HERO — 이미지 로드 후 Ken Burns 효과
=================================== */
const hero = document.querySelector('.hero');
if (hero) {
  const heroBg = hero.querySelector('.hero-bg');
  if (heroBg) {
    const tempImg = new Image();
    const bgUrl = window.getComputedStyle(heroBg).backgroundImage
      .replace(/url\(["']?/, '')
      .replace(/["']?\)/, '');

    if (bgUrl && bgUrl !== 'none') {
      tempImg.onload = () => hero.classList.add('loaded');
      tempImg.src = bgUrl;
    } else {
      hero.classList.add('loaded');
    }
  }
}

/* ===================================
   GALLERY — LIGHTBOX
=================================== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

if (lightbox && lightboxImg) {
  const galleryItems = document.querySelectorAll('.gallery-item[data-src]');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src;
      if (!src) return;
      lightboxImg.src = src;
      lightboxImg.alt = item.querySelector('img')?.alt || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ===================================
   SMOOTH ANCHOR SCROLL
=================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const navHeight = nav?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===================================
   STATS — 숫자 카운트업 애니메이션
=================================== */
function animateCount(el, target, suffix) {
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString('ko-KR') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length > 0) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const text = el.textContent;

        // 숫자와 단위 파싱
        const match = text.match(/^([\d,]+)(.*)$/);
        if (match) {
          const num = parseInt(match[1].replace(/,/g, ''), 10);
          const suffix = match[2] || '';
          const sup = el.querySelector('sup');
          const sub = el.querySelector('sub');
          const supText = sup?.textContent || '';
          const subText = sub?.textContent || '';

          el.innerHTML = '';
          const numSpan = document.createElement('span');
          el.appendChild(numSpan);
          if (supText) {
            const supEl = document.createElement('sup');
            supEl.textContent = supText;
            el.appendChild(supEl);
          }
          if (subText) {
            const subEl = document.createElement('sub');
            subEl.textContent = subText;
            el.appendChild(subEl);
          }

          animateCount(numSpan, num, suffix);
        }

        statsObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => statsObserver.observe(el));
}
