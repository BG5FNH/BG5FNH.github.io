/* 虚拟币章节页 · 折叠与移动端密度控制（与论文等级的 paper.js 同款逻辑）
   - 每个 .vc-sec 变成可展开卡片：手机默认开 1 节，桌面开 2 节
   - 含交互演示的节（滑杆 / 迷你链）强制默认展开
   - 顶部生成章节 chips，点一下展开并滚过去
   - 宽表格包一层横向滚动；长页面有「回到顶部」 */
(function () {
  'use strict';

  var main = document.querySelector('main.page');
  if (!main) return;
  var secs = [].slice.call(main.querySelectorAll('.vc-sec'));
  if (!secs.length) return;

  var narrow = window.matchMedia('(max-width: 640px)').matches;
  var defaultOpen = narrow ? 1 : 2;
  var KEEP = '.hc-wrap, .am-wrap, input[type=range], canvas';

  [].slice.call(main.querySelectorAll('table')).forEach(function (tb) {
    if (tb.parentElement && tb.parentElement.classList.contains('fold-scroll')) return;
    var box = document.createElement('div');
    box.className = 'fold-scroll';
    tb.parentNode.insertBefore(box, tb);
    box.appendChild(tb);
  });

  var toc = document.createElement('div');
  toc.className = 'fold-toc';

  var accs = [];
  var chips = [];

  function setOpen(acc, on) {
    acc.classList.toggle('open', on);
    var h = acc.querySelector('.fold-h');
    if (h) h.setAttribute('aria-expanded', on ? 'true' : 'false');
    var chip = chips[accs.indexOf(acc)];
    if (chip) chip.classList.toggle('on', on);
  }

  function openOne(acc, scroll) {
    setOpen(acc, true);
    if (scroll) {
      var y = acc.getBoundingClientRect().top + window.pageYOffset - 74;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  }

  secs.forEach(function (sec, idx) {
    var h2 = sec.querySelector('h2');
    var headHTML = h2 ? h2.innerHTML : '小节';
    var label = h2 ? h2.textContent.replace(/^\s*\d+\s*/, '').trim() : '小节 ' + (idx + 1);
    var id = sec.id || ('vc-sec-' + (idx + 1));
    var forceOpen = !!sec.querySelector(KEEP);

    var acc = document.createElement('div');
    acc.className = 'fold' + (sec.classList.contains('red') ? ' red' : '');
    acc.id = id;
    acc.dataset.force = forceOpen ? '1' : '';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fold-h';
    btn.innerHTML = '<span class="fold-t">' + headHTML + '</span><span class="fold-chev" aria-hidden="true"></span>';

    var body = document.createElement('div');
    body.className = 'fold-b';
    var box = document.createElement('div');
    box.className = 'fold-in';

    [].slice.call(sec.childNodes).forEach(function (n) {
      if (n === h2) return;
      box.appendChild(n);
    });
    body.appendChild(box);
    acc.appendChild(btn);
    acc.appendChild(body);
    sec.parentNode.insertBefore(acc, sec);
    sec.parentNode.removeChild(sec);
    accs.push(acc);

    btn.addEventListener('click', function () {
      setOpen(acc, !acc.classList.contains('open'));
    });

    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'fold-chip';
    chip.textContent = label;
    chip.addEventListener('click', function () { openOne(acc, true); });
    chips.push(chip);
    toc.appendChild(chip);
  });

  var subtitle = main.querySelector('.page-subtitle');
  if (subtitle && subtitle.parentNode) subtitle.parentNode.insertBefore(toc, subtitle.nextSibling);
  else main.insertBefore(toc, main.firstChild);

  var allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'fold-all';
  allBtn.textContent = '全部展开';
  var wrapAll = document.createElement('div');
  wrapAll.className = 'fold-toc-all';
  wrapAll.appendChild(allBtn);
  toc.parentNode.insertBefore(wrapAll, toc.nextSibling);

  var allOpen = false;
  allBtn.addEventListener('click', function () {
    allOpen = !allOpen;
    accs.forEach(function (a) { setOpen(a, allOpen); });
    allBtn.textContent = allOpen ? '全部收起' : '全部展开';
    allBtn.classList.toggle('on', allOpen);
  });

  accs.forEach(function (a, i) { setOpen(a, a.dataset.force === '1' || i < defaultOpen); });

  function fromHash() {
    var h = (location.hash || '').replace(/^#/, '');
    if (!h) return;
    var acc = accs.find(function (a) { return a.id === h; });
    if (acc) {
      accs.forEach(function (a) { setOpen(a, a === acc || a.dataset.force === '1'); });
      openOne(acc, true);
    }
  }
  fromHash();
  window.addEventListener('hashchange', fromHash);

  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'fold-top';
  topBtn.setAttribute('aria-label', '回到顶部');
  topBtn.textContent = '↑';
  document.body.appendChild(topBtn);
  topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      topBtn.classList.toggle('show', window.pageYOffset > 520);
      ticking = false;
    });
  }, { passive: true });
})();
