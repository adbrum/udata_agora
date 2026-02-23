import type { Config } from 'tailwindcss';
import { AgoraTailwindConfig } from '@ama-pt/agora-design-system';

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@ama-pt/agora-design-system/artifacts/dist/**/*.{js,mjs}',
  ],
  theme: {
    ...AgoraTailwindConfig.theme,
    extend: {
      colors: {
        'accent-light': '#F7F7FF',
      },
      fontFamily: {
        sans: ['var(--font-noto-sans)', 'sans-serif'],
      },
    },
  },
  plugins: AgoraTailwindConfig.plugins,
  safelist: [
    ...(AgoraTailwindConfig.safelist || []),
    '!hidden',
    '!block',
    '!flex',
  ] as any[],
  corePlugins: {
    preflight: false,
  },
};

export default config;
