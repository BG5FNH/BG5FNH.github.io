/* ============================================================
   BG5FNH 导航点配置（坐标制）
   ------------------------------------------------------------
   1. mainLine.nodes 是首页主线上的导航点。
   2. 每个导航点里的 points 是它的星图光点。
   3. 光点坐标 pos: [横, 纵]，星图中心为 [0,0]。
      - 向右一单位：[1,0]
      - 向左一单位：[-1,0]
      - 向上一单位：[0,1]
      - 向下一单位：[0,-1]
   4. 父子关系由 path 的文件夹嵌套自动决定：
      path: '资料分享/软件破解资源分享' 的父光点就是 path 为 '资料分享' 的光点。
      找不到父光点时，连线自动接到导航点中心。
   5. url 相对于 WayPoints/ 目录。宇宙光点不用 url（点击直接进宇宙）。
   6. 目前主线只有三个导航点，所有光点都有真实内容，没有占位页。
   ============================================================ */
window.BG5FNH_WAYPOINTS = {
  gridUnit: 3.6,
  mainLine: {
    y: 0,
    z: 0,
    cameraOverview: { x: 3.1, y: 52, z: 0 },
    cameraLookAtOverview: { x: 3.1, y: 0, z: 0 },
    nodes: [
      {
        id: 'MyIntroduce',
        name: '个人介绍',
        x: -1.5,
        scale: 1.55,
        points: [
          {
            // 个人简介 = 履历宇宙：一条向上的红线，红线上挂天蓝色的比赛节点
            path: '个人介绍',
            name: '个人简介',
            pos: [0, 0],
            universe: true,
            universeColor: '#d1495b',      // 红：主线与入口
            universeColor2: '#8fd0ef',     // 天蓝：主线的点
            universeBg: '#0b0a12',         // 深靛底
            labelAlign: 'right',           // 点在竖线上，文字放点的外侧
            universePoints: [
              { key: 'about', path: '关于我', name: '关于我', pos: [0, 0], scale: 1.0, url: '个人介绍/个人简介/关于我/index.html' },

              // —— 主线：一条向上的红色线，四个比赛/录取节点是天蓝色 ——
              { key: 'm1', path: 'm1', parent: 'about', name: '2021 机器人对抗', pos: [0, 0.95], scale: 0.85, color: '#8fd0ef', lineColor: '#d1495b', url: '个人介绍/个人简介/履历/2021-robot/index.html' },
              { key: 'm2', path: 'm2', parent: 'm1', name: '2024 FLL 机器人', pos: [0, 1.95], scale: 0.85, color: '#8fd0ef', lineColor: '#d1495b', url: '个人介绍/个人简介/履历/2024-fll/index.html' },
              { key: 'm3', path: 'm3', parent: 'm2', name: '2024 创意智造', pos: [0, 2.95], scale: 0.85, color: '#8fd0ef', lineColor: '#d1495b', url: '个人介绍/个人简介/履历/2024-maker/index.html' },
              { key: 'm4', path: 'm4', parent: 'm3', name: '2026 录取通知书', pos: [0, 4.2], scale: 0.95, color: '#8fd0ef', lineColor: '#d1495b', url: '个人介绍/个人简介/履历/2026-admission/index.html' },

              // —— 边上带过的零碎：更小的点、更小的字 ——
              { key: 's1', path: 's1', parent: 'about', name: '这个站', pos: [-1.25, 0.5], scale: 0.5, labelScale: 0.78, color: '#6fa8c8', lineColor: '#8e4a56', url: '个人介绍/个人简介/这个站/index.html' },
              { key: 's2', path: 's2', parent: 'm1', name: '五好学生', pos: [1.2, 1.3], scale: 0.5, labelScale: 0.78, color: '#6fa8c8', lineColor: '#8e4a56', url: '个人介绍/个人简介/履历/2022-wuhao/index.html' },
              { key: 's3', path: 's3', parent: 'm2', name: '阳光学子', pos: [-1.2, 2.3], scale: 0.5, labelScale: 0.78, color: '#6fa8c8', lineColor: '#8e4a56', url: '个人介绍/个人简介/履历/2024-sunshine/index.html' },
              { key: 's4', path: 's4', parent: 'm3', name: '树范文化月', pos: [1.2, 3.3], scale: 0.5, labelScale: 0.78, color: '#6fa8c8', lineColor: '#8e4a56', url: '个人介绍/个人简介/履历/2025-dv/index.html' }
            ]
          },
          { path: '个人介绍/软件学习', name: '软件学习', pos: [0, 1], url: '个人介绍/软件学习/index.html' },
          { path: '个人介绍/硬件开发', name: '硬件开发', pos: [1, 0], url: '个人介绍/硬件开发/index.html' },
          { path: '个人介绍/编程语言', name: '编程语言', pos: [0, -1], url: '个人介绍/编程语言/index.html' },
          { path: '个人介绍/无线电通讯', name: '无线电通讯', pos: [-1, 0], url: '个人介绍/无线电通讯/index.html' },
          { path: '个人介绍/穿越机', name: '穿越机', pos: [-1, 1], url: '个人介绍/穿越机/index.html' },
          { path: '个人介绍/我的账号', name: '我的账号', pos: [2.4, -1.0], url: '个人介绍/我的账号/index.html' }
        ]
      },
      {
        id: 'ResourceShare',
        name: '资料分享',
        x: 3.2,
        scale: 1.0,
        points: [
          { path: '资料分享', name: '资料分享', pos: [0, 0], url: '资料分享/index.html' },
          { path: '资料分享/B站视频', name: 'B站视频', pos: [-1.6, 1.4], url: '资料分享/B站视频/index.html' },
          {
            // 资料库：六份整理好的笔记，一个文档一个光点，页面里带页内搜索和目录
            path: '资料分享/资料库',
            name: '资料库',
            pos: [-2.35, 0.15],
            universe: true,
            universeColor: '#e0b25c',
            universePoints: [
              { path: 'cpu', name: 'CPU 芯片', pos: [0, 1.75], url: '资料分享/资料库/cpu/index.html' },
              { path: 'gpu', name: 'GPU 显卡', pos: [1.5, 0.9], url: '资料分享/资料库/gpu/index.html' },
              { path: 'contest', name: '竞赛清单', pos: [1.5, -0.9], url: '资料分享/资料库/contest/index.html' },
              { path: 'modulation', name: '调制方式', pos: [0, -1.75], url: '资料分享/资料库/modulation/index.html' },
              { path: 'frequency', name: '频率划分', pos: [-1.5, -0.9], url: '资料分享/资料库/frequency/index.html' },
              { path: 'antenna', name: '天线类型', pos: [-1.5, 0.9], url: '资料分享/资料库/antenna/index.html' }
            ]
          },
          {
            path: '资料分享/软件破解资源分享',
            name: '软件破解资源分享',
            pos: [1.6, 1.4],
            universe: true,
            universeColor: '#e8b4b8',
            universePoints: [
              { path: '剪映破解版', name: '剪映破解版', pos: [0, 0], url: '资料分享/软件资源/软件破解资源分享/剪映破解版/index.html' },
              { path: '剪映破解版/PC端', name: 'PC 端', pos: [2.4, 0], url: '资料分享/软件资源/软件破解资源分享/剪映破解版/PC端/index.html' },
              // 一款软件一个光点
              { path: 'SolidWorks2022', name: 'SolidWorks 2022', pos: [-2.4, 0], url: '资料分享/软件资源/软件破解资源分享/SolidWorks2022/index.html' }
            ]
          },
          {
            path: '资料分享/无线电天线资料',
            name: '无线电天线资料',
            pos: [0, -2.2],
            universe: true,
            universeColor: '#a8e8b4',
            universePoints: [
              { path: '八木天线', name: '八木天线', pos: [0, 0], url: '资料分享/无线电资料/无线电天线资料/八木天线/index.html' },
              { path: '垂直极化天线', name: '垂直极化天线', pos: [1.2, 0.8], url: '资料分享/无线电资料/无线电天线资料/垂直极化天线/index.html' },
              { path: '偶极天线', name: '偶极天线', pos: [0, 1.5], url: '资料分享/无线电资料/无线电天线资料/偶极天线/index.html' },
              { path: '环形天线', name: '环形天线', pos: [-1.2, 0.8], url: '资料分享/无线电资料/无线电天线资料/环形天线/index.html' },
              { path: '抛物面天线', name: '抛物面天线', pos: [0, -1.5], url: '资料分享/无线电资料/无线电天线资料/抛物面天线/index.html' },
              { path: '对数周期天线', name: '对数周期天线', pos: [1.6, -0.8], url: '资料分享/无线电资料/无线电天线资料/对数周期天线/index.html' },
              { path: '螺旋天线', name: '螺旋天线', pos: [-1.6, -0.8], url: '资料分享/无线电资料/无线电天线资料/螺旋天线/index.html' },
              { path: '鞭状天线', name: '鞭状天线', pos: [0.9, -1.5], url: '资料分享/无线电资料/无线电天线资料/鞭状天线/index.html' }
            ]
          }
        ]
      },
      {
        id: 'MessageBoard',
        name: '留言板',
        x: 7.8,
        scale: 1.0,
        points: [
          { path: '留言板', name: '留言板', pos: [0, 0], url: '留言板/index.html' },
          { path: '留言板/GitHub', name: 'GitHub', pos: [1.2, -0.6], url: '留言板/GitHub/index.html' }
        ]
      }
    ]
  }
};
