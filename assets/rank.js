/* BG5FNH 跑分榜（CPU / GPU 资料页共用）
   ------------------------------------------------------------------
   页面只需提供 window.BG5FNH_RANK 与一个容器 <div id="bg5fnhRank"></div>：
   {
     facets: [{ key:'t', label:'档位', values:{ F:'旗舰', H:'高端' } }, ...],
     metrics: [{ key:'b', label:'多核', unit:'Geekbench 6' }],
     tiers:  { F:'#d1495b', H:'#e0b25c' },          // 颜色（可选）
     items:  [{ n:'天玑 9400', v:'MTK', se:'旗舰系列 9000', t:'F',
                m:{ a:2652, b:9100 }, d:{ b:'~9100+' }, note:'可选说明' }]
   }
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var CFG = window.BG5FNH_RANK;
  if (!CFG || !CFG.items || !CFG.items.length) return;

  var root = document.getElementById('bg5fnhRank');
  if (!root) return;

  var FACETS = CFG.facets || [];
  var METRICS = CFG.metrics || [{ key: 'm', label: '分数' }];
  var TIERS = CFG.tiers || {};
  var ITEMS = CFG.items;

  var state = { q: '', metric: CFG.defaultMetric || METRICS[0].key, pick: {} };
  FACETS.forEach(function (f) { state.pick[f.key] = 'all'; });

  var maxVal = 0;
  ITEMS.forEach(function (it) {
    METRICS.forEach(function (m) {
      var v = it.m && it.m[m.key];
      if (typeof v === 'number' && v > maxVal) maxVal = v;
    });
  });

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function label(f, v) {
    var map = f.values || {};
    return map[v] || v;
  }
  function display(it) {
    var m = state.metric;
    if (it.d && it.d[m]) return it.d[m];
    var v = it.m && it.m[m];
    if (typeof v !== 'number') return '—';
    if (v >= 1000) return Math.round(v).toLocaleString('en-US');
    return String(Math.round(v * 10) / 10);
  }
  function value(it) {
    var v = it.m && it.m[state.metric];
    return typeof v === 'number' ? v : -1;
  }
  function hay(it) {
    return [it.n, it.se, it.v, it.k, it.t, it.note].join(' ').toLowerCase();
  }

  function visible() {
    var q = state.q.trim().toLowerCase();
    var list = ITEMS.filter(function (it) {
      if (q && hay(it).indexOf(q) < 0) return false;
      for (var i = 0; i < FACETS.length; i++) {
        var f = FACETS[i];
        var pick = state.pick[f.key];
        if (pick && pick !== 'all' && String(it[f.key]) !== String(pick)) return false;
      }
      return true;
    });
    list.sort(function (x, y) { return value(y) - value(x); });
    return list;
  }

  // ---------- tools ----------
  var tools = document.createElement('div');
  tools.className = 'rk-tools';

  var search = document.createElement('input');
  search.type = 'search';
  search.className = 'rk-search';
  search.autocomplete = 'off';
  search.spellcheck = false;
  search.placeholder = CFG.searchPlaceholder || '搜索型号 / 系列 / 厂商（按 / 聚焦）';
  search.setAttribute('aria-label', '搜索');
  tools.appendChild(search);

  var chipRows = [];
  FACETS.forEach(function (f) {
    var row = document.createElement('div');
    row.className = 'rk-facet';
    var lb = document.createElement('span');
    lb.className = 'rk-facet-label';
    lb.textContent = f.label;
    row.appendChild(lb);

    var values = f.values ? Object.keys(f.values) : [];
    if (!values.length) {
      var uniq = {};
      ITEMS.forEach(function (it) { if (it[f.key] != null) uniq[it[f.key]] = 1; });
      values = Object.keys(uniq);
    }

    function mkChip(val, text) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rk-chip' + (val === 'all' ? ' on' : '');
      b.setAttribute('data-facet', f.key);
      b.setAttribute('data-val', val);
      b.textContent = text;
      row.appendChild(b);
      return b;
    }
    mkChip('all', '全部').insertAdjacentHTML('beforeend', '<span class="rk-n">' + ITEMS.length + '</span>');
    values.forEach(function (v) {
      var n = ITEMS.filter(function (it) { return String(it[f.key]) === String(v); }).length;
      if (!n) return;
      mkChip(v, label(f, v)).insertAdjacentHTML('beforeend', '<span class="rk-n">' + n + '</span>');
    });
    tools.appendChild(row);
    chipRows.push(row);
  });

  var metricRow = document.createElement('div');
  metricRow.className = 'rk-facet';
  if (METRICS.length > 1) {
    var mlb = document.createElement('span');
    mlb.className = 'rk-facet-label';
    mlb.textContent = '排序';
    metricRow.appendChild(mlb);
    var box = document.createElement('span');
    box.className = 'rk-metrics';
    METRICS.forEach(function (m) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rk-metric' + (m.key === state.metric ? ' on' : '');
      b.setAttribute('data-metric', m.key);
      b.textContent = m.label;
      box.appendChild(b);
    });
    metricRow.appendChild(box);
  }
  tools.appendChild(metricRow);

  var countEl = document.createElement('p');
  countEl.className = 'rk-count';
  tools.appendChild(countEl);
  root.appendChild(tools);

  var listEl = document.createElement('div');
  listEl.className = 'rk-list';
  root.appendChild(listEl);

  // ---------- render ----------
  function render() {
    var list = visible();
    var metricLabel = (METRICS.filter(function (m) { return m.key === state.metric; })[0] || {}).label || '';
    var unit = (METRICS.filter(function (m) { return m.key === state.metric; })[0] || {}).unit || '';
    countEl.textContent = '显示 ' + list.length + ' / ' + ITEMS.length + ' 项 · 按' + metricLabel +
      '从高到低' + (unit ? '（' + unit + '）' : '');

    if (!list.length) {
      listEl.innerHTML = '<p class="rk-empty">没有匹配的型号，换个关键词或点「全部」。</p>';
      return;
    }

    var html = '';
    var listMax = 0;
    list.forEach(function (it) { var v = value(it); if (v > listMax) listMax = v; });

    list.forEach(function (it, i) {
      var v = value(it);
      var pct = listMax > 0 && v > 0 ? Math.max(3, Math.round(v / listMax * 100)) : 0;
      var color = TIERS[it.t] || 'rgba(201,168,106,0.5)';
      var subs = [];
      FACETS.forEach(function (f) {
        if (f.key === 't' || f.key === 'se') return;
        if (it[f.key]) subs.push('<b>' + esc(label(f, it[f.key])) + '</b>');
      });
      if (it.se) subs.push(esc(it.se));

      html += '<div class="rk-row' + (it.note ? '' : ' no-note') + '" data-i="' + ITEMS.indexOf(it) + '" style="--rk-color:' + color + '">' +
        '<span class="rk-rank">' + (i + 1) + '</span>' +
        '<div class="rk-main">' +
        '<div class="rk-name">' + esc(it.n) + '</div>' +
        (subs.length ? '<div class="rk-sub">' + subs.join(' · ') + '</div>' : '') +
        '</div>' +
        '<span class="rk-bar"><i style="width:' + pct + '%"></i></span>' +
        '<span class="rk-val">' + esc(display(it)) + '</span>' +
        (it.note ? '<div class="rk-note">' + esc(it.note) + '</div>' : '') +
        '</div>';
    });
    listEl.innerHTML = html;
  }

  tools.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.rk-chip') : null;
    if (chip) {
      var fk = chip.getAttribute('data-facet');
      state.pick[fk] = chip.getAttribute('data-val');
      Array.prototype.forEach.call(chipRows, function (row) {
        if (row.querySelector('[data-facet="' + fk + '"]') !== chip && !row.contains(chip)) return;
      });
      Array.prototype.forEach.call(tools.querySelectorAll('.rk-chip[data-facet="' + fk + '"]'), function (c) {
        c.classList.toggle('on', c === chip);
      });
      render();
      return;
    }
    var mb = e.target.closest ? e.target.closest('.rk-metric') : null;
    if (mb) {
      state.metric = mb.getAttribute('data-metric');
      Array.prototype.forEach.call(tools.querySelectorAll('.rk-metric'), function (b) {
        b.classList.toggle('on', b === mb);
      });
      render();
    }
  });

  listEl.addEventListener('click', function (e) {
    var row = e.target.closest ? e.target.closest('.rk-row') : null;
    if (!row || row.className.indexOf('no-note') >= 0) return;
    row.classList.toggle('open');
  });

  search.addEventListener('input', function () { state.q = search.value; render(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== search) { e.preventDefault(); search.focus(); }
    if (e.key === 'Escape' && document.activeElement === search) { search.value = ''; state.q = ''; render(); search.blur(); }
  });

  render();
})();
