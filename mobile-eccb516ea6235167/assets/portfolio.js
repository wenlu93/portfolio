
  // bind iframe demos + performance hints
  (function(){
    var r = (window.__resources)||{};
    var d = document.getElementById('deals-frame');
    var p = document.getElementById('portal-frame');
    var p2 = document.getElementById('portal-frame-2');

    // Embedded demos use bundled resources; external buttons always point to GitHub Pages.
    var dealsUrl = r.dealsDemo || 'demos/deals.html';
    var portalUrl = r.portalDemo || 'demos/campaign.html';
    var dealsExternal = '/deals-channel/mobile-b1d88d1576facbd6/';
    var portalExternal = '/campaign-info-portal/mobile-060d92f95c52ce29/';
    var narrowScreen = !!(window.matchMedia && window.matchMedia('(max-width: 700px)').matches);

    // Start the four below-the-fold Project 1 images early on phones only.
    // Versioned URLs avoid stale Safari/CDN cache entries; desktop keeps its original lazy behavior.
    if (narrowScreen) {
      document.querySelectorAll('#project-1 .kb-shot img[loading="lazy"]').forEach(function(img){
        img.loading = 'eager';
        img.decoding = 'async';
        try { img.fetchPriority = 'high'; } catch(e) {}
      });
    }

    function markLoaded(frameEl) {
      var wrap = frameEl && (frameEl.closest('.device-wrap') || frameEl.closest('.frame'));
      if (wrap) wrap.classList.remove('is-loading');
    }

    // Do not keep the demo hidden until every remote image finishes.
    // The embedded pages are same-origin, so reveal them as soon as their usable UI exists.
    function watchRenderReady(frameEl, isReady, onReady) {
      var stopped = false;
      var attempts = 0;

      function check() {
        if (stopped || !frameEl) return;
        try {
          var doc = frameEl.contentDocument;
          var win = frameEl.contentWindow;
          if (doc && isReady(doc, win)) {
            stopped = true;
            markLoaded(frameEl);
            if (onReady) onReady(doc, win);
            return;
          }
        } catch(e) {}

        attempts += 1;
        if (attempts < 300) setTimeout(check, 50);
      }

      setTimeout(check, 0);
    }

    function tuneDealImages() {
      // Same-origin bundled iframe can usually be accessed; if not, fail silently.
      if (!d || !d.contentDocument) return;
      try {
        var imgs = d.contentDocument.querySelectorAll('img');
        imgs.forEach(function(img){
          img.loading = 'eager';
          img.decoding = 'async';
          try { img.fetchPriority = 'high'; } catch(e) {}
          if (img.decode) img.decode().catch(function(){});
        });
      } catch(e) {}
    }

    function tuneDealImagesForAWhile() {
      var count = 0;
      var timer = setInterval(function(){
        tuneDealImages();
        count += 1;
        if (count >= 14) clearInterval(timer);
      }, 320);
    }

    function loadDeals(){
      if (!d || d.dataset.loaded === '1') return;
      d.dataset.loaded = '1';
      d.setAttribute('loading', 'eager');
      d.addEventListener('load', function(){
        markLoaded(d);
        tuneDealImagesForAWhile();
      }, { once:true });
      d.src = dealsUrl;
      watchRenderReady(d, function(doc){
        var root = doc.querySelector('#root');
        return !!(root && root.firstElementChild);
      }, tuneDealImagesForAWhile);
    }

    // The C-end demo is Project 3; start it shortly before the section is visible.
    if (d) {
      if (location.hash === '#project-3') {
        loadDeals();
      } else if ('IntersectionObserver' in window) {
        var project3 = document.getElementById('project-3') || d;
        var ioDeals = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if (entry.isIntersecting) {
              loadDeals();
              ioDeals.disconnect();
            }
          });
        }, { rootMargin: narrowScreen ? '2200px 0px' : '1200px 0px' });
        ioDeals.observe(project3);
      } else {
        setTimeout(loadDeals, narrowScreen ? 8000 : 2600);
      }

      var dealsNav = document.querySelector('a.navlink[href="#project-3"]');
      if (dealsNav) {
        ['pointerenter','focus','touchstart'].forEach(function(evt){
          dealsNav.addEventListener(evt, loadDeals, { once:true, passive:true });
        });
      }
    }

    function loadPortal2(){
      if (p2 && p2.dataset.loaded !== '1') {
        p2.dataset.loaded = '1';
        p2.addEventListener('load', function(){
          markLoaded(p2);
          scalePortal2();
          function forceCampaignList(){
            try {
              if (p2.contentWindow && typeof p2.contentWindow.switchPage === 'function') {
                p2.contentWindow.switchPage('list');
              }
            } catch(e) {}
          }
          [120, 500, 1200, 2500, 4500, 7000].forEach(function(delay){
            setTimeout(forceCampaignList, delay);
          });
        }, { once:true });
        p2.setAttribute('loading', 'eager');
        try { p2.fetchPriority = 'high'; } catch(e) {}
        p2.src = portalUrl + '#list';
        watchRenderReady(p2, function(doc, win){
          if (win && typeof win.switchPage === 'function') win.switchPage('list');
          var page = doc.querySelector('#page-list');
          return !!(page && page.classList.contains('active'));
        }, scalePortal2);
      }
    }

    function loadPortal(){
      if (!p || p.dataset.loaded === '1') return;
      p.dataset.loaded = '1';
      p.addEventListener('load', function(){
        markLoaded(p);
        if (narrowScreen) setTimeout(loadPortal2, 0);
      }, { once:true });
      p.setAttribute('loading', 'eager');
      try { p.fetchPriority = 'high'; } catch(e) {}
      p.src = portalUrl;
      watchRenderReady(p, function(doc){
        return !!doc.querySelector('#page-digest');
      }, function(){
        if (narrowScreen) loadPortal2();
      });
      if (!narrowScreen) loadPortal2();
    }

    // The B-end portal is Project 2; load it when close to the viewport.
    if (p) {
      if ('IntersectionObserver' in window) {
        var project2 = document.getElementById('project-2') || p;
        var ioPortal = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if (entry.isIntersecting) {
              loadPortal();
              ioPortal.disconnect();
            }
          });
        }, { rootMargin: narrowScreen ? '2200px 0px' : '900px 0px' });
        ioPortal.observe(project2);
      } else {
        setTimeout(loadPortal, 2600);
      }
    }

    function scalePortal2(){
      if (!p2) return;
      var holder = p2.parentElement;
      if (!holder || !holder.clientWidth) return;
      var scale = holder.clientWidth / 1440;
      p2.style.transform = 'scale(' + scale + ')';
      holder.style.height = (832 * scale) + 'px';
    }
    if (p2) {
      scalePortal2();
      window.addEventListener('resize', scalePortal2);
      setTimeout(scalePortal2, 300);
      setTimeout(scalePortal2, 1500);
    }

    var dealsOpen = document.querySelector('#project-3 .demo-open-row a.btn.primary');
    var portalOpen = document.querySelector('#project-2 .btns a.btn.primary');
    if (dealsOpen) dealsOpen.href = dealsExternal;
    if (portalOpen) portalOpen.href = portalExternal;

    function addHint(rel, href, asValue) {
      if (!href || document.querySelector('link[rel="' + rel + '"][href="' + href + '"]')) return;
      var link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (asValue) link.as = asValue;
      document.head.appendChild(link);
    }

    function prefetchDemo(url) {
      addHint('prefetch', url, 'document');
    }

    function warmExternal(url) {
      // Background fetches below already warm the destination without a second DOM/JS context.
      return;
    }

    // Prefetch only after the initial page and critical resources have settled.
    function prefetchExternalDemosLater(){
      var idle = window.requestIdleCallback || function(cb){ return setTimeout(cb, 1600); };
      idle(function(){
        prefetchDemo(dealsExternal);
        prefetchDemo(portalExternal);
      }, { timeout: 4000 });
    }
    if (document.readyState === 'complete') {
      setTimeout(prefetchExternalDemosLater, 6000);
    } else {
      window.addEventListener('load', function(){
        setTimeout(prefetchExternalDemosLater, 6000);
      }, { once:true });
    }

    [dealsOpen, portalOpen].forEach(function(a){
      if (!a) return;
      var url = a.href;
      ['pointerenter','focus','touchstart'].forEach(function(evt){
        a.addEventListener(evt, function(){ warmExternal(url); }, { once:true, passive:true });
      });
    });
  })();

