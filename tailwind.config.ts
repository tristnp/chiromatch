import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211d",
        meadow: "#3d6b52",
        "meadow-dark": "#244233",
        clay: "#b65f45",
        mist: "#eef6f1",
        sun: "#f5c76d"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 33, 29, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
