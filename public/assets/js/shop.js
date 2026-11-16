/* آویژه — آرشیو محصولات: فیلتر قیمت/سایز/رنگ/برند/موجودی + مرتب‌سازی + صفحه‌بندی */
(function () {
  'use strict';
  var U = window.AVZU, AVZ = window.AVZ, ic = window.icon;
  var cardHtml = window.AVZ_CARD;
  var PER_PAGE = 12;

  /* ---------- وضعیت ---------- */
  var params = new URLSearchParams(location.search);
  var CTX = window.AVZ_SHOP_CTX || {};
  var S = {
    cat: params.get('cat') || CTX.cat || '',
    sub: params.get('sub') || CTX.sub || '',
    q: params.get('q') || '',
    sale: params.get('sale') === '1',
    sort: params.get('sort') || 'new',
    min: null, max: null,
    sizes: [], colors: [], brands: [],
    stock: false, page: 1
  };

  /* ---------- محدوده اولیه محصولات ---------- */
  function scopeBase() {
    var list = AVZ.PRODUCTS.slice();
    if (S.cat) list = list.filter(function (p) { return p.cat === S.cat; });
    if (S.sub) list = list.filter(function (p) { return p.sub === S.sub; });
    if (S.sale) list = list.filter(function (p) { return !!p.old; });
    if (S.q) {
      var q = S.q.toLowerCase();
      list = list.filter(function (p) {
        return (p.name + ' ' + p.brandName + ' ' + p.catName + ' ' + (p.desc || '')).toLowerCase().indexOf(q) >= 0;
      });
    }
    return list;
  }

  var base = scopeBase();
  var bounds = {
    min: Math.min.apply(null, base.map(function (p) { return p.price; })) || 0,
    max: Math.max.apply(null, base.map(function (p) { return p.price; })) || 10000000
  };
  S.min = S.min || bounds.min;
  S.max = S.max || bounds.max;

  /* ---------- عنوان صفحه ---------- */
  function pageTitle() {
    if (S.sale) return { t: 'پیشنهادهای شگفت‌انگیز و تخفیف‌دار', s: 'بهترین فرصت‌های خرید با تخفیف واقعی و محدود' };
    if (S.q) return { t: 'نتایج جست‌وجوی «' + S.q + '»', s: U.faNum(filtered().length) + ' محصول مطابق جست‌وجوی شما یافت شد' };
    var c = S.cat ? AVZ.catBySlug(S.cat) : null;
    if (c && S.sub) {
      var sub = c.subs.find(function (x) { return x.slug === S.sub; });
      return { t: sub ? sub.name : c.name, s: 'انتخابی آویژه از ' + sub.name + ' با سایزبندی دقیق و ضمانت اصالت' };
    }
    if (c) return { t: c.name, s: 'خرید انواع ' + c.name + ' با ضمانت اصالت، ارسال سریع و ۷ روز مرجوعی' };
    return { t: 'همه محصولات آویژه', s: 'کالکشن کامل پوشاک، لباس زیر و لباس راحتی — سایزبندی دقیق، ضمانت اصالت' };
  }

  /* ---------- اعمال فیلترها ---------- */
  function filtered() {
    var list = base.filter(function (p) {
      if (p.price < S.min || p.price > S.max) return false;
      if (S.brands.length && S.brands.indexOf(p.brand) < 0) return false;
      if (S.sizes.length) {
        var ok = p.sizes.some(function (s) { return S.sizes.indexOf(s) >= 0; });
        if (!ok) return false;
      }
      if (S.colors.length) {
        var okc = p.colors.some(function (c) { return S.colors.indexOf(c[0]) >= 0; });
        if (!okc) return false;
      }
      if (S.stock) {
        var has = Object.keys(p.variants).some(function (k) { return p.variants[k] > 0; });
        if (!has) return false;
      }
      return true;
    });
    switch (S.sort) {
      case 'best': list.sort(function (a, b) { return b.sold - a.sold; }); break;
      case 'rating': list.sort(function (a, b) { return b.rating - a.rating; }); break;
      case 'cheap': list.sort(function (a, b) { return a.price - b.price; }); break;
      case 'expensive': list.sort(function (a, b) { return b.price - a.price; }); break;
      default: list.sort(function (a, b) { return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.views - a.views; });
    }
    return list;
  }

  /* ---------- سایدبار ---------- */
  function buildFilters() {
    var brands = AVZ.BRANDS.filter(function (b) { return base.some(function (p) { return p.brand === b.slug; }); });
    var sizes = [];
    base.forEach(function (p) { p.sizes.forEach(function (s) { if (sizes.indexOf(s) < 0) sizes.push(s); }); });
    var colors = [];
    base.forEach(function (p) { p.colors.forEach(function (c) { if (!colors.some(function (x) { return x[0] === c[0]; })) colors.push(c); }); });

    function ck(name, val, label, count) {
      return '<label class="ckrow"><input type="checkbox" name="' + name + '" value="' + U.esc(val) + '">' +
        '<span class="ckbox">' + ic('check') + '</span><span class="lb">' + U.esc(label) + '</span>' +
        (count != null ? '<span class="ct">' + U.faNum(count) + '</span>' : '') + '</label>';
    }
    var brandHtml = brands.map(function (b) {
      return ck('brand', b.slug, b.name, base.filter(function (p) { return p.brand === b.slug; }).length);
    }).join('');
    var sizeHtml = sizes.map(function (s) {
      return ck('size', s, s, base.filter(function (p) { return p.sizes.indexOf(s) >= 0; }).length);
    }).join('');
    var colorHtml = colors.map(function (c) {
      return '<label class="ckrow" style="gap:8px"><input type="checkbox" name="color" value="' + U.esc(c[0]) + '">' +
        '<span class="sw" style="background:' + c[1] + ';width:22px;height:22px"></span><span class="lb">' + U.esc(c[0]) + '</span></label>';
    }).join('');

    var fmtM = function (n) { return U.money(n); };
    return '' +
      '<div class="fbox"><div class="fbox-head"><h3>محدوده قیمت (تومان)</h3><button type="button" class="clr" data-clr="price">حذف</button></div>' +
        '<div class="fbox-body">' +
          '<div class="price-inputs"><input type="text" id="pmin" inputmode="numeric" value="' + fmtM(S.min) + '"><span class="dash">—</span><input type="text" id="pmax" inputmode="numeric" value="' + fmtM(S.max) + '"></div>' +
          '<div class="range-wrap"><div class="range-track"></div><div class="range-fill" id="range-fill"></div>' +
            '<input type="range" id="rmin" min="' + bounds.min + '" max="' + bounds.max + '" step="5000" value="' + S.min + '">' +
            '<input type="range" id="rmax" min="' + bounds.min + '" max="' + bounds.max + '" step="5000" value="' + S.max + '">' +
          '</div>' +
        '</div></div>' +
      '<div class="fbox"><div class="fbox-head"><h3>برند</h3><button type="button" class="clr" data-clr="brand">حذف</button></div><div class="fbox-body scroll">' + brandHtml + '</div></div>' +
      '<div class="fbox"><div class="fbox-head"><h3>سایز</h3><button type="button" class="clr" data-clr="size">حذف</button></div><div class="fbox-body scroll">' + sizeHtml + '</div></div>' +
      '<div class="fbox"><div class="fbox-head"><h3>رنگ</h3><button type="button" class="clr" data-clr="color">حذف</button></div><div class="fbox-body scroll">' + colorHtml + '</div></div>' +
      '<div class="fbox"><div class="fbox-body" style="padding-top:4px">' +
        '<div class="switch-row"><span>فقط کالاهای موجود</span><label class="sw-toggle" id="tg-stock"><input type="checkbox" id="ck-stock"></label></div>' +
        '<div class="switch-row"><span>فقط تخفیف‌دارها</span><label class="sw-toggle" id="tg-sale"><input type="checkbox" id="ck-sale"></label></div>' +
      '</div></div>';
  }

  /* ---------- چیپ‌های فعال ---------- */
  function chips() {
    var out = [];
    if (S.q) out.push(['q', 'جست‌وجو: ' + S.q]);
    if (S.sale && !S.cat) out.push(['sale', 'تخفیف‌دارها']);
    var c = S.cat ? AVZ.catBySlug(S.cat) : null;
    if (c) out.push(['cat', c.name]);
    if (S.sub) out.push(['sub', AVZ.subName(S.cat, S.sub)]);
    if (S.min !== bounds.min || S.max !== bounds.max) out.push(['price', 'قیمت: ' + U.money(S.min) + ' تا ' + U.money(S.max)]);
    S.brands.forEach(function (b) { var bb = AVZ.BRANDS.find(function (x) { return x.slug === b; }); out.push(['brand:' + b, bb ? bb.name : b]); });
    S.sizes.forEach(function (s) { out.push(['size:' + s, 'سایز ' + s]); });
    S.colors.forEach(function (c2) { out.push(['color:' + c2, c2]); });
    if (S.stock) out.push(['stock', 'فقط موجودها']);
    if (!out.length) return '';
    return '<div class="active-chips">' + out.map(function (x) {
      return '<span class="achip">' + U.esc(x[1]) + '<button type="button" data-chip="' + U.esc(x[0]) + '" aria-label="حذف فیلتر">' + ic('x') + '</button></span>';
    }).join('') + '<span class="achip all"><button type="button" data-chip="all" style="color:#fff">حذف همه فیلترها ' + ic('x') + '</button></span></div>';
  }

  /* ---------- رندر ---------- */
  var gridEl, countEl, sortEl, sideEl, moreWrap;

  function render(chipsOnly) {
    var pt = pageTitle();
    document.title = pt.t + ' | آویژه';
    var tEl = U.$('#shop-title'), sEl = U.$('#shop-sub');
    if (tEl) tEl.textContent = pt.t;
    if (sEl) sEl.textContent = pt.s;

    var list = filtered();
    countEl && (countEl.innerHTML = '<b>' + U.faNum(list.length.toLocaleString('en-US')) + '</b> محصول یافت شد');
    var chipEl = U.$('#chips-zone');
    if (chipEl) chipEl.innerHTML = chips();

    if (!chipsOnly) {
      sideEl.innerHTML = buildFilters();
      bindFilters();
    }

    var show = list.slice(0, S.page * PER_PAGE);
    gridEl.innerHTML = show.length ? show.map(cardHtml).join('') :
      '<div style="grid-column:1/-1;text-align:center;padding:48px 20px;background:#fff;border:1px dashed var(--border-strong);border-radius:18px">' +
      '<div style="width:70px;height:70px;border-radius:99px;background:var(--cream);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:var(--rose)">' + ic('search', 'i') + '</div>' +
      '<h3 style="margin-bottom:6px">محصولی با این فیلترها پیدا نشد</h3><p style="font-size:13px;color:var(--ink-soft)">فیلترها را ساده‌تر کنید یا همه را حذف کنید.</p>' +
      '<button class="btn btn-soft" style="margin-top:14px" data-chip="all">حذف همه فیلترها</button></div>';
    gridEl.querySelectorAll('[data-chip="all"]').forEach(function (b) { b.addEventListener('click', clearAll); });

    if (moreWrap) {
      moreWrap.innerHTML = show.length < list.length ?
        '<button class="btn btn-outline btn-lg" id="load-more">نمایش محصولات بیشتر (' + U.faNum(list.length - show.length) + ' مورد باقی مانده)</button>' +
        '<span class="results-count">نمایش ' + U.faNum(show.length) + ' از ' + U.faNum(list.length) + ' محصول</span>' : '';
      var lm = U.$('#load-more');
      lm && lm.addEventListener('click', function () { S.page++; render(true); });
    }
    syncUrl();
  }

  /* ---------- اتصال فیلترها ---------- */
  function bindFilters() {
    sideEl.querySelectorAll('input[name="brand"]').forEach(function (el) {
      el.checked = S.brands.indexOf(el.value) >= 0;
      el.addEventListener('change', function () {
        if (el.checked) S.brands.push(el.value); else S.brands = S.brands.filter(function (x) { return x !== el.value; });
        S.page = 1; render(true);
      });
    });
    sideEl.querySelectorAll('input[name="size"]').forEach(function (el) {
      el.checked = S.sizes.indexOf(el.value) >= 0;
      el.addEventListener('change', function () {
        if (el.checked) S.sizes.push(el.value); else S.sizes = S.sizes.filter(function (x) { return x !== el.value; });
        S.page = 1; render(true);
      });
    });
    sideEl.querySelectorAll('input[name="color"]').forEach(function (el) {
      el.checked = S.colors.indexOf(el.value) >= 0;
      el.addEventListener('change', function () {
        if (el.checked) S.colors.push(el.value); else S.colors = S.colors.filter(function (x) { return x !== el.value; });
        S.page = 1; render(true);
      });
    });
    var st = U.$('#ck-stock'), sl = U.$('#ck-sale');
    if (st) {
      st.checked = S.stock;
      st.addEventListener('change', function () { S.stock = st.checked; S.page = 1; render(true); });
    }
    if (sl) {
      sl.checked = S.sale;
      sl.addEventListener('change', function () { S.sale = sl.checked; S.page = 1; base = scopeBase(); render(); });
    }
    [['#tg-stock', st], ['#tg-sale', sl]].forEach(function (pair) {
      var tg = U.$(pair[0]);
      if (tg && pair[1]) {
        tg.classList.toggle('on', pair[1].checked);
        pair[1].addEventListener('change', function () { tg.classList.toggle('on', pair[1].checked); });
      }
    });

    /* قیمت: رنج دوتایی + اینپوت */
    var rmin = U.$('#rmin'), rmax = U.$('#rmax'), imin = U.$('#pmin'), imax = U.$('#pmax'), fill = U.$('#range-fill');
    function paint() {
      if (!fill) return;
      var l = (S.min - bounds.min) / (bounds.max - bounds.min) * 100;
      var r = (S.max - bounds.min) / (bounds.max - bounds.min) * 100;
      fill.style.insetInlineStart = l + '%';
      fill.style.insetInlineEnd = (100 - r) + '%';
    }
    function applyPrice(min, max, fromRange) {
      S.min = Math.min(min, max); S.max = Math.max(min, max);
      if (imin) imin.value = U.money(S.min);
      if (imax) imax.value = U.money(S.max);
      S.page = 1; paint(); render(true);
      if (!fromRange) { rmin.value = S.min; rmax.value = S.max; }
    }
    if (rmin && rmax) {
      paint();
      rmin.addEventListener('input', function () { applyPrice(+rmin.value, +rmax.value, true); });
      rmax.addEventListener('input', function () { applyPrice(+rmin.value, +rmax.value, true); });
      [imin, imax].forEach(function (el, i) {
        el && el.addEventListener('change', function () {
          var v = +(el.value.replace(/[^\d]/g, '')) || 0;
          if (i === 0) applyPrice(v, S.max); else applyPrice(S.min, v);
        });
      });
    }
    sideEl.querySelectorAll('[data-clr]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.clr;
        if (k === 'price') applyPrice(bounds.min, bounds.max);
        if (k === 'brand') { S.brands = []; }
        if (k === 'size') { S.sizes = []; }
        if (k === 'color') { S.colors = []; }
        S.page = 1; render();
      });
    });
  }

  /* ---------- چیپ‌ها ---------- */
  function clearAll() {
    S.brands = []; S.sizes = []; S.colors = []; S.stock = false;
    S.min = bounds.min; S.max = bounds.max; S.page = 1;
    if (!S.cat && !S.q) S.sale = false;
    base = scopeBase();
    render();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-chip]');
    if (!b) return;
    var k = b.dataset.chip;
    if (k === 'all') return clearAll();
    if (k === 'q') { S.q = ''; }
    else if (k === 'sale') { S.sale = false; base = scopeBase(); }
    else if (k === 'cat') { S.cat = ''; S.sub = ''; base = scopeBase(); }
    else if (k === 'sub') { S.sub = ''; base = scopeBase(); }
    else if (k === 'stock') { S.stock = false; }
    else if (k.indexOf('brand:') === 0) S.brands = S.brands.filter(function (x) { return x !== k.slice(6); });
    else if (k.indexOf('size:') === 0) S.sizes = S.sizes.filter(function (x) { return x !== k.slice(5); });
    else if (k.indexOf('color:') === 0) S.colors = S.colors.filter(function (x) { return x !== k.slice(6); });
    else if (k === 'price') { S.min = bounds.min; S.max = bounds.max; }
    S.page = 1; render();
  });

  /* ---------- مرتب‌سازی ---------- */
  function bindSort() {
    sortEl.addEventListener('change', function () { S.sort = sortEl.value; S.page = 1; render(true); });
    sortEl.value = S.sort;
  }

  /* ---------- دراور فیلتر موبایل ---------- */
  function bindDrawer() {
    var open = U.$('#filter-open'), drawer = U.$('#fdrawer'), bd = U.$('#fdrawer-backdrop');
    if (!open) return;
    open.addEventListener('click', function () {
      drawer.classList.add('open'); bd.classList.add('open');
      U.$('.fdrawer-body').innerHTML = sideEl.innerHTML;
      var fbody = U.$('.fdrawer-body');
      sideEl.querySelectorAll('input,button').forEach(function () {});
      /* اتصال مجدد داخل دراور: ساده — کپی رویدادها با کپی HTML و bind مجدد روی sideEl اصلی */
      bindFilters();
      fbody.querySelectorAll('input').forEach(function (inp) {
        inp.addEventListener('change', function () {
          var twin = sideEl.querySelector('input[name="' + inp.name + '"][value="' + inp.value + '"]');
          if (twin) { twin.checked = inp.checked; twin.dispatchEvent(new Event('change')); }
        });
      });
      fbody.querySelectorAll('[data-clr]').forEach(function (b) {
        b.addEventListener('click', function () { var t = sideEl.querySelector('[data-clr="' + b.dataset.clr + '"]'); t && t.click(); });
      });
    });
    bd.addEventListener('click', function () { drawer.classList.remove('open'); bd.classList.remove('open'); });
    U.$('#fdrawer-apply').addEventListener('click', function () { drawer.classList.remove('open'); bd.classList.remove('open'); });
    U.$('#fdrawer-clear').addEventListener('click', clearAll);
  }

  /* ---------- URL sync ---------- */
  function syncUrl() {
    var p = new URLSearchParams();
    if (S.cat) p.set('cat', S.cat);
    if (S.sub) p.set('sub', S.sub);
    if (S.q) p.set('q', S.q);
    if (S.sale) p.set('sale', '1');
    if (S.sort !== 'new') p.set('sort', S.sort);
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString() : ''));
  }

  /* ---------- راه‌اندازی ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    gridEl = U.$('#shop-grid');
    countEl = U.$('#shop-count');
    sortEl = U.$('#shop-sort');
    sideEl = U.$('#shop-filters');
    moreWrap = U.$('#loadmore-zone');
    if (!gridEl || !sideEl) return;

    /* breadcrumb */
    var bc = U.$('#bc');
    if (bc) {
      var parts = '<a href="index.html">خانه</a><span class="sep">›</span><a href="shop.html">فروشگاه</a>';
      var c = S.cat ? AVZ.catBySlug(S.cat) : null;
      if (c) parts += '<span class="sep">›</span><a href="' + U.lk('category', c.slug) + '">' + U.esc(c.name) + '</a>';
      if (S.sub) parts += '<span class="sep">›</span><span class="cur">' + U.esc(AVZ.subName(S.cat, S.sub)) + '</span>';
      if (S.sale) parts += '<span class="sep">›</span><span class="cur">شگفت‌انگیزها</span>';
      if (S.q) parts += '<span class="sep">›</span><span class="cur">جست‌وجو: ' + U.esc(S.q) + '</span>';
      bc.innerHTML = parts;
    }
    /* توضیح سئوی دسته */
    var se = U.$('#cat-desc');
    if (se) {
      var c2 = S.cat ? AVZ.catBySlug(S.cat) : null;
      se.textContent = c2 ? 'در این بخش بهترین انتخاب‌های ' + c2.name + ' را با جزئیات کامل جنس، سایزبندی و موجودی واقعی می‌بینید. همه محصولات با ضمانت اصالت و امکان ۷ روز مرجوعی ارسال می‌شوند.' : 'آویژه تجربه‌ی خرید پوشاک را دقیق، آرام و مطمئن می‌کند؛ با فیلترهای هوشمند در سریع‌ترین زمان به محصول مناسب خود برسید.';
    }
    bindSort();
    render();
    bindDrawer();
  });
})();
