/* آویژه — فرآیند ثبت سفارش (سه مرحله + موفقیت) و پیگیری سفارش */
(function () {
  'use strict';
  var U = window.AVZU, AVZ = window.AVZ, ic = window.icon;
  var page = document.body.dataset.page;

  /* ============ پیگیری سفارش ============ */
  if (page === 'track-order.html') {
    var form = U.$('#track-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = U.$('#track-code').value.trim().toUpperCase();
      var out = U.$('#track-result');
      var o = U.orders.find(code) || demoOrder(code);
      if (!o) {
        out.innerHTML = '<div class="form-note" style="background:#FBEDEB;color:var(--danger)">' + ic('alert') + '<span>سفارشی با این کد پیدا نشد. کد نمونه برای تست: <b>AVZ-DEMO01</b></span></div>';
        out.classList.add('track-result');
        return;
      }
      var steps = ['ثبت سفارش', 'پرداخت', 'آماده‌سازی', 'تحویل پست', 'تحویل به شما'];
      var cur = o.statusIdx;
      out.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px"><h3>سفارش <b style="color:var(--primary-dark)">' + o.code + '</b></h3>' +
        '<span class="status-pill ' + (o.statusIdx >= 4 ? 's-done' : 's-proc') + '">' + steps[cur] + '</span></div>' +
        '<div class="timeline"><div class="done-line" style="width:' + (cur / (steps.length - 1) * 86) + '%"></div>' +
        steps.map(function (s, i) {
          return '<div class="tl-step ' + (i < cur ? 'done' : i === cur ? 'cur' : '') + '"><div class="tl-dot">' + ic(i <= cur ? 'check' : 'package') + '</div><span>' + s + '</span></div>';
        }).join('') + '</div>' +
        '<div class="order-meta"><div class="om"><span>تاریخ ثبت</span><b>' + o.date + '</b></div>' +
        '<div class="om"><span>مبلغ کل</span><b>' + U.money(o.total) + ' تومان</b></div>' +
        '<div class="om"><span>تعداد اقلام</span><b>' + U.faNum(o.count) + ' عدد</b></div></div>';
      out.classList.add('track-result');
    });
  }

  function demoOrder(code) {
    if (code !== 'AVZ-DEMO01') return null;
    return { code: 'AVZ-DEMO01', date: '۵ آبان ۱۴۰۵', total: 1234000, count: 3, statusIdx: 2 };
  }

  /* ============ صفحه موفقیت ============ */
  if (page === 'order-success.html') {
    var code = new URLSearchParams(location.search).get('code');
    var last = U.sget('avz_last_order', null);
    var o = (code && U.orders.find(code)) || last;
    if (!o) { location.href = 'index.html'; return; }
    U.$('#ocode').textContent = o.code;
    U.$('#success-date').textContent = o.date;
    U.$('#success-total').textContent = U.money(o.total) + ' تومان';
    U.$('#success-count').textContent = U.faNum(o.count) + ' عدد کالا';
    U.$('#success-ship').textContent = o.shipName;
    var steps = ['ثبت سفارش', 'پرداخت', 'آماده‌سازی', 'تحویل پست', 'تحویل به شما'];
    U.$('#success-timeline').innerHTML = '<div class="timeline"><div class="done-line" style="width:21.5%"></div>' +
      steps.map(function (s, i) { return '<div class="tl-step ' + (i < 1 ? 'done' : i === 1 ? 'cur' : '') + '"><div class="tl-dot">' + ic(i <= 1 ? 'check' : 'package') + '</div><span>' + s + '</span></div>'; }).join('') + '</div>';
  }

  /* ============ چک‌اوت ============ */
  if (page !== 'checkout.html') return;

  var step = 1;
  var data = { method: 'pishtaz' };

  function totals() { return U.calc(data.method); }

  function show(n) {
    step = n;
    U.$$('.ck-step').forEach(function (s, i) {
      s.classList.toggle('done', i + 1 < n);
      s.classList.toggle('cur', i + 1 === n);
      s.querySelector('.step-line') && s.querySelector('.step-line').classList.toggle('done', i < n - 1);
    });
    U.$$('.ck-pane').forEach(function (p) { p.classList.toggle('hidden', p.dataset.pane !== String(n)); });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  /* پرکردن از حساب کاربری/آدرس پیش‌فرض */
  (function prefill() {
    var u = U.user.get();
    if (u) {
      U.$('#ck-name').value = u.name || '';
      U.$('#ck-phone').value = u.phone || '';
      U.$('#ck-email').value = u.email || '';
    }
    var addrs = U.addresses.all();
    var d = addrs.find(function (a) { return a.def; }) || addrs[0];
    if (d) {
      U.$('#ck-province').value = d.province || '';
      U.$('#ck-city').value = d.city || '';
      U.$('#ck-address').value = d.address || '';
      U.$('#ck-postal').value = d.postal || '';
      U.$('#ck-plaque').value = d.plaque || '';
    }
  })();

  /* رندر خلاصه سفارش (سایدبار) */
  function renderSide() {
    var t = totals();
    var items = t.items.map(function (it) {
      return '<div class="mini-item"><img src="' + it.img + '" alt="" width="40" height="50"><div class="n">' + U.esc(it.name) + '<div class="v">' + it.color + ' · سایز ' + it.size + ' · ' + U.faNum(it.qty) + ' عدد</div></div><b>' + U.money(it.line) + '</b></div>';
    }).join('');
    U.$('#ck-items').innerHTML = '<div class="mini-items">' + items + '</div>';
    U.$('#ck-totals').innerHTML =
      '<div class="sum-row"><span>جمع کالاها</span><b>' + U.money(t.subtotal) + ' تومان</b></div>' +
      (t.discount ? '<div class="sum-row discount"><span>تخفیف (' + t.coupon.code + ')</span><b>−' + U.money(t.discount) + ' تومان</b></div>' : '') +
      '<div class="sum-row"><span>هزینه ارسال (' + t.method.name + ')</span><b>' + (t.ship ? U.money(t.ship) + ' تومان' : 'رایگان') + '</b></div>' +
      '<div class="sum-row total"><span>قابل پرداخت</span><b>' + U.money(t.total) + ' تومان</b></div>';
  }

  /* روش ارسال */
  function renderMethods() {
    var t = totals();
    U.$('#ship-methods').innerHTML = AVZ.SHIP_METHODS.map(function (m) {
      var free = t.subtotal >= AVZ.FREE_SHIP_MIN;
      var cost = free ? 0 : m.cost;
      return '<label class="ship-m' + (m.id === data.method ? ' on' : '') + '"><input type="radio" name="ship" value="' + m.id + '"' + (m.id === data.method ? ' checked' : '') + '>' +
        '<span class="radio"></span><div><b>' + m.name + '</b><span>' + m.desc + '</span></div>' +
        '<span class="cost' + (free ? ' free' : '') + '">' + (cost ? U.money(cost) + ' تومان' : 'رایگان') + '</span></label>';
    }).join('');
    U.$$('#ship-methods input').forEach(function (r) {
      r.addEventListener('change', function () { data.method = r.value; renderMethods(); renderSide(); });
    });
  }

  /* گام ۱ → ۲ */
  U.$('#ck-next1').addEventListener('click', function () {
    if (!U.validate(U.$('#pane1'))) { U.toast('اطلاعات مشخص‌شده را کامل و صحیح کنید', 'err'); return; }
    data.name = U.$('#ck-name').value.trim();
    data.phone = U.$('#ck-phone').value.trim();
    data.email = U.$('#ck-email').value.trim();
    show(2); renderSide();
  });

  /* گام ۲ → ۳ */
  U.$('#ck-next2').addEventListener('click', function () {
    if (!U.validate(U.$('#pane2'))) { U.toast('اطلاعات آدرس را کامل کنید', 'err'); return; }
    data.province = U.$('#ck-province').value.trim();
    data.city = U.$('#ck-city').value.trim();
    data.address = U.$('#ck-address').value.trim();
    data.postal = U.$('#ck-postal').value.trim();
    data.plaque = U.$('#ck-plaque').value.trim();
    data.note = U.$('#ck-note').value.trim();
    renderReview();
    show(3);
  });

  function renderReview() {
    var t = totals();
    U.$('#rv-box').innerHTML =
      '<div class="review-box">' +
      '<div class="row"><span class="lbl">گیرنده</span><span class="val">' + U.esc(data.name) + ' — ' + U.esc(data.phone) + '</span></div>' +
      '<div class="row"><span class="lbl">آدرس</span><span class="val">' + U.esc(data.province) + '، ' + U.esc(data.city) + '، ' + U.esc(data.address) + (data.plaque ? '، پلاک ' + U.esc(data.plaque) : '') + ' — کدپستی ' + U.esc(data.postal) + '</span></div>' +
      '<div class="row"><span class="lbl">روش ارسال</span><span class="val">' + t.method.name + '</span></div>' +
      (data.note ? '<div class="row"><span class="lbl">توضیحات</span><span class="val">' + U.esc(data.note) + '</span></div>' : '') +
      '</div>';
    renderSide();
  }

  /* بازگشت‌ها */
  U.$('#ck-back2').addEventListener('click', function () { show(1); });
  U.$('#ck-back3').addEventListener('click', function () { show(2); });

  /* ثبت نهایی */
  U.$('#ck-submit').addEventListener('click', function () {
    if (!U.cart.detail().length) { U.toast('سبد خرید خالی است', 'err'); return; }
    var btn = U.$('#ck-submit');
    btn.disabled = true;
    btn.innerHTML = 'در حال پرداخت (شبیه‌سازی)…';
    setTimeout(function () {
      var t = totals();
      var code = 'AVZ-' + String(Math.floor(100000 + Math.random() * 900000));
      var now = new Date();
      var order = {
        code: code,
        date: U.faNum(now.getDate()) + ' ' + ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'][now.getMonth()] + ' ' + U.faNum(now.getFullYear() - 621),
        total: t.total, count: t.items.reduce(function (a, x) { return a + x.qty; }, 0),
        shipName: t.method.name, statusIdx: 1,
        items: t.items.map(function (x) { return { name: x.name, qty: x.qty, line: x.line, color: x.color, size: x.size }; }),
        name: data.name, phone: data.phone, email: data.email,
        address: [data.province, data.city, data.address, data.plaque, data.postal].filter(Boolean).join('، ')
      };
      U.orders.add(order);
      U.sset('avz_last_order', order);
      U.cart.clear();
      U.setCoupon('');
      location.href = 'order-success.html?code=' + code;
    }, 1400);
  });

  /* اگر سبد خالی: هدایت */
  if (!U.cart.detail().length) {
    var ckSide = U.$('#ck-side');
    if (ckSide) ckSide.style.display = 'none';
    U.$('#ck-main').innerHTML = '<div class="cart-empty"><div class="ic">' + ic('cart') + '</div><h2>سبد خرید خالی است</h2><p>برای ادامه فرآیند خرید، ابتدا محصولی به سبد اضافه کنید.</p><a class="btn btn-primary" href="shop.html">رفتن به فروشگاه</a></div>';
  } else {
    show(1);
    renderMethods();
    renderSide();
  }
})();
