/* Canvas keeps the catalog out of the DOM. Detail is created only on selection. */
(() => {
  const mesh = document.querySelector('[data-mesh]');
  if (!mesh) return;
  const workspace = mesh.closest('.mesh-workspace');
  const canvas = mesh.querySelector('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  const search = document.querySelector('#skill-search');
  const help = document.querySelector('[data-mesh-help]');
  const results = document.querySelector('[data-mesh-results]');
  const detail = document.querySelector('[data-skill-detail]');
  const motion = workspace.querySelector('[data-mesh-motion]');
  const status = workspace.querySelector('[data-mesh-status]');
  const level = workspace.querySelector('[data-mesh-zoom-level]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const colors = { clean: '#83B8A9', low: '#91AAC8', elevated: '#D0AD70', high: '#D48C84' };
  const labels = { clean: 'Clean score', low: 'Low risk', elevated: 'Elevated', high: 'High risk' };
  let skills = [], groups = [], hits = [];
  let width = 0, height = 0, zoom = 1, panX = 0, panY = 0, angle = .18;
  let visible = false, loading = false, loaded = false, paused = reduced.matches;
  let selected = null, filter = null, frame = null, lastTime = 0, drag = null;
  let searchTimer;
  const format = value => value.toLocaleString('en-US');

  function element(tag, text, className) {
    const item = document.createElement(tag);
    if (text !== undefined) item.textContent = text;
    if (className) item.className = className;
    return item;
  }
  function updateMotion() {
    motion.textContent = paused || selected !== null ? 'Resume motion' : 'Pause motion';
    motion.setAttribute('aria-pressed', String(paused || selected !== null));
    schedule();
  }
  function project(x, y, z) {
    const rotatedX = x * Math.cos(angle) + z * Math.sin(angle);
    const depth = z * Math.cos(angle) - x * Math.sin(angle);
    const perspective = 4.8 / (5 - depth);
    const scaleX = Math.min(width / 5.8, height / 2.4);
    const scaleY = Math.min(width / 4, (height - 100) / 3.3);
    return { x: width / 2 + rotatedX * scaleX * perspective * zoom + panX,
      y: height / 2 + y * scaleY * perspective * zoom + panY };
  }
  function shape(x, y, radius, risk) {
    context.beginPath();
    if (risk === 'clean') context.arc(x, y, radius, 0, Math.PI * 2);
    else if (risk === 'high') context.rect(x - radius, y - radius, radius * 2, radius * 2);
    else {
      const sides = risk === 'low' ? 4 : 3;
      for (let i = 0; i < sides; i++) {
        const a = -Math.PI / 2 + i * Math.PI * 2 / sides;
        context.lineTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius);
      }
      context.closePath();
    }
    context.fill();
  }
  function draw() {
    context.clearRect(0, 0, width, height);
    hits = [];
    const expansion = Math.max(0, Math.min(1, (zoom - 1.25) / 1.25));
    const individual = expansion >= 1;
    const occupied = new Set();
    const spacing = 24;
    for (const group of groups) {
      if (filter && group.risk !== filter) continue;
      const center = project(group.x, group.y, group.z);
      const margin = zoom * 24;
      if (center.x < -margin || center.x > width + margin || center.y < -margin || center.y > height + margin) continue;
      const radius = 2.5;
      const members = expansion > 0 ? group.members : [group.members[0]];
      members.forEach((index, member) => {
        const point = project(group.x + Math.cos(member * 2.4) * .055 * member * expansion,
          group.y + Math.sin(member * 2.4) * .055 * member * expansion, group.z);
        if (point.x < 0 || point.x > width || point.y < 0 || point.y > height) return;
        const cell = `${Math.floor(point.x / spacing)},${Math.floor(point.y / spacing)}`;
        if (occupied.has(cell)) return;
        occupied.add(cell);
        context.fillStyle = colors[group.risk];
        shape(point.x, point.y, radius, group.risk);
        hits.push({ ...point, index: individual ? index : null, group });
      });
      if (selected !== null && group.members.includes(selected)) {
        const member = group.members.indexOf(selected);
        const point = project(group.x + Math.cos(member * 2.4) * .055 * member * expansion,
          group.y + Math.sin(member * 2.4) * .055 * member * expansion, group.z);
        context.strokeStyle = '#ffffff'; context.beginPath();
        context.arc(point.x, point.y, radius + 5, 0, Math.PI * 2); context.stroke();
        context.fillStyle = '#edf0e8'; context.font = '12px sans-serif';
        context.fillText(skills[selected].name.slice(0, 35), Math.min(point.x + 10, width - 200), Math.max(16, point.y - 10));
      }
    }
    level.textContent = `${Math.round(zoom * 100)}%`;
    mesh.dataset.view = individual ? 'individual' : 'grouped';
  }
  function tick(time) {
    frame = null;
    if (!visible || document.hidden) return;
    if (time - lastTime >= 1000 / 30) {
      angle += Math.min(time - (lastTime || time), 50) * .000035;
      lastTime = time;
      draw();
    }
    schedule();
  }
  function schedule() {
    if (visible && loaded && !document.hidden && !paused && selected === null && !drag && frame === null) frame = requestAnimationFrame(tick);
    else if ((!visible || document.hidden || paused || selected !== null || drag) && frame !== null) {
      cancelAnimationFrame(frame); frame = null;
    }
  }
  function setZoom(value, x = width / 2, y = height / 2) {
    const next = Math.max(.6, Math.min(12, value));
    if (!paused) { paused = true; updateMotion(); }
    const ratio = next / zoom;
    panX = x - width / 2 - (x - width / 2 - panX) * ratio;
    panY = y - height / 2 - (y - height / 2 - panY) * ratio;
    zoom = next; draw();
  }
  function showSkill(index, focusNode = true) {
    selected = index;
    const skill = skills[index];
    detail.replaceChildren(); detail.hidden = false;
    const close = element('button', 'Close details'); close.type = 'button';
    close.addEventListener('click', () => { selected = null; detail.hidden = true; updateMotion(); draw(); });
    detail.append(element('h3', skill.name), element('p', skill.source, 'note'));
    const list = element('dl');
    for (const [label, value] of [['Static score', `${skill.score}/100 · ${labels[skill.risk]}`],
      ['Files checked', format(skill.files)], ['Findings', format(skill.findings)],
      ['File coverage', skill.coverage], ['Behavioral decision', 'Unknown · container test not run']]) {
      const row = element('div'); row.append(element('dt', label), element('dd', value)); list.append(row);
    }
    detail.append(list);
    const rules = Object.entries(skill.rules);
    detail.append(element('h4', 'Patterns found'));
    if (rules.length) {
      const findings = element('ul');
      for (const [rule, count] of rules) findings.append(element('li', `${rule.replaceAll('-', ' ').replaceAll('_', ' ')} · ${count}`));
      detail.append(findings);
    } else detail.append(element('p', 'No static rule matches in the files checked.'));
    try {
      const url = new URL(skill.url);
      if (url.protocol === 'https:' && ['skills.sh', 'www.skills.sh'].includes(url.hostname)) {
        const link = element('a', 'View skill on skills.sh'); link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; detail.append(link);
      }
    } catch { /* Invalid source URLs are omitted. */ }
    detail.append(close);
    if (focusNode) {
      filter = null;
      syncFilters();
    }
    if (focusNode && zoom >= 2.5) {
      panX = 0;
      panY = 0;
      const group = groups.find(item => item.members.includes(index));
      const member = group.members.indexOf(index);
      const point = project(group.x + Math.cos(member * 2.4) * .055 * member,
        group.y + Math.sin(member * 2.4) * .055 * member, group.z);
      panX = width / 2 - point.x; panY = height / 2 - point.y;
    }
    help.textContent = `${skill.name} selected. Close details or resume motion to keep exploring.`;
    updateMotion(); draw();
  }
  function choices(indices, message) {
    results.replaceChildren(); help.textContent = message;
    indices.forEach(index => {
      const skill = skills[index];
      const button = element('button', `${skill.name} · ${skill.source}`);
      button.type = 'button'; button.style.setProperty('--skill-color', colors[skill.risk]);
      button.addEventListener('click', () => showSkill(index)); results.append(button);
    });
  }
  function syncFilters() {
    document.querySelectorAll('[data-risk]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.risk === filter)));
    const count = filter ? skills.filter(skill => skill.risk === filter).length : skills.length;
    status.textContent = `${filter ? labels[filter] : 'All'} ${format(count)} entries`;
  }
  async function load() {
    if (loading || loaded) return;
    loading = true; help.replaceChildren(element('span', 'Loading audited skills…'));
    try {
      const response = await fetch('data/mesh-skills.json');
      if (!response.ok) throw new Error('Data unavailable');
      const data = await response.json();
      if (data.version !== 1 || !Array.isArray(data.rows) || !data.rows.length) throw new Error('Invalid catalog');
      skills = data.rows.map(row => ({
        name: row[0], source: data.sources[row[1]], score: row[2], files: row[3],
        findings: row[4], coverage: row[5] ? 'partial' : 'complete',
        risk: row[2] === 0 ? 'clean' : row[2] < 25 ? 'low' : row[2] < 50 ? 'elevated' : 'high',
        rules: Object.fromEntries(row[6].map(([id, count]) => [data.ruleNames[id], count])),
        url: `https://skills.sh/${data.sources[row[1]]}/${encodeURIComponent(row[0])}`,
      }));
      let seed = 19;
      const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const hubs = [[-1.2, -.45, .3], [.9, -.5, -.4], [-1, .65, -.3], [1.1, .6, .5]];
      const size = Math.max(1, Math.ceil(skills.length / 2200));
      Object.keys(colors).forEach(risk => {
        const indices = skills.flatMap((skill, index) => skill.risk === risk ? [index] : []);
        for (let i = 0; i < indices.length; i += size) {
          const hub = hubs[Math.floor(random() * hubs.length)];
          groups.push({ risk, hub, x: hub[0] + (random() - .5) * 1.8,
            y: hub[1] + (random() - .5) * 1.5, z: hub[2] + (random() - .5) * 1.4,
            members: indices.slice(i, i + size) });
        }
      });
      // Mix risk categories before spatial thinning, so no category takes priority.
      for (let i = groups.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [groups[i], groups[j]] = [groups[j], groups[i]];
      }
      loaded = true; mesh.classList.add('mesh-ready'); search.disabled = false;
      help.textContent = `Search ${format(skills.length)} scanned entries, or zoom in and select a node. At overview, each node groups up to ${size} entries.`;
      syncFilters(); draw(); updateMotion();
    } catch {
      help.textContent = 'The skill data could not load. ';
      const retry = element('button', 'Retry'); retry.type = 'button'; retry.addEventListener('click', load); help.append(retry);
    } finally { loading = false; }
  }
  workspace.querySelectorAll('[data-mesh-zoom]').forEach(button => button.addEventListener('click', () => setZoom(zoom * (button.dataset.meshZoom === 'in' ? 1.5 : 1 / 1.5))));
  workspace.querySelector('[data-mesh-reset]').addEventListener('click', () => {
    zoom = 1; panX = panY = 0; selected = null; filter = null; detail.hidden = true;
    results.replaceChildren(); search.value = ''; help.textContent = 'Search by skill name or repository, or select a node.'; syncFilters(); updateMotion(); draw();
  });
  motion.addEventListener('click', () => {
    if (selected !== null) { selected = null; detail.hidden = true; paused = false; }
    else paused = !paused;
    updateMotion(); draw();
  });
  document.querySelectorAll('[data-risk]').forEach(button => button.addEventListener('click', () => {
    filter = filter === button.dataset.risk ? null : button.dataset.risk;
    syncFilters(); draw();
  }));
  search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const query = search.value.trim().toLowerCase();
      if (!query) { results.replaceChildren(); help.textContent = 'Search by skill name or repository.'; return; }
      const matches = [];
      for (let i = 0; i < skills.length && matches.length < 21; i++) {
        if (`${skills[i].name} ${skills[i].source}`.toLowerCase().includes(query)) matches.push(i);
      }
      choices(matches.slice(0, 20), matches.length > 20 ? 'Showing 20 matches. Refine your search for more.' : `${matches.length} matching entries.`);
    }, 150);
  });
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    canvas.focus({ preventScroll: true });
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    canvas.setPointerCapture(event.pointerId); schedule();
  });
  canvas.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
    panX += dx; panY += dy; drag.x = event.clientX; drag.y = event.clientY; draw();
  });
  canvas.addEventListener('pointerup', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const moved = drag.moved; drag = null;
    if (!moved) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      let best = null, distance = 14 * 14;
      for (const hit of hits) {
        const d = (hit.x - x) ** 2 + (hit.y - y) ** 2;
        if (d < distance) { best = hit; distance = d; }
      }
      if (best) {
        if (best.index !== null) showSkill(best.index, false);
        else { paused = true; updateMotion(); choices(best.group.members, 'Select a skill in this group to view its audit.'); }
      }
    }
    schedule();
  });
  canvas.addEventListener('pointercancel', () => { drag = null; schedule(); });
  canvas.addEventListener('wheel', event => {
    if (document.activeElement !== canvas && !event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    setZoom(zoom * Math.exp(-event.deltaY * .002), event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });
  canvas.addEventListener('keydown', event => {
    if (['+', '=', '-', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape'].includes(event.key)) event.preventDefault();
    if (event.key === '+' || event.key === '=') setZoom(zoom * 1.5);
    if (event.key === '-') setZoom(zoom / 1.5);
    const offsets = { ArrowLeft: [40, 0], ArrowRight: [-40, 0], ArrowUp: [0, 40], ArrowDown: [0, -40] };
    if (offsets[event.key]) { panX += offsets[event.key][0]; panY += offsets[event.key][1]; draw(); }
    if (event.key === 'Escape') { selected = null; detail.hidden = true; updateMotion(); draw(); }
  });
  new ResizeObserver(() => {
    width = mesh.clientWidth; height = mesh.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
  }).observe(mesh);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; lastTime = 0; schedule();
  }).observe(mesh);
  const lazy = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { load(); lazy.disconnect(); }
  }, { rootMargin: '200px' });
  lazy.observe(mesh);
  document.addEventListener('visibilitychange', () => { lastTime = 0; schedule(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; updateMotion(); });
})();
