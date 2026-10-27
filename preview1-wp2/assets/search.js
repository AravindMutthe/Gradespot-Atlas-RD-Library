// WP5 route contract — title-only matching. This file is deliberately
// small and replaceable: WP5 swaps this matching for full search without
// changing the URL (?q=), the parameter name, or result link format.
(function () {
  var q = new URLSearchParams(window.location.search).get("q") || "";
  var status = document.getElementById("search-status");
  var list = document.getElementById("search-results");
  var input = document.getElementById("q2");
  if (input) input.value = q;
  if (!q.trim()) {
    if (status) status.textContent = "Enter a query above. Title-only matching (WP5 full search pending).";
    return;
  }
  fetch("data/chapters.json").then(function (r) { return r.json(); }).then(function (chapters) {
    var needle = q.trim().toLowerCase();
    var hits = chapters.filter(function (c) { return c.title.toLowerCase().includes(needle); });
    if (status) status.textContent = "Title-only matches for “" + q + "”: " + hits.length + " of 57 chapters. (Full search is WP5 — bodies, images and notes are not searched yet.)";
    hits.forEach(function (c) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "library.html#" + c.slug;
      a.textContent = c.title;
      li.appendChild(a);
      li.appendChild(document.createTextNode(" — " + c.domain + " · " + c.paragraphs + " paragraphs recorded · " + c.images + " images recorded"));
      list.appendChild(li);
    });
    if (!hits.length) {
      var li = document.createElement("li");
      li.textContent = "No chapter title matches. Try a broader word (e.g. silicon, networks, institutions).";
      list.appendChild(li);
    }
  }).catch(function () {
    if (status) status.textContent = "Could not load the chapter index. The index file is data/chapters.json in this preview.";
  });
})();
