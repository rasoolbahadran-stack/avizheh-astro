import { defineConfig } from 'astro/config';

// GitHub Pages test deployment — static output only.
export default defineConfig({
  site: 'https://rasoolbahadran-stack.github.io',
  base: '/avizheh-astro',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
