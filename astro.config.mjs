import { defineConfig } from 'astro/config';

// خروجی SSG با ساختار فایل‌محور: dist/shop.html ، dist/product/{id}.html و ...
export default defineConfig({
  site: 'https://avizheh.example',
  build: { format: 'file' },
});
