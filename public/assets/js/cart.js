/* آویژه — سبد خرید */
(function () {
  'use strict';
  var U = window.AVZU, ic = window.icon;

  var listEl = U.$('#cart-list'), sideEl = U.$('#cart-side');

  function money(n) { return U.money(n); }

  function render() {
    var items = U.cart.detail();
    if (!items.length) {
      listEl.style.display = 'none';
      if (sideEl) sideEl.innerHTML = '';
      var empty = U.$('#cart-empty');
      if (empty) {
        empty.classList.remove('hidden');
        empty.innerHTML = '<div class="ic">' + ic('cart') + '</div><h2>سبد خرید شما خالی است</h2>' +
          '<p>هنوز چیزی انتخاب نکرده‌اید؛ از مجموعه‌های جدید آویژه شروع کنید.</p>' +
          '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="shop.html?sort=new">مشاهده تازه‌رسیده‌ها</a><a class="btn btn-ghost" href="shop.html?sale=1">شگفت‌انگیزها</a></div>';
      }
      document.title = 'سبد خرید | آویژه';
      return;
    }
    listEl.style.display = '';
    U.$('#cart-empty').classList.add('hidden');

    listEl.innerHTML = items.map(function (it) {
      return '<article class="citem" data-idx="' + it.idx + '">' +
        '<a href="' + U.lk('product', it.slug) + '"><img src="' + it.img + '" alt="' + U.esc(it.name) + '" width="86" height="110"></a>' +
        '<div><a class="citem-name" href="' + U.lk('product', it.slug) + '">' + U.esc(it.name) + '</a>' +
        '<div class="citem-var"><span>رنگ:</span><span class="var-dot" style="background:' + it.hex + '"></span><span>' + U.esc(it.color) + '</span><span>·</span><span>سایز: ' + U.esc(it.size) + '</span>' +
        (it.max <= 5 ? '<span class="chip chip-soft" style="font-size:10px">تنها ' + U.faNum(it.max) + ' عدد موجود</span>' : '') + '</div>' +
        '<div class="citem-price">' + money(it.unit) + ' تومان × ' + U.faNum(it.qty) + '</div>' +
        '<div class="citem-tools">' +
          '<div class="qty"><button type="button" class="qty-minus" aria-label="کاهش">' + ic('minus') + '</button>' +
          '<input type="number" value="' + it.qty + '" min="1" max="' + Math.max(1, it.max) + '" aria-label="تعداد">' +
          '<button type="button" class="qty-plus" aria-label="افزایش">' + ic('plus') + '</button></div>' +
          '<button type="button" class="citem-remove" data-remove>' + ic('trash') + 'حذف</button>' +
        '</div></div>' +
        '<div class="citem-total">' + money(it.line) + ' <small style="font-weight:500;font-size:10px">تومان</small></div>' +
      '</article>';
    }).join('');

    renderSide();
    U.bindQty(listEl, function (inp) {
      var row = inp.closest('.citem');
      var idx = +row.dataset.idx;
      U.cart.setQty(idx, +inp.value);
    });
    listEl.querySelectorAll('[data-remove]').forEach(function (b) {
      b.addEventListener('click', function () {
        var idx = +b.closest('.citem').dataset.idx;
        U.cart.remove(idx);
        U.toast('محصول از سبد حذف شد', 'info');
        render();
      });
    });
  }

  function renderSide() {
    var t = U.calc(null);
    var c = t.coupon;
    var remain = Math.max(0, AVZ_FREE - t.subtotal);
    var pct = Math.min(100, Math.round(t.subtotal / AVZ_FREE * 100));
    sideEl.innerHTML =
      '<div class="side-box"><h3>خلاصه سفارش</h3>' +
        '<div class="sum-row"><span>جمع کالاها (' + U.faNum(t.items.reduce(function (a, x) { return a + x.qty; }, 0)) + ' عدد)</span><b>' + money(t.subtotal) + '</b></div>' +
        (t.discount ? '<div class="sum-row discount"><span>تخفیف (' + c.code + ')</span><b>−' + money(t.discount) + '</b></div>' : '') +
        '<div class="sum-row"><span>هزینه ارسال (پست پیشتاز)</span><b>' + (t.ship ? money(t.ship) : 'رایگان') + '</b></div>' +
        '<div class="sum-row total"><span>مبلغ قابل پرداخت</span><b>' + money(t.total) + ' <small style="font-weight:500;font-size:11px">تومان</small></b></div>' +
        '<div class="coupon-row"><input type="text" id="coupon-in" placeholder="کد تخفیف (مثلاً WELCOME15)" aria-label="کد تخفیف"><button class="btn btn-soft" id="coupon-btn" type="button">اعمال</button></div>' +
        (c ? '<div class="coupon-applied"><span>' + ic('check') + 'کد «' + c.code + '» اعمال شد: ' + c.data.label + '</span><button id="coupon-del" type="button">حذف</button></div>' : '') +
        (remain > 0 ? '<div class="free-ship-note">' + ic('truck') + '<div>با <b>' + money(remain) + ' تومان</b> خرید بیشتر، ارسال رایگان می‌شود<div class="progress-mini"><i style="width:' + pct + '%"></i></div></div></div>'
          : '<div class="free-ship-note" style="color:var(--success)">' + ic('check') + '<div><b>ارسال این سفارش رایگان است!</b></div></div>') +
        '<a class="btn btn-primary btn-lg btn-block" href="checkout.html" style="margin-top:16px">ادامه فرآیند خرید</a>' +
        '<a class="btn btn-ghost btn-block" href="shop.html" style="margin-top:10px">ادامه خرید</a>' +
      '</div>' +
      '<div class="side-box" style="font-size:12px;color:var(--ink-soft)">' +
        '<div class="ship-box"><div class="row">' + ic('shield') + '<span>پرداخت امن از طریق درگاه بانکی (نمایشی)</span></div>' +
        '<div class="row">' + ic('refresh') + '<span>۷ روز مهلت بازگشت کالا</span></div>' +
        '<div class="row">' + ic('headset') + '<span>پشتیبانی: ۰۲۱-۹۱۰۰۰۲۰۰</span></div></div>' +
      '</div>';

    var apply = function () {
      var code = U.$('#coupon-in').value;
      var r = U.setCoupon(code);
      if (r.ok) { U.toast('کد تخفیف با موفقیت اعمال شد', 'ok'); render(); }
      else U.toast(r.msg, 'err');
    };
    U.$('#coupon-btn').addEventListener('click', apply);
    U.$('#coupon-in').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); apply(); } });
    var del = U.$('#coupon-del');
    del && del.addEventListener('click', function () { U.setCoupon(''); render(); });
  }

  var AVZ_FREE = window.AVZ.FREE_SHIP_MIN;
  render();
  document.addEventListener('avz:cart', render);
})();
