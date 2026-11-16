/* آویژه — صفحات محتوایی: FAQ، تماس، راهنمای سایز، وبلاگ */
(function () {
  'use strict';
  var U = window.AVZU, AVZ = window.AVZ, ic = window.icon;
  var page = document.body.dataset.page;

  /* ---------- FAQ آکاردئونی ---------- */
  if (page === 'faq.html') {
    var wrap = U.$('#faq-list');
    if (!wrap.children.length) wrap.innerHTML = AVZ.FAQS.map(function (f, i) {
      return '<div class="faq-item"><button class="faq-q" type="button" aria-expanded="false"><span>' + U.faNum(i + 1) + '. ' + U.esc(f.q) + '</span><span class="fx">' + ic('plus') + '</span></button>' +
        '<div class="faq-a"><div>' + U.esc(f.a) + '</div></div></div>';
    }).join('');
    wrap.querySelectorAll('.faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.parentElement;
        var a = item.querySelector('.faq-a');
        var open = item.classList.contains('open');
        wrap.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = ''; o.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); });
        if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; q.setAttribute('aria-expanded', 'true'); }
      });
    });
    wrap.querySelector('.faq-item').classList.add('open');
    var fa = wrap.querySelector('.faq-a');
    fa.style.maxHeight = fa.scrollHeight + 'px';
  }

  /* ---------- تماس با ما ---------- */
  if (page === 'contact.html') {
    var cf = U.$('#contact-form');
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!U.validate(cf)) { U.toast('فیلدهای مشخص‌شده را کامل کنید', 'err'); return; }
      var box = U.sget('avz_messages', []);
      box.push({ name: U.$('#ct-name').value, email: U.$('#ct-email').value, subject: U.$('#ct-subject').value, text: U.$('#ct-text').value, at: Date.now() });
      U.sset('avz_messages', box);
      cf.reset();
      U.toast('پیام شما با موفقیت ثبت شد؛ حداکثر تا ۲۴ ساعت پاسخ می‌دهیم', 'ok');
    });
  }

  /* ---------- راهنمای سایز تعاملی ---------- */
  if (page === 'size-guide.html') {
    function draw(kind) {
      var t = AVZ.SIZE_TABLES[kind];
      U.$('#sg-table').innerHTML = '<table class="spec-table"><thead><tr>' + t.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
        t.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    }
    U.$$('.seg button').forEach(function (b) {
      b.addEventListener('click', function () {
        U.$$('.seg button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        draw(b.dataset.seg);
      });
    });
    draw('women');
    /* ماشین‌حساب سایز ساده */
    var sf = U.$('#size-calc');
    sf && sf.addEventListener('submit', function (e) {
      e.preventDefault();
      var w = +U.$('#sc-w').value, h = +U.$('#sc-h').value;
      var kind = U.$('.seg button.on').dataset.seg;
      var t = AVZ.SIZE_TABLES[kind];
      var ranges = kind === 'women' ? { bust: [82, 87, 92, 98, 104], waist: [62, 67, 73, 80, 87] } : { waist: [70, 77, 85, 93, 101], chest: [86, 91, 98, 105, 112] };
      var key1 = kind === 'women' ? 'bust' : 'chest';
      var pick = '؟';
      for (var i = 0; i < 5; i++) {
        if (w <= ranges[key1][i] && h <= ranges.waist[i]) { pick = t.rows[i][0]; break; }
        if (w <= ranges[key1][i] && h > ranges.waist[i]) { pick = t.rows[Math.min(4, i + 1)][0]; break; }
      }
      if (pick === '؟') pick = '2XL';
      U.$('#size-calc-result').innerHTML = '<b style="color:var(--primary-dark)">سایز پیشنهادی: ' + pick + '</b> — بر اساس ' + (kind === 'women' ? 'دور سینه' : 'دور کمر') + ' ' + U.faNum(w) + ' و دور کمر ' + U.faNum(h) + ' سانتی‌متر. اگر بین دو سایز هستید، سایز بزرگ‌تر راحت‌تر خواهد بود.';
    });
  }

  /* ---------- وبلاگ: فهرست ---------- */
  if (page === 'blog.html') {
    var grid = U.$('#blog-grid');
    if (!grid.children.length) grid.innerHTML = AVZ.POSTS.map(function (po) {
      return '<article class="bcard"><a class="bcard-media" href="' + U.lk('blogPost', po.id) + '"><img src="' + (window.AVZ_BASE || '') + po.img + '" alt="' + U.esc(po.title) + '" loading="lazy" width="1000" height="625"><span class="bcard-date">' + po.date + '</span></a>' +
        '<div class="bcard-body"><span class="bcard-cat">' + po.cat + '</span><a class="bcard-title" href="' + U.lk('blogPost', po.id) + '">' + U.esc(po.title) + '</a>' +
        '<p class="bcard-ex">' + U.esc(po.ex) + '</p>' +
        '<div class="bcard-foot"><span>زمان مطالعه: ' + U.faNum(po.read) + ' دقیقه</span><a class="link-more" href="' + U.lk('blogPost', po.id) + '">ادامه مطلب <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg></a></div></div></article>';
    }).join('');
  }

  /* ---------- وبلاگ: جزئیات ---------- */
  if (page === 'blog-post.html') {
    var id = new URLSearchParams(location.search).get('id');
    if (!id) { var m = (location.pathname || '').match(/\/blog\/([a-z0-9-]+)\.html/); if (m) id = m[1]; }
    var po = AVZ.POSTS.find(function (x) { return x.id === id; }) || AVZ.POSTS[0];
    var bpEl = U.$('#bp');
    if (!bpEl || bpEl.children.length) return;
    document.title = po.title + ' | وبلاگ آویژه';
    U.$('#bp').innerHTML = '<h1>' + U.esc(po.title) + '</h1>' +
      '<div class="article-meta"><span>' + ic('tag') + po.cat + '</span><span>' + ic('clock') + U.faNum(po.read) + ' دقیقه مطالعه</span><span>' + po.date + '</span></div>' +
      '<img class="article-img" src="' + (window.AVZ_BASE || '') + po.img + '" alt="' + U.esc(po.title) + '" width="1000" height="530">' +
      po.body.map(function (par) { return '<p>' + U.esc(par) + '</p>'; }).join('') +
      '<div style="margin-top:30px;padding-top:20px;border-top:1px dashed var(--border-strong);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px"><a class="link-more" href="blog.html">بازگشت به وبلاگ <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg></a>' +
      '<a class="link-more" href="shop.html">مشاهده محصولات مرتبط <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg></a></div>';
    /* مطالب مرتبط */
    var others = AVZ.POSTS.filter(function (x) { return x.id !== po.id; }).slice(0, 2);
    U.$('#bp-related').innerHTML = '<div class="sec-head" style="margin-top:10px"><div><h2>مطالب مرتبط</h2></div></div><div class="blog-grid" style="grid-template-columns:repeat(2,1fr)">' +
      others.map(function (o2) {
        return '<article class="bcard"><a class="bcard-media" href="' + U.lk('blogPost', o2.id) + '"><img src="' + (window.AVZ_BASE || '') + o2.img + '" alt="" loading="lazy" width="1000" height="625"></a>' +
          '<div class="bcard-body"><span class="bcard-cat">' + o2.cat + '</span><a class="bcard-title" href="' + U.lk('blogPost', o2.id) + '">' + U.esc(o2.title) + '</a></div></article>';
      }).join('') + '</div>';
  }
})();
