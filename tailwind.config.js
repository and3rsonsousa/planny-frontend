var colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.js", "./components/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: colors.violet,
        accent: colors.red,
        idea: colors.yellow,
        do: colors.red,
        doing: colors.purple,
        review: colors.blue,
        done: colors.teal,
        accomplished: colors.lime,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
