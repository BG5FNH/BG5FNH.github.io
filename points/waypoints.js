/* ============================================================
   BG5FNH 导航点配置（坐标制）
   ------------------------------------------------------------
   1. mainLine.nodes 是首页主线上的导航点。
   2. 每个导航点里的 points 是它的星图光点。
   3. 光点坐标 pos: [横, 纵]，星图中心为 [0,0]。
      - 向右一单位：[1,0]    - 向左一单位：[-1,0]
      - 向上一单位：[0,1]    - 向下一单位：[0,-1]
   4. 父子关系由 path 的斜杠层级自动决定；也可以直接写 key + parent
      （宇宙内部的链式结构、分支都靠 parent 指定）。
      找不到父节点时，连线自动接到中心。
   5. url 相对于 WayPoints/ 目录。宇宙光点不写 url（点击直接进宇宙）。
   6. 结构约定：
      个人介绍 → 个人简介（红蓝时间轴宇宙）/ 软件学习 / 硬件开发 / 编程语言（→ 网安工具箱 → 从零学网安）/
                 无线电通讯 / 穿越机 / 我的账号
      资料分享 → 无线电（宇宙：天线 / 频率查询 / 调制方式）/ 电脑硬件（宇宙：CPU / GPU）/
                 竞赛 / 软件（宇宙：剪映 / SolidWorks）/ B站视频
      留言板   → 留言板 / GitHub
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
          // 编程语言的下级：妮露の网安工具箱（线自动接到「编程语言」那个点）
          { path: '个人介绍/编程语言/网安工具箱', name: '网安工具箱', pos: [0, -2.15], scale: 0.6, labelScale: 0.85, url: '个人介绍/编程语言/网安工具箱/index.html' },
          // 工具箱再往下一级：配套的从零学网安教程（线自动接到「网安工具箱」那个点）
          { path: '个人介绍/编程语言/网安工具箱/从零学网安', name: '从零学网安', pos: [0, -3.25], scale: 0.55, labelScale: 0.82, url: '个人介绍/编程语言/网安工具箱/从零学网安/index.html' },
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

          {
            // 无线电是这一片的中心：天线 / 频率查询 / 调制方式 都从它放射出去
            path: '资料分享/无线电',
            name: '无线电',
            pos: [0, 1.8],
            universe: true,
            universeColor: '#a8e8b4',
            universePoints: [
              { key: 'radio', path: 'radio', name: '无线电', pos: [0, 0], scale: 1.0, url: '资料分享/无线电/index.html' },

              {
                // 天线本身又是一个宇宙：总览（18 种速查）+ 8 种常用天线的单独说明
                key: 'ant', path: 'ant', name: '天线', pos: [0, 1.95], scale: 0.95,
                universe: true, universeColor: '#cfe8a8',
                universePoints: [
                  { key: 'ant-hub', path: 'ant-hub', name: '天线速查', pos: [0, -1.15], scale: 0.95, url: '资料分享/无线电/天线/index.html' },
                  { path: '八木天线', name: '八木天线', pos: [2.05, 0.85], scale: 0.8, url: '资料分享/无线电/天线/八木天线/index.html' },
                  { path: '垂直极化天线', name: '垂直极化天线', pos: [0.85, 2.05], scale: 0.8, url: '资料分享/无线电/天线/垂直极化天线/index.html' },
                  { path: '偶极天线', name: '偶极天线', pos: [-0.85, 2.05], scale: 0.8, url: '资料分享/无线电/天线/偶极天线/index.html' },
                  { path: '环形天线', name: '环形天线', pos: [-2.05, 0.85], scale: 0.8, url: '资料分享/无线电/天线/环形天线/index.html' },
                  { path: '抛物面天线', name: '抛物面天线', pos: [-2.05, -0.85], scale: 0.8, url: '资料分享/无线电/天线/抛物面天线/index.html' },
                  { path: '对数周期天线', name: '对数周期天线', pos: [-0.85, -2.05], scale: 0.8, url: '资料分享/无线电/天线/对数周期天线/index.html' },
                  { path: '螺旋天线', name: '螺旋天线', pos: [0.85, -2.05], scale: 0.8, url: '资料分享/无线电/天线/螺旋天线/index.html' },
                  { path: '鞭状天线', name: '鞭状天线', pos: [2.05, -0.85], scale: 0.8, url: '资料分享/无线电/天线/鞭状天线/index.html' }
                ]
              },

              { key: 'freq', path: 'freq', name: '频率查询', pos: [-1.8, -1.0], scale: 0.85, url: '资料分享/无线电/频率查询/index.html' },
              { key: 'mod', path: 'mod', name: '调制方式', pos: [1.8, -1.0], scale: 0.85, url: '资料分享/无线电/调制方式/index.html' }
            ]
          },

          {
            path: '资料分享/电脑硬件',
            name: '电脑硬件',
            pos: [1.85, 0.75],
            universe: true,
            universeColor: '#8fd0ef',
            universePoints: [
              { key: 'hw', path: 'hw', name: '电脑硬件', pos: [0, 0], scale: 1.0, url: '资料分享/电脑硬件/index.html' },
              { path: 'cpu', name: 'CPU 芯片', pos: [-1.6, -1.05], scale: 0.85, url: '资料分享/电脑硬件/CPU/index.html' },
              { path: 'gpu', name: 'GPU 显卡', pos: [1.6, -1.05], scale: 0.85, url: '资料分享/电脑硬件/GPU/index.html' }
            ]
          },

          { path: '资料分享/竞赛', name: '竞赛', pos: [-1.85, 0.75], url: '资料分享/竞赛/index.html' },

          {
            path: '资料分享/软件',
            name: '软件',
            pos: [1.85, -1.1],
            universe: true,
            universeColor: '#e8b4b8',
            universePoints: [
              { key: 'sw', path: 'sw', name: '软件', pos: [0, 0], scale: 1.0, url: '资料分享/软件/index.html' },
              { key: 'jy', path: 'jy', name: '剪映破解版', pos: [-1.6, -1.05], scale: 0.85, url: '资料分享/软件/剪映破解版/index.html' },
              { key: 'jypc', path: 'jypc', parent: 'jy', name: 'PC 端', pos: [-1.6, -2.15], scale: 0.7, labelScale: 0.85, url: '资料分享/软件/剪映破解版/PC端/index.html' },
              { path: 'solidworks', name: 'SolidWorks 2022', pos: [1.6, -1.05], scale: 0.85, url: '资料分享/软件/SolidWorks2022/index.html' }
            ]
          },

          { path: '资料分享/B站视频', name: 'B站视频', pos: [-1.85, -1.1], url: '资料分享/B站视频/index.html' },

          // 机械与控制：不套宇宙，直接在星图里往下分叉，点一下就到内容
          { path: '资料分享/机械与控制', name: '机械与控制', pos: [0, -1.95], scale: 0.95, url: '资料分享/机械与控制/index.html' },
          { path: '资料分享/机械与控制/机械模块', name: '机械模块', pos: [-1.15, -2.85], scale: 0.78, labelScale: 0.9, url: '资料分享/机械与控制/机械模块/index.html' },
          { path: '资料分享/机械与控制/机械模块/结构与传动', name: '结构与传动', pos: [-2.05, -3.65], scale: 0.58, labelScale: 0.82, url: '资料分享/机械与控制/机械模块/结构与传动/index.html' },
          { path: '资料分享/机械与控制/嵌入式模块', name: '嵌入式模块', pos: [1.15, -2.85], scale: 0.78, labelScale: 0.9, url: '资料分享/机械与控制/嵌入式模块/index.html' },
          { path: '资料分享/机械与控制/嵌入式模块/开发板查询', name: '开发板查询', pos: [2.05, -3.65], scale: 0.58, labelScale: 0.82, url: '资料分享/机械与控制/嵌入式模块/开发板查询/index.html' },

          {
            // 声乐：单层宇宙，里面就是这张声音地图（不再往里套宇宙）
            path: '资料分享/声乐',
            name: '声乐',
            pos: [-2.9, -0.15],
            universe: true,
            universeColor: '#e8b45c',
            universePoints: [
              { key: 'sm', path: 'sm', name: '声音地图', pos: [0, 0], scale: 1.0, url: '资料分享/声乐/声音地图/index.html' }
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
