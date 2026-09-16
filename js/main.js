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

// Scroll reveal (fade + blur): itens marcados com .reveal aparecem ao entrar
// na viewport, com um pequeno atraso escalonado entre irmãos do mesmo grupo
// pra dar a sensação de cascata (cards de um grid revelando em sequência).
// Dispara só uma vez por elemento — depois de visível, para de observar.
{
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const groupIndex = new Map();
    const delayFor = (el) => {
      const parent = el.parentElement;
      const i = groupIndex.get(parent) || 0;
      groupIndex.set(parent, i + 1);
      return Math.min(i, 5) * 90;
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.style.transitionDelay = `${delayFor(el)}ms`;
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
}

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  });
});

// Header sem fundo: o texto escuro (pensado pra sobrar em cima de conteúdo
// claro) fica ilegível quando um bloco escuro passa por baixo dele. Troca
// só a cor do texto pra clara nesse momento. ".section--dark" cobre a
// maioria, mas ".logos--tools" (a faixa de ferramentas) e o rodapé também
// são escuros e usam classes próprias, sem herdar ".section--dark" — por
// isso entram explícitos aqui também. Detecta com IntersectionObserver:
// observa os blocos escuros com uma rootMargin que vira uma faixa fina
// exatamente na altura do header, então o "isIntersecting" já diz se tem
// bloco escuro ali embaixo, sem precisar de listener de scroll.
{
  const header = document.querySelector(".header");
  const darkSections = document.querySelectorAll(".section--dark, .logos--tools, .footer");

  if (header && darkSections.length) {
    const updateHeaderTone = () => {
      const headerHeight = header.getBoundingClientRect().height;
      const onDark = Array.from(darkSections).some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= headerHeight && rect.bottom >= headerHeight;
      });
      header.classList.toggle("header--on-dark", onDark);
    };

    const headerHeight = header.getBoundingClientRect().height;
    const observer = new IntersectionObserver(updateHeaderTone, {
      rootMargin: `-${headerHeight}px 0px -${Math.max(window.innerHeight - headerHeight - 1, 0)}px 0px`,
      threshold: [0, 1],
    });
    darkSections.forEach((section) => observer.observe(section));
    updateHeaderTone();
  }
}

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

