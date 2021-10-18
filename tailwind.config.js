var colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.js", "./components/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        brand: "museo-sans-rounded",
      },
      colors: {
        brand: colors.violet,
        accent: colors.red,

        idea: colors.yellow,
        do: colors.red,
        doing: colors.purple,
        review: colors.blue,
        done: colors.teal,
        accomplished: colors.lime,

        post: colors.violet,
        stories: colors.indigo,
        reels: colors.pink,
        meeting: colors.yellow,
        copy: colors.emerald,
        video: colors.red,
        shooting: colors.rose,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
