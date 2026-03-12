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
        // 공식 브랜드 팔레트
        'wf-black': '#000000',
        'wf-gray-light': '#CDD9D4',
        'wf-gray-blue': '#D7D5CD',
        // 디지털 확장 팔레트
        'wf-navy': '#1B3A5C',
        'wf-celadon': '#6BA3A0',
        'wf-cream': '#F5F9F8',
        'wf-warm': '#FAF8F5',
        'wf-gold': '#C4A265',
        'wf-border': '#E0E8E6',
        'wf-text': '#2C3E3C',
        'wf-text-light': '#7A8A87',
        'wf-text-faint': '#A8B5B2',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
