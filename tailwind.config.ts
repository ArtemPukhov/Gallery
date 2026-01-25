import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0b0b0c",
          800: "#121316",
          700: "#1a1c22",
          600: "#252833"
        },
        parchment: {
          100: "#f2efe8",
          200: "#e9e3d6"
        },
        accent: {
          400: "#c8a46b",
          500: "#b8945a"
        }
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
