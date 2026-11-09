/* 第二批专属图：Transformer 15 个 + 生成模型 12 个 */
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

  // ============ Transformer ============
  B.tfm = function (ctx, w, h, t) {
    var n = 5, bw = w - 60, bx = 30, bh = (h - 28) / n - 4;
    var k = (t * 0.0006) % 1;
    for (var i = 0; i < n; i++) {
      var y = h - 20 - (i + 1) * (bh + 4);
      var on = (k * n) > i;
      R(ctx, bx, y, bw, bh, on ? 'rgba(127,212,239,.2)' : 'rgba(255,255,255,.04)',
        on ? 'rgba(127,212,239,.55)' : 'rgba(255,255,255,.1)');
      T(ctx, '编码层 ' + (i + 1), bx + 6, y + bh / 2 + 3, on ? 'rgba(230,246,255,.9)' : 'rgba(200,220,230,.35)', 9);
    }
    var py = h - 20 - k * (h - 34);
    ctx.beginPath(); ctx.arc(bx + bw - 10, py, 3.5, 0, 6.283); ctx.fillStyle = P.gold; ctx.fill();
    T(ctx, '同一个 token 一层层往上走', 8, 13);
  };

  B.mha = function (ctx, w, h, t) {
    var heads = 3, gw = (w - 50) / heads, cell = 11;
    var step = Math.floor((t / 900) % 3);
    for (var hd = 0; hd < heads; hd++) {
      var ox = 20 + hd * gw, oy = 24;
      for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) {
        var v = hd === 0 ? (i === j ? 0.9 : 0.12)
          : hd === 1 ? (j === 1 ? 0.9 : 0.15)
            : ((i + j) % 2 ? 0.35 : 0.8);
        R(ctx, ox + j * cell, oy + i * cell, cell - 1, cell - 1,
          'rgba(244,166,192,' + (hd === step ? 0.25 + 0.6 * v : 0.08 + 0.3 * v) + ')');
      }
      T(ctx, '头 ' + (hd + 1), ox, h - 16, 'rgba(220,240,250,.6)', 9);
    }
    T(ctx, '每个头学一种关系：对角（自身）/ 竖列（同一位置）/ 棋盘（局部）', 8, 13);
  };

  B.pos = function (ctx, w, h, t) {
    var cols = 26, cw = (w - 24) / cols;
    for (var i = 0; i < cols; i++) {
      for (var d = 0; d < 3; d++) {
        var v = 0.5 + 0.5 * Math.sin(i / (2 + d * 3) + t * 0.001 * (1 + d));
        var y = 22 + d * ((h - 40) / 3);
        R(ctx, 12 + i * cw, y, cw - 1, (h - 40) / 3 - 3, 'rgba(127,212,239,' + (0.1 + 0.6 * v) + ')');
      }
    }
    var mx = 12 + ((t * 0.0004) % 1) * (w - 24);
    L(ctx, mx, 18, mx, h - 14, 'rgba(230,207,154,.8)', 1.5);
    T(ctx, '位置编码：不同维度用不同频率，同一位置有一串固定指纹', 8, 13);
  };

  B.bert = function (ctx, w, h, t) {
    var words = ['我', '们', '在', '读', '这', '页'];
    var n = words.length, bw = Math.min(44, (w - 40) / n), gap = 6;
    var total = n * bw + (n - 1) * gap, x0 = (w - total) / 2, y = h / 2 - 10;
    var maskA = Math.floor((t / 1400) % n), maskB = (maskA + 3) % n;
    for (var i = 0; i < n; i++) {
      var masked = (i === maskA || i === maskB);
      R(ctx, x0 + i * (bw + gap), y, bw, 22, masked ? 'rgba(244,166,192,.28)' : 'rgba(127,212,239,.14)',
        masked ? 'rgba(244,166,192,.8)' : 'rgba(127,212,239,.35)');
      T(ctx, masked ? '?' : words[i], x0 + i * (bw + gap) + bw / 2 - 6, y + 15, masked ? '#ffe4ef' : '#cdeefc', 11);
    }
    AR(ctx, x0 - 6, y + 30, x0 + (maskA + 0.5) * (bw + gap), y + 24, 'rgba(155,231,196,.6)');
    AR(ctx, w - 6, y + 30, x0 + (maskA + 0.5) * (bw + gap), y + 24, 'rgba(155,231,196,.6)');
    T(ctx, 'BERT：挖掉几个词，让它用左右两边一起猜（双向）', 8, 13);
  };

  B.gpt = function (ctx, w, h, t) {
    var words = ['我', '们', '在', '读', '这', '页'];
    var shown = 1 + Math.floor((t / 700) % words.length);
    var bw = Math.min(46, (w - 40) / words.length), gap = 6;
    var x0 = 20, y = h / 2 - 10;
    for (var i = 0; i < words.length; i++) {
      if (i >= shown) break;
      var last = (i === shown - 1);
      R(ctx, x0 + i * (bw + gap), y, bw, 22, last ? 'rgba(155,231,196,.3)' : 'rgba(127,212,239,.14)',
        last ? 'rgba(155,231,196,.8)' : 'rgba(127,212,239,.35)');
      T(ctx, words[i], x0 + i * (bw + gap) + bw / 2 - 6, y + 15, last ? '#eafff6' : '#cdeefc', 11);
    }
    var cx = x0 + shown * (bw + gap);
    L(ctx, cx, y - 6, cx, y + 26, 'rgba(230,207,154,.8)', 1.5, [3, 3]);
    T(ctx, 'GPT：只往右看，一次吐一个词', 8, 13);
  };

  B.t5 = function (ctx, w, h, t) {
    var stages = ['translate: 你好', '编码器', '解码器', 'hello'];
    var gap = (w - 40) / (stages.length - 1), step = Math.floor((t / 800) % stages.length);
    stages.forEach(function (s, i) {
      var x = 20 + i * gap;
      var on = i <= step;
      R(ctx, x - 14, h / 2 - 12, 44, 24, on ? 'rgba(127,212,239,.2)' : 'rgba(255,255,255,.04)',
        on ? 'rgba(127,212,239,.6)' : 'rgba(255,255,255,.1)');
      T(ctx, s, x - 10, h / 2 + 4, on ? '#cdeefc' : 'rgba(200,220,230,.4)', 9);
      if (i < stages.length - 1) AR(ctx, x + 30, h / 2, x + gap - 16, h / 2, 'rgba(127,212,239,.45)');
    });
    T(ctx, 'T5：任何任务都写成「输入文本 → 输出文本」', 8, 13);
  };

  B.vit = function (ctx, w, h, t) {
    var n = 4, size = Math.min(h - 40, 90), cell = size / n, ox = 20, oy = 22;
    var k = (t * 0.0005) % 1;
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      var idx = i * n + j;
      var fly = Math.max(0, Math.min(1, (k * 20 - idx) / 4));
      var x = ox + j * cell + fly * (w - ox - size - 30 - ox);
      var y = oy + i * cell * (1 - fly) + fly * (h / 2 - 8);
      R(ctx, x, y, cell - 2, cell - 2, 'rgba(155,231,196,' + (0.2 + 0.5 * (1 - fly)) + ')', 'rgba(155,231,196,.7)');
    }
    T(ctx, 'ViT：图像切成 patch，排成一串送进 Transformer', 8, 13);
  };

  B.swin = function (ctx, w, h, t) {
    var n = 6, size = Math.min(w - 40, h - 34), cell = size / n, ox = (w - size) / 2, oy = 22;
    var shift = (Math.floor(t / 1400) % 2);
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      R(ctx, ox + j * cell, oy + i * cell, cell - 1, cell - 1, 'rgba(127,212,239,.12)', 'rgba(127,212,239,.2)');
    }
    var off = shift ? cell / 2 : 0;
    for (var a = 0; a <= 3; a++) {
      L(ctx, ox + a * 2 * cell + off, oy, ox + a * 2 * cell + off, oy + size, 'rgba(244,166,192,.8)', 1.5);
      L(ctx, ox, oy + a * 2 * cell + off, ox + size, oy + a * 2 * cell + off, 'rgba(244,166,192,.8)', 1.5);
    }
    T(ctx, shift ? 'Swin：窗口整体移位半格，跨窗也能交换信息' : 'Swin：先在小窗口内做注意力', 8, 13);
  };

  B.clip = function (ctx, w, h, t) {
    var k = (Math.sin(t * 0.0012) + 1) / 2;
    var ax = 40 + k * (w / 2 - 70), bx = w - 40 - k * (w / 2 - 70);
    var y = h / 2;
    R(ctx, 20, y - 14, 34, 28, 'rgba(127,212,239,.22)', 'rgba(127,212,239,.6)');
    T(ctx, '图', 30, y + 5, '#cdeefc', 11);
    R(ctx, w - 54, y - 14, 34, 28, 'rgba(244,166,192,.22)', 'rgba(244,166,192,.6)');
    T(ctx, '文', w - 44, y + 5, '#ffe4ef', 11);
    ctx.beginPath(); ctx.arc(ax, y, 4, 0, 6.283); ctx.fillStyle = P.blue; ctx.fill();
    ctx.beginPath(); ctx.arc(bx, y, 4, 0, 6.283); ctx.fillStyle = P.pink; ctx.fill();
    L(ctx, ax, y, bx, y, 'rgba(230,207,154,.5)', 1, [3, 3]);
    T(ctx, '相似度 ' + (1 - Math.abs(ax - bx) / (w - 80)).toFixed(2), w / 2 - 30, y - 12, P.gold, 11);
    T(ctx, 'CLIP：把图和文拉到同一个空间，配对的距离近', 8, 13);
  };

  B.whisper = function (ctx, w, h, t) {
    var n = 30, bw = (w - 40) / n;
    var head = (t * 0.004) % (n + 10);
    for (var i = 0; i < n; i++) {
      var v = Math.abs(Math.sin(i * 0.7 + t * 0.001)) * 0.8 + 0.1;
      var on = i < head;
      R(ctx, 20 + i * bw, h - 20 - v * (h - 52), bw - 1, v * (h - 52),
        on ? 'rgba(244,166,192,.5)' : 'rgba(127,212,239,.2)');
    }
    R(ctx, 20, 20, w - 40, 16, 'rgba(155,231,196,.14)', 'rgba(155,231,196,.4)');
    T(ctx, '转写：今天我们聊聊注意力机制…', 24, 32, 'rgba(220,245,235,.85)', 9);
    T(ctx, 'Whisper：声谱一帧帧扫过，同时吐出文字', 8, 13);
  };

  B.llm = function (ctx, w, h, t) {
    var k = ((t * 0.0004) % 1);
    var labels = ['参数', '数据', '算力'];
    for (var i = 0; i < 3; i++) {
      var bw = (w - 60) / 3;
      var bh = (h - 44) * Math.min(1, k * 3 - i * 0.6);
      bh = Math.max(4, bh);
      R(ctx, 30 + i * bw, h - 20 - bh, bw - 16, bh, 'rgba(230,207,154,.22)', 'rgba(230,207,154,.6)');
      T(ctx, labels[i], 30 + i * bw, h - 6, 'rgba(220,238,248,.65)', 9);
    }
    ctx.beginPath();
    for (var j = 0; j <= 40; j++) {
      var u = j / 40;
      var x = 30 + u * (w - 60);
      var y = h - 30 - Math.pow(u, 3) * (h - 50);
      j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = 'rgba(155,231,196,.85)'; ctx.lineWidth = 1.8; ctx.stroke();
    T(ctx, '参数量、数据、算力一起涨，能力曲线在某个点突然抬头', 8, 13);
  };

  B.sft = function (ctx, w, h, t) {
    var pairs = [['解释一下 LoRA', '低秩旁路…'], ['写个快排', 'def qsort…'], ['翻译这句', 'Hello…']];
    var step = Math.floor((t / 900) % (pairs.length + 1));
    for (var i = 0; i < pairs.length; i++) {
      var y = 24 + i * 22;
      var ok = i < step;
      R(ctx, 20, y, 92, 16, 'rgba(127,212,239,.14)', 'rgba(127,212,239,.4)');
      T(ctx, pairs[i][0], 24, y + 11, 'rgba(210,236,248,.8)', 9);
      AR(ctx, 114, y + 8, 130, y + 8, ok ? 'rgba(155,231,196,.8)' : 'rgba(255,255,255,.15)');
      R(ctx, 132, y, w - 152, 16, ok ? 'rgba(155,231,196,.2)' : 'rgba(255,255,255,.04)',
        ok ? 'rgba(155,231,196,.6)' : 'rgba(255,255,255,.1)');
      T(ctx, pairs[i][1], 136, y + 11, ok ? '#dffff2' : 'rgba(200,220,230,.35)', 9);
    }
    T(ctx, 'SFT：拿「指令 → 回答」成对数据做监督微调', 8, 13);
  };

  B.rlhf = function (ctx, w, h, t) {
    var k = (Math.sin(t * 0.0013) + 1) / 2;
    var ra = 0.45 + 0.45 * k, rb = 0.9 - 0.45 * k;
    var bw = 60, y0 = h - 22;
    R(ctx, 40, y0 - ra * (h - 50), bw, ra * (h - 50), 'rgba(155,231,196,.28)', 'rgba(155,231,196,.7)');
    R(ctx, 120, y0 - rb * (h - 50), bw, rb * (h - 50), 'rgba(244,166,192,.22)', 'rgba(244,166,192,.6)');
    T(ctx, '回答 A', 44, y0 + 10, 'rgba(220,245,235,.8)', 9);
    T(ctx, '回答 B', 124, y0 + 10, 'rgba(255,228,239,.75)', 9);
    T(ctx, '奖励模型打分', 200, 24, 'rgba(191,232,246,.7)', 10);
    T(ctx, '高分的被强化，低分的被压低 → 更新策略', 8, 13);
    AR(ctx, 200, h / 2, 200 + 30 * k, h / 2 - 20 * k, 'rgba(230,207,154,.8)');
  };

  B.rag = function (ctx, w, h, t) {
    var step = Math.floor((t / 1000) % 3);
    R(ctx, 16, h / 2 - 10, 52, 20, 'rgba(127,212,239,.2)', 'rgba(127,212,239,.6)');
    T(ctx, '问题', 28, h / 2 + 4, '#cdeefc', 10);
    var hit = 1;
    for (var i = 0; i < 3; i++) {
      var y = 20 + i * 22;
      var on = (step >= 1 && i === hit);
      R(ctx, 90, y, w - 110, 16, on ? 'rgba(155,231,196,.28)' : 'rgba(255,255,255,.05)',
        on ? 'rgba(155,231,196,.75)' : 'rgba(255,255,255,.1)');
      T(ctx, '文档 ' + (i + 1), 96, y + 11, on ? '#dffff2' : 'rgba(200,220,230,.35)', 9);
    }
    if (step >= 1) AR(ctx, 68, h / 2, 88, h / 2 - 10, 'rgba(230,207,154,.7)');
    if (step >= 2) {
      R(ctx, 16, 20, 52, 16, 'rgba(230,207,154,.2)', 'rgba(230,207,154,.7)');
      T(ctx, '回答', 28, 31, '#fff4d0', 9);
    }
    T(ctx, 'RAG：先检索最相关的文档，再把它塞进上下文里回答', 8, 13);
  };

  B.longctx = function (ctx, w, h, t) {
    var n = 22, cw = (w - 40) / n;
    var win = 5, start = Math.floor((t / 400) % (n - win));
    for (var i = 0; i < n; i++) {
      var inWin = i >= start && i < start + win;
      R(ctx, 20 + i * cw, 26, cw - 1, 16, inWin ? 'rgba(127,212,239,.35)' : 'rgba(255,255,255,.06)',
        inWin ? 'rgba(127,212,239,.7)' : 'rgba(255,255,255,.1)');
      if (i < start) R(ctx, 20 + i * cw, h - 30, cw - 1, 12, 'rgba(230,207,154,.35)', 'rgba(230,207,154,.6)');
    }
    T(ctx, '当前窗口（蓝）在长文本上滑动，已看过的 KV 缓存（下排金）越积越多', 8, 13);
  };

  // ============ 生成模型 ============
  B.gen = function (ctx, w, h, t) {
    var k = (Math.sin(t * 0.0007) + 1) / 2;
    var n = 20, bw = (w - 40) / n;
    for (var i = 0; i < n; i++) {
      var u = i / (n - 1);
      var real = Math.exp(-Math.pow((u - 0.32) / 0.14, 2));
      var model = Math.exp(-Math.pow((u - (0.55 + 0.22 * (1 - k))) / (0.1 + 0.12 * k), 2));
      R(ctx, 20 + i * bw, h - 20 - real * (h - 40), bw - 1, real * (h - 40), 'rgba(230,207,154,.45)');
      R(ctx, 20 + i * bw, h - 20 - model * (h - 40), bw - 1, model * (h - 40), 'rgba(244,166,192,.45)');
    }
    T(ctx, '生成模型：让粉色（模型分布）慢慢贴合金色（真实分布）', 8, 13);
  };

  B.ae = function (ctx, w, h, t) {
    var k = (Math.sin(t * 0.0008) + 1) / 2;
    var gx = 18, gy = 24, cell = 10;
    for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) {
      R(ctx, gx + j * cell, gy + i * cell, cell - 1, cell - 1, 'rgba(127,212,239,' + (0.25 + 0.5 * ((i + j) % 3) / 3) + ')');
    }
    var bx = w / 2 - 5;
    for (var q = 0; q < 4; q++) R(ctx, bx, 26 + q * 12, 10, 10, 'rgba(230,207,154,' + (0.3 + 0.4 * (1 - k)) + ')');
    var rx = w - 62;
    for (var a = 0; a < 4; a++) for (var b = 0; b < 4; b++) {
      var known = ((a + b) % 3) / 3;
      R(ctx, rx + b * cell, gy + a * cell, cell - 1, cell - 1,
        'rgba(155,231,196,' + (0.15 + 0.5 * (known * k + 0.3)) + ')');
    }
    AR(ctx, 60, h / 2, bx - 6, h / 2, 'rgba(127,212,239,.5)');
    AR(ctx, bx + 16, h / 2, rx - 6, h / 2, 'rgba(155,231,196,.5)');
    T(ctx, '自编码器：压成 4 个数的瓶颈，再还原（右侧会糊一点）', 8, 13);
  };

  B.dcgan = function (ctx, w, h, t) {
    var phase = Math.floor(t / 900) % 2;
    var gy = h / 2;
    for (var i = 0; i < 3; i++) {
      R(ctx, 24 + i * 30, gy - 14 + i * 4, 24, 28 - i * 8,
        phase === 0 ? 'rgba(244,166,192,.3)' : 'rgba(244,166,192,.1)',
        phase === 0 ? 'rgba(244,166,192,.8)' : 'rgba(244,166,192,.3)');
    }
    R(ctx, w / 2 - 12, gy - 16, 24, 32, 'rgba(230,207,154,.25)', 'rgba(230,207,154,.7)');
    for (var j = 0; j < 3; j++) {
      R(ctx, w - 130 + j * 30, gy - 14, 24, 28,
        phase === 1 ? 'rgba(127,212,239,.3)' : 'rgba(127,212,239,.1)',
        phase === 1 ? 'rgba(127,212,239,.8)' : 'rgba(127,212,239,.3)');
    }
    AR(ctx, 120, gy, w / 2 - 18, gy, 'rgba(244,166,192,.6)');
    AR(ctx, w / 2 + 16, gy, w - 134, gy, 'rgba(127,212,239,.6)');
    T(ctx, phase === 0 ? '生成器在造图（粉）' : '判别器在打分（蓝）', 8, 13);
  };

  B.wgan = function (ctx, w, h, t) {
    var x0 = 22, y0 = h - 18;
    L(ctx, x0, y0, w - 20, y0, 'rgba(255,255,255,.12)', 1);
    ctx.beginPath();
    for (var i = 0; i <= 60; i++) {
      var u = i / 60;
      var x = x0 + u * (w - 42);
      var y = y0 - (0.25 + 0.05 * u) * (h - 40);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = 'rgba(244,166,192,.8)'; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.beginPath();
    for (var j = 0; j <= 60; j++) {
      var u2 = j / 60;
      var x2 = x0 + u2 * (w - 42);
      var y2 = y0 - (0.05 + 0.9 * u2) * (h - 40);
      j ? ctx.lineTo(x2, y2) : ctx.moveTo(x2, y2);
    }
    ctx.strokeStyle = 'rgba(127,212,239,.9)'; ctx.stroke();
    T(ctx, 'WGAN：判别器给出的是距离（蓝，线性增长），不是概率（粉，饱和）', 8, 13);
  };

  B.stylegan = function (ctx, w, h, t) {
    var step = Math.floor((t / 800) % 3);
    var bands = ['粗：姿态', '中：五官', '细：纹理'];
    for (var i = 0; i < 3; i++) {
      var y = 22 + i * 20;
      var on = i <= step;
      R(ctx, 20, y, 90, 14, on ? 'rgba(230,207,154,.22)' : 'rgba(255,255,255,.04)',
        on ? 'rgba(230,207,154,.7)' : 'rgba(255,255,255,.1)');
      T(ctx, bands[i], 24, y + 10, on ? '#fff4d0' : 'rgba(200,220,230,.35)', 9);
      if (on) AR(ctx, 112, y + 7, 140, h / 2, 'rgba(230,207,154,.5)');
    }
    var fx = w - 90, fy = 26;
    for (var a = 0; a < 5; a++) for (var b = 0; b < 5; b++) {
      R(ctx, fx + b * 12, fy + a * 12, 11, 11, 'rgba(244,166,192,' + (0.08 + 0.06 * step + 0.1 * ((a * b) % 3) / 3) + ')');
    }
    T(ctx, 'StyleGAN：风格按粗细分层注入，先定轮廓再补细节', 8, 13);
  };

  B.cyclegan = function (ctx, w, h, t) {
    var k = (t * 0.0005) % 1;
    var ax = 34, bx = w - 34, y = h / 2;
    R(ctx, ax - 16, y - 16, 32, 32, 'rgba(127,212,239,.2)', 'rgba(127,212,239,.6)');
    T(ctx, 'A', ax - 4, y + 4, '#cdeefc', 11);
    R(ctx, bx - 16, y - 16, 32, 32, 'rgba(244,166,192,.2)', 'rgba(244,166,192,.6)');
    T(ctx, 'B', bx - 4, y + 4, '#ffe4ef', 11);
    AR(ctx, ax + 18, y - 8, bx - 18, y - 8, 'rgba(127,212,239,.6)');
    AR(ctx, bx - 18, y + 8, ax + 18, y + 8, 'rgba(244,166,192,.6)');
    ctx.beginPath();
    ctx.arc(ax, y, 52 + k * 6, -1.1, 1.1);
    ctx.strokeStyle = 'rgba(230,207,154,.55)'; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
    T(ctx, 'CycleGAN：A→B→A 要转得回来，所以不需要成对数据', 8, 13);
  };

  B.ddpm = function (ctx, w, h, t) {
    var n = 8, bw = (w - 40) / n;
    var reveal = (t * 0.0006) % 1;
    for (var i = 0; i < n; i++) {
      var noise = i / (n - 1);
      var on = i / n < reveal;
      R(ctx, 20 + i * bw, 24, bw - 3, 30, 'rgba(' + Math.round(127 + 110 * noise) + ',' +
        Math.round(212 - 60 * noise) + ',' + Math.round(239 - 40 * noise) + ',' + (on ? 0.55 : 0.2) + ')');
    }
    var y0 = h - 18;
    ctx.beginPath();
    for (var j = 0; j <= 60; j++) {
      var u = j / 60;
      var x = 20 + u * (w - 40);
      var y = y0 - Math.cos(u * Math.PI / 2) * (h - 70);
      j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = 'rgba(230,207,154,.8)'; ctx.stroke();
    T(ctx, 'DDPM：ᾱ 从 1 平滑降到 0，图一步步变成纯噪声（曲线就是时间表）', 8, 13);
  };

  B.ddim = function (ctx, w, h, t) {
    var n = 8, bw = (w - 40) / n;
    for (var i = 0; i < n; i++) {
      R(ctx, 20 + i * bw, 26, bw - 4, 24, 'rgba(127,212,239,' + (0.1 + 0.5 * (i / n)) + ')');
      T(ctx, 't' + i, 20 + i * bw + 4, 64, 'rgba(200,226,240,.5)', 8);
    }
    for (var j = 0; j < n - 2; j += 2) {
      AR(ctx, 20 + (j + 1) * bw - 4, 18, 20 + (j + 3) * bw - 4, 18, 'rgba(230,207,154,.8)');
    }
    T(ctx, 'DDIM：跳着走（每两步才采一次），步数少一半', 8, 13);
  };

  B.ldm = function (ctx, w, h, t) {
    var step = Math.floor((t / 900) % 4);
    var labels = ['图像', '编码', '潜空间扩散', '解码'];
    var gap = (w - 50) / 3;
    labels.forEach(function (s, i) {
      var x = 25 + i * gap;
      var on = i <= step;
      R(ctx, x - 16, h / 2 - 14, 40, 28, on ? 'rgba(155,231,196,.2)' : 'rgba(255,255,255,.04)',
        on ? 'rgba(155,231,196,.65)' : 'rgba(255,255,255,.1)');
      T(ctx, s, x - 12, h / 2 + 4, on ? '#dffff2' : 'rgba(200,220,230,.35)', 8);
      if (i < 3) AR(ctx, x + 26, h / 2, x + gap - 18, h / 2, 'rgba(155,231,196,.45)');
    });
    T(ctx, '潜空间扩散：在压缩后的小图上加噪/去噪，算力省一个量级', 8, 13);
  };

  B.controlnet = function (ctx, w, h, t) {
    var k = ((Math.sin(t * 0.0009) + 1) / 2);
    R(ctx, 20, 26, 48, 40, 'rgba(127,212,239,.16)', 'rgba(127,212,239,.55)');
    T(ctx, '边缘图', 22, 74, 'rgba(200,226,240,.6)', 8);
    R(ctx, w - 112, 26, 90, 40, 'rgba(244,166,192,' + (0.08 + 0.3 * k) + ')', 'rgba(244,166,192,.6)');
    T(ctx, '生成结果', w - 106, 74, 'rgba(255,228,239,.6)', 8);
    AR(ctx, 72, 46, w - 116, 46, 'rgba(230,207,154,.6)');
    R(ctx, w / 2 - 30, 14, 60, 10, 'rgba(255,255,255,.07)');
    R(ctx, w / 2 - 30, 14, 60 * (0.25 + 0.75 * k), 10, 'rgba(230,207,154,.6)');
    T(ctx, '强度', w / 2 - 26, 10, 'rgba(200,220,230,.6)', 8);
    T(ctx, 'ControlNet：把条件（线稿/姿态）接进扩散，强度可调', 8, 13);
  };

  B.flow = function (ctx, w, h, t) {
    var k = (Math.sin(t * 0.001) + 1) / 2;
    var n = 14, bw = (w - 60) / n;
    for (var i = 0; i < n; i++) {
      var u = i / (n - 1);
      var shift = (u - 0.5) * k * 0.8;
      var v = Math.exp(-Math.pow((u - 0.5 - shift) / 0.18, 2));
      R(ctx, 30 + i * bw, h - 20 - v * (h - 44), bw - 1, v * (h - 44), 'rgba(127,212,239,0.15)', 'rgba(127,212,239,.45)');
    }
    T(ctx, '归一化流：一个可逆变换，把简单分布「揉」成复杂分布（还能揉回去）', 8, 13);
  };

  B.tts = function (ctx, w, h, t) {
    var playhead = ((t * 0.0006) % 1) * (w - 40);
    for (var i = 0; i < 26; i++) {
      var v = Math.abs(Math.sin(i * 0.9)) * 0.7 + 0.15;
      R(ctx, 20 + i * ((w - 40) / 26), 24, 5, v * 18, 'rgba(230,207,154,.55)');
    }
    var y = h - 26;
    ctx.beginPath();
    for (var j = 0; j <= 200; j++) {
      var x = 20 + j / 200 * (w - 40);
      var amp = 8 * Math.sin(j * 0.6) * Math.exp(-Math.pow((j - 100) / 90, 2));
      j ? ctx.lineTo(x, y + amp) : ctx.moveTo(x, y + amp);
    }
    ctx.strokeStyle = 'rgba(155,231,196,.85)'; ctx.lineWidth = 1.2; ctx.stroke();
    L(ctx, 20 + playhead, 20, 20 + playhead, h - 12, 'rgba(244,166,192,.7)', 1, [3, 3]);
    T(ctx, '声码器：把频谱（上）还原成波形（下）', 8, 13);
  };

  window.ML_BESPOKE = B;
})();
