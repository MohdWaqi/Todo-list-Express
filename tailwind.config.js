/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      fontFamily:{
        style_script: ["Style Script"],
      },
      
      colors:{
        themeGreen: "#049311",
        headingGreen: "#00800C"
      }
    },
  },
  plugins: [],
}
