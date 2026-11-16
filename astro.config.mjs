import { defineConfig } from 'astro/config';

// خروجی SSG برای استقرار مستقل روی Cloudflare Pages
export default defineConfig({
  site: 'https://avizheh-showcase.pages.dev',
  build: { format: 'file' },
});
