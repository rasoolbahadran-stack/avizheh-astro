/* آویژه — حساب کاربری، آدرس‌ها، سفارش‌ها، علاقه‌مندی‌ها */
(function () {
  'use strict';
  var U = window.AVZU, ic = window.icon;
  var page = document.body.dataset.page;

  /* ---------- داده‌های نمونه (یک‌بار) ---------- */
  if (!U.sget('avz_seeded', false)) {
    U.sset('avz_seeded', true);
    U.orders.add({ code: 'AVZ-۸۵۴۲۱۰', date: '۲ آبان ۱۴۰۵', total: 1568000, count: 2, shipName: 'پست پیشتاز', statusIdx: 4,
      items: [{ name: 'بوکسر مردانه پنبه پک ۳ عددی «آرمان»', qty: 1, line: 549000, color: 'سرمه‌ای', size: 'L' }, { name: 'جوراب مردانه پنبه پک ۵ عددی «آرمان»', qty: 1, line: 385000, color: 'مشکی', size: '۴۲–۴۴' }],
      name: 'کاربر نمونه آویژه', phone: '09120000000', address: 'تهران، خیابان ولیعصر، پلاک ۲۱۰' });
    U.orders.add({ code: 'AVZ-۷۷۰۱۳۴', date: '۱۸ مهر ۱۴۰۵', total: 890000, count: 1, shipName: 'پیک اکسپرس تهران', statusIdx: 3,
      items: [{ name: 'پیجامه زنانه ساتن کوتاه «رویا»', qty: 1, line: 890000, color: 'کرم', size: 'M' }],
      name: 'کاربر نمونه آویژه', phone: '09120000000', address: 'تهران، خیابان ولیعصر، پلاک ۲۱۰' });
    U.addresses.add({ title: 'خانه', province: 'تهران', city: 'تهران', address: 'خیابان ولیعصر، نرسیده به پارک‌وی، پلاک ۲۱۰، طبقه ۳', postal: '1968843215', plaque: '۲۱۰', def: true, rec: 'کاربر نمونه' });
    U.addresses.add({ title: 'محل کار', province: 'تهران', city: 'تهران', address: 'خیابان کارگر شمالی، مجتمع دانش، واحد ۱۲', postal: '1591634311', plaque: '۴۵', def: false, rec: 'کاربر نمونه' });
  }

  /* ---------- صفحه علاقه‌مندی‌ها ---------- */
  if (page === 'wishlist.html') { renderWishlist(); return; }

  /* ---------- احراز هویت نمایشی ---------- */
  var wrap = U.$('#auth-wrap'), panel = U.$('#acc-panel');
  var u = U.user.get();

  function authView(mode) {
    var isLogin = mode !== 'reg';
    wrap.innerHTML =
      '<div class="auth-tabs"><button type="button" data-auth="login"' + (isLogin ? ' class="on"' : '') + '>ورود</button>' +
      '<button type="button" data-auth="reg"' + (!isLogin ? ' class="on"' : '') + '>ثبت‌نام</button></div>' +
      (isLogin ?
        '<form id="f-login" novalidate>' +
        '<div class="fld"><label>ایمیل یا شماره موبایل <span class="req">*</span></label><input type="text" required placeholder="demo@avizheh.ir"></div>' +
        '<div class="fld"><label>گذرواژه <span class="req">*</span></label><input type="password" required data-min="4" placeholder="••••••"></div>' +
        '<button class="btn btn-primary btn-block btn-lg" type="submit">ورود به حساب</button>' +
        '<div class="demo-cred">برای تست سریع از حساب نمایشی استفاده کنید: <button type="button" id="demo-fill">ورود با حساب نمونه</button> (demo@avizheh.ir / 123456)</div>' +
        '</form>' :
        '<form id="f-reg" novalidate>' +
        '<div class="fld"><label>نام و نام خانوادگی <span class="req">*</span></label><input type="text" required placeholder="مثلاً سارا کریمی"></div>' +
        '<div class="fld"><label>ایمیل <span class="req">*</span></label><input type="email" required placeholder="you@example.com"></div>' +
        '<div class="fld"><label>شماره موبایل <span class="req">*</span></label><input type="tel" required placeholder="۰۹۱۲۰۰۰۰۰۰۰"></div>' +
        '<div class="fld"><label>گذرواژه <span class="req">*</span></label><input type="password" required data-min="4" placeholder="حداقل ۴ کاراکتر"></div>' +
        '<button class="btn btn-primary btn-block btn-lg" type="submit">ایجاد حساب</button>' +
        '<p style="font-size:11.5px;color:var(--ink-faint);margin-top:12px">این یک احراز هویت نمایشی است؛ اطلاعات فقط در مرورگر شما ذخیره می‌شود و به هیچ سروری ارسال نمی‌گردد.</p>' +
        '</form>');
    wrap.querySelectorAll('[data-auth]').forEach(function (b) {
      b.addEventListener('click', function () { authView(b.dataset.auth); });
    });
    var fl = U.$('#f-login');
    fl && fl.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!U.validate(fl)) return;
      U.user.set({ name: 'کاربر نمونه آویژه', email: 'demo@avizheh.ir', phone: '09120000000' });
      U.toast('خوش آمدید! وارد حساب خود شدید', 'ok');
      setTimeout(function () { location.reload(); }, 600);
    });
    var df = U.$('#demo-fill');
    df && df.addEventListener('click', function () {
      U.user.set({ name: 'کاربر نمونه آویژه', email: 'demo@avizheh.ir', phone: '09120000000' });
      U.toast('ورود نمایشی انجام شد', 'ok');
      setTimeout(function () { location.reload(); }, 500);
    });
    var fr = U.$('#f-reg');
    fr && fr.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!U.validate(fr)) return;
      U.user.set({
        name: U.$('#f-reg input[type=text]').value.trim(),
        email: U.$('#f-reg input[type=email]').value.trim(),
        phone: U.$('#f-reg input[type=tel]').value.trim()
      });
      U.toast('حساب شما ساخته شد؛ خوش آمدید!', 'ok');
      setTimeout(function () { location.reload(); }, 600);
    });
  }

  if (!u) {
    wrap && authView('login');
    if (panel) panel.style.display = 'none';
    var aside = U.$('#acc-side');
    aside && (aside.style.display = 'none');
    return;
  }
  wrap && (wrap.style.display = 'none');

  /* ---------- پنل ---------- */
  var ava = U.$('#acc-ava'); ava && (ava.textContent = u.name.charAt(0));
  var aname = U.$('#acc-name'); aname && (aname.textContent = u.name);
  var amail = U.$('#acc-mail'); amail && (amail.textContent = u.email);

  var menuBtns = U.$$('.acc-menu [data-pane]');
  var panes = U.$$('.acc-pane');

  function openPane(id) {
    menuBtns.forEach(function (b) { b.classList.toggle('on', b.dataset.pane === id); });
    panes.forEach(function (p) { p.classList.toggle('on', p.dataset.pane === id); });
    if (id === 'dash') renderDash();
    if (id === 'orders') renderOrders();
    if (id === 'addrs') renderAddrs();
    if (id === 'wishlist') renderWishlist(U.$('#wl-grid2'), true);
    if (id === 'profile') fillProfile();
  }
  menuBtns.forEach(function (b) { b.addEventListener('click', function () { openPane(b.dataset.pane); }); });
  var lo = U.$('#acc-logout');
  lo && lo.addEventListener('click', function () {
    U.user.logout();
    U.toast('از حساب خود خارج شدید', 'info');
    setTimeout(function () { location.reload(); }, 500);
  });

  /* داشبورد */
  function renderDash() {
    var ords = U.orders.all();
    var st = { count: ords.length, total: ords.reduce(function (a, o) { return a + o.total; }, 0), wish: U.wish.ids.length };
    U.$('#dash-stats').innerHTML =
      '<div class="stat-m"><b>' + U.faNum(st.count) + '</b><span>سفارش ثبت‌شده</span></div>' +
      '<div class="stat-m"><b>' + U.money(st.total) + '</b><span>مجموع خریدها (تومان)</span></div>' +
      '<div class="stat-m"><b>' + U.faNum(st.wish) + '</b><span>محصول علاقه‌مندی</span></div>';
    var last = ords.slice(0, 2).map(function (o) {
      return '<div class="ordrow" data-open="' + o.code + '"><span class="code">' + o.code + '</span><span class="meta">' + o.date + ' · ' + o.shipName + '</span>' +
        '<span class="status-pill ' + (o.statusIdx >= 4 ? 's-done' : 's-proc') + '">' + ['ثبت‌شده', 'پرداخت‌شده', 'آماده‌سازی', 'در تحویل', 'تحویل‌شده'][o.statusIdx] + '</span>' +
        '<span class="total">' + U.money(o.total) + '</span></div>';
    }).join('');
    U.$('#dash-orders').innerHTML = '<h3 style="font-size:14px;margin-bottom:12px">آخرین سفارش‌ها</h3>' + (last || '<p style="font-size:13px;color:var(--ink-soft)">هنوز سفارشی ثبت نکرده‌اید.</p>');
    U.$('#dash-orders').querySelectorAll('[data-open]').forEach(function (r) {
      r.addEventListener('click', function () { openPane('orders'); setTimeout(function () { showOrder(r.dataset.open); }, 60); });
    });
  }

  /* پروفایل */
  function fillProfile() {
    U.$('#pf-name').value = u.name; U.$('#pf-email').value = u.email; U.$('#pf-phone').value = u.phone || '';
  }
  var pf = U.$('#pf-form');
  pf && pf.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!U.validate(pf)) return;
    u.name = U.$('#pf-name').value.trim();
    u.email = U.$('#pf-email').value.trim();
    u.phone = U.$('#pf-phone').value.trim();
    U.user.set(u);
    aname.textContent = u.name;
    U.toast('اطلاعات حساب به‌روزرسانی شد', 'ok');
  });

  /* آدرس‌ها */
  function renderAddrs() {
    var grid = U.$('#addr-grid');
    var list = U.addresses.all();
    grid.innerHTML = list.map(function (a) {
      return '<div class="addr' + (a.def ? ' default' : '') + '">' + (a.def ? '<span class="tag">پیش‌فرض</span>' : '') +
        '<b>' + U.esc(a.title || 'آدرس') + ' — ' + U.esc(a.city) + '</b><p>' + U.esc(a.address) + '، پلاک ' + U.esc(a.plaque || '—') + '</p>' +
        '<p style="margin-top:4px">کدپستی: ' + U.esc(a.postal || '—') + ' · گیرنده: ' + U.esc(a.rec || u.name) + '</p>' +
        '<div class="addr-tools">' +
        (a.def ? '' : '<button type="button" data-def="' + a.id + '">' + ic('check') + 'پیش‌فرض</button>') +
        '<button type="button" data-edit="' + a.id + '">' + ic('edit') + 'ویرایش</button>' +
        '<button type="button" class="del" data-del="' + a.id + '">' + ic('trash') + 'حذف</button></div></div>';
    }).join('') || '<p style="font-size:13px;color:var(--ink-soft)">هنوز آدرسی ثبت نکرده‌اید.</p>';
    grid.querySelectorAll('[data-def]').forEach(function (b) { b.addEventListener('click', function () { U.addresses.setDefault(b.dataset.def); renderAddrs(); U.toast('آدرس پیش‌فرض تغییر کرد', 'ok'); }); });
    grid.querySelectorAll('[data-del]').forEach(function (b) { b.addEventListener('click', function () { U.addresses.remove(b.dataset.del); renderAddrs(); U.toast('آدرس حذف شد', 'info'); }); });
    grid.querySelectorAll('[data-edit]').forEach(function (b) { b.addEventListener('click', function () { var a = U.addresses.all().find(function (x) { return x.id === b.dataset.edit; }); openAddrForm(a); }); });
  }
  function openAddrForm(a) {
    a = a || {};
    var box = U.$('#addr-form');
    box.innerHTML = '<form id="af" style="margin-top:14px">' +
      '<div class="frow"><div class="fld"><label>عنوان</label><input id="af-t" value="' + U.esc(a.title || '') + '" placeholder="خانه / محل کار"></div>' +
      '<div class="fld"><label>نام گیرنده</label><input id="af-r" value="' + U.esc(a.rec || u.name) + '"></div></div>' +
      '<div class="frow"><div class="fld"><label>استان <span class="req">*</span></label><input id="af-p" required value="' + U.esc(a.province || '') + '"></div>' +
      '<div class="fld"><label>شهر <span class="req">*</span></label><input id="af-c" required value="' + U.esc(a.city || '') + '"></div></div>' +
      '<div class="fld"><label>آدرس کامل <span class="req">*</span></label><input id="af-a" required value="' + U.esc(a.address || '') + '"></div>' +
      '<div class="frow"><div class="fld"><label>کد پستی</label><input id="af-po" value="' + U.esc(a.postal || '') + '"></div>' +
      '<div class="fld"><label>پلاک / واحد</label><input id="af-pl" value="' + U.esc(a.plaque || '') + '"></div></div>' +
      '<div style="display:flex;gap:10px"><button class="btn btn-primary" type="submit">ذخیره آدرس</button>' +
      '<button class="btn btn-ghost" type="button" id="af-cancel">انصراف</button></div></form>';
    U.$('#af-cancel').addEventListener('click', function () { box.innerHTML = ''; });
    U.$('#af').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!U.validate(U.$('#af'))) return;
      var patch = { title: U.$('#af-t').value.trim(), rec: U.$('#af-r').value.trim(), province: U.$('#af-p').value.trim(), city: U.$('#af-c').value.trim(), address: U.$('#af-a').value.trim(), postal: U.$('#af-po').value.trim(), plaque: U.$('#af-pl').value.trim() };
      if (a.id) U.addresses.update(a.id, patch); else U.addresses.add(patch);
      box.innerHTML = '';
      renderAddrs();
      U.toast('آدرس ذخیره شد', 'ok');
    });
  }
  U.$('#addr-add').addEventListener('click', function () { openAddrForm(null); });

  /* سفارش‌ها */
  var STEPS = ['ثبت سفارش', 'پرداخت', 'آماده‌سازی', 'تحویل پست', 'تحویل‌شده'];
  function renderOrders() {
    var list = U.orders.all();
    var box = U.$('#orders-list');
    box.innerHTML = list.length ? list.map(function (o) {
      return '<div class="ordrow" data-code="' + o.code + '"><span class="code">' + o.code + '</span><span class="meta">' + o.date + ' · ' + o.shipName + ' · ' + U.faNum(o.count) + ' کالا</span>' +
        '<span class="status-pill ' + (o.statusIdx >= 4 ? 's-done' : 's-proc') + '">' + STEPS[o.statusIdx] + '</span>' +
        '<span class="total">' + U.money(o.total) + ' <small style="font-weight:500">تومان</small></span></div>';
    }).join('') : '<p style="font-size:13px;color:var(--ink-soft)">هنوز سفارشی ثبت نکرده‌اید؛ <a href="shop.html" style="color:var(--primary)">شروع خرید</a></p>';
    box.querySelectorAll('[data-code]').forEach(function (r) { r.addEventListener('click', function () { showOrder(r.dataset.code); }); });
  }
  function showOrder(code) {
    var o = U.orders.find(code);
    var d = U.$('#order-detail');
    if (!o) { d.innerHTML = ''; return; }
    d.classList.remove('hidden');
    d.innerHTML = '<div style="border:1.5px solid var(--primary);border-radius:16px;padding:20px;margin-top:14px;background:#FDF7FA">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><h3 style="font-size:15px">سفارش ' + o.code + '</h3>' +
      '<button class="btn btn-sm btn-ghost" id="od-close">بستن</button></div>' +
      '<div class="mini-items" style="margin-top:12px">' + o.items.map(function (x) {
        return '<div class="mini-item" style="background:#fff"><div class="n">' + U.esc(x.name) + '<div class="v">' + (x.color ? x.color + ' · سایز ' + x.size + ' · ' : '') + U.faNum(x.qty) + ' عدد</div></div><b>' + U.money(x.line) + ' تومان</b></div>';
      }).join('') + '</div>' +
      '<div class="timeline" style="margin:20px 4px 4px"><div class="done-line" style="width:' + (o.statusIdx / 4 * 86) + '%"></div>' +
      STEPS.map(function (s, i) { return '<div class="tl-step ' + (i < o.statusIdx ? 'done' : i === o.statusIdx ? 'cur' : '') + '" style="width:60px"><div class="tl-dot" style="width:30px;height:30px">' + ic(i <= o.statusIdx ? 'check' : 'package') + '</div><span style="font-size:10px">' + s + '</span></div>'; }).join('') + '</div>' +
      '<div class="order-meta"><div class="om" style="background:#fff"><span>تاریخ</span><b>' + o.date + '</b></div><div class="om" style="background:#fff"><span>ارسال</span><b>' + o.shipName + '</b></div>' +
      '<div class="om" style="background:#fff"><span>مبلغ</span><b>' + U.money(o.total) + ' تومان</b></div></div>' +
      '<a class="btn btn-soft btn-block" href="track-order.html" style="margin-top:14px">پیگیری این سفارش</a></div>';
    U.$('#od-close').addEventListener('click', function () { d.classList.add('hidden'); });
    d.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* علاقه‌مندی‌ها */
  function renderWishlist(target, inPane) {
    var grid = target || U.$('#wl-grid');
    if (!grid) return;
    var ids = U.wish.ids;
    if (!ids.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:46px 20px;background:#fff;border:1px dashed var(--border-strong);border-radius:18px">' +
        '<div style="width:70px;height:70px;border-radius:99px;background:var(--cream);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:var(--rose)">' + ic('heart') + '</div>' +
        '<h3 style="margin-bottom:6px">علاقه‌مندی‌ها خالی است</h3><p style="font-size:13px;color:var(--ink-soft)">با زدن ❤ روی محصولات، آن‌ها را اینجا ذخیره کنید.</p>' +
        '<a class="btn btn-primary" style="margin-top:14px" href="shop.html">مشاهده محصولات</a></div>';
      return;
    }
    grid.innerHTML = ids.map(function (id) {
      var p = window.AVZ.byId(id);
      if (!p) return '';
      return '<article class="pcard" data-id="' + p.id + '">' +
        '<a class="pcard-media" href="' + window.AVZU.lk('product', p.id) + '"><img src="' + p.images[0] + '" alt="' + U.esc(p.name) + '" loading="lazy" width="1000" height="1333">' +
        '<button class="pcard-wish on" type="button" data-wish="' + p.id + '" aria-label="حذف از علاقه‌مندی">' + ic('heart') + '</button></a>' +
        '<div class="pcard-body"><a class="pcard-name" href="' + window.AVZU.lk('product', p.id) + '">' + U.esc(p.name) + '</a>' +
        '<div class="pcard-price"><span class="price-cur">' + U.money(p.price) + ' <small style="font-weight:500;font-size:11px">تومان</small></span></div>' +
        '<a class="btn btn-soft btn-sm" href="' + window.AVZU.lk('product', p.id) + '" style="margin-top:8px;align-self:flex-start">مشاهده محصول</a></div></article>';
    }).join('');
    if (inPane) grid.classList.add('wl-grid');
    var emptyBtn = U.$('#wl-clear');
    emptyBtn && (emptyBtn.style.display = '');
    emptyBtn && emptyBtn.addEventListener('click', function () { U.wish.ids = []; U.wish.save(); renderWishlist(grid, inPane); U.toast('علاقه‌مندی‌ها خالی شد', 'info'); });
  }

  openPane('dash');
  document.addEventListener('click', function (e) {
    var w = e.target.closest('[data-wish]');
    if (w) {
      var id = w.dataset.wish;
      var on = U.wish.toggle(id);
      w.classList.toggle('on', on);
      if (!on && page === 'wishlist.html') renderWishlist();
      if (!on && location.pathname.indexOf('account.html') >= 0) renderWishlist(U.$('#wl-grid2'), true);
    }
  });
})();
