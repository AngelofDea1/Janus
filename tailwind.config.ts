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
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        background: 'rgb(var(--theme-bg))',
        foreground: 'rgb(var(--theme-foreground))',
        panel: 'rgb(var(--theme-panel))',
        accent: 'rgb(var(--theme-accent))',
        accentHover: 'rgb(var(--theme-accent-hover))',
        borderLine: 'rgb(var(--theme-border))',
      },
      boxShadow: {
        'premium': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 12px 40px rgba(0, 0, 0, 0.12)',
        'premium-dark': '0 8px 30px rgba(0, 0, 0, 0.4)',
        'premium-dark-hover': '0 12px 40px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
};

export default config;
