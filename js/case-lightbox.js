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
    const open = (img) => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "";
      lightboxImg.classList.remove("is-zoomed");
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

    lightboxImg.addEventListener("click", () => {
      lightboxImg.classList.toggle("is-zoomed");
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
