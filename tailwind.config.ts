import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A24B',
        'gold-soft': '#E3C77E',
        bg: '#0B0D10',
        card: 'rgba(255,255,255,0.04)',
        text: '#F4F1EA',
        'text-muted': '#8A8C90',
        'macro-protein': '#E07A5F',
        'macro-carbs': '#81B29A',
        'macro-fat': '#6C9BD1',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
