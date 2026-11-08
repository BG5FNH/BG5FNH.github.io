/* 概念卡片里的小动图：每个知识光点一个，进入视口才初始化，切走暂停。
   用法：<div class="ml-demo" data-demo="bars" data-args='{"h":[0.2,0.8]}'></div>
   所有绘制都是 canvas 2D，无外部依赖。 */
(function () {
  'use strict';

  var PALETTE = {
    gold: '#e6cf9a', blue: '#7fd4ef', pink: '#f4a6c0', mint: '#9be7c4',
    dim: 'rgba(255,255,255,.14)', text: 'rgba(191,232,246,.78)'
  };

  function bg(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(16,26,36,.85)');
    g.addColorStop(1, 'rgba(6,10,16,.92)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(127,212,239,.08)';
    ctx.lineWidth = 1;
    for (var x = 0; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (var y = 0; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  }

  function label(ctx, text, x, y, color, size) {
    ctx.fillStyle = color || PALETTE.text;
    ctx.font = (size || 10) + 'px system-ui, sans-serif';
    ctx.fillText(text, x, y);
  }

  // ---------------- 渲染器 ----------------
  var DRAW = {};

  // 柱状：向目标高度靠拢，带一点呼吸
  DRAW.bars = function (ctx, w, h, t, a) {
    var hs = a.h || [0.3, 0.7, 0.5, 0.9, 0.4];
    var n = hs.length, gap = 4;
    var bw = (w - 24 - gap * (n - 1)) / n;
    for (var i = 0; i < n; i++) {
      var v = hs[i] * (0.72 + 0.28 * Math.sin(t * 0.002 + i * 0.9));
      var bh = Math.max(2, v * (h - 30));
      var x = 12 + i * (bw + gap);
      var g = ctx.createLinearGradient(0, h - 12 - bh, 0, h - 12);
      g.addColorStop(0, a.color || PALETTE.gold);
      g.addColorStop(1, 'rgba(127,212,239,.25)');
      ctx.fillStyle = g;
      ctx.fillRect(x, h - 12 - bh, bw, bh);
    }
    label(ctx, a.caption || '', 12, 14);
  };

  // 曲线：函数 + 移动的标记点
  DRAW.curve = function (ctx, w, h, t, a) {
    var f = {
      relu: function (x) { return Math.max(0, x); },
      gelu: function (x) { return 0.5 * x * (1 + Math.tanh(1.128 * (x + 0.044715 * x * x * x))); },
      sigmoid: function (x) { return 1 / (1 + Math.exp(-x)); },
      tanh: Math.tanh,
      cosine: function (x) { return 0.5 + 0.5 * Math.cos(Math.PI * (x + 1) / 2); },
      exp: function (x) { return Math.exp(-3 * (x + 1) / 2); },
      ce: function (x) { return -Math.log(Math.max(0.02, 0.5 + 0.45 * Math.sin(x * 2))); },
      warmup: function (x) { var u = (x + 1) / 2; return u < 0.2 ? u / 0.2 : 0.55 + 0.45 * Math.cos((u - 0.2) * 3.6); }
    }[a.fn || 'relu'];
    var x0 = 16, x1 = w - 16, y0 = h - 18, y1 = 14;
    ctx.beginPath();
    for (var i = 0; i <= 120; i++) {
      var xv = -1 + 2 * i / 120;
      var yv = f(xv);
      var px = x0 + (x1 - x0) * i / 120;
      var py = y0 - (y0 - y1) * Math.max(0, Math.min(1, yv / 1.6));
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.strokeStyle = a.color || PALETTE.blue;
    ctx.lineWidth = 2; ctx.stroke();
    var k = ((t * 0.0006) % 1);
    var mx = x0 + (x1 - x0) * k;
    var my = y0 - (y0 - y1) * Math.max(0, Math.min(1, f(-1 + 2 * k) / 1.6));
    ctx.beginPath(); ctx.arc(mx, my, 4, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.gold; ctx.fill();
    label(ctx, a.caption || '', 12, 13);
  };

  // 矩阵：行列扫光
  DRAW.matrix = function (ctx, w, h, t, a) {
    var n = a.n || 6;
    // 铺满整块画布：格子拉成长方形，避免中间一个小方块、两边全空
    var cw = (w - 24) / n, ch = (h - 30) / n;
    var ox = 12, oy = 18;
    var sweep = Math.floor((t / 420) % n);
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        var v = 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + j * 2.3 + (a.seed || 0)));
        ctx.fillStyle = 'rgba(244,166,192,' + (i === sweep ? 0.15 + 0.75 * v : 0.1 + 0.45 * v) + ')';
        ctx.fillRect(ox + j * cw, oy + i * ch, cw - 1, ch - 1);
      }
    }
    label(ctx, a.caption || '', 12, 13);
  };

  // 流水线：方块 + 行进的光点
  DRAW.flow = function (ctx, w, h, t, a) {
    var items = a.items || ['输入', '层', '输出'];
    var n = items.length, pad = 12;
    var bw = (w - pad * 2 - 8 * (n - 1)) / n;
    var bh = 34, by = (h - bh) / 2 + 4;
    var step = Math.floor((t / 700) % n);
    for (var i = 0; i < n; i++) {
      var x = pad + i * (bw + 8);
      var on = i <= step;
      ctx.fillStyle = on ? 'rgba(127,212,239,.22)' : 'rgba(255,255,255,.05)';
      ctx.fillRect(x, by, bw, bh);
      ctx.strokeStyle = on ? 'rgba(127,212,239,.7)' : 'rgba(255,255,255,.12)';
      ctx.strokeRect(x, by, bw, bh);
      ctx.fillStyle = on ? '#cdeefc' : 'rgba(200,220,230,.45)';
      ctx.font = '10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(items[i], x + bw / 2, by + bh / 2 + 3);
      ctx.textAlign = 'left';
      if (i < n - 1) {
        ctx.strokeStyle = 'rgba(127,212,239,.3)';
        ctx.beginPath(); ctx.moveTo(x + bw + 1, by + bh / 2); ctx.lineTo(x + bw + 7, by + bh / 2); ctx.stroke();
      }
    }
    var dotX = pad + step * (bw + 8) + bw / 2;
    ctx.beginPath(); ctx.arc(dotX, by - 9, 3, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.gold; ctx.fill();
    label(ctx, a.caption || '', 12, 13);
  };

  // 堆叠层：自下而上点亮
  DRAW.stack = function (ctx, w, h, t, a) {
    var n = a.n || 4;
    var pad = 14, gap = 6;
    var bw = (w - pad * 2 - gap * (n - 1)) / n;
    var lit = Math.floor((t / 520) % (n + 2));
    for (var i = 0; i < n; i++) {
      var bh = (h - 34) * (0.35 + 0.5 * ((i + 1) / n));
      var x = pad + i * (bw + gap), y = h - 14 - bh;
      var on = i <= lit;
      ctx.fillStyle = on ? 'rgba(155,231,196,.28)' : 'rgba(255,255,255,.05)';
      ctx.fillRect(x, y, bw, bh);
      ctx.strokeStyle = on ? 'rgba(155,231,196,.7)' : 'rgba(255,255,255,.1)';
      ctx.strokeRect(x, y, bw, bh);
    }
    label(ctx, a.caption || '', 12, 13);
  };

  // 词元：掩码 / 下一个词 / 偏好
  DRAW.tokens = function (ctx, w, h, t, a) {
    var words = a.words || ['我', '们', '在', '读', '?'];
    var mode = a.mode || 'mask';
    var n = words.length;
    var pad = 12, gap = 6;
    var bw = Math.min(52, (w - pad * 2 - gap * (n - 1)) / n);
    var total = n * bw + (n - 1) * gap;
    var x0 = (w - total) / 2, y = h / 2 - 12;
    var hi = Math.floor((t / 620) % n);
    for (var i = 0; i < n; i++) {
      var x = x0 + i * (bw + gap);
      var masked = (mode === 'mask' && i === hi);
      ctx.fillStyle = masked ? 'rgba(244,166,192,.28)' : 'rgba(127,212,239,.12)';
      ctx.fillRect(x, y, bw, 24);
      ctx.strokeStyle = masked ? 'rgba(244,166,192,.8)' : 'rgba(127,212,239,.35)';
      ctx.strokeRect(x, y, bw, 24);
      ctx.fillStyle = masked ? '#ffe4ef' : '#cdeefc';
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(masked ? '?' : words[i], x + bw / 2, y + 16);
      ctx.textAlign = 'left';
    }
    label(ctx, a.caption || '', 12, 13);
  };

  // 网格：切 patch / 滑窗 / 增强
  DRAW.grid = function (ctx, w, h, t, a) {
    var n = a.n || 8;
    var size = Math.min(w - 24, h - 24);
    var cell = size / n, ox = (w - size) / 2, oy = 14;
    var k = a.win || 2;
    var maxPos = n - k;
    var pos = Math.floor((t / 260) % (maxPos + 1));
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        var v = 0.2 + 0.6 * Math.abs(Math.sin(i * 2.1 + j * 1.3 + (a.seed || 0)));
        var inWin = (i >= pos && i < pos + k && j >= pos && j < pos + k);
        ctx.fillStyle = inWin ? 'rgba(155,231,196,.75)' : 'rgba(127,212,239,' + (0.08 + 0.3 * v) + ')';
        ctx.fillRect(ox + j * cw, oy + i * ch, cw - 1, ch - 1);
      }
    }
    label(ctx, a.caption || '', 12, 12);
  };

  // 双塔：左右两列 + 中间相似度
  DRAW.tower = function (ctx, w, h, t, a) {
    var bw = 46, bh = 18, gap = 6;
    var left = a.left || ['图像'], right = a.right || ['文本'];
    function column(items, x) {
      for (var i = 0; i < items.length; i++) {
        var y = h / 2 - (items.length * (bh + gap)) / 2 + i * (bh + gap);
        ctx.fillStyle = 'rgba(127,212,239,.16)';
        ctx.fillRect(x, y, bw, bh);
        ctx.strokeStyle = 'rgba(127,212,239,.45)';
        ctx.strokeRect(x, y, bw, bh);
        ctx.fillStyle = '#cdeefc'; ctx.font = '9px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(items[i], x + bw / 2, y + 12);
        ctx.textAlign = 'left';
      }
    }
    column(left, 24);
    column(right, w - 24 - bw);
    var p = 0.5 + 0.5 * Math.sin(t * 0.0015);
    ctx.strokeStyle = 'rgba(244,166,192,' + (0.25 + 0.5 * p) + ')';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(24 + bw, h / 2); ctx.lineTo(w - 24 - bw, h / 2); ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, a.caption || '', 12, 12);
  };

  // 点云：二维嵌入
  DRAW.points = function (ctx, w, h, t, a) {
    var n = a.n || 26;
    var pad = 18;
    for (var i = 0; i < n; i++) {
      var seed = i * 12.9898;
      var bx = (Math.sin(seed) * 0.5 + 0.5), by = (Math.cos(seed * 1.7) * 0.5 + 0.5);
      var wobble = 0.03 * Math.sin(t * 0.001 + i);
      var x = pad + (bx + wobble) * (w - pad * 2);
      var y = pad + (by + wobble * 0.6) * (h - pad * 2);
      var cluster = i % (a.clusters || 3);
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = [PALETTE.blue, PALETTE.pink, PALETTE.mint][cluster % 3];
      ctx.globalAlpha = 0.75; ctx.fill(); ctx.globalAlpha = 1;
    }
    label(ctx, a.caption || '', 12, 12);
  };

  // 图：节点 + 边，信号沿边走
  DRAW.graph = function (ctx, w, h, t, a) {
    var n = a.n || 5;
    var cx = w / 2, cy = h / 2 + 4, r = Math.min(w, h) * 0.3;
    var pts = [];
    for (var i = 0; i < n; i++) {
      var ang = -Math.PI / 2 + i * 2 * Math.PI / n;
      pts.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r]);
    }
    for (var i2 = 0; i2 < n; i2++) {
      var p2 = pts[(i2 + 1) % n], q2 = pts[i2];
      ctx.strokeStyle = 'rgba(127,212,239,.28)';
      ctx.beginPath(); ctx.moveTo(q2[0], q2[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
    }
    var step = Math.floor((t / 500) % n);
    for (var j = 0; j < n; j++) {
      ctx.beginPath();
      ctx.arc(pts[j][0], pts[j][1], j === step ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = j === step ? PALETTE.gold : 'rgba(127,212,239,.65)';
      ctx.fill();
    }
    label(ctx, a.caption || '', 12, 12);
  };

  // 两条衰减曲线对比
  DRAW.decay = function (ctx, w, h, t, a) {
    var x0 = 18, x1 = w - 18, y0 = h - 16, y1 = 16;
    function draw(fn, color) {
      ctx.beginPath();
      for (var i = 0; i <= 100; i++) {
        var u = i / 100;
        var y = y0 - (y0 - y1) * Math.max(0, Math.min(1, fn(u)));
        var x = x0 + (x1 - x0) * u;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    }
    var k = a.k || 1;
    draw(function (u) { return Math.exp(-3 * u * k); }, PALETTE.blue);
    draw(function (u) { return Math.exp(-1.1 * u * k); }, PALETTE.pink);
    var u2 = (t * 0.0004) % 1;
    ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * u2, y0 - (y0 - y1) * Math.exp(-3 * u2 * k), 3.5, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.gold; ctx.fill();
    label(ctx, a.caption || '', 12, 12);
  };

  // 两条分布对比
  DRAW.compare = function (ctx, w, h, t, a) {
    var n = 24, pad = 14;
    var bw = (w - pad * 2) / n;
    for (var i = 0; i < n; i++) {
      var u = i / (n - 1);
      var train = Math.exp(-Math.pow((u - 0.32) / 0.16, 2));
      var test = Math.exp(-Math.pow((u - (a.shift || 0.62)) / 0.14, 2));
      ctx.fillStyle = 'rgba(127,212,239,.55)';
      ctx.fillRect(pad + i * bw, h - 14 - train * (h - 30), bw - 1, train * (h - 30));
      ctx.fillStyle = 'rgba(244,166,192,.55)';
      ctx.fillRect(pad + i * bw, h - 14 - test * (h - 30), bw - 1, test * (h - 30));
    }
    label(ctx, a.caption || '', 12, 12);
  };

  // ---------------- 挂载 ----------------
  function mount(box) {
    if (box.__mounted) return;
    box.__mounted = true;
    var type = box.getAttribute('data-demo');
    var key = box.getAttribute('data-key') || type;
    var args = {};
    try { args = JSON.parse(box.getAttribute('data-args') || '{}'); } catch (e) {}
    var bespoke = (window.ML_BESPOKE || {})[key];
    var fn = bespoke || DRAW[type] || DRAW.bars;

    var cv = document.createElement('canvas');
    cv.style.display = 'block';
    cv.style.width = '100%';
    cv.style.height = (box.getAttribute('data-h') || 108) + 'px';
    cv.style.borderRadius = '8px';
    cv.title = '点一下暂停 / 继续';
    box.appendChild(cv);

    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var playing = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var t0 = performance.now(), pausedAt = 0;
    var visible = true;

    function resize() {
      var w = cv.clientWidth || 300, h = cv.clientHeight || 108;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
        cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: w, h: h };
    }

    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) return;
      var g = resize();
      bg(ctx, g.w, g.h);
      var t = playing ? (now - t0) : pausedAt;
      fn(ctx, g.w, g.h, t, args);
    }

    cv.addEventListener('click', function () {
      if (playing) { pausedAt = performance.now() - t0; playing = false; }
      else { t0 = performance.now() - pausedAt; playing = true; }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
      }, { threshold: 0.05 }).observe(cv);
    }
    requestAnimationFrame(frame);
  }

  function boot() {
    var boxes = [].slice.call(document.querySelectorAll('.ml-demo'));
    if (!boxes.length) return;
    if (!('IntersectionObserver' in window)) { boxes.forEach(mount); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { mount(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '200px' });
    boxes.forEach(function (b) { io.observe(b); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
