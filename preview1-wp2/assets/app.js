// WP2 Preview 1 — theme variant + mode + mobile nav. No tracking, no fetch
// except search.js on search.html. Variant/mode persist in localStorage only.
(function () {
  var root = document.documentElement;
  var params = new URLSearchParams(window.location.search);
  var variant = params.get("variant") || localStorage.getItem("atlas-variant") || "a";
  var mode = params.get("mode") || localStorage.getItem("atlas-mode") || "light";
  if (!["a", "b", "c"].includes(variant)) variant = "a";
  if (!["light", "dark"].includes(mode)) mode = "light";
  root.setAttribute("data-variant", variant);
  root.setAttribute("data-mode", mode);
  var select = document.getElementById("variant-select");
  var toggle = document.getElementById("mode-toggle");
  if (select) {
    select.value = variant;
    select.addEventListener("change", function () {
      localStorage.setItem("atlas-variant", select.value);
      root.setAttribute("data-variant", select.value);
    });
  }
  function paintToggle() {
    if (!toggle) return;
    var dark = root.getAttribute("data-mode") === "dark";
    toggle.textContent = dark ? "Light mode" : "Dark mode";
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-mode") === "dark" ? "light" : "dark";
      root.setAttribute("data-mode", next);
      localStorage.setItem("atlas-mode", next);
      paintToggle();
    });
  }
  paintToggle();
  var navBtn = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (navBtn && nav) {
    navBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
      navBtn.textContent = open ? "Close" : "Menu";
    });
  }
})();
