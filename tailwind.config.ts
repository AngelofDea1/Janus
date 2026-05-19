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
          50: 'rgba(var(--theme-accent), 0.05)',
          100: 'rgba(var(--theme-accent), 0.1)',
          200: 'rgba(var(--theme-accent), 0.2)',
          300: 'rgba(var(--theme-accent), 0.3)',
          400: 'rgba(var(--theme-accent), 0.8)',
          500: 'rgb(var(--theme-accent))',
          600: 'rgb(var(--theme-accent))',
          700: 'rgb(var(--theme-accent))',
          800: 'rgb(var(--theme-accent))',
          900: 'rgb(var(--theme-accent))',
        },
        'violet': {
          50: 'rgba(var(--theme-accent), 0.05)',
          100: 'rgba(var(--theme-accent), 0.1)',
          200: 'rgba(var(--theme-accent), 0.2)',
          300: 'rgba(var(--theme-accent), 0.3)',
          400: 'rgba(var(--theme-accent), 0.8)',
          500: 'rgb(var(--theme-accent))',
          600: 'rgb(var(--theme-accent))',
          700: 'rgb(var(--theme-accent))',
          800: 'rgb(var(--theme-accent))',
          900: 'rgb(var(--theme-accent))',
        },
        'rose': {
          50: 'rgba(var(--theme-glow), 0.05)',
          100: 'rgba(var(--theme-glow), 0.1)',
          200: 'rgba(var(--theme-glow), 0.2)',
          300: 'rgba(var(--theme-glow), 0.3)',
          400: 'rgba(var(--theme-glow), 0.8)',
          500: 'rgb(var(--theme-glow))',
          600: 'rgb(var(--theme-glow))',
          700: 'rgb(var(--theme-glow))',
          800: 'rgb(var(--theme-glow))',
          900: 'rgb(var(--theme-glow))',
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
