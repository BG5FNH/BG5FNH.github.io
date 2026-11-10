# BG5FNH 个人网页

纯静态黑金主题个人主页，部署到 GitHub Pages：`https://bg5fnh.github.io/`。

## 当前版本

**v1.59.1**

新增两个知识宇宙：

- 虚拟币：12 章 / 60 个光点，`WayPoints/资料分享/虚拟币/`
- 论文等级：竖梯 23 个光点（Nature → 普刊，蓝=全球、红=中国），`WayPoints/资料分享/论文等级/`

术语弹窗由 `assets/glossary.js` 提供（108 条），页面里写 `<a class="t" data-t="术语">` 即可点开。


## 使用前

把 `three.min.js` 放入 `pc/js/`：

下载地址：
`https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/build/three.min.js`

## 目录

- `index.html`：设备判断跳转
- `pc/`：电脑端 3D 主场景
- `mobile/`：手机端简化树状图
- `WayPoints/`：所有内容页
- `assets/`：内容页样式与脚本

## 操作

- 点击主线金色点：进入该导航点的 YZ 神经元树状图
- 点击树状图金色点：节点发光，内容界面从点里浮现
- 按住空白处拖动：平移视图
- 左上角返回箭头 / Esc：返回上一级或关闭内容界面