;

// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever you want the user to
 * supply an image. You control the slot's shape and size; the user fills it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The host bridge only allows sidecar writes at the project root, so the
 * HTML that uses this component is assumed to live at the project root too
 * (same constraint as design_canvas.jsx).
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *                With cover (the default) double-clicking the filled slot
 *                enters a reframe mode: the whole image spills past the mask
 *                (translucent outside, opaque inside), drag to reposition,
 *                corner-drag to scale. The crop persists alongside the image
 *                in the sidecar. contain/fill stay static.
 *   position     object-position for fit=contain|fill.     (default '50% 50%')
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. A user drop overrides
 *                it; clearing the drop reveals src again.
 *
 * Size and layout come from ordinary CSS on the element — width/height
 * inline or from a parent grid — so it composes with any layout.
 *
 * Usage:
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;

  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        // Merge: sidecar loses to any in-memory change that raced ahead of
        // the fetch (drop or clear) so neither is clobbered by hydration.
        if (j && typeof j === 'object') {
          const merged = Object.assign({}, j, slots);
          // A framing-only write that raced ahead of hydration must not
          // drop a user image that's only on disk — inherit u from the
          // sidecar for any in-memory entry that lacks one.
          for (const k in slots) {
            if (merged[k] && !merged[k].u && j[k]) {
              merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
            }
          }
          for (const id of tombstones) delete merged[id];
          slots = merged;
        }
        tombstones.clear();
      })
      .catch(() => {})
      .then(() => { loaded = true; subs.forEach((fn) => fn()); });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  function save() {
    if (saving) { saveDirty = true; return; }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots)))
      .catch(() => {})
      .then(() => { saving = false; if (saveDirty) { saveDirty = false; save(); } });
  }

  const S_MAX = 5;
  const clampS = (s) => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? { u: v, s: 1, x: 0, y: 0 } : v;
  }

  function setSlot(id, val) {
    if (!id) return;
    if (val) { slots[id] = val; tombstones.delete(id); }
    else { delete slots[id]; if (!loaded) tombstones.add(id); }
    subs.forEach((fn) => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save(); else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
    ':host{display:inline-block;position:relative;vertical-align:top;' +
    '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);width:240px;height:160px}' +
    '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
    // .frame img (clipped) and .spill (unclipped ghost + handles) share the
    // same left/top/width/height in frame-%, computed by _applyView(), so the
    // inside-mask crop and the outside-mask spill stay pixel-aligned.
    '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' +
    '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
    // Reframe mode (double-click): the full image spills past the mask. The
    // spill layer is sized to the IMAGE bounds so its corners are where the
    // resize handles belong. The ghost <img> inside is translucent; the real
    // clipped <img> underneath shows the opaque in-mask crop.
    '.spill{position:absolute;transform:translate(-50%,-50%);display:none;z-index:1;' +
    '  cursor:grab;touch-action:none}' +
    ':host([data-panning]) .spill{cursor:grabbing}' +
    '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' +
    '  pointer-events:none;-webkit-user-drag:none;user-select:none;' +
    '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' +
    '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' +
    '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' +
    '  transform:translate(-50%,-50%)}' +
    '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' +
    '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' +
    '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' +
    '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' +
    ':host([data-reframe]){z-index:10}' +
    ':host([data-reframe]) .spill{display:block}' +
    ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' +
    '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' +
    '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' +
    '  cursor:pointer;user-select:none}' +
    '.empty svg{opacity:.45}' +
    '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' +
    '.empty .sub{font-size:11px}' +
    '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' +
    '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' +
    ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' +
    '  background:rgba(201,100,66,.10)}' +
    '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' +
    '  transition:border-color .12s}' +
    ':host([data-over]) .ring{border-color:#c96442}' +
    ':host([data-filled]) .ring{display:none}' +
    // Controls sit BELOW the mask (top:100%), absolutely positioned so the
    // author-declared slot height is unaffected. The gap is padding, not a
    // top offset, so the hover target stays contiguous with the frame.
    '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;' +
    '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' +
    '  white-space:nowrap}' +
    ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' +
    '  {opacity:1;pointer-events:auto}' +
    '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' +
    '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' +
    '  backdrop-filter:blur(6px)}' +
    '.ctl button:hover{background:rgba(0,0,0,.8)}' +
    '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' +
    '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}';

  const icon =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' +
    '<path d="m21 15-5-5L5 21"/></svg>';

  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'position', 'placeholder', 'src', 'id'];
    }

    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML =
        '' +
        '<div class="frame" part="frame">' +
        '  <img part="image" alt="" draggable="false" style="display:none">' +
        '  <div class="empty" part="empty">' + icon +
        '    <div class="cap"></div>' +
        '    <div class="sub">or <u>browse files</u></div></div>' +
        '  <div class="ring" part="ring"></div>' +
        '</div>' +
        '<div class="spill">' +
        '  <img class="ghost" alt="" draggable="false">' +
        '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' +
        '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' +
        '</div>' +
        '<div class="ctl"><button data-act="replace" title="Replace image">Replace</button>' +
        '  <button data-act="clear" title="Remove image">Remove</button></div>' +
        '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      this._view = { s: 1, x: 0, y: 0 };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', (e) => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') { this._exitReframe(true); this._input.click(); }
        if (act === 'clear') {
          this._exitReframe(false);
          this._gen++;
          this._local = null;
          if (this.id) setSlot(this.id, null); else this._render();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      this._img.addEventListener('load', () => this._applyView());
      // Gated on editable + fit=cover so share links and contain/fill slots
      // stay static.
      this.addEventListener('dblclick', (e) => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);
        else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1, fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1, ih = this._img.naturalHeight || 1;
          const base = Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0, h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2, oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0, uy = sy * h0 / diag0;
          move = (ev) => {
            const proj = (ev.clientX - rect.left - ox) * ux +
                         (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = { px: e.clientX, py: e.clientY, x: this._view.x, y: this._view.y };
          move = (ev) => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try { this._spill.releasePointerCapture(e.pointerId); } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', (e) => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, { passive: false });
    }

    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }

    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      this._exitReframe(false);
    }

    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = (e) => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = (e) => { if (e.key === 'Escape') this._exitReframe(true); };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }

    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (commit) this._commitView();
    }

    attributeChangedCallback() { if (this.shadowRoot) this._render(); }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) { this._depth = 0; this.removeAttribute('data-over'); }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }

    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        const val = { u: url, s: 1, x: 0, y: 0 };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) { this._local = val; this._render(); }
      } catch (err) {
        if (gen !== this._gen) return;
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }

    _setError(msg) {
      if (this._err) { this._err.remove(); this._err = null; }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err'; d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => { if (this._err === d) { d.remove(); this._err = null; } }, 3000);
    }

    // Reframing (pan/resize) is only meaningful for fit=cover — contain/fill
    // keep the old object-fit path and double-click is a no-op.
    _reframes() {
      return this.hasAttribute('data-filled') &&
        (this.getAttribute('fit') || 'cover') === 'cover';
    }

    // Cover-baseline geometry, shared by clamp/apply/resize. Null until the
    // img has loaded (naturalWidth is 0 before that) or when the slot has no
    // layout box — ResizeObserver fires with a 0×0 rect under display:none,
    // and clamping against a degenerate 1×1 frame would silently pull the
    // stored pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth, ih = this._img.naturalHeight;
      const fw = this.clientWidth, fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      return { iw, ih, fw, fh, base: Math.max(fw / iw, fh / ih) };
    }

    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }

    _applyView() {
      const g = this._geom();
      const fit = this.getAttribute('fit') || 'cover';
      if (fit !== 'cover' || !g) {
        // Non-cover, or dimensions not known yet (before img load).
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = fit;
        this._img.style.objectPosition = this.getAttribute('position') || '50% 50%';
        return;
      }
      // Cover baseline: img fills the frame on its tighter axis at s=1, so
      // pan works immediately on the overflowing axis without zooming first.
      // Width/height and left/top are all frame-% — depends only on the
      // frame aspect ratio, so a responsive resize keeps the same crop. The
      // spill layer mirrors the same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = (g.iw * k / g.fw * 100) + '%';
      const h = (g.ih * k / g.fh * 100) + '%';
      const l = (50 + this._view.x) + '%';
      const t = (50 + this._view.y) + '%';
      this._img.style.width = w; this._img.style.height = h;
      this._img.style.left = l; this._img.style.top = t;
      this._img.style.objectFit = '';
      this._spill.style.width = w; this._spill.style.height = h;
      this._spill.style.left = l; this._spill.style.top = t;
    }

    _commitView() {
      const v = { s: this._view.s, x: this._view.x, y: this._view.y };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);
      else { this._local = v; }
    }

    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';
      else if (shape === 'pill') radius = '9999px';
      else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = (stored && stored.u) || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0,
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      if (url) {
        if (this._img.getAttribute('src') !== url) {
          this._img.src = url;
          this._ghost.src = url;
        }
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }

  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();


