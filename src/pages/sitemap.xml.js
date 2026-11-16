import { AVZ } from '../data/catalog.js';

const SITE = 'https://avizheh-showcase.pages.dev';
const STATIC = [
  'index.html', 'shop.html', 'product.html', 'cart.html', 'checkout.html',
  'order-success.html', 'account.html', 'wishlist.html', 'about.html', 'contact.html',
  'faq.html', 'terms.html', 'shipping.html', 'returns.html', 'size-guide.html',
  'blog.html', 'blog-post.html', 'track-order.html',
];

export function GET() {
  const urls = [
    ...STATIC,
    ...AVZ.PRODUCTS.map((p) => 'product/' + p.id + '.html'),
    ...AVZ.POSTS.map((b) => 'blog/' + b.id + '.html'),
  ].map((u) => '<url><loc>' + SITE + '/' + u + '</loc></url>').join('\n');
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
