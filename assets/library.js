/* 资料库阅读器：给「资料分享 → 资料库」下的页面加
   - 页内搜索（过滤 + 高亮，按 / 聚焦）
   - 目录（由 .lib-body 里的 h2 自动生成）
   其它内容页不引用本文件，互不影响。 */
(function () {
  'use strict';

  var body = document.querySelector('.lib-body');
  if (!body) return;

  var lines = [];
  var heads = [];

  Array.prototype.forEach.call(body.children, function (el) {
    if (el.tagName === 'H2') {
      el.setAttribute('data-raw', el.textContent);
      heads.push(el);
    } else if (el.classList && el.classList.contains('lib-line')) {
      el.setAttribute('data-raw', el.textContent);
      lines.push(el);
    }
  });

  var all = lines.concat(heads);
  var total = all.length;

  // ---- 工具条 ----
  var tools = document.createElement('div');
  tools.className = 'lib-tools';
  tools.innerHTML =
    '<input type="search" id="libSearch" autocomplete="off" spellcheck="false" ' +
    'placeholder="搜索：型号 / 频段 / 关键词（按 / 聚焦）" aria-label="页内搜索" />' +
    '<span class="lib-count" id="libCount"></span>';
  body.parentNode.insertBefore(tools, body);

  var input = tools.querySelector('#libSearch');
  var count = tools.querySelector('#libCount');

  // ---- 目录 ----
  var toc = null;
  if (heads.length > 1) {
    toc = document.createElement('div');
    toc.className = 'lib-toc';
    heads.forEach(function (h, i) {
      h.id = 'sec-' + i;
      var a = document.createElement('a');
      a.href = '#sec-' + i;
      a.textContent = h.textContent.trim().slice(0, 24);
      toc.appendChild(a);
    });
    body.parentNode.insertBefore(toc, body);
  }

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function apply(query) {
    var needle = (query || '').trim().toLowerCase();
    var hits = 0;

    all.forEach(function (el) {
      var raw = el.getAttribute('data-raw') || '';
      if (!needle) {
        el.classList.remove('hide');
        el.innerHTML = esc(raw);
        return;
      }
      var at = raw.toLowerCase().indexOf(needle);
      if (at < 0) {
        el.classList.add('hide');
        return;
      }
      hits++;
      el.classList.remove('hide');
      el.innerHTML =
        esc(raw.slice(0, at)) +
        '<mark>' + esc(raw.slice(at, at + needle.length)) + '</mark>' +
        esc(raw.slice(at + needle.length));
    });

    count.textContent = needle ? (hits + ' / ' + total + ' 条命中') : (total + ' 条');
  }

  input.addEventListener('input', function () { apply(input.value); });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
      return;
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input.value = '';
      apply('');
      input.blur();
    }
  });

  count.textContent = total + ' 条';
})();
