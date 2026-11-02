// 共通メニュー（ヘッダーの MENU ボタン）
(function () {
  var menu = document.getElementById('siteMenu');
  if (!menu || menu.dataset.ready) return;
  menu.dataset.ready = '1';
  var openBtns = document.querySelectorAll('[data-menu-open]');
  var last = null;
  function open() {
    last = document.activeElement;
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add('on'); });
    document.documentElement.classList.add('menu-open');
    openBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    var c = menu.querySelector('[data-menu-close]'); if (c) c.focus();
  }
  function close() {
    menu.classList.remove('on');
    document.documentElement.classList.remove('menu-open');
    openBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    setTimeout(function () { if (!menu.classList.contains('on')) menu.hidden = true; }, 250);
    if (last && last.focus) last.focus();
  }
  openBtns.forEach(function (b) { b.addEventListener('click', open); });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('[data-menu-close]') || e.target === menu || e.target.closest('a')) close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) close(); });
})();
