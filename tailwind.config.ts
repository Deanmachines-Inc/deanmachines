import type { Config } from 'tailwindcss';

import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';
import scrollbar from 'tailwind-scrollbar';
import headlessui from '@headlessui/tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './app/styles/**/*.css'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      screens: {
        sm: '640px',
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        background: 'var(--background)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [forms, typography, aspectRatio, scrollbar, headlessui, animate],
} satisfies Config;
