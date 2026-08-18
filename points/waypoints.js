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
      例如 path: 'ResourceShare/SoftwareResources/CrackedSoftware'
      它的父光点就是 path 为 'ResourceShare/SoftwareResources' 的光点。
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
          { path: 'MyIntroduce', name: '个人简介', pos: [0, 0], url: 'MyIntroduce/index.html' },
          { path: 'MyIntroduce/SoftwareLearning', name: '软件学习', pos: [0, 1], url: 'MyIntroduce/SoftwareLearning/index.html' },
          { path: 'MyIntroduce/HardwareDevelopment', name: '硬件开发', pos: [1, 0], url: 'MyIntroduce/HardwareDevelopment/index.html' },
          { path: 'MyIntroduce/ProgrammingLanguage', name: '编程语言', pos: [0, -1], url: 'MyIntroduce/ProgrammingLanguage/intro.html' },
          { path: 'MyIntroduce/RadioCommunication', name: '无线电通讯', pos: [-1, 0], url: 'MyIntroduce/RadioCommunication/index.html' },
          { path: 'MyIntroduce/UnmannedAerialVehicle', name: '穿越机', pos: [-1, 1], url: 'MyIntroduce/UnmannedAerialVehicle/index.html' },
          { path: 'MyIntroduce/ControlTest', name: '控件测试', pos: [1.5, 1.5], url: 'MyIntroduce/ControlTest/index.html' }
        ]
      },
      {
        id: 'ResourceShare',
        name: '资料分享',
        x: 3.2,
        scale: 1.0,
        points: [
          { path: 'ResourceShare', name: '资料分享', pos: [0, 0], url: 'ResourceShare/index.html' },
          { path: 'ResourceShare/SoftwareResources', name: '软件资源', pos: [0, 2], url: 'ResourceShare/SoftwareResources/index.html' },
          { path: 'ResourceShare/SoftwareResources/CrackedSoftware', name: '软件破解资源分享', pos: [0.8, 3.2], url: 'ResourceShare/SoftwareResources/CrackedSoftware/index.html' },
          { path: 'ResourceShare/SoftwareResources/CrackedSoftware/JianYingCrack', name: '剪映破解版', pos: [1.8, 3.2], url: 'ResourceShare/SoftwareResources/CrackedSoftware/JianYingCrack/index.html' },
          { path: 'ResourceShare/SoftwareResources/CrackedSoftware/JianYingCrack/PC', name: 'PC端', pos: [2.8, 4.2], url: 'ResourceShare/SoftwareResources/CrackedSoftware/JianYingCrack/PC/index.html' },
          { path: 'ResourceShare/SoftwareResources/CrackedSoftware/JianYingCrack/Mobile', name: '手机端', pos: [2.8, 2.2], url: 'ResourceShare/SoftwareResources/CrackedSoftware/JianYingCrack/Mobile/index.html' },
          { path: 'ResourceShare/HardwareResources', name: '硬件资料', pos: [2, 0], url: 'ResourceShare/HardwareResources/index.html' },
          { path: 'ResourceShare/Templates', name: '模板文档', pos: [0, -2], url: 'ResourceShare/Templates/index.html' },
          { path: 'ResourceShare/RadioResources', name: '无线电资料', pos: [-2, 0], url: 'ResourceShare/RadioResources/index.html' }
        ]
      },
      {
        id: 'TechArticles',
        name: '技术文章',
        x: 7.8,
        scale: 1.0,
        points: [
          { path: 'TechArticles', name: '技术文章', pos: [0, 0], url: 'TechArticles/index.html' },
          { path: 'TechArticles/SoftwareArticles', name: '软件类文章', pos: [0, 1], url: 'TechArticles/SoftwareArticles/index.html' },
          { path: 'TechArticles/HardwareArticles', name: '硬件类文章', pos: [1, 0], url: 'TechArticles/HardwareArticles/index.html' },
          { path: 'TechArticles/ProgrammingArticles', name: '编程类文章', pos: [0, -1], url: 'TechArticles/ProgrammingArticles/index.html' },
          { path: 'TechArticles/RadioArticles', name: '无线电类文章', pos: [-1, 0], url: 'TechArticles/RadioArticles/index.html' }
        ]
      },
      {
        id: 'MessageBoard',
        name: '留言板',
        x: 12.4,
        scale: 1.0,
        points: [
          { path: 'MessageBoard', name: '留言板', pos: [0, 0], url: 'MessageBoard/index.html' },
          { path: 'MessageBoard/Contact', name: '联系方式', pos: [0, 1], url: 'MessageBoard/Contact/index.html' },
          { path: 'MessageBoard/GitHub', name: 'GitHub', pos: [1, 0], url: 'MessageBoard/GitHub/index.html' },
          { path: 'MessageBoard/Email', name: '邮箱联系', pos: [0, -1], url: 'MessageBoard/Email/index.html' },
          { path: 'MessageBoard/About', name: '留言说明', pos: [-1, 0], url: 'MessageBoard/About/index.html' }
        ]
      }
    ]
  }
};
