export const PROJECTS = [
  {
    id: "catstagram",
    name: "Catstagram",
    image: "/catstagram.webp",
    repository: "https://github.com/ocxide/catstagram",
    technologies: ["svelte"],
  },

  {
    id: "blog",
    name: "My personal Blog",
    image: "/blog-preview.webp",
    technologies: ["rust", "svelte", "tailwind"],
    website: "https://www.jeshuahinostroza.com/",
    repositories: [
      {
        label: "Server",
        url: "https://github.com/ocxide/actix-blog",
      },
      {
        label: "Frontend",
        url: "https://github.com/ocxide/blog-clients",
      },
    ],
  },

  {
    id: "stopify",
    name: "Stopify ;)",
    image: "/stopify.webp",
    technologies: ["astro", "tailwind", "solid"],
    repository: "https://github.com/ocxide/astro-spotify-demo",
  },

  {
    id: "term-chess",
    name: "TermChess",
    video: "/term-chess.webm",
    technologies: ["rust"],
    repository: "https://github.com/ocxide/term-chess-rs",
  },

  {
    id: "cco",
    name: "Code Conjurer",
    video: "/cco.webm",
    technologies: ["rust"],
    repository: "https://github.com/ocxide/code-conjurer",
  },
];

export type ProjectInfo = typeof PROJECTS[number];