// Marcas com quem já trabalhei: o carrossel roda sozinho e o CSS já
// colore + pausa no :hover — mas touch não tem hover de verdade (o
// navegador simula um hover "preso" no toque, sem jeito confiável de
// soltar). Aqui a gente assume o controle só em quem não tem hover de
// verdade: tocar numa marca fixa ela colorida e pausa o carrossel,
// tocar de novo solta e volta a rodar. Em telas com mouse, o clique não
// faz nada — continua só no :hover, como era antes.
{
  const brandsMarquee = document.querySelector(".hero__brands-marquee");
  const brandLinks = document.querySelectorAll(".hero__brand-link");
  const hasRealHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (brandsMarquee && brandLinks.length && !hasRealHover) {
    let pinned = null;

    brandLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (pinned === link) {
          pinned.classList.remove("is-pinned");
          pinned = null;
          brandsMarquee.classList.remove("is-paused");
        } else {
          pinned?.classList.remove("is-pinned");
          pinned = link;
          pinned.classList.add("is-pinned");
          brandsMarquee.classList.add("is-paused");
        }
      });
    });
  }
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
  const dialogEl = playgroundModal.querySelector(".playground-modal__dialog");
  const carouselEl = playgroundModal.querySelector(".playground-modal__carousel");
  const mediaEl = playgroundModal.querySelector(".playground-modal__media");
  const navPrev = playgroundModal.querySelector(".playground-modal__nav--prev");
  const navNext = playgroundModal.querySelector(".playground-modal__nav--next");
  const dotsEl = playgroundModal.querySelector(".playground-modal__dots");
  const infoEl = playgroundModal.querySelector(".playground-modal__info");
  const titleEl = playgroundModal.querySelector(".playground-modal__title");
  const descEl = playgroundModal.querySelector(".playground-modal__desc");
  const tagsEl = playgroundModal.querySelector(".playground-modal__tags");
  // Duas instâncias do link/botão "Abrir protótipo" existem no DOM: uma no
  // cabeçalho (desktop) e uma na barra fixa do rodapé (mobile) — ver CSS.
  const linkEls = playgroundModal.querySelectorAll(".playground-modal__link");

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
      media.draggable = false;
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

    linkEls.forEach((el) => {
      if (item.prototypeUrl) {
        el.href = item.prototypeUrl;
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });

    lastFocusedEl = document.activeElement;
    playgroundModal.classList.add("is-open");
    playgroundModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("playground-modal-open");
    dialogEl.focus();
  };

  const closePlaygroundModal = () => {
    playgroundModal.classList.remove("is-open");
    playgroundModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("playground-modal-open");
    mediaEl.style.height = "";
    carouselEl.style.transform = "";
    if (infoEl) infoEl.style.transform = "";
    if (lastFocusedEl) lastFocusedEl.focus();
  };

  // TESTE: no layout mobile, rolar o bloco de texto "recolhe" ele e faz
  // a mídia crescer (efeito de app bar retrátil) — rolar de volta pro
  // topo desfaz. Ligado só nessa faixa de largura porque no desktop
  // mídia e texto são colunas de altura fixa lado a lado, não faz
  // sentido crescer uma redimensionando a outra.
  if (infoEl && window.matchMedia("(max-width: 780px)").matches) {
    const MEDIA_MIN_VH = 34;
    const MEDIA_MAX_VH = 52;
    const SCROLL_RANGE = 160;

    infoEl.addEventListener(
      "scroll",
      () => {
        const t = Math.min(1, Math.max(0, infoEl.scrollTop / SCROLL_RANGE));
        mediaEl.style.height = `${MEDIA_MIN_VH + (MEDIA_MAX_VH - MEDIA_MIN_VH) * t}vh`;
        carouselEl.style.transform = `scale(${1 + t * 0.08})`;
        infoEl.style.transformOrigin = "top center";
        infoEl.style.transform = `scale(${1 - t * 0.06})`;
      },
      { passive: true }
    );
  }

  document.querySelectorAll(".playground-block").forEach((block) => {
    block.addEventListener("click", () => openPlaygroundModal(block.dataset.playgroundItem));
  });

  playgroundModal.querySelectorAll("[data-playground-close]").forEach((el) => {
    el.addEventListener("click", closePlaygroundModal);
  });

  navPrev.addEventListener("click", () => goToSlide(currentSlide - 1));
  navNext.addEventListener("click", () => goToSlide(currentSlide + 1));

  // Arrastar o carrossel de mídia da modal (touch ou mouse) pra trocar de
  // imagem, com a mesma resistência elástica nas pontas e resposta a flick
  // rápido usadas no slider do grid do Laboratório.
  let carouselDragging = false;
  let carouselStartX = 0;
  let carouselLastX = 0;
  let carouselLastTime = 0;
  let carouselVelocity = 0;
  let carouselDeltaPct = 0;
  let carouselSuppressNextClick = false;

  const onCarouselPointerDown = (event) => {
    if (currentImages.length < 2 || event.button === 2) return;
    carouselDragging = true;
    carouselEl.classList.add("is-dragging");
    trackEl.style.transition = "none";
    carouselStartX = carouselLastX = event.clientX;
    carouselLastTime = performance.now();
    carouselVelocity = 0;
    carouselDeltaPct = 0;
  };

  const onCarouselPointerMove = (event) => {
    if (!carouselDragging) return;
    const now = performance.now();
    const dt = now - carouselLastTime || 16;
    carouselVelocity = (event.clientX - carouselLastX) / dt;
    carouselLastX = event.clientX;
    carouselLastTime = now;

    const step = 100 / currentImages.length;
    const viewportWidth = carouselEl.getBoundingClientRect().width || 1;
    carouselDeltaPct = ((event.clientX - carouselStartX) / viewportWidth) * step;

    let proposed = -currentSlide * step + carouselDeltaPct;
    const maxPct = 0;
    const minPct = -(currentImages.length - 1) * step;
    if (proposed > maxPct) proposed = maxPct + (proposed - maxPct) * 0.35;
    if (proposed < minPct) proposed = minPct + (proposed - minPct) * 0.35;

    trackEl.style.transform = `translateX(${proposed}%)`;
  };

  const onCarouselPointerUp = () => {
    if (!carouselDragging) return;
    carouselDragging = false;
    carouselEl.classList.remove("is-dragging");
    trackEl.style.transition = "";
    window.removeEventListener("pointermove", onCarouselPointerMove);
    window.removeEventListener("pointerup", onCarouselPointerUp);
    window.removeEventListener("pointercancel", onCarouselPointerUp);

    // Se o dedo/mouse soltar em cima da seta de prev/next (comum perto da
    // borda em telas estreitas), o click nativo do botão dispararia por
    // cima do gesto e desfaria/duplicaria a troca de slide.
    carouselSuppressNextClick = Math.abs(carouselLastX - carouselStartX) > 6;

    const step = 100 / currentImages.length;
    const draggedSlides = Math.round(-carouselDeltaPct / step);
    let targetIndex = currentSlide + draggedSlides;
    if (draggedSlides === 0 && Math.abs(carouselVelocity) > 0.4) {
      targetIndex = currentSlide + (carouselVelocity < 0 ? 1 : -1);
    }
    goToSlide(targetIndex);
  };

  carouselEl.addEventListener("pointerdown", (event) => {
    onCarouselPointerDown(event);
    if (!carouselDragging) return;
    // Move/up ficam no window, não no carrossel: os botões de prev/next
    // são irmãos sobrepostos nas bordas, e num arraste que termina em
    // cima deles o "solta" nunca chegaria ao carrossel se ficasse só nele.
    window.addEventListener("pointermove", onCarouselPointerMove);
    window.addEventListener("pointerup", onCarouselPointerUp);
    window.addEventListener("pointercancel", onCarouselPointerUp);
  });

  mediaEl.addEventListener(
    "click",
    (event) => {
      if (carouselSuppressNextClick) {
        event.stopPropagation();
        event.preventDefault();
        carouselSuppressNextClick = false;
      }
    },
    true
  );

  document.addEventListener("keydown", (event) => {
    if (!playgroundModal.classList.contains("is-open")) return;
    if (event.key === "Escape") closePlaygroundModal();
    if (event.key === "ArrowLeft") goToSlide(currentSlide - 1);
    if (event.key === "ArrowRight") goToSlide(currentSlide + 1);
  });
}

