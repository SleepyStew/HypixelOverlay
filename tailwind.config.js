/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/components/**/*.{js,vue,ts}",
    "./src/renderer/layouts/**/*.vue",
    "./src/renderer/pages/**/*.vue",
    "./src/renderer/plugins/**/*.{js,ts}",
    "./src/renderer/nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
