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
        sans: ['var(--font-noto-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