;

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  // scrollspy: highlight active project in top nav
  const navLinks = [...document.querySelectorAll('.topnav .navlink')];
  navLinks.forEach(function(a){
    a.addEventListener('click', function(){
      navLinks.forEach(function(x){ x.classList.toggle('active', x === a); });
    });
  });

;

/* ============================================================
   deals demo console + device stage  /  B端 portal scaling
   ============================================================ */
(function () {
  const frame = document.getElementById("deals-frame");
  const consoleEl = document.getElementById("deals-console");
  let latestDetail = null;

  function send(cmd, payload) {
    if (!frame || !frame.contentWindow) return;
    try { frame.contentWindow.postMessage(Object.assign({ type: "deals:cmd", cmd }, payload || {}), "*"); } catch (e) {}
  }

  function setActive(detail) {
    if (!detail || !consoleEl) return;
    latestDetail = detail;
    const map = { identity: detail.identity, state: detail.state, tier: detail.tier, channel: detail.channel || "natural" };
    consoleEl.querySelectorAll(".con-chip").forEach((b) => {
      const g = b.getAttribute("data-grp");
      const v = b.getAttribute("data-val");
      b.classList.toggle("on", String(map[g]) === v);
    });
    consoleEl.querySelectorAll(".scene-row").forEach((r) => {
      r.classList.toggle("on", !!detail.activeScene && r.getAttribute("data-scene") === detail.activeScene);
    });
  }

  function wireConsole() {
    if (!consoleEl) return;
    consoleEl.querySelectorAll(".con-chip").forEach((b) => {
      b.addEventListener("click", () => {
        const g = b.getAttribute("data-grp");
        const v = b.getAttribute("data-val");
        if (g === "channel") {
          const kind = v === "natural" ? null : v;
          send("setChannel", { kind });
          setActive(Object.assign({}, latestDetail || {}, { channel: kind }));
        } else if (g === "identity") {
          send("setCtx", { patch: { identity: v } });
          setActive(Object.assign({}, latestDetail || {}, { identity: v }));
        } else if (g === "tier") {
          send("setCtx", { patch: { tier: v } });
          setActive(Object.assign({}, latestDetail || {}, { tier: v }));
        } else if (g === "state") {
          const patch = { state: v };
          if (v === "S1") patch.city = null;
          send("setCtx", { patch });
          setActive(Object.assign({}, latestDetail || {}, patch));
        }
      });
    });
    consoleEl.querySelectorAll(".scene-row").forEach((r) => {
      r.addEventListener("click", () => {
        const no = r.getAttribute("data-scene");
        send("playScene", { no });
        setActive(Object.assign({}, latestDetail || {}, { activeScene: no }));
      });
    });
    const resetBtn = consoleEl.querySelector(".con-reset");
    if (resetBtn) resetBtn.addEventListener("click", () => {
      send("reset");
      setActive({ channel: null, identity: "solo", state: "S1", tier: "value", activeScene: null });
    });
  }

  function pingDemo() {
    for (let i = 0; i < 36; i++) setTimeout(() => send("hello"), 160 * i);
  }

  function scaleDeals() {
    if (!frame) return;
    const holder = frame.parentElement;
    const baseW = 460, baseH = 890;
    const targetH = consoleEl ? consoleEl.getBoundingClientRect().height : baseH;
    const scale = Math.min(targetH / baseH, 1);
    frame.style.width = baseW + "px";
    frame.style.height = baseH + "px";
    frame.style.transformOrigin = "top left";
    frame.style.transform = "scale(" + scale + ")";
    holder.style.height = (baseH * scale) + "px";
    holder.style.width = (baseW * scale) + "px";
  }

  if (frame) {
    wireConsole();
    setActive({ channel: null, identity: "solo", state: "S1", tier: "value", activeScene: null });
    scaleDeals();
    window.addEventListener("resize", scaleDeals);
    window.addEventListener("message", (event) => {
      if (frame.contentWindow && event.source !== frame.contentWindow) return;
      const data = event.data || {};
      if (data.type === "deals:ctx") setActive(data.detail);
    });
    frame.addEventListener("load", () => { scaleDeals(); pingDemo(); });
    setTimeout(function(){ scaleDeals(); pingDemo(); }, 600);
  }

  const portal = document.getElementById("portal-frame");
  function scalePortal() {
    if (!portal) return;
    const holder = portal.parentElement;
    const baseW = 1440, baseH = 832;
    const scale = holder.clientWidth / baseW;
    portal.style.transform = "scale(" + scale + ")";
    holder.style.height = (baseH * scale) + "px";
  }
  if (portal) {
    scalePortal();
    window.addEventListener("resize", scalePortal);
    portal.addEventListener("load", scalePortal);
    setTimeout(scalePortal, 300);
  }
})();


