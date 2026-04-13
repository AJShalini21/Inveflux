import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'accent-blue': 'var(--color-accent-blue)',
        'sky': 'var(--color-sky)',
        'success-light': 'var(--color-success-light)',
        'success-600': 'var(--color-success-600)',
        'warning-dark': 'var(--color-warning-dark)',
        'warning': 'var(--color-warning)',
        'teal': 'var(--color-teal)',
        'purple': 'var(--color-purple)',
        'pink': 'var(--color-pink)',
        'indigo-600': 'var(--color-indigo-600)',
        'danger': 'var(--color-danger)',
        'danger-light': 'var(--color-danger-light)',
        'neutral-100': 'var(--color-neutral-100)',
        'neutral-200': 'var(--color-neutral-200)',
        'neutral-900': 'var(--color-neutral-900)'
      }
    }
  },
  plugins: []
};

export default config;
