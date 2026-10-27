/* Atlas Preview 3 — System Explorer stepper (progressive enhancement only).
   The journey list and diagram are fully present without this script.
   Loaded with defer; respects reduced motion by jumping instead of scrolling. */
(function () {
  var list = document.getElementById('nic-journey-list');
  if (!list) return;
  var nodes = Array.prototype.slice.call(list.querySelectorAll('li[data-node]'));
  if (nodes.length < 2) return;
  var current = 0;
  var status = document.getElementById('journey-status');
  var prev = document.getElementById('journey-prev');
  var next = document.getElementById('journey-next');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(i) {
    current = Math.max(0, Math.min(nodes.length - 1, i));
    nodes.forEach(function (li, idx) {
      li.setAttribute('aria-current', idx === current ? 'step' : 'false');
    });
    var label = nodes[current].getAttribute('data-label') || '';
    if (status) status.textContent = 'Step ' + (current + 1) + ' of ' + nodes.length + ': ' + label + '.';
    var target = nodes[current].querySelector('a, h3') || nodes[current];
    if (reduced) { target.focus({ preventScroll: false }); }
    else { target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === nodes.length - 1;
  }
  if (prev) prev.addEventListener('click', function () { show(current - 1); });
  if (next) next.addEventListener('click', function () { show(current + 1); });
  show(0);
})();