;

  // project-1 gallery lightbox
  (function(){
    var lb = document.getElementById('kb-lightbox');
    if (!lb) return;
    var im = lb.querySelector('img'), cp = lb.querySelector('figcaption');
    document.querySelectorAll('.kb-shot').forEach(function(f){
      f.addEventListener('click', function(){
        var img = f.querySelector('img');
        im.src = img.currentSrc || img.src; im.alt = img.alt;
        cp.textContent = f.getAttribute('data-cap') || '';
        lb.classList.add('on');
        document.body.style.overflow = 'hidden';
      });
    });
    function close(){ lb.classList.remove('on'); document.body.style.overflow = ''; }
    lb.addEventListener('click', close);
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
  })();

;

(function () {
  const links = Array.from(document.querySelectorAll('.topnav .navlink'));
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!links.length || !sections.length) return;

  let scheduled = false;
  function updateActiveNav() {
    scheduled = false;
    const visualCenter = window.innerHeight * 0.5;
    let activeSection = null;
    let bestDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= visualCenter && rect.bottom >= visualCenter) {
        activeSection = section;
        bestDistance = -1;
        return;
      }
      if (bestDistance < 0) return;
      const distance = Math.min(Math.abs(rect.top - visualCenter), Math.abs(rect.bottom - visualCenter));
      if (distance < bestDistance) {
        bestDistance = distance;
        activeSection = section;
      }
    });

    links.forEach((link) => {
      link.classList.toggle('active', !!activeSection && link.getAttribute('href') === '#' + activeSection.id);
    });
  }

  function requestUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateActiveNav);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('load', requestUpdate);
  document.addEventListener('DOMContentLoaded', requestUpdate);
  requestUpdate();
})();

