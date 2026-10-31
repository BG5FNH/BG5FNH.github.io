/* BG5FNH 电脑端 3D 主场景（three.js r128）
   交互：
   1. 顶视图：X 轴主线 + 金色导航点
   2. 点击导航点：镜头从左侧慢速旋转/拉近到 YZ 平面树状图
   3. 点击树状图节点：节点发光，内容界面从该点浮现，背景神经元轻微模糊
   4. 按住空白处拖动：平移视图，便于查看界面外的节点
*/
(function () {
  'use strict';

  var CFG = window.BG5FNH_WAYPOINTS;
  if (!CFG) return;
  var MOBILE_LAYOUT = window.BG5FNH_MOBILE_LAYOUT === true;
  var MOBILE_Y_STEP = 2.0;
  // 按导航点数量把竖线在屏幕里居中（3 个点就是 +2 / 0 / -2，不会全挤在上半屏）
  var MOBILE_TOP_Y = Math.max(0, (CFG.mainLine.nodes.length - 1) * MOBILE_Y_STEP / 2);
  var MOBILE_LINE_X = -2.0;
  var MOBILE_FOCUS_DIST = 26;

  var fallbackEl = document.getElementById('fallback');
  if (!window.THREE) {
    if (fallbackEl) fallbackEl.style.display = 'flex';
    return;
  }

  var GOLD = 0xc9a86a;
  var GOLD_SOFT = 0x8a7348;
  var BG = 0x0b0b0d;

  var stage = document.getElementById('stage');
  var overlay = document.getElementById('overlay');
  var backBtn = document.getElementById('backToOverview');
  var hintEl = document.getElementById('hint');
  var pageOverlay = document.getElementById('pageOverlay');
  var pageFrame = document.getElementById('pageFrame');
  var versionBadge = document.getElementById('versionBadge');
  var siteTitle = document.getElementById('siteTitle');

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
  if (MOBILE_LAYOUT) { camera.position.set(0, 0, 18); } else { camera.position.set(CFG.mainLine.cameraOverview.x, CFG.mainLine.cameraOverview.y, CFG.mainLine.cameraOverview.z); }
  if (MOBILE_LAYOUT) { camera.up.set(0, 1, 0); } else { camera.up.set(0, 0, -1); }
  if (MOBILE_LAYOUT) { camera.lookAt(0, 0, 0); } else { camera.lookAt(CFG.mainLine.cameraLookAtOverview.x, CFG.mainLine.cameraLookAtOverview.y, CFG.mainLine.cameraLookAtOverview.z); }
  var viewLookAt = MOBILE_LAYOUT ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(CFG.mainLine.cameraLookAtOverview.x, CFG.mainLine.cameraLookAtOverview.y, CFG.mainLine.cameraLookAtOverview.z);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  stage.appendChild(renderer.domElement);

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInQuad(t) { return t * t; }

  function hexColor(str, fallback) {
    if (typeof str === 'string' && str.charAt(0) === '#') {
      var n = parseInt(str.slice(1), 16);
      if (!isNaN(n)) return n;
    }
    return fallback;
  }
  function colorToCss(n) {
    return '#' + ('00000' + Math.floor(n).toString(16)).slice(-6);
  }
  function colorToRgba(n, a) {
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function makeGlowTexture(size) {
    size = size || 64;
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');
    var half = size / 2;
    var g = ctx.createRadialGradient(half, half, 0, half, half, half);
    g.addColorStop(0, 'rgba(240,226,196,1)');
    g.addColorStop(0.22, 'rgba(201,168,106,0.95)');
    g.addColorStop(0.45, 'rgba(201,168,106,0.55)');
    g.addColorStop(0.7, 'rgba(138,115,72,0.18)');
    g.addColorStop(1, 'rgba(138,115,72,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    var tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  var glowTexture = makeGlowTexture(64);

  function makeGlowSprite(scale, color) {
    var mat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: color !== undefined ? color : GOLD,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    var sprite = new THREE.Sprite(mat);
    sprite.scale.set(scale, scale, 1);
    return sprite;
  }

  function makeLine(points, color, opacity) {
    var geo = new THREE.BufferGeometry().setFromPoints(points);
    var mat = new THREE.LineBasicMaterial({
      color: color !== undefined ? color : GOLD,
      transparent: true,
      opacity: opacity !== undefined ? opacity : 0,
      depthWrite: false
    });
    return new THREE.Line(geo, mat);
  }

  // YZ 平面方向。相机从 -X 一侧看过来，屏幕右为 +Z，屏幕左为 -Z。
  var DIR_VECTORS = {
    'center': [0, 0, 0],
    'up': [0, 1, 0],
    'down': [0, -1, 0],
    'left': [0, 0, -1],
    'right': [0, 0, 1],
    'up-left': [0, 0.7071, -0.7071],
    'up-right': [0, 0.7071, 0.7071],
    'down-left': [0, -0.7071, -0.7071],
    'down-right': [0, -0.7071, 0.7071]
  };
  var DIR_VECTORS_MOBILE = {
    'center': [0, 0, 0],
    'up': [0, 0, -1],
    'down': [0, 0, 1],
    'left': [-1, 0, 0],
    'right': [1, 0, 0],
    'up-left': [-0.7071, 0, -0.7071],
    'up-right': [0.7071, 0, -0.7071],
    'down-left': [-0.7071, 0, 0.7071],
    'down-right': [0.7071, 0, 0.7071]
  };
  var DEFAULT_CHILD_DISTANCE = 3.6;

  function buildChildPosition(mainPos, childDef) {
    if (childDef.x !== undefined && childDef.y !== undefined && childDef.z !== undefined) {
      return new THREE.Vector3(childDef.x, childDef.y, childDef.z);
    }
    var table = MOBILE_LAYOUT ? DIR_VECTORS_MOBILE : DIR_VECTORS;
      var dir = table[childDef.dir] || table.center;
    var dist = childDef.distance !== undefined ? childDef.distance : DEFAULT_CHILD_DISTANCE;
    var baseY = mainPos.y;
    var baseZ = mainPos.z;
    return new THREE.Vector3(
      mainPos.x + dir[0] * dist,
      baseY + dir[1] * dist,
      baseZ + dir[2] * dist
    );
  }

  function placePoint(center, h, v) {
    var unit = CFG.gridUnit || 3.6;
    if (MOBILE_LAYOUT) {
      return new THREE.Vector3(center.x + h * unit, center.y, center.z - v * unit);
    }
    return new THREE.Vector3(center.x, center.y + v * unit, center.z + h * unit);
  }

  function createNodeUI(labelText, big) {
    var hit = document.createElement('button');
    hit.type = 'button';
    hit.className = 'node-hit';
    hit.setAttribute('aria-label', labelText);
    overlay.appendChild(hit);

    var label = document.createElement('div');
    label.className = 'node-label' + (big ? ' big' : '');
    label.textContent = labelText;
    overlay.appendChild(label);

    return { hit: hit, label: label };
  }

  var mainNodes = [];
  var childNodes = [];

    var mainLine;
    if (!MOBILE_LAYOUT) {
  var mainLinePoints = CFG.mainLine.nodes.map(function (n) {
    return new THREE.Vector3(n.x, CFG.mainLine.y, CFG.mainLine.z);
  });
  var mainLineXs = CFG.mainLine.nodes.map(function (n) { return n.x; });
    var mainLineMinX = Math.min.apply(null, mainLineXs);
    var mainLineMaxX = Math.max.apply(null, mainLineXs);
    var mainLineLength = Math.max(0.01, mainLineMaxX - mainLineMinX);
      var mainLineThick = (window.innerWidth <= 768 && 'ontouchstart' in window) ? 0.32 : 0.22;
    mainLine = new THREE.Mesh(
      new THREE.BoxGeometry(mainLineLength, mainLineThick, mainLineThick),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 1.0, depthTest: false, depthWrite: false })
    );
    mainLine.position.set((mainLineMinX + mainLineMaxX) / 2, CFG.mainLine.y, CFG.mainLine.z);
    } else {
      var mobileYs = CFG.mainLine.nodes.map(function (n, i) { return MOBILE_TOP_Y - i * MOBILE_Y_STEP; });
      var mobileMinY = Math.min.apply(null, mobileYs);
      var mobileMaxY = Math.max.apply(null, mobileYs);
      var mobileLineLen = Math.max(0.01, mobileMaxY - mobileMinY);
      var mobileThick = 0.08;
      mainLine = new THREE.Mesh(
        new THREE.BoxGeometry(mobileThick, mobileLineLen, mobileThick),
        new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 1.0, depthTest: false, depthWrite: false })
      );
      mainLine.position.set(MOBILE_LINE_X, (mobileMinY + mobileMaxY) / 2, 0);
    }
  scene.add(mainLine);
    mainLine.renderOrder = 1;

  CFG.mainLine.nodes.forEach(function (mainDef, index) {
    var mainPos = MOBILE_LAYOUT ? new THREE.Vector3(MOBILE_LINE_X, MOBILE_TOP_Y - index * MOBILE_Y_STEP, 0) : new THREE.Vector3(mainDef.x, CFG.mainLine.y, CFG.mainLine.z);
    var spriteScale = (mainDef.scale !== undefined ? mainDef.scale * 1.1 : 1.1) * (MOBILE_LAYOUT ? 0.6 : 1);
    var sprite = makeGlowSprite(spriteScale, GOLD);
    sprite.position.copy(mainPos);
    scene.add(sprite);

    var ui = createNodeUI(mainDef.name, mainDef.scale > 1.2);
    ui.hit.addEventListener('click', function () { onMainNodeClick(mainDef); });
    ui.label.addEventListener('click', function () { onMainNodeClick(mainDef); });

    mainNodes.push({
      kind: 'main',
      def: mainDef,
      pos: mainPos,
      sprite: sprite,
      ui: ui
    });

    function addChildNodes(parentPos, childDefs) {
        (childDefs || []).forEach(function (childDef) {
      var childPos = buildChildPosition(parentPos, childDef);
      var childSprite = makeGlowSprite(childDef.scale || 0.85, GOLD);
      childSprite.position.copy(childPos);
      scene.add(childSprite);

      var childUI = createNodeUI(childDef.name, false);

      var node = {
        kind: 'child',
        def: childDef,
        mainDef: mainDef,
        pos: childPos,
        sprite: childSprite,
        ui: childUI,
        line: null,
        baseScale: childDef.scale || 0.85
      };
      childNodes.push(node);

      childUI.hit.addEventListener('click', function () { onPointClick(node); });
      childUI.label.addEventListener('click', function () { onPointClick(node); });

      if (childPos.distanceTo(parentPos) > 0.001) {
        var line = makeLine([parentPos.clone(), childPos.clone()], GOLD, 0);
        scene.add(line);
        node.line = line;
      }
          if (childDef.children && childDef.children.length) {
            addChildNodes(childPos, childDef.children);
          }

    });
      }
      addChildNodes(mainPos, mainDef.children);

        // 新坐标制：points 配置 + path 文件夹嵌套决定父子关系
        var pointDefs = mainDef.points || [];
        function getPointByPath(path) {
          for (var pi = 0; pi < pointDefs.length; pi++) {
            if (pointDefs[pi].path === path) return pointDefs[pi];
          }
          return null;
        }
        function getParentPath(path) {
          var slashIndex = path.lastIndexOf('/');
          return slashIndex === -1 ? null : path.slice(0, slashIndex);
        }
        function pointPosToWorld(h, v) {
          var unit = CFG.gridUnit || 3.6;
          if (MOBILE_LAYOUT) {
            return new THREE.Vector3(mainPos.x + h * unit, mainPos.y, mainPos.z - v * unit);
          }
          return new THREE.Vector3(mainPos.x, mainPos.y + v * unit, mainPos.z + h * unit);
        }

        pointDefs.forEach(function (pointDef) {
          var childPos = pointPosToWorld(pointDef.pos[0], pointDef.pos[1]);
          var entryColor = pointDef.universe ? universeAccent(pointDef) : GOLD;
          var childSprite = makeGlowSprite(pointDef.scale || 0.85, entryColor);
          childSprite.position.copy(childPos);
          scene.add(childSprite);

          var childUI = createNodeUI(pointDef.name, false);
          if (pointDef.universe) {
            childUI.label.style.color = colorToCss(entryColor);
            childUI.label.style.textShadow = '0 0 12px ' + colorToRgba(entryColor, 0.35);
          }
          var node = {
            kind: 'child',
            def: pointDef,
            mainDef: mainDef,
            pos: childPos,
            sprite: childSprite,
            ui: childUI,
            line: null,
            baseScale: pointDef.scale || 0.85
          };
          childNodes.push(node);

          childUI.hit.addEventListener('click', function () { onPointClick(node); });
          childUI.label.addEventListener('click', function () { onPointClick(node); });

          var parentPath = getParentPath(pointDef.path);
          var parentDef = parentPath ? getPointByPath(parentPath) : null;
          var parentPos = parentDef ? pointPosToWorld(parentDef.pos[0], parentDef.pos[1]) : mainPos;

          if (childPos.distanceTo(parentPos) > 0.001) {
            var line = makeLine([parentPos.clone(), childPos.clone()], GOLD, 0);
            scene.add(line);
            node.line = line;
          }
        });

  });

  var mode = 'overview';
  var focusMain = null;

  var anim = {
    running: false,
    duration: 2.4,
    elapsed: 0,
    fromPos: new THREE.Vector3(),
    toPos: new THREE.Vector3(),
    fromUp: new THREE.Vector3(),
    toUp: new THREE.Vector3(),
    fromLook: new THREE.Vector3(),
    toLook: new THREE.Vector3(),
    fromMainOpacity: 0.9,
    toMainOpacity: 0,
    targetMain: null,
    fromFocusMain: null
  };

  function getOverviewCamera() {
    if (MOBILE_LAYOUT) {
      return { pos: new THREE.Vector3(0, 0, 18), up: new THREE.Vector3(0, 1, 0), lookAt: new THREE.Vector3(0, 0, 0) };
    }
    var c = CFG.mainLine.cameraOverview;
    var l = CFG.mainLine.cameraLookAtOverview;
    return {
      pos: new THREE.Vector3(c.x, c.y, c.z),
      up: new THREE.Vector3(0, 0, -1),
      lookAt: new THREE.Vector3(l.x, l.y, l.z)
    };
  }

  function getFocusCamera(mainDef) {
    if (MOBILE_LAYOUT) {
      var idx = CFG.mainLine.nodes.indexOf(mainDef);
      var fy = MOBILE_TOP_Y - idx * MOBILE_Y_STEP;
      return { pos: new THREE.Vector3(MOBILE_LINE_X, fy + MOBILE_FOCUS_DIST, 0), up: new THREE.Vector3(0, 0, -1), lookAt: new THREE.Vector3(MOBILE_LINE_X, fy, 0) };
    }
    // 星图机位：以 24 为基准，光点超出画面时自动拉远，保证宇宙入口不会跑到屏幕外
    var dist = getStarMapDistance(mainDef);
    return {
      pos: new THREE.Vector3(mainDef.x - dist, 0, 0),
      up: new THREE.Vector3(0, 1, 0),
      lookAt: new THREE.Vector3(mainDef.x, 0, 0)
    };
  }

  function setCamera(preset) {
    camera.position.copy(preset.pos);
    camera.up.copy(preset.up);
    camera.lookAt(preset.lookAt);
    viewLookAt.copy(preset.lookAt);
  }

  function startAnimation(toPreset, targetMain, duration) {
    anim.running = true;
    anim.duration = duration || 2.4;
    anim.elapsed = 0;
    anim.fromPos.copy(camera.position);
    anim.toPos.copy(toPreset.pos);
    anim.fromUp.copy(camera.up);
    anim.toUp.copy(toPreset.up);
    anim.fromLook.copy(viewLookAt);
    anim.toLook.copy(toPreset.lookAt);
    anim.targetMain = targetMain || null;
    anim.fromMainOpacity = mainLine.material.opacity;
    anim.toMainOpacity = targetMain ? 0 : 0.9;
  }

  function onMainNodeClick(mainDef) {
    if (anim.running || uniAnim.active || mode === 'focus') return;
    layoutStarMaps();          // 进星图前按当前视口重排，保证宇宙入口在画面内
    mode = 'focus';
    focusMain = mainDef;
    hideHint();
    hideSiteTitle();
    updateBackButton();
      hideVersionBadge();
    startAnimation(getFocusCamera(mainDef), mainDef, 2.6);
    anim.fromFocusMain = null;
  }

  function onPointClick(node) {
    if (anim.running || uniAnim.active || contentPanelOpen) return;
    if (node.def.universe) {
      enterUniverse(node);
    } else {
      openContentPanel(node);
    }
  }

  var selectedNode = null;
  var selectedGlowTime = 0;
  var contentPanelOpen = false;

  function openContentPanel(node) {
    if (contentPanelOpen) return;
    contentPanelOpen = true;
    selectedNode = node;
    selectedGlowTime = 0;

    setTimeout(function () {
      if (!selectedNode) return;
      if (mode !== 'focus' && mode !== 'universe') return;
      var p = projectToScreen(selectedNode.pos);
      var frameLeft = 0.02 * window.innerWidth;
      var frameTop = 0.02 * window.innerHeight;
      pageFrame.style.transformOrigin = (p.x - frameLeft) + 'px ' + (p.y - frameTop) + 'px';
      pageFrame.src = '../WayPoints/' + selectedNode.def.url;
      pageOverlay.style.display = 'block';
      void pageOverlay.offsetWidth;
      pageOverlay.classList.add('active');
    }, 450);
  }

  function closeContentPanel() {
    if (!contentPanelOpen) return;
    contentPanelOpen = false;
    pageOverlay.classList.remove('active');
    setTimeout(function () {
      if (!contentPanelOpen) {
        pageOverlay.style.display = 'none';
        pageFrame.src = 'about:blank';
      }
    }, 850);
    if (selectedNode) {
      selectedNode.sprite.scale.set(selectedNode.baseScale, selectedNode.baseScale, 1);
    }
    selectedNode = null;
  }

  function updateSelectedGlow(dt) {
    if (!selectedNode) return;
    selectedGlowTime += dt;
    var pulse = 1 + 0.5 * Math.sin(selectedGlowTime * 12);
    var s = selectedNode.baseScale * pulse;
    selectedNode.sprite.scale.set(s, s, 1);
  }

  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'BG5FNH_CLOSE_OVERLAY') {
      closeContentPanel();
    }
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && contentPanelOpen) {
      closeContentPanel();
    }
  });

  function backToOverview() {
    if (anim.running || uniAnim.active) return;
    if (universeStack.length > 0) {
      exitUniverse();
      return;
    }
    if (mode !== 'focus') return;
    var prevFocus = focusMain;
    try { sessionStorage.removeItem('bg5fnh_focus'); } catch (e) { }
    mode = 'overview';
    focusMain = null;
    updateBackButton();
      showVersionBadge();
    showSiteTitle();
    showHint(MOBILE_LAYOUT ? '点击金色圆点进入 · 空白处拖动 · 双指缩放' : '点击金色圆点进入 · 空白处拖动平移 · 滚轮缩放');
    hideHintSoon(5000);
    startAnimation(getOverviewCamera(), null, 2.2);
    anim.fromFocusMain = prevFocus;
  }

  function hideHint() { if (hintEl) hintEl.style.opacity = '0'; }
  function showHint(text) { if (hintEl) { hintEl.textContent = text; hintEl.style.opacity = '1'; } }
  function hideVersionBadge() { if (versionBadge) versionBadge.style.opacity = '0'; }
  function showVersionBadge() { if (versionBadge) versionBadge.style.opacity = '1'; }
  function hideSiteTitle() { if (siteTitle) siteTitle.style.opacity = '0'; }
  function showSiteTitle() { if (siteTitle) siteTitle.style.opacity = '1'; }

  // 底部提示看两遍就够，几秒后自己淡掉，不要在画画的时候一直挂在那儿
  var hintTimer = null;
  function hideHintSoon(ms) {
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = setTimeout(hideHint, ms || 6000);
  }
  if (backBtn) backBtn.addEventListener('click', backToOverview);

  function setSpriteOpacity(sprite, opacity) {
    if (sprite && sprite.material) sprite.material.opacity = clamp01(opacity);
  }

  function setUIOpacity(ui, opacity) {
    ui.hit.style.opacity = opacity;
    ui.hit.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
    ui.label.style.opacity = opacity;
    ui.label.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
  }

  function setChildOpacity(node, opacity) {
    setSpriteOpacity(node.sprite, opacity);
    if (node.line) node.line.material.opacity = clamp01(0.9 * opacity);
    setUIOpacity(node.ui, opacity);
  }

  function setNodeScale(node, scale) {
    if (node && node.sprite) {
      var s = Math.max(0.001, scale);
      node.sprite.scale.set(s, s, 1);
    }
  }

  function applyInstant(mainDef) {
    if (!mainDef) {
      mainLine.material.opacity = 0.9;
      mainNodes.forEach(function (n) { setSpriteOpacity(n.sprite, 1); setUIOpacity(n.ui, 1); });
      childNodes.forEach(function (n) { setChildOpacity(n, 0); });
    } else {
      mainLine.material.opacity = 0;
      mainNodes.forEach(function (n) { setSpriteOpacity(n.sprite, 0); setUIOpacity(n.ui, 0); });
      childNodes.forEach(function (n) { setChildOpacity(n, n.mainDef === mainDef ? 1 : 0); });
    }
  }

  function restoreFocusIfNeeded() {
    var saved = null;
    try {
      saved = sessionStorage.getItem('bg5fnh_focus');
      sessionStorage.removeItem('bg5fnh_focus');
    } catch (e) { }
    if (!saved) return;
    var found = null;
    CFG.mainLine.nodes.forEach(function (n) { if (n.id === saved) found = n; });
    if (!found) return;
    mode = 'focus';
    focusMain = found;
    setCamera(getFocusCamera(found));
    hideHint();
    updateBackButton();
    applyInstant(found);
  }

  // ================= 宇宙系统 =================
  var universeStack = [];
  /* 宇宙动画时间轴（比例制，1 = 结束）：
     进场 enter  0 ── 0.42 ── 0.53 ── 0.72 ── 1
                  ※探入      ※穿膜   ※白光退去   ※内部星云长满
     退场 exit   0 ── 0.36 ── 0.50 ────────────── 1
                  ※缩回      ※穿膜     ※退回星图
  */
  var uniAnim = {
    active: false,
    phase: 'enter',
    elapsed: 0,
    duration: 2.8,
    diveEnd: 0.42,
    flashPeak: 0.52,
    floodEnd: 0.80,
    shrinkEnd: 0.36,
    exitPeak: 0.50,
    fromPos: new THREE.Vector3(),
    divePos: new THREE.Vector3(),
    toPos: new THREE.Vector3(),
    fromLook: new THREE.Vector3(),
    toLook: new THREE.Vector3(),
    fromUp: new THREE.Vector3(),
    toUp: new THREE.Vector3(),
    fromBg: null,
    toBg: null,
    fadeInNodes: [],
    fadeOutNodes: [],
    entry: null,
    cutDone: false
  };
  var universeClock = 0;
  var WHITE = new THREE.Color(0xffffff);

  function topUniverse() { return universeStack.length ? universeStack[universeStack.length - 1] : null; }

  function getAllNodes() {
    var arr = mainNodes.concat(childNodes);
    for (var i = 0; i < universeStack.length; i++) arr = arr.concat(universeStack[i].nodes);
    if (uniAnim.active) arr = arr.concat(uniAnim.fadeInNodes).concat(uniAnim.fadeOutNodes);
    return arr;
  }

  function updateBackButton() {
    if (!backBtn) return;
    var label = document.getElementById('backLabel');
    if (universeStack.length > 0) {
      backBtn.style.display = 'inline-flex';
      if (label) label.textContent = '返回';
    } else if (mode === 'focus') {
      backBtn.style.display = 'inline-flex';
      if (label) label.textContent = '返回';
    } else {
      backBtn.style.display = 'none';
    }
  }

  function makeUniverseEntry(pointDef, mainDef, centerPos, srcNode) {
    var color = hexColor(pointDef.universeColor, 0xe8b4b8);
    // 双色宇宙：第二个颜色可选，内部光点会按横坐标在两者之间渐变
    var color2 = pointDef.universeColor2 !== undefined ? hexColor(pointDef.universeColor2, color) : null;
    var accent = color2 === null ? color : gradientColor(color, color2, 0.5);
    var bg;
    if (pointDef.universeBg) {
      bg = new THREE.Color(pointDef.universeBg);
    } else {
      var hsl = {};
      bg = new THREE.Color(accent);
      bg.getHSL(hsl);
      bg.setHSL(hsl.h, Math.min(0.5, hsl.s * 0.6), 0.06);
    }
    return {
      def: pointDef,
      mainDef: mainDef,
      color: color,
      color2: color2,
      accent: accent,
      flashColor: color2 === null ? accent : blendColor(color, color2, 0.5),
      bg: bg,
      centerPos: centerPos.clone(),
      srcNode: srcNode || null,
      srcScale: srcNode ? (srcNode.baseScale || 0.85) : 0.85,
      srcColorHex: srcNode ? srcNode.sprite.material.color.getHex() : GOLD,
      maxOriginDist: 1,
      nodes: []
    };
  }

  // 两个十六进制颜色按 t 混合（0 = a，1 = b）
  function blendColor(a, b, t) {
    var k = clamp01(t);
    var ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
    var br = (b >> 16) & 255, bgc = (b >> 8) & 255, bb = b & 255;
    return (Math.round(ar + (br - ar) * k) << 16) |
           (Math.round(ag + (bgc - ag) * k) << 8) |
           Math.round(ab + (bb - ab) * k);
  }

  // 入口光点在父星图里的颜色：单色宇宙就是主色，双色宇宙用两者的中间色
  function universeAccent(def) {
    var a = hexColor(def.universeColor, 0xe8b4b8);
    if (def.universeColor2 === undefined) return a;
    return gradientColor(a, hexColor(def.universeColor2, a), 0.5);
  }

  // 渐变取色：两端最艳，越靠中间混色越容易发暗，
  // 所以按「离中间的距离」补一点白，保证中间的标签在黑底上还看得清。
  function gradientColor(a, b, t) {
    var k = clamp01(t);
    var c = blendColor(a, b, k);
    var lift = 0.26 * (1 - Math.abs(k - 0.5) * 2);
    return blendColor(c, 0xffffff, lift);
  }

  // 宇宙内部光点：先全部建在中心（scale 0.001 / 透明度 0），等穿膜后往外长
  function buildUniverseNodes(entry) {
    var defs = entry.def.universePoints || [];
    var center = entry.centerPos;

    // 双色宇宙的渐变基准：按横坐标在整个布局里归一化
    var minH = 0, maxH = 0;
    defs.forEach(function (d) {
      minH = Math.min(minH, d.pos[0]);
      maxH = Math.max(maxH, d.pos[0]);
    });
    var hSpan = Math.max(0.001, maxH - minH);

    defs.forEach(function (def, index) {
      var basePos = placePoint(center, def.pos[0], def.pos[1]);
      var c = entry.color;
      if (def.color !== undefined) {
        c = hexColor(def.color, c);          // 单点直接指定颜色
      } else if (def.universe) {
        c = hexColor(def.universeColor, 0xe8b4b8);
      } else if (entry.color2 !== null) {
        c = gradientColor(entry.color, entry.color2, (def.pos[0] - minH) / hSpan);
      }
      // 连线可以单独指定颜色：比如红线上挂天蓝色的点
      var lc = def.lineColor !== undefined ? hexColor(def.lineColor, c) : c;
      var sprite = makeGlowSprite(def.scale || 0.8, c);
      sprite.scale.set(0.001, 0.001, 1);
      sprite.position.copy(center);
      sprite.material.opacity = 0;
      sprite.renderOrder = 2;
      scene.add(sprite);

      var ui = createNodeUI(def.name, false);
      ui.label.style.color = colorToCss(c);
      ui.label.style.textShadow = '0 0 12px ' + colorToRgba(c, 0.35);
      setUIOpacity(ui, 0);

      var node = {
        kind: 'point',
        def: def,
        mainDef: entry.mainDef,
        universeEntry: entry,
        pos: center.clone(),
        basePos: basePos.clone(),
        sprite: sprite,
        ui: ui,
        line: null,
        lineColor: lc,
        labelScale: def.labelScale || 1,
        baseScale: def.scale || 0.8,
        originDist: Math.max(0.001, basePos.distanceTo(center)),
        phase: index * 0.9,
        parentNode: null
      };
      entry.nodes.push(node);

      ui.hit.addEventListener('click', function () { onPointClick(node); });
      ui.label.addEventListener('click', function () { onPointClick(node); });
    });

    function byKey(key) {
      for (var i = 0; i < entry.nodes.length; i++) {
        var d = entry.nodes[i].def;
        if ((d.key !== undefined ? d.key : d.path) === key) return entry.nodes[i];
      }
      return null;
    }
    function parentPath(path) {
      var s = path.lastIndexOf('/');
      return s === -1 ? null : path.slice(0, s);
    }

    var maxD = 0.001;
    entry.nodes.forEach(function (n) {
      // 父节点：优先用显式 parent（时间轴这类链式结构靠它连成一条线），
      // 没写就按 path 的斜杠层级推断
      var pp = n.def.parent !== undefined ? n.def.parent : parentPath(n.def.path);
      var pNode = pp ? byKey(pp) : null;
      n.parentNode = pNode;
      var pPos = pNode ? pNode.basePos : center;
      if (n.basePos.distanceTo(pPos) > 0.001) {
        var line = makeLine([center.clone(), center.clone()], n.lineColor, 0);
        line.frustumCulled = false;
        line.renderOrder = 1;
        scene.add(line);
        n.line = line;
      }
      maxD = Math.max(maxD, n.originDist);
    });
    entry.maxOriginDist = maxD;
  }

  function destroyUniverseNodes(entry) {
    entry.nodes.forEach(function (n) {
      scene.remove(n.sprite);
      if (n.sprite.material) n.sprite.material.dispose();
      if (n.line) {
        scene.remove(n.line);
        if (n.line.geometry) n.line.geometry.dispose();
      }
      if (n.ui.hit && n.ui.hit.parentNode) n.ui.hit.parentNode.removeChild(n.ui.hit);
      if (n.ui.label && n.ui.label.parentNode) n.ui.label.parentNode.removeChild(n.ui.label);
    });
    entry.nodes.length = 0;
  }

  // ---- 穿膜白光层分两层：
  //      flashBase 负责在穿膜那一帧把换景整个遮住（只在峰值附近才不透明）
  //      flashGlow 是白色爆光，边缘透明，散开时不会在画面四角留下灰褐色雾
  var flashBase = document.createElement('div');
  flashBase.setAttribute('aria-hidden', 'true');
  flashBase.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:7;' +
    'opacity:0;pointer-events:none;will-change:opacity;background:#000;';
  document.body.appendChild(flashBase);

  var flashGlow = document.createElement('div');
  flashGlow.setAttribute('aria-hidden', 'true');
  flashGlow.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:7;' +
    'opacity:0;pointer-events:none;will-change:opacity;' +
    'background:radial-gradient(circle at 50% 50%, #ffffff 0%, rgba(255,255,255,0.72) 18%,' +
    'rgba(255,255,255,0.26) 38%, rgba(255,255,255,0) 68%);';
  document.body.appendChild(flashGlow);

  function setFlash(colorHex, alpha) {
    var a = clamp01(alpha);
    if (a <= 0.002) {
      flashBase.style.opacity = '0';
      flashGlow.style.opacity = '0';
      return;
    }
    var c = colorToCss(colorHex === undefined || colorHex === null ? 0xe8b4b8 : colorHex);
    flashBase.style.background = c;
    flashBase.style.opacity = String(Math.pow(a, 2.6));   // 只有接近全白时才铺满
    flashGlow.style.opacity = String(Math.pow(a, 1.05));  // 白光慢慢散
  }

  // 只改已有几何的顶点，避免每帧重建 BufferGeometry
  function moveLine(line, a, b) {
    var attr = line && line.geometry && line.geometry.attributes.position;
    if (!attr) return;
    attr.array[0] = a.x; attr.array[1] = a.y; attr.array[2] = a.z;
    attr.array[3] = b.x; attr.array[4] = b.y; attr.array[5] = b.z;
    attr.needsUpdate = true;
  }

  // 0 → 1（peak）→ 0（downEnd）的白光曲线，peak 之后保留 hold 长度的全白，
  // 保证换景那一下绝对看不见。
  function flashCurve(t, upStart, peak, downEnd, hold) {
    if (t <= upStart) return 0;
    if (t < peak) {
      var a = (t - upStart) / Math.max(0.001, peak - upStart);
      return a * a;
    }
    var h = hold === undefined ? 0.05 : hold;
    if (t < peak + h) return 1;
    if (t >= downEnd) return 0;
    var b = (t - peak - h) / Math.max(0.001, downEnd - peak - h);
    return Math.pow(1 - clamp01(b), 1.7);
  }

  // 让一组光点刚好塞进镜头，返回需要的相机距离
  function fitDistance(maxH, maxV, pad) {
    var tan = Math.tan(camera.fov * Math.PI / 360);
    var byV = (maxV + pad) / tan;
    var byH = (maxH + pad) / (tan * Math.max(0.2, camera.aspect));
    return Math.max(byV, byH);
  }

  function starBounds(points) {
    var unit = CFG.gridUnit || 3.6;
    var maxH = 0;
    var maxV = 0;
    (points || []).forEach(function (p) {
      if (!p || !p.pos) return;
      maxH = Math.max(maxH, Math.abs(p.pos[0] * unit));
      maxV = Math.max(maxV, Math.abs(p.pos[1] * unit));
    });
    return { h: maxH, v: maxV, unit: unit };
  }

  // 星图机位：至少 24，光点越界时自动拉远（否则宇宙入口会被切在屏幕外）
  function getStarMapDistance(mainDef) {
    var b = starBounds(mainDef.points);
    return Math.max(24, fitDistance(b.h, b.v, b.unit * 0.25) * 1.04);
  }

  // 宇宙机位：按内部光点的包围盒「中心」取景。
  // 时间轴这类只往一个方向长的布局，如果死盯着入口点看，半边屏幕会是空的。
  function getUniverseViewCamera(entry) {
    var pts = entry.def.universePoints || [];
    var unit = CFG.gridUnit || 3.6;
    var minH = 0, maxH = 0, minV = 0, maxV = 0;
    pts.forEach(function (p) {
      if (!p || !p.pos) return;
      minH = Math.min(minH, p.pos[0]); maxH = Math.max(maxH, p.pos[0]);
      minV = Math.min(minV, p.pos[1]); maxV = Math.max(maxV, p.pos[1]);
    });
    var midH = (minH + maxH) / 2;
    var midV = (minV + maxV) / 2;
    var spanH = (maxH - minH) / 2 * unit;
    var spanV = (maxV - minV) / 2 * unit;
    var pad = unit * 1.2;
    var dist = fitDistance(spanH, spanV, pad);
    dist = Math.max(13, Math.min(MOBILE_LAYOUT ? 42 : 40, dist));
    var c = entry.centerPos;
    if (MOBILE_LAYOUT) {
      // 手机端：pos[1] 落在 -Z，pos[0] 落在 +X
      var look = new THREE.Vector3(c.x + midH * unit, c.y, c.z - midV * unit);
      return { pos: new THREE.Vector3(look.x, look.y + dist, look.z), up: new THREE.Vector3(0, 0, -1), lookAt: look };
    }
    var lookDesk = new THREE.Vector3(c.x, c.y + midV * unit, c.z + midH * unit);
    return { pos: new THREE.Vector3(lookDesk.x - dist, lookDesk.y, lookDesk.z), up: new THREE.Vector3(0, 1, 0), lookAt: lookDesk };
  }

  function currentLevelNodes() {
    if (universeStack.length) return topUniverse().nodes;
    if (mode === 'focus' && focusMain) return childNodes.filter(function (n) { return n.mainDef === focusMain; });
    return mainNodes;
  }

  /* 手机端重排星图：
     手机屏幕窄，而 pos 的数值是按「横向也能放下」设计的，直接把 3.2 格摆上去会被切在屏幕外
     （「软件破解资源分享」这个宇宙入口就是这样点不到的）。这里按当前视口把每个导航点的
     星图等比压进可视范围；桌面端不动。窗口尺寸变化、每次进入星图都会重排。 */
  function layoutStarMaps() {
    if (!MOBILE_LAYOUT) return;
    var unit = CFG.gridUnit || 3.6;
    var mt = Math.tan(camera.fov * Math.PI / 360);
    // 0.80 / 0.82 是留给「光点文字」的余量，压得太满会让边缘的文字被切掉
    var halfW = mt * MOBILE_FOCUS_DIST * Math.max(0.2, camera.aspect) * 0.80;
    var halfH = mt * MOBILE_FOCUS_DIST * 0.82;

    CFG.mainLine.nodes.forEach(function (mainDef, mainIndex) {
      var defs = mainDef.points || [];
      if (!defs.length) return;
      var b = starBounds(defs);
      var hs = b.h > 0.001 ? Math.min(1, halfW / b.h) : 1;
      var vs = b.v > 0.001 ? Math.min(1, halfH / b.v) : 1;
      var mainPos = new THREE.Vector3(MOBILE_LINE_X, MOBILE_TOP_Y - mainIndex * MOBILE_Y_STEP, 0);
      var mine = [];

      childNodes.forEach(function (n) {
        if (n.mainDef !== mainDef || !n.def || !n.def.pos) return;
        mine.push(n);
        n.pos.set(mainPos.x + n.def.pos[0] * unit * hs, mainPos.y, mainPos.z - n.def.pos[1] * unit * vs);
        n.sprite.position.copy(n.pos);
      });

      mine.forEach(function (n) {
        if (!n.line) return;
        var cut = n.def.path.lastIndexOf('/');
        var parentPath = cut === -1 ? null : n.def.path.slice(0, cut);
        var from = mainPos;
        for (var i = 0; i < mine.length; i++) {
          if (mine[i].def.path === parentPath) { from = mine[i].pos; break; }
        }
        moveLine(n.line, from, n.pos);
      });
    });
  }

  function enterUniverse(node) {
    if (anim.running || uniAnim.active || contentPanelOpen) return;
    var pointDef = node.def;
    var mainDef = node.mainDef || focusMain;
    var entry = makeUniverseEntry(pointDef, mainDef, node.pos, node);
    buildUniverseNodes(entry);

    var parentNodes = currentLevelNodes();
    universeStack.push(entry);
    mode = 'universe';

    var cam = getUniverseViewCamera(entry);
    var toward = new THREE.Vector3().subVectors(camera.position, entry.centerPos);
    if (toward.lengthSq() < 0.0001) toward.set(-1, 0, 0);
    toward.normalize();

    uniAnim.active = true;
    uniAnim.phase = 'enter';
    uniAnim.elapsed = 0;
    uniAnim.duration = MOBILE_LAYOUT ? 3.0 : 2.8;
    uniAnim.cutDone = false;
    uniAnim.fromPos.copy(camera.position);
    uniAnim.fromLook.copy(viewLookAt);
    uniAnim.fromUp.copy(camera.up);
    // 贴着光点表面的机位：镜头要真的「贴上去」而不是远远看着
    uniAnim.divePos.copy(entry.centerPos).addScaledVector(toward, 0.6);
    uniAnim.toPos.copy(cam.pos);
    uniAnim.toLook.copy(cam.lookAt);
    uniAnim.toUp.copy(cam.up);
    uniAnim.fromBg = scene.background.clone();
    uniAnim.toBg = entry.bg.clone();
    uniAnim.fadeInNodes = entry.nodes;
    uniAnim.fadeOutNodes = parentNodes.filter(function (n) { return n !== node; });
    uniAnim.entry = entry;

    setFlash(entry.flashColor, 0);
    hideHint();
    updateBackButton();
  }

  function exitUniverse() {
    if (anim.running || uniAnim.active || contentPanelOpen || !universeStack.length) return;
    var entry = universeStack.pop();

    var parentNodes;
    if (universeStack.length) {
      parentNodes = topUniverse().nodes;
      mode = 'universe';
    } else {
      parentNodes = childNodes.filter(function (n) { return n.mainDef === focusMain; });
      mode = 'focus';
    }
    var toCam = universeStack.length ? getUniverseViewCamera(topUniverse()) : getFocusCamera(focusMain);

    var toward = new THREE.Vector3().subVectors(toCam.pos, entry.centerPos);
    if (toward.lengthSq() < 0.0001) toward.set(-1, 0, 0);
    toward.normalize();

    entry.nodes.forEach(function (n) { n.exitFrom = n.pos.clone(); });

    uniAnim.active = true;
    uniAnim.phase = 'exit';
    uniAnim.elapsed = 0;
    uniAnim.duration = 1.9;
    uniAnim.cutDone = false;
    uniAnim.fromPos.copy(camera.position);
    uniAnim.fromLook.copy(viewLookAt);
    uniAnim.fromUp.copy(camera.up);
    uniAnim.divePos.copy(entry.centerPos).addScaledVector(toward, 0.6);
    uniAnim.toPos.copy(toCam.pos);
    uniAnim.toLook.copy(toCam.lookAt);
    uniAnim.toUp.copy(toCam.up);
    uniAnim.fromBg = scene.background.clone();
    uniAnim.toBg = universeStack.length ? topUniverse().bg.clone() : new THREE.Color(BG);
    uniAnim.fadeInNodes = parentNodes;
    uniAnim.fadeOutNodes = entry.nodes;
    uniAnim.entry = entry;
    updateBackButton();
  }

  // 穿膜瞬间：镜头已经在宇宙里，星图彻底退场，宇宙光点缩在中心等待生长
  function applyUniverseCut(entry) {
    camera.fov = 45;                    // 回到正常焦段
    camera.updateProjectionMatrix();
    camera.position.copy(uniAnim.toPos);
    camera.up.copy(uniAnim.toUp);
    camera.lookAt(uniAnim.toLook);
    viewLookAt.copy(uniAnim.toLook);
    scene.background.copy(entry.bg);

    mainLine.material.opacity = 0;
    mainNodes.forEach(function (n) { setSpriteOpacity(n.sprite, 0); setUIOpacity(n.ui, 0); });
    uniAnim.fadeOutNodes.forEach(function (n) { setChildOpacity(n, 0); });

    if (entry.srcNode) {
      entry.srcNode.sprite.scale.set(entry.srcScale, entry.srcScale, 1);
      entry.srcNode.sprite.material.color.setHex(entry.srcColorHex);
      setSpriteOpacity(entry.srcNode.sprite, 0);
      setUIOpacity(entry.srcNode.ui, 0);
      // 入口光点自己的连线也要彻底清掉，否则会有一条线留在宇宙里
      if (entry.srcNode.line) entry.srcNode.line.material.opacity = 0;
    }
    entry.nodes.forEach(function (n) {
      n.sprite.position.copy(entry.centerPos);
      n.sprite.scale.set(0.001, 0.001, 1);
      n.sprite.material.opacity = 0;
      n.pos.copy(entry.centerPos);
      setUIOpacity(n.ui, 0);
      if (n.line) n.line.material.opacity = 0;
    });
  }

  // 退场穿膜瞬间：宇宙节点销毁，镜头退到光点表面，随后飞回星图
  function applyUniverseExitCut(entry) {
    scene.background.copy(uniAnim.toBg);
    mainLine.material.opacity = 0;
    uniAnim.fadeInNodes.forEach(function (n) { setChildOpacity(n, 0); });
    if (entry.srcNode) {
      entry.srcNode.sprite.scale.set(entry.srcScale, entry.srcScale, 1);
      entry.srcNode.sprite.material.color.setHex(entry.srcColorHex);
      setSpriteOpacity(entry.srcNode.sprite, 0);
      setUIOpacity(entry.srcNode.ui, 0);
    }
    destroyUniverseNodes(entry);
  }

  function finishUniverseEnter(entry) {
    uniAnim.active = false;
    uniAnim.fadeInNodes = [];
    uniAnim.fadeOutNodes = [];
    setFlash(entry.flashColor, 0);
    camera.fov = 45;
    camera.updateProjectionMatrix();
    scene.background.copy(entry.bg);
    if (entry.srcNode && entry.srcNode.line) entry.srcNode.line.material.opacity = 0;
    entry.nodes.forEach(function (n) {
      n.sprite.position.copy(n.basePos);
      n.sprite.scale.set(n.baseScale, n.baseScale, 1);
      n.sprite.material.opacity = 1;
      n.pos.copy(n.basePos);
      setUIOpacity(n.ui, 1);
      if (n.line) {
        moveLine(n.line, n.parentNode ? n.parentNode.basePos : entry.centerPos, n.basePos);
        n.line.material.opacity = 0.9;
      }
    });
    updateBackButton();
  }

  function finishUniverseExit(entry) {
    uniAnim.active = false;
    uniAnim.fadeInNodes = [];
    uniAnim.fadeOutNodes = [];
    setFlash(entry ? entry.flashColor : 0, 0);
    if (universeStack.length) {
      var top = topUniverse();
      top.nodes.forEach(function (n) {
        n.pos.copy(n.basePos);
        n.sprite.position.copy(n.basePos);
        n.sprite.scale.set(n.baseScale, n.baseScale, 1);
        n.sprite.material.opacity = 1;
        setUIOpacity(n.ui, 1);
      });
      scene.background.copy(top.bg);
      mainLine.material.opacity = 0;
    } else if (mode === 'focus' && focusMain) {
      applyInstant(focusMain);
      scene.background.copy(new THREE.Color(BG));
    } else {
      applyInstant(null);
      scene.background.copy(new THREE.Color(BG));
    }
    updateBackButton();
  }

  function updateUniverseAnim(dt) {
    if (!uniAnim.active) return;
    uniAnim.elapsed += dt;
    var t = clamp01(uniAnim.elapsed / (uniAnim.duration || 2.8));
    var entry = uniAnim.entry;
    if (!entry) { uniAnim.active = false; return; }

    // ==================== 进场 ====================
    if (uniAnim.phase === 'enter') {
      var diveEnd = uniAnim.diveEnd;
      var peak = uniAnim.flashPeak;
      var floodEnd = uniAnim.floodEnd;
      var maxDist = entry.maxOriginDist || 1;

      if (t < diveEnd) {
        /* ① 探入：镜头沿一条弧线慢慢贴近光点，被点中的光点自己涨开成一片光，
              其余光点与文字在最后阶段淡掉。 */
        var lt = easeInOutCubic(clamp01(t / diveEnd));

        var dir = new THREE.Vector3().subVectors(uniAnim.fromPos, entry.centerPos);
        if (dir.lengthSq() < 0.0001) dir.set(-1, 0, 0);
        dir.normalize();
        var perp = new THREE.Vector3().crossVectors(dir, uniAnim.fromUp);
        if (perp.lengthSq() < 0.0001) perp.set(0, 1, 0);
        perp.normalize();

        camera.position
          .lerpVectors(uniAnim.fromPos, uniAnim.divePos, lt)
          .addScaledVector(perp, Math.sin(Math.PI * lt) * (MOBILE_LAYOUT ? 0.9 : 1.6));
        camera.up.copy(uniAnim.fromUp);
        // 视线不要第一帧就「弹」到光点上：跟镜头一起平滑转过去，避免跳一下
        var aim = easeInOutCubic(clamp01(lt * 1.45));
        var lookNow = new THREE.Vector3().lerpVectors(uniAnim.fromLook, entry.centerPos, aim);
        camera.lookAt(lookNow);
        viewLookAt.copy(lookNow);
        camera.fov = 45 - 6 * lt;          // 镜头焦段微微收窄，强化「推进去」的压迫感
        camera.updateProjectionMatrix();

        uniAnim.fadeOutNodes.forEach(function (n) {
          setChildOpacity(n, Math.pow(1 - lt, 1.5));
        });
        mainLine.material.opacity = 0;
        mainNodes.forEach(function (n) { setSpriteOpacity(n.sprite, 0); setUIOpacity(n.ui, 0); });

        var src = entry.srcNode;
        if (src) {
          var s = entry.srcScale * (1 + 7 * lt * lt * lt);
          src.sprite.scale.set(s, s, 1);
          src.sprite.material.color.setHex(entry.srcColorHex).lerp(WHITE, lt * 0.85);
          setSpriteOpacity(src.sprite, 1);
          setUIOpacity(src.ui, Math.pow(1 - lt, 2));   // 它自己的文字也要让开，不要顶在爆光上
          if (src.line) src.line.material.opacity = 0.9 * Math.pow(1 - lt, 1.5);
        }

        scene.background.copy(uniAnim.fromBg).lerp(entry.bg, 0.35 * lt);
      } else if (t < peak) {
        /* ② 穿膜：再往里挤一点点，白光把整个画面吃掉，此刻换景。 */
        var lt2 = easeInQuad(clamp01((t - diveEnd) / Math.max(0.001, peak - diveEnd)));
        var inward = new THREE.Vector3().subVectors(entry.centerPos, uniAnim.divePos);
        if (inward.lengthSq() < 0.0001) inward.set(1, 0, 0);
        inward.normalize();

        camera.position.copy(uniAnim.divePos).addScaledVector(inward, 0.32 * lt2);
        camera.up.copy(uniAnim.fromUp);
        camera.lookAt(entry.centerPos);
        viewLookAt.copy(entry.centerPos);

        var src2 = entry.srcNode;
        if (src2) {
          var s2 = entry.srcScale * (8 + 30 * lt2);
          src2.sprite.scale.set(s2, s2, 1);
          src2.sprite.material.color.copy(WHITE);
          setSpriteOpacity(src2.sprite, 1);
          if (src2.line) src2.line.material.opacity = 0;
        }

        uniAnim.fadeOutNodes.forEach(function (n) { setChildOpacity(n, 0); });
        scene.background.copy(uniAnim.fromBg).lerp(entry.bg, 0.35 + 0.65 * lt2);
      } else {
        /* ③ 内部宇宙：白光从中心退去，内部光点从刚才那个点的位置一粒粒长出来。 */
        if (!uniAnim.cutDone) {
          uniAnim.cutDone = true;
          applyUniverseCut(entry);
        }

        entry.nodes.forEach(function (n) {
          // 越靠近中心的点越早长出来，整片星云像从光点里一层层涌出来
          var start = peak - 0.07 + 0.12 * (n.originDist / maxDist);
          var local = clamp01((t - start) / Math.max(0.05, 1 - start));
          var le = easeOutCubic(local);
          n.sprite.position.lerpVectors(entry.centerPos, n.basePos, le);
          var sc = Math.max(0.001, n.baseScale * (0.08 + 0.92 * local));
          n.sprite.scale.set(sc, sc, 1);
          n.sprite.material.opacity = clamp01(local * 2.8);
          setUIOpacity(n.ui, clamp01((local - 0.45) * 2.2));
          n.pos.copy(n.sprite.position);
        });
        entry.nodes.forEach(function (n) {
          if (!n.line) return;
          var from = n.parentNode ? n.parentNode.pos : entry.centerPos;
          moveLine(n.line, from, n.pos);
          n.line.material.opacity = 0.9 * clamp01((n.sprite.material.opacity || 0) * 0.85);
        });
      }

      // 白光统一在这里算，保证三个阶段衔接处不会「跳亮」：
      // 探入时从 0 涨到 peak 全白 → 换景 → 从中心退掉
      var enterFlash = t < peak
        ? flashCurve(t, diveEnd * 0.66, peak, floodEnd, 0.05)
        : Math.pow(1 - clamp01((t - peak - 0.04) / Math.max(0.001, floodEnd - peak - 0.04)), 2);
      setFlash(entry.flashColor, enterFlash);

      if (t >= 1) finishUniverseEnter(entry);
      return;
    }

    // ==================== 退场 ====================
    var shrinkEnd = uniAnim.shrinkEnd;
    var peak2 = uniAnim.exitPeak;

    if (t < shrinkEnd) {
      /* ① 缩回：内部光点连同连线一起收进中心那一点，越收越暗。 */
      var lt3 = easeInOutCubic(clamp01(t / shrinkEnd));
      entry.nodes.forEach(function (n) {
        n.sprite.position.lerpVectors(n.exitFrom || n.basePos, entry.centerPos, lt3);
        var sc2 = Math.max(0.001, n.baseScale * (1 - lt3));
        n.sprite.scale.set(sc2, sc2, 1);
        n.sprite.material.opacity = clamp01(1 - lt3);
        setUIOpacity(n.ui, clamp01(1 - lt3 * 1.4));
        n.pos.copy(n.sprite.position);
      });
      entry.nodes.forEach(function (n) {
        if (!n.line) return;
        var from = n.parentNode ? n.parentNode.pos : entry.centerPos;
        moveLine(n.line, from, n.pos);
        n.line.material.opacity = 0.9 * clamp01(1 - lt3);
      });
    } else if (t < peak2) {
      /* ② 已经收成一个点，等白光涨满（此段镜头和画面都静止） */
      entry.nodes.forEach(function (n) { setUIOpacity(n.ui, 0); });
    } else {
      /* ③ 在全白里把镜头放回光点表面，再一路拉回星图。 */
      if (!uniAnim.cutDone) {
        uniAnim.cutDone = true;
        applyUniverseExitCut(entry);
      }

      var rt = clamp01((t - peak2) / Math.max(0.001, 1 - peak2));
      var re = easeInOutCubic(rt);

      camera.position.lerpVectors(uniAnim.divePos, uniAnim.toPos, re);
      camera.up.copy(uniAnim.toUp);
      var look = new THREE.Vector3().lerpVectors(uniAnim.fromLook, uniAnim.toLook, re);
      camera.lookAt(look);
      viewLookAt.copy(look);

      uniAnim.fadeInNodes.forEach(function (n) { setChildOpacity(n, clamp01(re * 1.15)); });
      if (entry.srcNode) {
        entry.srcNode.sprite.scale.set(entry.srcScale, entry.srcScale, 1);
        setSpriteOpacity(entry.srcNode.sprite, clamp01(re * 1.15));
      }
      mainLine.material.opacity = 0;
    }

    // 白光同样统一算：涨到 peak2 全白 → 穿膜 → 在返程前半段退掉
    var exitFlash = t < peak2
      ? flashCurve(t, shrinkEnd * 0.55, peak2, 1, 0.06)
      : Math.pow(1 - clamp01((t - peak2 - 0.05) / Math.max(0.001, 0.62 - peak2)), 1.6);
    setFlash(entry.flashColor, exitFlash);

    if (t >= 1) finishUniverseExit(entry);
  }

  // 宇宙静止时的呼吸：光点与连线极缓慢地起伏，让内部空间「活着」
  function updateUniverseIdle(dt) {
    if (uniAnim.active || contentPanelOpen) return;
    if (mode !== 'universe' || !universeStack.length) return;
    var top = topUniverse();
    if (!top || !top.nodes.length) return;

    universeClock += dt;
    top.nodes.forEach(function (n) {
      var bob = Math.sin(universeClock * 0.7 + n.phase) * 0.07;
      var bob2 = Math.cos(universeClock * 0.52 + n.phase * 1.3) * 0.05;
      n.pos.set(n.basePos.x + bob2, n.basePos.y + bob, n.basePos.z + bob * 0.35);
      n.sprite.position.copy(n.pos);
    });
    top.nodes.forEach(function (n) {
      if (!n.line) return;
      var from = n.parentNode ? n.parentNode.pos : top.centerPos;
      moveLine(n.line, from, n.pos);
    });
  }

  function updateAnimation(dt) {
    if (!anim.running) return;
    anim.elapsed += dt;
    var t = clamp01(anim.elapsed / anim.duration);
    var e = easeInOutCubic(t);

    camera.position.lerpVectors(anim.fromPos, anim.toPos, e);
    var up = new THREE.Vector3().lerpVectors(anim.fromUp, anim.toUp, e);
    if (up.lengthSq() < 0.0001) up.copy(anim.toUp);
    camera.up.copy(up.normalize());
    var lookAt = new THREE.Vector3().lerpVectors(anim.fromLook, anim.toLook, e);
    camera.lookAt(lookAt);
    viewLookAt.copy(lookAt);

    mainLine.material.opacity = anim.fromMainOpacity + (anim.toMainOpacity - anim.fromMainOpacity) * e;

    var mainOpacity = anim.targetMain ? (1 - e) : e;
    mainNodes.forEach(function (n) {
      setSpriteOpacity(n.sprite, mainOpacity);
      setUIOpacity(n.ui, mainOpacity);
    });

    childNodes.forEach(function (n) {
      var opacity = 0;
      if (anim.targetMain) {
        opacity = n.mainDef === anim.targetMain ? e : 0;
      } else {
        opacity = anim.fromFocusMain && n.mainDef === anim.fromFocusMain ? (1 - e) : 0;
      }
      setChildOpacity(n, opacity);
    });

    if (t >= 1) {
      anim.running = false;
      applyInstant(anim.targetMain);
    }
  }

  var tmpV = new THREE.Vector3();
  var camDir = new THREE.Vector3();

  function isInFront(pos) {
    camera.getWorldDirection(camDir);
    return tmpV.copy(pos).sub(camera.position).dot(camDir) > 0.1;
  }

  function projectToScreen(pos) {
    var v = tmpV.copy(pos).project(camera);
    return {
      x: (v.x * 0.5 + 0.5) * window.innerWidth,
      y: (-v.y * 0.5 + 0.5) * window.innerHeight
    };
  }

  function updateUI() {
    var all = getAllNodes();
    all.forEach(function (n) {
      var ui = n.ui;
      var visible = false;
      if (uniAnim.active) {
        visible = true;
      } else if (mode === 'overview') {
        visible = n.kind === 'main';
      } else if (mode === 'focus' && focusMain) {
        visible = n.kind === 'child' && n.mainDef === focusMain;
      } else if (mode === 'universe') {
        visible = n.kind === 'point' && n.universeEntry === topUniverse();
      }
      var uiOpacity = parseFloat(ui.hit.style.opacity || '0');
      if (uiOpacity < 0.05) visible = false;

      if (!visible || !isInFront(n.pos)) {
        ui.hit.style.display = 'none';
        ui.label.style.display = 'none';
        return;
      }

      var p = projectToScreen(n.pos);
      ui.hit.style.display = 'block';
      ui.label.style.display = 'block';
      ui.hit.style.left = p.x + 'px';
      ui.hit.style.top = p.y + 'px';

      // 解决冲突：保留字体随镜头缩放版本
        var nodeDist = camera.position.distanceTo(n.pos);
        var worldFont = (n.kind === 'main' ? (n.def.scale && n.def.scale > 1.2 ? 0.9 : 0.7) : 0.55) * (MOBILE_LAYOUT ? 0.45 : 1);
          if (mode === 'focus' || mode === 'universe') worldFont *= 0.8;
          if (n.labelScale) worldFont *= n.labelScale;   // 宇宙里的「顺带一提」用小字
        var cssFont = worldFont * window.innerHeight / (2 * nodeDist * Math.tan(camera.fov * Math.PI / 360));
        cssFont = Math.max(8, Math.min(40, cssFont));
        ui.label.style.fontSize = cssFont + 'px';
      ui.label.style.left = p.x + 'px';
      ui.label.style.top = (p.y + 10 + cssFont * 0.55) + 'px';
      //
      ui.label.style.left = p.x + 'px';
            // old top removed
      //

      ui.label.style.left = p.x + 'px';

        if (MOBILE_LAYOUT && mode === 'overview' && n.kind === 'main') {
          ui.label.style.left = (p.x + 18) + 'px';
          ui.label.style.top = p.y + 'px';
          ui.label.style.transform = 'translate(0, -50%)';
          ui.label.style.textAlign = 'left';
        } else if (n.kind === 'point' && n.universeEntry && n.universeEntry.def.labelAlign === 'right') {
          // 时间轴类宇宙：点在中轴上，文字放到点的外侧，别让竖线穿过字
          var toRight = !(n.def.pos && n.def.pos[0] < 0);
          ui.label.style.left = (p.x + (toRight ? 13 : -13)) + 'px';
          ui.label.style.top = p.y + 'px';
          ui.label.style.transform = toRight ? 'translate(0, -50%)' : 'translate(-100%, -50%)';
          ui.label.style.textAlign = toRight ? 'left' : 'right';
        } else {
          ui.label.style.left = p.x + 'px';
          ui.label.style.top = (p.y + 10 + cssFont * 0.55) + 'px';
          ui.label.style.transform = 'translate(-50%, 0)';
          ui.label.style.textAlign = 'center';
        }

      

    });
  }

  // ---------------- 空白处拖动平移视图 ----------------
  var dragging = false;
  var dragMoved = false;
  var lastPointerX = 0;
  var lastPointerY = 0;
  var pointers = {};
  var pinchStartDist = 0;
  var pinchStartCamDist = 0;


  function panCamera(dx, dy) {
    var dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    var right = new THREE.Vector3().crossVectors(dir, camera.up).normalize();
    var up = camera.up.clone().normalize();
    var dist = camera.position.distanceTo(viewLookAt);
    if (dist < 0.001) dist = 1;
    var height = renderer.domElement.clientHeight || window.innerHeight;
    var scale = 2 * Math.tan(camera.fov * Math.PI / 360) * dist / height;

    var delta = new THREE.Vector3()
      .add(right.clone().multiplyScalar(-dx * scale))
      .add(up.clone().multiplyScalar(dy * scale));

    camera.position.add(delta);
    viewLookAt.add(delta);
    camera.lookAt(viewLookAt);
  }

  renderer.domElement.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (anim.running || uniAnim.active || contentPanelOpen) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pointers);
      if (ids.length === 1) {
        if (Object.keys(pointers).length === 1) dragging = true;
        dragMoved = false;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      } else if (ids.length === 2) {
        dragging = false;
        var p1 = pointers[ids[0]];
        var p2 = pointers[ids[1]];
        pinchStartDist = Math.max(1, Math.hypot(p2.x - p1.x, p2.y - p1.y));
        pinchStartCamDist = camera.position.distanceTo(viewLookAt);
      }

      if (Object.keys(pointers).length === 1) {
    dragging = true;
    dragMoved = false;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
      }
    renderer.domElement.setPointerCapture && renderer.domElement.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  window.addEventListener('pointermove', function (e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId].x = e.clientX;
      pointers[e.pointerId].y = e.clientY;

      var ids = Object.keys(pointers);
      if (ids.length === 2) {
        var p1 = pointers[ids[0]];
        var p2 = pointers[ids[1]];
        var dist = Math.max(1, Math.hypot(p2.x - p1.x, p2.y - p1.y));
        var newDist = Math.max(5, Math.min(160, pinchStartCamDist * (pinchStartDist / dist)));
        var toCamera = new THREE.Vector3().subVectors(camera.position, viewLookAt);
        if (toCamera.length() < 0.001) toCamera.set(0, 0, 1);
        toCamera.normalize().multiplyScalar(newDist);
        camera.position.copy(viewLookAt).add(toCamera);
        camera.lookAt(viewLookAt);
          e.preventDefault();
        return;
      }

    if (!dragging) return;
    var dx = e.clientX - lastPointerX;
    var dy = e.clientY - lastPointerY;
      if (MOBILE_LAYOUT && mode === 'overview') dx = 0;
    if (!dragMoved) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      dragMoved = true;
    }
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    panCamera(dx, dy);
      e.preventDefault();
  });

  window.addEventListener('pointerup', function (e) {
      delete pointers[e.pointerId];
    dragging = false;
    dragMoved = false;
  });

  window.addEventListener('pointercancel', function (e) {
      delete pointers[e.pointerId];
    dragging = false;
    dragMoved = false;
  });

  // ---------------- 滚轮缩放 ----------------
  function zoomCamera(deltaY) {
    if (anim.running || uniAnim.active || contentPanelOpen) return;
    var factor = Math.max(0.8, Math.min(1.25, 1 + deltaY * 0.0011));
    var toCamera = new THREE.Vector3().subVectors(camera.position, viewLookAt);
    var dist = toCamera.length();
    if (dist < 0.001) dist = 1;
    var newDist = Math.max(5, Math.min(160, dist * factor));
    toCamera.normalize().multiplyScalar(newDist);
    camera.position.copy(viewLookAt).add(toCamera);
    camera.lookAt(viewLookAt);
  }

  window.addEventListener('wheel', function (e) {
    e.preventDefault();
    zoomCamera(e.deltaY);
  }, { passive: false });


  // ---------------- 渲染循环 ----------------
  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    var dt = clock.getDelta();
    updateAnimation(dt);
    updateUniverseAnim(dt);
    updateUniverseIdle(dt);
    updateSelectedGlow(dt);
    updateUI();
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    layoutStarMaps();          // 转屏 / 改窗口后重新把星图压进画面
  });

  function init() {
    mainLine.material.opacity = 0.9;
    mainNodes.forEach(function (n) { setSpriteOpacity(n.sprite, 1); setUIOpacity(n.ui, 1); });
    childNodes.forEach(function (n) { setChildOpacity(n, 0); });
    layoutStarMaps();
    try { sessionStorage.removeItem('bg5fnh_focus'); } catch (e) { }
    // 版本号只给调试用：网址带 ?dev 才显示
    if (versionBadge && /[?&]dev(\b|=|&|$)/.test(window.location.search)) {
      versionBadge.style.display = 'block';
    }
    hideHintSoon(7000);
    animate();
  }

  init();
})();
