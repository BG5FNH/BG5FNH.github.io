/* 论文等级页 · 折叠与移动端密度控制
   1) 每个 .pp-sec 变成可展开卡片，默认只开前 1（手机）/ 2（桌面）节
   2) 顶部生成横向滑动的章节 chips，点一下自动展开并滚过去
   3) 宽表格包一层横向滚动，避免把手机屏幕撑破
   4) 长页面给一个「回到顶部」浮钮 */
(function () {
  'use strict';

  var main = document.querySelector('main.page');
  if (!main) return;

  var secs = [].slice.call(main.querySelectorAll('.pp-sec'));
  if (!secs.length) return;

  var narrow = window.matchMedia('(max-width: 640px)').matches;
  var defaultOpen = narrow ? 1 : 2;

  // —— 宽表格：包一层横向滚动 ——
  [].slice.call(main.querySelectorAll('table')).forEach(function (tb) {
    if (tb.parentElement && tb.parentElement.classList.contains('pp-scroll')) return;
    var box = document.createElement('div');
    box.className = 'pp-scroll';
    tb.parentNode.insertBefore(box, tb);
    box.appendChild(tb);
  });

  // —— 顶部 chips ——
  var toc = document.createElement('div');
  toc.className = 'pp-toc';

  var toggleAll = document.createElement('button');
  toggleAll.type = 'button';
  toggleAll.className = 'pp-all';
  toggleAll.textContent = '全部展开';

  var accs = [];
  var chips = [];

  function setOpen(acc, on) {
    acc.classList.toggle('open', on);
    var h = acc.querySelector('.pp-acc-h');
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
    var inner = h2 ? h2.innerHTML : '小节';
    var label = h2 ? h2.textContent.replace(/^\s*\d+\s*/, '').trim() : '小节 ' + (idx + 1);
    var id = sec.id || ('sec-' + (idx + 1));

    var acc = document.createElement('div');
    acc.className = 'pp-acc' + (sec.classList.contains('red') ? ' red' : '');
    acc.id = id;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pp-acc-h';
    btn.innerHTML = '<span class="pp-acc-t">' + inner + '</span><span class="pp-chev" aria-hidden="true"></span>';

    var body = document.createElement('div');
    body.className = 'pp-acc-b';
    var box = document.createElement('div');
    box.className = 'pp-acc-in';

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
    chip.className = 'pp-chip';
    chip.textContent = label;
    chip.dataset.target = id;
    chip.addEventListener('click', function () { openOne(acc, true); });
    chips.push(chip);
    toc.appendChild(chip);
  });

  var pageTitle = main.querySelector('.page-subtitle');
  if (pageTitle && pageTitle.parentNode) pageTitle.parentNode.insertBefore(toc, pageTitle.nextSibling);
  else main.insertBefore(toc, main.firstChild);

  // 展开/收起全部
  var wrapAll = document.createElement('div');
  wrapAll.className = 'pp-toc-all';
  wrapAll.appendChild(toggleAll);
  toc.parentNode.insertBefore(wrapAll, toc.nextSibling);

  var allOpen = false;
  toggleAll.addEventListener('click', function () {
    allOpen = !allOpen;
    accs.forEach(function (a) { setOpen(a, allOpen); });
    toggleAll.textContent = allOpen ? '全部收起' : '全部展开';
    toggleAll.classList.toggle('on', allOpen);
  });

  // 默认展开
  accs.forEach(function (a, i) { setOpen(a, i < defaultOpen); });

  // 锚点进入
  function fromHash() {
    var h = (location.hash || '').replace(/^#/, '');
    if (!h) return false;
    var acc = accs.find(function (a) { return a.id === h; });
    if (acc) { openOne(acc, true); return true; }
    return false;
  }
  fromHash();
  window.addEventListener('hashchange', fromHash);

  // 回到顶部
  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'pp-top';
  topBtn.setAttribute('aria-label', '回到顶部');
  topBtn.textContent = '↑';
  document.body.appendChild(topBtn);
  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
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
