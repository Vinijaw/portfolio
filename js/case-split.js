// Controla o "deck" de slides do case em layout apresentação
// (case-area-de-operacoes.html): em vez de rolar a página, o scroll
// (roda do mouse, touch, setas do teclado ou os botões no canto inferior
// direito) troca qual .slide está visível dentro de #deck via crossfade,
// sem o viewport se mover. O CTA final é o último slide do deck. Se o
// painel de texto (coluna esquerda) do slide atual tiver conteúdo maior
// que a tela, o scroll rola esse painel primeiro — só troca de slide
// quando ele já estiver no fim (ou no início, pra voltar).
{
  const deck = document.getElementById("deck");

  if (deck) {
    const isMobile = () => window.matchMedia("(max-width: 900px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const slides = Array.from(deck.querySelectorAll(".slide"));
    const lastIndex = slides.length - 1;
    const LOCK_MS = reducedMotion ? 0 : 600;

    const navUpBtn = document.querySelector('.slide-nav__btn[data-dir="up"]');
    const navDownBtn = document.querySelector('.slide-nav__btn[data-dir="down"]');
    const navCounter = document.getElementById("slideNavCounter");
    const summaryBtn = document.getElementById("slideNavSummaryBtn");
    const drawer = document.getElementById("deckDrawer");
    const drawerItems = drawer
      ? Array.from(drawer.querySelectorAll(".deck-drawer__list button[data-target]"))
      : [];
    const lightbox = document.getElementById("lightbox");

    // Foto do board do Focus Group: overlay fixo que só aparece nos
    // slides do Focus Group (slide-4 e slide-4b). Fica parada enquanto o
    // usuário passa de um pro outro — só o painel de contexto faz o
    // crossfade. Ver .fg-deck-image em css/case-study-split.css.
    const fgImage = deck.querySelector("[data-fg-image]");
    const fgSlideIds = new Set(["slide-4", "slide-4b"]);

    // Retoma no slide de onde o usuário saiu (ex.: recarregou a página)
    // via #slide-N na URL — o hash é atualizado a cada troca de slide.
    const slideFromHash = slides.findIndex((slide) => slide.id === window.location.hash.slice(1));

    let index = slideFromHash >= 0 ? slideFromHash : 0;
    let locked = false;

    // Marca na gaveta a etapa a que o slide atual pertence: o último
    // item cujo slide-alvo já foi alcançado.
    const markSummaryCurrent = () => {
      let currentItem = null;
      drawerItems.forEach((item) => {
        const ti = slides.findIndex((s) => s.id === item.dataset.target);
        if (ti >= 0 && ti <= index) currentItem = item;
      });
      drawerItems.forEach((item) => item.classList.toggle("is-current", item === currentItem));
    };

    const isSummaryOpen = () => document.body.classList.contains("summary-open");

    const closeSummary = () => {
      if (!drawer || !isSummaryOpen()) return;
      document.body.classList.remove("summary-open");
      summaryBtn.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
    };

    const openSummary = () => {
      if (!drawer) return;
      markSummaryCurrent();
      document.body.classList.add("summary-open");
      summaryBtn.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
    };

    // Contadores animados: os <span data-countup> de um slide sobem de 0
    // até o valor toda vez que ele entra em cena — efeito rápido, só pra
    // dar um comportamento interativo aos números. data-decimals controla
    // as casas (renderizadas com vírgula).
    const fmtCount = (n, dec) =>
      dec ? n.toFixed(dec).replace(".", ",") : String(Math.round(n));

    const runCountUps = (slide) => {
      if (!slide) return;
      slide.querySelectorAll("[data-countup]").forEach((el) => {
        const target = parseFloat(el.dataset.countup);
        if (Number.isNaN(target)) return;
        const dec = parseInt(el.dataset.decimals || "0", 10);
        if (el._countRAF) cancelAnimationFrame(el._countRAF);
        if (reducedMotion) {
          el.textContent = fmtCount(target, dec);
          return;
        }
        const duration = 1500;
        const t0 = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          if (p < 1) {
            el.textContent = fmtCount(target * eased, dec);
            el._countRAF = requestAnimationFrame(step);
          } else {
            el.textContent = fmtCount(target, dec);
            el._countRAF = null;
          }
        };
        el._countRAF = requestAnimationFrame(step);
      });
    };

    const render = () => {
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      runCountUps(slides[index]);
      if (navUpBtn) navUpBtn.disabled = index === 0;
      if (navDownBtn) navDownBtn.disabled = index === lastIndex;
      markSummaryCurrent();
      if (navCounter) {
        const pad = (n) => String(n).padStart(2, "0");
        navCounter.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
      }
      if (fgImage) {
        fgImage.classList.toggle("is-shown", fgSlideIds.has(slides[index].id));
      }
      const hash = `#${slides[index].id}`;
      if (window.location.hash !== hash) {
        history.replaceState(null, "", hash);
      }
    };

    const goTo = (next) => {
      const clamped = Math.max(0, Math.min(lastIndex, next));
      if (clamped === index || locked) return;
      index = clamped;
      render();
      if (LOCK_MS) {
        locked = true;
        window.setTimeout(() => {
          locked = false;
        }, LOCK_MS);
      }
    };

    render();

    // Na pilha mobile o render() só roda uma vez, então os contadores dos
    // outros slides sobem quando entram na viewport.
    if (isMobile()) {
      const countObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runCountUps(entry.target);
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.35 }
      );
      slides.forEach((slide) => {
        if (slide.querySelector("[data-countup]")) countObserver.observe(slide);
      });

      // "Current" do sumário: sem o controle de scroll do deck, marca a
      // seção atual pela posição real de rolagem (a última que cruzou a
      // faixa central da tela), em vez de depender do índice do deck
      // (que nunca muda sozinho fora do modo apresentação).
      const spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const i = slides.indexOf(entry.target);
            if (i >= 0) {
              index = i;
              markSummaryCurrent();
            }
          });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );
      slides.forEach((slide) => spyObserver.observe(slide));
    }

    navUpBtn?.addEventListener("click", () => goTo(index - 1));
    navDownBtn?.addEventListener("click", () => goTo(index + 1));

    // Gaveta de sumário: abre pela direita comprimindo o deck. Um item
    // da lista pula pra etapa e fecha. Fecha também com clique fora ou Esc.
    summaryBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      if (isSummaryOpen()) closeSummary();
      else openSummary();
    });
    drawerItems.forEach((item) => {
      item.addEventListener("click", () => {
        const target = slides.findIndex((s) => s.id === item.dataset.target);
        if (target < 0) return;
        if (isMobile()) {
          // Pilha mobile: não existe "trocar de slide", é rolar até a
          // seção clicada.
          slides[target].scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        } else {
          goTo(target);
        }
        closeSummary();
      });
    });
    document.addEventListener("click", (event) => {
      if (isSummaryOpen() && !event.target.closest(".deck-drawer, .deck-summary-btn")) {
        closeSummary();
      }
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSummary();
    });

    if (!isMobile()) {
      const lightboxOpen = () => lightbox?.classList.contains("is-open");
      const inDeckZone = () => window.scrollY <= 0;

      // Se o mouse/toque estiver dentro do bloco de contexto (o painel de
      // texto) e ele ainda tiver conteúdo pra rolar na direção pedida,
      // devolve true e a gente deixa o navegador rolar ele normalmente
      // (sem mexer no evento). Fora do painel — ou seja, no bloco de
      // conteúdo — a checagem nem roda: qualquer scroll ali já troca de
      // etapa direto.
      const panelHasRoomToScroll = (panel, forward) => {
        if (!panel) return false;
        if (forward) return panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1;
        return panel.scrollTop > 0;
      };

      window.addEventListener(
        "wheel",
        (event) => {
          if (!inDeckZone() || locked || lightboxOpen()) return;
          const forward = event.deltaY > 0;
          const panel = event.target.closest(".slide__panel");
          if (panel && panelHasRoomToScroll(panel, forward)) return;
          if (forward && index === lastIndex) return;
          if (!forward && index === 0) return;
          event.preventDefault();
          goTo(index + (forward ? 1 : -1));
        },
        { passive: false }
      );

      let touchStartY = null;
      window.addEventListener(
        "touchstart",
        (event) => {
          touchStartY = event.touches[0].clientY;
        },
        { passive: true }
      );

      window.addEventListener(
        "touchmove",
        (event) => {
          if (touchStartY === null || !inDeckZone() || locked || lightboxOpen()) return;
          const dy = touchStartY - event.touches[0].clientY;
          if (Math.abs(dy) < 40) return;
          const forward = dy > 0;
          const panel = event.target.closest(".slide__panel");
          if (panel && panelHasRoomToScroll(panel, forward)) return;
          if (forward && index === lastIndex) return;
          if (!forward && index === 0) return;
          event.preventDefault();
          touchStartY = event.touches[0].clientY;
          goTo(index + (forward ? 1 : -1));
        },
        { passive: false }
      );

      window.addEventListener("keydown", (event) => {
        if (!inDeckZone() || locked || lightboxOpen()) return;
        const isDown = event.key === "ArrowDown" || event.key === "PageDown";
        const isUp = event.key === "ArrowUp" || event.key === "PageUp";
        if (!isDown && !isUp) return;
        const panel = slides[index]?.querySelector(".slide__panel");
        if (panel && panelHasRoomToScroll(panel, isDown)) return;
        if (isDown && index === lastIndex) return;
        if (isUp && index === 0) return;
        event.preventDefault();
        goTo(index + (isDown ? 1 : -1));
      });
    }
  }

  // Carrossel de telas dentro do palco (ver .stage-carousel em
  // case-area-de-operacoes.html, usado quando uma seção tem mais de uma
  // imagem pra mostrar) — troca por seta ou bolinha, sem empilhar as
  // imagens verticalmente.
  // Largura de cada tela e o respiro entre elas, em % da viewport do
  // carrossel — têm que bater com .stage-carousel__slide no CSS
  // (flex: 0 0 84%; margin-right: 3%;) pra prévia da próxima tela ficar
  // exatamente na borda.
  const CAROUSEL_SLIDE_WIDTH = 84;
  const CAROUSEL_GAP = 3;
  const CAROUSEL_PEEK = (100 - CAROUSEL_SLIDE_WIDTH) / 2;

  // No mobile, o carrossel de "grupos de telas" (--screens, incluindo a
  // variante --duo de 2 telas) passa a andar tela por tela em vez de
  // empilhar as telas do grupo numa janela só (o que gerava um scroll
  // enorme). O --pairs (antes/depois) fica de fora: ali as duas telas
  // precisam aparecer juntas pra comparar. Cada imagem vira sua própria
  // parada do carrossel. Dois formatos de legenda: no grupo "clássico"
  // (--screens de 3) a legenda é uma só pro grupo inteiro e se repete em
  // cada tela flattened; no --duo cada tela já carrega a própria legenda
  // dentro de .stage-carousel__screen-item, então só precisa "desempacotar".
  if (window.matchMedia("(max-width: 900px)").matches) {
    document.querySelectorAll(".stage-carousel--screens[data-carousel]:not(.stage-carousel--pairs)").forEach((carousel) => {
      const track = carousel.querySelector("[data-carousel-track]");
      const dotsWrap = carousel.querySelector(".stage-carousel__dots");
      if (!track) return;
      const groups = Array.from(track.querySelectorAll(":scope > .stage-carousel__slide"));
      const flatSlides = [];
      groups.forEach((group) => {
        const screensWrap = group.querySelector(".stage-carousel__screens");
        if (!screensWrap) {
          // Já é uma tela avulsa (sem grupo) — sobra assim mesmo numa
          // janela de --duo/--screens, ex.: a última tela de um grupo
          // ímpar. Mantém como está.
          flatSlides.push(group);
          return;
        }
        const items = Array.from(screensWrap.children);
        const groupCaption = group.querySelector(":scope > .case__figure-caption");
        items.forEach((item) => {
          const slide = document.createElement("div");
          slide.className = "stage-carousel__slide";
          if (item.classList.contains("stage-carousel__screen-item")) {
            // --duo: o item já tem a própria imagem + legenda, só move os dois.
            Array.from(item.children).forEach((child) => slide.appendChild(child));
          } else {
            // --screens clássico: item é a própria .case__figure, legenda
            // do grupo é clonada em cada tela flattened.
            slide.appendChild(item);
            if (groupCaption) slide.appendChild(groupCaption.cloneNode(true));
          }
          flatSlides.push(slide);
        });
      });
      if (!flatSlides.length) return;
      track.innerHTML = "";
      flatSlides.forEach((slide) => track.appendChild(slide));
      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        flatSlides.forEach((_, i) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "stage-carousel__dot";
          dot.dataset.carouselDot = String(i);
          dot.setAttribute("aria-label", `Ir para a tela ${i + 1}`);
          dotsWrap.appendChild(dot);
        });
      }
    });
  }

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll(".stage-carousel__slide"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    let current = 0;

    const render = () => {
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
      if (track) {
        const offset = CAROUSEL_PEEK - current * (CAROUSEL_SLIDE_WIDTH + CAROUSEL_GAP);
        track.style.transform = `translateX(${offset}%)`;
      }
    };

    const goTo = (next) => {
      current = (next + slides.length) % slides.length;
      render();
    };

    render();

    // Ponte com js/case-lightbox.js: ao abrir uma imagem desse carrossel
    // no modal, ele usa isso pra navegar entre as telas sem fechar a
    // modal, mantendo o carrossel da página em sincronia.
    carousel.goToSlide = goTo;

    prevBtn?.addEventListener("click", () => goTo(current - 1));
    nextBtn?.addEventListener("click", () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

    // Arrastar (touch ou mouse) pra trocar de tela — mesmo padrão do
    // carrossel de mídia da modal do Playground (js/main.js). No mobile é
    // o único jeito de navegar aqui: as setas ficam escondidas e viram
    // esse gesto (ver @media max-width:900px em case-study-split.css).
    const viewport = carousel.querySelector(".stage-carousel__viewport");
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
      viewport?.classList.add("is-dragging");
      if (track) track.style.transition = "none";
      startX = lastX = event.clientX;
      lastTime = performance.now();
      velocity = 0;
      deltaPct = 0;
    };

    const onPointerMove = (event) => {
      if (!dragging || !track) return;
      const now = performance.now();
      const dt = now - lastTime || 16;
      velocity = (event.clientX - lastX) / dt;
      lastX = event.clientX;
      lastTime = now;

      const viewportWidth = carousel.getBoundingClientRect().width || 1;
      deltaPct = ((event.clientX - startX) / viewportWidth) * 100;

      const resting = CAROUSEL_PEEK - current * (CAROUSEL_SLIDE_WIDTH + CAROUSEL_GAP);
      track.style.transform = `translateX(${resting + deltaPct}%)`;
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      viewport?.classList.remove("is-dragging");
      if (track) track.style.transition = "";
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      suppressNextClick = Math.abs(lastX - startX) > 6;

      const step = CAROUSEL_SLIDE_WIDTH + CAROUSEL_GAP;
      const draggedSlides = Math.round(-deltaPct / step);
      let targetIndex = current + draggedSlides;
      if (draggedSlides === 0 && Math.abs(velocity) > 0.4) {
        targetIndex = current + (velocity < 0 ? 1 : -1);
      }
      goTo(targetIndex);
    };

    carousel.addEventListener("pointerdown", (event) => {
      onPointerDown(event);
      if (!dragging) return;
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    });

    // Fase de captura: um arraste não pode ser interpretado como clique
    // (abriria o lightbox da imagem por baixo do dedo/mouse).
    carousel.addEventListener(
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
  });

  // Slides tipo "As três frentes que priorizamos": os botões no painel
  // trocam qual descrição (.flow-text) e qual carrossel (.flow-carousel)
  // aparece. Cada carrossel já foi inicializado acima pelo loop
  // [data-carousel]. Um mesmo case pode ter mais de um slide desse tipo,
  // então percorre todos os .flow-tabs e escopa cada um ao seu slide.
  const flowSlides = new Set(
    Array.from(document.querySelectorAll(".flow-tabs")).map((el) =>
      el.closest(".slide")
    )
  );
  flowSlides.forEach((flowSlide) => {
    if (!flowSlide) return;
    const flowTabs = Array.from(flowSlide.querySelectorAll(".flow-tab"));
    const flowTexts = Array.from(flowSlide.querySelectorAll(".flow-text"));
    const flowCarousels = Array.from(flowSlide.querySelectorAll(".flow-carousel"));

    const setFlow = (name) => {
      flowTabs.forEach((tab) => {
        const on = tab.dataset.flow === name;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-pressed", String(on));
      });
      flowTexts.forEach((el) => {
        el.hidden = el.dataset.flow !== name;
      });
      flowCarousels.forEach((el) => {
        el.hidden = el.dataset.flow !== name;
      });
    };

    flowTabs.forEach((tab) => {
      tab.addEventListener("click", () => setFlow(tab.dataset.flow));
    });
  });
}
