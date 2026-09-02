// Trava de acesso da própria página do case. O <script> inline no <head>
// já decide, antes da página pintar, se ela começa bloqueada (olhando o
// mesmo sessionStorage gravado pelo modal da home em js/main.js) --
// aqui só liga a interação dos 6 dígitos pra quem chegou direto pela
// URL, sem passar por aquele modal. Mesmo código e mesma chave dos dois
// lados, senão a pessoa acaba digitando a senha duas vezes.
{
  const UNLOCK_KEY = "caseUnlocked:area-de-operacoes";
  const CODE = "405671";

  if (!sessionStorage.getItem(UNLOCK_KEY)) {
    const digitsWrap = document.getElementById("caseGateDigits");
    const digits = digitsWrap ? Array.from(digitsWrap.querySelectorAll("[data-gate-digit]")) : [];
    const errorEl = document.getElementById("caseGateError");

    if (digitsWrap && digits.length) {
      const clearDigits = () => digits.forEach((input) => (input.value = ""));

      const unlock = () => {
        sessionStorage.setItem(UNLOCK_KEY, "1");
        document.documentElement.classList.remove("case-locked");
      };

      const checkCode = () => {
        const code = digits.map((input) => input.value).join("");
        if (code.length < digits.length) return;
        if (code === CODE) {
          unlock();
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

      window.setTimeout(() => digits[0].focus(), 50);
    }
  }
}
