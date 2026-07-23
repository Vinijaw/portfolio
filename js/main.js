// Scroll suave com inércia (efeito de "freada" no final do movimento)
if (typeof Lenis !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    anchors: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Fundo geométrico do hero: formas se movem com o mouse e com o scroll (parallax por profundidade)
const hero = document.querySelector(".hero");
if (hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let targetMX = 0;
  let targetMY = 0;
  let targetSY = 0;
  let currentMX = 0;
  let currentMY = 0;
  let currentSY = 0;

  const updateScrollTarget = () => {
    const rect = hero.getBoundingClientRect();
    const progress = 1 - rect.top / window.innerHeight;
    targetSY = Math.min(Math.max(progress - 0.5, -1), 1);
  };

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    targetMX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    targetMY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  hero.addEventListener("pointerleave", () => {
    targetMX = 0;
    targetMY = 0;
  });

  window.addEventListener("scroll", updateScrollTarget, { passive: true });
  updateScrollTarget();

  const tick = () => {
    currentMX += (targetMX - currentMX) * 0.08;
    currentMY += (targetMY - currentMY) * 0.08;
    currentSY += (targetSY - currentSY) * 0.08;
    hero.style.setProperty("--mx", currentMX.toFixed(3));
    hero.style.setProperty("--my", currentMY.toFixed(3));
    hero.style.setProperty("--sy", currentSY.toFixed(3));
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Enquanto a foto real não é adicionada, mostra um placeholder no lugar da imagem quebrada
const heroPhotoImg = document.querySelector(".hero__photo-img");
if (heroPhotoImg) {
  const markPhotoEmpty = () => heroPhotoImg.closest(".hero__photo").classList.add("is-empty");

  if (heroPhotoImg.complete && heroPhotoImg.naturalWidth === 0) {
    markPhotoEmpty();
  } else {
    heroPhotoImg.addEventListener("error", markPhotoEmpty);
  }
}
