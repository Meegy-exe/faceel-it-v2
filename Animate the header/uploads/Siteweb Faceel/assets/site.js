/* Faceel-it — shared site behaviour */
(function () {
  "use strict";
  var doc = document, body = doc.body;
  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ---- Inject SVG icon sprite (single source of truth) ---- */
  (function injectSprite() {
    if (doc.getElementById("fcl-sprite")) return;
    var s =
      '<symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><path d="M16 5.3a3 3 0 0 1 0 5.4"/><path d="M17.6 14.7c2 .6 3.4 2.5 3.4 5.3"/></symbol>' +
      '<symbol id="i-growth" viewBox="0 0 24 24"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M7 15l4-4 3 3 5-6"/><path d="M15 8h4v4"/></symbol>' +
      '<symbol id="i-rocket" viewBox="0 0 24 24"><path d="M5 14c-1.6 1.6-2 5.5-2 5.5s3.9-.4 5.5-2"/><path d="M14 4c3.3 0 6 2.7 6 6-2 4.3-6.5 7.5-9.5 8.5L7 15c1-3 4.2-9 7-11z"/><circle cx="14.5" cy="9.5" r="1.6"/></symbol>' +
      '<symbol id="i-code" viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5"/><path d="M16 7l5 5-5 5"/><path d="M13.5 5l-3 14"/></symbol>' +
      '<symbol id="i-layers" viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></symbol>' +
      '<symbol id="i-data" viewBox="0 0 24 24"><path d="M5 20v-6"/><path d="M10 20V5"/><path d="M15 20v-9"/><path d="M3 20h18"/></symbol>' +
      '<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></symbol>' +
      '<symbol id="i-leaf" viewBox="0 0 24 24"><path d="M4 20c0-8 6-14 16-14 0 10-6 15-13 15"/><path d="M4.5 19.5c3-5 7-8 11-9"/></symbol>' +
      '<symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15.5H5.5C4.7 19.5 4 18.8 4 18V5.5z"/><path d="M20 5.5C20 4.7 19.3 4 18.5 4H13v15.5h5.5c.8 0 1.5-.7 1.5-1.5V5.5z"/></symbol>' +
      '<symbol id="i-calendar" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16"/><path d="M8 3v4"/><path d="M16 3v4"/></symbol>' +
      '<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></symbol>' +
      '<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20S4 14.5 4 9.3A3.8 3.8 0 0 1 12 6a3.8 3.8 0 0 1 8 3.3C20 14.5 12 20 12 20z"/></symbol>' +
      '<symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.5l1-5.8-4.3-4.1 5.9-.8L12 3.5z"/></symbol>' +
      '<symbol id="i-chat" viewBox="0 0 24 24"><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4V6a1 1 0 0 1 1-1z"/></symbol>' +
      '<symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.6 2.5L16 9.5"/></symbol>' +
      '<symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3l1.8 4.9L18 9.5l-4.2 1.6L12 16l-1.8-4.9L6 9.5l4.2-1.6L12 3z"/><path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/></symbol>' +
      '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.3-4.3"/></symbol>' +
      '<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></symbol>' +
      '<symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></symbol>' +
      '<symbol id="i-compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1z"/></symbol>' +
      '<symbol id="i-cloud" viewBox="0 0 24 24"><path d="M7 18a4 4 0 0 1 .3-8A5 5 0 0 1 17 9.4 3.6 3.6 0 0 1 18 18H7z"/></symbol>' +
      '<symbol id="i-cog" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.5M12 18v2.5M4.6 7.5l2.2 1.3M17.2 15.2l2.2 1.3M19.4 7.5l-2.2 1.3M6.8 15.2l-2.2 1.3"/></symbol>' +
      '<symbol id="i-handshake" viewBox="0 0 24 24"><path d="M8 13l3 3 2-2 3 3"/><path d="M3 8l4-3 5 3 5-3 4 3"/><path d="M7 5v6M17 5v8"/></symbol>' +
      '<symbol id="i-bulb" viewBox="0 0 24 24"><path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.7c.6.6.8 1.1.8 2.3h6c0-1.2.2-1.7.8-2.3A6 6 0 0 0 12 3z"/></symbol>';
    var div = doc.createElement("div");
    div.id = "fcl-sprite";
    div.style.display = "none";
    div.setAttribute("aria-hidden", "true");
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + s + "</svg>";
    body.insertBefore(div, body.firstChild);
  })();

  /* ---- Header scroll state ---- */
  var nav = doc.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Overlay menu ---- */
  var burger = doc.querySelector(".burger");
  var overlay = doc.querySelector(".overlay");
  if (burger && overlay) {
    var setMenu = function (open) {
      var willOpen = (typeof open === "boolean") ? open : !body.classList.contains("menu-open");
      body.classList.toggle("menu-open", willOpen);
      burger.setAttribute("aria-expanded", String(willOpen));
      body.style.overflow = willOpen ? "hidden" : "";
    };
    burger.addEventListener("click", function () { setMenu(); });
    // expandable sub-menus (buttons that carry a .ov-sub sibling)
    overlay.querySelectorAll(".ov-item > .ov-link").forEach(function (link) {
      var item = link.parentElement;
      if (item.querySelector(".ov-sub")) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          item.classList.toggle("open");
        });
      }
    });
    // close when navigating to a real destination
    overlay.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute("href");
      if (href && href !== "#") a.addEventListener("click", function () { setMenu(false); });
    });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---- Reveal on scroll (robust against fast scrolling) ---- */
  var revEls = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    revEls.forEach(function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.01 });
    revEls.forEach(function (el) { io.observe(el); });
    var sweep = function () {
      for (var i = 0; i < revEls.length; i++) {
        var el = revEls[i];
        if (el.classList.contains("in")) continue;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.94 && r.bottom > 0) { el.classList.add("in"); io.unobserve(el); }
      }
    };
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep, { passive: true });
    window.addEventListener("load", sweep);
    requestAnimationFrame(sweep);
  }

  /* ---- Hero filament waves (signature) ---- */
  var cv = doc.querySelector("canvas[data-waves]");
  if (cv && !reduce) {
    var ctx = cv.getContext("2d"), W, H, DPR;
    var size = function () {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    size();
    window.addEventListener("resize", size);
    var LINES = 46, t = 0;
    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      var cx = W * 0.72, cy = H * 0.34;
      for (var i = 0; i < LINES; i++) {
        var p = i / LINES;
        ctx.beginPath();
        var amp = 90 + p * 260, phase = t * 0.0009 + p * 4.4, yBase = cy + Math.sin(t * 0.0006 + p * 3) * 40;
        for (var x = -40; x <= W + 40; x += 14) {
          var nx = (x - cx) / W;
          var y = yBase
            + Math.sin(nx * 3.0 + phase) * amp * 0.5
            + Math.sin(nx * 6.2 - phase * 1.3) * amp * 0.22
            + Math.cos(nx * 1.4 + t * 0.0005) * amp * 0.30;
          if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        var g = ctx.createLinearGradient(0, 0, W, 0), a = 0.05 + 0.16 * (1 - p);
        g.addColorStop(0, "rgba(11,217,4,0)");
        g.addColorStop(0.5, "rgba(61,232,92," + a + ")");
        g.addColorStop(0.78, "rgba(11,217,4," + (a * 1.4) + ")");
        g.addColorStop(1, "rgba(43,43,224,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.stroke();
      }
      t += 16;
      requestAnimationFrame(draw);
    };
    draw();
  }
})();