// Playground no mobile: os cards viram um carrossel "coverflow" arrastável
// (card em foco grande no centro, vizinhos menores nas laterais) com uma
// resposta de "jogar o card" ao soltar, proporcional à velocidade do gesto.
// No desktop (grid normal) isso fica todo desligado.
{
  const grid = document.querySelector(".playground__grid");
  const track = document.querySelector(".playground__track");
  const cards = track ? Array.from(track.querySelectorAll(".playground-block")) : [];

  if (grid && track && cards.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const mobileQuery = window.matchMedia("(max-width: 640px)");

    let active = false;
    let isDragging = false;
    let currentIndex = 0;
    let baseTranslate = 0;
    let dragDelta = 0;
    let startX = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let suppressNextClick = false;

    // offsetLeft não é afetado pelo transform da trilha, então dá a posição
    // "de repouso" real de cada card — já embutindo o padding-inline da
    // trilha (usado pelo fallback sem JS). Medir em vez de assumir index*step
    // a partir de zero é o que garante o card centralizar de verdade.
    const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].getBoundingClientRect().width);

    const cardCenter = (index) => cards[index].offsetLeft + cards[index].getBoundingClientRect().width / 2;

    const translateForIndex = (index) => grid.getBoundingClientRect().width / 2 - cardCenter(index);

    // Aplica a posição da trilha + a escala/opacidade de cada card conforme
    // a distância (contínua, não só por índice) até o centro do carrossel —
    // é isso que dá o efeito de "cresce ao chegar no meio, encolhe ao sair".
    const render = (translate) => {
      track.style.transform = `translateX(${translate}px)`;
      const s = step() || 1;
      const virtualIndex = (translateForIndex(0) - translate) / s;
      cards.forEach((card, i) => {
        const dist = Math.abs(i - virtualIndex);
        const scale = Math.max(0.82, 1 - dist * 0.16);
        const opacity = Math.max(0.5, 1 - dist * 0.35);
        card.style.transform = `scale(${scale})`;
        card.style.opacity = String(opacity);
      });
    };

    const settle = (index, animate = true) => {
      currentIndex = Math.max(0, Math.min(cards.length - 1, index));
      baseTranslate = translateForIndex(currentIndex);
      track.style.transition = animate ? "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" : "none";
      render(baseTranslate);
    };

    const onPointerDown = (event) => {
      if (!active || event.button === 2) return;
      isDragging = true;
      grid.classList.add("is-dragging");
      track.style.transition = "none";
      startX = lastX = event.clientX;
      lastTime = performance.now();
      velocity = 0;
      dragDelta = 0;
      // Sem setPointerCapture de propósito: em toque (o único input aqui,
      // já que isso só liga no mobile) o pointer já é implicitamente
      // capturado pelo alvo inicial. Capturar explicitamente faz o
      // navegador redirecionar o "click" sintético pro grid em vez do
      // card, quebrando o toque simples que abre a modal do projeto.
    };

    const onPointerMove = (event) => {
      if (!isDragging) return;
      const now = performance.now();
      const dt = now - lastTime || 16;
      velocity = (event.clientX - lastX) / dt;
      lastX = event.clientX;
      lastTime = now;
      dragDelta = event.clientX - startX;

      // Resistência elástica nas pontas: arrastar além do primeiro/último
      // card ainda se move, só que amortecido, em vez de travar seco.
      let proposed = baseTranslate + dragDelta;
      const maxTranslate = translateForIndex(0);
      const minTranslate = translateForIndex(cards.length - 1);
      if (proposed > maxTranslate) proposed = maxTranslate + (proposed - maxTranslate) * 0.35;
      if (proposed < minTranslate) proposed = minTranslate + (proposed - minTranslate) * 0.35;

      render(proposed);
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      grid.classList.remove("is-dragging");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      suppressNextClick = Math.abs(dragDelta) > 6;

      const s = step() || 1;
      const draggedCards = Math.round(-dragDelta / s);
      let targetIndex = currentIndex + draggedCards;
      // Flick rápido sem cruzar metade do card ainda "joga" pro próximo —
      // é o gesto de arremesso, não só o de arrastar até a marca.
      if (draggedCards === 0 && Math.abs(velocity) > 0.4) {
        targetIndex = currentIndex + (velocity < 0 ? 1 : -1);
      }
      settle(targetIndex);
    };

    const enable = () => {
      if (active) return;
      active = true;
      grid.classList.add("is-drag-carousel");
      settle(currentIndex, false);
    };

    const disable = () => {
      if (!active) return;
      active = false;
      isDragging = false;
      grid.classList.remove("is-drag-carousel", "is-dragging");
      track.style.transform = "";
      track.style.transition = "";
      cards.forEach((card) => {
        card.style.transform = "";
        card.style.opacity = "";
      });
    };

    grid.addEventListener("pointerdown", (event) => {
      onPointerDown(event);
      if (!isDragging) return;
      // Move/up ficam no window: se o gesto terminar fora do grid (comum
      // num arraste rápido perto da borda da tela), o "solta" ainda tem
      // que ser recebido, senão o carrossel fica travado em pleno arraste.
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    });

    // Fase de captura: intercepta o clique do card antes de chegar no botão,
    // pra um arraste não ser interpretado como "abrir a modal do projeto".
    grid.addEventListener(
      "click",
      (event) => {
        if (suppressNextClick) {
          event.stopPropagation();
          event.preventDefault();
          suppressNextClick = false;
        }
      },
      true
    );

    mobileQuery.addEventListener("change", (event) => (event.matches ? enable() : disable()));
    if (mobileQuery.matches) enable();

    window.addEventListener("resize", () => {
      if (active) settle(currentIndex, false);
    });
  }
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

