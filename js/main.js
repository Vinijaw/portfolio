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

// Playground: dados de cada bloco. "images" aceita mais de uma entrada assim
// que você adicionar as demais artes de cada projeto na pasta.
const PLAYGROUND_ITEMS = {
  gerenciamento: {
    title: "Sistema de Gerenciamento de Assinaturas",
    descriptionHtml:
      "<p>Criado para resolver os problemas dos funcionários da SED-MS que tramitam vários documentos no dia a dia.</p>" +
      "<p>Esse processo é feito de forma manual, por isso acaba gerando gargalos como desperdício de tempo e falta de segurança dos documentos.</p>" +
      "<p>Desenhei um sistema que conta com uma navegação por abas, permitindo buscas através de filtros e um fluxo de assinatura digital.</p>",
    tags: ["Ferramenta", "Desktop", "Figma"],
    prototypeUrl:
      "https://www.figma.com/proto/Tv9kmz9oMFTrLC06irny30/Sistema-de-Gerenciamento%E2%80%A8de-Assinaturas?node-id=669-25553&p=f&viewport=361%2C148%2C0.32&t=0Tr2hOVtvQlPt424-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=669%3A25553&page-id=567%3A5328",
    images: [
      "assets/images/cases/Playground/Gerenciamento de assinaturas/Telas/slide-1.jpg",
      "assets/images/cases/Playground/Gerenciamento de assinaturas/Telas/slide-2.jpg",
      "assets/images/cases/Playground/Gerenciamento de assinaturas/Telas/slide-3.jpg",
      "assets/images/cases/Playground/Gerenciamento de assinaturas/Telas/slide-4.jpg",
      "assets/images/cases/Playground/Gerenciamento de assinaturas/Telas/slide-5.jpg",
      "assets/images/cases/Playground/Gerenciamento de assinaturas/Telas/slide-6.jpg",
    ],
  },
  zelia: {
    title: "Zelia App",
    descriptionHtml:
      "<p>Um aplicativo com objetivo de revolucionar a forma como as pessoas gerenciam suas roupas e lookinhos.</p>" +
      "<p>No Zelia você pode selecionar ou tirar fotos das suas peças de roupas e o próprio sistema remove o fundo da imagem.</p>" +
      "<p>Você pode visualizar looks criando-os através das peças salvas no seu guarda-roupas virtual ou fazendo o próprio aplicativo gerar automaticamente para você.</p>",
    tags: ["Rede social", "Aplicativo", "Mobile", "Figma"],
    prototypeUrl:
      "https://www.figma.com/proto/MWejRJiquXokAau1LFCC4v/Zelia_Layout_1.0?node-id=11130-15466&viewport=-711%2C517%2C0.3&t=Z5XmpfceGP7ygwG5-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=10738%3A4901&page-id=991%3A4867",
    images: [
      "assets/images/cases/Playground/Zélia/Telas/slide-1.jpg",
      "assets/images/cases/Playground/Zélia/Telas/slide-2.jpg",
      "assets/images/cases/Playground/Zélia/Telas/slide-3.jpg",
      "assets/images/cases/Playground/Zélia/Telas/slide-4.jpg",
      "assets/images/cases/Playground/Zélia/Telas/slide-5.jpg",
    ],
  },
  orbit: {
    title: "Rede social de indicações e experiências",
    descriptionHtml:
      "<p>Com inspirações no Instagram e no iFood, esta é a idealização de uma rede social focada em indicações de lugares e serviços.</p>",
    tags: ["Rede social", "Mobile", "Figma"],
    prototypeUrl:
      "https://www.figma.com/proto/LFqF2Nj4tm6BkcBByfezYw/Orbit-Layout?node-id=129-2335&viewport=393%2C449%2C0.31&t=iuR3EViSUO7MSf0g-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=6%3A96&page-id=2%3A18",
    images: [
      "assets/images/cases/Playground/Orbit/Telas/slide-1.jpg",
      "assets/images/cases/Playground/Orbit/Telas/slide-2.jpg",
      "assets/images/cases/Playground/Orbit/Telas/slide-3.jpg",
      "assets/images/cases/Playground/Orbit/Telas/slide-4.jpg",
      "assets/images/cases/Playground/Orbit/Telas/slide-5.jpg",
      "assets/images/cases/Playground/Orbit/Telas/slide-6.jpg",
      "assets/images/cases/Playground/Orbit/Telas/slide-7.jpg",
      "assets/images/cases/Playground/Orbit/Telas/slide-8.jpg",
      "assets/images/cases/Playground/Orbit/Telas/slide-9.jpg",
    ],
  },
  genshin: {
    title: "Assistente de Genshin Impact",
    descriptionHtml:
      '<p>Quando eu jogava Genshin Impact usava um aplicativo chamado <a href="https://play.google.com/store/apps/details?id=com.miraisoft.shiori" target="_blank" rel="noopener noreferrer" class="playground-modal__inline-link">Shiori</a> para me ajudar com os itens que deveria equipar em cada personagem.</p>' +
      "<p>Construí esse layout pensando em praticar mais o mobile e em como eu poderia melhorar o visual do app seguindo o design do jogo.</p>",
    tags: ["Aplicativo", "Mobile", "UI", "Figma"],
    prototypeUrl: null,
    images: ["assets/images/cases/Playground/Genshin/Telas/slide-1.jpg"],
  },
};

