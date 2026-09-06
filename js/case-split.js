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
    const navHomeBtn = document.getElementById("slideNavHome");
    const navCounter = document.getElementById("slideNavCounter");
    const lightbox = document.getElementById("lightbox");
    const skipToInterfacesBtn = document.getElementById("skipToInterfacesBtn");

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

    const render = () => {
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      if (navUpBtn) navUpBtn.disabled = index === 0;
      if (navDownBtn) navDownBtn.disabled = index === lastIndex;
      if (navHomeBtn) navHomeBtn.disabled = index === 0;
      if (navCounter) {
        const pad = (n) => String(n).padStart(2, "0");
        navCounter.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
      }
      if (fgImage) {
        fgImage.classList.toggle("is-shown", fgSlideIds.has(slides[index].id));
      }
      // z-index:auto no .slide não cria stacking context, então o botão
      // (com z-index próprio, pra ficar acima do conteúdo do slide-0)
      // pintaria por cima de qualquer slide, não só do slide-0, se
      // dependesse só de CSS — por isso o show/hide é explícito aqui.
      if (skipToInterfacesBtn) {
        skipToInterfacesBtn.style.display = index === 0 ? "" : "none";
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

    navHomeBtn?.addEventListener("click", () => goTo(0));
    navUpBtn?.addEventListener("click", () => goTo(index - 1));
    navDownBtn?.addEventListener("click", () => goTo(index + 1));

    // Botão "Pular para as interfaces" (só existe no slide-0): vai direto
    // pra tela de Reprocessar e já abre a modal com o carrossel daquela
    // etapa, sem precisar clicar de novo na imagem. O atraso é só pra
    // deixar a transição de slide terminar antes da modal abrir por cima.
    skipToInterfacesBtn?.addEventListener("click", () => {
      const targetIndex = slides.findIndex((slide) => slide.id === "slide-9");
      if (targetIndex < 0) return;
      goTo(targetIndex);
      window.setTimeout(() => {
        slides[targetIndex].querySelector(".stage-carousel__slide.is-active img, .case__figure img")?.click();
      }, 700);
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
  });
}
