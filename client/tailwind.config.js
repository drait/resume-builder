/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A2342',
      },
      fontFamily: {
        resume: ['Calibri', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
