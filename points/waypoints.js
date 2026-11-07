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
              { key: 'ptron', path: 'ptron', name: '感知机', pos: [0.00, -0.77], scale: 1.15, labelScale: 1, color: '#e8f7fd', lineColor: '#7fb8cf', url: '资料分享/机器学习/index.html' },
              // 可视化入口：放在感知机左边，点进去是折纸动画
              { key: 'viz', path: 'viz', parent: 'ptron', name: '折纸动画', pos: [-2.4, -0.77], scale: 0.86, labelScale: 0.95, color: '#ffe6a7', lineColor: '#b59a68', url: '资料分享/机器学习/viz-perceptron.html' },
              { key: 'found', path: 'found', parent: 'ptron', name: '基础构件', pos: [3.60, 12.10], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#found' },
              { key: 'linear', path: 'linear', parent: 'found', name: '线性层', pos: [7.20, 14.52], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#linear' },
              { key: 'act', path: 'act', parent: 'found', name: '激活函数', pos: [7.20, 13.86], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#act' },
              { key: 'relu', path: 'relu', parent: 'act', name: 'ReLU', pos: [10.80, 14.08], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#relu' },
              { key: 'gelu', path: 'gelu', parent: 'act', name: 'GELU', pos: [10.80, 13.64], scale: 0.5, labelScale: 0.78, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#gelu' },
              { key: 'loss', path: 'loss', parent: 'found', name: '损失函数', pos: [7.20, 12.98], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#loss' },
              { key: 'ce', path: 'ce', parent: 'loss', name: '交叉熵', pos: [10.80, 13.20], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#ce' },
              { key: 'mse', path: 'mse', parent: 'loss', name: 'MSE', pos: [10.80, 12.76], scale: 0.5, labelScale: 0.78, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#mse' },
              { key: 'bp', path: 'bp', parent: 'found', name: '反向传播', pos: [7.20, 12.32], scale: 1.15, labelScale: 1, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#bp' },
              { key: 'autodiff', path: 'autodiff', parent: 'bp', name: '自动微分', pos: [10.80, 12.32], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#autodiff' },
              { key: 'opt', path: 'opt', parent: 'found', name: '优化器', pos: [7.20, 11.66], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#opt' },
              { key: 'sgd', path: 'sgd', parent: 'opt', name: 'SGD 系列', pos: [10.80, 11.88], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#sgd' },
              { key: 'adam', path: 'adam', parent: 'opt', name: 'AdamW', pos: [10.80, 11.44], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#adam' },
              { key: 'reg', path: 'reg', parent: 'found', name: '正则化', pos: [7.20, 10.78], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#reg' },
              { key: 'dropout', path: 'dropout', parent: 'reg', name: 'Dropout', pos: [10.80, 11.00], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#dropout' },
              { key: 'bn', path: 'bn', parent: 'reg', name: 'Normalization', pos: [10.80, 10.56], scale: 0.78, labelScale: 0.9, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#bn' },
              { key: 'init', path: 'init', parent: 'found', name: '初始化', pos: [7.20, 10.12], scale: 0.5, labelScale: 0.78, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#init' },
              { key: 'lr', path: 'lr', parent: 'found', name: '学习率调度', pos: [7.20, 9.68], scale: 0.5, labelScale: 0.78, color: '#7fd4ef', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-found.html#lr' },
              { key: 'cnn', path: 'cnn', parent: 'ptron', name: 'CNN', pos: [3.60, 8.03], scale: 1.15, labelScale: 1, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#cnn' },
              { key: 'conv', path: 'conv', parent: 'cnn', name: '卷积', pos: [7.20, 9.02], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#conv' },
              { key: 'lenet', path: 'lenet', parent: 'conv', name: 'LeNet-5', pos: [10.80, 9.24], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#lenet' },
              { key: 'alexnet', path: 'alexnet', parent: 'conv', name: 'AlexNet', pos: [10.80, 8.80], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#alexnet' },
              { key: 'vgg', path: 'vgg', parent: 'alexnet', name: 'VGG', pos: [14.40, 8.80], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#vgg' },
              { key: 'googlenet', path: 'googlenet', parent: 'vgg', name: 'Inception', pos: [18.00, 8.80], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#googlenet' },
              { key: 'resnet', path: 'resnet', parent: 'cnn', name: 'ResNet 残差', pos: [7.20, 7.92], scale: 1.15, labelScale: 1, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#resnet' },
              { key: 'densenet', path: 'densenet', parent: 'resnet', name: 'DenseNet', pos: [10.80, 8.36], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#densenet' },
              { key: 'mobilenet', path: 'mobilenet', parent: 'resnet', name: 'MobileNet', pos: [10.80, 7.92], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#mobilenet' },
              { key: 'effnet', path: 'effnet', parent: 'mobilenet', name: 'EfficientNet', pos: [14.40, 7.92], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#effnet' },
              { key: 'unet', path: 'unet', parent: 'resnet', name: 'U-Net', pos: [10.80, 7.48], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#unet' },
              { key: 'yolo', path: 'yolo', parent: 'unet', name: 'YOLO 系列', pos: [14.40, 7.48], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#yolo' },
              { key: 'seg', path: 'seg', parent: 'cnn', name: '检测/分割', pos: [7.20, 7.04], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-cnn.html#seg' },
              { key: 'rnn', path: 'rnn', parent: 'ptron', name: 'RNN', pos: [3.60, 6.38], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-rnn.html#rnn' },
              { key: 'lstm', path: 'lstm', parent: 'rnn', name: 'LSTM / GRU', pos: [7.20, 6.38], scale: 1.15, labelScale: 1, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-rnn.html#lstm' },
              { key: 'bptt', path: 'bptt', parent: 'lstm', name: 'BPTT 沿时间反传', pos: [10.80, 6.60], scale: 0.5, labelScale: 0.78, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-rnn.html#bptt' },
              { key: 'seq2seq', path: 'seq2seq', parent: 'lstm', name: 'Seq2Seq', pos: [10.80, 6.16], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-rnn.html#seq2seq' },
              { key: 'attn', path: 'attn', parent: 'seq2seq', name: '注意力机制', pos: [14.40, 6.16], scale: 1.15, labelScale: 1, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-rnn.html#attn' },
              { key: 'tfm', path: 'tfm', parent: 'ptron', name: 'Transformer', pos: [3.60, 3.08], scale: 1.15, labelScale: 1, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#tfm' },
              { key: 'selfattn', path: 'selfattn', parent: 'tfm', name: '自注意力', pos: [7.20, 5.72], scale: 1.15, labelScale: 1, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#selfattn' },
              { key: 'mha', path: 'mha', parent: 'selfattn', name: '多头注意力', pos: [10.80, 5.72], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#mha' },
              { key: 'pos', path: 'pos', parent: 'tfm', name: '位置编码', pos: [7.20, 5.28], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#pos' },
              { key: 'bert', path: 'bert', parent: 'tfm', name: 'BERT', pos: [7.20, 4.84], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#bert' },
              { key: 'gpt', path: 'gpt', parent: 'tfm', name: 'GPT 系列', pos: [7.20, 3.30], scale: 1.15, labelScale: 1, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#gpt' },
              { key: 't5', path: 't5', parent: 'tfm', name: 'T5', pos: [7.20, 1.76], scale: 0.5, labelScale: 0.78, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#t5' },
              { key: 'vit', path: 'vit', parent: 'tfm', name: 'ViT', pos: [7.20, 1.10], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#vit' },
              { key: 'swin', path: 'swin', parent: 'vit', name: 'Swin', pos: [10.80, 1.32], scale: 0.5, labelScale: 0.78, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#swin' },
              { key: 'clip', path: 'clip', parent: 'vit', name: 'CLIP', pos: [10.80, 0.88], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#clip' },
              { key: 'whisper', path: 'whisper', parent: 'tfm', name: 'Whisper', pos: [7.20, 0.44], scale: 0.5, labelScale: 0.78, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#whisper' },
              { key: 'llm', path: 'llm', parent: 'gpt', name: 'LLM', pos: [10.80, 3.30], scale: 1.15, labelScale: 1, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#llm' },
              { key: 'sft', path: 'sft', parent: 'llm', name: '指令微调 SFT', pos: [14.40, 4.40], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#sft' },
              { key: 'rlhf', path: 'rlhf', parent: 'llm', name: 'RLHF', pos: [14.40, 3.96], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#rlhf' },
              { key: 'lora', path: 'lora', parent: 'llm', name: 'LoRA', pos: [14.40, 3.52], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#lora' },
              { key: 'rag', path: 'rag', parent: 'llm', name: 'RAG', pos: [14.40, 3.08], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#rag' },
              { key: 'moe', path: 'moe', parent: 'llm', name: 'MoE 混合专家', pos: [14.40, 2.64], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#moe' },
              { key: 'longctx', path: 'longctx', parent: 'llm', name: 'KV 缓存', pos: [14.40, 2.20], scale: 0.5, labelScale: 0.78, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-tfm.html#longctx' },
              { key: 'gen', path: 'gen', parent: 'ptron', name: '生成模型', pos: [3.60, -1.76], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#gen' },
              { key: 'ae', path: 'ae', parent: 'gen', name: '自编码器', pos: [7.20, 0.00], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#ae' },
              { key: 'vae', path: 'vae', parent: 'ae', name: 'VAE', pos: [10.80, 0.00], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#vae' },
              { key: 'gan', path: 'gan', parent: 'gen', name: 'GAN', pos: [7.20, -1.10], scale: 1.15, labelScale: 1, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#gan' },
              { key: 'dcgan', path: 'dcgan', parent: 'gan', name: 'DCGAN', pos: [10.80, -0.44], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#dcgan' },
              { key: 'wgan', path: 'wgan', parent: 'gan', name: 'WGAN / 梯度惩罚', pos: [10.80, -0.88], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#wgan' },
              { key: 'stylegan', path: 'stylegan', parent: 'gan', name: 'StyleGAN', pos: [10.80, -1.32], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#stylegan' },
              { key: 'cyclegan', path: 'cyclegan', parent: 'gan', name: 'CycleGAN', pos: [10.80, -1.76], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#cyclegan' },
              { key: 'diff', path: 'diff', parent: 'gen', name: '扩散模型', pos: [7.20, -2.42], scale: 1.15, labelScale: 1, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#diff' },
              { key: 'ddpm', path: 'ddpm', parent: 'diff', name: 'DDPM', pos: [10.80, -2.20], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#ddpm' },
              { key: 'ddim', path: 'ddim', parent: 'ddpm', name: 'DDIM', pos: [14.40, -2.20], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#ddim' },
              { key: 'ldm', path: 'ldm', parent: 'diff', name: 'Latent Diffusion', pos: [10.80, -2.64], scale: 0.78, labelScale: 0.9, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#ldm' },
              { key: 'controlnet', path: 'controlnet', parent: 'ldm', name: 'ControlNet', pos: [14.40, -2.64], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#controlnet' },
              { key: 'flow', path: 'flow', parent: 'gen', name: '归一化流', pos: [7.20, -3.08], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#flow' },
              { key: 'tts', path: 'tts', parent: 'gen', name: '声码器', pos: [7.20, -3.52], scale: 0.5, labelScale: 0.78, color: '#ffc2d6', lineColor: '#b07f95', url: '资料分享/机器学习/b-gen.html#tts' },
              { key: 'gnn', path: 'gnn', parent: 'ptron', name: 'GNN', pos: [3.60, -4.18], scale: 0.78, labelScale: 0.9, color: '#c9b6f2', lineColor: '#8a7bb5', url: '资料分享/机器学习/b-graph.html#gnn' },
              { key: 'gcn', path: 'gcn', parent: 'gnn', name: 'GCN', pos: [7.20, -3.96], scale: 0.78, labelScale: 0.9, color: '#c9b6f2', lineColor: '#8a7bb5', url: '资料分享/机器学习/b-graph.html#gcn' },
              { key: 'nerf', path: 'nerf', parent: 'gnn', name: 'NeRF', pos: [7.20, -4.40], scale: 0.5, labelScale: 0.78, color: '#c9b6f2', lineColor: '#8a7bb5', url: '资料分享/机器学习/b-graph.html#nerf' },
              { key: 'rl', path: 'rl', parent: 'ptron', name: '强化学习', pos: [3.60, -5.50], scale: 1.15, labelScale: 1, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#rl' },
              { key: 'mdp', path: 'mdp', parent: 'rl', name: 'MDP', pos: [7.20, -4.84], scale: 0.78, labelScale: 0.9, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#mdp' },
              { key: 'qlearn', path: 'qlearn', parent: 'mdp', name: 'DQN', pos: [10.80, -4.84], scale: 0.78, labelScale: 0.9, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#qlearn' },
              { key: 'pg', path: 'pg', parent: 'rl', name: '策略梯度', pos: [7.20, -5.50], scale: 0.78, labelScale: 0.9, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#pg' },
              { key: 'ppo', path: 'ppo', parent: 'pg', name: 'PPO', pos: [10.80, -5.28], scale: 1.15, labelScale: 1, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#ppo' },
              { key: 'sac', path: 'sac', parent: 'pg', name: 'SAC', pos: [10.80, -5.72], scale: 0.5, labelScale: 0.78, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#sac' },
              { key: 'marl', path: 'marl', parent: 'rl', name: '自博弈', pos: [7.20, -6.16], scale: 0.5, labelScale: 0.78, color: '#9be7c4', lineColor: '#5f9b7e', url: '资料分享/机器学习/b-rl.html#marl' },
              { key: 'eng', path: 'eng', parent: 'ptron', name: '训练与工程', pos: [3.60, -8.14], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#eng' },
              { key: 'aug', path: 'aug', parent: 'eng', name: '数据增强', pos: [7.20, -6.60], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#aug' },
              { key: 'transfer', path: 'transfer', parent: 'eng', name: '迁移学习', pos: [7.20, -7.04], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#transfer' },
              { key: 'distill', path: 'distill', parent: 'eng', name: '知识蒸馏', pos: [7.20, -7.70], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#distill' },
              { key: 'prune', path: 'prune', parent: 'distill', name: '剪枝', pos: [10.80, -7.48], scale: 0.5, labelScale: 0.78, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#prune' },
              { key: 'quant', path: 'quant', parent: 'distill', name: '量化', pos: [10.80, -7.92], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#quant' },
              { key: 'dist', path: 'dist', parent: 'eng', name: '分布式训练', pos: [7.20, -8.58], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#dist' },
              { key: 'amp', path: 'amp', parent: 'dist', name: '混合精度', pos: [10.80, -8.36], scale: 0.5, labelScale: 0.78, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#amp' },
              { key: 'ckpt', path: 'ckpt', parent: 'dist', name: '梯度检查点', pos: [10.80, -8.80], scale: 0.5, labelScale: 0.78, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#ckpt' },
              { key: 'data', path: 'data', parent: 'eng', name: '数据工程', pos: [7.20, -9.24], scale: 1.15, labelScale: 1, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#data' },
              { key: 'eval', path: 'eval', parent: 'eng', name: '评估与划分', pos: [7.20, -9.68], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#eval' },
              { key: 'leak', path: 'leak', parent: 'eval', name: '数据泄漏', pos: [10.80, -9.68], scale: 0.78, labelScale: 0.9, color: '#a9e4f7', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-eng.html#leak' },
              { key: 'theory', path: 'theory', parent: 'ptron', name: '理论与边界', pos: [3.60, -11.22], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-theory.html#theory' },
              { key: 'turing', path: 'turing', parent: 'theory', name: '可计算性', pos: [7.20, -10.12], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-theory.html#turing' },
              { key: 'universal', path: 'universal', parent: 'theory', name: '万能逼近定理', pos: [7.20, -10.56], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-theory.html#universal' },
              { key: 'biasvar', path: 'biasvar', parent: 'theory', name: '偏差-方差', pos: [7.20, -11.00], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-theory.html#biasvar' },
              { key: 'vanish', path: 'vanish', parent: 'theory', name: '梯度问题', pos: [7.20, -11.44], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-theory.html#vanish' },
              { key: 'double', path: 'double', parent: 'theory', name: '双下降现象', pos: [7.20, -11.88], scale: 0.5, labelScale: 0.78, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-theory.html#double' },
              { key: 'scaling', path: 'scaling', parent: 'theory', name: 'Scaling Law', pos: [7.20, -12.32], scale: 0.78, labelScale: 0.9, color: '#f4a6c0', lineColor: '#b07f95', url: '资料分享/机器学习/b-theory.html#scaling' },
              { key: 'app', path: 'app', parent: 'ptron', name: '应用方向', pos: [3.60, -13.64], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#app' },
              { key: 'cv', path: 'cv', parent: 'app', name: 'CV', pos: [7.20, -12.76], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#cv' },
              { key: 'nlp', path: 'nlp', parent: 'app', name: 'NLP', pos: [7.20, -13.20], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#nlp' },
              { key: 'asr', path: 'asr', parent: 'app', name: '语音', pos: [7.20, -13.64], scale: 0.5, labelScale: 0.78, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#asr' },
              { key: 'rec', path: 'rec', parent: 'app', name: '推荐系统', pos: [7.20, -14.08], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#rec' },
              { key: 'bio', path: 'bio', parent: 'app', name: '科学计算', pos: [7.20, -14.52], scale: 0.78, labelScale: 0.9, color: '#8fd9f0', lineColor: '#4f8ea8', url: '资料分享/机器学习/b-app.html#bio' }
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
