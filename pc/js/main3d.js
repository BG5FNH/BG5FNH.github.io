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
  var MOBILE_TOP_Y = 6.0;
  var MOBILE_Y_STEP = 2.0;
  var MOBILE_LINE_X = -3;

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
      var mainLineThick = (window.innerWidth <= 768 && 'ontouchstart' in window) ? 0.3 : 0.14;
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
      var mobileThick = 0.04;
      mainLine = new THREE.Mesh(
        new THREE.BoxGeometry(mobileThick, mobileLineLen, mobileThick),
        new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 1.0, depthTest: false, depthWrite: false })
      );
      mainLine.position.set(MOBILE_LINE_X, (mobileMinY + mobileMaxY) / 2, 0);
    }
  scene.add(mainLine);

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

    (mainDef.children || []).forEach(function (childDef) {
      var childPos = buildChildPosition(mainPos, childDef);
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

      childUI.hit.addEventListener('click', function () { onChildNodeClick(mainDef, childDef, node); });
      childUI.label.addEventListener('click', function () { onChildNodeClick(mainDef, childDef, node); });

      if (childPos.distanceTo(mainPos) > 0.001) {
        var line = makeLine([mainPos.clone(), childPos.clone()], GOLD, 0);
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
    if (anim.running || mode === 'focus') return;
    mode = 'focus';
    focusMain = mainDef;
    hideHint();
    if (backBtn) backBtn.style.display = 'inline-flex';
      hideVersionBadge();
    startAnimation(getFocusCamera(mainDef), mainDef, 2.6);
    anim.fromFocusMain = null;
  }

  function onChildNodeClick(mainDef, childDef, node) {
    if (anim.running || mode !== 'focus') return;
    openContentPanel(mainDef, childDef, node);
  }

  var selectedNode = null;
  var selectedGlowTime = 0;
  var contentPanelOpen = false;

  function openContentPanel(mainDef, childDef, node) {
    if (contentPanelOpen) return;
    contentPanelOpen = true;
    // PC 端使用 iframe 浮层，不需要 sessionStorage 记录焦点
    selectedNode = node;
    selectedGlowTime = 0;

    setTimeout(function () {
      if (!selectedNode) return;
      if (mode !== 'focus') return;
      var p = projectToScreen(selectedNode.pos);
      var frameLeft = 0.02 * window.innerWidth;
      var frameTop = 0.02 * window.innerHeight;
      pageFrame.style.transformOrigin = (p.x - frameLeft) + 'px ' + (p.y - frameTop) + 'px';
      pageFrame.src = '../WayPoints/' + childDef.url;
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
    if (anim.running || mode !== 'focus') return;
    var prevFocus = focusMain;
    try { sessionStorage.removeItem('bg5fnh_focus'); } catch (e) { }
    mode = 'overview';
    focusMain = null;
    if (backBtn) backBtn.style.display = 'none';
      showVersionBadge();
    showHint('点击金色圆点进入 · 空白处拖动平移 · 双指缩放');
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
    if (backBtn) backBtn.style.display = 'inline-flex';
    applyInstant(found);
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
    var all = mainNodes.concat(childNodes);
    all.forEach(function (n) {
      var ui = n.ui;
      var visible = false;
      if (mode === 'overview') {
        visible = n.kind === 'main';
      } else if (mode === 'focus' && focusMain) {
        visible = n.kind === 'child' && n.mainDef === focusMain;
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
          if (mode === 'focus') worldFont *= 0.8;
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
    if (anim.running || contentPanelOpen) return;
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
    if (anim.running || contentPanelOpen) return;
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
