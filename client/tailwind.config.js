/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        siteblack: "#131519",
        siteDimBlack: "#191d23",
        siteRed: "#c60d10",
        siteWhite: "#9eacc7",
      },
      backgroundImage: {
        astral: "url('/src/assets/background/astral.jpg')",
        saiman: "url('/src/assets/background/saiman.jpg')",
        eoaalien: "url('/src/assets/background/eoaalien.jpg')",
        panight: "url('/src/assets/background/panight.jpg')",
        heroImg: "url('/src/assets/background/hero-img.jpg')",
        landing: "url('/src/assets/background/landing.jpg')",
        home: "url('/src/assets/background/home.png')",
        chat: "url('https://media.istockphoto.com/id/165102644/photo/old-paper.jpg?s=612x612&w=0&k=20&c=W9yT9C4BqkrknYgR0nqK5L790p-9bj762fpGq3mmMo0=')",
      },
      fontFamily: {
        rajdhani: ["Rajdhani", "sans-serif"],
      },
    },
  },
  plugins: [],
};
