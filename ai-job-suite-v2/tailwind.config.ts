import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#7B6FFF',
        'brand-purple-light': '#A892FF',
        'brand-purple-dark': '#5A4FCC',
        'bg-deep': '#06070F',
        'bg-surface': '#0C0E1A',
        'bg-surface2': '#121528',
        'bg-surface3': '#181B35',
        'text-primary': '#ECEBF5',
        'text-muted': '#7E7D9A',
        'text-muted2': '#4A4A60',
        'success': '#4EE8B5',
        'error': '#FF6B6B',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'gradient-y': 'gradient-y 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-y': {
          '0%, 100%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '50% 100%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(123, 111, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(123, 111, 255, 0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(123,111,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123,111,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};

export default config;
