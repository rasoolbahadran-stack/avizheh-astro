/* آویژه — منطق صفحه اصلی */
(function () {
  'use strict';
  var U = window.AVZU, AVZ = window.AVZ, ic = window.icon;

  /* ---------- اسلایدر ---------- */
  (function hero() {
    var slides = U.$$('.hero-slide'), dots = U.$('#hero-dots');
    if (!slides.length || !dots) return;
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.className = 'hero-dot' + (i === 0 ? ' on' : '');
      b.setAttribute('aria-label', 'اسلاید ' + U.faNum(i + 1));
      b.addEventListener('click', function () { go(i); });
      dots.appendChild(b);
    });
    var cur = 0, timer = null;
    function go(i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === cur); });
      U.$$('.hero-dot', dots).forEach(function (d, k) { d.classList.toggle('on', k === cur); });
      restart();
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 5600); }
    var nx = U.$('#hero-next'), pv = U.$('#hero-prev');
    nx && nx.addEventListener('click', function () { go(cur + 1); });
    pv && pv.addEventListener('click', function () { go(cur - 1); });
    nx && (nx.innerHTML = ic('chev-left'));
    pv && (pv.innerHTML = ic('chev-right'));
    restart();
  })();

  /* ---------- شمارنده شگفت‌انگیز (پایان امروز) ---------- */
  (function countdown() {
    var h = U.$('#dd-h'), m = U.$('#dd-m'), s = U.$('#dd-s');
    if (!h) return;
    function tick() {
      var now = new Date();
      var end = new Date(now); end.setHours(23, 59, 59, 999);
      var d = Math.max(0, end - now);
      var hh = Math.floor(d / 3600000), mm = Math.floor(d % 3600000 / 60000), ss = Math.floor(d % 60000 / 1000);
      h.textContent = String(hh).padStart(2, '0');
      m.textContent = String(mm).padStart(2, '0');
      s.textContent = String(ss).padStart(2, '0');
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------- ریل‌های محصول ---------- */
  function offPct(p) { return p.old ? Math.round((1 - p.price / p.old) * 100) : 0; }

  function cardHtml(p) {
    var off = offPct(p);
    var badges = '';
    if (off >= 10) badges += '<span class="chip chip-sale">٪' + U.faNum(off) + ' تخفیف</span>';
    if (p.isNew) badges += '<span class="chip chip-new">جدید</span>';
    if (p.out) badges = '<span class="chip chip-out">ناموجود</span>';
    var dots = p.colors.slice(0, 4).map(function (c) { return '<span class="cdot" style="background:' + c[1] + '" title="' + c[0] + '"></span>'; }).join('') +
      (p.colors.length > 4 ? '<span class="cdot more">+' + U.faNum(p.colors.length - 4) + '</span>' : '');
    var oldHtml = p.old ? '<del class="price-old">' + U.money(p.old) + '</del>' : '';
    return '<article class="pcard' + (p.out ? ' pcard-out' : '') + '" data-id="' + p.id + '">' +
      '<a class="pcard-media" href="' + U.lk('product', p.id) + '" aria-label="' + U.esc(p.name) + '">' +
        '<img class="main" src="' + p.images[0] + '" alt="' + U.esc(p.name) + '" loading="lazy" width="1000" height="1333">' +
        (p.images[1] ? '<img class="alt" src="' + p.images[1] + '" alt="" loading="lazy" width="1000" height="1333">' : '') +
        '<div class="pcard-badges">' + badges + '</div>' +
        '<button class="pcard-wish' + (U.wish.has(p.id) ? ' on' : '') + '" type="button" data-wish="' + p.id + '" aria-label="افزودن به علاقه‌مندی">' + ic('heart') + '</button>' +
      '</a>' +
      (p.out ? '' : '<button class="pcard-quick" type="button" data-quick="' + p.id + '">' + ic('cart') + 'افزودن سریع</button>') +
      '<div class="pcard-body">' +
        '<span class="pcard-cat">' + U.esc(p.catName) + '</span>' +
        '<a class="pcard-name" href="' + U.lk('product', p.id) + '">' + U.esc(p.name) + '</a>' +
        '<div class="pcard-rating">' + U.stars(p.rating) + '<span>(' + U.faNum(p.rc) + ' نظر)</span></div>' +
        '<div class="pcard-colors">' + dots + '</div>' +
        '<div class="pcard-price"><span class="price-cur">' + U.money(p.price) + ' <small style="font-weight:500;font-size:11px">تومان</small></span>' + oldHtml + (off ? '<span class="price-off">٪' + U.faNum(off) + '</span>' : '') + '</div>' +
      '</div></article>';
  }

  window.AVZ_CARD = cardHtml; /* برای صفحات دیگر */

  function fill(sel, items, fn) {
    var el = U.$(sel);
    if (!el || el.children.length) return;
    el.innerHTML = items.map(fn || cardHtml).join('');
    el.classList.add('in');
  }

  /* ریل جدید */
  fill('#rail-new', AVZ.PRODUCTS.filter(function (p) { return p.isNew; }).slice(0, 8));

  /* ریل پرفروش با رتبه */
  (function () {
    var best = AVZ.PRODUCTS.slice().sort(function (a, b) { return b.sold - a.sold; }).slice(0, 8);
    fill('#rail-best', best, function (p, i) {
      var off = offPct(p);
      return '<a class="rank-item" href="' + U.lk('product', p.id) + '">' +
        '<span class="rank-num">' + U.faNum(i + 1) + '</span>' +
        '<img src="' + p.images[0] + '" alt="' + U.esc(p.name) + '" loading="lazy" width="64" height="80">' +
        '<div class="rank-body"><div class="rank-name">' + U.esc(p.name) + '</div>' +
        '<div class="rank-meta">' + U.esc(p.brandName) + ' · ' + U.faNum(p.sold.toLocaleString('en-US')) + ' فروش موفق ' + (off ? '· <span style="color:var(--danger)">' + U.faNum(off) + '٪ تخفیف</span>' : '') + '</div></div>' +
        '<div class="rank-price">' + U.money(p.price) + ' <small style="font-weight:500;font-size:10px">تومان</small></div></a>';
    });
  })();

  /* ریل پربازدید */
  (function () {
    var viewed = AVZ.PRODUCTS.slice().sort(function (a, b) { return b.views - a.views; }).slice(0, 10);
    fill('#rail-viewed', viewed, function (p) {
      var off = offPct(p);
      return '<article class="hcard" data-id="' + p.id + '">' +
        '<a class="pcard-media" href="' + U.lk('product', p.id) + '"><img src="' + p.images[0] + '" alt="' + U.esc(p.name) + '" loading="lazy" width="1000" height="1333">' +
        (off ? '<div class="pcard-badges"><span class="chip chip-sale">٪' + U.faNum(off) + '</span></div>' : '') +
        '<button class="pcard-wish' + (U.wish.has(p.id) ? ' on' : '') + '" type="button" data-wish="' + p.id + '" aria-label="علاقه‌مندی">' + ic('heart') + '</button></a>' +
        '<div class="hcard-body"><a class="hcard-name" href="' + U.lk('product', p.id) + '">' + U.esc(p.name) + '</a>' +
        '<span class="hcard-views">' + ic('eye') + U.faNum(p.views.toLocaleString('en-US')) + ' بازدید</span>' +
        '<div class="pcard-price"><span class="price-cur" style="font-size:13.5px">' + U.money(p.price) + ' <small style="font-weight:500;font-size:10px">تومان</small></span></div></div></article>';
    });
  })();

  /* شگفت‌انگیزها */
  (function () {
    var deals = AVZ.PRODUCTS.filter(function (p) { return p.old && !p.out; })
      .sort(function (a, b) { return (b.old - b.price) / b.old - (a.old - a.price) / a.old; }).slice(0, 4);
    fill('#deal-row', deals, function (p) {
      var off = offPct(p);
      var stockLeft = Math.max(6, Math.min(24, Math.round(p.sold / 80) + 6));
      var pct = Math.min(88, Math.round(stockLeft / 30 * 100) + 30);
      return '<a class="dcard" href="' + U.lk('product', p.id) + '">' +
        '<img src="' + p.images[0] + '" alt="' + U.esc(p.name) + '" loading="lazy" width="104" height="132">' +
        '<div class="dcard-body"><div class="dcard-name">' + U.esc(p.name) + '</div>' +
        '<span class="chip chip-sale" style="align-self:flex-start">٪' + U.faNum(off) + ' تخفیف</span>' +
        '<div class="pcard-price"><del class="price-old">' + U.money(p.old) + '</del><span class="price-cur" style="font-size:15px;color:var(--primary-dark)">' + U.money(p.price) + '</span></div>' +
        '<div class="dcard-prog"><i style="width:' + pct + '%"></i></div>' +
        '<span class="dcard-prog-lbl">فقط ' + U.faNum(stockLeft) + ' عدد باقی مانده</span></div></a>';
    });
  })();

  /* دسته‌بندی‌های محبوب */
  (function () {
    var counts = {};
    AVZ.PRODUCTS.forEach(function (p) { counts[p.cat] = (counts[p.cat] || 0) + 1; });
    var html = AVZ.CATS.map(function (c) {
      return '<a class="cattile" href="' + U.lk('category', c.slug) + '">' +
        '<img src="' + (window.AVZ_BASE || '') + c.img + '" alt="' + U.esc(c.name) + '" loading="lazy" width="800" height="1000">' +
        '<div class="cattile-body"><div class="cattile-count">' + U.faNum(counts[c.slug] || 0) + ' محصول</div>' +
        '<div class="cattile-name">' + U.esc(c.name) + '</div>' +
        '<span class="cattile-link">مشاهده محصولات <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg></span></div></a>';
    }).join('');
    var el = U.$('#cat-grid'); if (el && !el.children.length) el.innerHTML = html;
  })();

  /* نظرات مشتریان */
  (function () {
    var el = U.$('#tst-row'); if (!el || el.children.length) return;
    el.innerHTML = AVZ.TESTIMONIALS.map(function (t) {
      return '<article class="tst">' +
        '<div class="tst-head"><span class="tst-ava" style="background:linear-gradient(135deg,var(--soft-2),var(--soft));display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--primary-dark)">' + t.name.charAt(0) + '</span>' +
        '<div><div class="tst-name">' + U.esc(t.name) + '</div><div class="tst-role">خریدار از ' + U.esc(t.city) + '</div></div>' + U.stars(t.stars) + '</div>' +
        '<p class="tst-text">' + U.esc(t.text) + '</p></article>';
    }).join('');
  })();

  /* واکنش‌های کلی: علاقه‌مندی و افزودن سریع */
  document.addEventListener('click', function (e) {
    var w = e.target.closest('[data-wish]');
    if (w) {
      e.preventDefault();
      var id = w.dataset.wish;
      var on = U.wish.toggle(id);
      U.$$(' [data-wish="' + id + '"]').forEach(function (b) { b.classList.toggle('on', on); });
      U.toast(on ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد', on ? 'ok' : 'info');
      return;
    }
    var q = e.target.closest('[data-quick]');
    if (q) {
      e.preventDefault();
      window.AVZ_QV && window.AVZ_QV.open(q.dataset.quick);
    }
  });

  /* مودال افزودن سریع */
  (function quickView() {
    var bd = null;
    function ensure() {
      if (bd) return;
      bd = document.createElement('div');
      bd.className = 'modal-backdrop';
      bd.id = 'qv-backdrop';
      document.body.appendChild(bd);
      bd.addEventListener('click', function (e) { if (e.target === bd) close(); });
    }
    function close() { bd.classList.remove('open'); }
    function open(id) {
      var p = AVZ.byId(id); if (!p) return;
      ensure();
      var ci = 0, si = Math.floor(p.sizes.length / 2);
      function draw() {
        var stock = p.variants[ci + '-' + si] || 0;
        bd.innerHTML = '<div class="modal"><button class="modal-close" type="button" aria-label="بستن">' + ic('x') + '</button>' +
          '<div style="display:grid;grid-template-columns:180px 1fr;gap:18px;padding:24px">' +
          '<img src="' + p.images[0] + '" alt="' + U.esc(p.name) + '" style="border-radius:14px;aspect-ratio:3/4;object-fit:cover" width="180" height="240">' +
          '<div><h3 style="font-size:16px;margin-bottom:6px">' + U.esc(p.name) + '</h3>' +
          '<div class="pcard-rating" style="margin-bottom:12px">' + U.stars(p.rating) + '</div>' +
          '<div class="vgroup"><h4>رنگ: <span class="sel-val">' + U.esc(p.colors[ci][0]) + '</span></h4><div class="vopts">' +
          p.colors.map(function (c, i) { return '<button type="button" class="copt' + (i === ci ? ' on' : '') + '" data-c="' + i + '" style="background:' + c[1] + '" aria-label="' + c[0] + '"></button>'; }).join('') +
          '</div></div>' +
          '<div class="vgroup" style="margin-top:14px"><h4>سایز: <span class="sel-val">' + U.esc(p.sizes[si]) + '</span></h4><div class="vopts">' +
          p.sizes.map(function (s, i) { var st = p.variants[ci + '-' + i] || 0; return '<button type="button" class="vopt' + (i === si ? ' on' : '') + '"' + (st ? '' : ' disabled') + ' data-s="' + i + '">' + U.esc(s) + '</button>'; }).join('') +
          '</div></div>' +
          '<div style="display:flex;align-items:center;gap:14px;margin-top:16px;flex-wrap:wrap">' +
          '<b style="font-size:18px;color:var(--primary-dark)">' + U.money(p.price) + ' تومان</b>' +
          '<span class="stock-note ' + (stock ? 'ok' : 'out') + '">' + ic(stock ? 'check' : 'x') + (stock ? U.faNum(stock) + ' عدد موجود' : 'ناموجود') + '</span></div>' +
          '<button class="btn btn-primary btn-block" id="qv-add" style="margin-top:16px"' + (stock ? '' : ' disabled') + '>' + ic('cart') + 'افزودن به سبد خرید</button>' +
          '<a class="btn btn-ghost btn-block" style="margin-top:10px" href="' + U.lk('product', p.id) + '">مشاهده کامل محصول</a>' +
          '</div></div></div>';
        U.$$('.modal-close', bd).forEach(function (b) { b.addEventListener('click', close); });
        U.$$('[data-c]', bd).forEach(function (b) { b.addEventListener('click', function () { ci = +b.dataset.c; if (!(p.variants[ci + '-' + si] || 0)) si = 0; draw(); }); });
        U.$$('[data-s]', bd).forEach(function (b) { b.addEventListener('click', function () { if (!b.disabled) { si = +b.dataset.s; draw(); } }); });
        U.$('#qv-add', bd).addEventListener('click', function () {
          if (U.cart.add(p.id, ci, si, 1)) { U.toast('به سبد خرید اضافه شد', 'ok'); close(); }
        });
      }
      draw();
      bd.classList.add('open');
    }
    window.AVZ_QV = { open: open };
  })();
})();
