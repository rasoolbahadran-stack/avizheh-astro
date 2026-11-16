# فروشگاه آویزه — نسخهٔ Astro (SSG)

نمونه‌کار فروشگاه پوشاک «آویژه» با Astro و تولید استاتیک کامل (SSG).
این نسخه مستقل از نسخهٔ HTML است؛ همان سیستم طراحی، همان دادهٔ مشترک
(`src/vendor_data.js`) و همان منطق سبد خرید/فیلترها در قالب کامپوننت‌های Astro.

## اجرا

```bash
npm install     # نصب وابستگی‌ها
npm run dev     # محیط توسعه روی http://localhost:4321
npm run build   # خروجی استاتیک در dist/
npm run preview # پیش‌نمایش خروجی بیلد
```

پوشهٔ `dist/` خروجی نهایی بیلد است (ساختار فایل‌محور: `index.html`، `shop.html`،
`product/{id}.html` برای ۴۰ محصول، `blog/{slug}.html` برای مقالات، `sitemap.xml`).

## ساختار

- `src/layouts/Layout.astro` — قالب پایه: هد SEO، فونت محلی، اسکریپت‌های مشترک
- `src/components/Chrome.astro` — تاپ‌بار، هدر، مگا‌منو، منوی موبایل و نوار پایین (سمت سرور)
- `src/components/Foot.astro` — فوتر مشترک همهٔ صفحات
- `src/data/catalog.js` — منبع واحد داده (وارد کردن `vendor_data.js` در محیط Node)
- `src/pages/` — صفحات ایستا + دو مسیر پویای SSG:
  - `product/[id].astro` → ۴۰ صفحهٔ محصول با متا، JSON-LD و محتوای سرور-رندر
  - `blog/[slug].astro` → ۴ مقالهٔ کامل سرور-رندر
  - `sitemap.xml.js` → نقشهٔ سایت خودکار از روی کاتالوگ