// Foto do hero: no desktop o hover já "endireita" a moldura. Sem hover em
// touch, cada toque dá um gesto lúdico (balança e volta) — reaplicando a
// classe do zero a cada toque (removendo, forçando reflow, recolocando)
// pra reiniciar a animação mesmo em toques seguidos rápidos.
{
  const heroPhoto = document.querySelector(".hero__photo");
  if (heroPhoto && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroPhoto.addEventListener("click", () => {
      heroPhoto.classList.remove("is-wiggling");
      void heroPhoto.offsetWidth;
      heroPhoto.classList.add("is-wiggling");
    });
    heroPhoto.addEventListener("animationend", () => heroPhoto.classList.remove("is-wiggling"));
  }
}

// Hobbies (cards com flip): no desktop o hover já vira o card. Sem hover
// em touch — e sem depender de :focus-within, que fica "preso" porque um
// segundo toque no card já focado não o desfoca — o toque vira um toggle
// explícito: primeiro toque vira, segundo desvira.
{
  document.querySelectorAll(".curiosities__hobby").forEach((hobby) => {
    hobby.addEventListener("click", () => hobby.classList.toggle("is-flipped"));
  });
}

// Card "Top músicas — Spotify": busca via /api/spotify-*, que existem só quando
// o site roda no Vercel com as env vars configuradas. Se a chamada falhar (ex.:
// abrindo o index.html direto, ou sem as env vars), o card mantém o placeholder
// do HTML e não quebra a página.
const spotifyCard = document.getElementById("spotifyCard");
if (spotifyCard) {
  const nowPlayingEl = document.getElementById("spotifyNowPlaying");
  const nowPlayingArt = document.getElementById("spotifyNowPlayingArt");
  const nowPlayingTitle = document.getElementById("spotifyNowPlayingTitle");
  const nowPlayingArtist = document.getElementById("spotifyNowPlayingArtist");
  const trackListEl = document.getElementById("spotifyTrackList");
  const trackListInnerEl = document.getElementById("spotifyTrackListInner");

  const renderNowPlaying = (data) => {
    if (!data || !data.isPlaying) {
      nowPlayingEl.hidden = true;
      return;
    }
    nowPlayingEl.hidden = false;
    nowPlayingEl.href = data.url;
    nowPlayingArt.style.backgroundImage = data.art ? `url(${data.art})` : "";
    nowPlayingTitle.textContent = data.title;
    nowPlayingArtist.textContent = data.artist;
  };

  const createTrackLink = (track) => {
    const link = document.createElement("a");
    link.className = "curiosities__track";
    link.href = track.url;
    link.target = "_blank";
    link.rel = "noopener";

    const art = document.createElement("div");
    art.className = "curiosities__track-art";
    art.setAttribute("aria-hidden", "true");
    if (track.art) art.style.backgroundImage = `url(${track.art})`;

    const info = document.createElement("div");
    info.className = "curiosities__track-info";
    const title = document.createElement("strong");
    title.textContent = track.title;
    const artist = document.createElement("span");
    artist.textContent = track.artist;
    info.append(title, artist);

    link.append(art, info);
    return link;
  };

  // Scroll nativo (não uma instância própria do Lenis): numa lista
  // pequena dentro de um card, o Lenis aninhado brigava com o scroll por
  // toque (o gesto de arrastar às vezes não rolava nada), mesmo com
  // wrapper/content apontados pra ela. [data-lenis-prevent] no HTML já
  // garante que a instância principal da página não tenta assumir esse
  // scroll também.
  const renderTopTracks = (tracks) => {
    if (!tracks.length) return;
    trackListInnerEl.innerHTML = "";
    tracks.forEach((track) => trackListInnerEl.appendChild(createTrackLink(track)));
  };

  fetch("/api/spotify-now-playing")
    .then((response) => response.json())
    .then(renderNowPlaying)
    .catch(() => {});

  fetch("/api/spotify-top-tracks")
    .then((response) => response.json())
    .then((data) => renderTopTracks(data.tracks || []))
    .catch(() => {});
}

