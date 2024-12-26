/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  safelist: [
    'dark',
    'light',
    {
      pattern: /(bg|text|border)-(primary|secondary|accent)/
    }
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        background: 'var(--background)',
      },
      spacing: {
        '64': '16rem',
      },
    },
  },
  plugins: [],
};