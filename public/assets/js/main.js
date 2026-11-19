/* آویژه — هدر، فوتر، منوها، جست‌وجوی زنده، ابزارهای عمومی صفحه */
(function () {
  'use strict';
  var U = window.AVZU, AVZ = window.AVZ, ic = window.icon;

  var HEAD = function () {
    var cats = AVZ.CATS.map(function (c) {
      var subs = c.subs.map(function (s) { return '<a href="shop.html?cat=' + c.slug + '&sub=' + s.slug + '">' + U.esc(s.name) + '</a>'; }).join('');
      return '<div class="mega-col"><h4><a href="shop.html?cat=' + c.slug + '">' + U.esc(c.name) + '</a></h4>' + subs + '</div>';
    }).join('');
    var mnavGroups = AVZ.CATS.map(function (c) {
      var subs = c.subs.map(function (s) { return '<a href="shop.html?cat=' + c.slug + '&sub=' + s.slug + '">' + U.esc(s.name) + '</a>'; }).join('');
      return '<div class="mnav-group"><button type="button">' + U.esc(c.name) + ic('chev-down') + '</button><div class="mnav-sub"><a href="shop.html?cat=' + c.slug + '" style="color:var(--primary);font-weight:700">همه محصولات ' + U.esc(c.short) + '</a>' + subs + '</div></div>';
    }).join('');
    return '' +
      '<div class="topbar"><div class="container">' +
        '<div class="topbar-side"><a href="contact.html">' + ic('headset') + 'پشتیبانی: ۰۲۱-۹۱۰۰۰۲۰۰</a></div>' +
        '<div class="topbar-msgs">' +
          '<div class="topbar-msg on">' + ic('truck') + 'ارسال رایگان برای سفارش‌های بالای ' + U.money(AVZ.FREE_SHIP_MIN) + ' تومان</div>' +
          '<div class="topbar-msg">' + ic('gift') + 'کد تخفیف ۱۵٪ اولین خرید: <b>WELCOME15</b></div>' +
          '<div class="topbar-msg">' + ic('refresh') + '۷ روز ضمانت بازگشت کالا بدون قید و شرط</div>' +
        '</div>' +
        '<div class="topbar-side"><a href="track-order.html">' + ic('package') + 'پیگیری سفارش</a></div>' +
      '</div></div>' +
      '<header class="header"><div class="container">' +
        '<div class="header-mob"><button class="hamburger" id="mnav-open" aria-label="باز کردن منو"><i></i><i></i><i></i></button>' +
          '<a class="logo" href="index.html">' + LOGO() + '</a>' +
          '<div class="header-actions" style="margin-inline-start:auto">' + ACTS() + '</div>' +
        '</div>' +
        '<a class="logo dk" href="index.html" style="margin-inline-end:8px">' + LOGO() + '</a>' +
        '<form class="header-search" id="hsearch" action="shop.html" role="search">' +
          ic('search') + '<input type="search" id="hsearch-in" name="q" placeholder="جست‌وجو در بین محصولات آویژه…" aria-label="جست‌وجوی محصولات" autocomplete="off">' +
          '<div class="search-suggest" id="suggest"></div>' +
        '</form>' +
        '<div class="header-actions dk">' + ACTS() + '</div>' +
        '<div class="header-mob-search"><form action="shop.html" role="search">' + ic('search') +
          '<input type="search" name="q" placeholder="جست‌وجوی محصولات…" aria-label="جست‌وجوی محصولات">' +
        '</form></div>' +
      '</div></header>' +
      '<nav class="mainnav" aria-label="منوی اصلی"><div class="container">' +
        '<div class="nav-item has-mega"><button type="button" class="nav-link" aria-haspopup="true">' + ic('menu') + 'دسته‌بندی محصولات' + ic('chev-down', 'chev') + '</button>' +
          '<div class="mega"><div class="container"><div class="mega-body">' + cats +
            '<a class="mega-promo" href="shop.html?sale=1"><img src="assets/img/products/promo-tights.webp" alt="حراج ویژه آویژه" loading="lazy"><div><span class="chip chip-sale" style="margin-bottom:6px">تا ۵۵٪ تخفیف</span><b>حراج ویژه آویژه</b><span>پیشنهادهای شگفت‌انگیز امروز</span></div></a>' +
          '</div></div>' +
          '<div class="mega-foot"><div class="container">' +
            '<a href="shop.html">' + ic('grid') + 'مشاهده همه محصولات</a>' +
            '<a class="hot" href="shop.html?sale=1">' + ic('flame') + 'پیشنهادهای شگفت‌انگیز</a>' +
            '<a href="size-guide.html">' + ic('ruler') + 'راهنمای سایز</a>' +
            '<a href="track-order.html">' + ic('package') + 'پیگیری سفارش</a>' +
            '<span class="mega-support">' + ic('headset') + 'مشاوره تخصصی سایز: <b>۰۲۱-۹۱۰۰۰۲۰۰</b></span>' +
          '</div></div>' +
        '</div>' +
        '<div class="nav-item"><a class="nav-link" href="index.html">خانه</a></div>' +
        '<div class="nav-item"><a class="nav-link" href="shop.html">فروشگاه</a></div>' +
        '<div class="nav-item sale"><a class="nav-link" href="shop.html?sale=1">شگفت‌انگیزها ' + ic('flame') + '</a></div>' +
        '<div class="nav-item"><a class="nav-link" href="blog.html">وبلاگ</a></div>' +
        '<div class="nav-item"><a class="nav-link" href="about.html">درباره ما</a></div>' +
        '<div class="nav-item"><a class="nav-link" href="contact.html">تماس با ما</a></div>' +
      '</div></nav>' +
      '<div class="drawer-backdrop" id="backdrop"></div>' +
      '<aside class="mnav" id="mnav" aria-label="منوی موبایل">' +
        '<div class="mnav-head"><a class="logo" href="index.html">' + LOGO() + '</a><button class="mnav-close" id="mnav-close" aria-label="بستن منو">' + ic('x') + '</button></div>' +
        '<div class="mnav-body">' + mnavGroups +
          '<div class="mnav-extra">' +
            '<a class="hot" href="shop.html?sale=1">' + ic('flame') + 'پیشنهادهای شگفت‌انگیز</a>' +
            '<a href="wishlist.html">' + ic('heart') + 'علاقه‌مندی‌ها</a>' +
            '<a href="track-order.html">' + ic('package') + 'پیگیری سفارش</a>' +
            '<a href="size-guide.html">' + ic('ruler') + 'راهنمای سایز</a>' +
            '<a href="about.html">' + ic('info') + 'درباره آویژه</a>' +
            '<a href="contact.html">' + ic('headset') + 'تماس و پشتیبانی</a>' +
          '</div>' +
        '</div>' +
        '<div class="mnav-foot">آویژه — تخصصی پوشاک و لباس زیر</div>' +
      '</aside>' +
      '<div class="bottombar"><div class="container">' +
        '<a class="bb-item" href="index.html">' + ic('home') + '<span>خانه</span></a>' +
        '<a class="bb-item" href="shop.html">' + ic('grid') + '<span>فروشگاه</span></a>' +
        '<a class="bb-item" href="cart.html">' + ic('cart') + '<span>سبد</span><b class="badge-count" data-badge="cart">۰</b></a>' +
        '<a class="bb-item" href="account.html">' + ic('user') + '<span>حساب</span></a>' +
      '</div></div>';
  };

  function LOGO() {
    return '<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lgA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E3B5F"/><stop offset="1" stop-color="#C0735A"/></linearGradient></defs>' +
      '<circle cx="24" cy="24" r="22" fill="none" stroke="url(#lgA)" stroke-width="2.4"/>' +
      '<path d="M24 10c5.2 3.4 8.4 8.6 8.4 14.2 0 6.4-3.9 10.6-8.4 13.8-4.5-3.2-8.4-7.4-8.4-13.8C15.6 18.6 18.8 13.4 24 10z" fill="url(#lgA)" opacity=".92"/>' +
      '<path d="M24 15.5c2.9 2.2 4.7 5.3 4.7 8.7 0 3.9-2.2 6.6-4.7 8.6-2.5-2-4.7-4.7-4.7-8.6 0-3.4 1.8-6.5 4.7-8.7z" fill="#FBF7F4" opacity=".9"/></svg>' +
      '<span class="logo-text"><span class="logo-name">آویژه</span><span class="logo-en">AVIZHEH</span></span>';
  }
  function ACTS() {
    return '<a class="hact" href="account.html" aria-label="حساب کاربری">' + ic('user') + '<span class="lbl">حساب</span></a>' +
      '<a class="hact" href="wishlist.html" aria-label="علاقه‌مندی‌ها">' + ic('heart') + '<span class="lbl">علاقه‌مندی</span><b class="badge-count" data-badge="wish">۰</b></a>' +
      '<a class="hact" href="cart.html" aria-label="سبد خرید">' + ic('cart') + '<span class="lbl">سبد</span><b class="badge-count" data-badge="cart">۰</b></a>';
  }

  var FOOT = function () {
    var c1 = AVZ.CATS.slice(0, 4).map(function (c) { return '<li><a href="shop.html?cat=' + c.slug + '">' + U.esc(c.name) + '</a></li>'; }).join('');
    var c2 = AVZ.CATS.slice(4).map(function (c) { return '<li><a href="shop.html?cat=' + c.slug + '">' + U.esc(c.name) + '</a></li>'; }).join('');
    return '<footer class="footer">' +
      '<div class="container footer-top">' +
        '<div class="fcol f-about">' +
          '<a class="logo" href="index.html">' + LOGO() + '</a>' +
          '<p style="margin-top:14px">آویژه، مرجع تخصصی پوشاک، لباس زیر و لباس راحتی؛ با انتخابی دقیق از محصولات باکیفیت، سایزبندی دقیق و تجربه‌ی خریدی که آرامش‌بخش است — نه پرتنش.</p>' +
          '<div class="f-socials"><a href="#" aria-label="اینستاگرام" onclick="return false">' + ic('instagram') + '</a><a href="#" aria-label="تلگرام" onclick="return false">' + ic('send') + '</a><a href="#" aria-label="واتساپ" onclick="return false">' + ic('phone') + '</a></div>' +
        '</div>' +
        '<div class="fcol"><h4>دسته‌بندی‌ها</h4><ul>' + c1 + '</ul></div>' +
        '<div class="fcol"><h4>دسته‌بندی‌ها</h4><ul>' + c2 + '</ul>' +
          '<h4 style="margin-top:20px">خدمات مشتریان</h4><ul>' +
            '<li><a href="faq.html">سؤالات متداول</a></li><li><a href="shipping.html">شرایط ارسال</a></li><li><a href="returns.html">مرجوعی و تعویض</a></li><li><a href="size-guide.html">راهنمای سایز</a></li>' +
          '</ul></div>' +
        '<div class="fcol"><h4>اطلاعات تماس</h4><ul class="f-contact">' +
          '<li>' + ic('pin') + '<span>تهران، خیابان ولیعصر، نرسیده به پارک‌وی، پلاک ۲۱۰، طبقه ۳</span></li>' +
          '<li>' + ic('phone') + '<span>۰۲۱-۹۱۰۰۰۲۰۰ | پشتیبانی هر روز ۹ تا ۲۱</span></li>' +
          '<li>' + ic('mail') + '<span>support@avizheh.ir</span></li>' +
        '</ul>' +
        '<div class="f-trust">' +
          '<span class="trust-badge">' + ic('shield') + 'نماد اعتماد (نمایشی)</span>' +
          '<span class="trust-badge">' + ic('card') + 'پرداخت امن (نمایشی)</span>' +
        '</div></div>' +
      '</div>' +
      '<div class="footer-bar"><div class="container">' +
        '<span>© ' + U.faNum(1405) + ' فروشگاه آویژه — تمام حقوق محفوظ است. این سایت یک نمونه‌کار نمایشی است.</span>' +
        '<span class="credit">' + ic('heart') + 'طراحی و توسعه توسط <a href="https://cdanesh.ir/" target="_blank" rel="noopener">کافه دانش</a></span>' +
      '</div></div></footer>';
  };

  /* ---------- نصب ---------- */
  function mount() {
    var h = document.getElementById('app-header');
    var f = document.getElementById('app-footer');
    var staticChrome = !!document.querySelector('.header');
    if (h && !staticChrome) h.innerHTML = HEAD();
    if (f && !document.querySelector('.footer')) f.innerHTML = FOOT();

    /* نوار پیام چرخشی */
    var msgs = U.$$('.topbar-msg');
    if (msgs.length > 1) {
      var mi = 0;
      setInterval(function () {
        msgs[mi].classList.remove('on');
        mi = (mi + 1) % msgs.length;
        msgs[mi].classList.add('on');
      }, 4500);
    }

    /* هدر اسکرول */
    var hdr = U.$('.header');
    window.addEventListener('scroll', function () { hdr && hdr.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });

    /* منوی موبایل */
    var mnav = U.$('#mnav'), bd = U.$('#backdrop');
    function mnavState(open) {
      if (!mnav) return;
      mnav.classList.toggle('open', open);
      bd && bd.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    var ob = U.$('#mnav-open'), cb = U.$('#mnav-close');
    ob && ob.addEventListener('click', function () { mnavState(true); });
    cb && cb.addEventListener('click', function () { mnavState(false); });
    bd && bd.addEventListener('click', function () { mnavState(false); });
    U.$$('.mnav-group>button', document).forEach(function (b) {
      b.addEventListener('click', function () { b.parentElement.classList.toggle('open'); });
    });

    /* جست‌وجوی زنده */
    var form = U.$('#hsearch'), inp = U.$('#hsearch-in'), sug = U.$('#suggest');
    if (inp && sug) {
      var idx = -1, list = [];
      function render(q) {
        q = q.trim().toLowerCase();
        if (q.length < 2) { sug.classList.remove('open'); sug.innerHTML = ''; return; }
        list = AVZ.PRODUCTS.filter(function (p) {
          var hay = (p.name + ' ' + p.brandName + ' ' + p.catName + ' ' + (p.specs['جنس'] || '')).toLowerCase();
          return hay.indexOf(q) >= 0;
        }).slice(0, 6);
        var html = list.length ? list.map(function (p, i) {
          return '<a class="sg-item' + (i === idx ? ' active' : '') + '" href="' + U.lk('product', p.id) + '">' +
            '<img src="' + p.images[0] + '" alt="" loading="lazy" width="44" height="56">' +
            '<div><div class="sg-name">' + U.esc(p.name) + '</div><div class="sg-meta">' + U.esc(p.catName) + '</div></div>' +
            '<span class="sg-price">' + U.money(p.price) + ' تومان</span></a>';
        }).join('') : '<div class="sg-empty">نتیجه‌ای یافت نشد؛ «shop.html» را برای جست‌وجوی کامل ببینید.</div>';
        sug.innerHTML = html;
        sug.classList.add('open');
      }
      inp.addEventListener('input', function () { idx = -1; render(inp.value); });
      inp.addEventListener('focus', function () { if (inp.value.trim().length >= 2) render(inp.value); });
      inp.addEventListener('keydown', function (e) {
        if (!sug.classList.contains('open')) return;
        if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, list.length - 1); render(inp.value); e.preventDefault(); }
        else if (e.key === 'ArrowUp') { idx = Math.max(idx - 1, 0); render(inp.value); e.preventDefault(); }
        else if (e.key === 'Enter' && idx >= 0 && list[idx]) { location.href = U.lk('product', list[idx].id); e.preventDefault(); }
        else if (e.key === 'Escape') { sug.classList.remove('open'); }
      });
      document.addEventListener('click', function (e) { if (!form.contains(e.target)) sug.classList.remove('open'); });
    }

    /* بج‌ها */
    function badges() {
      var c = U.$('[data-badge="cart"]'), w = U.$('[data-badge="wish"]');
      if (c) { c.textContent = U.faNum(U.cart.count()); c.style.display = U.cart.count() ? 'flex' : 'none'; }
      if (w) { w.textContent = U.faNum(U.wish.ids.length); w.style.display = U.wish.ids.length ? 'flex' : 'none'; }
    }
    document.addEventListener('avz:cart', function (e) {
      badges();
      var c = U.$('[data-badge="cart"]');
      if (c) { c.classList.add('bump'); setTimeout(function () { c.classList.remove('bump'); }, 450); }
    });
    document.addEventListener('avz:wish', badges);
    badges();

    /* بروزرسانی به‌صورت سراسری در دسترس */
    window.AVZU.badges = badges;

    /* لینک فعال فعلی */
    var page = document.body.dataset.page;
    U.$$('.mainnav a, .bottombar a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (page && href.indexOf(page) === 0) a.classList.add('active');
    });

    /* فرم‌های خبرنامه */
    U.$$('.nl-form, .footer-nl').forEach(function (f) {
      f && f.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (f.querySelector('input[type="email"]') || {}).value || '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { U.toast('لطفاً یک ایمیل معتبر وارد کنید', 'err'); return; }
        f.reset();
        U.toast('خبرنامه در این نسخه نمایشی غیرفعال است؛ اطلاعاتی ذخیره نمی‌شود', 'info');
      });
    });

    /* انیمیشن ورود سکشن‌ها */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { threshold: .08 });
      U.$$('.rvl').forEach(function (el) { io.observe(el); });
    } else { U.$$('.rvl').forEach(function (el) { el.classList.add('in'); }); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
