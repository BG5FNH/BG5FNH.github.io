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
  var MOBILE_TOP_Y = 5.0;
  var MOBILE_Y_STEP = 2.0;
  var MOBILE_LINE_X = -2.0;

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
          var entryColor = pointDef.universe ? hexColor(pointDef.universeColor, 0xe8b4b8) : GOLD;
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
      return { pos: new THREE.Vector3(MOBILE_LINE_X, fy + 26, 0), up: new THREE.Vector3(0, 0, -1), lookAt: new THREE.Vector3(MOBILE_LINE_X, fy, 0) };
    }
    var dist = 24;
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
    mode = 'focus';
    focusMain = mainDef;
    hideHint();
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
    showHint(MOBILE_LAYOUT ? '点击金色圆点进入 · 空白处拖动 · 双指缩放' : '点击金色圆点进入 · 空白处拖动平移 · 滚轮缩放');
    startAnimation(getOverviewCamera(), null, 2.2);
    anim.fromFocusMain = prevFocus;
  }

  function hideHint() { if (hintEl) hintEl.style.opacity = '0'; }
  function showHint(text) { if (hintEl) { hintEl.textContent = text; hintEl.style.opacity = '1'; } }
  function hideVersionBadge() { if (versionBadge) versionBadge.style.opacity = '0'; }
  function showVersionBadge() { if (versionBadge) versionBadge.style.opacity = '1'; }
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
  var uniAnim = {
    active: false, phase: 'enter', elapsed: 0, duration: 1, diveRatio: 0.5, shrinkRatio: 0.45,
    fromPos: new THREE.Vector3(), divePos: new THREE.Vector3(), toPos: new THREE.Vector3(),
    fromLook: new THREE.Vector3(), toLook: new THREE.Vector3(),
    fromBg: null, toBg: null,
    fadeInNodes: [], fadeOutNodes: [], entry: null
  };

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
      if (label) label.textContent = '返回主视线';
    } else {
      backBtn.style.display = 'none';
    }
  }

  function makeUniverseEntry(pointDef, mainDef, centerPos) {
    var color = hexColor(pointDef.universeColor, 0xe8b4b8);
    var bg;
    if (pointDef.universeBg) {
      bg = new THREE.Color(pointDef.universeBg);
    } else {
      var hsl = {};
      bg = new THREE.Color(color);
      bg.getHSL(hsl);
      bg.setHSL(hsl.h, Math.min(0.45, hsl.s * 0.55), 0.07);
    }
    return { def: pointDef, mainDef: mainDef, color: color, bg: bg, centerPos: centerPos.clone(), nodes: [] };
  }

  function buildUniverseNodes(entry) {
    var defs = entry.def.universePoints || [];
    var center = entry.centerPos;
    function getByPath(path) { for (var i = 0; i < defs.length; i++) { if (defs[i].path === path) return defs[i]; } return null; }
    function parentPath(path) { var s = path.lastIndexOf('/'); return s === -1 ? null : path.slice(0, s); }
    defs.forEach(function (def) {
      var pos = placePoint(center, def.pos[0], def.pos[1]);
      var c = def.universe ? hexColor(def.universeColor, 0xe8b4b8) : entry.color;
      var sprite = makeGlowSprite(def.scale || 0.8, c);
      sprite.scale.set(0.001, 0.001, 1);
      sprite.position.copy(pos);
      scene.add(sprite);
      var ui = createNodeUI(def.name, false);
      ui.label.style.color = colorToCss(c);
      ui.label.style.textShadow = '0 0 12px ' + colorToRgba(c, 0.35);
      var node = {
        kind: 'point', def: def, mainDef: entry.mainDef, universeEntry: entry,
        pos: pos, sprite: sprite, ui: ui, line: null, baseScale: def.scale || 0.8
      };
      entry.nodes.push(node);
      ui.hit.addEventListener('click', function () { onPointClick(node); });
      ui.label.addEventListener('click', function () { onPointClick(node); });
      var pp = parentPath(def.path);
      var pDef = pp ? getByPath(pp) : null;
      var pPos = pDef ? placePoint(center, pDef.pos[0], pDef.pos[1]) : center;
      if (pos.distanceTo(pPos) > 0.001) {
        var line = makeLine([pPos.clone(), pos.clone()], entry.color, 0);
        scene.add(line);
        node.line = line;
      }
    });
  }

  function destroyUniverseNodes(entry) {
    entry.nodes.forEach(function (n) {
      scene.remove(n.sprite);
      if (n.line) scene.remove(n.line);
      if (n.ui.hit && n.ui.hit.parentNode) n.ui.hit.parentNode.removeChild(n.ui.hit);
      if (n.ui.label && n.ui.label.parentNode) n.ui.label.parentNode.removeChild(n.ui.label);
    });
    entry.nodes.length = 0;
  }

  function getUniverseViewCamera(entry) {
    var dist = MOBILE_LAYOUT ? 26 : 24;
    var c = entry.centerPos;
    if (MOBILE_LAYOUT) {
      return { pos: new THREE.Vector3(c.x, c.y + dist, c.z), up: new THREE.Vector3(0, 0, -1), lookAt: c.clone() };
    }
    return { pos: new THREE.Vector3(c.x - dist, c.y, c.z), up: new THREE.Vector3(0, 1, 0), lookAt: c.clone() };
  }

  function getDivePos(centerPos, dist) {
    if (MOBILE_LAYOUT) return new THREE.Vector3(centerPos.x, centerPos.y + dist, centerPos.z);
    return new THREE.Vector3(centerPos.x - dist, centerPos.y, centerPos.z);
  }

  function currentLevelNodes() {
    if (universeStack.length) return topUniverse().nodes;
    if (mode === 'focus' && focusMain) return childNodes.filter(function (n) { return n.mainDef === focusMain; });
    return mainNodes;
  }

  function enterUniverse(node) {
    if (anim.running || uniAnim.active || contentPanelOpen) return;
    var pointDef = node.def;
    var mainDef = node.mainDef || focusMain;
    var entry = makeUniverseEntry(pointDef, mainDef, node.pos);
    buildUniverseNodes(entry);

    var parentNodes = currentLevelNodes();
    universeStack.push(entry);
    mode = 'universe';

    uniAnim.active = true;
    uniAnim.phase = 'enter';
    uniAnim.elapsed = 0;
    uniAnim.duration = 2.2;
    uniAnim.diveRatio = 0.5;
    uniAnim.fromPos.copy(camera.position);
    uniAnim.divePos.copy(getDivePos(node.pos, 3.0));
    uniAnim.toPos.copy(getUniverseViewCamera(entry).pos);
    uniAnim.fromLook.copy(viewLookAt);
    uniAnim.toLook.copy(node.pos);
    uniAnim.fromBg = scene.background.clone();
    uniAnim.toBg = entry.bg.clone();
    uniAnim.fadeInNodes = entry.nodes;
    uniAnim.fadeOutNodes = parentNodes;
    uniAnim.entry = null;
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

    uniAnim.active = true;
    uniAnim.phase = 'exit';
    uniAnim.elapsed = 0;
    uniAnim.duration = 1.4;
    uniAnim.shrinkRatio = 0.45;
    uniAnim.fromPos.copy(camera.position);
    uniAnim.toPos.copy(toCam.pos);
    uniAnim.fromLook.copy(viewLookAt);
    uniAnim.toLook.copy(toCam.lookAt);
    uniAnim.fromBg = scene.background.clone();
    uniAnim.toBg = universeStack.length ? topUniverse().bg.clone() : new THREE.Color(BG);
    uniAnim.fadeInNodes = parentNodes;
    uniAnim.fadeOutNodes = entry.nodes;
    uniAnim.entry = entry;
    updateBackButton();
  }

  function updateUniverseAnim(dt) {
    if (!uniAnim.active) return;
    uniAnim.elapsed += dt;
    var t = clamp01(uniAnim.elapsed / uniAnim.duration);
    var e = easeInOutCubic(t);

    var fadeIn = uniAnim.fadeInNodes || [];
    var fadeOut = uniAnim.fadeOutNodes || [];

    if (uniAnim.phase === 'enter') {
      var ratio = uniAnim.diveRatio || 0.5;
      if (t < ratio) {
        // 阶段一：镜头慢慢转向并钻入光点，宇宙光点保持最小
        var lt = easeInOutCubic(clamp01(t / ratio));
        camera.position.lerpVectors(uniAnim.fromPos, uniAnim.divePos, lt);
        var lookA = new THREE.Vector3().lerpVectors(uniAnim.fromLook, uniAnim.toLook, lt);
        camera.lookAt(lookA);
        viewLookAt.copy(lookA);
        fadeIn.forEach(function (n) { setChildOpacity(n, 0); if (n.kind === 'point') setNodeScale(n, 0.001); });
        fadeOut.forEach(function (n) { setChildOpacity(n, 1 - lt); });
      } else {
        // 阶段二：镜头退回宇宙视角，宇宙光点从小到大长出来
        var lt2 = easeInOutCubic(clamp01((t - ratio) / (1 - ratio)));
        camera.position.lerpVectors(uniAnim.divePos, uniAnim.toPos, lt2);
        camera.lookAt(uniAnim.toLook);
        viewLookAt.copy(uniAnim.toLook);
        fadeIn.forEach(function (n) { setChildOpacity(n, lt2); if (n.kind === 'point') setNodeScale(n, n.baseScale * lt2); });
        fadeOut.forEach(function (n) { setChildOpacity(n, 0); });
      }
    } else {
      // 退出：先向中间缩小，再退回父星图
      var shrinkRatio = uniAnim.shrinkRatio || 0.45;
      if (t < shrinkRatio) {
        var lt = easeInOutCubic(clamp01(t / shrinkRatio));
        camera.position.copy(uniAnim.fromPos);
        camera.lookAt(uniAnim.fromLook);
        viewLookAt.copy(uniAnim.fromLook);
        fadeOut.forEach(function (n) { setChildOpacity(n, 1 - lt); if (n.kind === 'point') setNodeScale(n, n.baseScale * (1 - lt)); });
        fadeIn.forEach(function (n) { setChildOpacity(n, 0); });
      } else {
        var lt2 = easeInOutCubic(clamp01((t - shrinkRatio) / (1 - shrinkRatio)));
        camera.position.lerpVectors(uniAnim.fromPos, uniAnim.toPos, lt2);
        var look = new THREE.Vector3().lerpVectors(uniAnim.fromLook, uniAnim.toLook, lt2);
        camera.lookAt(look);
        viewLookAt.copy(look);
        fadeOut.forEach(function (n) { setChildOpacity(n, 0); if (n.kind === 'point') setNodeScale(n, 0.001); });
        fadeIn.forEach(function (n) { setChildOpacity(n, lt2); });
      }
    }

    if (uniAnim.fromBg && uniAnim.toBg) scene.background.copy(uniAnim.fromBg).lerp(uniAnim.toBg, e);

    if (mode === 'universe') {
      mainLine.material.opacity = 0;
      mainNodes.forEach(function (n) { setSpriteOpacity(n.sprite, 0); setUIOpacity(n.ui, 0); });
    }

    if (t >= 1) {
      uniAnim.active = false;
      fadeIn.forEach(function (n) { setChildOpacity(n, 1); if (n.kind === 'point') setNodeScale(n, n.baseScale); });
      fadeOut.forEach(function (n) { setChildOpacity(n, 0); if (n.kind === 'point') setNodeScale(n, 0.001); });
      if (mode === 'universe' && universeStack.length) scene.background.copy(topUniverse().bg);
      else if (mode !== 'universe') scene.background.copy(new THREE.Color(BG));
      if (uniAnim.phase === 'exit' && uniAnim.entry) { destroyUniverseNodes(uniAnim.entry); uniAnim.entry = null; }
      uniAnim.fadeInNodes = [];
      uniAnim.fadeOutNodes = [];
    }
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
    updateSelectedGlow(dt);
    updateUI();
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function init() {
    mainLine.material.opacity = 0.9;
    mainNodes.forEach(function (n) { setSpriteOpacity(n.sprite, 1); setUIOpacity(n.ui, 1); });
    childNodes.forEach(function (n) { setChildOpacity(n, 0); });
    try { sessionStorage.removeItem('bg5fnh_focus'); } catch (e) { }
      showVersionBadge();
    animate();
  }

  init();
})();