// Carrossel de fotos ("Curiosidades"): avança sozinho a cada 2.5s, com
// bolinhas indicando a foto atual (clicáveis pra pular direto).
const photoCarousel = document.getElementById("photoCarousel");
if (photoCarousel) {
  const track = document.getElementById("photoCarouselTrack");
  const slides = Array.from(track.children);
  const dots = Array.from(document.getElementById("photoCarouselDots").children);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = null;

  const goTo = (target) => {
    index = (target + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const start = () => {
    if (reduceMotion) return;
    stop();
    timer = setInterval(() => goTo(index + 1), 2500);
  };

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      goTo(dotIndex);
      start();
    });
  });

  document.getElementById("photoCarouselPrev").addEventListener("click", () => {
    goTo(index - 1);
    start();
  });

  document.getElementById("photoCarouselNext").addEventListener("click", () => {
    goTo(index + 1);
    start();
  });

  photoCarousel.addEventListener("mouseenter", stop);
  photoCarousel.addEventListener("mouseleave", start);

  // Arrastar (touch ou mouse) pra trocar de foto — mesmo padrão de
  // arraste usado nos outros carrosséis do site.
  let dragging = false;
  let startX = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let deltaPct = 0;
  let suppressNextClick = false;

  const onPointerDown = (event) => {
    if (slides.length < 2 || event.button === 2) return;
    dragging = true;
    stop();
    track.style.transition = "none";
    startX = lastX = event.clientX;
    lastTime = performance.now();
    velocity = 0;
    deltaPct = 0;
  };

  const onPointerMove = (event) => {
    if (!dragging) return;
    const now = performance.now();
    const dt = now - lastTime || 16;
    velocity = (event.clientX - lastX) / dt;
    lastX = event.clientX;
    lastTime = now;

    const width = photoCarousel.getBoundingClientRect().width || 1;
    deltaPct = ((event.clientX - startX) / width) * 100;
    track.style.transform = `translateX(${-index * 100 + deltaPct}%)`;
  };

  const onPointerUp = () => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = "";
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
    suppressNextClick = Math.abs(lastX - startX) > 6;

    const draggedSlides = Math.round(-deltaPct / 100);
    let targetIndex = index + draggedSlides;
    if (draggedSlides === 0 && Math.abs(velocity) > 0.4) {
      targetIndex = index + (velocity < 0 ? 1 : -1);
    }
    goTo(targetIndex);
    start();
  };

  photoCarousel.addEventListener("pointerdown", (event) => {
    onPointerDown(event);
    if (!dragging) return;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  });

  // Fase de captura: um arraste não pode virar clique na bolinha/seta por
  // baixo do dedo.
  photoCarousel.addEventListener(
    "click",
    (event) => {
      if (suppressNextClick) {
        event.stopPropagation();
        event.preventDefault();
        suppressNextClick = false;
      }
    },
    true
  );

  goTo(0);
  start();
}

