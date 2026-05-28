/* ══════════════════════════════
   햄버거 메뉴
══════════════════════════════ */
(function () {
  const burger = document.getElementById('burgerBtn');
  const nav    = document.querySelector('.h-nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', function () {
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.classList.remove('is-open');
    });
  });
})();

/* ══════════════════════════════
   헤더 전화번호 토글
══════════════════════════════ */
(function () {
  const btn = document.getElementById('phoneToggle');
  const num = document.getElementById('phoneNum');
  if (!btn || !num) return;

  btn.addEventListener('click', function () {
    const open = num.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !num.contains(e.target)) {
      num.classList.remove('is-open');
      btn.setAttribute('aria-expanded', false);
    }
  });
})();

/* ══════════════════════════════
   FAQ 아코디언
══════════════════════════════ */
function toggle(btn) {
  const item = btn.closest('.faq-item');
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
  if (!open) item.classList.add('open');
}

/* ══════════════════════════════
   신청 폼 제출
══════════════════════════════ */
function formSubmit(e) {
  e.preventDefault();
  const btn  = e.target.querySelector('.btn-submit');
  const orig = btn.textContent;
  btn.textContent = '✓  신청이 완료되었습니다!';
  btn.style.background = '#4a7c59';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent    = orig;
    btn.style.background = '';
    btn.disabled       = false;
    e.target.reset();
  }, 3200);
}

/* ══════════════════════════════
   히어로 슬라이더
══════════════════════════════ */
(function () {
  const sliderEl = document.querySelector('.hero-slider');
  if (!sliderEl) return;

  const track   = sliderEl.querySelector('.slider-track');
  const slides  = sliderEl.querySelectorAll('.slide');
  const dots    = sliderEl.querySelectorAll('.s-dot');
  const bar     = sliderEl.querySelector('.slider-progress-bar');
  const DELAY   = 5000;   // 자동재생 간격 (ms)
  const total   = slides.length;
  let   cur     = 0;
  let   timer   = null;
  let   paused  = false;

  /* ── 슬라이드 이동 ── */
  function goTo(n, userAction = false) {
    const prev = cur;
    cur = (n + total) % total;

    /* 트랙 이동 */
    track.style.transform = `translateX(-${cur * 100}%)`;

    /* 점 인디케이터 */
    dots.forEach((d, i) => d.classList.toggle('s-dot--active', i === cur));

    /* ★ 배경 + 텍스트 컬러 테마 전환
       CSS transition(0.75s)이 background-color를 부드럽게 처리 */
    sliderEl.setAttribute('data-theme', cur);

    /* 이전 슬라이드 is-entering 제거 */
    slides[prev].classList.remove('is-entering');

    /* 새 슬라이드 등장 애니메이션 (첫 로드 제외) */
    if (userAction || prev !== cur) {
      slides[cur].classList.remove('is-entering');
      void slides[cur].offsetWidth; // reflow
      slides[cur].classList.add('is-entering');
    }

    /* 프로그레스 바 재시작 */
    resetBar();
  }

  /* ── 프로그레스 바 재시작 ── */
  function resetBar() {
    bar.style.animation = 'none';
    void bar.offsetWidth;  // reflow (애니메이션 리셋 트릭)
    bar.style.animation = `progressBar ${DELAY}ms linear forwards`;
  }

  /* ── 자동재생 ── */
  function startAuto() {
    stopAuto();
    if (paused) return;
    timer = setInterval(() => goTo(cur + 1), DELAY);
  }

  function stopAuto() {
    clearInterval(timer);
    timer = null;
  }

  /* ── 화살표 버튼 ── */
  sliderEl.querySelector('.slider-prev').addEventListener('click', () => {
    stopAuto(); goTo(cur - 1, true); startAuto();
  });
  sliderEl.querySelector('.slider-next').addEventListener('click', () => {
    stopAuto(); goTo(cur + 1, true); startAuto();
  });

  /* ── 점 클릭 ── */
  dots.forEach((d, i) => d.addEventListener('click', () => {
    stopAuto(); goTo(i, true); startAuto();
  }));

  /* ── 호버 시 일시정지 ── */
  sliderEl.addEventListener('mouseenter', () => {
    paused = true;
    stopAuto();
    bar.style.animationPlayState = 'paused';
  });
  sliderEl.addEventListener('mouseleave', () => {
    paused = false;
    bar.style.animationPlayState = 'running';
    startAuto();
  });

  /* ── 터치 스와이프 (모바일) ── */
  let touchStartX = 0;
  sliderEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  sliderEl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 48) {
      stopAuto();
      goTo(dx < 0 ? cur + 1 : cur - 1, true);
      startAuto();
    }
  });

  /* ── 초기화 ── */
  sliderEl.setAttribute('data-theme', 0);  /* 첫 테마 즉시 적용 */
  goTo(0);
  startAuto();
})();
