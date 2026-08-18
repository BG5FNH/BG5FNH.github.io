/* ============================================================
   BG5FNH 导航点配置（数据驱动）
   ------------------------------------------------------------
   规则说明：
   1. mainLine.nodes 是 X 轴主线上的导航点，顺序从左到右。
   2. 每个导航点可配置 x（主线坐标）、scale（圆点大小）、children。
   3. children 的 dir 支持：
      center / up / down / left / right /
      up-left / up-right / down-left / down-right
   4. 默认由「父节点 + dir + distance」自动计算坐标；
      如果某个节点想精确定位，可写 x / y / z 覆盖自动坐标。
   5. url 相对于仓库根目录；从 pc/index.html 访问时统一加 "../"。
   ============================================================ */
window.BG5FNH_WAYPOINTS = {
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
        children: [
          { id: 'MyIntroduce', name: '个人简介', dir: 'center', url: 'MyIntroduce/index.html' },
          { id: 'SoftwareLearning', name: '软件学习', dir: 'up', url: 'MyIntroduce/SoftwareLearning/index.html' },
          { id: 'HardwareDevelopment', name: '硬件开发', dir: 'right', url: 'MyIntroduce/HardwareDevelopment/index.html' },
          { id: 'ProgrammingLanguage', name: '编程语言', dir: 'down', url: 'MyIntroduce/ProgrammingLanguage/intro.html' },
          { id: 'RadioCommunication', name: '无线电通讯', dir: 'left', url: 'MyIntroduce/RadioCommunication/index.html' },
          { id: 'UnmannedAerialVehicle', name: '无人航空器', dir: 'up-left', distance: 5.2, url: 'MyIntroduce/UnmannedAerialVehicle/index.html' },
            { id: 'ControlTest', name: '控件测试', dir: 'up-right', distance: 7.5, url: 'MyIntroduce/ControlTest/index.html' }
        ]
      },
      {
        id: 'ResourceShare',
        name: '资料分享',
        x: 3.2,
        scale: 1.0,
        children: [
          { id: 'ResourceShare', name: '资料分享', dir: 'center', url: 'ResourceShare/index.html' },
          {
              id: 'SoftwareResources',
              name: '软件资源',
              dir: 'up',
              url: 'ResourceShare/SoftwareResources/index.html',
              children: [
                {
                  id: 'CrackedSoftware',
                  name: '软件破解资源分享',
                  dir: 'up',
                  distance: 3.4,
                  url: 'ResourceShare/SoftwareResources/CrackedSoftware/index.html',
                  children: [
                    {
                      id: 'JianYingCrack',
                      name: '剪映破解版',
                      dir: 'right',
                      distance: 3.4,
                      url: 'ResourceShare/SoftwareResources/CrackedSoftware/JianYingCrack/index.html',
                      children: [
                        { id: 'JianYingPC', name: 'PC端', dir: 'up-right', distance: 2.8, url: 'ResourceShare/SoftwareResources/CrackedSoftware/JianYingCrack/PC/index.html' },
                        { id: 'JianYingMobile', name: '手机端', dir: 'down-right', distance: 2.8, url: 'ResourceShare/SoftwareResources/CrackedSoftware/JianYingCrack/Mobile/index.html' }
                      ]
                    }
                  ]
                }
              ]
            },
          { id: 'HardwareResources', name: '硬件资料', dir: 'right', url: 'ResourceShare/HardwareResources/index.html' },
          { id: 'Templates', name: '模板文档', dir: 'down', url: 'ResourceShare/Templates/index.html' },
          { id: 'RadioResources', name: '无线电资料', dir: 'left', url: 'ResourceShare/RadioResources/index.html' }
        ]
      },
      {
        id: 'TechArticles',
        name: '技术文章',
        x: 7.8,
        scale: 1.0,
        children: [
          { id: 'TechArticles', name: '技术文章', dir: 'center', url: 'TechArticles/index.html' },
          { id: 'SoftwareArticles', name: '软件类文章', dir: 'up', url: 'TechArticles/SoftwareArticles/index.html' },
          { id: 'HardwareArticles', name: '硬件类文章', dir: 'right', url: 'TechArticles/HardwareArticles/index.html' },
          { id: 'ProgrammingArticles', name: '编程类文章', dir: 'down', url: 'TechArticles/ProgrammingArticles/index.html' },
          { id: 'RadioArticles', name: '无线电类文章', dir: 'left', url: 'TechArticles/RadioArticles/index.html' }
        ]
      },
      {
        id: 'MessageBoard',
        name: '留言板',
        x: 12.4,
        scale: 1.0,
        children: [
          { id: 'MessageBoard', name: '留言板', dir: 'center', url: 'MessageBoard/index.html' },
          { id: 'Contact', name: '联系方式', dir: 'up', url: 'MessageBoard/Contact/index.html' },
          { id: 'GitHub', name: 'GitHub', dir: 'right', url: 'MessageBoard/GitHub/index.html' },
          { id: 'Email', name: '邮箱联系', dir: 'down', url: 'MessageBoard/Email/index.html' },
          { id: 'About', name: '留言说明', dir: 'left', url: 'MessageBoard/About/index.html' }
        ]
      }
    ]
  }
};
