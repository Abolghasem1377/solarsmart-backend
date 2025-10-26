/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a", // سبز طبیعت
        sky: "#38bdf8", // آبی آسمان
        sun: "#facc15", // زرد خورشید
      },
    },
  },
  plugins: [],
};
