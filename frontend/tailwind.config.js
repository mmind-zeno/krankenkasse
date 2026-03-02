/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#003087',
        secondary: '#1A4DAD',
        accent: '#2563EB',
        surface: '#F0F7FF',
        'surface-border': '#E2E8F0',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #003087 0%, #1A4DAD 50%, #2563EB 100%)',
      },
    },
  },
  plugins: [],
};
