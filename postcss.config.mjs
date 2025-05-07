import tailwindConfig from './tailwind.config.mjs';

export default {
  plugins: {
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
    autoprefixer: {},
    'postcss-antd-fixes': { prefixes: ['ant', 'el'] },
    'postcss-import': {},
    'postcss-preset-env': {},
    tailwindcss: { config: tailwindConfig },
    'tailwindcss/nesting': {},
  },
};