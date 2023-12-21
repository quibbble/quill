module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@quibbble/boardgame/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    "font-['coquette']",
    "max-w-xl",
    {
      pattern: /bg-(red|rose|green|lime|blue|sky|indigo|yellow|orange|pink|purple|teal|zinc|amber)-(100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /text-(red|rose|green|lime|blue|sky|indigo|yellow|orange|pink|purple|teal|zinc|amber)-(100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /border-(red|rose|green|lime|blue|sky|indigo|yellow|orange|pink|purple|teal|zinc|amber)-(100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /fill-(red|rose|green|lime|blue|sky|indigo|yellow|orange|pink|purple|teal|zinc|amber)-(100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /border-(t|b|l|r)-(red|rose|green|lime|blue|sky|indigo|yellow|orange|pink|purple|teal|zinc|amber)-(100|200|300|400|500|600|700|800|900)/,
    },
    
  ]
}
