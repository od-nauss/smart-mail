import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/contexts/**/*.{ts,tsx}',
    './src/engine/**/*.{ts,tsx}',
    './src/core/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2f1',
          100: '#cce5e4',
          200: '#99cbca',
          300: '#66b1af',
          400: '#339794',
          500: '#016564',
          600: '#015150',
          700: '#014040',
          800: '#013030',
          900: '#012020'
        },
        gold: {
          50: '#faf7f0',
          100: '#f5efdf',
          200: '#ebe0c0',
          300: '#e0d0a0',
          400: '#d0b284',
          500: '#c0a060',
          600: '#b89960',
          700: '#9a7d4d',
          800: '#7a6240',
          900: '#5a4830'
        },
        sand: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#ebe7e0',
          300: '#ddd7cc',
          400: '#c7bdb0',
          500: '#b0a494'
        }
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'sans-serif'],
        sans: ['var(--font-cairo)', 'sans-serif']
      },
      boxShadow: {
        soft: '0 8px 30px rgba(1,101,100,0.08)',
        elevated: '0 20px 40px rgba(15,23,42,0.12)'
      },
      animation: {
        'fade-in': 'fadeIn .4s ease-out',
        'float-soft': 'floatSoft 4s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        floatSoft: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