// Playground: clique no bloco abre a modal com carrossel + informações do projeto.
const playgroundModal = document.getElementById("playgroundModal");
if (playgroundModal) {
  const carouselEl = playgroundModal.querySelector(".playground-modal__carousel");
  const mediaEl = playgroundModal.querySelector(".playground-modal__media");
  const navPrev = playgroundModal.querySelector(".playground-modal__nav--prev");
  const navNext = playgroundModal.querySelector(".playground-modal__nav--next");
  const dotsEl = playgroundModal.querySelector(".playground-modal__dots");
  const titleEl = playgroundModal.querySelector(".playground-modal__title");
  const descEl = playgroundModal.querySelector(".playground-modal__desc");
  const tagsEl = playgroundModal.querySelector(".playground-modal__tags");
  const linkEl = playgroundModal.querySelector(".playground-modal__link");
  const closeBtn = playgroundModal.querySelector(".playground-modal__actions [data-playground-close]");

  const VIDEO_EXT = /\.(mp4|webm)$/i;

  let currentImages = [];
  let currentSlide = 0;
  let lastFocusedEl = null;
  let trackEl = null;

  // Só as telas deslizam (a trilha translada); o fundo gradiente vive fora
  // do carrossel (.playground-modal__glow, ver CSS) e nunca se move.
  const goToSlide = (index) => {
    if (!currentImages.length) return;
    currentSlide = (index + currentImages.length) % currentImages.length;
    const step = 100 / currentImages.length;
    trackEl.style.transform = `translateX(-${currentSlide * step}%)`;

    trackEl.querySelectorAll("video").forEach((video, i) => {
      if (i === currentSlide) video.play();
      else video.pause();
    });
    dotsEl.querySelectorAll(".playground-modal__dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentSlide);
    });
  };

  const renderCarousel = (images) => {
    currentImages = images;
    currentSlide = 0;
    carouselEl.innerHTML = "";
    dotsEl.innerHTML = "";

    trackEl = document.createElement("div");
    trackEl.className = "playground-modal__track";
    trackEl.style.width = `${images.length * 100}%`;
    carouselEl.appendChild(trackEl);

    images.forEach((src, i) => {
      const isVideo = VIDEO_EXT.test(src);
      const slide = document.createElement("div");
      slide.className = "playground-modal__slide";
      slide.style.width = `${100 / images.length}%`;

      const media = document.createElement(isVideo ? "video" : "img");
      media.src = src;
      if (isVideo) {
        media.loop = true;
        media.muted = true;
        media.playsInline = true;
        if (i === 0) media.play();
      } else {
        media.alt = "";
      }
      slide.appendChild(media);
      trackEl.appendChild(slide);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "playground-modal__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Mídia ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i));
      dotsEl.appendChild(dot);
    });

    const hasMultiple = images.length > 1;
    navPrev.hidden = !hasMultiple;
    navNext.hidden = !hasMultiple;
    dotsEl.hidden = !hasMultiple;
  };

  const openPlaygroundModal = (key) => {
    const item = PLAYGROUND_ITEMS[key];
    if (!item) return;

    // Fundo gradiente é fixo por projeto (ver seletores [data-project] no
    // CSS) — não muda ao trocar de tela, só é definido uma vez aqui.
    mediaEl.dataset.project = key;
    renderCarousel(item.images);
    titleEl.textContent = item.title;
    descEl.innerHTML = item.descriptionHtml;

    tagsEl.innerHTML = "";
    item.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "playground-modal__tag";
      span.textContent = tag;
      tagsEl.appendChild(span);
    });

    if (item.prototypeUrl) {
      linkEl.href = item.prototypeUrl;
      linkEl.hidden = false;
    } else {
      linkEl.hidden = true;
    }

    lastFocusedEl = document.activeElement;
    playgroundModal.classList.add("is-open");
    playgroundModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("playground-modal-open");
    closeBtn.focus();
  };

  const closePlaygroundModal = () => {
    playgroundModal.classList.remove("is-open");
    playgroundModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("playground-modal-open");
    if (lastFocusedEl) lastFocusedEl.focus();
  };

  document.querySelectorAll(".playground-block").forEach((block) => {
    block.addEventListener("click", () => openPlaygroundModal(block.dataset.playgroundItem));
  });

  playgroundModal.querySelectorAll("[data-playground-close]").forEach((el) => {
    el.addEventListener("click", closePlaygroundModal);
  });

  navPrev.addEventListener("click", () => goToSlide(currentSlide - 1));
  navNext.addEventListener("click", () => goToSlide(currentSlide + 1));

  document.addEventListener("keydown", (event) => {
    if (!playgroundModal.classList.contains("is-open")) return;
    if (event.key === "Escape") closePlaygroundModal();
    if (event.key === "ArrowLeft") goToSlide(currentSlide - 1);
    if (event.key === "ArrowRight") goToSlide(currentSlide + 1);
  });
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
