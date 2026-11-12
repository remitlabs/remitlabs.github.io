/* Remit — small progressive enhancements. No framework, no tracking. */
(function () {
  // copy-to-clipboard for any [data-copy] button with a sibling <code>
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      var scope = btn.closest('.cmd') || document;
      var code = scope.querySelector('code');
      var text = (btn.getAttribute('data-copy') || (code && code.textContent) || '').trim();
      if (!text) return;
      var original = btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'copied';
      } catch (e) {
        btn.textContent = 'select + copy';
      }
      setTimeout(function () { btn.textContent = original; }, 1800);
    });
  });

  // single orchestrated entrance, reduced-motion respected
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 45, 180) + 'ms';
      io.observe(el);
    });
  }

  // films: respect reduced motion; otherwise start when in view and pause off-screen
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.film video').forEach(function (v) {
    if (reduceMotion) {
      v.autoplay = false;
      v.removeAttribute('autoplay');
      v.controls = true;
      try { v.pause(); } catch (e) {}
      return;
    }
    try { v.pause(); } catch (e) {}
    var started = false;
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!started) { started = true; try { v.currentTime = 0; } catch (e) {} }
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    seen.observe(v);
  });

  // full-size demo dialog
  var demoDialog = document.getElementById('demo-dialog');
  if (demoDialog && typeof demoDialog.showModal === 'function') {
    var demoVideo = demoDialog.querySelector('video');
    var heroVideo = document.querySelector('#demo video');
    document.querySelectorAll('[data-demo-open]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (heroVideo) heroVideo.pause();
        demoDialog.showModal();
        try { demoVideo.currentTime = 0; } catch (e2) {}
        var p = demoVideo.play();
        if (p && p.catch) p.catch(function () {});
      });
    });
    demoDialog.querySelector('[data-demo-close]').addEventListener('click', function () {
      demoDialog.close();
    });
    demoDialog.addEventListener('close', function () { demoVideo.pause(); });
    demoDialog.addEventListener('click', function (e) {
      if (e.target === demoDialog) demoDialog.close();
    });
  }

  // mark the current nav item
  var path = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  document.querySelectorAll('.nav a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0) return;
    var norm = href.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (norm === path) a.setAttribute('aria-current', 'page');
  });
})();
