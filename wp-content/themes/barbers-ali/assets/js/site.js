(function () {
  var doc = document.documentElement;
  // Orari: 0 = domenica
  var H = { 0: [9, 19], 1: null, 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [9, 20] };
  var NAMES = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  var d = now.getDay(), h = now.getHours() + now.getMinutes() / 60, t = H[d];
  var open = !!(t && h >= t[0] && h < t[1]);
  var label;
  if (open) {
    label = 'Aperto ora · chiude alle ' + t[1] + ':00';
  } else {
    var nd = d, i = 0;
    if (t && h < t[0]) { label = 'Chiuso ora · apre oggi alle ' + t[0] + ':00'; }
    else {
      do { nd = (nd + 1) % 7; i++; } while (!H[nd] && i < 7);
      label = 'Chiuso ora · riapre ' + (i === 1 ? 'domani' : NAMES[nd]) + ' alle ' + H[nd][0] + ':00';
    }
  }
  document.querySelectorAll('[data-open-status]').forEach(function (el) {
    if (open) el.classList.add('is-open');
    var l = el.querySelector('.ba-open-label');
    if (l) l.textContent = label;
  });
  document.querySelectorAll('[data-hours] tr[data-d="' + d + '"]').forEach(function (tr) { tr.classList.add('is-today'); });

  // Comparsa morbida delle sezioni (già visibili senza JS)
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('.ba-section-head, .ba-board, .ba-score, .ba-q, .ba-frame, .ba-hours-card, .ba-where');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el, k) {
    var r = el.getBoundingClientRect();
    el.classList.add('ba-reveal');
    el.style.transitionDelay = (k % 4) * 70 + 'ms';
    if (r.top < window.innerHeight) el.classList.add('is-in'); else io.observe(el);
  });
  doc.classList.add('ba-js');

  // Contatori
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = +el.getAttribute('data-count'), start = null;
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; o.disconnect();
      requestAnimationFrame(function step(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / 1100);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      });
    });
    o.observe(el);
  });
})();
