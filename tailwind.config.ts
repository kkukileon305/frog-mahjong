import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        game: `url('../public/bg/game_background.jpg')`,
        rooms: "url('../public/bg/room_background.jpg')",
        main: "url('../public/bg/main_background.jpg')",
      },
    },
  },
  plugins: [],
};
export default config;
