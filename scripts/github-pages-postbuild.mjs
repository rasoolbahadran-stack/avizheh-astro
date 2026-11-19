import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const BASE = '/avizheh-astro';
const SITE = 'https://rasoolbahadran-stack.github.io' + BASE;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(file);
      continue;
    }
    if (!/\.html?$/i.test(entry.name)) continue;

    let html = await readFile(file, 'utf8');
    html = html
      .replace(/<base\s+href=(["'])\/\1\s*\/?>/i, '<base href="' + BASE + '/>')
      .replace(/(\b(?:href|src|action|poster|data-src|data-href)\s*=\s*["'])\/(?!\/|avizheh-astro\/)/gi, function (_, prefix) { return prefix + BASE + '/'; })
      .replace(/url\((\s*["']?)\/(?!\/|avizheh-astro\/)/gi, function (_, prefix) { return 'url(' + prefix + BASE + '/'; })
      .replaceAll('https://avizheh-showcase.pages.dev', SITE);
    await writeFile(file, html, 'utf8');
  }
}

await walk(DIST);
console.log('GitHub Pages base-path rewrite completed.');
