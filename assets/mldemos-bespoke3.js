/* 第三批专属图：RNN 3 + 图 2 + 强化学习 6 + 工程 12 + 应用 5 = 28 个 */
(function () {
  'use strict';
  var B = window.ML_BESPOKE || {};
  var P = { blue: '#7fd4ef', pink: '#f4a6c0', mint: '#9be7c4', gold: '#e6cf9a' };

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

  // ===== RNN =====
  B.rnn = function (ctx, w, h, t) {
    var n = 4, gap = (w - 60) / (n - 1), y = h / 2;
    var k = (t * 0.0006) % 1;
    for (var i = 0; i < n; i++) {
      var x = 30 + i * gap;
      R(ctx, x - 12, y - 12, 24, 24, 'rgba(127,212,239,.18)', 'rgba(127,212,239,.55)');
      T(ctx, 'h' + (i + 1), x - 6, y + 4, '#cdeefc', 9);
      if (i < n - 1) {
        AR(ctx, x + 13, y, x + gap - 13, y, 'rgba(127,212,239,.5)');
        ctx.beginPath();
        ctx.moveTo(x + 12, y - 12);
        ctx.quadraticCurveTo(x + gap / 2, y - 26, x + gap - 12, y - 12);
        ctx.strokeStyle = 'rgba(155,231,196,.5)'; ctx.lineWidth = 1; ctx.stroke();
      }
      if (Math.abs(k * n - i) < 0.5) {
        ctx.beginPath(); ctx.arc(x, y - 20, 3, 0, 6.283); ctx.fillStyle = P.gold; ctx.fill();
      }
    }
    T(ctx, 'RNN：同一个单元按时间复用，绿色弧线是上一时刻的记忆', 8, 13);
  };

  B.bptt = function (ctx, w, h, t) {
    var n = 5, gap = (w - 50) / (n - 1), y = h / 2 + 6;
    var k = (t * 0.0007) % 1;
    for (var i = 0; i < n; i++) {
      var x = 25 + i * gap;
      R(ctx, x - 9, y - 10, 18, 20, 'rgba(127,212,239,.16)', 'rgba(127,212,239,.5)');
      var decay = Math.pow(0.55, n - 1 - i);
      var bh = 2 + decay * 22;
      R(ctx, x - 3, y + 16, 6, bh, 'rgba(244,166,192,' + (0.25 + 0.6 * decay) + ')');
    }
    var px = 25 + (1 - k) * (n - 1) * gap;
    ctx.beginPath(); ctx.arc(px, y - 18, 3.5, 0, 6.283); ctx.fillStyle = P.gold; ctx.fill();
    T(ctx, 'BPTT：误差沿时间倒着传，越早的步梯度被乘得越小（柱子越矮）', 8, 13);
  };

  B.seq2seq = function (ctx, w, h, t) {
    var step = Math.floor((t / 700) % 4);
    var src = ['我', '爱', '北', '京'], dst = ['I', 'love', 'BJ'];
    var y1 = h / 2 - 14, y2 = h / 2 + 16;
    for (var i = 0; i < src.length; i++) {
      var on = i <= step;
      R(ctx, 20 + i * 26, y1 - 9, 22, 18, on ? 'rgba(127,212,239,.28)' : 'rgba(255,255,255,.05)',
        on ? 'rgba(127,212,239,.7)' : 'rgba(255,255,255,.12)');
      T(ctx, src[i], 28 + i * 26, y1 + 4, on ? '#cdeefc' : 'rgba(200,220,230,.4)', 9);
    }
    R(ctx, w / 2 - 14, h / 2 - 8, 28, 16, 'rgba(230,207,154,.25)', 'rgba(230,207,154,.8)');
    T(ctx, '向量', w / 2 - 12, h / 2 + 4, '#fff4d0', 8);
    for (var j = 0; j < dst.length; j++) {
      var on2 = step >= 3;
      R(ctx, w - 100 + j * 26, y2 - 9, 22, 18, on2 ? 'rgba(155,231,196,.25)' : 'rgba(255,255,255,.05)',
        on2 ? 'rgba(155,231,196,.7)' : 'rgba(255,255,255,.12)');
      T(ctx, dst[j], w - 96 + j * 26, y2 + 4, on2 ? '#dffff2' : 'rgba(200,220,230,.4)', 8);
    }
    T(ctx, 'Seq2Seq：先把整句压成一个向量，再从它展开出译文', 8, 13);
  };

  // ===== 图 =====
  B.gnn = function (ctx, w, h, t) {
    var cx = w / 2, cy = h / 2 + 4, r = 30;
    var nb = [];
    for (var i = 0; i < 4; i++) {
      var a = -1.57 + i * 1.57;
      nb.push([cx + Math.cos(a) * r * 1.6, cy + Math.sin(a) * r * 0.9]);
    }
    var k = (t * 0.0008) % 1;
    nb.forEach(function (p, i) {
      var on = k * 4 > i;
      L(ctx, p[0], p[1], cx, cy, on ? 'rgba(155,231,196,.7)' : 'rgba(155,231,196,.2)', on ? 1.6 : 1);
      ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, 6.283); ctx.fillStyle = 'rgba(127,212,239,.7)'; ctx.fill();
    });
    ctx.beginPath(); ctx.arc(cx, cy, 8, 0, 6.283);
    ctx.fillStyle = 'rgba(230,207,154,' + (0.4 + 0.5 * k) + ')'; ctx.fill();
    T(ctx, 'GNN：中心节点把邻居的信息加权汇总到自己身上', 8, 13);
  };

  B.gcn = function (ctx, w, h, t) {
    var n = 5, cell = 12, ox = 20, oy = 20;
    var sweep = Math.floor((t / 500) % n);
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      var adj = (Math.abs(i - j) === 1 || i === j) ? 0.85 : 0.12;
      var hi = (i === sweep || j === sweep);
      R(ctx, ox + j * cell, oy + i * cell, cell - 1, cell - 1,
        'rgba(127,212,239,' + (hi ? 0.25 + 0.6 * adj : 0.08 + 0.3 * adj) + ')');
    }
    var gx = ox + n * cell + 24;
    for (var q = 0; q < n; q++) {
      var on = Math.abs(q - sweep) <= 1;
      ctx.beginPath(); ctx.arc(gx + 10, oy + q * cell + 5, on ? 4 : 2.5, 0, 6.283);
      ctx.fillStyle = on ? P.gold : 'rgba(127,212,239,.4)'; ctx.fill();
    }
    T(ctx, 'GCN：邻接矩阵决定「谁的信息传给我」（高亮那一行就是它的邻居）', 8, 13);
  };

  // ===== 强化学习 =====
  B.rl = function (ctx, w, h, t) {
    var k = (t * 0.0006) % 1;
    var ax = 24, bx = w - 94, y = h / 2;
    R(ctx, ax, y - 16, 60, 32, 'rgba(127,212,239,.18)', 'rgba(127,212,239,.6)');
    T(ctx, '智能体', ax + 10, y + 4, '#cdeefc', 10);
    R(ctx, bx, y - 16, 66, 32, 'rgba(155,231,196,.18)', 'rgba(155,231,196,.6)');
    T(ctx, '环境', bx + 20, y + 4, '#dffff2', 10);
    AR(ctx, ax + 62, y - 7, bx - 2, y - 7, 'rgba(127,212,239,.6)');
    T(ctx, '动作', w / 2 - 12, y - 12, 'rgba(200,226,240,.6)', 8);
    AR(ctx, bx - 2, y + 8, ax + 62, y + 8, 'rgba(230,207,154,.7)');
    T(ctx, '状态 + 奖励', w / 2 - 26, y + 22, 'rgba(230,207,154,.7)', 8);
    ctx.beginPath(); ctx.arc(ax + 62 + k * (bx - ax - 64), y - 7, 3, 0, 6.283);
    ctx.fillStyle = P.blue; ctx.fill();
    T(ctx, '智能体与环境来回：动作出去，状态和奖励回来', 8, 13);
  };

  B.mdp = function (ctx, w, h, t) {
    var pts = [[40, h / 2], [w / 2, 30], [w / 2, h - 26], [w - 40, h / 2]];
    var names = ['S0', 'S1', 'S2', 'S3'];
    [0, 1, 1, 2, 1, 3, 2, 3].forEach(function (v, i, arr) {
      if (i % 2) return;
      L(ctx, pts[arr[i]][0], pts[arr[i]][1], pts[arr[i + 1]][0], pts[arr[i + 1]][1], 'rgba(127,212,239,.3)', 1);
    });
    var k = Math.floor((t / 800) % 4);
    pts.forEach(function (p, i) {
      ctx.beginPath(); ctx.arc(p[0], p[1], i === k ? 7 : 5, 0, 6.283);
      ctx.fillStyle = i === k ? P.gold : 'rgba(127,212,239,.55)'; ctx.fill();
      T(ctx, names[i], p[0] - 7, p[1] - 10, 'rgba(200,226,240,.6)', 8);
    });
    T(ctx, 'MDP：状态之间由动作连接，每次转移带一个奖励和概率', 8, 13);
  };

  B.qlearn = function (ctx, w, h, t) {
    var n = 5, size = Math.min(w - 40, h - 38), cell = size / n, ox = (w - size) / 2, oy = 22;
    var path = [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2], [4, 2], [4, 3], [4, 4]];
    var step = Math.floor((t / 420) % (path.length + 2));
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      R(ctx, ox + j * cell, oy + i * cell, cell - 1, cell - 1, 'rgba(127,212,239,.07)', 'rgba(127,212,239,.16)');
    }
    for (var s = 0; s < Math.min(step, path.length); s++) {
      var p = path[s];
      R(ctx, ox + p[1] * cell, oy + p[0] * cell, cell - 1, cell - 1, 'rgba(230,207,154,.4)', 'rgba(230,207,154,.8)');
      T(ctx, '+' + s, ox + p[1] * cell + 2, oy + p[0] * cell + cell - 3, 'rgba(255,244,208,.8)', 7);
    }
    var g = path[path.length - 1];
    R(ctx, ox + g[1] * cell, oy + g[0] * cell, cell - 1, cell - 1, 'rgba(155,231,196,.45)', 'rgba(155,231,196,.9)');
    T(ctx, 'Q-learning：走过的路被记进 Q 值，越靠近目标分越高', 8, 13);
  };

  B.pg = function (ctx, w, h, t) {
    var k = (Math.sin(t * 0.0009) + 1) / 2;
    var probs = [0.2 + 0.55 * k, 0.5 - 0.2 * k, 0.3 - 0.35 * k];
    var bw = (w - 60) / 3;
    probs.forEach(function (p, i) {
      var bh = p * (h - 44);
      R(ctx, 30 + i * bw, h - 20 - bh, bw - 16, bh, i === 0 ? 'rgba(230,207,154,.28)' : 'rgba(127,212,239,.16)',
        i === 0 ? 'rgba(230,207,154,.7)' : 'rgba(127,212,239,.4)');
      T(ctx, '动作 ' + (i + 1) + '：' + (p * 100).toFixed(0) + '%', 30 + i * bw, h - 6, 'rgba(200,226,240,.55)', 8);
    });
    T(ctx, '策略梯度：哪个动作回报高，就把它的概率往上推', 8, 13);
  };

  B.ppo = function (ctx, w, h, t) {
    var x0 = 30, y0 = h - 20, x1 = w - 30, y1 = 20;
    var eps = 0.2, k = (t * 0.0005) % 1;
    var r = 0.2 + k * 2.2;
    var clipped = Math.min(Math.max(r, 1 - eps), 1 + eps);
    L(ctx, x0, y0, x1, y0, 'rgba(255,255,255,.12)', 1);
    L(ctx, x0, y1, x0, y0, 'rgba(255,255,255,.12)', 1);
    R(ctx, x0 + (1 - eps) / 2.6 * (x1 - x0), y1, (2 * eps) / 2.6 * (x1 - x0), y0 - y1, 'rgba(155,231,196,.10)');
    ctx.beginPath();
    for (var i = 0; i <= 80; i++) {
      var rr = i / 80 * 2.6;
      var v = Math.min(rr, Math.min(Math.max(rr, 1 - eps), 1 + eps));
      var x = x0 + rr / 2.6 * (x1 - x0);
      var y = y0 - v / 1.4 * (y0 - y1);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = 'rgba(244,166,192,.9)'; ctx.lineWidth = 1.8; ctx.stroke();
    var px = x0 + r / 2.6 * (x1 - x0), py = y0 - clipped / 1.4 * (y0 - y1);
    ctx.beginPath(); ctx.arc(px, py, 4, 0, 6.283); ctx.fillStyle = P.gold; ctx.fill();
    T(ctx, 'PPO：比 r 一旦超出 [0.8, 1.2] 就被截断（绿区），不再给更大收益', 8, 13);
  };

  B.sac = function (ctx, w, h, t) {
    var k = (Math.sin(t * 0.0008) + 1) / 2;
    var temp = 0.3 + 0.7 * k;
    var n = 16, bw = (w - 60) / n;
    for (var i = 0; i < n; i++) {
      var u = i / (n - 1);
      var v = Math.exp(-Math.pow((u - 0.5) / (0.08 + temp * 0.2), 2));
      R(ctx, 30 + i * bw, h - 20 - v * (h - 44), bw - 1, v * (h - 44), 'rgba(155,231,196,.22)', 'rgba(155,231,196,.5)');
    }
    T(ctx, 'SAC：温度越高策略越平（探索），越低越尖（利用）', 8, 13);
  };

  // ===== 工程 =====
  B.eng = function (ctx, w, h, t) {
    var stages = ['数据', '训练', '评估', '上线'];
    var gap = (w - 50) / 3, step = Math.floor((t / 700) % 4);
    stages.forEach(function (s, i) {
      var x = 25 + i * gap, on = i <= step;
      R(ctx, x - 16, h / 2 - 13, 44, 26, on ? 'rgba(127,212,239,.2)' : 'rgba(255,255,255,.04)',
        on ? 'rgba(127,212,239,.6)' : 'rgba(255,255,255,.1)');
      T(ctx, s, x - 10, h / 2 + 4, on ? '#cdeefc' : 'rgba(200,220,230,.35)', 9);
      if (i < 3) AR(ctx, x + 30, h / 2, x + gap - 18, h / 2, 'rgba(127,212,239,.4)');
    });
    T(ctx, '真实项目里，模型只占一小部分，剩下都是数据、评估和上线', 8, 13);
  };

  B.aug = function (ctx, w, h, t) {
    var base = ['翻转', '旋转', '裁剪', '调色'];
    var cell = 26, y = 26;
    R(ctx, 20, y, cell, cell, 'rgba(127,212,239,.25)', 'rgba(127,212,239,.6)');
    T(ctx, '原图', 20, y + cell + 12, 'rgba(200,226,240,.6)', 8);
    var step = Math.floor((t / 600) % 4);
    base.forEach(function (s, i) {
      var x = 90 + i * 52, on = i <= step;
      R(ctx, x, y, cell, cell, on ? 'rgba(155,231,196,.22)' : 'rgba(255,255,255,.04)',
        on ? 'rgba(155,231,196,.6)' : 'rgba(255,255,255,.1)');
      T(ctx, s, x - 2, y + cell + 12, on ? 'rgba(220,245,235,.75)' : 'rgba(200,220,230,.3)', 8);
      AR(ctx, 48, y + cell / 2, x - 2, y + cell / 2, 'rgba(127,212,239,.25)');
    });
    T(ctx, '数据增强：同一张图变出多种版本，模型见过更多变化', 8, 13);
  };

  B.transfer = function (ctx, w, h, t) {
    var y = h / 2;
    R(ctx, 24, y - 18, 90, 36, 'rgba(127,212,239,.14)', 'rgba(127,212,239,.55)');
    T(ctx, '预训练权重', 30, y + 4, '#cdeefc', 9);
    R(ctx, 34, y - 8, 10, 12, 'rgba(230,207,154,.6)', 'rgba(230,207,154,.9)');
    T(ctx, '🔒', 32, y + 3, '#1a1206', 8);
    R(ctx, w - 110, y - 18, 80, 36, 'rgba(155,231,196,.2)', 'rgba(155,231,196,.7)');
    T(ctx, '新任务头', w - 104, y + 4, '#dffff2', 9);
    AR(ctx, 118, y, w - 112, y, 'rgba(155,231,196,.5)');
    var k = (t * 0.0006) % 1;
    ctx.beginPath(); ctx.arc(118 + k * (w - 232), y, 3.5, 0, 6.283); ctx.fillStyle = P.gold; ctx.fill();
    T(ctx, '迁移学习：底座冻结（锁），只训新加的任务头', 8, 13);
  };

  B.distill = function (ctx, w, h, t) {
    var y = h / 2;
    R(ctx, 24, y - 22, 74, 44, 'rgba(230,207,154,.16)', 'rgba(230,207,154,.7)');
    T(ctx, '教师', 42, y - 2, '#fff4d0', 10);
    T(ctx, '大而准', 38, y + 12, 'rgba(255,244,208,.55)', 8);
    R(ctx, w - 90, y - 16, 62, 32, 'rgba(127,212,239,.16)', 'rgba(127,212,239,.6)');
    T(ctx, '学生', w - 80, y - 2, '#cdeefc', 10);
    T(ctx, '小而快', w - 82, y + 12, 'rgba(200,230,245,.55)', 8);
    for (var i = 0; i < 3; i++) {
      AR(ctx, 100, y - 8 + i * 8, w - 92, y - 6 + i * 5, 'rgba(155,231,196,' + (0.2 + i * 0.15) + ')');
    }
    T(ctx, '蒸馏：学生不光学答案，还学教师输出的整个分布（软标签）', 8, 13);
  };

  B.prune = function (ctx, w, h, t) {
    var n = 7, cell = 9, ox = 18, oy = 20;
    var ratio = (Math.sin(t * 0.0007) + 1) / 2 * 0.75;
    var alive = 0;
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      var wv = Math.abs(Math.sin(i * 3.1 + j * 5.7));
      var dead = wv < ratio;
      if (!dead) alive++;
      R(ctx, ox + j * cell, oy + i * cell, cell - 1, cell - 1,
        dead ? 'rgba(255,255,255,.04)' : 'rgba(155,231,196,' + (0.3 + 0.5 * wv) + ')',
        dead ? 'rgba(255,255,255,.08)' : 'rgba(155,231,196,.6)');
    }
    T(ctx, '剪枝：小的权重直接置零，留下 ' + alive + '/' + (n * n) + ' 个（灰的是被剪掉的）', 8, 13, P.mint, 10);
  };

  B.quant = function (ctx, w, h, t) {
    var n = 20, bw = (w - 60) / n;
    for (var i = 0; i < n; i++) {
      var v = 0.5 + 0.5 * Math.sin(i * 0.6);
      R(ctx, 30 + i * bw, h - 20 - v * (h - 40), bw - 2, v * (h - 40), 'rgba(127,212,239,.18)', 'rgba(127,212,239,.4)');
    }
    var levels = 4;
    for (var L = 0; L < levels; L++) {
      var y = h - 20 - (L + 0.5) / levels * (h - 40);
      L2 = L;
      ctx.beginPath(); ctx.moveTo(28, y); ctx.lineTo(w - 20, y);
      ctx.strokeStyle = 'rgba(230,207,154,.5)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    }
    T(ctx, '量化：连续权重被吸到 4 个格点上（虚线），显存降到 1/4', 8, 13);
  };
  var L2 = 0;

  B.dist = function (ctx, w, h, t) {
    var n = 4, gap = (w - 60) / (n - 1), y = h / 2 - 10;
    var k = Math.floor((t / 500) % n);
    for (var i = 0; i < n; i++) {
      var x = 30 + i * gap;
      R(ctx, x - 15, y - 12, 30, 24, i === k ? 'rgba(230,207,154,.25)' : 'rgba(127,212,239,.14)',
        i === k ? 'rgba(230,207,154,.8)' : 'rgba(127,212,239,.45)');
      T(ctx, 'GPU' + (i + 1), x - 14, y + 4, i === k ? '#fff4d0' : '#cdeefc', 8);
      AR(ctx, x + 16, y, x + gap - 16, y, 'rgba(127,212,239,.35)');
    }
    var bx = 30 + k * gap;
    ctx.beginPath(); ctx.arc(bx, y + 26, 4, 0, 6.283); ctx.fillStyle = P.mint; ctx.fill();
    T(ctx, '分布式训练：每张卡梯度汇总再广播（下面那颗绿点就是同步）', 8, 13);
  };

  B.amp = function (ctx, w, h, t) {
    var k = (t * 0.0006) % 1;
    R(ctx, 24, 26, 60, 18, 'rgba(127,212,239,.2)', 'rgba(127,212,239,.6)');
    T(ctx, 'fp16', 40, 39, '#cdeefc', 9);
    R(ctx, 24, h - 46, 60, 18, 'rgba(230,207,154,.18)', 'rgba(230,207,154,.6)');
    T(ctx, 'fp32', 40, h - 33, '#fff4d0', 9);
    AR(ctx, 90, 35, 150, 35, 'rgba(127,212,239,.4)');
    AR(ctx, 90, h - 37, 150, h - 37, 'rgba(230,207,154,.4)');
    R(ctx, 152, 26, w - 180, 18, 'rgba(155,231,196,' + (0.08 + 0.2 * k) + ')', 'rgba(155,231,196,.5)');
    T(ctx, '损失放大倍数', 156, 39, 'rgba(220,255,240,.8)', 9);
    T(ctx, '混合精度：大部分算子在 fp16 里跑，关键处保留 fp32，靠 loss scale 防下溢', 8, 13);
  };

  B.ckpt = function (ctx, w, h, t) {
    var phase = Math.floor(t / 1200) % 2;
    var xs = [30, 100, 170, 240, 310];
    xs.forEach(function (x, i) {
      R(ctx, x - 10, h / 2 - 12, 20, 24, i === 2 ? 'rgba(230,207,154,.25)' : 'rgba(127,212,239,.16)',
        i === 2 ? 'rgba(230,207,154,.7)' : 'rgba(127,212,239,.5)');
    });
    if (phase === 0) {
      T(ctx, '前向：激活全存下来（内存爆）', 8, 13, '#f4a6c0', 10);
      xs.forEach(function (x) { ctx.beginPath(); ctx.arc(x, h / 2 + 20, 2.5, 0, 6.283); ctx.fillStyle = 'rgba(244,166,192,.8)'; ctx.fill(); });
    } else {
      T(ctx, '反向：用到再重算一遍（省内存，多花算力）', 8, 13, P.mint, 10);
      AR(ctx, 240, h / 2 + 22, 170, h / 2 + 22, 'rgba(155,231,196,.7)');
    }
  };

  B.data = function (ctx, w, h, t) {
    var k = (t * 0.0007) % 1;
    for (var i = 0; i < 16; i++) {
      var x = 24 + (i * 37 % 100) / 100 * (w - 60);
      var y = 24 + (i * 53 % 100) / 100 * (h - 52);
      var dedup = k > 0.5;
      var jitter = dedup ? 0 : (1 - k * 2) * 12;
      ctx.beginPath(); ctx.arc(x + jitter, y, 2.4, 0, 6.283);
      ctx.fillStyle = dedup ? 'rgba(155,231,196,.75)' : 'rgba(127,212,239,.6)'; ctx.fill();
    }
    T(ctx, dedup ? '去重完成：重复样本合并，标签噪声被剔掉' : '原始数据：有重复、有噪声', 8, 13);
  };

  B.eval = function (ctx, w, h, t) {
    var k = 0.6 + 0.08 * Math.sin(t * 0.0008);
    R(ctx, 24, h / 2 - 10, (w - 60) * 0.6, 20, 'rgba(127,212,239,.22)', 'rgba(127,212,239,.55)');
    T(ctx, '训练', 30, h / 2 + 4, '#cdeefc', 9);
    R(ctx, 24 + (w - 60) * 0.6, h / 2 - 10, (w - 60) * 0.2, 20, 'rgba(155,231,196,.22)', 'rgba(155,231,196,.55)');
    T(ctx, '验证', 30 + (w - 60) * 0.6, h / 2 + 4, '#dffff2', 9);
    R(ctx, 24 + (w - 60) * 0.8, h / 2 - 10, (w - 60) * 0.2, 20, 'rgba(230,207,154,.22)', 'rgba(230,207,154,.6)');
    T(ctx, '测试', 30 + (w - 60) * 0.8, h / 2 + 4, '#fff4d0', 9);
    L(ctx, 24 + (w - 60) * k, 22, 24 + (w - 60) * k, h / 2 + 16, 'rgba(244,166,192,.8)', 1, [3, 3]);
    T(ctx, '验证集用来调参，测试集只能最后看一次', 8, 13);
  };

  B.leak = function (ctx, w, h, t) {
    var k = (Math.sin(t * 0.0009) + 1) / 2;
    var pw = (w - 60) / 2;
    R(ctx, 20, 26, pw - 10, h - 50, 'rgba(127,212,239,.12)', 'rgba(127,212,239,.45)');
    T(ctx, '训练集', 26, h - 14, 'rgba(200,226,240,.6)', 9);
    R(ctx, 20 + pw + 10, 26, pw - 10, h - 50, 'rgba(230,207,154,.12)', 'rgba(230,207,154,.5)');
    T(ctx, '测试集', 26 + pw + 10, h - 14, 'rgba(255,244,208,.6)', 9);
    for (var i = 0; i < 4; i++) {
      var sx = 30 + pw + 10 + i * 12, sy = 34 + i * 10;
      AR(ctx, sx, sy, sx - pw * 0.5 * k - 10, sy + 6, 'rgba(244,166,192,' + (0.3 + 0.5 * k) + ')');
    }
    T(ctx, '数据泄漏：测试集的信息漏进训练，分数虚高、上线就崩', 8, 13, '#f4a6c0', 10);
  };

  // ===== 应用 =====
  B.app = function (ctx, w, h, t) {
    var mods = ['图像', '文本', '语音'];
    var step = Math.floor((t / 800) % 3);
    mods.forEach(function (m, i) {
      var y = 24 + i * 22, on = i === step;
      R(ctx, 20, y, 54, 16, on ? 'rgba(127,212,239,.24)' : 'rgba(255,255,255,.05)',
        on ? 'rgba(127,212,239,.65)' : 'rgba(255,255,255,.1)');
      T(ctx, m, 30, y + 11, on ? '#cdeefc' : 'rgba(200,220,230,.4)', 9);
      AR(ctx, 78, y + 8, 108, h / 2, 'rgba(127,212,239,.3)');
    });
    R(ctx, 110, h / 2 - 16, 60, 32, 'rgba(230,207,154,.2)', 'rgba(230,207,154,.7)');
    T(ctx, '同一套', 118, h / 2 - 2, '#fff4d0', 9);
    T(ctx, '方法', 122, h / 2 + 11, '#fff4d0', 9);
    T(ctx, '应用：同一套方法，换数据就是另一个领域', 8, 13);
  };

  B.cv = function (ctx, w, h, t) {
    var n = 6, size = Math.min(w - 40, h - 36), cell = size / n, ox = (w - size) / 2, oy = 20;
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      R(ctx, ox + j * cell, oy + i * cell, cell - 1, cell - 1, 'rgba(127,212,239,.08)', 'rgba(127,212,239,.14)');
    }
    var bx = Math.floor((t / 900) % (n - 2)), by = Math.floor((t / 1300) % (n - 2));
    ctx.strokeStyle = '#f4a6c0'; ctx.lineWidth = 1.6;
    ctx.strokeRect(ox + bx * cell, oy + by * cell, cell * 2.2, cell * 1.6);
    T(ctx, '0.92', ox + bx * cell, oy + by * cell - 3, '#f4a6c0', 8);
    T(ctx, '视觉：分类、检测（框）、分割（像素）都在同一张图上做', 8, 13);
  };

  B.nlp = function (ctx, w, h, t) {
    var words = ['张', '三', '在', '北京', '吃', '饭'];
    var tags = ['人名', '', '', '地名', '', ''];
    var colors = ['rgba(244,166,192,.28)', 'transparent', 'transparent', 'rgba(155,231,196,.28)', 'transparent', 'transparent'];
    var bw = Math.min(46, (w - 40) / words.length), x0 = (w - (words.length * bw + 5 * 6)) / 2;
    var hi = Math.floor((t / 700) % words.length);
    for (var i = 0; i < words.length; i++) {
      var x = x0 + i * (bw + 6), y = h / 2 - 14;
      R(ctx, x, y, bw, 22, i === hi ? 'rgba(127,212,239,.25)' : 'rgba(255,255,255,.05)',
        i === hi ? 'rgba(127,212,239,.7)' : 'rgba(255,255,255,.12)');
      T(ctx, words[i], x + bw / 2 - 6, y + 15, '#cdeefc', 11);
      if (tags[i]) {
        R(ctx, x, y + 24, bw, 12, colors[i]);
        T(ctx, tags[i], x + 4, y + 33, 'rgba(220,245,235,.8)', 8);
      }
    }
    T(ctx, 'NLP：分词、词性、实体、句义，一层层往抽象走', 8, 13);
  };

  B.asr = function (ctx, w, h, t) {
    var y = h / 2 + 4, k = (t * 0.0005) % 1;
    ctx.beginPath();
    for (var i = 0; i <= 200; i++) {
      var x = 20 + i / 200 * (w - 40);
      var amp = 7 * Math.sin(i * 0.35) * Math.sin(i * 0.02 + t * 0.002);
      i ? ctx.lineTo(x, y + amp) : ctx.moveTo(x, y + amp);
    }
    ctx.strokeStyle = 'rgba(127,212,239,.7)'; ctx.lineWidth = 1.2; ctx.stroke();
    var words = ['今', '天', '聊', '注', '意', '力'];
    for (var j = 0; j < words.length; j++) {
      var on = (j + 1) / words.length < k + 0.2;
      R(ctx, 20 + j * 40, 22, 34, 16, on ? 'rgba(155,231,196,.25)' : 'rgba(255,255,255,.04)',
        on ? 'rgba(155,231,196,.6)' : 'rgba(255,255,255,.1)');
      T(ctx, words[j], 30 + j * 40, 33, on ? '#dffff2' : 'rgba(200,220,230,.3)', 9);
    }
    T(ctx, '语音识别：波形 → 声学特征 → 文字（还要对齐时间）', 8, 13);
  };

  B.rec = function (ctx, w, h, t) {
    var n = 5, cell = 14, ox = 24, oy = 24;
    var fill = (Math.sin(t * 0.0008) + 1) / 2;
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      var known = (i + j) % 3 !== 0;
      var v = known ? 0.2 + 0.6 * Math.abs(Math.sin(i * 2 + j * 3)) : 0;
      if (!known && i === 1 && j === 2) {
        R(ctx, ox + j * cell, oy + i * cell, cell - 1, cell - 1,
          'rgba(230,207,154,' + (0.15 + 0.6 * fill) + ')', 'rgba(230,207,154,.9)');
        continue;
      }
      R(ctx, ox + j * cell, oy + i * cell, cell - 1, cell - 1,
        known ? 'rgba(127,212,239,' + (0.1 + 0.5 * v) + ')' : 'rgba(255,255,255,.04)',
        known ? 'rgba(127,212,239,.35)' : 'rgba(255,255,255,.1)');
    }
    T(ctx, '推荐：用户 × 物品 的矩阵里，空格就是要预测的偏好（金框）', 8, 13);
  };

  window.ML_BESPOKE = B;
})();