;

(function () {
  function syncProject1Shots() {
    const figures = Array.from(document.querySelectorAll('#project-1 .p1-shot-grid .kb-shot'));
    const frames = figures.map((figure) => figure.querySelector('.ph')).filter(Boolean);
    figures.forEach((figure) => {
      figure.style.width = '';
      figure.style.maxWidth = '';
      figure.style.minWidth = '';
    });
    frames.forEach((frame) => {
      frame.style.width = '';
      frame.style.height = '';
      frame.style.minHeight = '';
      frame.style.maxHeight = '';
    });

    if (window.innerWidth <= 980) return;
    const reference = document.querySelector('#project-1 .p1-path1-grid > .p1-shot-card:not(.p1-summary-card) .kb-shot .ph');
    if (!reference) return;
    const width = reference.getBoundingClientRect().width;
    if (!width) return;
    const height = width * 398 / 184;

    figures.forEach((figure) => {
      figure.style.width = width + 'px';
      figure.style.maxWidth = width + 'px';
      figure.style.minWidth = width + 'px';
    });
    frames.forEach((frame) => {
      frame.style.width = width + 'px';
      frame.style.height = height + 'px';
      frame.style.minHeight = height + 'px';
      frame.style.maxHeight = height + 'px';
    });
  }

  let resizeTimer;
  function scheduleSync() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncProject1Shots, 60);
  }
  window.addEventListener('load', syncProject1Shots);
  window.addEventListener('resize', scheduleSync);
  document.addEventListener('DOMContentLoaded', syncProject1Shots);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncProject1Shots);
  setTimeout(syncProject1Shots, 100);
  setTimeout(syncProject1Shots, 600);
})();

