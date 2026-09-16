# Portfolio — notas de projeto

## Verificação visual (Playwright)

Existe um Playwright (Chromium) já instalado e funcional em
`C:\Users\on_jv\AppData\Local\Temp\claude\pw-check\node_modules` (não precisa
instalar de novo). Use isso pra bugs de CSS/layout genuinamente difíceis —
especificidade, centralização, cantos arredondados que não aparecem — em vez
de ler o CSS e imaginar o resultado.

Como usar: escreva um script `.js` dentro daquela pasta (`require("playwright")`
funciona direto, o `node_modules` já está lá) e rode com `node script.js`.
Pra essa página estática, `page.goto("file:///" + caminho/absoluto/pro/arquivo.html")`
funciona sem precisar de servidor local. Use `page.evaluate(() => getComputedStyle(el)...)`
pra ler o estilo computado de verdade, e `page.screenshot(...)` pra conferir
visualmente, em vez de depender só de prints que o usuário manda.

Não é pra ajuste trivial de uma linha (aí é só editar e pedir uma conferida) —
é pra quando a mesma correção "parece certa" no CSS mas o bug persiste depois
de aplicada.
