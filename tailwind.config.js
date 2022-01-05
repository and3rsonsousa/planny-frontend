var colors = require("tailwindcss/colors");

module.exports = {
	mode: "jit",
	content: ["./pages/**/*.js", "./components/**/*.js"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				brand: colors.violet,
				accent: colors.red,

				neutral: {
					1: colors.slate[100],
					2: colors.slate[200],
					3: colors.slate[300],
					4: colors.slate[500],
					5: colors.slate[700],
					6: colors.slate[900],
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
				task: colors.lime,
				tiktok: colors.pink,
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
