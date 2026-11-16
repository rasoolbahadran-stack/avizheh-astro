/* آویژه — ابزارهای مشترک: ذخیره‌سازی، سبد خرید، علاقه‌مندی، توست، فرمت */
var AVZ_ROOT = typeof window !== 'undefined' ? window : globalThis;
AVZ_ROOT.AVZU = (function () {
  'use strict';
  var AVZ = AVZ_ROOT.AVZ;

  /* ---------- DOM helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- فرمت فارسی ---------- */
  var FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  function faNum(n) { return String(n).replace(/\d/g, function (d) { return FA[+d]; }); }
  function money(n) { return faNum(Math.round(n).toLocaleString('en-US').replace(/,/g, '٬')); }
  function price(n) { return money(n) + ' <small>تومان</small>'; }

  /* ---------- ذخیره‌سازی امن ---------- */
  function sget(k, dflt) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : dflt; }
    catch (e) { return dflt; }
  }
  function sset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function sdel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  /* ---------- رویداد ---------- */
  function emit(name, detail) { document.dispatchEvent(new CustomEvent(name, { detail: detail })); }

  /* ---------- توست ---------- */
  function toast(msg, type) {
    var wrap = $('.toasts');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toasts'; document.body.appendChild(wrap); }
    var t = document.createElement('div');
    t.className = 'toast ' + (type || 'info');
    var ic = type === 'ok' ? 'check' : type === 'err' ? 'alert' : 'info';
    t.innerHTML = window.icon(ic) + '<span>' + esc(msg) + '</span>';
    wrap.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 320); }, 3200);
  }

  /* ---------- سبد خرید ---------- */
  var CART_KEY = 'avz_cart_v1', COUPON_KEY = 'avz_coupon_v1', SHIP_KEY = 'avz_ship_v1';
  var cart = {
    items: sget(CART_KEY, []),
    save: function () { sset(CART_KEY, this.items); emit('avz:cart'); },
    add: function (pid, ci, si, qty) {
      qty = qty || 1;
      var p = AVZ.byId(pid); if (!p) return false;
      var stock = p.variants[ci + '-' + si] || 0;
      if (stock <= 0) { toast('این تنوع موجود نیست', 'err'); return false; }
      var found = null;
      for (var i = 0; i < this.items.length; i++) {
        var it = this.items[i];
        if (it.pid === pid && it.ci === ci && it.si === si) { found = it; break; }
      }
      if (found) {
        if (found.qty + qty > stock) { qty = stock - found.qty; if (qty <= 0) { toast('بیشتر از موجودی انبار نمی‌توانید اضافه کنید', 'err'); return false; } }
        found.qty += qty;
      } else {
        if (qty > stock) qty = stock;
        this.items.push({ pid: pid, ci: ci, si: si, qty: qty });
      }
      this.save(); return true;
    },
    setQty: function (idx, qty) {
      var it = this.items[idx]; if (!it) return;
      var p = AVZ.byId(it.pid); var max = p ? (p.variants[it.ci + '-' + it.si] || 0) : 0;
      qty = Math.max(1, Math.min(qty, Math.max(1, max)));
      it.qty = qty; this.save();
    },
    remove: function (idx) { this.items.splice(idx, 1); this.save(); },
    clear: function () { this.items = []; this.save(); },
    count: function () { return this.items.reduce(function (a, it) { return a + it.qty; }, 0); },
    detail: function () {
      var self = this;
      return this.items.map(function (it, idx) {
        var p = AVZ.byId(it.pid);
        if (!p) return null;
        var color = p.colors[it.ci], size = p.sizes[it.si];
        var unit = p.price;
        return {
          idx: idx, pid: p.id, name: p.name, img: p.images[0], color: color ? color[0] : '', hex: color ? color[1] : '#999',
          size: size, unit: unit, qty: it.qty, line: unit * it.qty, max: p.variants[it.ci + '-' + it.si] || 0, slug: p.id
        };
      }).filter(Boolean);
    }
  };

  /* ---------- کد تخفیف ---------- */
  var coupon = sget(COUPON_KEY, null);
  function setCoupon(code) {
    code = (code || '').trim().toUpperCase();
    if (!code) { coupon = null; sdel(COUPON_KEY); return { ok: true }; }
    var c = AVZ.COUPONS[code];
    if (!c) return { ok: false, msg: 'کد تخفیف نامعتبر است' };
    coupon = code; sset(COUPON_KEY, code);
    return { ok: true, coupon: c };
  }
  function getCoupon() { return coupon && AVZ.COUPONS[coupon] ? { code: coupon, data: AVZ.COUPONS[coupon] } : null; }

  /* ---------- محاسبات سفارش ---------- */
  function calc(methodId) {
    var items = cart.detail();
    var subtotal = items.reduce(function (a, it) { return a + it.line; }, 0);
    var discount = 0, shipFree = false;
    var c = getCoupon();
    if (c && subtotal >= c.data.min) {
      if (c.data.type === 'percent') discount = Math.round(subtotal * c.data.value / 100);
      else if (c.data.type === 'ship') shipFree = true;
    } else if (c && subtotal < c.data.min) {
      coupon = null; sdel(COUPON_KEY);
    }
    var method = AVZ.SHIP_METHODS.find(function (m) { return m.id === methodId; }) || AVZ.SHIP_METHODS[1];
    var ship = 0;
    if (items.length) {
      ship = shipFree ? 0 : (subtotal >= AVZ.FREE_SHIP_MIN ? 0 : method.cost);
    }
    return { items: items, subtotal: subtotal, discount: discount, ship: ship, total: subtotal - discount + ship, method: method, coupon: getCoupon() };
  }

  /* ---------- علاقه‌مندی‌ها ---------- */
  var WISH_KEY = 'avz_wishlist_v1';
  var wish = {
    ids: sget(WISH_KEY, []),
    save: function () { sset(WISH_KEY, this.ids); emit('avz:wish'); },
    has: function (id) { return this.ids.indexOf(id) >= 0; },
    toggle: function (id) {
      var i = this.ids.indexOf(id);
      if (i >= 0) { this.ids.splice(i, 1); this.save(); return false; }
      this.ids.push(id); this.save(); return true;
    }
  };

  /* ---------- حساب کاربری ---------- */
  var USER_KEY = 'avz_user_v1', ADDR_KEY = 'avz_addresses_v1', ORDERS_KEY = 'avz_orders_v1';
  var user = {
    get: function () { return sget(USER_KEY, null); },
    set: function (u) { sset(USER_KEY, u); emit('avz:user'); },
    logout: function () { sdel(USER_KEY); emit('avz:user'); }
  };
  var orders = {
    all: function () { return sget(ORDERS_KEY, []); },
    add: function (o) { var l = sget(ORDERS_KEY, []); l.unshift(o); sset(ORDERS_KEY, l); },
    find: function (code) { return sget(ORDERS_KEY, []).find(function (o) { return o.code === code; }) || null; }
  };
  var addresses = {
    all: function () { return sget(ADDR_KEY, []); },
    save: function (l) { sset(ADDR_KEY, l); },
    add: function (a) { var l = sget(ADDR_KEY, []); a.id = 'a' + Date.now(); if (!l.length) a.def = true; l.push(a); this.save(l); return a; },
    update: function (id, patch) { var l = sget(ADDR_KEY, []); var a = l.find(function (x) { return x.id === id; }); if (a) Object.assign(a, patch); this.save(l); },
    remove: function (id) { var l = sget(ADDR_KEY, []).filter(function (x) { return x.id !== id; }); this.save(l); },
    setDefault: function (id) { var l = sget(ADDR_KEY, []); l.forEach(function (x) { x.def = x.id === id; }); this.save(l); }
  };

  /* ---------- دکمه‌های تعداد ---------- */
  function bindQty(root, onChange) {
    $$('.qty', root).forEach(function (q) {
      var inp = $('input', q);
      $$('.qty-minus', q).forEach(function (b) { b.addEventListener('click', function () { inp.value = Math.max(1, (+inp.value || 1) - 1); if (onChange) onChange(inp); }); });
      $$('.qty-plus', q).forEach(function (b) { b.addEventListener('click', function () { inp.value = (+inp.value || 1) + 1; if (onChange) onChange(inp); }); });
      inp.addEventListener('change', function () { inp.value = Math.max(1, +inp.value || 1); if (onChange) onChange(inp); });
    });
  }

  /* ---------- اعتبارسنجی فرم ---------- */
  function validate(form) {
    var ok = true;
    $$('[required]', form).forEach(function (el) {
      var fld = el.closest('.fld') || el.parentElement;
      var val = (el.value || '').trim();
      var bad = !val;
      if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
      if (!bad && el.type === 'tel') bad = !/^09\d{9}$/.test(val.replace(/\s/g, ''));
      if (!bad && el.dataset.min) bad = val.length < +el.dataset.min;
      fld.classList.toggle('err', bad);
      if (bad) ok = false;
    });
    return ok;
  }

  /* ---------- لایه آدرس‌ها (قابل بازنویسی با window.AVZ_URLS در نسخه‌های دیگر) ---------- */
  function lk(kind, a, b) {
    var o = window.AVZ_URLS;
    if (o && typeof o[kind] === 'function') return o[kind](a, b);
    if (kind === 'product') return 'product.html?id=' + a;
    if (kind === 'category') return 'shop.html?cat=' + a + (b ? '&sub=' + b : '');
    if (kind === 'blogPost') return 'blog-post.html?id=' + a;
    return '#';
  }

  /* ---------- امتیاز ستاره ---------- */
  function stars(r, showNum) {
    var out = '<span class="stars" aria-label="امتیاز ' + r + ' از ۵">';
    for (var i = 1; i <= 5; i++) {
      out += '<svg viewBox="0 0 24 24' + '" class="' + (i <= Math.round(r) ? '' : 'off') + '" fill="currentColor" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }
    out += '</span>';
    if (showNum) out += '<b>' + faNum(r.toFixed(1)) + '</b>';
    return out;
  }

  return { lk: lk, $: $, $$: $$, esc: esc, faNum: faNum, money: money, price: price, sget: sget, sset: sset, sdel: sdel, emit: emit, toast: toast,
    cart: cart, setCoupon: setCoupon, getCoupon: getCoupon, calc: calc, wish: wish, user: user, orders: orders, addresses: addresses,
    bindQty: bindQty, validate: validate, stars: stars };
})();
