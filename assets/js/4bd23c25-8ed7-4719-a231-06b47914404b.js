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
