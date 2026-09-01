/* Shared behaviour for every page.
   1. mobile menu toggle
   2. marks the current page in the nav
   3. footer year
   4. draws the elimination-depth chart on debate.html
   To add or change a tournament, edit the DATA array near the bottom
   and the matching table row in debate.html. */
(function () {
  "use strict";

  /* ---- 1. mobile menu ---- */
  var nav = document.getElementById('nav');
  var mbtn = document.getElementById('mbtn');
  if (nav && mbtn) {
    mbtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      mbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      mbtn.textContent = open ? 'Close' : 'Menu';
    });
  }

  /* ---- 2. highlight the current page ---- */
  if (nav) {
    var here = location.pathname.split('/').pop() || 'index.html';
    [].slice.call(nav.querySelectorAll('a')).forEach(function (a) {
      if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---- 3. footer year ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- 4. elimination-depth chart (debate page only) ---- */
  var host = document.getElementById('chartHost');
  if (!host) return;

  var TEAL = '#1D6E7A', GOLD = '#A8761B';
  var DATA = [
    { t: 'JW Patterson TOC',     d: 'Apr 2026', v: 8, l: 'Silver bid, #22', c: TEAL },
    { t: 'TOC Digital Series 3', d: 'Mar 2026', v: 4, l: 'Double octos',    c: TEAL },
    { t: 'TOC Digital Series 2', d: 'Feb 2026', v: 4, l: 'Double octos',    c: TEAL },
    { t: 'Harvard Nationals',    d: 'Feb 2026', v: 3, l: 'Triple octos',    c: TEAL },
    { t: 'The Patriot Games',    d: 'Jan 2026', v: 6, l: 'Quarterfinals',   c: TEAL },
    { t: 'TOC Digital Series 1', d: 'Dec 2025', v: 5, l: 'Octofinals',      c: TEAL },
    { t: 'John Lewis SVUDL',     d: 'Nov 2025', v: 3, l: 'Triple octos',    c: TEAL },
    { t: 'Katy Taylor TFA',      d: 'Nov 2025', v: 4, l: 'Double octos',    c: TEAL },
    { t: 'Harvard UKTOC ISDI 1', d: 'Oct 2025', v: 7, l: 'Semifinals',      c: TEAL },
    { t: 'Georgetown Fall',      d: 'Oct 2025', v: 4, l: 'Double octos',    c: TEAL },
    { t: 'Newark CFL #2',        d: 'Mar 2025', v: 6, l: 'Quarterfinals',   c: GOLD }
  ];

  var NS = 'http://www.w3.org/2000/svg';
  var LW = 170, RW = 118, ROW = 30, TOP = 26, BOT = 6, W = 760, MAX = 8;
  var H = TOP + DATA.length * ROW + BOT, track = W - LW - RW;

  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Elimination round reached at each tournament');
  svg.style.minWidth = W + 'px';

  [{ v: 3, l: 'Triples' }, { v: 4, l: 'Doubles' }, { v: 5, l: 'Octos' },
   { v: 6, l: 'Quarters' }, { v: 7, l: 'Semis' }].forEach(function (tk) {
    var x = LW + (tk.v / MAX) * track;
    var ln = document.createElementNS(NS, 'line');
    ln.setAttribute('x1', x); ln.setAttribute('x2', x);
    ln.setAttribute('y1', TOP - 8); ln.setAttribute('y2', H - BOT);
    ln.setAttribute('stroke', '#E3E3E1');
    svg.appendChild(ln);
    var tx = document.createElementNS(NS, 'text');
    tx.setAttribute('x', x); tx.setAttribute('y', TOP - 14);
    tx.setAttribute('text-anchor', 'middle');
    tx.setAttribute('fill', '#8B9097'); tx.setAttribute('font-size', '10.5');
    tx.setAttribute('font-family', 'Inter, sans-serif');
    tx.textContent = tk.l;
    svg.appendChild(tx);
  });

  DATA.forEach(function (r, i) {
    var y = TOP + i * ROW, col = r.c;

    var nm = document.createElementNS(NS, 'text');
    nm.setAttribute('x', 0); nm.setAttribute('y', y + 12);
    nm.setAttribute('fill', '#16181B'); nm.setAttribute('font-size', '12.5');
    nm.setAttribute('font-family', 'Inter, sans-serif');
    nm.textContent = r.t;
    svg.appendChild(nm);

    var dt = document.createElementNS(NS, 'text');
    dt.setAttribute('x', 0); dt.setAttribute('y', y + 24);
    dt.setAttribute('fill', '#A0A5AA'); dt.setAttribute('font-size', '10.5');
    dt.setAttribute('font-family', 'Inter, sans-serif');
    dt.textContent = r.d;
    svg.appendChild(dt);

    var bg = document.createElementNS(NS, 'rect');
    bg.setAttribute('x', LW); bg.setAttribute('y', y + 5);
    bg.setAttribute('width', track); bg.setAttribute('height', 11);
    bg.setAttribute('fill', '#F2F2F1');
    svg.appendChild(bg);

    var bar = document.createElementNS(NS, 'rect');
    bar.setAttribute('x', LW); bar.setAttribute('y', y + 5);
    bar.setAttribute('width', 0); bar.setAttribute('height', 11);
    bar.setAttribute('fill', col);
    bar.setAttribute('data-w', (r.v / MAX) * track);
    svg.appendChild(bar);

    var lb = document.createElementNS(NS, 'text');
    lb.setAttribute('x', LW + track + 12); lb.setAttribute('y', y + 14);
    lb.setAttribute('fill', r.v >= 6 ? col : '#53585E');
    lb.setAttribute('font-size', '11.5');
    lb.setAttribute('font-family', 'Inter, sans-serif');
    lb.textContent = r.l;
    svg.appendChild(lb);
  });

  host.appendChild(svg);

  var bars = [].slice.call(svg.querySelectorAll('rect[data-w]'));
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bars.forEach(function (b) { b.setAttribute('width', b.getAttribute('data-w')); });
    return;
  }
  bars.forEach(function (b, i) {
    var w = parseFloat(b.getAttribute('data-w'));
    b.style.transition = 'width .6s ease ' + (i * 45) + 'ms';
    setTimeout(function () { b.setAttribute('width', w); }, 60);
  });
})();
