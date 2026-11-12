/* Remit — progressive enhancement, no framework, no tracking.
   1. clipboard   2. scroll progress   3. nav state   4. demo dialog
   5. sticky command bar   6. anime.js motion   7. three.js fleet field
   Every enhancement is optional: with no JS, or a blocked CDN, the page
   stays readable and interactive. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (reduce) document.querySelectorAll('.hero-visual video').forEach(function (video) { video.autoplay = false; video.pause(); });

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
          btn.textContent = 'copied';
        } catch (e) {
          btn.textContent = 'select + copy';
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

  /* ---------- 7. three.js fleet field ---------- */
  var host = document.querySelector('[data-field]');
  var hint = document.querySelector('[data-field-hint]');
  if (host && !host.dataset.done) {
    host.dataset.done = '1';

    var started = false;
    var stalled = function () {
      host.classList.add('stalled');
      var base = host.querySelector('.field-base');
      if (base) base.textContent = 'field needs a network connection';
      if (hint) hint.textContent = '';
    };
    var load = function () {
      if (started) return;
      started = true;
      var guard = setTimeout(function () {
        if (!host.classList.contains('loaded')) stalled();
      }, 7000);
      import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js')
        .then(function (THREE) { clearTimeout(guard); build(THREE); })
        .catch(function () { clearTimeout(guard); stalled(); });
    };

    var build = function (THREE) {
      var canvas = host.querySelector('canvas');
      var renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      } catch (e) {
        var base = host.querySelector('.field-base');
        if (base) base.textContent = 'no webgl';
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 5.8);

      var group = new THREE.Group();
      scene.add(group);

      // deterministic layout: the same machine should draw the same field twice
      var seed = 20261026;
      function rnd() {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      }

      var TOTAL = 123;
      var CLUSTERS = [
        { x: -1.06, y: 0.54, z: 0.30 },   // claude code
        { x: 1.04, y: 0.62, z: -0.40 },   // codex
        { x: 0.10, y: -0.64, z: 0.48 },   // cursor
        { x: -0.74, y: -0.42, z: -0.58 }  // opencode
      ];

      var COUNT = TOTAL + 4; // four directory hubs join the field
      var pos = new Float32Array(COUNT * 3);
      var col = new Float32Array(COUNT * 3);
      var siz = new Float32Array(COUNT);

      var C = {
        clean: new THREE.Color('#A9B7AE'),
        warn: new THREE.Color('#FFB454'),
        deny: new THREE.Color('#EA7767')
      };
      // three flagged, one revoked — the four from the documented run
      var flagged = { 7: 'warn', 34: 'warn', 76: 'warn', 101: 'deny' };

      for (var i = 0; i < TOTAL; i++) {
        var c = CLUSTERS[i % 4];
        // an even field with a light bias toward each agent directory:
        // every skill visible, the four groups still legible as density
        pos[i * 3] = (rnd() * 2 - 1) * 2.15 + c.x * 0.72;
        pos[i * 3 + 1] = (rnd() * 2 - 1) * 1.2 + c.y * 0.72;
        pos[i * 3 + 2] = (rnd() * 2 - 1) * 1.05;
        var kind = flagged[i] || 'clean';
        var colour = C[kind];
        col[i * 3] = colour.r; col[i * 3 + 1] = colour.g; col[i * 3 + 2] = colour.b;
        siz[i] = kind === 'deny' ? 3.2 : kind === 'warn' ? 2.5 : 1.15 + rnd() * 0.5;
      }

      // directory hubs: the grouping is the information, so draw it
      var hubColour = new THREE.Color('#6E7A70');
      for (var h = 0; h < 4; h++) {
        var hi = TOTAL + h;
        pos[hi * 3] = CLUSTERS[h].x * 0.72;
        pos[hi * 3 + 1] = CLUSTERS[h].y * 0.72;
        pos[hi * 3 + 2] = CLUSTERS[h].z * 0.72;
        col[hi * 3] = hubColour.r; col[hi * 3 + 1] = hubColour.g; col[hi * 3 + 2] = hubColour.b;
        siz[hi] = 3.4;
      }

      // one hairline from each skill to the directory it was loaded from
      var edges = [];
      for (var e = 0; e < TOTAL; e++) {
        var hub = CLUSTERS[e % 4];
        edges.push(hub.x * 0.72, hub.y * 0.72, hub.z * 0.72, pos[e * 3], pos[e * 3 + 1], pos[e * 3 + 2]);
      }

      var hubGeo = new THREE.BufferGeometry();
      hubGeo.setAttribute('position', new THREE.Float32BufferAttribute(edges, 3));
      var hubLines = new THREE.LineSegments(hubGeo, new THREE.LineBasicMaterial({
        color: 0x3A4740, transparent: true, opacity: 0.26
      }));
      group.add(hubLines);

      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3));
      geo.setAttribute('aSize', new THREE.Float32BufferAttribute(siz, 1));

      var mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uDpr: { value: Math.min(window.devicePixelRatio || 1, 1.75) } },
        vertexShader: [
          'attribute vec3 aColor;',
          'attribute float aSize;',
          'varying vec3 vColor;',
          'uniform float uDpr;',
          'void main(){',
          '  vColor = aColor;',
          '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
          '  gl_Position = projectionMatrix * mv;',
          '  gl_PointSize = aSize * uDpr * (24.0 / -mv.z);',
          '}'
        ].join('\n'),
        fragmentShader: [
          'varying vec3 vColor;',
          'void main(){',
          '  vec2 d = gl_PointCoord - 0.5;',
          '  float r = length(d);',
          '  if (r > 0.5) discard;',
          '  float a = smoothstep(0.5, 0.44, r);',
          '  gl_FragColor = vec4(vColor, a);',
          '}'
        ].join('\n')
      });

      var points = new THREE.Points(geo, mat);
      group.add(points);
      group.rotation.x = -0.18;
      group.rotation.y = 0.35;

      var dpr = renderer.getPixelRatio();
      var size = { w: 0, h: 0 };
      var resize = function () {
        var r = host.getBoundingClientRect();
        var w = Math.max(1, Math.floor(r.width));
        var h = Math.max(1, Math.floor(r.height));
        if (w === size.w && h === size.h) return;
        size.w = w; size.h = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (reduce) renderer.render(scene, camera);
      };
      resize();
      if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
      else window.addEventListener('resize', resize);

      // pointer parallax — a flat image would not move
      var px = 0, py = 0, tx = 0, ty = 0;
      if (hover && hint) {
        host.addEventListener('pointermove', function (e) {
          var r = host.getBoundingClientRect();
          tx = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
          ty = ((e.clientY - r.top) / r.height - 0.5) * 0.35;
        });
        host.addEventListener('pointerleave', function () { tx = 0; ty = 0; });
      }

      var visible = true;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        }, { threshold: 0.05 }).observe(host);
      }
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && visible && !reduce) loop();
      });

      var running = false;
      var loop = function () {
        if (running) return;
        running = true;
        var step = function () {
          if (!visible || document.hidden) { running = false; return; }
          px += (tx - px) * 0.055;
          py += (ty - py) * 0.055;
          group.rotation.y += 0.0011;
          group.rotation.x = -0.18 + py;
          group.rotation.z = px * 0.12;
          camera.position.x = px * 0.35;
          camera.position.y = -py * 0.3;
          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };

      host.classList.add('loaded');
      if (reduce) {
        renderer.render(scene, camera);
        if (hint) hint.textContent = 'static render';
      } else {
        resize();
        loop();
      }
    };

    // three trigger paths: the field scrolled into reach, the first scroll,
    // or the first interaction. Whichever happens first wins.
    if ('IntersectionObserver' in window) {
      var once = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { once.disconnect(); load(); }
      }, { rootMargin: '320px' });
      once.observe(host);
    }
    window.addEventListener('scroll', load, { once: true, passive: true });
    window.addEventListener('pointerdown', load, { once: true, passive: true });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) load(); });
    if (!('IntersectionObserver' in window)) load();
  }
})();
