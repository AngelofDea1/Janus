import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'indigo': {
          50: 'rgba(204, 255, 0, 0.05)',
          100: 'rgba(204, 255, 0, 0.1)',
          200: 'rgba(204, 255, 0, 0.2)',
          300: 'rgba(204, 255, 0, 0.3)',
          400: '#ccff00',
          500: '#ccff00',
          600: '#ccff00',
          700: '#b2df00',
          800: '#99bf00',
          900: '#80a000',
        },
        'violet': {
          50: 'rgba(204, 255, 0, 0.05)',
          100: 'rgba(204, 255, 0, 0.1)',
          200: 'rgba(204, 255, 0, 0.2)',
          300: 'rgba(204, 255, 0, 0.3)',
          400: '#ccff00',
          500: '#ccff00',
          600: '#ccff00',
          700: '#b2df00',
          800: '#99bf00',
          900: '#80a000',
        },
        'rose': {
          50: 'rgba(217, 70, 239, 0.05)',
          100: 'rgba(217, 70, 239, 0.1)',
          200: 'rgba(217, 70, 239, 0.2)',
          300: 'rgba(217, 70, 239, 0.3)',
          400: '#d946ef',
          500: '#d946ef',
          600: '#d946ef',
          700: '#c026d3',
          800: '#a21caf',
          900: '#86198f',
        },
      },
      animation: {
        'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