;

(function () {
  function resizeDealDemo() {
    var frame = document.getElementById('deals-frame');
    if (!frame) return;
    var device = frame.parentElement;
    var wrap = device && device.parentElement;
    if (!device || !wrap) return;
    var baseW = 460;
    var baseH = 890;
    var available = Math.min(baseW, Math.max(1, wrap.clientWidth));
    var scale = Math.min(1, available / baseW);
    frame.style.width = baseW + 'px';
    frame.style.height = baseH + 'px';
    frame.style.transformOrigin = 'top left';
    frame.style.transform = 'scale(' + scale + ')';
    device.style.width = (baseW * scale) + 'px';
    device.style.height = (baseH * scale) + 'px';
  }
  function initResponsiveDealDemo() {
    resizeDealDemo();
    requestAnimationFrame(resizeDealDemo);
    setTimeout(resizeDealDemo, 250);
    setTimeout(resizeDealDemo, 1200);
    window.addEventListener('resize', resizeDealDemo, { passive: true });
    var frame = document.getElementById('deals-frame');
    if (frame) frame.addEventListener('load', resizeDealDemo);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResponsiveDealDemo, { once: true });
  } else {
    initResponsiveDealDemo();
  }
})();

;
(function mobileFastResourceWarmup(){
  var projectImages = Array.from(document.querySelectorAll('#project-1 .kb-shot img'));
  function settled(img){
    if (img.complete) return Promise.resolve();
    return new Promise(function(resolve){
      img.addEventListener('load', resolve, { once:true });
      img.addEventListener('error', resolve, { once:true });
    });
  }
  function cacheOne(url){
    return fetch(url, { cache:'force-cache', credentials:'same-origin' })
      .then(function(response){ if (!response.ok) throw new Error(String(response.status)); return response.arrayBuffer(); })
      .catch(function(){});
  }
  function cacheGroup(urls){ return Promise.all(urls.map(cacheOne)); }
  Promise.all(projectImages.map(settled)).then(function(){
    var idle = window.requestIdleCallback || function(cb){ return setTimeout(cb, 250); };
    idle(function(){
      cacheGroup([
        'demos/campaign.html',
        'assets/campaign.css',
        'assets/campaign-demo.js',
        '/campaign-info-portal/mobile-060d92f95c52ce29/',
        '/campaign-info-portal/mobile-060d92f95c52ce29/assets/campaign.css',
        '/campaign-info-portal/mobile-060d92f95c52ce29/assets/campaign-site.js'
      ]).then(function(){
        setTimeout(function(){
          cacheGroup([
            'demos/deals.html',
            'assets/deals-demo.css',
            'assets/deals-demo.js',
            '/deals-channel/mobile-b1d88d1576facbd6/',
            '/deals-channel/mobile-b1d88d1576facbd6/assets/deals-site.css',
            '/deals-channel/mobile-b1d88d1576facbd6/assets/deals-site.js'
          ]);
        }, 600);
      });
    }, { timeout:1200 });
  });
})();
