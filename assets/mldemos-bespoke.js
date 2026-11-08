/* 每个知识光点一张专属图：按节点 id 注册，mldemo.js 会优先用它。
   只画内容，背景由 mldemo.js 统一铺。 */
(function () {
  'use strict';
  var B = {};

  function T(ctx, s, x, y, c, size) {
    ctx.fillStyle = c || 'rgba(191,232,246,.75)';
    ctx.font = (size || 10) + 'px system-ui, sans-serif';
    ctx.fillText(s, x, y);
  }
  function L(ctx, x1, y1, x2, y2, c, w, dash) {
    ctx.beginPath();
    if (dash) ctx.setLineDash(dash);
    ctx.strokeStyle = c; ctx.lineWidth = w || 1;
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.setLineDash([]);
  }
  function R(ctx, x, y, w, h, fill, stroke) {
    ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h); }
  }
  function AR(ctx, x1, y1, x2, y2, c) {
    L(ctx, x1, y1, x2, y2, c, 1);
    var a = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 5 * Math.cos(a - 0.4), y2 - 5 * Math.sin(a - 0.4));
    ctx.lineTo(x2 - 5 * Math.cos(a + 0.4), y2 - 5 * Math.sin(a + 0.4));
    ctx.closePath();
    ctx.fillStyle = c; ctx.fill();
  }

  // ---------- 基础构件 ----------
  B.mlp = function (ctx, w, h, t) {
    var layers = [4, 3, 2], gapX = (w - 60) / (layers.length - 1);
    var pos = [];
    layers.forEach(function (n, li) {
      var col = [];
      for (var i = 0; i < n; i++) col.push([30 + li * gapX, h / 2 + (i - (n - 1) / 2) * 20]);
      pos.push(col);
    });
    for (var a = 0; a < pos.length - 1; a++) {
      pos[a].forEach(function (p) {
        pos[a + 1].forEach(function (q) {
          var on = (Math.floor(t / 260) % 3) === a;
          L(ctx, p[0], p[1], q[0], q[1], on ? 'rgba(127,212,239,.55)' : 'rgba(127,212,239,.16)', 1);
        });
      });
    }
    pos.forEach(function (col, li) {
      col.forEach(function (p, i) {
        var lit = (Math.floor(t / 260) % 3) >= li;
        ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
        ctx.fillStyle = lit ? '#cfe9f5' : 'rgba(127,212,239,.45)'; ctx.fill();
      });
    });
    T(ctx, '输入 → 隐藏 → 输出', 8, 14);
  };

  B.linear = function (ctx, w, h, t) {
    var k = 0.5 + 0.5 * Math.sin(t * 0.0011);
    var pts = [];
    for (var i = 0; i < 18; i++) {
      var x = 24 + (i * 37 % 100) / 100 * (w - 48);
      var y = h - 22 - ((i * 53 % 100) / 100) * (h - 44);
      pts.push([x, y]);
    }
    var cx = w / 2, cy = h / 2;
    var ang = -0.5 + k * 0.8;
    pts.forEach(function (p) { L(ctx, p[0], p[1], p[0] + 0.4, p[1], 'rgba(255,255,255,.08)', 1); ctx.beginPath(); ctx.arc(p[0], p[1], 2, 0, 6.283); ctx.fillStyle = 'rgba(127,212,239,.8)'; ctx.fill(); });
    var dx = Math.cos(ang) * 200, dy = Math.sin(ang) * 200;
    L(ctx, cx - dx, cy - dy, cx + dx, cy + dy, '#e6cf9a', 2);
    T(ctx, 'y = w·x + b　一条直线去拟合点', 8, 14);
  };

  B.act = function (ctx, w, h, t) {
    var y0 = h - 18, x0 = 16, span = (w - 32) / 2;
    L(ctx, x0, y0, w - 16, y0, 'rgba(255,255,255,.15)', 1);
    L(ctx, w / 2, 14, w / 2, h - 14, 'rgba(255,255,255,.15)', 1);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(w / 2, y0);
    ctx.lineTo(w - 16, 20);
    ctx.strokeStyle = '#7fd4ef'; ctx.lineWidth = 2; ctx.stroke();
    var k = (t * 0.0005) % 1;
    var mx = w / 2 + span * k;
    var my = y0 - (y0 - 20) * k;
    ctx.beginPath(); ctx.arc(mx, my, 4, 0, 6.283); ctx.fillStyle = '#e6cf9a'; ctx.fill();
    T(ctx, 'ReLU：左边全压平，右边照原样', 8, 14);
    T(ctx, '0', w / 2 - 4, y0 + 12, 'rgba(191,232,246,.5)');
  };

  B.gelu = function (ctx, w, h, t) {
    var y0 = h - 18, x0 = 16;
    function g(x) { return 0.5 * x * (1 + Math.tanh(1.128 * (x + 0.044715 * x * x * x))); }
    L(ctx, x0, y0, w - 16, y0, 'rgba(255,255,255,.15)', 1);
    ctx.beginPath();
    for (var i = 0; i <= 100; i++) {
      var u = -1 + 2 * i / 100;
      var px = x0 + (w - 32) * i / 100;
      var py = y0 - Math.max(0, Math.min(1, g(u * 2.2) / 2)) * (h - 34);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.strokeStyle = '#9be7c4'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath();
    for (var j = 0; j <= 100; j++) {
      var u2 = -1 + 2 * j / 100;
      var px2 = x0 + (w - 32) * j / 100;
      var py2 = y0 - Math.max(0, u2 * 2.2) / 2 * (h - 34);
      j ? ctx.lineTo(px2, py2) : ctx.moveTo(px2, py2);
    }
    ctx.setLineDash([3, 3]); ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.stroke(); ctx.setLineDash([]);
    T(ctx, 'GELU（实线）比 ReLU（虚线）平滑，负区还有一点坡', 8, 14);
  };

  B.loss = function (ctx, w, h, t) {
    var err = 0.5 + 0.45 * Math.sin(t * 0.0012);
    var bx = 30, by = h - 22, bw = 26;
    R(ctx, bx, by - 60, bw, 60, 'rgba(127,212,239,.25)', 'rgba(127,212,239,.6)');
    T(ctx, '预测', bx + 1, by + 12, 'rgba(191,232,246,.6)');
    R(ctx, bx + bw + 16, by - 60 * (1 - err * 0.6), bw, 60 * (1 - err * 0.6), 'rgba(230,207,154,.3)', 'rgba(230,207,154,.7)');
    T(ctx, '目标', bx + bw + 17, by + 12, 'rgba(230,207,154,.7)');
    var gx = bx + 2 * bw + 32;
    T(ctx, '差 = ' + err.toFixed(2), gx, by - 40, '#f4a6c0', 12);
    L(ctx, bx + bw, by - 60, bx + bw, by, 'rgba(255,255,255,.12)', 1);
    T(ctx, '损失 = 预测与目标的距离，反向传播就朝这个方向调', 8, 14);
  };

  B.ce = function (ctx, w, h, t) {
    var k = 0.5 + 0.5 * Math.sin(t * 0.0009);
    var n = 4, bw = (w - 60) / n;
    var probs = [0.1 + 0.7 * k, 0.3, 0.2, 0.15];
    for (var i = 0; i < n; i++) {
      var bh = probs[i] * (h - 46);
      var x = 30 + i * bw;
      R(ctx, x, h - 20 - bh, bw - 8, bh, i === 0 ? 'rgba(244,166,192,.55)' : 'rgba(127,212,239,.22)',
        i === 0 ? 'rgba(244,166,192,.9)' : 'rgba(127,212,239,.4)');
      T(ctx, ['猫', '狗', '鸟', '鱼'][i], x, h - 8, 'rgba(191,232,246,.6)');
    }
    T(ctx, '交叉熵 = −log(正确类的概率)：越接近 1，损失越小', 8, 14);
    T(ctx, '−log(' + probs[0].toFixed(2) + ') = ' + (-Math.log(probs[0])).toFixed(2), 30, 30, '#f4a6c0', 11);
  };

  B.mse = function (ctx, w, h, t) {
    var x0 = 26, y0 = h - 20, ww = w - 52;
    L(ctx, x0, y0, x0 + ww, y0, 'rgba(255,255,255,.14)', 1);
    var u = (Math.sin(t * 0.0011) + 1) / 2;
    var px = x0 + 8 + u * (ww - 16);
    var r = (u * 2 - 1);
    var py = y0 - 8 - Math.pow(Math.abs(r), 2) * (h - 44);
    ctx.beginPath();
    for (var i = 0; i <= 100; i++) {
      var uu = i / 100 * 2 - 1;
      var x = x0 + 8 + i / 100 * (ww - 16);
      var y = y0 - 8 - uu * uu * (h - 44);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = 'rgba(127,212,239,.55)'; ctx.lineWidth = 1.5; ctx.stroke();
    L(ctx, px, y0 - 8, px, py, 'rgba(244,166,192,.7)', 1, [3, 3]);
    ctx.beginPath(); ctx.arc(px, py, 4, 0, 6.283); ctx.fillStyle = '#e6cf9a'; ctx.fill();
    T(ctx, '平方误差：差一点罚得轻，差很多罚得重（抛物线）', 8, 14);
  };

  B.bp = function (ctx, w, h, t) {
    var names = ['输入', '隐层1', '隐层2', '输出'];
    var n = names.length, gap = (w - 40) / (n - 1);
    var phase = (t * 0.0006) % 1;
    var back = phase > 0.5;
    for (var i = 0; i < n; i++) {
      var x = 20 + i * gap, y = h / 2;
      R(ctx, x - 18, y - 12, 36, 24, back ? 'rgba(244,166,192,.12)' : 'rgba(127,212,239,.16)',
        back ? 'rgba(244,166,192,.5)' : 'rgba(127,212,239,.5)');
      T(ctx, names[i], x - 16, y + 3, 'rgba(220,238,248,.8)', 9);
      if (i < n - 1) {
        AR(ctx, x + 18, y, x + gap - 18, y, back ? 'rgba(244,166,192,.7)' : 'rgba(127,212,239,.7)');
      }
    }
    var gx = back ? (1 - (phase - 0.5) * 2) : phase * 2;
    var px = 20 + gx * (w - 40);
    ctx.beginPath(); ctx.arc(px, h / 2 - 20, 3.5, 0, 6.283); ctx.fillStyle = '#e6cf9a'; ctx.fill();
    T(ctx, back ? '反向：梯度一层层往回传' : '前向：数据一层层往前算', 8, 14);
  };

  B.autodiff = function (ctx, w, h, t) {
    var phase = (t * 0.0005) % 1, back = phase > 0.5;
    var nodes = [[w * 0.5, 24, 'a·b'], [w * 0.28, h * 0.5, '+c'], [w * 0.72, h * 0.5, 'a' ], [w * 0.5, h - 22, 'out']];
    L(ctx, nodes[0][0], nodes[0][1] + 10, nodes[1][0], nodes[1][1] - 10, 'rgba(127,212,239,.3)', 1);
    L(ctx, nodes[1][0], nodes[1][1] + 10, nodes[3][0], nodes[3][1] - 10, 'rgba(127,212,239,.3)', 1);
    L(ctx, nodes[2][0], nodes[2][1] + 10, nodes[3][0], nodes[3][1] - 10, 'rgba(127,212,239,.3)', 1);
    nodes.forEach(function (p) {
      ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, 6.283);
      ctx.fillStyle = back ? 'rgba(244,166,192,.3)' : 'rgba(127,212,239,.3)'; ctx.fill();
      T(ctx, p[2], p[0] - 8, p[1] + 3, 'rgba(240,250,255,.9)', 9);
    });
    T(ctx, back ? '反向：按计算图求导，链式法则自动展开' : '前向：记录每个运算，搭出计算图', 8, 13);
  };

  B.opt = function (ctx, w, h, t) {
    var cx = w / 2, cy = h / 2 + 6;
    for (var r = 5; r >= 1; r--) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 32, r * 10, 0, 0, 6.283);
      ctx.strokeStyle = 'rgba(127,212,239,' + (0.06 + 0.03 * (5 - r)) + ')'; ctx.lineWidth = 1; ctx.stroke();
    }
    var k = (t * 0.0004) % 1;
    var ang = k * 6.283, rad = (1 - k) * 0.9;
    var px = cx + Math.cos(ang) * rad * 32 * 2.2, py = cy + Math.sin(ang) * rad * 10 * 2.2;
    ctx.beginPath(); ctx.arc(px, py, 4, 0, 6.283); ctx.fillStyle = '#e6cf9a'; ctx.fill();
    T(ctx, '优化器：在损失面上一步步挪到谷底', 8, 14);
  };

  B.sgd = function (ctx, w, h, t) {
    var y0 = h - 18, x0 = 20;
    L(ctx, x0, y0, w - 20, y0, 'rgba(255,255,255,.12)', 1);
    var k = (t * 0.0003) % 1;
    ctx.beginPath();
    for (var i = 0; i <= 60; i++) {
      var u = i / 60 * k;
      var x = x0 + u * (w - 40);
      var y = 20 + (h - 44) * Math.exp(-4 * u) + (i % 2 ? 6 : -6) * (1 - u);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = '#7fd4ef'; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.beginPath();
    for (var j = 0; j <= 60; j++) {
      var u2 = j / 60 * k;
      var x2 = x0 + u2 * (w - 40);
      var y2 = 20 + (h - 44) * Math.exp(-4 * u2);
      j ? ctx.lineTo(x2, y2) : ctx.moveTo(x2, y2);
    }
    ctx.strokeStyle = 'rgba(244,166,192,.75)'; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
    T(ctx, 'SGD 一步一拐（蓝），带动量后顺滑得多（粉虚线）', 8, 14);
  };

  B.adam = function (ctx, w, h, t) {
    var n = 5, bw = (w - 40) / n;
    for (var i = 0; i < n; i++) {
      var step = 1 - Math.pow(0.55, i + 1);
      var bh = (h - 40) * step * (0.5 + 0.5 * Math.sin(t * 0.001 + i));
      R(ctx, 20 + i * bw, h - 20 - bh, bw - 10, bh, 'rgba(155,231,196,.24)', 'rgba(155,231,196,.6)');
    }
    T(ctx, 'Adam：每个维度自己调步长（柱高差别很大）', 8, 14);
  };

  B.reg = function (ctx, w, h, t) {
    var k = (t * 0.0006) % 1;
    var n = 6, bw = (w - 40) / n;
    for (var i = 0; i < n; i++) {
      var v = (1 - k * 0.85) * (0.4 + 0.6 * Math.abs(Math.sin(i * 2.1)));
      var bh = v * (h - 40);
      R(ctx, 20 + i * bw, h - 20 - bh, bw - 10, bh, 'rgba(230,207,154,.22)', 'rgba(230,207,154,.6)');
    }
    T(ctx, '正则化：把权重往 0 拉，柱子整体缩水（不是变稀疏）', 8, 14);
  };

  B.dropout = function (ctx, w, h, t) {
    var n = 6, size = Math.min(w - 40, h - 34), cell = size / n, ox = (w - size) / 2, oy = 22;
    var seed = Math.floor(t / 600);
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      var rnd = Math.abs(Math.sin(i * 7.1 + j * 13.7 + seed * 3.3) * 43758.5 % 1);
      var dead = rnd < 0.42;
      R(ctx, ox + j * cell, oy + i * cell, cell - 2, cell - 2,
        dead ? 'rgba(255,255,255,.04)' : 'rgba(127,212,239,.35)',
        dead ? 'rgba(255,255,255,.1)' : 'rgba(127,212,239,.6)');
      if (dead) {
        L(ctx, ox + j * cell + 4, oy + i * cell + 4, ox + (j + 1) * cell - 6, oy + (i + 1) * cell - 6, 'rgba(255,255,255,.2)', 1);
      }
    }
    T(ctx, 'Dropout：每次训练随机打掉 ~40% 的神经元', 8, 14);
  };

  B.bn = function (ctx, w, h, t) {
    var k = 0.5 + 0.5 * Math.sin(t * 0.0008);
    var cx = w / 2;
    for (var i = 0; i < 22; i++) {
      var bx = 30 + (i * 41 % 100) / 100 * (w - 60);
      var skew = (bx - cx) * (1 - k) * 0.35;
      var x = bx + skew;
      ctx.beginPath(); ctx.arc(x, h - 26 - (i * 17 % 40), 2.2, 0, 6.283);
      ctx.fillStyle = 'rgba(127,212,239,.7)'; ctx.fill();
    }
    L(ctx, cx, 22, cx, h - 16, 'rgba(255,255,255,.14)', 1, [3, 4]);
    T(ctx, '批归一化：把散开的分布收拢到均值 0 附近', 8, 14);
    T(ctx, '0', cx - 3, h - 5, 'rgba(191,232,246,.5)');
  };

  B.init = function (ctx, w, h, t) {
    var mode = Math.floor((t / 2200) % 3);
    var spread = [0.18, 0.5, 0.95][mode];
    var cx = w / 2, base = h - 18;
    for (var i = 0; i < 26; i++) {
      var v = (Math.sin(i * 12.9898) * 0.5 + 0.5) * 2 - 1;
      var x = cx + v * spread * (w / 2 - 24);
      var bh = 6 + Math.abs(v) * 14;
      R(ctx, x - 2, base - bh, 4, bh, mode === 1 ? 'rgba(155,231,196,.6)' : 'rgba(244,166,192,.5)');
    }
    T(ctx, ['太小：信号传不动', '合适：方差稳定', '太大：一开就炸'][mode], 8, 14, mode === 1 ? '#9be7c4' : '#f4a6c0');
  };

  B.lr = function (ctx, w, h, t) {
    var y0 = h - 18, x0 = 20;
    L(ctx, x0, y0, w - 20, y0, 'rgba(255,255,255,.12)', 1);
    var curves = [
      { c: 'rgba(127,212,239,.75)', f: function (u) { return 0.85 - 0.05 * u; } },
      { c: 'rgba(155,231,196,.85)', f: function (u) { return 0.9 * Math.exp(-3.4 * u); } },
      { c: 'rgba(244,166,192,.8)', f: function (u) { return Math.min(1, 0.4 + 1.6 * u * u); } }
    ];
    curves.forEach(function (cv) {
      ctx.beginPath();
      for (var i = 0; i <= 60; i++) {
        var u = i / 60;
        var x = x0 + u * (w - 40);
        var y = y0 - Math.max(0, Math.min(1, cv.f(u))) * (h - 40);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = cv.c; ctx.lineWidth = 1.6; ctx.stroke();
    });
    T(ctx, '学习率：太小走不到底（蓝），合适（绿），太大震荡（粉）', 8, 14);
  };

  // ---------- CNN ----------
  B.cnn = function (ctx, w, h, t) {
    var stages = [['图像', 34], ['卷积', 26], ['池化', 18], ['全连接', 12], ['输出', 8]];
    var gap = (w - 50) / (stages.length - 1);
    var step = Math.floor((t / 520) % stages.length);
    stages.forEach(function (s, i) {
      var x = 25 + i * gap, sz = s[1];
      var on = i <= step;
      R(ctx, x - sz / 2, h / 2 - sz / 2, sz, sz, on ? 'rgba(155,231,196,.24)' : 'rgba(255,255,255,.05)',
        on ? 'rgba(155,231,196,.7)' : 'rgba(255,255,255,.12)');
      T(ctx, s[0], x - 12, h - 6, 'rgba(200,230,240,.7)', 9);
      if (i < stages.length - 1) AR(ctx, x + sz / 2 + 2, h / 2, x + gap - stages[i + 1][1] / 2 - 3, h / 2, 'rgba(127,212,239,.45)');
    });
    T(ctx, '特征图越来越小，通道越来越多', 8, 13);
  };

  B.lenet = function (ctx, w, h, t) {
    var dims = [32, 28, 14, 10, 6];
    var gap = (w - 50) / (dims.length - 1), step = Math.floor((t / 600) % dims.length);
    dims.forEach(function (d, i) {
      var x = 25 + i * gap, sz = 10 + d * 0.7;
      var on = i <= step;
      R(ctx, x - sz / 2, h / 2 - sz / 2, sz, sz, on ? 'rgba(127,212,239,.2)' : 'rgba(255,255,255,.04)',
        on ? 'rgba(127,212,239,.65)' : 'rgba(255,255,255,.1)');
      T(ctx, d + '×' + d, x - 12, h - 6, 'rgba(200,230,240,.65)', 9);
    });
    T(ctx, 'LeNet-5：32 → 28 → 14 → 10 → 输出', 8, 13);
  };

  B.alexnet = function (ctx, w, h, t) {
    var n = 8, bw = (w - 40) / n, step = Math.floor((t / 420) % n);
    for (var i = 0; i < n; i++) {
      var on = i <= step;
      var x = 20 + i * bw;
      var top = i < 4 ? 24 : (i < 6 ? 16 : 8);
      var bh = h - 48 - top;
      R(ctx, x + 2, top + 6, bw - 6, bh, on ? 'rgba(155,231,196,.22)' : 'rgba(255,255,255,.04)',
        on ? 'rgba(155,231,196,.6)' : 'rgba(255,255,255,.1)');
    }
    L(ctx, 20, h / 2, w - 20, h / 2, 'rgba(255,255,255,.08)', 1);
    T(ctx, 'AlexNet：8 层，当年拆到两块 GPU 上跑（中线）', 8, 13);
  };

  B.vgg = function (ctx, w, h, t) {
    var blocks = [2, 2, 3, 3, 3];
    var x = 22, step = Math.floor((t / 500) % 13), k = 0;
    blocks.forEach(function (n, bi) {
      var bwid = (w - 44) / blocks.length;
      for (var i = 0; i < n; i++) {
        var y = h - 24 - ((bi * 3 + i) % 13) * 4 - 10;
        k++;
        var on = k <= step;
        R(ctx, x, y - 6, bwid - 6, 6, on ? 'rgba(127,212,239,.55)' : 'rgba(255,255,255,.08)');
      }
      x += bwid;
    });
    T(ctx, 'VGG：只堆 3×3 卷积，13 层全是一个样子', 8, 13);
  };

  B.googlenet = function (ctx, w, h, t) {
    var cx = w / 2, cy = h / 2;
    var sizes = [4, 8, 12, 16];
    var step = Math.floor((t / 600) % 4);
    sizes.forEach(function (sz, i) {
      R(ctx, cx - 60 - i * 4, cy - sz / 2 + (i - 1.5) * 8, sz * 3, sz, i <= step ? 'rgba(244,166,192,.18)' : 'rgba(255,255,255,.04)',
        i <= step ? 'rgba(244,166,192,.6)' : 'rgba(255,255,255,.1)');
    });
    for (var i = 0; i < 4; i++) AR(ctx, cx + 62, cy, cx + 96, cy + (i - 1.5) * 8, 'rgba(155,231,196,.5)');
    R(ctx, cx + 96, cy - 16, 18, 32, 'rgba(155,231,196,.25)', 'rgba(155,231,196,.7)');
    T(ctx, 'Inception：1×1 / 3×3 / 5×5 并行后再拼起来', 8, 13);
  };

  B.resnet = function (ctx, w, h, t) {
    var y = h / 2, x1 = w * 0.28, x2 = w * 0.62;
    R(ctx, x1, y - 14, x2 - x1, 28, 'rgba(127,212,239,.16)', 'rgba(127,212,239,.55)');
    T(ctx, 'F(x)', x1 + 8, y + 4, 'rgba(220,240,250,.85)', 9);
    var k = (t * 0.0007) % 1;
    AR(ctx, 20, y, x1, y, 'rgba(127,212,239,.6)');
    AR(ctx, x2, y, w - 20, y, 'rgba(127,212,239,.6)');
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.quadraticCurveTo(w / 2, y - 44, w - 20, y);
    ctx.strokeStyle = 'rgba(230,207,154,.85)'; ctx.lineWidth = 2; ctx.stroke();
    var px = 20 + k * (w - 40);
    var py = y - 44 * 4 * k * (1 - k);
    ctx.beginPath(); ctx.arc(px, py, 3.5, 0, 6.283); ctx.fillStyle = '#fff4d0'; ctx.fill();
    T(ctx, '跳连：梯度有一条值为 1 的直路', 8, 13);
  };

  B.densenet = function (ctx, w, h, t) {
    var n = 4, x0 = 30, gap = (w - 60) / (n - 1), y = h / 2;
    var boxes = [];
    for (var i = 0; i < n; i++) boxes.push([x0 + i * gap, y]);
    for (var a = 0; a < n; a++) for (var b = a + 1; b < n; b++) {
      var on = (Math.floor(t / 400) % 4) === a;
      L(ctx, boxes[a][0], y + 12, boxes[b][0], y + 12, on ? 'rgba(155,231,196,.6)' : 'rgba(155,231,196,.14)', 1);
    }
    boxes.forEach(function (p) {
      R(ctx, p[0] - 14, y - 12, 28, 24, 'rgba(127,212,239,.2)', 'rgba(127,212,239,.55)');
    });
    T(ctx, 'DenseNet：每层都连到后面所有层（连线下弯）', 8, 13);
  };

  B.mobilenet = function (ctx, w, h, t) {
    var y = h / 2;
    R(ctx, 24, y - 16, 58, 32, 'rgba(127,212,239,.18)', 'rgba(127,212,239,.55)');
    T(ctx, '3×3 深度卷积', 26, y + 4, 'rgba(220,240,250,.85)', 9);
    R(ctx, w - 82, y - 16, 58, 32, 'rgba(155,231,196,.18)', 'rgba(155,231,196,.55)');
    T(ctx, '1×1 逐点', w - 76, y + 4, 'rgba(220,240,250,.85)', 9);
    AR(ctx, 86, y, w - 86, y, 'rgba(230,207,154,.6)');
    var k = (t * 0.0006) % 1;
    ctx.beginPath(); ctx.arc(86 + k * (w - 172), y, 3.5, 0, 6.283); ctx.fillStyle = '#fff4d0'; ctx.fill();
    T(ctx, '把一次卷积拆成两步：每个通道各卷一次，再用 1×1 合并', 8, 13);
  };

  B.effnet = function (ctx, w, h, t) {
    var k = 0.4 + 0.6 * ((Math.sin(t * 0.0008) + 1) / 2);
    var labels = ['深度', '宽度', '分辨率'];
    labels.forEach(function (s, i) {
      var y = 34 + i * 24;
      T(ctx, s, 12, y + 4, 'rgba(200,230,240,.7)', 10);
      R(ctx, 56, y - 5, w - 90, 10, 'rgba(255,255,255,.07)');
      R(ctx, 56, y - 5, (w - 90) * k, 10, 'rgba(155,231,196,.5)');
    });
    T(ctx, '复合缩放：三个维度按固定比例一起放大', 8, 14);
  };

  B.unet = function (ctx, w, h, t) {
    var xs = [0.18, 0.32, 0.46, 0.6, 0.74, 0.88];
    var ys = [h * 0.25, h * 0.35, h * 0.5, h * 0.62, h * 0.75, h * 0.85];
    for (var i = 0; i < xs.length; i++) {
      var sz = 26 - i * 3;
      R(ctx, xs[i] * w - sz / 2, ys[i] - sz / 2, sz, sz,
        i < 3 ? 'rgba(127,212,239,.2)' : 'rgba(155,231,196,.2)',
        i < 3 ? 'rgba(127,212,239,.6)' : 'rgba(155,231,196,.6)');
    }
    for (var a = 0; a < 3; a++) {
      var b = xs.length - 1 - a;
      L(ctx, xs[a] * w, ys[a], xs[b] * w, ys[b], 'rgba(230,207,154,.45)', 1, [4, 3]);
    }
    T(ctx, 'U-Net：下采样到最窄，再上采样回去，虚线是跳连接', 8, 13);
  };

  B.yolo = function (ctx, w, h, t) {
    var n = 5, size = Math.min(w - 30, h - 30), cell = size / n, ox = (w - size) / 2, oy = 18;
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      R(ctx, ox + j * cell, oy + i * cell, cell - 1, cell - 1, 'rgba(127,212,239,.07)', 'rgba(127,212,239,.18)');
    }
    var bx = Math.floor((t / 700) % n), by = Math.floor((t / 900) % n);
    R(ctx, ox + bx * cell, oy + by * cell, cell, cell, 'rgba(244,166,192,.28)', 'rgba(244,166,192,.8)');
    var bw = cell * (0.6 + 0.3 * Math.sin(t * 0.001)), bh = cell * 0.7;
    ctx.strokeStyle = '#fff4d0'; ctx.lineWidth = 1.4;
    ctx.strokeRect(ox + bx * cell + (cell - bw) / 2, oy + by * cell + (cell - bh) / 2, bw, bh);
    T(ctx, 'YOLO：每格直接回归框的位置和置信度', 8, 13);
  };

  B.seg = function (ctx, w, h, t) {
    var n = 6, size = Math.min(w - 30, h - 30), cell = size / n, ox = (w - size) / 2, oy = 18;
    var reveal = (t * 0.0005) % 1;
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      var inShape = ((i - 2.5) * (i - 2.5) + (j - 2.5) * (j - 2.5)) < 5.2;
      var done = (i * n + j) / (n * n) < reveal;
      R(ctx, ox + j * cell, oy + i * cell, cell - 1, cell - 1,
        inShape ? (done ? 'rgba(155,231,196,.65)' : 'rgba(155,231,196,.25)') : (done ? 'rgba(127,212,239,.25)' : 'rgba(127,212,239,.1)'),
        'rgba(255,255,255,.06)');
    }
    T(ctx, '分割：每个像素都要给一个类别', 8, 13);
  };

  window.ML_BESPOKE = B;
})();
