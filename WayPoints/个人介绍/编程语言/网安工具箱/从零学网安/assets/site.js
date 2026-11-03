/* 从零学网安 —— 交互脚本（手写资产；build.py 不再生成它）
   1) 顶栏全文搜索
   2) 术语点一下 → 右侧抽屉解释（不跳页）；浏览器「后退」= 关抽屉 + 回到原滚动位置 */
(function () {
  'use strict';

  /* ---------------- 1. 搜索 ---------------- */
  var q = document.getElementById('q');
  var hits = document.getElementById('hits');
  if (q && hits && window.SEARCH) {
    var show = function () {
      var s = q.value.trim().toLowerCase();
      if (!s) { hits.style.display = 'none'; hits.innerHTML = ''; return; }
      var out = [], seen = {};
      window.SEARCH.forEach(function (it) {
        var blob = (it.t + ' ' + it.h + ' ' + it.x).toLowerCase();
        if (blob.indexOf(s) < 0) return;
        if (seen[it.u]) return;
        seen[it.u] = 1;
        out.push(it);
      });
      hits.innerHTML = out.slice(0, 24).map(function (it) {
        var label = it.h ? (it.h + ' <span class="k">· ' + it.t + '</span>') : it.t;
        return '<a href="' + it.u + '">' + label + '</a>';
      }).join('') || '<a>没有匹配，换个词（试试 sql / 端口 / jwt）</a>';
      hits.style.display = 'block';
    };
    q.addEventListener('input', show);
    q.addEventListener('focus', show);
    document.addEventListener('click', function (e) {
      if (!hits.contains(e.target) && e.target !== q) hits.style.display = 'none';
    });
  }

  /* ---------------- 2. 术语抽屉 ---------------- */
  var TERMS = window.TERMS || {};
  var drawer = null, savedY = 0;

  function buildDrawer() {
    if (drawer) return drawer;
    drawer = document.createElement('div');
    drawer.id = 'drawer';
    drawer.innerHTML =
      '<div class="dw-head"><span class="dw-title">术语</span>' +
      '<button class="dw-x" type="button" title="关闭（Esc）">✕</button></div>' +
      '<div class="dw-body"></div>' +
      '<div class="dw-foot">' +
      '<button class="dw-back" type="button">← 回到原处</button>' +
      '<a class="dw-more" href="#">在术语表里看 →</a>' +
      '</div>';
    document.body.appendChild(drawer);
    drawer.querySelector('.dw-x').addEventListener('click', function () {
      closeDrawer(true);
    });
    drawer.querySelector('.dw-back').addEventListener('click', function () {
      closeDrawer(true);
    });
    return drawer;
  }

  function fillDrawer(info) {
    var body = drawer.querySelector('.dw-body');
    var rows = [
      ['中文', info.k],
      ['English', info.en || '—'],
      ['为什么存在', info.why || '—'],
      ['一句话定义', info.def || '—'],
      ['在哪一章讲', info.ch || '—']
    ];
    body.innerHTML = rows.map(function (r) {
      return '<div class="dw-row"><div class="dw-k">' + r[0] + '</div>' +
             '<div class="dw-v">' + r[1] + '</div></div>';
    }).join('');
    drawer.querySelector('.dw-title').textContent = info.k;
    var more = drawer.querySelector('.dw-more');
    more.href = 'glossary.html#t-' + encodeURIComponent(info.slug);
  }

  function openDrawer(key, anchorEl) {
    if (!TERMS[key]) return;
    buildDrawer();
    fillDrawer(TERMS[key]);
    savedY = window.pageYOffset || document.documentElement.scrollTop || 0;
    drawer.classList.add('on');
    document.body.classList.add('dw-open');
    if (anchorEl) anchorEl.classList.add('gl-on');
    try {
      history.pushState({ gl: key }, '', '#gl-' + key);
    } catch (e) {}
  }

  function hide() {
    if (!drawer) return;
    drawer.classList.remove('on');
    document.body.classList.remove('dw-open');
    var on = document.querySelectorAll('.gl-on');
    for (var i = 0; i < on.length; i++) on[i].classList.remove('gl-on');
    window.scrollTo(0, savedY);
  }

  function closeDrawer(fromUser) {
    if (!drawer || !drawer.classList.contains('on')) return;
    hide();
    if (fromUser && location.hash.indexOf('#gl-') === 0) {
      try { history.back(); } catch (e) {}
    }
  }

  window.addEventListener('popstate', function () {
    if (!drawer) return;
    if (location.hash.indexOf('#gl-') === 0) {
      var key = location.hash.slice(4);
      if (TERMS[key] && !drawer.classList.contains('on')) {
        fillDrawer(TERMS[key]);
        drawer.classList.add('on');
        document.body.classList.add('dw-open');
      }
    } else if (drawer.classList.contains('on')) {
      hide();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer(true);
  });

  document.addEventListener('click', function (e) {
    var t = e.target;
    var a = (t && t.closest) ? t.closest('a.gl') : null;
    if (a) {
      e.preventDefault();
      openDrawer(a.getAttribute('data-k'), a);
      return;
    }
    if (drawer && drawer.classList.contains('on') &&
        !drawer.contains(e.target)) {
      closeDrawer(true);
    }
  });

  if (location.hash.indexOf('#gl-') === 0) {
    var k0 = location.hash.slice(4);
    if (TERMS[k0]) {
      buildDrawer();
      fillDrawer(TERMS[k0]);
      drawer.classList.add('on');
      document.body.classList.add('dw-open');
    }
  }
})();
