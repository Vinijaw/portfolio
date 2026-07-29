---
name: case-study-star
description: Analisa uma pasta de materiais brutos de pesquisa (textos, docs, imagens, apresentações) e sintetiza um case de portfólio usando a metodologia STAR (Situação, Tarefa, Ação, Resultado). Use quando o usuário apontar uma pasta e pedir para transformar o conteúdo dela em case de estudo, ou mencionar "criar case", "sintetizar case", "case STAR".
user-invocable: true
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - TodoWrite
---

# Case Study STAR

Você atua como especialista em Product Design / UX Research. O objetivo é
pegar uma pasta de material bruto (anotações, transcrições, prints,
apresentações) e transformar isso num case de portfólio coerente — sem
inventar informação que não está nas fontes.

## Quando usar

O usuário vai indicar um caminho de pasta (geralmente dentro de `Temp/`,
ver [[case_study_pages_pattern]]) e pedir para sintetizar um case. Confirme
o caminho antes de começar se não estiver claro.

## Passo 1 — Levantamento

Use `Glob` na pasta indicada (recursivo) para mapear tudo que existe:
documentos de texto, imagens, PDFs, apresentações. Categorize antes de ler
tudo — você não precisa usar 100% do material, só o que sustenta a
história.

## Passo 2 — Leitura seletiva

- Leia por completo os documentos de texto/transcrições/anotações.
- Abra as imagens com `Read` para entender o que cada uma mostra (telas,
  fluxos, resultados de teste, etc.) — anote mentalmente para o Passo 4.
- Apresentações (`.pptx`) e outros formatos que o `Read` não abre direito
  entram na lista de lacunas do Passo 5 (peça export em PDF/imagens se for
  crítico para o case).

## Passo 3 — Anonimização (obrigatório)

Antes de escrever qualquer trecho do case, troque nomes reais de pessoas
mencionadas no material (usuários entrevistados, colegas, stakeholders,
clientes) por nomes fictícios. Nunca publique nome real de terceiro. Ver
[[anonymize_case_study_names]] — essa regra vale mesmo que o material bruto
use nomes reais o tempo todo.

## Passo 4 — Síntese em STAR

Estruture o texto em quatro blocos:

- **S — Situação**: contexto inicial, dores do negócio/usuários, por que o
  projeto começou.
- **T — Tarefa**: papel do usuário no projeto, objetivos principais,
  desafios a superar.
- **A — Ação**: processo — discovery, pesquisas, testes, iterações,
  construção da solução.
- **R — Resultado**: métricas, aprendizados, entregáveis, consolidação.

Priorize clareza narrativa sobre completude. Só entra o que ajuda a contar
a história do problema → decisão → impacto.

**Nunca invente métrica, citação ou dado que não esteja no material.** Se
um número ou resultado não aparece nas fontes, isso vira uma pergunta no
Passo 6 — não um placeholder que pareça dado real.

## Passo 5 — Marcações de imagem

No corpo do texto, no ponto exato onde cada imagem relevante deveria
entrar, insira uma marcação como:

```
[Inserir Imagem: user flow do checkout — mostra onde os usuários abandonavam antes da mudança]
```

Sempre justifique em poucas palavras por que aquela imagem importa naquele
ponto da história, não só o que ela é.

## Passo 6 — Lacunas

Feche a entrega com uma lista "Perguntas em aberto" para qualquer coisa que
falte para o case ficar consistente: métricas ausentes, contexto de
negócio, justificativa de alguma decisão de design. Não dê o case como
finalizado sem essa lista — mesmo que ela venha vazia, diga explicitamente
que não identificou lacunas.

## Entrega

O resultado é um documento (Markdown) com S/T/A/R + marcações de imagem +
lista de lacunas. Isso é a matéria-prima do case — não publique como
página HTML automaticamente. Se o usuário pedir para virar página do site
depois, aí sim siga [[case_study_pages_pattern]] (HTML próprio, `css/case-study.css`,
assets em `Cases selecionados/<slug>`).
