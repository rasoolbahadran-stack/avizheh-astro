/* آویژه — صفحه جزئیات محصول */
(function () {
  'use strict';
  var U = window.AVZU, AVZ = window.AVZ, ic = window.icon;
  var cardHtml = window.AVZ_CARD;

  var id = new URLSearchParams(location.search).get('id');
  if (!id) { var m = (location.pathname || '').match(/\/product\/([a-z0-9-]+)\.html/); if (m) id = m[1]; }
  var p = AVZ.byId(id);
  var main = U.$('#pdp');

  if (!p) {
    if (main) main.innerHTML = '<div style="grid-column:1/-1;text-align:center;background:#fff;border:1px solid var(--border);border-radius:20px;padding:60px 24px"><h2>محصول یافت نشد</h2><p style="margin:12px 0;color:var(--ink-soft)">این محصول حذف شده یا آدرس اشتباه است.</p><a class="btn btn-primary" href="shop.html">بازگشت به فروشگاه</a></div>';
    return;
  }

  var state = { ci: 0, si: -1, qty: 1 };
  /* سایز پیش‌فرض: اولین سایز موجود */
  for (var i = 0; i < p.sizes.length; i++) { if (p.variants['0-' + i] > 0) { state.si = i; break; } }
  if (state.si < 0) state.si = 0;

  document.title = p.name + ' | آویژه';

  /* ---------- breadcrumb ---------- */
  var bc = U.$('#bc');
  if (bc) bc.innerHTML = '<a href="index.html">خانه</a><span class="sep">›</span><a href="shop.html">فروشگاه</a><span class="sep">›</span><a href="' + U.lk('category', p.cat) + '">' + U.esc(p.catName) + '</a><span class="sep">›</span><span class="cur">' + U.esc(p.name) + '</span>';

  /* ---------- گالری ---------- */
  var galImgs = p.images.length ? p.images : [(window.AVZ_BASE || '') + 'assets/img/products/promo-tights.webp'];
  var galMain = U.$('#gal-main-img'), galThumbs = U.$('#gal-thumbs');
  function galSet(idx) {
    galMain.src = galImgs[idx];
    U.$$('.gal-thumb').forEach(function (t, k) { t.classList.toggle('on', k === idx); });
  }
  galThumbs.innerHTML = galImgs.map(function (src, i) {
    return '<button class="gal-thumb' + (i === 0 ? ' on' : '') + '" type="button" data-gi="' + i + '" aria-label="تصویر ' + U.faNum(i + 1) + '"><img src="' + src + '" alt="" loading="lazy" width="76" height="101"></button>';
  }).join('');
  U.$$('.gal-thumb').forEach(function (t) { t.addEventListener('click', function () { galSet(+t.dataset.gi); }); });
  galSet(0);

  /* زوم با حرکت موس */
  var galMainBox = U.$('#gal-main');
  if (galMainBox) {
    galMainBox.addEventListener('mousemove', function (e) {
      var r = galMainBox.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top) / r.height) * 100;
      galMain.style.transformOrigin = x + '% ' + y + '%';
      galMain.style.transform = 'scale(2)';
    });
    galMainBox.addEventListener('mouseleave', function () { galMain.style.transform = 'scale(1)'; });
    /* لمس موبایل: بازکردن تصویر در همان صفحه با ضربه */
    galMainBox.addEventListener('click', function (e) {
      if (window.matchMedia('(hover:none)').matches) {
        var idx = galImgs.indexOf(galMain.src.split('/').pop());
        idx = galImgs.findIndex(function (g) { return location.origin + location.pathname.replace('product.html', '') + g === galMain.src || g === galMain.getAttribute('src'); });
        galSet((idx + 1) % galImgs.length);
      }
    });
  }

  /* ---------- خلاصه خرید ---------- */
  var off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  var totalStock = Object.keys(p.variants).reduce(function (a, k) { return a + p.variants[k]; }, 0);
  U.$('#pdp-brand').textContent = p.brandName;
  U.$('#pdp-title').textContent = p.name;
  U.$('#pdp-rating').innerHTML = U.stars(p.rating, true) + '<span class="divider"></span><a href="#reviews" style="text-decoration:underline">' + U.faNum(p.rc) + ' دیدگاه ثبت‌شده</a><span class="divider"></span><span>' + U.faNum(p.sold.toLocaleString('en-US')) + ' فروش موفق</span>';
  U.$('#pdp-price-cur').innerHTML = U.money(p.price) + ' <small>تومان</small>' +
    (p.old ? ' <del class="price-old" style="font-size:15px">' + U.money(p.old) + '</del> <span class="chip chip-sale">٪' + U.faNum(off) + ' تخفیف</span>' : '');
  U.$('#pdp-badges').innerHTML =
    (off ? '<span class="chip chip-sale">٪' + U.faNum(off) + ' تخفیف</span>' : '') +
    (p.isNew ? '<span class="chip chip-new">جدید</span>' : '') +
    (p.out ? '<span class="chip chip-out">ناموجود</span>' : '') +
    (totalStock > 0 && !p.out ? '<span class="chip chip-gold">' + ic('check') + 'اصل و ضمانت‌دار</span>' : '');

  /* ---------- انتخاب رنگ/سایز ---------- */
  var colorBox = U.$('#pdp-colors'), sizeBox = U.$('#pdp-sizes');
  function drawVariants() {
    colorBox.innerHTML = p.colors.map(function (c, i) {
      var hasAny = p.sizes.some(function (_, k) { return p.variants[i + '-' + k] > 0; });
      return '<button type="button" class="copt' + (i === state.ci ? ' on' : '') + (hasAny ? '' : ' dis') + '" data-c="' + i + '" style="background:' + c[1] + '" title="' + U.esc(c[0]) + (hasAny ? '' : ' (ناموجود)') + '" aria-label="' + U.esc(c[0]) + '"></button>';
    }).join('');
    var selColor = p.colors[state.ci][0];
    U.$('#pdp-color-val').textContent = selColor;
    sizeBox.innerHTML = p.sizes.map(function (s, i) {
      var st = p.variants[state.ci + '-' + i] || 0;
      return '<button type="button" class="vopt' + (i === state.si ? ' on' : '') + '"' + (st > 0 ? '' : ' disabled title="ناموجود در این رنگ"') + ' data-s="' + i + '">' + U.esc(s) + '</button>';
    }).join('');
    U.$('#pdp-size-val').textContent = p.sizes[state.si];

    var st = p.variants[state.ci + '-' + state.si] || 0;
    var note = U.$('#pdp-stock');
    if (p.out || st <= 0) note.innerHTML = '<span class="stock-note out">' + ic('x') + 'این تنوع فعلاً ناموجود است</span>';
    else if (st <= 6) note.innerHTML = '<span class="stock-note low">' + ic('clock') + 'تنها ' + U.faNum(st) + ' عدد باقی مانده — عجله کنید!</span>';
    else note.innerHTML = '<span class="stock-note ok">' + ic('check') + 'موجود در انبار (' + U.faNum(st) + ' عدد)</span>';

    var buy = U.$('#pdp-buy-btn');
    buy.disabled = p.out || st <= 0;
    U.$('#pdp-qty-in').max = Math.max(1, st);
    if (state.qty > Math.max(1, st)) { state.qty = Math.max(1, st); U.$('#pdp-qty-in').value = state.qty; }

    colorBox.querySelectorAll('.copt').forEach(function (b) {
      b.addEventListener('click', function () { if (b.classList.contains('dis')) return; state.ci = +b.dataset.c; state.si = 0; drawVariants(); });
    });
    sizeBox.querySelectorAll('.vopt').forEach(function (b) {
      b.addEventListener('click', function () { if (!b.disabled) { state.si = +b.dataset.s; drawVariants(); } });
    });
  }
  drawVariants();

  /* ---------- تعداد ---------- */
  var qtyIn = U.$('#pdp-qty-in');
  U.$('#pdp-qty-minus').addEventListener('click', function () { state.qty = Math.max(1, state.qty - 1); qtyIn.value = state.qty; });
  U.$('#pdp-qty-plus').addEventListener('click', function () { state.qty = Math.min(+qtyIn.max || 99, state.qty + 1); qtyIn.value = state.qty; });
  qtyIn.addEventListener('change', function () { state.qty = Math.max(1, Math.min(+qtyIn.max || 99, +qtyIn.value || 1)); qtyIn.value = state.qty; });

  /* ---------- سبد/علاقه‌مندی ---------- */
  U.$('#pdp-buy-btn').addEventListener('click', function () {
    if (U.cart.add(p.id, state.ci, state.si, state.qty)) {
      U.toast('«' + p.name + '» به سبد خرید اضافه شد', 'ok');
    }
  });
  var wishBtn = U.$('#pdp-wish');
  wishBtn.classList.toggle('on', U.wish.has(p.id));
  wishBtn.addEventListener('click', function () {
    var on = U.wish.toggle(p.id);
    wishBtn.classList.toggle('on', on);
    U.toast(on ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد', 'ok');
  });

  /* ---------- توضیحات و مشخصات ---------- */
  U.$('#pdp-desc').textContent = p.desc;
  var specs = Object.assign({}, p.specs, { 'برند': p.brandName, 'دسته‌بندی': p.catName });
  U.$('#pdp-specs').innerHTML = Object.keys(specs).map(function (k) {
    return '<tr><td>' + U.esc(k) + '</td><td>' + U.esc(specs[k]) + '</td></tr>';
  }).join('');
  U.$('#pdp-care').innerHTML = p.care.map(function (c) { return '<li>' + U.esc(c) + '</li>'; }).join('');
  U.$('#pdp-ship-info').innerHTML =
    '<div class="ship-box"><div class="row">' + ic('truck') + '<span><b>ارسال تهران:</b> پیک اکسپرس در کمتر از ۲۴ ساعت (۹۸٫۰۰۰ تومان — رایگان برای سبدهای بالای ۱٫۵ میلیون)</span></div>' +
    '<div class="row">' + ic('package') + '<span><b>سایر شهرها:</b> پست پیشتاز ۲ تا ۴ روز کاری (۶۸٫۰۰۰ تومان)</span></div>' +
    '<div class="row">' + ic('refresh') + '<span><b>مرجوعی:</b> تا ۷ روز با بسته‌بندی بهداشتی بازنشده</span></div>' +
    '<div class="row">' + ic('shield') + '<span><b>ضمانت:</b> اصالت جنس و سلامت فیزیکی کالا تضمین می‌شود</span></div></div>';

  /* ---------- تب‌ها ---------- */
  U.$$('.tab-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      U.$$('.tab-btn').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      U.$$('.tab-panel').forEach(function (x) { x.classList.remove('on'); });
      U.$('#' + b.dataset.tab).classList.add('on');
    });
  });

  /* ---------- جدول سایز ---------- */
  var isWomen = ['women-underwear', 'shapewear', 'loungewear', 'socks'].indexOf(p.cat) >= 0 && p.cat !== 'socks' || p.cat === 'women-underwear';
  function openSizeTable(kind) {
    var t = AVZ.SIZE_TABLES[kind];
    U.$('#sg-modal-body').innerHTML = '<table class="spec-table"><thead><tr>' + t.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>' +
      '<div class="size-note">' + ic('info') + '<span>اگر بین دو سایز هستید، برای لباس زیر روزمره سایز بزرگ‌تر را انتخاب کنید. برای مشاوره رایگان با پشتیبانی تماس بگیرید: ۰۲۱-۹۱۰۰۰۲۰۰</span></div>';
    U.$('#sg-modal').classList.add('open');
  }
  U.$('#pdp-sizeguide').addEventListener('click', function () { openSizeTable(isWomen ? 'women' : 'men'); });
  U.$('#sg-close').addEventListener('click', function () { U.$('#sg-modal').classList.remove('open'); });
  U.$('#sg-modal').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); });

  /* ---------- نظرات ---------- */
  (function reviews() {
    var avg = p.rating;
    var dist = [5, 4, 3, 2, 1].map(function (s) {
      var base = [0.62, 0.22, 0.09, 0.04, 0.03][5 - s];
      return { s: s, pct: Math.round(base * 100 + (s === Math.round(avg) ? 8 : 0)) };
    });
    var el = U.$('#rev-summary');
    if (!el.children.length) el.innerHTML = '<div class="rev-score"><b>' + U.faNum(avg.toFixed(1)) + '</b>' + U.stars(avg) + '<span style="font-size:12px;color:var(--ink-soft)">از مجموع ' + U.faNum(p.rc) + ' دیدگاه</span></div>' +
      '<div class="rev-bars">' + dist.map(function (d) {
        return '<div class="rbar"><span>' + U.faNum(d.s) + ' ستاره</span><div class="track"><i style="width:' + Math.min(95, d.pct) + '%"></i></div><span>' + U.faNum(d.pct) + '٪</span></div>';
      }).join('') + '</div>';
    var rl = U.$('#rev-list');
    if (rl && !rl.children.length) rl.innerHTML = p.reviews.map(function (r) {
      return '<div class="rev-item"><div class="rev-top"><span class="rev-ava">' + r.name.charAt(0) + '</span><span class="rev-name">' + U.esc(r.name) + '</span>' +
        '<span class="chip chip-soft">خریدار تأییدشده</span><span class="rev-date">' + r.date + '</span></div>' +
        '<div style="margin-bottom:6px">' + U.stars(r.stars) + '</div>' +
        '<p class="rev-text">' + U.esc(r.text) + '</p></div>';
    }).join('');
    /* فرم ثبت نظر */
    var chosen = 5;
    var fs = U.$('#rev-stars');
    fs.innerHTML = [1, 2, 3, 4, 5].map(function (i) { return '<button type="button" data-st="' + i + '" class="' + (i <= 5 ? 'on' : '') + '"><svg viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>'; }).join('');
    fs.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        chosen = +b.dataset.st;
        fs.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', +x.dataset.st <= chosen); });
      });
    });
    U.$('#rev-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = U.$('#rev-name').value.trim(), text = U.$('#rev-text').value.trim();
      if (!name || !text) { U.toast('نام و متن دیدگاه را کامل کنید', 'err'); return; }
      var listEl = U.$('#rev-list');
      listEl.insertAdjacentHTML('afterbegin', '<div class="rev-item"><div class="rev-top"><span class="rev-ava">' + name.charAt(0) + '</span><span class="rev-name">' + U.esc(name) + '</span><span class="chip chip-soft">دیدگاه جدید شما</span><span class="rev-date">هم‌اکنون</span></div>' +
        '<div style="margin-bottom:6px">' + U.stars(chosen) + '</div><p class="rev-text">' + U.esc(text) + '</p></div>');
      U.$('#rev-form').reset();
      U.toast('دیدگاه شما ثبت شد؛ پس از تأیید نمایش داده می‌شود', 'ok');
    });
  })();

  /* ---------- مرتبط و مکمل ---------- */
  function rail(sel, items, title) {
    var el = U.$(sel);
    if (!el || el.children.length) return;
    var head = el.closest('.section') ? el.closest('.section').querySelector('.sec-head h2') : null;
    if (head && title) head.textContent = title;
    el.innerHTML = items.map(cardHtml).join('');
  }
  var related = AVZ.PRODUCTS.filter(function (x) { return x.cat === p.cat && x.id !== p.id; })
    .sort(function (a, b) { return b.rating - a.rating; }).slice(0, 4);
  var complementRules = {
    'women-underwear': ['mei-satin-3p', 'women-socks-6p', 'lia-top'],
    'men-underwear': ['revin-tee', 'arman-socks-5p', 'diba-bamboo'],
    'loungewear': ['golnar-robe', 'women-socks-6p', 'koohsar-lounge'],
    'shapewear': ['sheishei-40', 'fitpro-leg'],
    'socks': ['fitpro-leg', 'sheishei-40'],
    'leggings': ['arman-socks-5p', 'girls-socks-3p'],
    'accessories': ['warm-gloves', 'garmaj-arm'],
    'seasonal': ['saman-pj', 'warm-gloves']
  };
  var compIds = (complementRules[p.cat] || []).filter(function (cid) { return cid !== p.id; });
  var complements = compIds.map(AVZ.byId).filter(Boolean).slice(0, 4);
  rail('#rail-related', related, 'محصولات مشابه');
  rail('#rail-comp', complements, 'با این محصول، این‌ها هم ببینید');

  /* ---------- JSON-LD ---------- */
  if (document.querySelector('script[data-avz-ld]')) return;
  var ld = document.createElement('script');
  ld.setAttribute('data-avz-ld', '1');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product',
    name: p.name, brand: { '@type': 'Brand', name: p.brandName },
    description: p.desc,
    offers: { '@type': 'Offer', priceCurrency: 'IRR', price: p.price * 10, availability: p.out ? 'http://schema.org/OutOfStock' : 'http://schema.org/InStock' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.rc }
  });
  document.head.appendChild(ld);
})();
