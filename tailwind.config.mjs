/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background-color)",
        primary: "var(--primary-color)",

        bold: "var(--bold-color)",
        soft: "var(--soft-color)",
      },
    },
  },
  plugins: [],
};