// Vitrine dos "Cases Selecionados": número + título + CTA de um lado, foto
// sangrando até a borda da tela do outro. Três transições próprias por
// troca de slide — foto desliza na horizontal, número troca com
// crossfade+escala, título "rola" saindo por baixo e entrando por cima —
// mais setas, dashes de progresso e arraste (touch ou mouse) na foto. A
// modal de senha do case restrito (Área de Operações) também mora aqui,
// já que o gatilho dela agora é o CTA/mídia da vitrine, não mais um card.
{
  const showcase = document.querySelector("[data-cases-showcase]");
  const dataScript = document.querySelector("[data-cases-data]");
  const cases = dataScript ? JSON.parse(dataScript.textContent) : [];

  const mediaTrack = document.querySelector("[data-cases-media-track]");
  const mediaSlides = mediaTrack ? Array.from(mediaTrack.children) : [];
  const prevBtn = document.querySelector("[data-cases-prev]");
  const nextBtn = document.querySelector("[data-cases-next]");
  const dashes = Array.from(document.querySelectorAll("[data-cases-dash]"));
  const numberSlots = Array.from(document.querySelectorAll(".cases-showcase__number-slot"));
  const eyebrowEl = document.querySelector("[data-cases-eyebrow]");
  const titleEl = document.querySelector("[data-cases-title]");
  const titleMask = document.querySelector(".cases-showcase__title-mask");
  const ctaEl = document.querySelector("[data-cases-cta]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // A altura da "máscara" do título precisa caber o maior título de todos
  // os cases, na largura de coluna atual — um valor fixo em em/rem não dá
  // conta porque cada título quebra num número de linhas diferente
  // dependendo da largura da tela. Mede de verdade: clona um título "de
  // mentira" dentro da máscara, testa o texto de cada case, e usa a maior
  // altura encontrada. Roda de novo no resize (a coluna muda de largura)
  // e quando a fonte termina de carregar (métrica muda um pouco).
  const fitTitleMask = () => {
    if (!titleMask || !titleEl || !cases.length) return;
    const probe = titleEl.cloneNode(false);
    probe.removeAttribute("data-cases-title");
    probe.style.position = "static";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    titleMask.appendChild(probe);
    let max = 0;
    cases.forEach((data) => {
      probe.textContent = data.title;
      max = Math.max(max, probe.scrollHeight);
    });
    titleMask.removeChild(probe);
    if (max > 0) titleMask.style.height = `${max}px`;
  };

  // Modal de código pra cases restritos: não é segurança de verdade (quem
  // souber a URL do case ainda acessa direto), só evita deixar o link
  // clicável pra qualquer visitante casual ou motor de busca. Grava o
  // desbloqueio no sessionStorage (mesma chave usada pelo gate da própria
  // página do case, em js/case-lock.js) pra não pedir a senha de novo ao
  // chegar lá.
  const UNLOCK_KEY = "caseUnlocked:area-de-operacoes";
  const lock = document.getElementById("caseLock");
  const digitsWrap = document.getElementById("caseLockDigits");
  const digits = digitsWrap ? Array.from(digitsWrap.querySelectorAll("[data-digit]")) : [];
  const errorEl = document.getElementById("caseLockError");
  const CODE = "405671";
  let pendingHref = null;
  let openLock = () => {};

  if (lock && digits.length) {
    const clearDigits = () => digits.forEach((input) => (input.value = ""));

    openLock = (href) => {
      pendingHref = href;
      clearDigits();
      errorEl.hidden = true;
      digitsWrap.classList.remove("is-shaking");
      lock.classList.add("is-open");
      lock.setAttribute("aria-hidden", "false");
      digits[0].focus();
    };

    const closeLock = () => {
      lock.classList.remove("is-open");
      lock.setAttribute("aria-hidden", "true");
      pendingHref = null;
    };

    const checkCode = () => {
      const code = digits.map((input) => input.value).join("");
      if (code.length < digits.length) return;
      if (code === CODE) {
        sessionStorage.setItem(UNLOCK_KEY, "1");
        window.location.href = pendingHref;
        return;
      }
      errorEl.hidden = false;
      digitsWrap.classList.add("is-shaking");
      window.setTimeout(() => {
        digitsWrap.classList.remove("is-shaking");
        clearDigits();
        digits[0].focus();
      }, 350);
    };

    digits.forEach((input, i) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 1);
        if (input.value && digits[i + 1]) digits[i + 1].focus();
        checkCode();
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !input.value && digits[i - 1]) {
          digits[i - 1].focus();
        }
      });

      input.addEventListener("paste", (event) => {
        const text = (event.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
        if (!text) return;
        event.preventDefault();
        text.slice(0, digits.length).split("").forEach((char, idx) => {
          if (digits[idx]) digits[idx].value = char;
        });
        const next = digits[Math.min(text.length, digits.length - 1)];
        next.focus();
        checkCode();
      });
    });

    lock.querySelectorAll("[data-lock-close]").forEach((el) => el.addEventListener("click", closeLock));

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lock.classList.contains("is-open")) closeLock();
    });
  }

  // Grid estático do mobile (ver .cases-grid-mobile no CSS): mesmo padrão
  // de sempre — o card inteiro fica clicável, e o restrito abre a modal de
  // senha em vez de navegar. Independente da vitrine (que cuida só da
  // própria mídia/CTA), mas compartilha o mesmo openLock.
  document.querySelectorAll(".cases-grid-mobile .case-card:not(.case-card--locked)").forEach((card) => {
    const link = card.querySelector(".case-card__link");
    if (!link || !link.getAttribute("href")) return;
    card.style.cursor = "pointer";
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      window.location.href = link.getAttribute("href");
    });
  });

  document.querySelectorAll(".cases-grid-mobile .case-card--locked").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (event) => {
      event.preventDefault();
      openLock(card.dataset.lockedHref || card.querySelector(".case-card__link")?.getAttribute("href"));
    });
  });

  if (showcase && mediaTrack && mediaSlides.length && cases.length) {
    const SLIDE_WIDTH = 90;
    const GAP = 2;
    const AUTOPLAY_MS = 6500;
    let current = 0;
    let activeNumberSlot = 0;
    let autoplayTimer = null;

    showcase.style.setProperty("--cases-autoplay-ms", `${AUTOPLAY_MS}ms`);

    const swapNumber = (value) => {
      const incoming = numberSlots[1 - activeNumberSlot];
      const outgoing = numberSlots[activeNumberSlot];
      incoming.textContent = value;
      outgoing.classList.remove("is-active");
      incoming.classList.add("is-active");
      activeNumberSlot = 1 - activeNumberSlot;
    };

    // Título revela palavra por palavra: cada palavra ganha sua própria
    // máscara (recorte) + um span que sobe do zero com um delay
    // escalonado — funciona em qualquer quebra de linha, ao contrário de
    // animar a linha inteira (ver CSS pra mais contexto).
    const renderWords = (text, animate) => {
      titleEl.innerHTML = text
        .split(" ")
        .map((word, i) => {
          const delay = (i * 0.05).toFixed(2);
          return `<span class="cases-showcase__word-mask"><span class="cases-showcase__word" style="transition-delay:${delay}s">${word}</span></span>`;
        })
        .join(" ");
      const words = titleEl.querySelectorAll(".cases-showcase__word");
      if (!animate || reducedMotion) {
        words.forEach((w) => w.classList.add("is-in"));
        ctaEl?.classList.add("is-in");
        return;
      }
      ctaEl?.classList.remove("is-in");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          words.forEach((w) => w.classList.add("is-in"));
          ctaEl?.classList.add("is-in");
        });
      });
    };

    // Preenchimento das dashes: só a ativa enche da esquerda pra direita
    // ao longo de AUTOPLAY_MS. Reinicia sempre — troca manual ou
    // automática — pra nunca mostrar um progresso de um slide antigo.
    const restartFill = () => {
      dashes.forEach((dash) => {
        const fill = dash.querySelector(".cases-showcase__dash-fill");
        fill.classList.remove("is-filling", "is-full");
        void fill.offsetHeight;
      });
      const activeFill = dashes[current].querySelector(".cases-showcase__dash-fill");
      if (reducedMotion) activeFill.classList.add("is-full");
      else activeFill.classList.add("is-filling");
    };

    const restingOffset = () => -current * (SLIDE_WIDTH + GAP);

    const render = (previous) => {
      const data = cases[current];

      mediaTrack.style.transform = `translateX(${restingOffset()}%)`;
      mediaSlides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dashes.forEach((dash, i) => dash.classList.toggle("is-active", i === current));

      if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
      if (ctaEl) {
        ctaEl.setAttribute("href", data.href);
        if (data.lockedHref) ctaEl.dataset.lockedHref = data.lockedHref;
        else delete ctaEl.dataset.lockedHref;
      }

      if (previous === undefined) {
        // Primeira renderização: já visível, sem animar a troca (a vitrine
        // precisa estar legível assim que a página carrega).
        numberSlots[activeNumberSlot].textContent = data.number;
        renderWords(data.title, false);
      } else {
        swapNumber(data.number);
        renderWords(data.title, true);
      }
      restartFill();
    };

    const goTo = (next) => {
      // Roda em loop: com autoplay ligado, parar nas pontas ficaria
      // estranho — o reel segue girando como uma rolagem de trabalhos.
      const clamped = ((next % cases.length) + cases.length) % cases.length;
      if (clamped === current) { restartFill(); return; }
      const previous = current;
      current = clamped;
      render(previous);
      scheduleAutoplay();
    };

    function scheduleAutoplay() {
      window.clearTimeout(autoplayTimer);
      if (reducedMotion) return;
      autoplayTimer = window.setTimeout(() => goTo(current + 1), AUTOPLAY_MS);
    }

    render();
    fitTitleMask();
    scheduleAutoplay();

    let resizeTimer;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(fitTitleMask, 150);
    });

    if (document.fonts?.ready) document.fonts.ready.then(fitTitleMask);

    // Autoplay pausa enquanto a vitrine está sob o mouse/foco, e retoma
    // (do zero) assim que a pessoa sai — não briga com quem está de fato
    // olhando ou navegando por teclado.
    showcase.addEventListener("mouseenter", () => window.clearTimeout(autoplayTimer));
    showcase.addEventListener("mouseleave", scheduleAutoplay);
    showcase.addEventListener("focusin", () => window.clearTimeout(autoplayTimer));
    showcase.addEventListener("focusout", scheduleAutoplay);

    showcase.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") { goTo(current + 1); event.preventDefault(); }
      if (event.key === "ArrowLeft") { goTo(current - 1); event.preventDefault(); }
    });

    prevBtn?.addEventListener("click", () => goTo(current - 1));
    nextBtn?.addEventListener("click", () => goTo(current + 1));
    dashes.forEach((dash, i) => dash.addEventListener("click", () => goTo(i)));

    // Clique na mídia: se já é o slide em foco, navega (ou abre a modal de
    // senha, se for o case restrito); se é o vizinho espiado, só traz ele
    // pro foco.
    mediaSlides.forEach((slide, i) => {
      slide.addEventListener("click", (event) => {
        if (i !== current) {
          event.preventDefault();
          event.stopPropagation();
          goTo(i);
          return;
        }
        const data = cases[i];
        if (data.lockedHref) {
          event.preventDefault();
          openLock(data.lockedHref);
        } else {
          window.location.href = data.href;
        }
      });
    });

    // CTA "Ver case completo": mesmo gate — se o case ativo no momento do
    // clique é o restrito, abre a modal em vez de seguir o link.
    ctaEl?.addEventListener("click", (event) => {
      if (ctaEl.dataset.lockedHref) {
        event.preventDefault();
        openLock(ctaEl.dataset.lockedHref);
      }
    });

    let dragging = false;
    let startX = 0;
    let lastX = 0;
    let suppressNextClick = false;

    const onPointerMove = (event) => {
      if (!dragging) return;
      lastX = event.clientX;
      const width = showcase.getBoundingClientRect().width || 1;
      const deltaPct = ((event.clientX - startX) / width) * 100;
      mediaTrack.style.transform = `translateX(${restingOffset() + deltaPct}%)`;
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      showcase.classList.remove("is-dragging");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      suppressNextClick = Math.abs(lastX - startX) > 6;

      const width = showcase.getBoundingClientRect().width || 1;
      const deltaPct = ((lastX - startX) / width) * 100;
      const DRAG_THRESHOLD = 8;
      if (deltaPct <= -DRAG_THRESHOLD) goTo(current + 1);
      else if (deltaPct >= DRAG_THRESHOLD) goTo(current - 1);
      else mediaTrack.style.transform = `translateX(${restingOffset()}%)`; // arraste curto: só reassenta a trilha, sem trocar número/título
    };

    mediaTrack.addEventListener("pointerdown", (event) => {
      if (mediaSlides.length < 2 || event.button === 2) return;
      dragging = true;
      showcase.classList.add("is-dragging");
      startX = lastX = event.clientX;
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    });

    // Fase de captura: um arraste não pode virar clique numa mídia por
    // baixo do dedo/mouse (levaria pro case errado ao soltar em cima de
    // outro slide).
    mediaTrack.addEventListener(
      "click",
      (event) => {
        if (suppressNextClick) {
          event.stopPropagation();
          event.preventDefault();
          suppressNextClick = false;
        }
      },
      true
    );
  }
}
