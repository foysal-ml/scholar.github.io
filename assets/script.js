
(function(){
  const root = document.documentElement;
  // persisted settings
  const pref = {
    mode: localStorage.getItem('mode') || 'system',
    bg: localStorage.getItem('bg') || 'white',
    accent: localStorage.getItem('accent') || 'harvard'
  };
  applyMode(pref.mode);
  root.setAttribute('data-bg', pref.bg);
  root.setAttribute('data-accent', pref.accent);

  function applyMode(mode){
    if (mode === 'dark') { root.classList.add('dark'); }
    else if (mode === 'light') { root.classList.remove('dark'); }
    else { // system
      const q = window.matchMedia('(prefers-color-scheme: dark)');
      if (q.matches) root.classList.add('dark'); else root.classList.remove('dark');
      q.onchange = () => { if (pref.mode==='system'){ applyMode('system'); } };
    }
  }

  // timestamps
  const y = document.getElementById('year'), u = document.getElementById('lastUpdated');
  if (y) y.textContent = new Date().getFullYear();
  if (u) u.textContent = new Date().toISOString().slice(0,10);

  // active nav
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlink').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) a.classList.add('active');
  });

  // back to top
  const toTop = document.getElementById('toTop');
  if (toTop){
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) toTop.classList.add('show'); else toTop.classList.remove('show');
    });
    toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }

  // Command palette
  const palette = document.getElementById('commandPalette');
  const input = document.getElementById('cmdInput');
  const list  = document.getElementById('cmdList');
  const openCmd = document.getElementById('openCmd');
  const items = [
    {label:'Home', href:'index.html'},
    {label:'About', href:'about.html'},
    {label:'Stanford Fit', href:'stanford-fit.html'},
    {label:'Research', href:'research.html'},
    {label:'Publications', href:'publications.html'},
    {label:'Teaching', href:'teaching.html'},
    {label:'Awards', href:'awards.html'},
    {label:'News', href:'news.html'},
    {label:'Contact', href:'contact.html'}
  ];
  function openPalette(){ palette.classList.remove('hidden'); input.value=''; render(items); setTimeout(()=>input.focus(),10); }
  function closePalette(){ palette.classList.add('hidden'); }
  function render(arr){ list.innerHTML = arr.map(i=>`<li class="item" data-href="${i.href}"><span>${i.label}</span><span class="text-xs" style="color:var(--muted)">${i.href}</span></li>`).join(''); }
  function filter(){ const q = input.value.toLowerCase(); render(items.filter(i => i.label.toLowerCase().includes(q) || i.href.toLowerCase().includes(q))); }
  if (palette && input && list){
    openCmd && (openCmd.onclick = openPalette);
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); openPalette(); }
      if (e.key === 'Escape') closePalette();
    });
    palette.addEventListener('click', (e) => {
      if (e.target.matches('[data-cmd-close]')) closePalette();
      const li = e.target.closest('.item'); if (li && li.dataset.href) location.href = li.dataset.href;
    });
    input && input.addEventListener('input', filter);
  }

  // Settings panel
  const settings = document.getElementById('settingsPanel');
  const openSettings = document.getElementById('openSettings');
  openSettings && (openSettings.onclick = () => settings.classList.remove('hidden'));
  settings && settings.addEventListener('click', (e) => {
    if (e.target.matches('[data-settings-close]')) settings.classList.add('hidden');
    const m = e.target.closest('[data-mode]');
    if (m){ pref.mode = m.dataset.mode; localStorage.setItem('mode', pref.mode); applyMode(pref.mode); }
    const bg = e.target.closest('[data-bg]');
    if (bg){ pref.bg = bg.dataset.bg; localStorage.setItem('bg', pref.bg); root.setAttribute('data-bg', pref.bg); }
    const ac = e.target.closest('[data-accent]');
    if (ac){ pref.accent = ac.dataset.accent; localStorage.setItem('accent', pref.accent); root.setAttribute('data-accent', pref.accent); }
  });

  // Publications page logic
  const pubList  = document.getElementById('pubList');
  const pubCount = document.getElementById('pubCount');
  const pubYear  = document.getElementById('pubYear');
  const pubQuery = document.getElementById('pubQuery');
  if (pubList){
    fetch('assets/pubs.json').then(r=>r.json()).then(data => {
      const years = Array.from(new Set(data.map(d => d.year))).sort((a,b)=>b-a);
      if (pubYear){ pubYear.innerHTML = ['All', ...years].map(y => `<option value="${y}">${y}</option>`).join(''); }
      function apply(){
        const y = pubYear ? pubYear.value : 'All';
        const q = (pubQuery ? pubQuery.value : '').toLowerCase();
        const filtered = data.filter(d =>
          (y === 'All' || String(d.year) == String(y)) &&
          (!q || (d.title + ' ' + d.venue + ' ' + (d.topics||[]).join(' ')).toLowerCase().includes(q))
        );
        pubList.innerHTML = filtered.map(d => `
          <li class="p-4 border rounded-xl bg-[var(--surface)]">
            <div class="flex flex-wrap justify-between gap-2">
              <div>
                <div class="font-medium">${d.title}</div>
                <div style="color:var(--muted)">${d.venue} • ${d.year}</div>
                <div class="mt-1 flex flex-wrap gap-2">${(d.topics||[]).map(t=>`<span class="badge">${t}</span>`).join('')}</div>
              </div>
              <div class="flex items-center gap-2">
                ${d.doi ? `<a class="btn-subtle text-sm" href="${d.doi}">DOI</a>` : ''}
              </div>
            </div>
          </li>`).join('');
        if (pubCount) pubCount.textContent = filtered.length;
      }
      pubYear && pubYear.addEventListener('change', apply);
      pubQuery && pubQuery.addEventListener('input', apply);
      apply();
    });
  }
})();