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
      例如 path: '资料分享/软件资源/软件破解资源分享'
      它的父光点就是 path 为 '资料分享/软件资源' 的光点。
   5. url 相对于 WayPoints/ 目录。
   ============================================================ */
window.BG5FNH_WAYPOINTS = {
  gridUnit: 3.6,
  mainLine: {
    y: 0,
    z: 0,
    cameraOverview: { x: 3.5, y: 52, z: 0 },
    cameraLookAtOverview: { x: 3.5, y: 0, z: 0 },
    nodes: [
      {
        id: 'MyIntroduce',
        name: '个人介绍',
        x: -1.5,
        scale: 1.55,
        points: [
          { path: '个人介绍', name: '个人简介', pos: [0, 0], url: '个人介绍/index.html' },
          { path: '个人介绍/软件学习', name: '软件学习', pos: [0, 1], url: '个人介绍/软件学习/index.html' },
          { path: '个人介绍/硬件开发', name: '硬件开发', pos: [1, 0], url: '个人介绍/硬件开发/index.html' },
          { path: '个人介绍/编程语言', name: '编程语言', pos: [0, -1], url: '个人介绍/编程语言/intro.html' },
          { path: '个人介绍/无线电通讯', name: '无线电通讯', pos: [-1, 0], url: '个人介绍/无线电通讯/index.html' },
          { path: '个人介绍/穿越机', name: '穿越机', pos: [-1, 1], url: '个人介绍/穿越机/index.html' },
          { path: '个人介绍/控件测试', name: '控件测试', pos: [1.5, 1.5], url: '个人介绍/控件测试/index.html' },
          { path: '个人介绍/我的账号', name: '我的账号', pos: [0, -2], url: '个人介绍/我的账号/index.html' }
        ]
      },
      {
        id: 'ResourceShare',
        name: '资料分享',
        x: 3.2,
        scale: 1.0,
        points: [
          { path: '资料分享', name: '资料分享', pos: [0, 0], url: '资料分享/index.html' },
          { path: '资料分享/软件资源', name: '软件资源', pos: [0, 2], url: '资料分享/软件资源/index.html' },
          {
            path: '资料分享/软件资源/软件破解资源分享',
            name: '软件破解资源分享',
            pos: [0.8, 3.2],
            url: '资料分享/软件资源/软件破解资源分享/index.html',
            universe: true,
            universeColor: '#e8b4b8',
            universePoints: [
              { path: '剪映破解版', name: '剪映破解版', pos: [0, 0], url: '资料分享/软件资源/软件破解资源分享/剪映破解版/index.html' },
              { path: '剪映破解版/PC端', name: 'PC端', pos: [1.2, 0.8], url: '资料分享/软件资源/软件破解资源分享/剪映破解版/PC端/index.html' },
              { path: '剪映破解版/手机端', name: '手机端', pos: [-1.2, 0.8], url: '资料分享/软件资源/软件破解资源分享/剪映破解版/手机端/index.html' }
            ]
          },
          { path: '资料分享/硬件资料', name: '硬件资料', pos: [2, 0], url: '资料分享/硬件资料/index.html' },
          { path: '资料分享/模板文档', name: '模板文档', pos: [0, -2], url: '资料分享/模板文档/index.html' },
          { path: '资料分享/无线电资料', name: '无线电资料', pos: [-2, 0], url: '资料分享/无线电资料/index.html' },
          {
            path: '资料分享/无线电资料/无线电天线资料',
            name: '无线电天线资料',
            pos: [-3.2, 0.8],
            url: '资料分享/无线电资料/无线电天线资料/index.html',
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
        id: 'TechArticles',
        name: '技术文章',
        x: 7.8,
        scale: 1.0,
        points: [
          { path: '技术文章', name: '技术文章', pos: [0, 0], url: '技术文章/index.html' },
          { path: '技术文章/软件类文章', name: '软件类文章', pos: [0, 1], url: '技术文章/软件类文章/index.html' },
          { path: '技术文章/硬件类文章', name: '硬件类文章', pos: [1, 0], url: '技术文章/硬件类文章/index.html' },
          { path: '技术文章/编程类文章', name: '编程类文章', pos: [0, -1], url: '技术文章/编程类文章/index.html' },
          { path: '技术文章/无线电类文章', name: '无线电类文章', pos: [-1, 0], url: '技术文章/无线电类文章/index.html' }
        ]
      },
      {
        id: 'MessageBoard',
        name: '留言板',
        x: 12.4,
        scale: 1.0,
        points: [
          { path: '留言板', name: '留言板', pos: [0, 0], url: '留言板/index.html' },
          { path: '留言板/联系方式', name: '联系方式', pos: [0, 1], url: '留言板/联系方式/index.html' },
          { path: '留言板/GitHub', name: 'GitHub', pos: [1, 0], url: '留言板/GitHub/index.html' },
          { path: '留言板/邮箱联系', name: '邮箱联系', pos: [0, -1], url: '留言板/邮箱联系/index.html' },
          { path: '留言板/留言说明', name: '留言说明', pos: [-1, 0], url: '留言板/留言说明/index.html' }
        ]
      }
    ]
  }
};
