module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        crusta: '#ff7e2a',
        parchment: '#f2ead2',
        abbey: '#464a4d',
        shark: '#252527'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
