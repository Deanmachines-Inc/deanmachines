/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/routes/**/*.{ts,tsx}"], // Make sure this path is correct!
  theme: { /* ... your theme ... */ },
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}