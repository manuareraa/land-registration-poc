/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    colors: {
      "custom-primary": "#356949",
      "custom-secondary": "#e9e9e9",
      white: "#ffffff",
      black: "#000000",
    },
  },
  plugins: [require("daisyui")],
};
