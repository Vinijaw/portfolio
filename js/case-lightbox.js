// Lightbox de imagens do case (case-area-de-operacoes.html): qualquer
// imagem dentro do #deck abre em um modal expandido ao clicar; clicar na
// imagem do modal alterna um zoom pra ver detalhe. Se a imagem clicada
// faz parte de um carrossel (.stage-carousel), as setas do modal navegam
// entre as telas desse carrossel sem fechar a modal — e mantêm o
// carrossel da página sincronizado (via carousel.goToSlide, exposto por
// js/case-split.js), pra continuar de onde parou ao fechar.
// Roda depois de js/case-split.js, que checa se o lightbox está aberto
// pra pausar a troca de slides enquanto ele estiver em uso.
{
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  const deck = document.getElementById("deck");

  if (lightbox && lightboxImg && deck) {
    // Posição do zoom (% da imagem) sob o cursor — atualizada no clique
    // que liga o zoom e, enquanto ele estiver ligado, a cada movimento do
    // mouse, pra dar a sensação de "passear" pela imagem ampliada em vez
    // dela ficar travada no centro.
    const setOriginFromEvent = (event) => {
      const rect = lightboxImg.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      lightboxImg.style.transformOrigin = `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`;
    };

    // O <img> tem object-fit: contain, então o elemento costuma ser maior
    // que a imagem visível de fato (letterbox) — sem essa checagem, um
    // clique na área "vazia" ao redor de uma imagem bem larga ou bem alta
    // também ligava o zoom. Calcula o retângulo realmente desenhado e só
    // deixa passar cliques dentro dele.
    const isClickOnRenderedImage = (event) => {
      const rect = lightboxImg.getBoundingClientRect();
      const naturalRatio = lightboxImg.naturalWidth / lightboxImg.naturalHeight;
      const boxRatio = rect.width / rect.height;
      let renderedWidth = rect.width;
      let renderedHeight = rect.height;
      if (naturalRatio > boxRatio) {
        renderedHeight = rect.width / naturalRatio;
      } else {
        renderedWidth = rect.height * naturalRatio;
      }
      const offsetX = (rect.width - renderedWidth) / 2;
      const offsetY = (rect.height - renderedHeight) / 2;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return x >= offsetX && x <= offsetX + renderedWidth && y >= offsetY && y <= offsetY + renderedHeight;
    };

    // Estado do carrossel atual aberto na modal (null quando a imagem
    // aberta não pertence a nenhum carrossel).
    let carouselEl = null;
    let carouselImages = [];
    let carouselIndex = 0;

    const showImage = (img) => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "";
      lightboxImg.classList.remove("is-zoomed");
      lightboxImg.style.transformOrigin = "50% 50%";
    };

    const open = (img) => {
      carouselEl = img.closest("[data-carousel]");
      if (carouselEl) {
        carouselImages = Array.from(carouselEl.querySelectorAll(".stage-carousel__slide img"));
        carouselIndex = carouselImages.indexOf(img);
      } else {
        carouselImages = [];
        carouselIndex = 0;
      }
      lightbox.classList.toggle("has-carousel", carouselImages.length > 1);
      showImage(img);
      lightbox.classList.add("is-open");
    };

    const goToCarouselImage = (nextIndex) => {
      if (!carouselImages.length) return;
      carouselIndex = (nextIndex + carouselImages.length) % carouselImages.length;
      showImage(carouselImages[carouselIndex]);
      carouselEl?.goToSlide?.(carouselIndex);
    };

    const close = () => {
      lightbox.classList.remove("is-open");
      lightboxImg.classList.remove("is-zoomed");
    };

    deck.querySelectorAll("img").forEach((img) => {
      img.classList.add("is-zoomable");
      img.addEventListener("click", () => open(img));
    });

    lightboxImg.addEventListener("click", (event) => {
      if (!isClickOnRenderedImage(event)) return;
      const zooming = !lightboxImg.classList.contains("is-zoomed");
      if (zooming) setOriginFromEvent(event);
      lightboxImg.classList.toggle("is-zoomed", zooming);
    });

    lightboxImg.addEventListener("mousemove", (event) => {
      if (lightboxImg.classList.contains("is-zoomed")) setOriginFromEvent(event);
    });

    prevBtn?.addEventListener("click", () => goToCarouselImage(carouselIndex - 1));
    nextBtn?.addEventListener("click", () => goToCarouselImage(carouselIndex + 1));

    closeBtn?.addEventListener("click", close);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });

    window.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      else if (event.key === "ArrowLeft") goToCarouselImage(carouselIndex - 1);
      else if (event.key === "ArrowRight") goToCarouselImage(carouselIndex + 1);
    });
  }
}
