/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            teal: "#00A89D",
            cream: "#F4E0B8",
            emerald: { 500: "#10B981", 600: "#059669" },
          },
        },
        fontFamily: {
          sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
          heading: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"], // Cal Sans later
        },
      },
    },
    plugins: [],
  };