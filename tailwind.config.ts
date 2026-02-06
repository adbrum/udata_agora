import type { Config } from 'tailwindcss';
import { AgoraTailwindConfig } from '@ama-pt/agora-design-system';

const config: Config = {
  presets: [AgoraTailwindConfig as Config],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@ama-pt/agora-design-system/artifacts/dist/**/*.{js,mjs}',
  ],
  safelist: [
    '!hidden',
    '!block',
    '!flex',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)', 'sans-serif'],
      },
      colors: {
        // Explicitly overriding to match the visual reference (dados.gov style)
        primary: {
          900: '#002855', // Deep Navy (Header/Footer/Hero)
          800: '#003366',
          700: '#004785',
          600: '#005CAB', // Action buttons (Blue)
          500: '#0072C6',
          400: '#2B8BE3',
          300: '#5CA3ED',
          200: '#92C1F5',
          100: '#CDE4FC', // Light accents
          50: '#E8F3FF',
        },
        neutral: {
          900: '#1A1A1A', // Main text (almost black)
          800: '#2D2D2D',
          700: '#404040',
          600: '#595959', // Secondary text
          500: '#737373',
          400: '#8C8C8C',
          300: '#A6A6A6',
          200: '#BFBFBF',
          100: '#D9D9D9',
          50: '#FAFAFA',
        },
      },
    },
  },
  plugins: [],
};
export default config;
