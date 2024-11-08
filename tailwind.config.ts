import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

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
        rooms: "url('../public/bg/room_background.jpg')",
        main: "url('../public/bg/main_background.jpg')",
      },
      fontFamily: {
        sb: ["SB"],
      },
      fontSize: {
        responsive: "clamp(1rem, 2dvh + 1rem, 36px)",
        "responsive-small": "clamp(1rem, 2dvh, 36px)",
      },
    },
    colors: {
      ...colors,
      "button-selected": "#95C1A7",
      "match-button": "#FFB380",
      "game-bar": "#8AC186",
      "game-icon": "#62A38C",
      "game-button": "#D5F5FF",
      "yellow-button": "#FFA800",
      game: "#FCE4C0",
    },
  },
  plugins: [],
};
export default config;
