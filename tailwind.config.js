var colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.js", "./components/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: colors.violet,
        orange: colors.orange,
        rose: colors.rose,
        accent: colors.orange,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
