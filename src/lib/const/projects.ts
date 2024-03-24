export const PROJECTS = [
  {
    id: "catstagram",
    name: "Catstagram",
    image: "/catstagram.webp",
    repository: "https://github.com/JekTheCoder/catstagram",
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
        url: "https://github.com/JekTheCoder/actix-blog",
      },
      {
        label: "Frontend",
        url: "https://github.com/JekTheCoder/blog-clients",
      },
    ],
  },

  {
    id: "stopify",
    name: "Stopify ;)",
    image: "/stopify.webp",
    technologies: ["astro", "tailwind", "solid"],
    repository: "https://github.com/JekTheCoder/astro-spotify-demo",
  },

  {
    id: "term-chess",
    name: "TermChess",
    video: "/term-chess.webm",
    technologies: ["rust"],
    repository: "https://github.com/JekTheCoder/term-chess-rs",
  },

  {
    id: "cco",
    name: "Code Conjurer",
    video: "/cco.webm",
    technologies: ["rust"],
    repository: "https://github.com/JekTheCoder/code-conjurer",
  },
];

export type ProjectInfo = typeof PROJECTS[number];
