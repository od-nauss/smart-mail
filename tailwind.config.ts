import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        naif: {
          primary: '#016564',
          dark: '#014d4c',
          light: '#028a88',
          gold: '#d0b284',
          goldLight: '#e5d4b3',
          goldDark: '#b89a5e',
          cream: '#faf8f4',
          gray: '#6b7280'
        }
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'Cairo', 'sans-serif']
      },
      backgroundImage: {
        'gradient-naif': 'linear-gradient(135deg, #016564 0%, #028a88 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d0b284 0%, #e5d4b3 100%)'
      }
    }
  },
  plugins: []
};

export default config;
