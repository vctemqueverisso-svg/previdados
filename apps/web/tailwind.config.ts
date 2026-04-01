import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        sand: "#f8f5ef",
        clay: "#e7d8c9",
        gold: "#c88b3a",
        moss: "#40513b"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(20,33,61,0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;

