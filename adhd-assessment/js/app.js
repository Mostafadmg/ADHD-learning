/* Boot: wire the shell, then start the router. Loaded last. */
(function (AA) {
  'use strict';
  AA.shell.init();
  AA.router.mount(document.getElementById('view'));
  AA.router.start();
})(window.AA);
