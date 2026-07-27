/**
 * Mock data do Playground. Cada item alimenta um card do bento grid.
 *
 * size: controla o span do card no grid desktop (ver SPAN_MAP em PlaygroundSection).
 * mediaType: "image" | "video" — vídeos tocam em loop, mudos, sem controles.
 * prototypeUrl: quando null/undefined, o botão "Visualizar Protótipo" não é renderizado.
 */
export const playgroundItems = [
  {
    id: "exp-01",
    title: "Micro-feedback de like",
    description: "Explorando spring physics em um botão de curtir com burst de partículas.",
    mediaType: "image",
    mediaUrl: "https://picsum.photos/seed/playground-01/900/900",
    tags: ["UI", "Animation", "Figma"],
    prototypeUrl: "https://www.figma.com",
    size: "lg",
  },
  {
    id: "exp-02",
    title: "Cursor magnético",
    description: "Estudo de atração de cursor para CTAs em landing pages experimentais.",
    mediaType: "video",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["Interaction", "Framer"],
    prototypeUrl: "https://www.framer.com",
    size: "wide",
  },
  {
    id: "exp-03",
    title: "Empty state ilustrado",
    description: "Conceito de estado vazio com ilustração leve para reduzir fricção percebida.",
    mediaType: "image",
    mediaUrl: "https://picsum.photos/seed/playground-03/700/900",
    tags: ["UI", "Ilustração"],
    prototypeUrl: null,
    size: "tall",
  },
  {
    id: "exp-04",
    title: "Toggle de tema",
    description: "Transição de tema claro/escuro com morph de ícone sol/lua.",
    mediaType: "image",
    mediaUrl: "https://picsum.photos/seed/playground-04/700/700",
    tags: ["UI", "Animation"],
    prototypeUrl: "https://www.figma.com",
    size: "sm",
  },
  {
    id: "exp-05",
    title: "Cards em stack",
    description: "Navegação por swipe entre cards empilhados, inspirada em apps de match.",
    mediaType: "image",
    mediaUrl: "https://picsum.photos/seed/playground-05/700/700",
    tags: ["Mobile", "Gestures"],
    prototypeUrl: "https://maze.co",
    size: "sm",
  },
  {
    id: "exp-06",
    title: "Gráfico animado",
    description: "Entrada progressiva de barras em um dashboard fictício de analytics.",
    mediaType: "image",
    mediaUrl: "https://picsum.photos/seed/playground-06/900/700",
    tags: ["Dataviz", "Animation"],
    prototypeUrl: null,
    size: "wide",
  },
  {
    id: "exp-07",
    title: "Onboarding em etapas",
    description: "Progressão visual de passos com transição de página tipo slide.",
    mediaType: "image",
    mediaUrl: "https://picsum.photos/seed/playground-07/700/900",
    tags: ["UI", "Onboarding"],
    prototypeUrl: "https://www.useberry.com",
    size: "tall",
  },
  {
    id: "exp-08",
    title: "Botão com loading morph",
    description: "Botão de envio que se transforma em spinner e depois em check de sucesso.",
    mediaType: "image",
    mediaUrl: "https://picsum.photos/seed/playground-08/700/700",
    tags: ["UI", "Micro-interação"],
    prototypeUrl: "https://www.figma.com",
    size: "sm",
  },
];
