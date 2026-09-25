import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#FFF0F3',
          100: '#FFDCE3',
          200: '#FFB8C7',
          300: '#FF8FA8',
          400: '#FF5C7A',
          500: '#E84361',
          600: '#C44569',
          700: '#A03855',
          800: '#7D2E42',
          900: '#5A252F',
          950: '#301018',
        },
        gold: {
          50: '#FFFEF0',
          100: '#FFFBD4',
          200: '#FFF4A8',
          300: '#FFED7A',
          400: '#F7E34C',
          500: '#F7C548',
          600: '#D4A03A',
          700: '#A87E2E',
          800: '#7D5D24',
          900: '#634A1E',
          950: '#36260F',
        },
        cream: {
          50: '#FFFDF8',
          100: '#FFF8F0',
          200: '#FFF0E0',
          300: '#FFE4C8',
          400: '#FFD4A8',
          500: '#FFC280',
          600: '#E8A868',
          700: '#C48A50',
          800: '#9E6E3E',
          900: '#7D5732',
          950: '#422A12',
        },
        charcoal: {
          50: '#F0F0F0',
          100: '#E0E0E0',
          200: '#C4C4C4',
          300: '#A0A0A0',
          400: '#7D7D7D',
          500: '#5A5A5A',
          600: '#454545',
          700: '#383838',
          800: '#2C2C2C',
          900: '#242424',
          950: '#141414',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25', letterSpacing: '0' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0' }],
        'heading-md': ['1.25rem', { lineHeight: '1.35', letterSpacing: '0' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'elegant': '0 10px 40px -10px rgba(196, 69, 105, 0.15), 0 4px 20px -4px rgba(196, 69, 105, 0.1)',
        'gold': '0 10px 40px -10px rgba(247, 197, 72, 0.3), 0 4px 20px -4px rgba(247, 197, 72, 0.15)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 600ms ease-out forwards',
        'fade-in-up': 'fadeInUp 600ms ease-out forwards',
        'fade-in-down': 'fadeInDown 600ms ease-out forwards',
        'slide-up': 'slideUp 600ms ease-out forwards',
        'scale-in': 'scaleIn 400ms ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};

export default config;