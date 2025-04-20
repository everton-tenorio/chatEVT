/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Escaneia arquivos em src/ para classes Tailwind
  ],
  darkMode: 'class', // Ativa modo noturno com classe 'dark'
  theme: {
    extend: {},
  },
  plugins: [],
};
