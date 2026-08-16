(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("dots");
  const progressFill = document.getElementById("progressFill");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const curNum = document.getElementById("curNum");
  const totalNum = document.getElementById("totalNum");

  const total = slides.length;
  let current = 0;
  let animating = false;

  totalNum.textContent = total;

  // 하단 점(dot) 인디케이터 생성
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot-item" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `${i + 1}번 슬라이드로 이동`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dotEls = Array.from(dotsWrap.children);

  function render() {
    slides.forEach((s, i) => {
      s.classList.remove("active", "prev");
      if (i === current) s.classList.add("active");
      else if (i < current) s.classList.add("prev");
    });
    dotEls.forEach((d, i) => d.classList.toggle("active", i === current));
    progressFill.style.width = `${((current + 1) / total) * 100}%`;
    curNum.textContent = current + 1;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  function goTo(index) {
    if (animating) return;
    const clamped = Math.max(0, Math.min(total - 1, index));
    if (clamped === current) return;
    current = clamped;
    animating = true;
    render();
    window.setTimeout(() => { animating = false; }, 620);
  }

  function next() { goTo(current + 1); }
  function prevSlide() { goTo(current - 1); }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", next);

  // 키보드 내비게이션
  window.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      next();
    } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "Home") {
      goTo(0);
    } else if (e.key === "End") {
      goTo(total - 1);
    }
  });

  // 마우스 휠 내비게이션 (스로틀 적용)
  let wheelLock = false;
  window.addEventListener("wheel", (e) => {
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 24) return;
    wheelLock = true;
    if (e.deltaY > 0) next(); else prevSlide();
    window.setTimeout(() => { wheelLock = false; }, 700);
  }, { passive: true });

  // 터치 스와이프 내비게이션
  let touchStartX = 0;
  window.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  window.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next(); else prevSlide();
  }, { passive: true });

  // 클릭으로도 다음 슬라이드 (버튼/링크/텍스트 선택 제외)
  document.getElementById("deck").addEventListener("click", (e) => {
    if (e.target.closest("a, button, blockquote, .tag, .three-lines")) return;
    next();
  });

  render();
})();
