/* BG5FNH 内容页通用脚本
   - 若存在 window.BG5FNH_PAGE，则自动渲染页面结构（黑金通用模板）
   - 返回按钮：嵌入 iframe 时通知主场景关闭浮层；否则优先返回上一页，再回主场景
*/
(function () {
  'use strict';

  var root = window.BG5FNH_ROOT || '../../';

  var embedded = false;
  try {
    embedded = window.parent !== window;
  } catch (e) {
    embedded = true;
  }

  function notifyParentClose() {
    try {
      window.parent.postMessage({ type: 'BG5FNH_CLOSE_OVERLAY' }, '*');
    } catch (e) { }
  }

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
      navigator.userAgent || navigator.vendor || window.opera || ''
    ) || (window.innerWidth <= 768 && 'ontouchstart' in window);
  }

  function goHome() {
    var home = root + (isMobile() ? 'mobile/index.html' : 'pc/index.html');
    window.location.href = home;
  }

  function closeOrBack() {
    if (embedded) {
      notifyParentClose();
      return;
    }
    if (document.referrer) {
      try {
        var referrerHost = new URL(document.referrer).host;
        if (referrerHost === window.location.host) {
          window.history.back();
          return;
        }
      } catch (e) { }
    }
    goHome();
  }

  if (embedded) {
    document.documentElement.classList.add('embedded');
    if (document.body) {
      document.body.classList.add('embedded');
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        document.body.classList.add('embedded');
      });
    }
  }

  // 渲染通用黑金内容页
  if (window.BG5FNH_PAGE) {
    var page = window.BG5FNH_PAGE;
    if (page.title) {
      document.title = page.title + ' - BG5FNH';
    }

    var backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);

    var header = document.createElement('header');
    header.className = 'topbar';
    header.innerHTML =
      '<button class="back-btn" id="backBtn" aria-label="返回">' +
      '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 18l-6-6 6-6" stroke="#c9a86a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg>' +
      '返回</button>';
    document.body.appendChild(header);

    var main = document.createElement('main');
    main.className = 'page';
    var subtitleHtml = page.subtitle ? '<p class="page-subtitle">' + page.subtitle + '</p>' : '';
    main.innerHTML =
      '<h1 class="page-title">' + page.title + '</h1>' +
      subtitleHtml +
      '<section class="card">' + (page.html || '') + '</section>';
    document.body.appendChild(main);
  }

  var btn = document.getElementById('backBtn');
  if (btn) {
    btn.addEventListener('click', closeOrBack);
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeOrBack();
    }
  });
})();
