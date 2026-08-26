// Lightbox de imagens do case (case-area-de-operacoes.html): qualquer
// imagem dentro do #deck abre em um modal expandido ao clicar; clicar na
// imagem do modal alterna um zoom pra ver detalhe. Roda depois de
// js/case-split.js, que checa se o lightbox está aberto pra pausar a
// troca de slides enquanto ele estiver em uso.
{
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
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

    const open = (img) => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "";
      lightboxImg.classList.remove("is-zoomed");
      lightboxImg.style.transformOrigin = "50% 50%";
      lightbox.classList.add("is-open");
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
      const zooming = !lightboxImg.classList.contains("is-zoomed");
      if (zooming) setOriginFromEvent(event);
      lightboxImg.classList.toggle("is-zoomed", zooming);
    });

    lightboxImg.addEventListener("mousemove", (event) => {
      if (lightboxImg.classList.contains("is-zoomed")) setOriginFromEvent(event);
    });

    closeBtn?.addEventListener("click", close);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) close();
    });
  }
}
