/* THEME BOOT, RENDER-BLOCKING ON PURPOSE (ONE TINY FILE): SAVED CHOICE, ELSE SYSTEM PREFERENCE, APPLIED BEFORE FIRST PAINT. ALSO MARKS html.js. */
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    var s = localStorage.getItem('bdf.theme');
    var dark = s ? s === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) d.classList.add('dark');
  } catch (e) {}
})();
