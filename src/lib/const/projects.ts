export const PROJECTS = [
  {
    id: "catstagram",
    name: "Catstagram",
    image: "/catstagram.png",
    description: "A social media app for cats.",
    technologies: ["svelte"],

    ui: {
      containerClass: "flex",
      pictureClass: "",
    },
  },

  {
    id: "blog",
    name: "My personal Blog",
    image: "/blog-preview.png",
    description: "My personal blog",
    technologies: ["rust", "svelte", "tailwind"],

    ui: {
      containerClass: "flex",
      pictureClass: "",
    },
  },

  {
    id: "stopify",
    name: "Stopify ;)",
    image: "/stopify.png",
    description: "Music player",
    technologies: ["astro", "tailwind", 'solid'],
  },

  {
    id: "term-chess",
    name: "TermChess",
    video: "/term-chess.webm",
    description: "TermChess RS",
    technologies: ['rust'],
  },

  {
    id: "cco",
    name: "Code Conjurer",
    video: "/cco.webm",
    description: "Code Conjurer",
    technologies: ['rust'],
  },
];
