/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
export default {
  content: ['./views/**/*.pug'],
  theme: {
    colors: {
      ...colors,
      "black": '#000000',
      "white": '#FFFFFF',
      "Rosewood": '#640D14',
      "Falured": '#800E13',
      "Auburn": '#AD2831',
    },
    extend: {},
  },
  plugins: [],
}