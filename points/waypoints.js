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

          // 机械与控制：一个宇宙，里面是一棵辐射状的树。
          // 关键：不再套子宇宙——所有节点都是这个宇宙里的光点，靠 parent 连成树。
          {
            path: '资料分享/机械与控制',
            name: '机械与控制',
            pos: [0, -1.95],
            universe: true,
            universeColor: '#b58fd0',
            universePoints: [
              { key: 'mc', path: 'mc', name: '机械与控制', pos: [0, 0], scale: 1.0, url: '资料分享/机械与控制/index.html' },

              // —— 左枝：机械 ——
              { key: 'mech', path: 'mech', parent: 'mc', name: '机械模块', pos: [-1.5, -1.1], scale: 0.88, url: '资料分享/机械与控制/机械模块/index.html' },
              { key: 'sg', path: 'sg', parent: 'mech', name: '舵机种类', pos: [-2.5, -1.9], scale: 0.7, labelScale: 0.9, url: '资料分享/机械与控制/机械模块/舵机种类/index.html' },
              { key: 'st', path: 'st', parent: 'mech', name: '步进电机', pos: [-2.1, -2.7], scale: 0.7, labelScale: 0.9, url: '资料分享/机械与控制/机械模块/步进电机/index.html' },
              { key: 'tr', path: 'tr', parent: 'mech', name: '结构与传动', pos: [-1.1, -2.5], scale: 0.7, labelScale: 0.9, url: '资料分享/机械与控制/机械模块/结构与传动/index.html' },

              // —— 右枝：嵌入式 ——
              { key: 'emb', path: 'emb', parent: 'mc', name: '嵌入式模块', pos: [1.5, -1.1], scale: 0.88, url: '资料分享/机械与控制/嵌入式模块/index.html' },

              // 开发板这一支再分叉：总表 + 四个系列
              { key: 'boards', path: 'boards', parent: 'emb', name: '开发板', pos: [1.0, -2.0], scale: 0.8, url: '资料分享/机械与控制/嵌入式模块/开发板查询/index.html' },
              { key: 'esp32', path: 'esp32', parent: 'boards', name: 'ESP32', pos: [0.1, -2.8], scale: 0.62, labelScale: 0.88, url: '资料分享/机械与控制/嵌入式模块/开发板查询/index.html?fam=esp32' },
              { key: 'stm32', path: 'stm32', parent: 'boards', name: 'STM32', pos: [0.9, -3.2], scale: 0.62, labelScale: 0.88, url: '资料分享/机械与控制/嵌入式模块/开发板查询/index.html?fam=stm32' },
              { key: 'arduino', path: 'arduino', parent: 'boards', name: 'Arduino', pos: [1.8, -3.2], scale: 0.62, labelScale: 0.88, url: '资料分享/机械与控制/嵌入式模块/开发板查询/index.html?fam=arduino' },
              { key: 'rpi', path: 'rpi', parent: 'boards', name: '树莓派', pos: [2.6, -2.8], scale: 0.62, labelScale: 0.88, url: '资料分享/机械与控制/嵌入式模块/开发板查询/index.html?fam=rpi' },

              // 电路板与传感器各自成支
              { key: 'pcb', path: 'pcb', parent: 'emb', name: '电路板', pos: [2.4, -1.6], scale: 0.7, labelScale: 0.9, url: '资料分享/机械与控制/嵌入式模块/电路板/index.html' },
              { key: 'sens', path: 'sens', parent: 'emb', name: '传感器', pos: [2.3, -0.4], scale: 0.8, url: '资料分享/机械与控制/嵌入式模块/传感器/index.html' },
              { key: 'temp', path: 'temp', parent: 'sens', name: '温度', pos: [3.2, -1.0], scale: 0.6, labelScale: 0.86, url: '资料分享/机械与控制/嵌入式模块/传感器/index.html#temp' },
              { key: 'imu', path: 'imu', parent: 'sens', name: '六轴', pos: [3.5, -0.2], scale: 0.6, labelScale: 0.86, url: '资料分享/机械与控制/嵌入式模块/传感器/index.html#imu' },
              { key: 'light', path: 'light', parent: 'sens', name: '光敏', pos: [3.5, 0.6], scale: 0.6, labelScale: 0.86, url: '资料分享/机械与控制/嵌入式模块/传感器/index.html#light' },
              { key: 'gas', path: 'gas', parent: 'sens', name: '气体', pos: [3.2, 1.3], scale: 0.6, labelScale: 0.86, url: '资料分享/机械与控制/嵌入式模块/传感器/index.html#gas' }
            ]
          },

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
          },

          {
            // 机器学习：妮露配色宇宙。中点是感知机，往右一棵大树。
            // 节点大小 = 重要度（3 核心 / 2 主要 / 1 次级技巧），由生成脚本算出坐标。
            path: '资料分享/机器学习',
            name: '机器学习',
            pos: [2.9, -1.4],
            universe: true,
            universeColor: '#7fd4ef',
            universeColor2: '#f4a6c0',
            universeBg: '#06101a',
            universePoints: [
              { key: 'ptron', path: 'ptron', name: '感知机', pos: [5.80, 0.00], scale: 1.15, labelScale: 1, color: '#e8f7fd', lineColor: '#7fb8cf', url: '资料分享/机器学习/perceptron.html' },
              { key: 'mlp', path: 'mlp', parent: 'act', name: '多层感知机', pos: [15.02, -12.10], scale: 1.15, labelScale: 1, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/mlp.html' },
              { key: 'linear', path: 'linear', parent: 'mlp', name: '线性层', pos: [19.62, 0.00], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#linear' },
              { key: 'act', path: 'act', parent: 'ptron', name: '激活函数', pos: [10.41, -19.03], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#act' },
              { key: 'relu', path: 'relu', parent: 'act', name: 'ReLU', pos: [15.02, -25.52], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/relu.html' },
              { key: 'gelu', path: 'gelu', parent: 'act', name: 'GELU', pos: [15.02, -25.96], scale: 0.5, labelScale: 0.78, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#gelu' },
              { key: 'loss', path: 'loss', parent: 'bp', name: '损失函数', pos: [24.23, -1.43], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#loss' },
              { key: 'ce', path: 'ce', parent: 'loss', name: '交叉熵', pos: [28.84, -0.44], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#ce' },
              { key: 'mse', path: 'mse', parent: 'loss', name: 'MSE', pos: [28.84, -0.88], scale: 0.5, labelScale: 0.78, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#mse' },
              { key: 'bp', path: 'bp', parent: 'mlp', name: '反向传播', pos: [19.62, -2.69], scale: 1.15, labelScale: 1, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#bp' },
              { key: 'autodiff', path: 'autodiff', parent: 'bp', name: '自动微分', pos: [24.23, -3.96], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#autodiff' },
              { key: 'opt', path: 'opt', parent: 'loss', name: '优化器', pos: [28.84, -2.42], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#opt' },
              { key: 'sgd', path: 'sgd', parent: 'opt', name: 'SGD 系列', pos: [33.45, -1.32], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#sgd' },
              { key: 'adam', path: 'adam', parent: 'opt', name: 'AdamW', pos: [33.45, -1.76], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#adam' },
              { key: 'reg', path: 'reg', parent: 'opt', name: '正则化', pos: [33.45, -2.42], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#reg' },
              { key: 'dropout', path: 'dropout', parent: 'reg', name: 'Dropout', pos: [38.06, -2.20], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#dropout' },
              { key: 'bn', path: 'bn', parent: 'reg', name: 'Normalization', pos: [38.06, -2.64], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#bn' },
              { key: 'init', path: 'init', parent: 'opt', name: '初始化', pos: [33.45, -3.08], scale: 0.5, labelScale: 0.78, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#init' },
              { key: 'lr', path: 'lr', parent: 'opt', name: '学习率调度', pos: [33.45, -3.52], scale: 0.5, labelScale: 0.78, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#lr' },
              { key: 'cnn', path: 'cnn', parent: 'mlp', name: 'CNN', pos: [19.62, -5.61], scale: 1.15, labelScale: 1, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#cnn' },
              { key: 'conv', path: 'conv', parent: 'cnn', name: '卷积', pos: [24.23, -4.62], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/conv.html' },
              { key: 'pool', path: 'pool', parent: 'conv', name: '池化', pos: [24.23, -3.55], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#8e5a70', url: '资料分享/机器学习/pool.html' },
              { key: 'lenet', path: 'lenet', parent: 'conv', name: 'LeNet-5', pos: [28.84, -4.40], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#lenet' },
              { key: 'alexnet', path: 'alexnet', parent: 'conv', name: 'AlexNet', pos: [28.84, -4.84], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#alexnet' },
              { key: 'vgg', path: 'vgg', parent: 'alexnet', name: 'VGG', pos: [33.45, -4.84], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#vgg' },
              { key: 'googlenet', path: 'googlenet', parent: 'vgg', name: 'Inception', pos: [38.06, -4.84], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#googlenet' },
              { key: 'resnet', path: 'resnet', parent: 'cnn', name: 'ResNet 残差', pos: [24.23, -5.72], scale: 1.15, labelScale: 1, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#resnet' },
              { key: 'densenet', path: 'densenet', parent: 'resnet', name: 'DenseNet', pos: [28.84, -5.28], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#densenet' },
              { key: 'mobilenet', path: 'mobilenet', parent: 'resnet', name: 'MobileNet', pos: [28.84, -5.72], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#mobilenet' },
              { key: 'effnet', path: 'effnet', parent: 'mobilenet', name: 'EfficientNet', pos: [33.45, -5.72], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#effnet' },
              { key: 'unet', path: 'unet', parent: 'resnet', name: 'U-Net', pos: [28.84, -6.16], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#unet' },
              { key: 'yolo', path: 'yolo', parent: 'unet', name: 'YOLO 系列', pos: [33.45, -6.16], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#yolo' },
              { key: 'seg', path: 'seg', parent: 'cnn', name: '检测/分割', pos: [24.23, -6.60], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#seg' },
              { key: 'rnn', path: 'rnn', parent: 'mlp', name: 'RNN', pos: [19.62, -8.58], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-rnn.html#rnn' },
              { key: 'lstm', path: 'lstm', parent: 'rnn', name: 'LSTM / GRU', pos: [24.23, -8.58], scale: 1.15, labelScale: 1, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/lstm.html' },
              { key: 'bptt', path: 'bptt', parent: 'lstm', name: 'BPTT 沿时间反传', pos: [28.84, -7.04], scale: 0.5, labelScale: 0.78, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-rnn.html#bptt' },
              { key: 'seq2seq', path: 'seq2seq', parent: 'lstm', name: 'Seq2Seq', pos: [28.84, -10.12], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-rnn.html#seq2seq' },
              { key: 'attn', path: 'attn', parent: 'seq2seq', name: '注意力机制', pos: [33.45, -10.12], scale: 1.15, labelScale: 1, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/attn.html' },
              { key: 'tfm', path: 'tfm', parent: 'attn', name: 'Transformer', pos: [38.06, -10.12], scale: 1.15, labelScale: 1, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#tfm' },
              { key: 'selfattn', path: 'selfattn', parent: 'tfm', name: '自注意力', pos: [42.66, -7.48], scale: 1.15, labelScale: 1, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#selfattn' },
              { key: 'mha', path: 'mha', parent: 'selfattn', name: '多头注意力', pos: [47.27, -7.48], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#mha' },
              { key: 'pos', path: 'pos', parent: 'tfm', name: '位置编码', pos: [42.66, -7.92], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#pos' },
              { key: 'bert', path: 'bert', parent: 'tfm', name: 'BERT', pos: [42.66, -8.36], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#bert' },
              { key: 'gpt', path: 'gpt', parent: 'tfm', name: 'GPT 系列', pos: [42.66, -9.90], scale: 1.15, labelScale: 1, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#gpt' },
              { key: 't5', path: 't5', parent: 'tfm', name: 'T5', pos: [42.66, -11.44], scale: 0.5, labelScale: 0.78, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#t5' },
              { key: 'vit', path: 'vit', parent: 'tfm', name: 'ViT', pos: [42.66, -12.10], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#vit' },
              { key: 'swin', path: 'swin', parent: 'vit', name: 'Swin', pos: [47.27, -11.88], scale: 0.5, labelScale: 0.78, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#swin' },
              { key: 'clip', path: 'clip', parent: 'vit', name: 'CLIP', pos: [47.27, -12.32], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#clip' },
              { key: 'whisper', path: 'whisper', parent: 'tfm', name: 'Whisper', pos: [42.66, -12.76], scale: 0.5, labelScale: 0.78, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#whisper' },
              { key: 'llm', path: 'llm', parent: 'gpt', name: 'LLM', pos: [47.27, -9.90], scale: 1.15, labelScale: 1, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#llm' },
              { key: 'sft', path: 'sft', parent: 'llm', name: '指令微调 SFT', pos: [51.88, -8.80], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#sft' },
              { key: 'rlhf', path: 'rlhf', parent: 'llm', name: 'RLHF', pos: [51.88, -9.24], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#rlhf' },
              { key: 'lora', path: 'lora', parent: 'llm', name: 'LoRA', pos: [51.88, -9.68], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/lora.html' },
              { key: 'rag', path: 'rag', parent: 'llm', name: 'RAG', pos: [51.88, -10.12], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#rag' },
              { key: 'moe', path: 'moe', parent: 'llm', name: 'MoE 混合专家', pos: [51.88, -10.56], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/moe.html' },
              { key: 'longctx', path: 'longctx', parent: 'llm', name: 'KV 缓存', pos: [51.88, -11.00], scale: 0.5, labelScale: 0.78, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#longctx' },
              { key: 'gen', path: 'gen', parent: 'mlp', name: '生成模型', pos: [19.62, -14.96], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#gen' },
              { key: 'ae', path: 'ae', parent: 'gen', name: '自编码器', pos: [24.23, -13.20], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#ae' },
              { key: 'vae', path: 'vae', parent: 'ae', name: 'VAE', pos: [28.84, -13.20], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/vae.html' },
              { key: 'gan', path: 'gan', parent: 'gen', name: 'GAN', pos: [24.23, -14.30], scale: 1.15, labelScale: 1, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/gan.html' },
              { key: 'dcgan', path: 'dcgan', parent: 'gan', name: 'DCGAN', pos: [28.84, -13.64], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#dcgan' },
              { key: 'wgan', path: 'wgan', parent: 'gan', name: 'WGAN / 梯度惩罚', pos: [28.84, -14.08], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#wgan' },
              { key: 'stylegan', path: 'stylegan', parent: 'gan', name: 'StyleGAN', pos: [28.84, -14.52], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#stylegan' },
              { key: 'cyclegan', path: 'cyclegan', parent: 'gan', name: 'CycleGAN', pos: [28.84, -14.96], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#cyclegan' },
              { key: 'diff', path: 'diff', parent: 'gen', name: '扩散模型', pos: [24.23, -15.62], scale: 1.15, labelScale: 1, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/diffusion.html' },
              { key: 'ddpm', path: 'ddpm', parent: 'diff', name: 'DDPM', pos: [28.84, -15.40], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#ddpm' },
              { key: 'ddim', path: 'ddim', parent: 'ddpm', name: 'DDIM', pos: [33.45, -15.40], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#ddim' },
              { key: 'ldm', path: 'ldm', parent: 'diff', name: 'Latent Diffusion', pos: [28.84, -15.84], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#ldm' },
              { key: 'controlnet', path: 'controlnet', parent: 'ldm', name: 'ControlNet', pos: [33.45, -15.84], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#controlnet' },
              { key: 'flow', path: 'flow', parent: 'gen', name: '归一化流', pos: [24.23, -16.28], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#flow' },
              { key: 'tts', path: 'tts', parent: 'gen', name: '声码器', pos: [24.23, -16.72], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#tts' },
              { key: 'gnn', path: 'gnn', parent: 'mlp', name: 'GNN', pos: [19.62, -17.38], scale: 0.78, labelScale: 0.9, color: '#c9b6f2', lineColor: '#8a7bb5', url: '资料分享/机器学习/b-graph.html#gnn' },
              { key: 'gcn', path: 'gcn', parent: 'gnn', name: 'GCN', pos: [24.23, -17.16], scale: 0.78, labelScale: 0.9, color: '#c9b6f2', lineColor: '#8a7bb5', url: '资料分享/机器学习/b-graph.html#gcn' },
              { key: 'nerf', path: 'nerf', parent: 'gnn', name: 'NeRF', pos: [24.23, -17.60], scale: 0.5, labelScale: 0.78, color: '#c9b6f2', lineColor: '#8a7bb5', url: '资料分享/机器学习/b-graph.html#nerf' },
              { key: 'rl', path: 'rl', parent: 'mlp', name: '强化学习', pos: [19.62, -18.70], scale: 1.15, labelScale: 1, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#rl' },
              { key: 'mdp', path: 'mdp', parent: 'rl', name: 'MDP', pos: [24.23, -18.04], scale: 0.78, labelScale: 0.9, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#mdp' },
              { key: 'qlearn', path: 'qlearn', parent: 'mdp', name: 'DQN', pos: [28.84, -18.04], scale: 0.78, labelScale: 0.9, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#qlearn' },
              { key: 'pg', path: 'pg', parent: 'rl', name: '策略梯度', pos: [24.23, -18.70], scale: 0.78, labelScale: 0.9, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#pg' },
              { key: 'ppo', path: 'ppo', parent: 'pg', name: 'PPO', pos: [28.84, -18.48], scale: 1.15, labelScale: 1, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#ppo' },
              { key: 'sac', path: 'sac', parent: 'pg', name: 'SAC', pos: [28.84, -18.92], scale: 0.5, labelScale: 0.78, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#sac' },
              { key: 'marl', path: 'marl', parent: 'rl', name: '自博弈', pos: [24.23, -19.36], scale: 0.5, labelScale: 0.78, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#marl' },
              { key: 'eng', path: 'eng', parent: 'mlp', name: '训练与工程', pos: [19.62, -21.34], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#eng' },
              { key: 'aug', path: 'aug', parent: 'eng', name: '数据增强', pos: [24.23, -19.80], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#aug' },
              { key: 'transfer', path: 'transfer', parent: 'eng', name: '迁移学习', pos: [24.23, -20.24], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#transfer' },
              { key: 'distill', path: 'distill', parent: 'eng', name: '知识蒸馏', pos: [24.23, -20.90], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#distill' },
              { key: 'prune', path: 'prune', parent: 'distill', name: '剪枝', pos: [28.84, -20.68], scale: 0.5, labelScale: 0.78, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#prune' },
              { key: 'quant', path: 'quant', parent: 'distill', name: '量化', pos: [28.84, -21.12], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#quant' },
              { key: 'dist', path: 'dist', parent: 'eng', name: '分布式训练', pos: [24.23, -21.78], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#dist' },
              { key: 'amp', path: 'amp', parent: 'dist', name: '混合精度', pos: [28.84, -21.56], scale: 0.5, labelScale: 0.78, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#amp' },
              { key: 'ckpt', path: 'ckpt', parent: 'dist', name: '梯度检查点', pos: [28.84, -22.00], scale: 0.5, labelScale: 0.78, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#ckpt' },
              { key: 'data', path: 'data', parent: 'eng', name: '数据工程', pos: [24.23, -22.44], scale: 1.15, labelScale: 1, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#data' },
              { key: 'eval', path: 'eval', parent: 'eng', name: '评估与划分', pos: [24.23, -22.88], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#eval' },
              { key: 'leak', path: 'leak', parent: 'eval', name: '数据泄漏', pos: [28.84, -22.88], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#leak' },
              { key: 'app', path: 'app', parent: 'mlp', name: '应用方向', pos: [19.62, -24.20], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#app' },
              { key: 'cv', path: 'cv', parent: 'app', name: 'CV', pos: [24.23, -23.32], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#cv' },
              { key: 'nlp', path: 'nlp', parent: 'app', name: 'NLP', pos: [24.23, -23.76], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#nlp' },
              { key: 'asr', path: 'asr', parent: 'app', name: '语音', pos: [24.23, -24.20], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#asr' },
              { key: 'rec', path: 'rec', parent: 'app', name: '推荐系统', pos: [24.23, -24.64], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#rec' },
              { key: 'bio', path: 'bio', parent: 'app', name: '科学计算', pos: [24.23, -25.08], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#bio' },
              { key: 'tl1936', path: 'tl1936', name: '1936 图灵机', pos: [0.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl1943', path: 'tl1943', parent: 'tl1936', name: '1943 神经元模型', pos: [5.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAbove: true, labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl1949', path: 'tl1949', parent: 'tl1943', name: '1949 Hebbian', pos: [10.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl1958', path: 'tl1958', parent: 'tl1949', name: '1958 感知机', pos: [15.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAbove: true, labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl1969', path: 'tl1969', parent: 'tl1958', name: '1969 XOR 困境', pos: [20.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl1986', path: 'tl1986', parent: 'tl1969', name: '1986 反向传播', pos: [25.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAbove: true, labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl1989', path: 'tl1989', parent: 'tl1986', name: '1989 万能逼近', pos: [30.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl1998', path: 'tl1998', parent: 'tl1989', name: '1998 LeNet-5', pos: [35.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAbove: true, labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl2006', path: 'tl2006', parent: 'tl1998', name: '2006 深度信念网络', pos: [40.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl2012', path: 'tl2012', parent: 'tl2006', name: '2012 AlexNet', pos: [45.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAbove: true, labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl2017', path: 'tl2017', parent: 'tl2012', name: '2017 Transformer', pos: [50.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl2020', path: 'tl2020', parent: 'tl2017', name: '2020 Scaling Law', pos: [55.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAbove: true, labelAlways: true, url: '资料分享/机器学习/timeline.html' },
              { key: 'tl2022', path: 'tl2022', parent: 'tl2020', name: '2022 RLHF 大模型', pos: [60.00, 17.00], scale: 0.5, labelScale: 0.78, color: '#e6cf9a', lineColor: '#8a7348', labelAlways: true, url: '资料分享/机器学习/timeline.html' }
            ]
          },

          {
            // 虚拟币：暖橙 + 石板灰宇宙。中点是「虚拟币」，往右一条 12 章的树干，由浅入深。
            // 12 章 = 主干（scale 1.15），47 个知识点 = 分枝（scale 0.78）。
            path: '资料分享/虚拟币',
            name: '虚拟币',
            pos: [-2.9, 1.62],
            universe: true,
            universeColor: '#f0b45a',
            universeColor2: '#a8c6dc',
            universeBg: '#100c07',
            universePoints: [
              { key: 'vc', path: 'vc', name: '虚拟币', pos: [0, 0], scale: 1.35, labelScale: 1.05, color: '#fff0cc', lineColor: '#c9a86a', url: '资料分享/虚拟币/index.html' },

              // —— 0 钱与账本 ——
              { key: 'vc0', path: 'vc0', parent: 'vc', name: '0 钱与账本', pos: [5.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#ffd79a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch0.html' },
              { key: 'vc0a', path: 'vc0a', parent: 'vc0', name: '现金与余额', pos: [7.90, 2.60], scale: 0.92, labelScale: 1.5, color: '#f0b45a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch0.html' },
              { key: 'vc0b', path: 'vc0b', parent: 'vc0', name: '账本三铁律', pos: [7.90, 4.90], scale: 0.92, labelScale: 1.5, color: '#f0b45a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch0.html' },

              // —— 1 转账与共识 ——
              { key: 'vc1', path: 'vc1', parent: 'vc0', name: '1 转账与共识', pos: [10.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#ffd79a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch1.html' },
              { key: 'vc1a', path: 'vc1a', parent: 'vc1', name: '双重支付', pos: [12.90, -2.60], scale: 0.92, labelScale: 1.5, color: '#f0b45a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch1.html' },
              { key: 'vc1b', path: 'vc1b', parent: 'vc1', name: '两种解法', pos: [12.90, -4.90], scale: 0.92, labelScale: 1.5, color: '#f0b45a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch1.html' },
              { key: 'vc1c', path: 'vc1c', parent: 'vc1', name: '确认数', pos: [12.90, -7.20], scale: 0.92, labelScale: 1.5, color: '#f0b45a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch1.html' },

              // —— 2 区块链三件套 ——
              { key: 'vc2', path: 'vc2', parent: 'vc1', name: '2 区块链三件套', pos: [15.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#ffd79a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch2.html' },
              { key: 'vc2a', path: 'vc2a', parent: 'vc2', name: '哈希指纹', pos: [17.90, 2.60], scale: 0.92, labelScale: 1.5, color: '#f0b45a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch2.html' },
              { key: 'vc2b', path: 'vc2b', parent: 'vc2', name: '区块与链', pos: [17.90, 4.90], scale: 0.92, labelScale: 1.5, color: '#f0b45a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch2.html' },
              { key: 'vc2c', path: 'vc2c', parent: 'vc2', name: '难度调整', pos: [17.90, 7.20], scale: 0.92, labelScale: 1.5, color: '#f0b45a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch2.html' },
              { key: 'vc2d', path: 'vc2d', parent: 'vc2', name: '全节点', pos: [17.90, 9.50], scale: 0.92, labelScale: 1.5, color: '#f0b45a', lineColor: '#a5762f', url: '资料分享/虚拟币/ch2.html' },

              // —— 3 比特币 ——
              { key: 'vc3', path: 'vc3', parent: 'vc2', name: '3 比特币', pos: [20.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#ffe6b8', lineColor: '#b58540', url: '资料分享/虚拟币/ch3.html' },
              { key: 'vc3a', path: 'vc3a', parent: 'vc3', name: 'UTXO 现金模型', pos: [22.90, -2.60], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch3.html' },
              { key: 'vc3b', path: 'vc3b', parent: 'vc3', name: '手续费', pos: [22.90, -4.90], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch3.html' },
              { key: 'vc3c', path: 'vc3c', parent: 'vc3', name: '减半 2100 万', pos: [22.90, -7.20], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch3.html' },
              { key: 'vc3d', path: 'vc3d', parent: 'vc3', name: '51% 攻击', pos: [22.90, -9.50], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch3.html' },
              { key: 'vc3e', path: 'vc3e', parent: 'vc3', name: '分叉', pos: [22.90, -11.80], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch3.html' },
              { key: 'vc3f', path: 'vc3f', parent: 'vc3', name: '闪电网络', pos: [22.90, -14.10], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch3.html' },

              // —— 4 以太坊 ——
              { key: 'vc4', path: 'vc4', parent: 'vc3', name: '4 以太坊', pos: [25.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#ffe6b8', lineColor: '#b58540', url: '资料分享/虚拟币/ch4.html' },
              { key: 'vc4a', path: 'vc4a', parent: 'vc4', name: '账户模型', pos: [27.90, 2.60], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch4.html' },
              { key: 'vc4b', path: 'vc4b', parent: 'vc4', name: '智能合约', pos: [27.90, 4.90], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch4.html' },
              { key: 'vc4c', path: 'vc4c', parent: 'vc4', name: 'Gas 油费', pos: [27.90, 7.20], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch4.html' },
              { key: 'vc4d', path: 'vc4d', parent: 'vc4', name: 'ERC-20', pos: [27.90, 9.50], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch4.html' },
              { key: 'vc4e', path: 'vc4e', parent: 'vc4', name: 'NFT', pos: [27.90, 11.80], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch4.html' },
              { key: 'vc4f', path: 'vc4f', parent: 'vc4', name: 'Layer2', pos: [27.90, 14.10], scale: 0.92, labelScale: 1.5, color: '#f5c877', lineColor: '#b58540', url: '资料分享/虚拟币/ch4.html' },

              // —— 5 钱包与钥匙 ——
              { key: 'vc5', path: 'vc5', parent: 'vc4', name: '5 钱包与钥匙', pos: [30.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#bcd6e8', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch5.html' },
              { key: 'vc5a', path: 'vc5a', parent: 'vc5', name: '私钥与地址', pos: [32.90, -2.60], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch5.html' },
              { key: 'vc5b', path: 'vc5b', parent: 'vc5', name: '助记词', pos: [32.90, -4.90], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch5.html' },
              { key: 'vc5c', path: 'vc5c', parent: 'vc5', name: '派生路径', pos: [32.90, -7.20], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch5.html' },
              { key: 'vc5d', path: 'vc5d', parent: 'vc5', name: '冷热钱包', pos: [32.90, -9.50], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch5.html' },

              // —— 6 稳定币与交易所 ——
              { key: 'vc6', path: 'vc6', parent: 'vc5', name: '6 稳定币与交易所', pos: [35.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#bcd6e8', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch6.html' },
              { key: 'vc6a', path: 'vc6a', parent: 'vc6', name: '稳定币真相', pos: [37.90, 2.60], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch6.html' },
              { key: 'vc6b', path: 'vc6b', parent: 'vc6', name: '转错链', pos: [37.90, 4.90], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch6.html' },
              { key: 'vc6c', path: 'vc6c', parent: 'vc6', name: '托管风险', pos: [37.90, 7.20], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch6.html' },

              // —— 7 DeFi ——
              { key: 'vc7', path: 'vc7', parent: 'vc6', name: '7 DeFi', pos: [40.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#bcd6e8', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch7.html' },
              { key: 'vc7a', path: 'vc7a', parent: 'vc7', name: 'AMM 与滑点', pos: [42.90, -2.60], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch7.html' },
              { key: 'vc7b', path: 'vc7b', parent: 'vc7', name: '无常损失', pos: [42.90, -4.90], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch7.html' },
              { key: 'vc7c', path: 'vc7c', parent: 'vc7', name: '借贷与清算', pos: [42.90, -7.20], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch7.html' },
              { key: 'vc7d', path: 'vc7d', parent: 'vc7', name: '预言机', pos: [42.90, -9.50], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch7.html' },
              { key: 'vc7e', path: 'vc7e', parent: 'vc7', name: '跨链桥', pos: [42.90, -11.80], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch7.html' },

              // —— 8 风险与安全 ——
              { key: 'vc8', path: 'vc8', parent: 'vc7', name: '8 风险与安全', pos: [45.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#bcd6e8', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch8.html' },
              { key: 'vc8a', path: 'vc8a', parent: 'vc8', name: '钓鱼', pos: [47.90, 2.60], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch8.html' },
              { key: 'vc8b', path: 'vc8b', parent: 'vc8', name: '授权陷阱', pos: [47.90, 4.90], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch8.html' },
              { key: 'vc8c', path: 'vc8c', parent: 'vc8', name: '地址投毒', pos: [47.90, 7.20], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch8.html' },
              { key: 'vc8d', path: 'vc8d', parent: 'vc8', name: '自保清单', pos: [47.90, 9.50], scale: 0.92, labelScale: 1.5, color: '#a8c6dc', lineColor: '#5f7f96', url: '资料分享/虚拟币/ch8.html' },

              // —— 9 监管与税务 ——
              { key: 'vc9', path: 'vc9', parent: 'vc8', name: '9 监管与税务', pos: [50.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#d8c8a8', lineColor: '#8a7348', url: '资料分享/虚拟币/ch9.html' },
              { key: 'vc9a', path: 'vc9a', parent: 'vc9', name: '内地规则', pos: [52.90, -2.60], scale: 0.92, labelScale: 1.5, color: '#c3ac82', lineColor: '#8a7348', url: '资料分享/虚拟币/ch9.html' },
              { key: 'vc9b', path: 'vc9b', parent: 'vc9', name: '香港发牌', pos: [52.90, -4.90], scale: 0.92, labelScale: 1.5, color: '#c3ac82', lineColor: '#8a7348', url: '资料分享/虚拟币/ch9.html' },
              { key: 'vc9c', path: 'vc9c', parent: 'vc9', name: '美国 ETF', pos: [52.90, -7.20], scale: 0.92, labelScale: 1.5, color: '#c3ac82', lineColor: '#8a7348', url: '资料分享/虚拟币/ch9.html' },
              { key: 'vc9d', path: 'vc9d', parent: 'vc9', name: '税务', pos: [52.90, -9.50], scale: 0.92, labelScale: 1.5, color: '#c3ac82', lineColor: '#8a7348', url: '资料分享/虚拟币/ch9.html' },

              // —— 10 价格与市场 ——
              { key: 'vc10', path: 'vc10', parent: 'vc9', name: '10 价格与市场', pos: [55.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#d8c8a8', lineColor: '#8a7348', url: '资料分享/虚拟币/ch10.html' },
              { key: 'vc10a', path: 'vc10a', parent: 'vc10', name: '市值幻觉', pos: [57.90, 2.60], scale: 0.92, labelScale: 1.5, color: '#c3ac82', lineColor: '#8a7348', url: '资料分享/虚拟币/ch10.html' },
              { key: 'vc10b', path: 'vc10b', parent: 'vc10', name: '杠杆爆仓', pos: [57.90, 4.90], scale: 0.92, labelScale: 1.5, color: '#c3ac82', lineColor: '#8a7348', url: '资料分享/虚拟币/ch10.html' },
              { key: 'vc10c', path: 'vc10c', parent: 'vc10', name: '链上数据', pos: [57.90, 7.20], scale: 0.92, labelScale: 1.5, color: '#c3ac82', lineColor: '#8a7348', url: '资料分享/虚拟币/ch10.html' },

              // —— 11 进阶实验 ——
              { key: 'vc11', path: 'vc11', parent: 'vc10', name: '11 进阶实验', pos: [60.00, 0.00], scale: 1.25, labelScale: 1.8, labelAbove: true, color: '#d8c8a8', lineColor: '#8a7348', url: '资料分享/虚拟币/ch11.html' },
              { key: 'vc11a', path: 'vc11a', parent: 'vc11', name: '虚荣助记词', pos: [62.90, -2.60], scale: 0.92, labelScale: 1.5, color: '#c3ac82', lineColor: '#8a7348', url: '资料分享/虚拟币/ch11.html' },
              { key: 'vc11b', path: 'vc11b', parent: 'vc11', name: '哈希会循环吗', pos: [62.90, -4.90], scale: 0.92, labelScale: 1.5, color: '#c3ac82', lineColor: '#8a7348', url: '资料分享/虚拟币/ch11.html' },
              { key: 'vc11c', path: 'vc11c', parent: 'vc11', name: 'MEV 三明治', pos: [62.90, -7.20], scale: 0.92, labelScale: 1.5, color: '#c3ac82', lineColor: '#8a7348', url: '资料分享/虚拟币/ch11.html' },
            ]
          },

          {
            // 论文等级：竖着的阶梯，越往上越难。蓝 = 全球期刊，红 = 中国期刊，灰 = 不在体系内。
            path: '资料分享/论文等级',
            name: '论文等级',
            pos: [2.75, 2.45],
            universe: true,
            universeColor: '#5aa9ff',
            universeColor2: '#ff6b6b',
            universeBg: '#070b12',
            universePoints: [
              { key: 'pp', path: 'pp', name: '论文等级', pos: [-7.60, 13.80], scale: 1.35, labelScale: 1.2, color: '#cfe4ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/index.html' },

              // —— 竖梯：从最高到最低 ——
              { key: 'cap', path: 'cap', name: '从高到低 ↓', pos: [-8.40, 19.60], scale: 0.62, labelScale: 0.9, color: '#7f8c99', lineColor: '#3f5f7a', url: '资料分享/论文等级/index.html' },

          { key: 't0', path: 't0', parent: 'pp', name: 'T0 · Nature / Science / Cell', pos: [0, 13.80], scale: 1.20, labelScale: 1.2, color: '#7fc4ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/quartile.html#cns' },
              { key: 't1', path: 't1', parent: 't0', name: 'T1 · 顶刊子刊', pos: [0, 11.00], scale: 1.20, labelScale: 1.2, color: '#7fc4ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/quartile.html#cns' },
              { key: 't2', path: 't2', parent: 't1', name: 'T2 · 一区 Q1', pos: [0, 8.20], scale: 1.20, labelScale: 1.2, color: '#5aa9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/quartile.html#q1' },
              { key: 't3', path: 't3', parent: 't2', name: 'T3 · 二区 Q2', pos: [0, 5.40], scale: 1.20, labelScale: 1.2, color: '#5aa9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/quartile.html#q34' },
              { key: 't4', path: 't4', parent: 't3', name: 'T4 · 三/四区', pos: [0, 2.60], scale: 1.20, labelScale: 1.2, color: '#5aa9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/quartile.html#q34' },
              { key: 't5', path: 't5', parent: 't4', name: 'T5 · 中文顶刊', pos: [0, -0.20], scale: 1.20, labelScale: 1.2, color: '#ff6b6b', lineColor: '#7a3434', url: '资料分享/论文等级/cn.html#top' },
              { key: 't6', path: 't6', parent: 't5', name: 'T6 · 中文核心', pos: [0, -3.00], scale: 1.20, labelScale: 1.2, color: '#ff6b6b', lineColor: '#7a3434', url: '资料分享/论文等级/cn.html#core' },
              { key: 't7', path: 't7', parent: 't6', name: 'T7 · 普刊 / 增刊', pos: [0, -5.80], scale: 1.20, labelScale: 1.2, color: '#ff6b6b', lineColor: '#7a3434', url: '资料分享/论文等级/cn.html#gen' },
              { key: 't8', path: 't8', parent: 't7', name: 'T8 · 预警 / 水刊', pos: [0, -8.60], scale: 1.20, labelScale: 1.2, color: '#9aa7b4', lineColor: '#4e5862', url: '资料分享/论文等级/warning.html#warn' },

              // —— 左侧：全球体系的几个名单 ——
              { key: 'l0', path: 'l0', parent: 't0', name: 'SCI / SCIE', pos: [-5.60, 12.60], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/database.html#sci' },
              { key: 'l1', path: 'l1', parent: 't1', name: 'ESCI 预备层', pos: [-5.60, 11.00], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/database.html#esci' },
              { key: 'l2', path: 'l2', parent: 't2', name: 'EI 工程索引', pos: [-5.60, 8.20], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/database.html#ei' },
              { key: 'l3', path: 'l3', parent: 't3', name: 'Scopus', pos: [-5.60, 5.40], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/database.html#scopus' },
              { key: 'l4', path: 'l4', parent: 't4', name: 'CCF A / B / C', pos: [-5.60, 2.60], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/ccf.html#a' },
              { key: 'l5', path: 'l5', parent: 't5', name: '会议 vs 期刊', pos: [-5.60, -0.20], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/ccf.html#conf' },
              { key: 'l6', path: 'l6', parent: 't6', name: 'OA 与版面费', pos: [-5.60, -3.00], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/warning.html#oa' },
              { key: 'l7', path: 'l7', parent: 't7', name: '掠夺性期刊', pos: [-5.60, -5.80], scale: 0.90, labelScale: 1.0, color: '#b9c3cc', lineColor: '#4e5862', url: '资料分享/论文等级/warning.html#pred' },

              // —— 右侧：每一档怎么判断 ——
              { key: 'r2', path: 'r2', parent: 't2', name: '一区算法', pos: [5.00, 8.20], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/quartile.html#q1' },
              { key: 'r3', path: 'r3', parent: 't3', name: 'TOP 期刊', pos: [5.00, 5.40], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/quartile.html#top' },
              { key: 'r4', path: 'r4', parent: 't4', name: '两套分区', pos: [5.00, 2.60], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/quartile.html#cmp' },
              { key: 'r6', path: 'r6', parent: 't6', name: '四套核心', pos: [5.00, -3.00], scale: 0.90, labelScale: 1.0, color: '#ffb3a7', lineColor: '#7a3434', url: '资料分享/论文等级/cn.html#core' },
              { key: 'r8', path: 'r8', parent: 't8', name: '四步查刊', pos: [5.00, -8.60], scale: 0.90, labelScale: 1.0, color: '#9ec9ff', lineColor: '#3f5f7a', url: '资料分享/论文等级/howto.html#steps' }
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
