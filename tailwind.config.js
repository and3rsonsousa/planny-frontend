var colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.js", "./components/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        brand: "Ubuntu",
      },
      colors: {
        brand: colors.violet,
        accent: colors.red,

        neutral: {
          1: colors.blueGray[100],
          2: colors.blueGray[200],
          3: colors.blueGray[300],
          4: colors.blueGray[500],
          5: colors.blueGray[700],
        },

        idea: colors.yellow,
        do: colors.red,
        doing: colors.purple,
        review: colors.blue,
        done: colors.teal,
        accomplished: colors.lime,

        post: colors.purple,
        stories: colors.rose,
        reels: colors.orange,
        meeting: colors.yellow,
        copy: colors.emerald,
        video: colors.sky,
        shooting: colors.blue,
        press: colors.indigo,
      },
    },
  },
  variants: {
    extend: {
      transform: ["group-focus"],
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
