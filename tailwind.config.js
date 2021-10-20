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

        post: colors.purple,
        stories: colors.rose,
        reels: colors.orange,
        meeting: colors.yellow,
        copy: colors.emerald,
        video: colors.sky,
        shooting: colors.indigo,
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
