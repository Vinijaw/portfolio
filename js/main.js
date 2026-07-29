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
  const dialogEl = playgroundModal.querySelector(".playground-modal__dialog");
  const carouselEl = playgroundModal.querySelector(".playground-modal__carousel");
  const mediaEl = playgroundModal.querySelector(".playground-modal__media");
  const navPrev = playgroundModal.querySelector(".playground-modal__nav--prev");
  const navNext = playgroundModal.querySelector(".playground-modal__nav--next");
  const dotsEl = playgroundModal.querySelector(".playground-modal__dots");
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

  // Instância própria do Lenis pra lista de faixas ter a mesma inércia do
  // scroll da página, mas sem entrar em conflito com ela: a própria lista
  // já é excluída da instância principal via [data-lenis-prevent].
  let trackListLenis = null;
  if (typeof Lenis !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    trackListEl.classList.add("curiosities__track-list--lenis");
    trackListLenis = new Lenis({
      wrapper: trackListEl,
      content: trackListInnerEl,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const trackListRaf = (time) => {
      trackListLenis.raf(time);
      requestAnimationFrame(trackListRaf);
    };
    requestAnimationFrame(trackListRaf);
  }

  const renderTopTracks = (tracks) => {
    if (!tracks.length) return;
    trackListInnerEl.innerHTML = "";
    tracks.forEach((track) => trackListInnerEl.appendChild(createTrackLink(track)));
    trackListLenis?.resize();
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

  goTo(0);
  start();
}
