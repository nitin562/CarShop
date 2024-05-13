/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  plugins: [require('flowbite/plugin')],

  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        // flowbite-svelte
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B'
        }
      },
      fontFamily: {
        AR_One_Sans: ["AR One Sans"],
        Abel: ["Abel"],
        Amaranth: ["Amaranth"],
        Anton: ["Anton"],
        Arsenal: ["Arsenal"],
        Barlow: ["Barlow"],
        Bruno_Ace_SC: ["Bruno Ace SC"],
        Comfortaa: ["Comfortaa"],
        Comforter: ["Comforter"],
        Dosis: ["Dosis"],
        Ephesis: ["Ephesis"],
        Jost: ["Jost"],
        Maven_Pro: ["Maven Pro"],
        Oxygen: ["Oxygen"],
        PT_Sans_Narrow: ["PT Sans Narrow"],
        Palanquin: ["Palanquin"],
        Philosopher: ["Philosopher"],
        Quicksand: ["Quicksand"],
      },
    }
  },
  plugins: []
};