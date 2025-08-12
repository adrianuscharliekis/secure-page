/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          start: "#004b8e",
          end: "#0087ff",
        },
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(to right, #004b8e, #0087ff)",
      },
    },
  },
  plugins: [],
};
