/* Remit — progressive enhancement, no framework, no tracking.
   1. clipboard   2. scroll progress   3. nav state   4. demo dialog
   5. sticky command bar   6. anime.js motion   7. local canvas skill mesh
   Every enhancement is optional: with no JS, or a blocked CDN, the page
   stays readable and interactive. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (reduce) document.querySelectorAll('video[autoplay]').forEach(function (video) { video.autoplay = false; video.pause(); });

  /* ---------- 1. copy ---------- */
  function wireCopy(root) {
    root.querySelectorAll('[data-copy]').forEach(function (btn) {
      if (btn.dataset.wired) return;
      btn.dataset.wired = '1';
      btn.addEventListener('click', async function () {
        var scope = btn.closest('.cmd') || btn.closest('.cmdbar') || document;
        var code = scope.querySelector('code');
        var text = (btn.getAttribute('data-copy') || (code && code.textContent) || '').trim();
        if (!text) return;
        var original = btn.textContent;
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = 'Copied';
        } catch (e) {
          btn.textContent = 'Copy manually';
        }
        setTimeout(function () { btn.textContent = original; }, 1700);
      });
    });
  }
  wireCopy(document);

  /* ---------- 2. progress ---------- */
  var bar = document.querySelector('[data-progress]');
  if (bar) {
    var ticking = false;
    var paint = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var v = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      bar.style.transform = 'scaleX(' + v.toFixed(4) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }

  /* ---------- 3. nav current ---------- */
  var path = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  document.querySelectorAll('.nav a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0) return;
    var norm = href.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (norm === path) a.setAttribute('aria-current', 'page');
  });

  /* ---------- 4. demo dialog ---------- */
  var dialog = document.getElementById('demo-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    var dVideo = dialog.querySelector('video');
    var pageVideos = document.querySelectorAll('.film video');
    document.querySelectorAll('[data-demo-open]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        pageVideos.forEach(function (v) { try { v.pause(); } catch (err) {} });
        dialog.showModal();
        try { dVideo.currentTime = 0; } catch (err) {}
        var p = dVideo.play();
        if (p && p.catch) p.catch(function () {});
      });
    });
    dialog.querySelector('[data-demo-close]').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('close', function () { try { dVideo.pause(); if (!reduce) pageVideos.forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }); } catch (e) {} });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  }

  /* ---------- 5. sticky command bar ---------- */
  var cmdbar = document.querySelector('[data-cmdbar]');
  if (cmdbar) {
    var hero = document.querySelector('.hero');
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('remit-cmdbar') === 'closed'; } catch (e) {}
    var setBar = function (show) {
      if (dismissed) return;
      cmdbar.classList.toggle('on', show);
      cmdbar.setAttribute('aria-hidden', show ? 'false' : 'true');
    };
    if (dismissed) cmdbar.remove();
    else if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var past = en.boundingClientRect.bottom < 80;
          setBar(past || !en.isIntersecting);
        });
      }, { threshold: 0 }).observe(hero);
    }
    var close = cmdbar.querySelector('[data-cmdbar-close]');
    if (close) close.addEventListener('click', function () {
      dismissed = true;
      setBar(false);
      try { sessionStorage.setItem('remit-cmdbar', 'closed'); } catch (e) {}
      setTimeout(function () { cmdbar.remove(); }, 320);
    });
  }

  /* ---------- 6. anime.js motion ---------- */
  var A = window.anime;
  var lib = A && A.animate ? A : (A && A.default && A.default.animate ? A.default : null);
  var anim = lib ? lib.animate : null;

  if (!lib || !anim || reduce) {
    /* no library, or reader asked for stillness: leave the page as authored */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
  } else {
    try {
      var stagger = lib.stagger;
      var set = lib.utils && lib.utils.set;
      // a throttled or backgrounded tab must not freeze the page half-faded
      if (lib.engine) lib.engine.pauseOnDocumentHidden = false;

      // hero: one orchestrated entrance, then never again
      var heroH1 = document.querySelector('.hero h1');
      var heroBits = ['.hero .kicker', '.hero .lede', '.hero .install', '.hero .works'];
      if (set) {
        if (heroH1) set(heroH1, { opacity: 0, translateY: 26 });
        heroBits.forEach(function (sel) {
          var el = document.querySelector(sel);
          if (el) set(el, { opacity: 0, translateY: 16 });
        });
        var panel = document.querySelector('.hero .panel');
        if (panel) set(panel, { opacity: 0, translateY: 20 });
      }

      var heroTl = lib.createTimeline({ defaults: { ease: 'out(4)' } });
      heroTl
        .add('.hero .kicker', { opacity: [0, 1], duration: 620 }, 0)
        .add('.hero h1', { opacity: [0, 1], translateY: [26, 0], duration: 900 }, 120)
        .add('.hero .lede', { opacity: [0, 1], translateY: [16, 0], duration: 780 }, 380)
        .add('.hero .install', { opacity: [0, 1], translateY: [16, 0], duration: 760 }, 500)
        .add('.hero .works', { opacity: [0, 1], translateY: [16, 0], duration: 700 }, 620)
        .add('.hero .panel', { opacity: [0, 1], translateY: [20, 0], duration: 900 }, 300);

      // safety net: if the tab is throttled and the timeline never lands,
      // drop the start states so the page is readable regardless
      setTimeout(function () {
        var probe = document.querySelector('.hero h1');
        if (probe && parseFloat(getComputedStyle(probe).opacity) < 0.9) {
          document.querySelectorAll('.hero h1, .hero .kicker, .hero .lede, .hero .install, .hero .works, .hero .panel')
            .forEach(function (el) { el.style.opacity = ''; el.style.transform = ''; });
        }
      }, 2400);

      // below the fold: reveal once, as it arrives
      var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            en.target.classList.add('in');
            anim(en.target, {
              opacity: [0, 1], translateY: [18, 0],
              duration: 820, ease: 'out(3)'
            });
            setTimeout(function () {
              if (parseFloat(getComputedStyle(en.target).opacity) < 0.9) {
                en.target.style.opacity = '';
                en.target.style.transform = '';
              }
            }, 1100);
            io.unobserve(en.target);
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach(function (el) {
          if (set) set(el, { opacity: 0, translateY: 18 });
          io.observe(el);
        });
      }

      // counts: numbers that arrive instead of numbers that just sit there
      var counters = document.querySelectorAll('[data-count]');
      if (counters.length && 'IntersectionObserver' in window) {
        var co = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var el = en.target;
            var to = parseInt(el.getAttribute('data-count'), 10) || 0;
            var obj = { v: 0 };
            anim(obj, {
              v: to, duration: 1200, ease: 'out(4)',
              onUpdate: function () { el.textContent = Math.round(obj.v); },
              onComplete: function () { el.textContent = to; }
            });
            // the figure must be exact even if the animation is throttled
            setTimeout(function () { el.textContent = to; }, 1900);
            co.unobserve(el);
          });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { co.observe(el); });
      }

      // primary CTA: a small physical response, not a wobble
      if (hover) {
        document.querySelectorAll('.cta.solid').forEach(function (cta) {
          cta.addEventListener('pointermove', function (e) {
            var r = cta.getBoundingClientRect();
            var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
            var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
            anim(cta, { translateX: dx * 3, translateY: dy * 2, duration: 320, ease: 'out(2)' });
          });
          cta.addEventListener('pointerleave', function () {
            anim(cta, { translateX: 0, translateY: 0, duration: 520, ease: 'out(3)' });
          });
        });
      }
    } catch (err) {
      /* a motion failure must never hide content */
      document.querySelectorAll('[data-reveal], .hero h1, .hero .kicker, .hero .lede, .hero .install, .hero .works, .hero .panel')
        .forEach(function (el) { el.style.opacity = ''; el.style.transform = ''; });
      console.warn('remit: motion skipped', err);
    }
  }

  /* The example mesh is rendered locally. Its layout is illustrative. */
  var mesh = document.querySelector('[data-mesh]');
  if (mesh) {
    var canvas = mesh.querySelector('canvas');
    var context = canvas.getContext('2d');
    if (!context) return;

    var motionButton = mesh.querySelector('[data-mesh-motion]');
    var status = mesh.querySelector('[data-mesh-status]');
    var paused = reduce;
    var visible = false;
    var frame = null;
    var angle = 0.18;
    var lastTime = 0;
    var selectedRisk = null;
    var pointer = { x: 0, y: 0 };
    var width = 0;
    var height = 0;
    var riskColors = {
      clean: '#7D9C90', low: '#BBC6A9', elevated: '#C7954E', high: '#FFB454'
    };
    var riskCounts = { clean: 101, low: 1, elevated: 15, high: 6 };
    var riskLabels = { clean: 'clean score', low: 'low risk', elevated: 'elevated', high: 'high risk' };
    var hubs = [
      { x: -1.2, y: -.5, z: .3 }, { x: .9, y: -.6, z: -.4 },
      { x: -1, y: .65, z: -.3 }, { x: 1.1, y: .6, z: .5 }
    ];
    var nodes = [];
    var seed = 1234;
    function random() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }
    for (var index = 0; index < 123; index++) {
      var hub = hubs[index % hubs.length];
      var risk = index < 101 ? 'clean' : index === 101 ? 'low' : index < 117 ? 'elevated' : 'high';
      nodes.push({
        x: hub.x + (random() - .5) * 1.75,
        y: hub.y + (random() - .5) * 1.2,
        z: hub.z + (random() - .5) * 1.8,
        risk: risk,
        hub: index % hubs.length
      });
    }

    function project(node) {
      var rotation = angle + pointer.x;
      var x = node.x * Math.cos(rotation) + node.z * Math.sin(rotation);
      var z = -node.x * Math.sin(rotation) + node.z * Math.cos(rotation);
      var y = node.y + z * pointer.y;
      var perspective = 4.8 / (5 - z);
      var scale = Math.min(width / 5.5, height / 3.6);
      return { x: width / 2 + x * scale * perspective, y: height / 2 + y * scale * perspective, depth: perspective };
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      var projectedHubs = hubs.map(project);
      var projected = nodes.map(project);
      nodes.forEach(function (node, i) {
        var point = projected[i];
        var hub = projectedHubs[node.hub];
        var highlighted = !selectedRisk || selectedRisk === node.risk;
        context.strokeStyle = highlighted ? 'rgba(125,156,144,.26)' : 'rgba(125,156,144,.045)';
        context.lineWidth = .7;
        context.beginPath();
        context.moveTo(hub.x, hub.y);
        context.lineTo(point.x, point.y);
        var neighbor = projected[(i + 4) % nodes.length];
        context.lineTo(neighbor.x, neighbor.y);
        context.stroke();
      });
      projectedHubs.forEach(function (hub) {
        context.strokeStyle = '#7D9C90';
        context.lineWidth = 1;
        context.beginPath();
        context.arc(hub.x, hub.y, 6, 0, Math.PI * 2);
        context.stroke();
      });
      nodes.forEach(function (node, i) {
        var point = projected[i];
        context.globalAlpha = !selectedRisk || selectedRisk === node.risk ? 1 : .12;
        context.fillStyle = riskColors[node.risk];
        var radius = (node.risk === 'high' ? 4 : node.risk === 'elevated' ? 3.1 : 2.3) * point.depth;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
    }

    function resize() {
      width = mesh.clientWidth;
      height = mesh.clientHeight;
      var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw();
    }

    function animate(time) {
      frame = null;
      if (paused || !visible || document.hidden) return;
      if (lastTime) angle += Math.min(time - lastTime, 50) * .000035;
      lastTime = time;
      draw();
      frame = requestAnimationFrame(animate);
    }
    function updateMotion() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTime = 0;
      motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
      motionButton.setAttribute('aria-pressed', paused ? 'true' : 'false');
      draw();
      if (!paused && visible && !document.hidden) frame = requestAnimationFrame(animate);
    }

    motionButton.addEventListener('click', function () {
      paused = !paused;
      updateMotion();
    });
    document.querySelectorAll('[data-risk]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedRisk = selectedRisk === button.dataset.risk ? null : button.dataset.risk;
        document.querySelectorAll('[data-risk]').forEach(function (item) {
          item.setAttribute('aria-pressed', item.dataset.risk === selectedRisk ? 'true' : 'false');
        });
        var count = selectedRisk ? riskCounts[selectedRisk] : 123;
        status.textContent = selectedRisk ? count + ' ' + riskLabels[selectedRisk] + (count === 1 ? ' entry' : ' entries') : 'All 123 entries';
        draw();
      });
    });
    if (hover) mesh.addEventListener('pointermove', function (event) {
      if (paused) return;
      var bounds = mesh.getBoundingClientRect();
      pointer.x = (event.clientX / width - bounds.left / width - .5) * .12;
      pointer.y = ((event.clientY - bounds.top) / height - .5) * .12;
    });
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(mesh);
    else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        updateMotion();
      }).observe(mesh);
    } else visible = true;
    document.addEventListener('visibilitychange', updateMotion);
    resize();
    mesh.classList.add('mesh-ready');
    updateMotion();
  }
})();
