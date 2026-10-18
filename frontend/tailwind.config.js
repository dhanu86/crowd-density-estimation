/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#090d16', // Primary canvas
          800: '#0f172a', // Card surface
          700: '#1e293b', // Border / Hover surface
          600: '#334155', // Muted border
        },
        cyan: {
          400: '#38bdf8',
          500: '#06b6d4',
          600: '#0891b2',
        }
      },
    },
  },
  plugins: [],
}
