// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        text: 'var(--text)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      },
      backgroundImage: {
        themed: 'var(--bg-image)',
      },
    },
  },
  plugins: [],
};
