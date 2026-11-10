window.ACTIVITY_EMBEDDED = {
  templates: {
    jumpingOx: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap");
    * { box-sizing: border-box; }
    html, body { margin: 0; height: 100%; }
    body { font-family: Nunito, "Segoe UI", sans-serif; background: #f1f5f9; color: #1e293b; }
    svg { display: block; flex-shrink: 0; }
    .shell { min-height: 100%; display: flex; align-items: center; justify-content: center; padding: 0; }
    .card { width: 100%; max-width: 42rem; background: #fff; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    .hdr { background: #2563eb; color: #fff; text-align: center; padding: 1.1rem 1rem; flex-shrink: 0; }
    .hdr h1 { margin: 0; font-size: 1.55rem; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: .45rem; }
    .hdr p { margin: .25rem 0 0; font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; opacity: .85; }
    #bookLabel { font-size: 12px; letter-spacing: .08em; opacity: 1; }
    .body { flex: 1; overflow: auto; display: flex; flex-direction: column; min-height: 0; }
    .pad { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.1rem; flex: 1; min-height: 0; }
    .row { display: flex; justify-content: space-between; align-items: center; gap: .5rem; }
    .unit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; flex: 1; }
    .unit-btn { text-align: left; border: 2px solid #f1f5f9; background: #fff; border-radius: 1rem; padding: .85rem; cursor: pointer; display: flex; gap: .7rem; align-items: flex-start; font: inherit; color: inherit; }
    .unit-btn.on { background: #eff6ff; border-color: #60a5fa; }
    .unit-btn .t { font-weight: 800; font-size: .95rem; }
    .unit-btn .d { font-size: 11px; color: #64748b; font-style: italic; line-height: 1.25; }
    .ghost { border: 0; background: #eff6ff; color: #2563eb; font-weight: 800; font-size: .8rem; border-radius: .6rem; padding: .35rem .7rem; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: .3rem; }
    .ghost.slate { background: #f1f5f9; color: #475569; }
    .start { width: 100%; border: 0; border-radius: 1rem; padding: 1.15rem; font: inherit; font-size: 1.25rem; font-weight: 900; cursor: pointer; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; gap: .6rem; box-shadow: 0 10px 18px rgba(37,99,235,.25); }
    .start:disabled { background: #e2e8f0; color: #94a3b8; cursor: default; box-shadow: none; }
    .hint { text-align: center; color: #a16207; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; text-decoration: underline; font-style: italic; margin: 0; }
    .tiny { font-size: 10px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; color: #94a3b8; }
    .exit { border: 0; background: #fef2f2; color: #ef4444; font-weight: 900; font-size: 11px; padding: .2rem .5rem; border-radius: .4rem; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: .25rem; }
    .bar { height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden; }
    .bar > div { height: 100%; background: #3b82f6; width: 0; transition: width .5s; }
    .reveal { width: 100%; height: 6.5rem; border: 0; border-radius: 1rem; background: #2563eb; color: #fff; font: inherit; font-size: 1.5rem; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .6rem; animation: pulse 2s ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .82; } }
    .banner { height: 6.5rem; border-radius: 1rem; border: 4px solid; display: flex; align-items: center; gap: .8rem; padding: .6rem .8rem; }
    .banner.warn { background: #fff7ed; border-color: #fb923c; }
    .banner.ok { background: #f0fdf4; border-color: #4ade80; }
    .banner h4 { margin: 0 0 .2rem; font-size: .8rem; text-transform: uppercase; letter-spacing: .02em; }
    .banner p { margin: 0; font-size: .8rem; font-weight: 700; color: #334155; }
    .pill { width: 2.2rem; height: 2.2rem; border-radius: 999px; display: grid; place-items: center; color: #fff; flex-shrink: 0; }
    .act { border: 0; border-radius: .75rem; padding: .7rem 1rem; font: inherit; font-weight: 900; cursor: pointer; color: #fff; white-space: nowrap; display: inline-flex; align-items: center; gap: .35rem; }
    .quote { flex: 1; min-height: 8rem; display: flex; align-items: center; justify-content: center; text-align: center; background: #f8fafc; border: 2px solid #f1f5f9; border-radius: 1.4rem; padding: 1rem; font-size: clamp(1.35rem, 4vw, 2.4rem); font-weight: 900; color: #334155; line-height: 1.2; }
    .floor { position: relative; height: 8.5rem; background: #f1f5f9; border: 2px solid #e2e8f0; border-radius: 1rem; overflow: hidden; flex-shrink: 0; }
    .pad-o, .pad-x { position: absolute; bottom: 0; width: 45%; height: 2.4rem; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 1.5rem; border-radius: 1rem 1rem 0 0; }
    .pad-o { left: .5rem; background: #22c55e; box-shadow: 0 4px 0 #15803d; }
    .pad-x { right: .5rem; background: #ef4444; box-shadow: 0 4px 0 #b91c1c; }
    .runner { position: absolute; bottom: 2.6rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; transition: left .5s, right .5s, transform .5s; font-size: 3.4rem; line-height: 1; }
    .runner.left { left: 22%; right: auto; transform: none; }
    .runner.right { right: 22%; left: auto; transform: none; }
    .runner.up { transform: translateX(-50%) translateY(-4rem) scale(1.2); }
    .runner.left.up, .runner.right.up { transform: translateY(-4rem) scale(1.25); }
    .shadow { width: 3rem; height: 8px; background: rgba(0,0,0,.1); border-radius: 99px; filter: blur(1px); }
    .result { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: .8rem; padding: 2rem; }
    .result h2 { margin: 0; font-size: 2.4rem; font-weight: 900; color: #1e3a8a; }
    .two { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; width: 100%; }
    .two button { border: 0; border-radius: 1rem; padding: 1.1rem; font: inherit; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .4rem; }
    .cfg-top { display: flex; align-items: center; gap: .7rem; border-bottom: 1px solid #e2e8f0; padding-bottom: .8rem; }
    .cfg-item { background: #f8fafc; border: 2px solid #f1f5f9; border-radius: 1.2rem; padding: 1rem; position: relative; }
    .cfg-item textarea, .cfg-item input, .cfg-item select { width: 100%; font: inherit; border: 2px solid #fff; border-radius: .7rem; padding: .45rem .55rem; background: #fff; }
    .ox { border: 0; border-radius: 999px; padding: .15rem .55rem; font-size: 10px; font-weight: 900; color: #fff; cursor: pointer; }
    .del { position: absolute; top: .7rem; right: .7rem; border: 0; background: transparent; color: #cbd5e1; cursor: pointer; }
    select.unit-sel { flex: 1; border: 2px solid #f1f5f9; background: #f8fafc; border-radius: .75rem; padding: .45rem .6rem; font: inherit; font-weight: 800; font-size: .85rem; }
    .add { border: 0; background: #22c55e; color: #fff; border-radius: .75rem; padding: .5rem; cursor: pointer; }
    @media (min-width: 640px) {
      .shell { padding: 1rem; }
      .card { height: 95vh; border-radius: 1.5rem; border: 4px solid #bfdbfe; box-shadow: 0 25px 50px rgba(15,23,42,.18); }
      .hdr { padding: 1.4rem 1rem; }
      .hdr h1 { font-size: 1.9rem; }
      .quote { font-size: 2.2rem; }
      .runner { font-size: 4.2rem; }
      .floor { height: 10rem; }
    }
    @media (max-width: 520px) { .unit-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="shell">
    <div class="card">
      <div class="hdr">
        <h1>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Jumping OX Review
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </h1>
        <p id="bookLabel"></p>
        <p id="modeLabel">Classroom Presentation Mode</p>
      </div>
      <div class="body" id="app"></div>
    </div>
  </div>
  <script>
    const GAME_TITLE = __TITLE_JSON__;
    const GAME_LEVEL = __LEVEL_JSON__;
    const GAME_BOOK = __BOOK_JSON__;
    const DOWNLOAD_NAME = __DOWNLOAD_NAME_JSON__;
    const initialUnitData = /*UNIT_DATA*/__UNIT_DATA__;
    let unitData = JSON.parse(JSON.stringify(initialUnitData));
    let gameState = "menu";
    let selected = [];
    let questions = [];
    let index = 0;
    let feedback = null;
    let jumpSide = null;
    let jumping = false;
    let editingId = Object.keys(unitData)[0];

    document.getElementById("bookLabel").textContent =
      [GAME_LEVEL, GAME_BOOK].filter(Boolean).join(" · ") || GAME_TITLE;

    const ICONS = {
      book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      gear: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
      checkSq: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
      square: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
      layers: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
      eye: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
      search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
      x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
      logout: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
      trophy: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 1 6 6v3.5c0 3.3-2.7 6-6 6s-6-2.7-6-6V8a6 6 0 0 1 6-6z"/></svg>',
      refresh: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>',
      chevron: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
      plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      trash: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
      down: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
      save: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>'
    };

    function ids() { return Object.keys(unitData); }
    function $(sel, root) { return (root || document).querySelector(sel); }
    function el(html) {
      const d = document.createElement("div");
      d.innerHTML = html.trim();
      return d.firstChild;
    }
    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
    function safeJson(obj) {
      return JSON.stringify(obj).replace(/</g, "\\\\u003c");
    }

    function render() {
      document.getElementById("modeLabel").textContent =
        gameState === "config" ? "Teacher Configuration Mode" : "Classroom Presentation Mode";
      const app = document.getElementById("app");
      app.innerHTML = "";
      if (gameState === "menu") app.appendChild(viewMenu());
      else if (gameState === "playing") app.appendChild(viewPlay());
      else if (gameState === "result") app.appendChild(viewResult());
      else app.appendChild(viewConfig());
    }

    function viewMenu() {
      const wrap = el('<div class="pad"></div>');
      wrap.innerHTML =
        '<div class="row"><h2 style="margin:0;font-size:1.15rem;color:#475569;display:flex;align-items:center;gap:.4rem">' +
        ICONS.book + " Select Units:</h2><div style=\\"display:flex;gap:.4rem\\">" +
        '<button type="button" class="ghost" id="allBtn"></button>' +
        '<button type="button" class="ghost slate" id="cfgBtn">' + ICONS.gear + " Config</button></div></div>" +
        '<div class="unit-grid" id="grid"></div>' +
        '<div><button type="button" class="start" id="startBtn"></button>' +
        '<p class="hint">Mix units to review the whole workbook!</p></div>';
      const grid = $("#grid", wrap);
      ids().forEach((id) => {
        const u = unitData[id];
        const on = selected.indexOf(id) >= 0;
        const b = el(
          '<button type="button" class="unit-btn' + (on ? " on" : "") + '">' +
          (on ? ICONS.checkSq : ICONS.square) +
          '<span><div class="t"></div><div class="d"></div></span></button>'
        );
        $(".t", b).textContent = u.title;
        $(".d", b).textContent = u.description || ((u.questions || []).length + " questions");
        b.addEventListener("click", () => {
          selected = on ? selected.filter((x) => x !== id) : selected.concat([id]);
          render();
        });
        grid.appendChild(b);
      });
      const all = ids();
      $("#allBtn", wrap).textContent = selected.length === all.length ? "Deselect All" : "Select All";
      $("#allBtn", wrap).addEventListener("click", () => {
        selected = selected.length === all.length ? [] : all.slice();
        render();
      });
      $("#cfgBtn", wrap).addEventListener("click", () => { gameState = "config"; render(); });
      const start = $("#startBtn", wrap);
      start.innerHTML = ICONS.layers + " START CLASS (" + selected.length + " UNITS)";
      start.disabled = selected.length === 0;
      start.addEventListener("click", startReview);
      return wrap;
    }

    function startReview() {
      if (!selected.length) return;
      let pool = [];
      selected.forEach((id) => { pool = pool.concat(unitData[id].questions || []); });
      questions = shuffle(pool);
      index = 0;
      feedback = null;
      jumpSide = null;
      jumping = false;
      gameState = "playing";
      render();
    }

    function viewPlay() {
      const q = questions[index];
      const wrap = el('<div class="pad" style="overflow:hidden"></div>');
      const pct = ((index + 1) / questions.length) * 100;
      wrap.innerHTML =
        '<div class="row tiny"><button type="button" class="exit" id="exitBtn">' + ICONS.logout + " Exit Game</button>" +
        "<div>Q " + (index + 1) + " / " + questions.length +
        ' &nbsp; <span style="background:#eff6ff;color:#2563eb;padding:.15rem .4rem;border-radius:.4rem;font-style:italic">Status: ' +
        (feedback ? "Revealed" : "Waiting...") + "</span></div></div>" +
        '<div class="bar"><div style="width:' + pct + '%"></div></div>' +
        '<div id="actionSlot"></div>' +
        '<div class="quote"></div>' +
        '<div class="floor"><div class="pad-o">O</div><div class="pad-x">X</div>' +
        '<div class="runner' + (jumpSide === "left" ? " left" : jumpSide === "right" ? " right" : "") +
        (jumping ? " up" : "") + '">🏃<div class="shadow"></div></div></div>';
      $(".quote", wrap).textContent = '"' + q.text + '"';
      $("#exitBtn", wrap).addEventListener("click", () => { gameState = "menu"; render(); });
      const slot = $("#actionSlot", wrap);
      if (!feedback) {
        const b = el('<button type="button" class="reveal">' + ICONS.eye + " REVEAL ANSWER</button>");
        b.addEventListener("click", reveal);
        slot.appendChild(b);
      } else if (feedback === "mistake") {
        slot.appendChild(el(
          '<div class="banner warn"><div class="pill" style="background:#f97316">' + ICONS.search + "</div>" +
          '<div style="flex:1"><h4 style="color:#9a3412">Mistake Spotted!</h4>' +
          "<p>Identify the mistake, then click 👉</p></div>" +
          '<button type="button" class="act" id="fixBtn" style="background:#ea580c">SHOW FIX ' + ICONS.arrow + "</button></div>"
        ));
        $("#fixBtn", slot).addEventListener("click", () => { feedback = "revealed"; render(); });
      } else {
        const ok = q.correct;
        slot.appendChild(el(
          '<div class="banner ok"><div class="pill" style="background:' + (ok ? "#22c55e" : "#ef4444") + '">' +
          (ok ? ICONS.check : ICONS.x) + "</div>" +
          "<div style=\\"flex:1\\"><h4 style=\\"color:" + (ok ? "#15803d" : "#b91c1c") + '">' +
          (ok ? "CORRECT (O)" : "INCORRECT (X)") + "</h4><p></p></div>" +
          '<button type="button" class="act" id="nextBtn" style="background:#1e293b">NEXT ' + ICONS.arrow + "</button></div>"
        ));
        $("p", slot).textContent = q.explanation || (ok ? "Good!" : "Fix the sentence.");
        $("#nextBtn", slot).addEventListener("click", nextQ);
      }
      return wrap;
    }

    function reveal() {
      if (jumping || feedback) return;
      const q = questions[index];
      jumpSide = q.correct ? "left" : "right";
      jumping = true;
      render();
      setTimeout(function () {
        jumping = false;
        feedback = q.correct ? "revealed" : "mistake";
        render();
      }, 600);
    }

    function nextQ() {
      feedback = null;
      jumpSide = null;
      if (index < questions.length - 1) { index += 1; gameState = "playing"; }
      else gameState = "result";
      render();
    }

    function viewResult() {
      const wrap = el('<div class="result"></div>');
      wrap.innerHTML =
        ICONS.trophy + "<h2>Great Work!</h2>" +
        '<p style="color:#64748b;font-weight:800;font-style:italic;font-size:1.15rem">"Class, you are grammar experts!"</p>' +
        '<div class="two"><button type="button" id="replay" style="background:#f1f5f9">' + ICONS.refresh + " REPLAY</button>" +
        '<button type="button" id="menu" style="background:#2563eb;color:#fff">MENU</button></div>';
      $("#replay", wrap).addEventListener("click", startReview);
      $("#menu", wrap).addEventListener("click", () => { gameState = "menu"; render(); });
      return wrap;
    }

    function viewConfig() {
      const wrap = el('<div class="pad"></div>');
      wrap.innerHTML =
        '<div class="cfg-top"><button type="button" class="ghost slate" id="back">' + ICONS.chevron + " Back</button>" +
        '<select class="unit-sel" id="unitSel"></select>' +
        '<button type="button" class="add" id="add">' + ICONS.plus + "</button></div>" +
        '<div id="list" style="flex:1;overflow:auto;display:flex;flex-direction:column;gap:1rem"></div>' +
        '<div class="two"><button type="button" id="exp" style="background:#1e293b;color:#fff">' + ICONS.down + " Export HTML</button>" +
        '<button type="button" id="save" style="background:#2563eb;color:#fff">' + ICONS.save + " Save & Exit</button></div>";
      const sel = $("#unitSel", wrap);
      ids().forEach((id) => {
        const o = document.createElement("option");
        o.value = id;
        o.textContent = unitData[id].title;
        if (id === editingId) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener("change", () => { editingId = sel.value; render(); });
      $("#back", wrap).addEventListener("click", () => { gameState = "menu"; render(); });
      $("#add", wrap).addEventListener("click", () => {
        unitData[editingId].questions.push({ text: "New sentence.", correct: true, explanation: "Fix it!" });
        render();
      });
      $("#save", wrap).addEventListener("click", () => { gameState = "menu"; render(); });
      $("#exp", wrap).addEventListener("click", exportHtml);
      const list = $("#list", wrap);
      (unitData[editingId].questions || []).forEach((q, i) => {
        const item = el('<div class="cfg-item"></div>');
        item.innerHTML =
          '<button type="button" class="del" data-i="' + i + '">' + ICONS.trash + "</button>" +
          '<div class="row" style="justify-content:flex-start;gap:.4rem">' +
          '<span class="tiny">Question #' + (i + 1) + "</span>" +
          '<button type="button" class="ox" data-toggle="' + i + '" style="background:' + (q.correct ? "#22c55e" : "#ef4444") + '">' +
          (q.correct ? "O" : "X") + "</button></div>" +
          '<label class="tiny">Sentence</label><textarea rows="2"></textarea>' +
          '<label class="tiny">Explanation</label><input type="text">';
        $("textarea", item).value = q.text;
        $("input", item).value = q.explanation || "";
        $("textarea", item).addEventListener("input", (e) => { q.text = e.target.value; });
        $("input", item).addEventListener("input", (e) => { q.explanation = e.target.value; });
        $(".ox", item).addEventListener("click", () => { q.correct = !q.correct; render(); });
        $(".del", item).addEventListener("click", () => {
          unitData[editingId].questions.splice(i, 1);
          render();
        });
        list.appendChild(item);
      });
      return wrap;
    }

    function exportHtml() {
      const html = document.documentElement.outerHTML.replace(
        /const initialUnitData = \\/\\*UNIT_DATA\\*\\/[\\s\\S]*?;/,
        "const initialUnitData = /*UNIT_DATA*/" + safeJson(unitData) + ";"
      );
      const blob = new Blob(["<!DOCTYPE html>\\n" + html], { type: "text/html" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = DOWNLOAD_NAME || [GAME_LEVEL, GAME_BOOK, "Jumping OX"].filter(Boolean).join(" - ") + ".html";
      a.click();
    }

    render();
  </script>
</body>
</html>
`,
    jeopardy: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>__TITLE__</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

  :root {
    --bg-main: #ffffff;
    --bg-panel: rgba(255, 255, 255, 0.9);
    --text-main: #0f172a;
    --accent-primary: #7b99d6; /* Write Now 3 Blue */
    --accent-hover: #5d7dbf;
    --accent-success: #10b981;
    --accent-danger: #ef4444;
    --gold: #fbbf24;
    --glass-border: rgba(0, 0, 0, 0.1);
    --text-muted: #64748b;
  }
  
  body {
    font-family: Inter, "Segoe UI", "Malgun Gothic", sans-serif;
    background: #f0f4f8; /* Soft blue-gray background */
    color: var(--text-main);
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    overflow-y: auto;
  }

  nav {
    width: 100%;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--glass-border);
    padding: 15px 0;
    display: flex;
    justify-content: center;
    gap: 15px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    z-index: 10;
  }

  button {
    padding: 12px 24px;
    font-size: 1.05em;
    font-family: Inter, "Segoe UI", "Malgun Gothic", sans-serif;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
    color: white;
    font-weight: 700;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }

  button:hover { 
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(123, 153, 214, 0.4);
  }
  
  button.active-mode { 
    background: linear-gradient(135deg, #10b981, #059669); 
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }

  #game-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }

  .main-title {
    font-size: 2.5em;
    font-weight: 900;
    margin: 0 0 10px 0;
    text-align: center;
    background: linear-gradient(to right, var(--accent-primary), #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.1));
  }

  canvas {
    background: transparent;
    width: 100%;
    max-width: 1200px;
    max-height: 55vh;
    object-fit: contain;
    cursor: pointer;
  }

  /* Scoreboard Styles */
  .scoreboard-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1200px;
    align-items: center;
    gap: 15px;
    margin-top: 15px;
    padding-bottom: 30px;
    z-index: 5;
  }

  .scoreboard-container {
    display: flex;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
  }

  .team-management {
    display: flex;
    gap: 15px;
  }

  .team-mgt-btn {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    color: #475569;
    padding: 8px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
    transition: all 0.2s;
  }

  .team-mgt-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .team-card {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    transition: transform 0.2s;
  }
  
  .team-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 25px rgba(0,0,0,0.08);
  }

  .team-name-input {
    font-size: 1.3em;
    font-weight: 900;
    text-align: center;
    border: none;
    background: transparent;
    color: var(--text-main);
    width: 100%;
    margin-bottom: 5px;
    border-bottom: 2px dashed rgba(0,0,0,0.15);
    padding-bottom: 5px;
    font-family: Inter, "Segoe UI", "Malgun Gothic", sans-serif;
  }

  .team-name-input:focus {
    outline: none;
    border-bottom: 2px solid var(--accent-primary);
  }

  .team-score-input {
    font-size: 3em;
    font-weight: 900;
    color: var(--accent-primary);
    margin-bottom: 10px;
    text-align: center;
    border: none;
    background: transparent;
    width: 100%;
    font-family: Inter, "Segoe UI", "Malgun Gothic", sans-serif;
    -moz-appearance: textfield; 
  }

  .team-score-input::-webkit-outer-spin-button,
  .team-score-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .team-score-input:focus {
    outline: none;
    border-bottom: 2px dashed rgba(123, 153, 214, 0.4);
  }

  .score-controls {
    display: flex;
    gap: 10px;
  }

  .score-btn {
    padding: 8px 16px;
    font-size: 1.1em;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 900;
    box-shadow: none;
    transition: all 0.1s;
  }

  .score-btn:hover { transform: scale(1.05); }
  .score-btn:active { transform: scale(0.95); }
  .score-btn.minus { background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; }
  .score-btn.plus { background: #d1fae5; color: #10b981; border: 1px solid #6ee7b7; }

  .overlay {
    display: none;
    position: fixed; /* Changed to fixed so it always covers viewport */
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 20;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    perspective: 1200px;
  }

  /* 3D Flip Card Styles */
  .flashcard-wrapper {
    width: 80%;
    max-width: 800px;
    height: 450px;
    position: relative;
    transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
    transform-style: preserve-3d;
  }

  .flashcard-wrapper.flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    background: #ffffff;
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
  }

  .card-back {
    transform: rotateY(180deg);
    background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.2));
    border: 1px solid rgba(16,185,129,0.3);
  }

  .flashcard-text {
    font-size: 3.5em;
    font-weight: 900;
    margin-bottom: 40px;
    line-height: 1.2;
    background: linear-gradient(to right, #0f172a, #334155);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .card-back .flashcard-text {
    background: linear-gradient(to right, #34d399, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
  }

  .award-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 15px;
  }

  .award-btn {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    font-size: 1.1em;
    padding: 12px 20px;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
  }

  #editor-dashboard {
    background: rgba(248, 250, 252, 0.98);
    border: none;
    padding: 0;
    border-radius: 0;
    width: 100%;
    max-width: 100%;
    box-shadow: none;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow-y: auto;
    max-height: 100vh; /* changed to 100vh */
  }

  .editor-content-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto 60px auto;
    background: transparent;
    display: flex;
    flex-direction: column;
  }

  .dashboard-controls-sticky {
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 30;
    padding: 20px 40px;
    border-bottom: 1px solid var(--glass-border);
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 15px;
    border-radius: 0 0 20px 20px;
    margin-bottom: 20px;
  }

  .editor-inner-content {
    padding: 0 40px;
    width: 100%;
    box-sizing: border-box;
  }

  .editor-list {
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 100%;
    margin-top: 10px;
  }

  .edit-cat-card {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }

  .edit-cat-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e2e8f0;
  }

  .edit-cat-header label {
    font-weight: 900;
    color: var(--accent-primary);
    font-size: 1.2em;
    margin: 0;
    min-width: max-content;
  }

  .edit-cat-input-long {
    flex-grow: 1;
    font-weight: 900;
    font-size: 1.2em;
    padding: 12px 15px;
    background: #ffffff;
    border: 2px solid #cbd5e1;
    border-radius: 8px;
    color: var(--text-main);
    transition: border-color 0.2s;
  }

  .edit-cat-input-long:focus {
    outline: none;
    border-color: var(--accent-primary);
  }

  .edit-q-row {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
    align-items: stretch;
    background: #ffffff;
    padding: 15px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  .edit-q-points {
    font-weight: 900;
    font-size: 1.2em;
    color: var(--gold);
    background: #0f172a;
    padding: 10px 15px;
    border-radius: 8px;
    min-width: 90px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-q-fields {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .edit-field {
    display: flex;
    gap: 10px;
  }

  .edit-field label {
    font-weight: 900;
    color: var(--text-muted);
    margin-top: 12px;
    min-width: 25px;
  }

  .edit-field textarea {
    flex-grow: 1;
    min-height: 40px;
    padding: 10px 15px;
    font-size: 1.05em;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #f8fafc;
    color: var(--text-main);
    font-family: Inter, "Segoe UI", "Malgun Gothic", sans-serif;
    resize: vertical;
  }
  
  .edit-field textarea:focus {
    outline: none;
    border-color: var(--accent-primary);
    background: #ffffff;
  }

  .editor-row {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .editor-row label {
    margin-top: 10px;
    font-weight: 700;
    color: var(--text-muted);
    min-width: 130px;
  }

  select, input, textarea {
    flex-grow: 1;
    padding: 12px 16px;
    font-size: 1.1em;
    font-family: Inter, "Segoe UI", "Malgun Gothic", sans-serif;
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.2);
    background: #f8fafc;
    color: var(--text-main);
    transition: all 0.2s;
  }

  select:focus, input:focus, textarea:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(123, 153, 214, 0.2);
  }

  textarea { resize: vertical; min-height: 100px; }
  
  .dashboard-header {
    font-size: 2.2em;
    font-weight: 900;
    color: var(--text-main);
    margin-bottom: 10px;
    text-align: center;
    border-bottom: 1px solid var(--glass-border);
    padding-bottom: 20px;
  }

  /* Setup Modal Styles */
  .setup-container {
    background: #ffffff;
    border-radius: 24px;
    padding: 40px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
    text-align: center;
  }
  .unit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 25px 0;
    text-align: left;
  }
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.1em;
    cursor: pointer;
    background: #f8fafc;
    padding: 12px 15px;
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    transition: all 0.2s;
  }
  .checkbox-label:hover {
    background: #e2e8f0;
    border-color: var(--accent-primary);
  }
  .checkbox-label input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: var(--accent-primary);
  }

  /* STUDENT MODE STRIPPING CSS */
  body.student-mode nav { display: none !important; }
  body.student-mode #editor-dashboard { display: none !important; }
  body.student-mode .score-controls { display: none !important; }
  body.student-mode .team-management { display: none !important; }
  body.student-mode .team-name-input,
  body.student-mode .team-score-input { 
    pointer-events: none; 
    border-bottom: none; 
  }
  body.student-mode #teacher-answer-preview,
  body.student-mode #btn-reveal,
  body.student-mode #btn-close-early,
  body.student-mode #btn-close,
  body.student-mode #award-container { display: none !important; }

</style>
</head>
<body>

<nav>
  <button id="btn-round1" class="active-mode" onclick="setMode('round1')">Single Jeopardy</button>
  <button id="btn-round2" onclick="setMode('round2')">Double Jeopardy</button>
  <button id="btn-setup" onclick="openSetup()" style="background: linear-gradient(135deg, #14b8a6, #0f766e);">Game Generator</button>
  <button id="btn-edit" onclick="setMode('edit')">Teacher Dashboard</button>
  <button id="btn-student" onclick="openStudentView()" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);">Launch Student View</button>
  <button id="btn-export" onclick="exportHTML()" style="background: linear-gradient(135deg, #f59e0b, #d97706);">Export HTML</button>
  <button id="btn-reset" onclick="resetGame()" style="background: linear-gradient(135deg, #db2777, #be185d);">Reset Board</button>
</nav>

<div id="game-container">
  <h1 id="main-board-title" class="main-title">__TITLE__</h1>
  
  <canvas id="gameCanvas" width="1200" height="600" aria-label="Jeopardy game board" role="img" tabindex="0" style="display: block;"></canvas>
  
  <div id="scoreboard-wrapper" class="scoreboard-wrapper">
    <div id="scoreboard" class="scoreboard-container">
      <!-- Teams injected here via JS -->
    </div>
    <div class="team-management">
      <button class="team-mgt-btn" onclick="removeTeam()">- Remove Team</button>
      <button class="team-mgt-btn" onclick="addTeam()">+ Add Team</button>
    </div>
  </div>

  <div id="card-overlay" class="overlay" style="display: none;">
    <div class="flashcard-wrapper" id="flashcard-wrapper">
      <div class="card-face card-front">
        <div id="question-text" class="flashcard-text">Question</div>
        
        <!-- TEACHER PREVIEW AREA (Hidden in student mode) -->
        <div id="teacher-answer-preview" style="color: #fbbf24; font-size: 1.4em; margin-bottom: 25px; font-weight: bold; display: none; background: rgba(0,0,0,0.6); padding: 12px 25px; border-radius: 12px; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">Answer Preview</div>
        <div style="display: flex; gap: 15px;">
          <button id="btn-reveal" onclick="revealAnswer()">Reveal to Students</button>
          <button id="btn-close-early" onclick="closeCard()" style="background: linear-gradient(135deg, #ef4444, #b91c1c);" title="Close without marking as done">Close Early</button>
        </div>

      </div>
      <div class="card-face card-back">
        <div id="answer-text" class="flashcard-text">Answer</div>
        <div id="award-container" class="award-buttons" style="display: none;"></div>
        <button id="btn-close" onclick="closeNobodyGotIt()" style="background: linear-gradient(135deg, #64748b, #475569);" title="Mark as used and close">Close Question</button>
      </div>
    </div>
  </div>

  <div id="editor-dashboard" class="overlay" style="display: none;">
    <div class="editor-content-wrapper">
      <div class="dashboard-controls-sticky">
        <div class="dashboard-header" style="margin-bottom: 0; padding-bottom: 0; border: none;">Teacher Dashboard</div>
        
        <div style="display: flex; gap: 20px; width: 100%; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div class="editor-row" style="flex-grow: 1; margin: 0; align-items: center;">
            <label style="margin:0; min-width: auto; color: #0f172a;">Game Title:</label>
            <input type="text" id="edit-game-title" oninput="saveGameTitle()" style="max-width: 350px;">
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button id="editor-btn-round1" onclick="setEditorRound('round1')" class="">Single Jeopardy</button>
            <button id="editor-btn-round2" onclick="setEditorRound('round2')" style="background: #f8fafc; color: #0f172a; border-color: #cbd5e1;">Double Jeopardy</button>
            <input type="file" id="import-file" accept=".html" style="display: none;" onchange="importGameData(event)">
            <button onclick="document.getElementById('import-file').click()" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 4px 10px rgba(139, 92, 246, 0.3);">📥 Import Game</button>
          </div>
          <button onclick="setMode(editorRound)" style="background: linear-gradient(135deg, #10b981, #059669); margin-left: auto;">Save &amp; Close Dashboard</button>
        </div>
      </div>
      
      <div class="editor-inner-content">
        <div id="editor-list" class="editor-list" style="margin-top: 0;"></div>
      </div>
    </div>
  </div>

  <div id="setup-overlay" class="overlay" style="display: none;">
    <div class="setup-container">
      <div class="main-title" style="font-size: 2em; margin-bottom: 5px;">Game Generator</div>
      <p style="color: var(--text-muted); margin-bottom: 20px;">Select the units to include. The game will automatically generate Single and Double Jeopardy boards based on this book's units.</p>
      
      <div class="unit-grid" id="unit-selection-grid">
        <!-- Checkboxes injected by JS -->
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button onclick="closeSetup()" style="background: #64748b; color: white;">Cancel</button>
        <button onclick="buildGameFromSelection()" style="background: linear-gradient(135deg, #10b981, #059669); font-size: 1.2em; padding: 12px 30px;">Generate Game</button>
      </div>
    </div>
  </div>
</div>

<script id="baked-data" type="application/json"></script>
<script>
// Determine if this specific window is the Student View
const isStudent = window.IS_STUDENT_VIEW === true;
if (isStudent) {
  document.body.classList.add('student-mode');
}

// System Constants
const CONFIG = {
  COLS: 5,
  ROWS: 6,
  GAP: 16
};

// Global State
let gameData = null;
let currentRound = 'round1';
let activeCell = null;
let editorRound = 'round1';
let isRevealed = false;
let studentWindow = null;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Utility: Prevent XSS
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

const GAME_TITLE = __TITLE_JSON__;
const GAME_LEVEL = __LEVEL_JSON__;
const GAME_BOOK = __BOOK_JSON__;
const DOWNLOAD_NAME = __DOWNLOAD_NAME_JSON__;
const STORAGE_KEY = __STORAGE_KEY_JSON__;
const UNIT_DATA = __UNIT_DATA__;

// Helper: Array Shuffle
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Dynamic Game Generator
function generateDynamicGame(selectedUnits) {
  if (!selectedUnits || selectedUnits.length === 0) {
    selectedUnits = Object.keys(UNIT_DATA); // Fallback to all
  }

  // We need 10 categories total (5 for Round 1, 5 for Round 2).
  let chosenCategories = [];
  let tempSelection = [...selectedUnits];
  
  while (chosenCategories.length < 10) {
    if (tempSelection.length === 0) tempSelection = [...selectedUnits];
    shuffle(tempSelection);
    chosenCategories.push(tempSelection.pop());
  }

  // Track pools so we don't repeat questions until necessary
  let pools = {};
  selectedUnits.forEach(u => pools[u] = shuffle([...UNIT_DATA[u]]));

  function createRound(catNames, multiplier) {
    return catNames.map(catName => {
      let questions = [];
      for (let i = 0; i < 5; i++) {
        if (pools[catName].length === 0) {
          pools[catName] = shuffle([...UNIT_DATA[catName]]);
        }
        let qItem = pools[catName].pop();
        questions.push({
          q: qItem.q,
          a: qItem.a,
          points: (i + 1) * 100 * multiplier,
          done: false
        });
      }
      return { name: catName, questions: questions };
    });
  }

  const round1Cats = chosenCategories.slice(0, 5);
  const round2Cats = chosenCategories.slice(5, 10);

  return {
    title: GAME_TITLE,
    version: 2,
    exportId: Date.now().toString(),
    teams: [
      { name: "Team 1", score: 0 },
      { name: "Team 2", score: 0 },
      { name: "Team 3", score: 0 },
      { name: "Team 4", score: 0 }
    ],
    round1: createRound(round1Cats, 1),
    round2: createRound(round2Cats, 2)
  };
}

// Setup Modal Logic
function openSetup() {
  if (isStudent) return;
  document.getElementById('setup-overlay').style.display = 'flex';
  const grid = document.getElementById('unit-selection-grid');
  grid.innerHTML = '';
  
  Object.keys(UNIT_DATA).forEach((unit) => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = unit;
    checkbox.checked = true; // Default select all
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(unit));
    grid.appendChild(label);
  });
}

function closeSetup() {
  document.getElementById('setup-overlay').style.display = 'none';
}

function buildGameFromSelection() {
  const checkboxes = document.querySelectorAll('#unit-selection-grid input[type="checkbox"]:checked');
  const selectedUnits = Array.from(checkboxes).map(cb => cb.value);
  
  if (selectedUnits.length === 0) {
    alert("Please select at least one unit!");
    return;
  }
  
  gameData = generateDynamicGame(selectedUnits);
  saveData();
  closeSetup();
  
  setMode('round1');
  renderScoreboard();
  drawBoard();
  syncState();
}

// Default Data Factory 
function generateDefaultData() {
  return generateDynamicGame(Object.keys(UNIT_DATA));
}

// Validator to ensure loaded data matches required schema structure
function validateGameData(data) {
  if (!data || !data.round1 || !data.round2 || !data.teams) return false;
  if (data.round1.length !== CONFIG.COLS || data.round2.length !== CONFIG.COLS) return false;
  return true;
}

// System Init
function initData() {
  let bakedData = null;
  const bakedEl = document.getElementById('baked-data');
  if (bakedEl && bakedEl.textContent.trim() !== '') {
    try { bakedData = JSON.parse(bakedEl.textContent); } catch(e) {}
  }

  let useSaved = false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if ((!bakedData || parsed.exportId === bakedData.exportId) && validateGameData(parsed)) {
        gameData = parsed;
        useSaved = true;
      }
    }
  } catch (e) {
    console.warn("Local storage is disabled or unavailable.");
  }

  if (!useSaved) {
    gameData = (bakedData && validateGameData(bakedData)) ? bakedData : generateDefaultData();
  }

  // Ensure required fields exist
  if (!gameData.title) gameData.title = GAME_TITLE;
  if (!gameData.version) gameData.version = 1;
  if (!gameData.exportId) gameData.exportId = Date.now().toString();
  if (!gameData.teams) {
    gameData.teams = [
      { name: "Team 1", score: 0 }, { name: "Team 2", score: 0 },
      { name: "Team 3", score: 0 }, { name: "Team 4", score: 0 }
    ];
  }
  
  saveData();
  renderScoreboard();

  // Listen for sync events via direct window communication
  if (!isStudent) {
    syncState();
  }
}

// STUDENT VIEW SYSTEM
function openStudentView() {
  // Focus window if it is already open to prevent duplicate popups
  if (studentWindow && !studentWindow.closed) {
    studentWindow.focus();
    syncState();
    return;
  }

  studentWindow = window.open('', '_blank');
  
  if (!studentWindow) {
    // If pop-ups are blocked, change button text temporarily to warn the user
    const btn = document.getElementById('btn-student');
    const origText = btn.innerText;
    btn.innerText = "Pop-up Blocked! Allow pop-ups.";
    btn.style.background = "linear-gradient(135deg, #ef4444, #b91c1c)";
    setTimeout(() => {
      btn.innerText = origText;
      btn.style.background = "linear-gradient(135deg, #8b5cf6, #6d28d9)";
    }, 4000);
    return;
  }

  // Clone current document to inject student flags
  const clonedDoc = document.documentElement.cloneNode(true);
  
  // Inject flag telling the new window it is a student
  const script = document.createElement('script');
  script.textContent = "window.IS_STUDENT_VIEW = true;";
  clonedDoc.querySelector('head').insertBefore(script, clonedDoc.querySelector('head').firstChild);
  
  // Apply student mode class immediately
  clonedDoc.querySelector('body').classList.add('student-mode');

  // Generate clean HTML string to write
  const html = "<!DOCTYPE html>\\n<html>\\n" + clonedDoc.innerHTML + "\\n</html>";

  // Write directly to the new blank window (bypasses URL block restrictions)
  studentWindow.document.open();
  studentWindow.document.write(html);
  studentWindow.document.close();
  
  // Send state signals shortly after writing to ensure sync
  setTimeout(syncState, 200);
  setTimeout(syncState, 1000);
  setTimeout(syncState, 2500);
}

function syncState() {
  if (isStudent) return; // Only teacher syncs out
  
  const stateRound = currentRound === 'edit' ? editorRound : currentRound;
  
  const state = {
    round: stateRound,
    gameData: gameData,
    modal: activeCell ? {
      col: activeCell.col,
      qIdx: activeCell.qIdx,
      revealed: isRevealed
    } : null
  };
  
  // Direct window communication
  if (studentWindow && !studentWindow.closed) {
    try {
      if (typeof studentWindow.applySyncState === 'function') {
        studentWindow.applySyncState(state);
      }
    } catch(e) {}
  }
}

// Called by the teacher window sending new data
window.applySyncState = function(state) {
  if (!state || !state.gameData || !validateGameData(state.gameData)) return;
  gameData = state.gameData;
  
  if (currentRound !== state.round) {
     currentRound = state.round;
  }
  
  // Keep student interface clean and fixed on the board
  document.getElementById('editor-dashboard').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  document.getElementById('scoreboard-wrapper').style.display = 'flex';
  
  drawBoard();
  renderScoreboard();
  
  // Mirror the card state
  if (state.modal) {
    const qData = gameData[currentRound][state.modal.col].questions[state.modal.qIdx];
    document.getElementById('question-text').innerText = qData.q;
    document.getElementById('answer-text').innerText = qData.a;
    document.getElementById('card-overlay').style.display = 'flex';
    
    if (state.modal.revealed) {
      document.getElementById('flashcard-wrapper').classList.add('flipped');
    } else {
      document.getElementById('flashcard-wrapper').classList.remove('flipped');
    }
  } else {
    document.getElementById('card-overlay').style.display = 'none';
    document.getElementById('flashcard-wrapper').classList.remove('flipped');
  }
};
// ==========================================

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
  } catch (e) {}
}

// Scoreboard Logic
function renderScoreboard() {
  const sb = document.getElementById('scoreboard');
  sb.innerHTML = '';
  
  gameData.teams.forEach((team, idx) => {
    const card = document.createElement('div');
    card.className = 'team-card';
    
    card.innerHTML = \`
      <input type="text" class="team-name-input" value="\${escapeHTML(team.name)}" oninput="updateTeamName(\${idx}, this.value)">
      <input type="number" class="team-score-input" value="\${team.score}" oninput="updateScoreDirectly(\${idx}, this.value)">
      <div class="score-controls">
        <button class="score-btn minus" onclick="updateScore(\${idx}, -100)">-100</button>
        <button class="score-btn plus" onclick="updateScore(\${idx}, 100)">+100</button>
      </div>
    \`;
    sb.appendChild(card);
  });
}

function updateTeamName(idx, newName) {
  gameData.teams[idx].name = newName;
  saveData();
  syncState();
}

function updateScoreDirectly(idx, newValue) {
  gameData.teams[idx].score = parseInt(newValue) || 0;
  saveData();
  syncState(); // Push to student view instantly
}

function updateScore(idx, amount) {
  gameData.teams[idx].score += amount;
  saveData();
  renderScoreboard();
  syncState();
}

function addTeam() {
  const newTeamNum = gameData.teams.length + 1;
  gameData.teams.push({ name: \`Team \${newTeamNum}\`, score: 0 });
  saveData();
  renderScoreboard();
  syncState();
}

function removeTeam() {
  if (gameData.teams.length > 1) {
    gameData.teams.pop();
    saveData();
    renderScoreboard();
    syncState();
  }
}

// Global Keyboard Listeners
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (document.getElementById('card-overlay').style.display === 'flex') {
      closeCard();
    } else if (document.getElementById('editor-dashboard').style.display === 'flex') {
      setMode(editorRound); // Close dashboard
    } else if (document.getElementById('setup-overlay').style.display === 'flex') {
      closeSetup();
    }
  }
});

// Export HTML
function exportHTML() {
  gameData.exportId = Date.now().toString();
  saveData();

  const clonedDoc = document.documentElement.cloneNode(true);
  
  const bakedScript = clonedDoc.querySelector('#baked-data');
  if (bakedScript) {
    bakedScript.textContent = JSON.stringify(gameData);
  }

  clonedDoc.querySelectorAll('.active-mode').forEach(el => el.classList.remove('active-mode'));
  const round1Btn = clonedDoc.querySelector('#btn-round1');
  if(round1Btn) round1Btn.classList.add('active-mode');
  
  clonedDoc.querySelectorAll('.overlay').forEach(el => el.style.display = 'none');
  
  // Extract body using querySelector since clonedDoc is the HTML element wrapper
  const clonedBody = clonedDoc.querySelector('body');
  if(clonedBody) clonedBody.classList.remove('student-mode'); // Clean up if exported from student view
  
  const canvasEl = clonedDoc.querySelector('#gameCanvas');
  if(canvasEl) canvasEl.style.display = 'block';

  const flashcard = clonedDoc.querySelector('#flashcard-wrapper');
  if (flashcard) flashcard.classList.remove('flipped');

  const nameInputs = document.querySelectorAll('.team-name-input');
  const clonedNameInputs = clonedDoc.querySelectorAll('.team-name-input');
  nameInputs.forEach((input, i) => {
    if(clonedNameInputs[i]) clonedNameInputs[i].setAttribute('value', input.value);
  });
  
  const scoreInputs = document.querySelectorAll('.team-score-input');
  const clonedScoreInputs = clonedDoc.querySelectorAll('.team-score-input');
  scoreInputs.forEach((input, i) => {
    if(clonedScoreInputs[i]) clonedScoreInputs[i].setAttribute('value', input.value);
  });

  let html = "<!DOCTYPE html>\\n<html lang=\\"en\\">\\n" + clonedDoc.innerHTML + "\\n</html>";
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = DOWNLOAD_NAME || ((gameData.title || "Review_Game").replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.html');
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  const btn = document.getElementById('btn-export');
  const originalText = btn.innerText;
  btn.innerText = "Exported!";
  btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
  }, 2000);
}

let resetConfirm = false;

function resetGame() {
  const btn = document.getElementById('btn-reset');
  
  if (!resetConfirm) {
    resetConfirm = true;
    btn.innerText = "Are you sure?";
    btn.style.background = "linear-gradient(135deg, #ef4444, #b91c1c)";
    
    setTimeout(() => {
      if (resetConfirm) {
        resetConfirm = false;
        btn.innerText = "Reset Board";
        btn.style.background = "linear-gradient(135deg, #db2777, #be185d)";
      }
    }, 3000);
    return;
  }

  resetConfirm = false;
  gameData.round1.forEach(c => c.questions.forEach(q => q.done = false));
  gameData.round2.forEach(c => c.questions.forEach(q => q.done = false));
  gameData.teams.forEach(t => t.score = 0);
  saveData();
  drawBoard();
  renderScoreboard();
  syncState();
  
  btn.innerText = "Board Reset!";
  btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
  
  setTimeout(() => {
    btn.innerText = "Reset Board";
    btn.style.background = "linear-gradient(135deg, #db2777, #be185d)";
  }, 2000);
}

// Canvas Drawing logic
function drawBoard() {
  if(currentRound === 'edit') return;
  
  document.getElementById('main-board-title').innerText = gameData.title;
  
  const roundData = gameData[currentRound];
  const cellWidth = (canvas.width - (CONFIG.COLS + 1) * CONFIG.GAP) / CONFIG.COLS;
  const cellHeight = (canvas.height - (CONFIG.ROWS + 1) * CONFIG.GAP) / CONFIG.ROWS;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let col = 0; col < CONFIG.COLS; col++) {
    const x = CONFIG.GAP + col * (cellWidth + CONFIG.GAP);
    const y = CONFIG.GAP;
    const w = cellWidth;
    const h = cellHeight;

    // Teal to Blue gradient
    let headGrad = ctx.createLinearGradient(x, y, x, y + h);
    headGrad.addColorStop(0, '#7b99d6'); /* Write Now 3 Blue */
    headGrad.addColorStop(1, '#5d7dbf');
    
    ctx.fillStyle = headGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;
    
    ctx.beginPath();
    if(ctx.roundRect) {
      ctx.roundRect(x, y, w, h, 16);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.fill();

    ctx.shadowColor = 'transparent';
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    wrapText(ctx, roundData[col].name.toUpperCase(), x + w/2, y + h/2, w - 24, 28);

    for (let row = 1; row < CONFIG.ROWS; row++) {
      const qData = roundData[col].questions[row - 1];
      const qx = x;
      const qy = CONFIG.GAP + row * (cellHeight + CONFIG.GAP);

      ctx.beginPath();
      if(ctx.roundRect) {
        ctx.roundRect(qx, qy, w, h, 16);
      } else {
        ctx.rect(qx, qy, w, h);
      }

      if (!qData.done) {
        let grad = ctx.createLinearGradient(qx, qy, qx, qy + h);
        grad.addColorStop(0, '#3b82f6');
        grad.addColorStop(1, '#1d4ed8');
        ctx.fillStyle = grad;
        
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 6;
        ctx.fill();
        
        ctx.shadowColor = 'transparent';

        ctx.fillStyle = '#fbbf24';
        ctx.font = '900 44px Inter, Arial';
        ctx.fillText(qData.points, qx + w/2, qy + h/2);
      } else {
        ctx.fillStyle = 'rgba(51, 65, 85, 0.6)';
        ctx.fill();
      }
    }
  }
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];

  for(let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else if (testWidth > maxWidth && n === 0) {
      // Force split to prevent overflowing solitary massive words
      lines.push(testLine);
      line = '';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  
  let startY = y - ((lines.length - 1) * lineHeight) / 2;
  for(let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], x, startY + (i * lineHeight));
  }
}

// Interaction Logic
canvas.addEventListener('click', (e) => {
  if(currentRound === 'edit' || isStudent) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const clickX = (e.clientX - rect.left) * scaleX;
  const clickY = (e.clientY - rect.top) * scaleY;

  const cellWidth = (canvas.width - (CONFIG.COLS + 1) * CONFIG.GAP) / CONFIG.COLS;
  const cellHeight = (canvas.height - (CONFIG.ROWS + 1) * CONFIG.GAP) / CONFIG.ROWS;

  let clickedCol = -1;
  let clickedRow = -1;

  for (let c = 0; c < CONFIG.COLS; c++) {
    const x = CONFIG.GAP + c * (cellWidth + CONFIG.GAP);
    if (clickX >= x && clickX <= x + cellWidth) {
      clickedCol = c;
      break;
    }
  }
  
  for (let r = 1; r < CONFIG.ROWS; r++) {
    const y = CONFIG.GAP + r * (cellHeight + CONFIG.GAP);
    if (clickY >= y && clickY <= y + cellHeight) {
      clickedRow = r;
      break;
    }
  }

  if (clickedCol !== -1 && clickedRow !== -1) {
    const qData = gameData[currentRound][clickedCol].questions[clickedRow - 1];
    if (!qData.done) {
      openCard(clickedCol, clickedRow - 1, qData);
    }
  }
});

function openCard(col, qIdx, qData) {
  activeCell = { col, qIdx };
  isRevealed = false;
  
  document.getElementById('flashcard-wrapper').classList.remove('flipped');
  document.getElementById('question-text').innerText = qData.q;
  document.getElementById('answer-text').innerText = qData.a;
  
  // Show the private answer preview to the teacher
  if (!isStudent) {
    document.getElementById('teacher-answer-preview').innerText = "Secret Answer: " + qData.a;
    document.getElementById('teacher-answer-preview').style.display = 'block';
  }
  
  document.getElementById('card-overlay').style.display = 'flex';
  syncState();
}

function revealAnswer() {
  document.getElementById('flashcard-wrapper').classList.add('flipped');
  isRevealed = true;
  
  const currentPoints = gameData[currentRound][activeCell.col].questions[activeCell.qIdx].points;
  const awardContainer = document.getElementById('award-container');
  awardContainer.innerHTML = '';
  awardContainer.style.display = 'flex';
  
  // Create quick-award buttons for each team (Teacher only)
  if (!isStudent) {
    gameData.teams.forEach((team, idx) => {
      const btn = document.createElement('button');
      btn.className = 'award-btn button';
      btn.innerText = \`+\${currentPoints} to \${team.name}\`;
      btn.onclick = () => {
        updateScore(idx, currentPoints);
        btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
        btn.innerText = "Awarded!";
        btn.disabled = true;
      };
      awardContainer.appendChild(btn);
    });
  }
  
  if(activeCell) {
    gameData[currentRound][activeCell.col].questions[activeCell.qIdx].done = true;
    saveData();
  }
  syncState();
}

function closeNobodyGotIt() {
  if(activeCell) {
    gameData[currentRound][activeCell.col].questions[activeCell.qIdx].done = true;
    saveData();
  }
  closeCard();
}

function closeCard() {
  document.getElementById('card-overlay').style.display = 'none';
  activeCell = null;
  isRevealed = false;
  drawBoard();
  syncState();
}

function setMode(mode) {
  document.getElementById('btn-round1').classList.remove('active-mode');
  document.getElementById('btn-round2').classList.remove('active-mode');
  document.getElementById('btn-edit').classList.remove('active-mode');

  document.getElementById('editor-dashboard').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  document.getElementById('scoreboard-wrapper').style.display = 'flex';

  if (mode === 'round1' || mode === 'round2') {
    currentRound = mode;
    document.getElementById(\`btn-\${mode}\`).classList.add('active-mode');
    drawBoard();
  } else if (mode === 'edit') {
    currentRound = 'edit';
    document.getElementById('btn-edit').classList.add('active-mode');
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('scoreboard-wrapper').style.display = 'none';
    document.getElementById('editor-dashboard').style.display = 'flex';
    renderEditorBoard();
  }
  syncState();
}

function setEditorRound(round) {
  editorRound = round;
  if(round === 'round1') {
    document.getElementById('editor-btn-round1').className = 'active-mode';
    document.getElementById('editor-btn-round1').style = '';
    document.getElementById('editor-btn-round2').className = '';
    document.getElementById('editor-btn-round2').style = 'background: #f8fafc; color: #0f172a; border-color: #cbd5e1;';
  } else {
    document.getElementById('editor-btn-round2').className = 'active-mode';
    document.getElementById('editor-btn-round2').style = '';
    document.getElementById('editor-btn-round1').className = '';
    document.getElementById('editor-btn-round1').style = 'background: #f8fafc; color: #0f172a; border-color: #cbd5e1;';
  }
  renderEditorBoard();
  syncState();
}

// Teacher Editor Logic (List View)
function renderEditorBoard() {
  document.getElementById('edit-game-title').value = gameData.title || GAME_TITLE;
  const listContainer = document.getElementById('editor-list');
  listContainer.innerHTML = '';
  
  const roundData = gameData[editorRound];
  
  for (let c = 0; c < CONFIG.COLS; c++) {
    const catCard = document.createElement('div');
    catCard.className = 'edit-cat-card';

    // Category Header
    const catHeader = document.createElement('div');
    catHeader.className = 'edit-cat-header';
    catHeader.innerHTML = \`<label>Category \${c + 1}:</label>\`;
    
    const catInput = document.createElement('input');
    catInput.type = 'text';
    catInput.className = 'edit-cat-input-long';
    catInput.value = roundData[c].name; // .value is safe from XSS by default
    catInput.oninput = (e) => saveCategoryTitle(c, e.target.value);
    
    catHeader.appendChild(catInput);
    catCard.appendChild(catHeader);

    // Questions List for this Category
    for (let r = 0; r < CONFIG.ROWS - 1; r++) {
      const qData = roundData[c].questions[r];
      const qRow = document.createElement('div');
      qRow.className = 'edit-q-row';
      
      qRow.innerHTML = \`
        <div class="edit-q-points">\${qData.points} pts</div>
        <div class="edit-q-fields">
          <div class="edit-field">
            <label>Q:</label>
            <textarea oninput="updateQ(\${c}, \${r}, this.value)">\${escapeHTML(qData.q)}</textarea>
          </div>
          <div class="edit-field">
            <label>A:</label>
            <textarea oninput="updateA(\${c}, \${r}, this.value)">\${escapeHTML(qData.a)}</textarea>
          </div>
        </div>
      \`;
      catCard.appendChild(qRow);
    }
    listContainer.appendChild(catCard);
  }
}

function saveGameTitle() {
  gameData.title = document.getElementById('edit-game-title').value;
  saveData();
  syncState();
}

function saveCategoryTitle(c, newTitle) {
  gameData[editorRound][c].name = newTitle;
  saveData();
  syncState();
}

function updateQ(c, r, val) {
  gameData[editorRound][c].questions[r].q = val;
  gameData[editorRound][c].questions[r].done = false;
  saveData();
  syncState();
}

function updateA(c, r, val) {
  gameData[editorRound][c].questions[r].a = val;
  gameData[editorRound][c].questions[r].done = false;
  saveData();
  syncState();
}

// Import game data from a previously exported HTML file
function importGameData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const html = e.target.result;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const baked = doc.querySelector('#baked-data');
    
    const btn = event.target.nextElementSibling;
    const origText = btn.innerText;

    if (baked && baked.textContent.trim() !== '') {
      try {
        const importedData = JSON.parse(baked.textContent);
        if (importedData && importedData.round1) {
          if (!importedData.teams) {
            importedData.teams = [
              { name: "Team 1", score: 0 }, { name: "Team 2", score: 0 },
              { name: "Team 3", score: 0 }, { name: "Team 4", score: 0 }
            ];
          }
          importedData.exportId = Date.now().toString(); 
          gameData = importedData;
          saveData();
          
          document.getElementById('edit-game-title').value = gameData.title;
          renderEditorBoard();
          drawBoard();
          renderScoreboard();
          syncState();
          
          btn.innerText = "✅ Success!";
          btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
        } else {
          btn.innerText = "❌ Invalid File";
          btn.style.background = "linear-gradient(135deg, #ef4444, #b91c1c)";
        }
      } catch(err) {
        console.error("Error parsing the imported game data.", err);
        btn.innerText = "❌ Error";
        btn.style.background = "linear-gradient(135deg, #ef4444, #b91c1c)";
      }
    } else {
      btn.innerText = "❌ No Data Found";
      btn.style.background = "linear-gradient(135deg, #ef4444, #b91c1c)";
    }
    
    event.target.value = '';
    
    setTimeout(() => {
      btn.innerText = origText;
      btn.style.background = "linear-gradient(135deg, #8b5cf6, #6d28d9)";
    }, 3000);
  };
  reader.readAsText(file);
}

// Startup
initData();
if (!isStudent) {
  drawBoard();
}

</script>

</body>
</html>`,
    vocabulary: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap");
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body {
      font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1rem;
    }
    .shell {
      width: 100%;
      max-width: 56rem;
      margin: 0 auto;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.18);
      padding: 1.75rem;
      text-align: center;
      position: relative;
    }
    .hidden { display: none !important; }
    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      margin-bottom: .35rem;
    }
    #game-title {
      font-size: clamp(1.6rem, 4vw, 2.25rem);
      font-weight: 900;
      color: #4338ca;
      text-align: center;
      width: 100%;
      background: transparent;
      border: 0;
      border-radius: .5rem;
      padding: .5rem;
    }
    #game-title:focus { outline: none; }
    #view-words-btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: #e2e8f0;
      color: #334155;
      border: 0;
      border-radius: 999px;
      padding: .45rem;
      cursor: pointer;
    }
    #view-words-btn:hover { background: #cbd5e1; }
    .sub { color: #64748b; margin: 0 0 1.4rem; }
    .scoreboard {
      display: grid;
      gap: 1rem;
      margin-bottom: .5rem;
    }
    .scoreboard.cols-1 { grid-template-columns: 1fr; }
    .scoreboard.cols-2 { grid-template-columns: 1fr 1fr; }
    .scoreboard.cols-3 { grid-template-columns: repeat(3, 1fr); }
    .scoreboard.cols-4 { grid-template-columns: repeat(2, 1fr); }
    .scoreboard.cols-5,
    .scoreboard.cols-6 { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 768px) {
      .scoreboard.cols-4 { grid-template-columns: repeat(4, 1fr); }
      .scoreboard.cols-5 { grid-template-columns: repeat(3, 1fr); }
      .scoreboard.cols-6 { grid-template-columns: repeat(3, 1fr); }
    }
    @media (min-width: 1024px) {
      .scoreboard.cols-5 { grid-template-columns: repeat(5, 1fr); }
    }
    .team-card {
      padding: 1rem;
      border-radius: .75rem;
    }
    .team-name-input {
      font-weight: 800;
      background: transparent;
      width: 100%;
      text-align: center;
      margin-bottom: .5rem;
      padding: .25rem;
      border: 0;
      border-radius: .4rem;
      font-family: inherit;
      font-size: 1.2rem;
    }
    .team-name-input:focus { outline: 2px solid currentColor; }
    .team-score {
      font-size: 2.25rem;
      font-weight: 900;
      margin: .4rem 0;
    }
    .scoreboard.small .team-name-input { font-size: 1.05rem; }
    .scoreboard.small .team-score { font-size: 1.75rem; }
    .point-row { display: flex; gap: .5rem; }
    .add-point-btn, .minus-point-btn {
      width: 100%;
      color: #fff;
      font-weight: 800;
      border: 0;
      border-radius: .4rem;
      padding: .5rem .8rem;
      cursor: pointer;
      font-family: inherit;
    }
    .tone-blue { background: #dbeafe; }
    .tone-blue .team-name-input, .tone-blue .team-score { color: #1e40af; }
    .tone-blue .add-point-btn { background: #3b82f6; }
    .tone-blue .minus-point-btn { background: #1d4ed8; }
    .tone-rose { background: #ffe4e6; }
    .tone-rose .team-name-input, .tone-rose .team-score { color: #9f1239; }
    .tone-rose .add-point-btn { background: #f43f5e; }
    .tone-rose .minus-point-btn { background: #be123c; }
    .tone-amber { background: #fef3c7; }
    .tone-amber .team-name-input, .tone-amber .team-score { color: #92400e; }
    .tone-amber .add-point-btn { background: #f59e0b; }
    .tone-amber .minus-point-btn { background: #b45309; }
    .tone-teal { background: #ccfbf1; }
    .tone-teal .team-name-input, .tone-teal .team-score { color: #115e59; }
    .tone-teal .add-point-btn { background: #14b8a6; }
    .tone-teal .minus-point-btn { background: #0f766e; }
    .tone-violet { background: #ede9fe; }
    .tone-violet .team-name-input, .tone-violet .team-score { color: #5b21b6; }
    .tone-violet .add-point-btn { background: #8b5cf6; }
    .tone-violet .minus-point-btn { background: #6d28d9; }
    .tone-lime { background: #ecfccb; }
    .tone-lime .team-name-input, .tone-lime .team-score { color: #3f6212; }
    .tone-lime .add-point-btn { background: #84cc16; }
    .tone-lime .minus-point-btn { background: #4d7c0f; }
    .team-tools {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: .5rem;
    }
    .ghost {
      font-size: .9rem;
      background: #e2e8f0;
      color: #334155;
      border: 0;
      border-radius: .4rem;
      padding: .5rem 1rem;
      font-weight: 800;
      cursor: pointer;
      font-family: inherit;
    }
    .ghost:hover { background: #cbd5e1; }
    .reset-link {
      background: none;
      border: 0;
      color: #64748b;
      font-size: .9rem;
      cursor: pointer;
      font-family: inherit;
      margin-bottom: 1.4rem;
    }
    .reset-link:hover { color: #4f46e5; }
    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.4rem;
    }
    #unit-select {
      background: #f1f5f9;
      border: 2px solid #e2e8f0;
      color: #334155;
      font-weight: 800;
      padding: .5rem 1rem;
      border-radius: .6rem;
      font-family: inherit;
    }
    #unit-select:focus { outline: none; border-color: #6366f1; }
    .timer-box {
      display: flex;
      align-items: center;
      gap: .5rem;
      background: #1e293b;
      color: #fff;
      font-weight: 800;
      padding: .5rem;
      border-radius: .6rem;
    }
    #timer-display { width: 4rem; text-align: center; font-size: 1.1rem; }
    #timer-display.timer-urgent { color: #ef4444; animation: pulse-red 1s infinite; }
    .timer-edit {
      display: flex;
      align-items: center;
      gap: .25rem;
      border-left: 1px solid #475569;
      padding-left: .5rem;
    }
    #timer-setting {
      background: #334155;
      color: #fff;
      width: 3rem;
      text-align: center;
      font-weight: 800;
      border: 0;
      border-radius: .4rem;
      font-family: inherit;
      padding: .2rem;
    }
    #timer-setting:focus { outline: 2px solid #6366f1; }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }
    .toggles { display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; }
    .toggle-wrap { display: flex; align-items: center; }
    .toggle-wrap span { margin-right: .45rem; font-size: .85rem; font-weight: 800; color: #475569; }
    .switch { position: relative; display: inline-block; width: 2.5rem; height: 1.5rem; }
    .toggle-checkbox {
      position: absolute;
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 999px;
      background: #fff;
      border: 4px solid #d1d5db;
      appearance: none;
      -webkit-appearance: none;
      cursor: pointer;
      left: 0;
      top: 0;
      margin: 0;
      z-index: 1;
    }
    .toggle-label {
      display: block;
      overflow: hidden;
      height: 1.5rem;
      border-radius: 999px;
      background: #d1d5db;
      cursor: pointer;
    }
    .toggle-checkbox:checked { right: 0; left: auto; border-color: #4f46e5; }
    .toggle-checkbox:checked + .toggle-label { background: #4f46e5; }
    .flip-card {
      perspective: 1000px;
      cursor: pointer;
      margin-bottom: 1.4rem;
      height: 350px;
    }
    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform .6s cubic-bezier(.4, .2, .2, 1);
      transform-style: preserve-3d;
      border-radius: .75rem;
      box-shadow: inset 0 2px 8px rgba(15, 23, 42, .08);
    }
    .flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
    .flip-card-front, .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      border-radius: .75rem;
    }
    .flip-card-front { background: #4f46e5; color: #fff; }
    .flip-card-back { background: #4338ca; color: #fff; transform: rotateY(180deg); }
    #image-display {
      width: 12rem;
      height: 12rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #image-display img, .word-thumb img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: .5rem;
    }
    #word-display-text, #translation-display {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 900;
      margin: 0;
      color: #fff;
    }
    .word-display-text { animation: pop-in .5s cubic-bezier(.68, -.55, .27, 1.55); }
    #flip-hint {
      color: #c7d2fe;
      margin-top: 1rem;
      font-size: .85rem;
      font-weight: 700;
      animation: pulse 1.4s infinite;
    }
    .actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    @media (min-width: 640px) {
      .actions { grid-template-columns: 1fr 1fr 1fr; }
    }
    .btn {
      width: 100%;
      color: #fff;
      font-weight: 800;
      border: 0;
      border-radius: .6rem;
      padding: .85rem 1.4rem;
      cursor: pointer;
      font-family: inherit;
      font-size: 1rem;
      box-shadow: 0 8px 16px rgba(15, 23, 42, .12);
    }
    .btn:hover { transform: scale(1.03); }
    .btn-next { background: #6366f1; }
    .btn-next:hover { background: #4338ca; }
    .btn-start { background: #10b981; }
    .btn-start:hover { background: #059669; }
    .btn-start.is-paused { background: #eab308; }
    .btn-start.is-paused:hover { background: #ca8a04; }
    .btn-reset { background: #f59e0b; }
    .btn-reset:hover { background: #d97706; }
    .btn-back { background: #6366f1; }
    .footer-tools {
      margin-top: 1.4rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    .btn-upload { background: #4b5563; font-size: .9rem; padding: .5rem 1rem; box-shadow: none; width: auto; }
    .btn-upload:hover { background: #374151; transform: none; }
    .btn-clear { background: #ef4444; font-size: .9rem; padding: .5rem 1rem; box-shadow: none; width: auto; }
    .btn-clear:hover { background: #dc2626; transform: none; }
    .list-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .list-head h2 { margin: 0; font-size: 1.4rem; color: #334155; }
    .list-hint { font-size: .9rem; color: #64748b; margin-bottom: 1rem; }
    #word-list-container {
      max-height: 70vh;
      overflow-y: auto;
      text-align: left;
      padding: 1rem;
      background: #f8fafc;
      border-radius: .6rem;
    }
    .unit-block { margin-bottom: 1.5rem; }
    .unit-block h3 {
      font-size: 1.2rem;
      color: #4338ca;
      margin: 0 0 .75rem;
      position: sticky;
      top: 0;
      background: #f8fafc;
      padding: .5rem 0;
    }
    .words-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
    @media (min-width: 768px) { .words-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (min-width: 1024px) { .words-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
    .word-card {
      background: #fff;
      padding: .75rem;
      border-radius: .6rem;
      box-shadow: 0 1px 3px rgba(15, 23, 42, .08);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
    }
    .remove-word-btn {
      position: absolute;
      top: .25rem;
      right: .25rem;
      width: 1.5rem;
      height: 1.5rem;
      background: #e2e8f0;
      color: #64748b;
      border: 0;
      border-radius: 999px;
      cursor: pointer;
    }
    .remove-word-btn:hover { background: #ef4444; color: #fff; }
    .word-card-image-trigger {
      width: 6rem;
      height: 6rem;
      background: #e2e8f0;
      border-radius: .4rem;
      margin-bottom: .5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .word-card-image-trigger:hover { background: #cbd5e1; }
    .edit-en-input, .edit-ko-input {
      background: transparent;
      border: 0;
      text-align: center;
      width: 100%;
      font-family: inherit;
      border-radius: .3rem;
      padding: .15rem;
    }
    .edit-en-input { font-weight: 800; color: #1e293b; }
    .edit-ko-input { font-size: .9rem; color: #64748b; margin-top: .2rem; }
    .edit-en-input:focus, .edit-ko-input:focus { outline: 1px solid #6366f1; background: #f8fafc; }
    .add-word-btn {
      background: transparent;
      border: 2px dashed #cbd5e1;
      padding: .75rem;
      border-radius: .6rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      font-weight: 800;
      font-size: .9rem;
    }
    .add-word-btn:hover { border-color: #6366f1; }
    .drag-over-highlight {
      outline: 3px dashed #4f46e5;
      outline-offset: 4px;
      background: #e0e7ff;
    }
    .modal {
      position: fixed;
      inset: 0;
      z-index: 50;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,.5);
      display: none;
    }
    .modal.open { display: flex; }
    .modal-card {
      background: #fff;
      border-radius: .75rem;
      box-shadow: 0 20px 40px rgba(15, 23, 42, .2);
      padding: 1.4rem;
      width: min(24rem, calc(100% - 2rem));
      text-align: left;
    }
    .modal-card h3 { margin: 0 0 .4rem; }
    .modal-card p { color: #475569; margin: 0 0 1.2rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: .75rem; }
    .btn-cancel { background: #e2e8f0; color: #1e293b; box-shadow: none; width: auto; }
    .btn-danger { background: #dc2626; box-shadow: none; width: auto; }
    .loading {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,.8);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1rem;
      z-index: 40;
    }
    @keyframes pop-in {
      0% { transform: scale(.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulse-red {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .55; }
    }
    @media (max-width: 700px) {
      .shell { padding: 1rem; }
      .scoreboard.cols-3 { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <div id="loading-overlay" class="loading hidden">
      <p id="loading-text">Loading…</p>
    </div>
    <div class="header">
      <input type="text" id="game-title" value="__TITLE__" readonly>
      <button type="button" id="view-words-btn" title="View Word Lists">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
      </button>
    </div>
    <p class="sub">Guess the word before the timer runs out!</p>

    <div id="game-view">
      <div id="scoreboard-container" class="scoreboard cols-2"></div>
      <div class="team-tools">
        <button type="button" id="add-team-btn" class="ghost">+ Add Team</button>
        <button type="button" id="remove-team-btn" class="ghost">- Remove Team</button>
      </div>
      <button type="button" id="reset-scores-btn" class="reset-link">Reset All Scores</button>
      <div class="controls">
        <select id="unit-select"><option value="all">All Units</option></select>
        <div class="timer-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span id="timer-display">01:00</span>
          <div class="timer-edit">
            <input type="number" id="timer-setting" value="60" min="10" max="300" step="5" title="Set timer in seconds">
            <span style="color:#94a3b8;font-size:.85rem">sec</span>
          </div>
        </div>
        <div class="toggles">
          <div class="toggle-wrap">
            <span>English</span>
            <div class="switch">
              <input type="checkbox" id="english-toggle" class="toggle-checkbox" checked>
              <label for="english-toggle" class="toggle-label"></label>
            </div>
          </div>
          <div class="toggle-wrap">
            <span>Korean</span>
            <div class="switch">
              <input type="checkbox" id="korean-toggle" class="toggle-checkbox">
              <label for="korean-toggle" class="toggle-label"></label>
            </div>
          </div>
          <div class="toggle-wrap">
            <span>Images</span>
            <div class="switch">
              <input type="checkbox" id="image-toggle" class="toggle-checkbox" checked>
              <label for="image-toggle" class="toggle-label"></label>
            </div>
          </div>
        </div>
      </div>
      <div id="word-container" class="flip-card">
        <div id="flip-card-inner" class="flip-card-inner">
          <div class="flip-card-front">
            <div id="image-display" class="hidden"></div>
            <p id="word-display-text">Click 'Next Word' to Start!</p>
            <p id="flip-hint" class="hidden">(Click card to flip)</p>
          </div>
          <div class="flip-card-back">
            <p id="translation-display"></p>
          </div>
        </div>
      </div>
      <div class="actions">
        <button type="button" id="next-word-btn" class="btn btn-next">Next Word</button>
        <button type="button" id="start-pause-btn" class="btn btn-start">Start</button>
        <button type="button" id="reset-timer-btn" class="btn btn-reset">Reset Timer</button>
      </div>
      <div class="footer-tools">
        <button type="button" id="upload-images-btn" class="btn btn-upload">Upload Custom Images</button>
        <button type="button" id="clear-images-btn" class="btn btn-clear hidden">Clear Images</button>
        <input type="file" id="image-upload-input" multiple accept="image/*" class="hidden">
      </div>
    </div>

    <div id="word-list-view" class="hidden">
      <div class="list-head">
        <h2>Vocabulary Word Lists</h2>
        <button type="button" id="back-to-game-btn" class="btn btn-back" style="width:auto">Back to Game</button>
      </div>
      <div class="list-hint">Click a card to upload, or drag and drop an image onto a card. You can also paste an image named like the word (for example, tall.jpg).</div>
      <div id="word-list-container"></div>
      <input type="file" id="word-list-image-upload" accept="image/*" class="hidden">
    </div>
  </div>

  <div id="confirmation-modal" class="modal">
    <div class="modal-card">
      <h3 id="modal-title">Are you sure?</h3>
      <p id="modal-message">This action cannot be undone.</p>
      <div class="modal-actions">
        <button type="button" id="modal-cancel-btn" class="btn btn-cancel">Cancel</button>
        <button type="button" id="modal-confirm-btn" class="btn btn-danger">Confirm</button>
      </div>
    </div>
  </div>

  <script>
    const GAME_TITLE = __TITLE_JSON__;
    const GAME_LEVEL = __LEVEL_JSON__;
    const GAME_BOOK = __BOOK_JSON__;
    const DOWNLOAD_NAME = __DOWNLOAD_NAME_JSON__;
    const IMAGE_KEY_PREFIX = __STORAGE_KEY_JSON__;
    const vocabByUnit = __VOCAB_BY_UNIT__;
    const TEAM_TONES = ["blue", "rose", "amber", "teal", "violet", "lime"];

    function playTimeUpBeep() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        function tone(freq, start, dur) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = freq;
          osc.type = "sine";
          gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
          gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + start);
          osc.stop(ctx.currentTime + start + dur + 0.02);
        }
        tone(261.6, 0, 0.18);
        tone(196, 0.2, 0.18);
      } catch (e) {}
    }

    const els = {
      loadingOverlay: document.getElementById("loading-overlay"),
      loadingText: document.getElementById("loading-text"),
      gameView: document.getElementById("game-view"),
      gameTitle: document.getElementById("game-title"),
      wordListView: document.getElementById("word-list-view"),
      viewWordsBtn: document.getElementById("view-words-btn"),
      backToGameBtn: document.getElementById("back-to-game-btn"),
      wordListContainer: document.getElementById("word-list-container"),
      wordListImageUpload: document.getElementById("word-list-image-upload"),
      scoreboardContainer: document.getElementById("scoreboard-container"),
      addTeamBtn: document.getElementById("add-team-btn"),
      removeTeamBtn: document.getElementById("remove-team-btn"),
      resetScoresBtn: document.getElementById("reset-scores-btn"),
      unitSelect: document.getElementById("unit-select"),
      timerDisplay: document.getElementById("timer-display"),
      timerSetting: document.getElementById("timer-setting"),
      wordContainer: document.getElementById("word-container"),
      flipHint: document.getElementById("flip-hint"),
      imageDisplay: document.getElementById("image-display"),
      wordDisplayText: document.getElementById("word-display-text"),
      translationDisplay: document.getElementById("translation-display"),
      englishToggle: document.getElementById("english-toggle"),
      koreanToggle: document.getElementById("korean-toggle"),
      imageToggle: document.getElementById("image-toggle"),
      nextWordBtn: document.getElementById("next-word-btn"),
      startPauseBtn: document.getElementById("start-pause-btn"),
      resetTimerBtn: document.getElementById("reset-timer-btn"),
      uploadImagesBtn: document.getElementById("upload-images-btn"),
      clearImagesBtn: document.getElementById("clear-images-btn"),
      imageUploadInput: document.getElementById("image-upload-input"),
      modal: document.getElementById("confirmation-modal"),
      modalTitle: document.getElementById("modal-title"),
      modalMessage: document.getElementById("modal-message"),
      modalConfirmBtn: document.getElementById("modal-confirm-btn"),
      modalCancelBtn: document.getElementById("modal-cancel-btn")
    };

    let teams = [{ name: "Team 1", score: 0 }, { name: "Team 2", score: 0 }];
    let currentUnit = "all";
    let lastWord = {};
    let shownWords = {};
    let timer = null;
    let timeLeft = 60;
    let isTimerRunning = false;
    let isPaused = false;
    let imageCache = {};
    let wordToUploadFor = null;
    let lastDragTarget = null;
    let modalConfirmCallback = null;

    function imageKey(wordId) {
      return IMAGE_KEY_PREFIX + String(wordId || "").toLowerCase();
    }

    function showLoading(message) {
      if (!els.loadingOverlay) return;
      els.loadingText.textContent = message;
      els.loadingOverlay.classList.remove("hidden");
    }
    function hideLoading() {
      if (!els.loadingOverlay) return;
      els.loadingOverlay.classList.add("hidden");
    }
    function showConfirmationModal(title, message, onConfirm) {
      els.modalTitle.textContent = title;
      els.modalMessage.textContent = message;
      modalConfirmCallback = onConfirm;
      els.modal.classList.add("open");
    }
    function hideConfirmationModal() {
      els.modal.classList.remove("open");
      modalConfirmCallback = null;
    }
    function updateScores() {
      document.querySelectorAll(".team-score").forEach(function (el, index) {
        if (teams[index]) el.textContent = teams[index].score;
      });
    }
    function renderScoreboard() {
      const count = teams.length;
      els.scoreboardContainer.className = "scoreboard cols-" + count + (count > 4 ? " small" : "");
      els.scoreboardContainer.innerHTML = "";
      teams.forEach(function (team, index) {
        const tone = TEAM_TONES[index % TEAM_TONES.length];
        const card = document.createElement("div");
        card.className = "team-card tone-" + tone;
        card.innerHTML =
          '<input type="text" value="' + team.name.replace(/"/g, "&quot;") + '" data-index="' + index + '" class="team-name-input">' +
          '<p class="team-score">' + team.score + "</p>" +
          '<div class="point-row">' +
          '<button type="button" data-index="' + index + '" class="add-point-btn">+1</button>' +
          '<button type="button" data-index="' + index + '" class="minus-point-btn">-1</button>' +
          "</div>";
        els.scoreboardContainer.appendChild(card);
      });
    }
    function populateUnits() {
      els.unitSelect.innerHTML = "";
      const allOption = document.createElement("option");
      allOption.value = "all";
      allOption.textContent = "All Units";
      els.unitSelect.appendChild(allOption);
      const unitKeys = Object.keys(vocabByUnit || {});
      els.unitSelect.disabled = unitKeys.length === 0;
      unitKeys.forEach(function (unitId) {
        const option = document.createElement("option");
        option.value = unitId;
        option.textContent = (vocabByUnit[unitId] && vocabByUnit[unitId].name) || unitId;
        els.unitSelect.appendChild(option);
      });
    }
    function updateWordCardDisplay() {
      if (!lastWord.en) return;
      const showEn = els.englishToggle.checked;
      const showKo = els.koreanToggle.checked;
      const showImg = els.imageToggle.checked;
      const imageUrl = imageCache[String(lastWord.en).toLowerCase()];
      els.wordDisplayText.classList.add("hidden");
      els.translationDisplay.classList.add("hidden");
      els.imageDisplay.classList.add("hidden");
      els.flipHint.classList.add("hidden");
      els.imageDisplay.innerHTML = "";
      if (showEn) {
        els.wordDisplayText.classList.remove("hidden");
        els.flipHint.classList.remove("hidden");
      }
      if (showKo) {
        els.translationDisplay.classList.remove("hidden");
        if (!showEn) els.flipHint.classList.remove("hidden");
      }
      if (showImg) {
        if (imageUrl) {
          const img = document.createElement("img");
          img.src = imageUrl;
          img.alt = lastWord.en;
          els.imageDisplay.appendChild(img);
          els.imageDisplay.classList.remove("hidden");
          els.flipHint.classList.remove("hidden");
        } else if (!showEn) {
          els.wordDisplayText.classList.remove("hidden");
          els.flipHint.classList.remove("hidden");
        }
      }
    }
    function displayNewWord() {
      if (!vocabByUnit || !Object.keys(vocabByUnit).length) {
        els.wordDisplayText.textContent = "No Words Available!";
        return;
      }
      els.wordContainer.classList.remove("flipped");
      var allWordsInUnit = currentUnit === "all"
        ? Object.keys(vocabByUnit).reduce(function (acc, id) {
            return acc.concat((vocabByUnit[id] && vocabByUnit[id].words) || []);
          }, [])
        : ((vocabByUnit[currentUnit] && vocabByUnit[currentUnit].words) || []);
      if (!allWordsInUnit.length) {
        els.wordDisplayText.textContent = "No words in this unit!";
        return;
      }
      if (!shownWords[currentUnit]) shownWords[currentUnit] = [];
      var available = allWordsInUnit.filter(function (word) {
        return shownWords[currentUnit].indexOf(word.en) === -1;
      });
      if (!available.length) {
        shownWords[currentUnit] = [];
        available = allWordsInUnit;
      }
      var newWord = available[Math.floor(Math.random() * available.length)];
      shownWords[currentUnit].push(newWord.en);
      lastWord = newWord;
      els.wordDisplayText.textContent = newWord.en;
      els.translationDisplay.textContent = newWord.ko;
      updateWordCardDisplay();
      els.wordDisplayText.classList.remove("word-display-text");
      setTimeout(function () { els.wordDisplayText.classList.add("word-display-text"); }, 10);
    }
    function handleResetTimer() {
      clearInterval(timer);
      isTimerRunning = false;
      isPaused = false;
      timeLeft = parseInt(els.timerSetting.value, 10) || 60;
      els.timerSetting.disabled = false;
      updateTimerDisplay();
      els.startPauseBtn.textContent = "Start";
      els.startPauseBtn.classList.remove("is-paused");
    }
    function updateTimerDisplay() {
      var minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
      var seconds = (timeLeft % 60).toString().padStart(2, "0");
      els.timerDisplay.textContent = minutes + ":" + seconds;
      if (timeLeft <= 10 && timeLeft > 0) els.timerDisplay.classList.add("timer-urgent");
      else els.timerDisplay.classList.remove("timer-urgent");
    }
    function handleStartPause() {
      if (isTimerRunning) {
        clearInterval(timer);
        isTimerRunning = false;
        isPaused = true;
        els.startPauseBtn.textContent = "Resume";
        els.startPauseBtn.classList.add("is-paused");
        return;
      }
      if (!isPaused) timeLeft = parseInt(els.timerSetting.value, 10) || 60;
      els.timerSetting.disabled = true;
      isTimerRunning = true;
      isPaused = false;
      els.startPauseBtn.textContent = "Pause";
      els.startPauseBtn.classList.remove("is-paused");
      timer = setInterval(function () {
        timeLeft -= 1;
        updateTimerDisplay();
        if (timeLeft <= 0) {
          handleResetTimer();
          els.wordDisplayText.textContent = "Time's Up!";
          playTimeUpBeep();
        }
      }, 1000);
    }
    function processAndSaveImage(file, wordKey) {
      if (!file || !file.type || file.type.indexOf("image/") !== 0 || !wordKey) return;
      var wordId = String(wordKey).toLowerCase();
      var reader = new FileReader();
      reader.onload = function (e) {
        imageCache[wordId] = e.target.result;
        try {
          localStorage.setItem(imageKey(wordId), e.target.result);
          els.clearImagesBtn.classList.remove("hidden");
        } catch (err) {
          alert("Could not save image. Storage may be full.");
          delete imageCache[wordId];
        }
        if (!els.wordListView.classList.contains("hidden")) renderWordListPage();
      };
      reader.readAsDataURL(file);
    }
    function loadImagesFromLocalStorage() {
      var found = false;
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf(IMAGE_KEY_PREFIX) === 0) {
          var wordId = key.slice(IMAGE_KEY_PREFIX.length);
          imageCache[wordId] = localStorage.getItem(key);
          found = true;
        }
      }
      if (found) els.clearImagesBtn.classList.remove("hidden");
    }
    function clearAllImages() {
      showConfirmationModal("Delete All Images?", "This will permanently delete all your uploaded images from this browser.", function () {
        var keysToRemove = [];
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key && key.indexOf(IMAGE_KEY_PREFIX) === 0) keysToRemove.push(key);
        }
        keysToRemove.forEach(function (key) { localStorage.removeItem(key); });
        imageCache = {};
        els.imageDisplay.innerHTML = "";
        els.imageDisplay.classList.add("hidden");
        els.clearImagesBtn.classList.add("hidden");
        if (!els.wordListView.classList.contains("hidden")) renderWordListPage();
      });
    }
    function handleBulkImageUpload(event) {
      var files = event.target.files;
      if (!files || !files.length) return;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var wordKey = file.name.split(".").slice(0, -1).join(".");
        processAndSaveImage(file, wordKey);
      }
      alert(files.length + " image(s) are being processed.");
    }
    function renderWordListPage() {
      els.wordListContainer.innerHTML = "";
      var ids = Object.keys(vocabByUnit || {});
      if (!ids.length) {
        els.wordListContainer.innerHTML = '<p style="text-align:center;color:#64748b">No word list loaded.</p>';
        return;
      }
      ids.forEach(function (unitId) {
        var unit = vocabByUnit[unitId];
        var section = document.createElement("div");
        section.className = "unit-block";
        var header = document.createElement("h3");
        header.textContent = unit.name;
        section.appendChild(header);
        var grid = document.createElement("div");
        grid.className = "words-grid";
        (unit.words || []).forEach(function (word, index) {
          var card = document.createElement("div");
          card.className = "word-card";
          var removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "remove-word-btn";
          removeBtn.innerHTML = "&times;";
          removeBtn.title = "Remove Word";
          removeBtn.dataset.unitId = unitId;
          removeBtn.dataset.wordIndex = String(index);
          var imageEl = document.createElement("div");
          imageEl.className = "word-card-image-trigger";
          imageEl.dataset.wordEn = word.en;
          var imageUrl = imageCache[String(word.en).toLowerCase()];
          if (imageUrl) {
            var img = document.createElement("img");
            img.src = imageUrl;
            img.alt = word.en;
            imageEl.appendChild(img);
          } else {
            imageEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
          }
          var enInput = document.createElement("input");
          enInput.type = "text";
          enInput.className = "edit-en-input";
          enInput.value = word.en;
          enInput.dataset.unitId = unitId;
          enInput.dataset.wordIndex = String(index);
          var koInput = document.createElement("input");
          koInput.type = "text";
          koInput.className = "edit-ko-input";
          koInput.value = word.ko;
          koInput.dataset.unitId = unitId;
          koInput.dataset.wordIndex = String(index);
          card.appendChild(removeBtn);
          card.appendChild(imageEl);
          card.appendChild(enInput);
          card.appendChild(koInput);
          grid.appendChild(card);
        });
        var addCard = document.createElement("div");
        addCard.className = "add-word-btn";
        addCard.dataset.unitId = unitId;
        addCard.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg><span>Add Word</span>';
        grid.appendChild(addCard);
        section.appendChild(grid);
        els.wordListContainer.appendChild(section);
      });
    }

    function setupEventListeners() {
      els.scoreboardContainer.addEventListener("click", function (e) {
        var index = e.target.dataset.index;
        if (index === undefined) return;
        if (e.target.classList.contains("add-point-btn")) teams[index].score += 1;
        else if (e.target.classList.contains("minus-point-btn") && teams[index].score > 0) teams[index].score -= 1;
        updateScores();
      });
      els.scoreboardContainer.addEventListener("input", function (e) {
        var index = e.target.dataset.index;
        if (index !== undefined && e.target.classList.contains("team-name-input")) {
          teams[index].name = e.target.value;
        }
      });
      els.addTeamBtn.addEventListener("click", function () {
        if (teams.length < 6) {
          teams.push({ name: "Team " + (teams.length + 1), score: 0 });
          renderScoreboard();
        }
      });
      els.removeTeamBtn.addEventListener("click", function () {
        if (teams.length > 1) {
          teams.pop();
          renderScoreboard();
        }
      });
      els.resetScoresBtn.addEventListener("click", function () {
        showConfirmationModal("Reset Scores?", "Are you sure you want to reset all team scores to 0?", function () {
          teams.forEach(function (team) { team.score = 0; });
          updateScores();
        });
      });
      els.unitSelect.addEventListener("change", function (e) {
        currentUnit = e.target.value;
        els.wordDisplayText.textContent = "Click 'Next Word'!";
        els.translationDisplay.classList.add("hidden");
        els.wordContainer.classList.remove("flipped");
        handleResetTimer();
      });
      els.nextWordBtn.addEventListener("click", function () {
        displayNewWord();
        handleResetTimer();
      });
      els.startPauseBtn.addEventListener("click", handleStartPause);
      els.resetTimerBtn.addEventListener("click", handleResetTimer);
      els.timerSetting.addEventListener("input", function () {
        if (!isTimerRunning && !isPaused) {
          timeLeft = parseInt(els.timerSetting.value, 10) || 60;
          updateTimerDisplay();
        }
      });
      els.uploadImagesBtn.addEventListener("click", function () { els.imageUploadInput.click(); });
      els.imageUploadInput.addEventListener("change", handleBulkImageUpload);
      els.clearImagesBtn.addEventListener("click", clearAllImages);
      els.wordContainer.addEventListener("click", function () {
        if (lastWord.en) els.wordContainer.classList.toggle("flipped");
      });
      function handleToggleChange(event) {
        var toggles = [els.englishToggle, els.koreanToggle, els.imageToggle];
        var checkedCount = toggles.filter(function (t) { return t.checked; }).length;
        if (checkedCount === 0) {
          event.target.checked = true;
          return;
        }
        updateWordCardDisplay();
      }
      els.englishToggle.addEventListener("change", handleToggleChange);
      els.koreanToggle.addEventListener("change", handleToggleChange);
      els.imageToggle.addEventListener("change", handleToggleChange);
      els.viewWordsBtn.addEventListener("click", function () {
        els.gameView.classList.add("hidden");
        renderWordListPage();
        els.wordListView.classList.remove("hidden");
      });
      els.backToGameBtn.addEventListener("click", function () {
        els.wordListView.classList.add("hidden");
        els.gameView.classList.remove("hidden");
      });
      els.wordListContainer.addEventListener("click", function (e) {
        var addBtn = e.target.closest(".add-word-btn");
        if (addBtn) {
          vocabByUnit[addBtn.dataset.unitId].words.push({ en: "New Word", ko: "새 단어" });
          renderWordListPage();
          return;
        }
        var removeBtn = e.target.closest(".remove-word-btn");
        if (removeBtn) {
          var unitId = removeBtn.dataset.unitId;
          var wordIndex = removeBtn.dataset.wordIndex;
          var wordEn = vocabByUnit[unitId].words[wordIndex].en;
          showConfirmationModal("Remove Word?", 'Are you sure you want to remove "' + wordEn + '"?', function () {
            vocabByUnit[unitId].words.splice(wordIndex, 1);
            renderWordListPage();
          });
          return;
        }
        var trigger = e.target.closest(".word-card-image-trigger");
        if (trigger) {
          wordToUploadFor = trigger.dataset.wordEn;
          els.wordListImageUpload.click();
        }
      });
      els.wordListImageUpload.addEventListener("change", function (event) {
        var file = event.target.files[0];
        if (!file || !wordToUploadFor) return;
        processAndSaveImage(file, wordToUploadFor);
        wordToUploadFor = null;
        event.target.value = "";
      });
      els.wordListContainer.addEventListener("dragover", function (e) {
        e.preventDefault();
        var target = e.target.closest(".word-card-image-trigger");
        if (target) {
          if (lastDragTarget && lastDragTarget !== target) lastDragTarget.classList.remove("drag-over-highlight");
          target.classList.add("drag-over-highlight");
          lastDragTarget = target;
        }
      });
      els.wordListContainer.addEventListener("dragleave", function () {
        if (lastDragTarget) {
          lastDragTarget.classList.remove("drag-over-highlight");
          lastDragTarget = null;
        }
      });
      els.wordListContainer.addEventListener("drop", function (e) {
        e.preventDefault();
        if (lastDragTarget) lastDragTarget.classList.remove("drag-over-highlight");
        var target = e.target.closest(".word-card-image-trigger");
        var files = e.dataTransfer.files;
        if (target && files.length > 0) processAndSaveImage(files[0], target.dataset.wordEn);
        lastDragTarget = null;
      });
      els.wordListContainer.addEventListener("paste", function (e) {
        var items = e.clipboardData.items;
        var found = false;
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            var file = items[i].getAsFile();
            var wordKey = file.name.split(".").slice(0, -1).join(".");
            if (wordKey) {
              processAndSaveImage(file, wordKey);
              found = true;
            }
          }
        }
        if (found) alert("Pasted image(s) are being processed based on their filename.");
      });
      els.wordListContainer.addEventListener("change", function (e) {
        if (e.target.classList.contains("edit-en-input")) {
          var unitId = e.target.dataset.unitId;
          var wordIndex = e.target.dataset.wordIndex;
          var oldEn = vocabByUnit[unitId].words[wordIndex].en;
          var newEn = e.target.value.trim();
          if (newEn && oldEn !== newEn) {
            vocabByUnit[unitId].words[wordIndex].en = newEn;
            var oldKey = oldEn.toLowerCase();
            var newKey = newEn.toLowerCase();
            if (imageCache[oldKey]) {
              imageCache[newKey] = imageCache[oldKey];
              delete imageCache[oldKey];
              try {
                localStorage.setItem(imageKey(newKey), imageCache[newKey]);
                localStorage.removeItem(imageKey(oldKey));
              } catch (err) {}
            }
            var trigger = e.target.closest(".word-card").querySelector(".word-card-image-trigger");
            if (trigger) trigger.dataset.wordEn = newEn;
          }
        }
        if (e.target.classList.contains("edit-ko-input")) {
          vocabByUnit[e.target.dataset.unitId].words[e.target.dataset.wordIndex].ko = e.target.value.trim();
        }
      });
      els.modalCancelBtn.addEventListener("click", hideConfirmationModal);
      els.modalConfirmBtn.addEventListener("click", function () {
        if (modalConfirmCallback) modalConfirmCallback();
        hideConfirmationModal();
      });
    }

    els.gameTitle.value = GAME_TITLE;
    document.title = GAME_TITLE;
    setupEventListeners();
    populateUnits();
    renderScoreboard();
    handleResetTimer();
    loadImagesFromLocalStorage();
    hideLoading();
  </script>
</body>
</html>
`,
    teamMatch: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap");
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body {
      font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif;
      background: #e2e8f0;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1rem;
      perspective: 1000px;
    }
    .shell {
      width: 100%;
      max-width: 64rem;
      margin: 0 auto;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.18);
      padding: 1.75rem;
      text-align: center;
    }
    h1 {
      margin: 0 0 0.35rem;
      font-size: clamp(1.6rem, 4vw, 2.25rem);
      font-weight: 900;
      color: #0f766e;
    }
    .sub { color: #64748b; margin: 0 0 1.4rem; }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.25rem;
      background: #f1f5f9;
      padding: 1rem;
      border-radius: 0.75rem;
    }
    .toolbar-left, .toolbar-right {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }
    #unit-select {
      background: #fff;
      border: 2px solid #e2e8f0;
      color: #334155;
      font: inherit;
      font-weight: 800;
      padding: 0.5rem 1rem;
      border-radius: 0.6rem;
    }
    #unit-select:focus { outline: none; border-color: #14b8a6; }
    .btn {
      appearance: none;
      border: 0;
      border-radius: 0.6rem;
      padding: 0.5rem 1rem;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
      color: #fff;
    }
    .btn-teal { background: #14b8a6; box-shadow: 0 8px 16px rgba(20, 184, 166, 0.25); }
    .btn-teal:hover { background: #0d9488; }
    .btn-blue { background: #3b82f6; }
    .btn-blue:hover { background: #2563eb; }
    .btn-red { background: #ef4444; }
    .btn-red:hover { background: #dc2626; }
    .btn:disabled { opacity: 0.45; cursor: not-allowed; }
    .stat { color: #475569; font-weight: 800; }
    .stat span { color: #0d9488; font-size: 1.25rem; }
    .scoreboard-wrap {
      margin-bottom: 1.25rem;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 0.75rem;
    }
    .scoreboard-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .scoreboard-head h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 900;
      color: #334155;
    }
    .team-tools { display: flex; gap: 0.5rem; }
    #teams-container {
      display: grid;
      gap: 1rem;
    }
    #teams-container.cols-1 { grid-template-columns: 1fr; }
    #teams-container.cols-2 { grid-template-columns: 1fr 1fr; }
    #teams-container.cols-3 { grid-template-columns: repeat(3, 1fr); }
    #teams-container.cols-4 { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 768px) {
      #teams-container.cols-4 { grid-template-columns: repeat(4, 1fr); }
    }
    .team-card {
      background: #fff;
      padding: 0.75rem;
      border-radius: 0.6rem;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .team-card input {
      width: 100%;
      text-align: center;
      font: inherit;
      font-weight: 800;
      color: #334155;
      background: #f1f5f9;
      border: 2px solid transparent;
      border-radius: 0.4rem;
      padding: 0.25rem;
    }
    .team-card input:focus { outline: none; border-color: #14b8a6; }
    .team-score { font-size: 2.25rem; font-weight: 900; color: #0d9488; }
    .score-row { display: flex; gap: 0.5rem; width: 100%; }
    .score-btn {
      flex: 1;
      border: 0;
      border-radius: 0.4rem;
      font: inherit;
      font-weight: 800;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.15rem 0;
    }
    .score-btn:active { transform: scale(0.94); }
    .score-minus { background: #fecaca; color: #991b1b; }
    .score-minus:hover { background: #fca5a5; }
    .score-plus { background: #bbf7d0; color: #166534; }
    .score-plus:hover { background: #86efac; }
    .grid-hint {
      margin: 0 0 0.65rem;
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 800;
    }
    .match-grid {
      display: grid;
      grid-template-columns: 2.1rem repeat(4, minmax(0, 1fr));
      grid-template-rows: 2.1rem repeat(4, minmax(5.4rem, 1fr));
      gap: 0.55rem;
      align-items: stretch;
    }
    .grid-label {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      color: #0f766e;
      font-size: 1.05rem;
      letter-spacing: 0.04em;
      user-select: none;
    }
    .grid-label.col { padding-bottom: 0.1rem; }
    .grid-corner { visibility: hidden; }
    .grid-slot { min-width: 0; min-height: 0; }
    .card {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 5.4rem;
      cursor: pointer;
      transform-style: preserve-3d;
      transition: transform 0.6s;
    }
    .card.is-empty {
      cursor: default;
      pointer-events: none;
      opacity: 0.28;
    }
    .card.is-flipped { transform: rotateY(180deg); }
    .card.is-matched {
      transform: rotateY(180deg) scale(0.95);
      opacity: 0.5;
      box-shadow: none;
      cursor: default;
    }
    .card-face {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.6rem;
      padding: 0.5rem;
      text-align: center;
      font-weight: 800;
    }
    .card-coord {
      position: absolute;
      top: 0.35rem;
      left: 0.45rem;
      font-size: 0.78rem;
      font-weight: 900;
      letter-spacing: 0.04em;
      color: rgba(255, 255, 255, 0.92);
    }
    .card-face-front {
      background: #14b8a6;
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
      flex-direction: column;
      gap: 0.15rem;
    }
    .card-face-back {
      background: #f8fafc;
      color: #1e293b;
      transform: rotateY(180deg);
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
    }
    .card-face-back.is-ko { font-size: 1.05rem; }
    .card-face-back.is-en { font-size: 1.2rem; }
    .modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 20;
    }
    .modal.hidden { display: none; }
    .modal-card {
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 25px 50px rgba(15, 23, 42, 0.2);
      padding: 2rem;
      text-align: center;
      max-width: 24rem;
      width: calc(100% - 2rem);
      transform: scale(0.95);
      opacity: 0;
      transition: transform 0.2s, opacity 0.2s;
    }
    .modal-card.is-open { transform: scale(1); opacity: 1; }
    .modal-card h2 { margin: 0 0 0.75rem; font-size: 2.25rem; font-weight: 900; color: #eab308; }
    .modal-card p { margin: 0 0 0.5rem; color: #475569; font-size: 1.05rem; }
    .modal-card .btn { margin-top: 1rem; padding: 0.75rem 2rem; font-size: 1.1rem; }
    @media (max-width: 640px) {
      .shell { padding: 1rem; }
      #teams-container.cols-3 { grid-template-columns: 1fr 1fr; }
      .match-grid {
        grid-template-columns: 1.6rem repeat(4, minmax(0, 1fr));
        grid-template-rows: 1.7rem repeat(4, minmax(4.6rem, 1fr));
        gap: 0.4rem;
      }
      .card { min-height: 4.6rem; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <h1 id="title">__TITLE__</h1>
    <p class="sub">Find the matching English and Korean words!</p>
    <p class="grid-hint">Call a square by row and column: A1, B3, D4.</p>

    <div class="toolbar">
      <div class="toolbar-left">
        <select id="unit-select"></select>
        <button type="button" class="btn btn-teal" id="start-game-btn">New Game</button>
      </div>
      <div class="toolbar-right">
        <div class="stat">Turns: <span id="turns-count">0</span></div>
        <div class="stat">Matches: <span id="matches-count">0</span> / <span id="total-matches">0</span></div>
      </div>
    </div>

    <div class="scoreboard-wrap">
      <div class="scoreboard-head">
        <h2>Scoreboard</h2>
        <div class="team-tools">
          <button type="button" class="btn btn-blue" id="add-team-btn">Add Team</button>
          <button type="button" class="btn btn-red" id="remove-team-btn">Remove Team</button>
        </div>
      </div>
      <div id="teams-container" class="cols-2"></div>
    </div>

    <div class="match-grid" id="game-board" aria-label="Matching grid, columns 1 to 4, rows A to D"></div>
  </div>

  <div id="win-modal" class="modal hidden">
    <div class="modal-card" id="win-modal-content">
      <h2>You Win!</h2>
      <p>Excellent memory!</p>
      <p id="win-stats">You completed the level in X turns.</p>
      <button type="button" class="btn btn-teal" id="play-again-btn">Play Again</button>
    </div>
  </div>

  <script>
    var TITLE = __TITLE_JSON__;
    var vocabByUnit = __VOCAB_BY_UNIT__;
    document.getElementById("title").textContent = TITLE;

    var unitSelect = document.getElementById("unit-select");
    var startGameBtn = document.getElementById("start-game-btn");
    var gameBoard = document.getElementById("game-board");
    var turnsCountEl = document.getElementById("turns-count");
    var matchesCountEl = document.getElementById("matches-count");
    var totalMatchesEl = document.getElementById("total-matches");
    var winModal = document.getElementById("win-modal");
    var winModalContent = document.getElementById("win-modal-content");
    var winStats = document.getElementById("win-stats");
    var playAgainBtn = document.getElementById("play-again-btn");
    var teamsContainer = document.getElementById("teams-container");
    var addTeamBtn = document.getElementById("add-team-btn");
    var removeTeamBtn = document.getElementById("remove-team-btn");

    var unitKeys = Object.keys(vocabByUnit || {});
    var allWords = unitKeys.reduce(function (acc, key) {
      return acc.concat((vocabByUnit[key] && vocabByUnit[key].words) || []);
    }, []);
    vocabByUnit.all = { name: "All Units (Random)", words: allWords };

    var currentUnit = "all";
    var hasFlippedCard = false;
    var lockBoard = false;
    var firstCard = null;
    var secondCard = null;
    var turns = 0;
    var matchesFound = 0;
    var totalMatches = 0;
    var teams = [];
    var MAX_TEAMS = 4;
    var MIN_TEAMS = 2;
    var GRID_COLS = 4;
    var GRID_ROWS = ["A", "B", "C", "D"];
    var GRID_PAIRS = 8;

    function escapeHtml(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function shuffle(arr) {
      var copy = arr.slice();
      for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = copy[i];
        copy[i] = copy[j];
        copy[j] = t;
      }
      return copy;
    }

    function initializeTeams() {
      teams = [
        { id: 1, name: "Team 1", score: 0 },
        { id: 2, name: "Team 2", score: 0 }
      ];
      renderScoreboard();
    }

    function renderScoreboard() {
      teamsContainer.className = "cols-" + teams.length;
      teamsContainer.innerHTML = "";
      teams.forEach(function (team) {
        var card = document.createElement("div");
        card.className = "team-card";
        card.innerHTML =
          '<input type="text" value="' + escapeHtml(team.name) + '" data-id="' + team.id + '">' +
          '<div class="team-score">' + team.score + "</div>" +
          '<div class="score-row">' +
            '<button type="button" class="score-btn score-minus" data-id="' + team.id + '" data-action="subtract">-</button>' +
            '<button type="button" class="score-btn score-plus" data-id="' + team.id + '" data-action="add">+</button>' +
          "</div>";
        teamsContainer.appendChild(card);
      });
      updateTeamButtonStates();
    }

    function populateUnits() {
      unitSelect.innerHTML = "";
      var order = ["all"].concat(unitKeys);
      order.forEach(function (unitId) {
        if (!vocabByUnit[unitId]) return;
        var option = document.createElement("option");
        option.value = unitId;
        option.textContent = vocabByUnit[unitId].name;
        unitSelect.appendChild(option);
      });
      unitSelect.value = currentUnit;
    }

    function createBoard() {
      gameBoard.innerHTML = "";
      turns = 0;
      matchesFound = 0;
      lockBoard = false;
      hasFlippedCard = false;
      firstCard = null;
      secondCard = null;

      var unit = vocabByUnit[currentUnit] || vocabByUnit.all;
      var allUnitWords = ((unit && unit.words) || []).filter(function (w) { return w && w.en && w.ko; });
      var wordsForGame = shuffle(allUnitWords).slice(0, GRID_PAIRS);
      totalMatches = wordsForGame.length;

      var cardData = [];
      wordsForGame.forEach(function (word, index) {
        cardData.push({ lang: "en", text: word.en, pairId: index });
        cardData.push({ lang: "ko", text: word.ko, pairId: index });
      });
      cardData = shuffle(cardData);

      var corner = document.createElement("div");
      corner.className = "grid-corner";
      corner.setAttribute("aria-hidden", "true");
      gameBoard.appendChild(corner);
      for (var col = 1; col <= GRID_COLS; col++) {
        var colLabel = document.createElement("div");
        colLabel.className = "grid-label col";
        colLabel.textContent = String(col);
        gameBoard.appendChild(colLabel);
      }

      var slot = 0;
      GRID_ROWS.forEach(function (rowLetter) {
        var rowLabel = document.createElement("div");
        rowLabel.className = "grid-label row";
        rowLabel.textContent = rowLetter;
        gameBoard.appendChild(rowLabel);
        for (var c = 1; c <= GRID_COLS; c++) {
          var coord = rowLetter + String(c);
          var holder = document.createElement("div");
          holder.className = "grid-slot";
          var data = cardData[slot];
          var card = document.createElement("div");
          if (!data) {
            card.className = "card is-empty";
            card.innerHTML =
              '<div class="card-face card-face-front"><span class="card-coord">' + coord + "</span></div>";
          } else {
            card.className = "card";
            card.dataset.pairId = String(data.pairId);
            card.dataset.coord = coord;
            card.setAttribute("aria-label", coord);
            card.innerHTML =
              '<div class="card-face card-face-front">' +
                '<span class="card-coord">' + coord + "</span>" +
                '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19.5v-15m0 0l-6.5 6.5m6.5-6.5l6.5 6.5"/></svg>' +
              "</div>" +
              '<div class="card-face card-face-back ' + (data.lang === "ko" ? "is-ko" : "is-en") + '">' +
                escapeHtml(data.text) +
              "</div>";
            card.addEventListener("click", flipCard);
          }
          holder.appendChild(card);
          gameBoard.appendChild(holder);
          slot += 1;
        }
      });
      updateStats();
    }

    function flipCard() {
      if (lockBoard) return;
      if (this === firstCard) return;
      if (this.classList.contains("is-matched")) return;
      this.classList.add("is-flipped");
      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
      }
      secondCard = this;
      checkForMatch();
    }

    function checkForMatch() {
      turns += 1;
      lockBoard = true;
      var isMatch = firstCard.dataset.pairId === secondCard.dataset.pairId;
      if (isMatch) disableCards();
      else unflipCards();
      updateStats();
    }

    function disableCards() {
      matchesFound += 1;
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);
      window.setTimeout(function () {
        firstCard.classList.add("is-matched");
        secondCard.classList.add("is-matched");
        resetBoard();
        if (matchesFound === totalMatches && totalMatches > 0) showWinModal();
      }, 1500);
    }

    function unflipCards() {
      window.setTimeout(function () {
        firstCard.classList.remove("is-flipped");
        secondCard.classList.remove("is-flipped");
        resetBoard();
      }, 1500);
    }

    function resetBoard() {
      hasFlippedCard = false;
      lockBoard = false;
      firstCard = null;
      secondCard = null;
    }

    function updateStats() {
      turnsCountEl.textContent = String(turns);
      matchesCountEl.textContent = String(matchesFound);
      totalMatchesEl.textContent = String(totalMatches);
    }

    function showWinModal() {
      winStats.textContent = "You found all " + totalMatches + " pairs in " + turns + " turns.";
      winModal.classList.remove("hidden");
      window.setTimeout(function () {
        winModalContent.classList.add("is-open");
      }, 50);
    }

    function hideWinModal() {
      winModalContent.classList.remove("is-open");
      window.setTimeout(function () {
        winModal.classList.add("hidden");
      }, 200);
    }

    function updateTeamButtonStates() {
      addTeamBtn.disabled = teams.length >= MAX_TEAMS;
      removeTeamBtn.disabled = teams.length <= MIN_TEAMS;
    }

    teamsContainer.addEventListener("change", function (e) {
      if (e.target.tagName !== "INPUT") return;
      var teamId = parseInt(e.target.getAttribute("data-id"), 10);
      var team = teams.filter(function (t) { return t.id === teamId; })[0];
      if (team) team.name = e.target.value;
    });

    teamsContainer.addEventListener("click", function (e) {
      var btn = e.target.closest(".score-btn");
      if (!btn) return;
      var teamId = parseInt(btn.getAttribute("data-id"), 10);
      var action = btn.getAttribute("data-action");
      var team = teams.filter(function (t) { return t.id === teamId; })[0];
      if (!team) return;
      if (action === "add") team.score += 1;
      else if (action === "subtract" && team.score > 0) team.score -= 1;
      renderScoreboard();
    });

    populateUnits();
    createBoard();
    initializeTeams();

    unitSelect.addEventListener("change", function (e) {
      currentUnit = e.target.value;
      createBoard();
    });
    startGameBtn.addEventListener("click", createBoard);
    playAgainBtn.addEventListener("click", function () {
      hideWinModal();
      window.setTimeout(createBoard, 300);
    });
    addTeamBtn.addEventListener("click", function () {
      if (teams.length >= MAX_TEAMS) return;
      var newId = teams.length ? Math.max.apply(null, teams.map(function (t) { return t.id; })) + 1 : 1;
      teams.push({ id: newId, name: "Team " + newId, score: 0 });
      renderScoreboard();
    });
    removeTeamBtn.addEventListener("click", function () {
      if (teams.length <= MIN_TEAMS) return;
      teams.pop();
      renderScoreboard();
    });
  </script>
</body>
</html>
`,
    charades: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap");
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body {
      font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1rem;
    }
    .shell {
      width: 100%;
      max-width: 56rem;
      margin: 0 auto;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.18);
      padding: 1.75rem;
      text-align: center;
      position: relative;
    }
    .hidden { display: none !important; }
    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      margin-bottom: .35rem;
    }
    #game-title {
      font-size: clamp(1.6rem, 4vw, 2.25rem);
      font-weight: 900;
      color: #4338ca;
      text-align: center;
      width: 100%;
      background: transparent;
      border: 0;
      border-radius: .5rem;
      padding: .5rem;
    }
    #game-title:focus { outline: none; }
    #view-words-btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: #e2e8f0;
      color: #334155;
      border: 0;
      border-radius: 999px;
      padding: .45rem;
      cursor: pointer;
    }
    #view-words-btn:hover { background: #cbd5e1; }
    .sub { color: #64748b; margin: 0 0 1.4rem; }
    .scoreboard {
      display: grid;
      gap: 1rem;
      margin-bottom: .5rem;
    }
    .scoreboard.cols-1 { grid-template-columns: 1fr; }
    .scoreboard.cols-2 { grid-template-columns: 1fr 1fr; }
    .scoreboard.cols-3 { grid-template-columns: repeat(3, 1fr); }
    .scoreboard.cols-4 { grid-template-columns: repeat(2, 1fr); }
    .scoreboard.cols-5,
    .scoreboard.cols-6 { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 768px) {
      .scoreboard.cols-4 { grid-template-columns: repeat(4, 1fr); }
      .scoreboard.cols-5 { grid-template-columns: repeat(3, 1fr); }
      .scoreboard.cols-6 { grid-template-columns: repeat(3, 1fr); }
    }
    @media (min-width: 1024px) {
      .scoreboard.cols-5 { grid-template-columns: repeat(5, 1fr); }
    }
    .team-card {
      padding: 1rem;
      border-radius: .75rem;
    }
    .team-name-input {
      font-weight: 800;
      background: transparent;
      width: 100%;
      text-align: center;
      margin-bottom: .5rem;
      padding: .25rem;
      border: 0;
      border-radius: .4rem;
      font-family: inherit;
      font-size: 1.2rem;
    }
    .team-name-input:focus { outline: 2px solid currentColor; }
    .team-score {
      font-size: 2.25rem;
      font-weight: 900;
      margin: .4rem 0;
    }
    .scoreboard.small .team-name-input { font-size: 1.05rem; }
    .scoreboard.small .team-score { font-size: 1.75rem; }
    .point-row { display: flex; gap: .5rem; }
    .add-point-btn, .minus-point-btn {
      width: 100%;
      color: #fff;
      font-weight: 800;
      border: 0;
      border-radius: .4rem;
      padding: .5rem .8rem;
      cursor: pointer;
      font-family: inherit;
    }
    .tone-blue { background: #dbeafe; }
    .tone-blue .team-name-input, .tone-blue .team-score { color: #1e40af; }
    .tone-blue .add-point-btn { background: #3b82f6; }
    .tone-blue .minus-point-btn { background: #1d4ed8; }
    .tone-rose { background: #ffe4e6; }
    .tone-rose .team-name-input, .tone-rose .team-score { color: #9f1239; }
    .tone-rose .add-point-btn { background: #f43f5e; }
    .tone-rose .minus-point-btn { background: #be123c; }
    .tone-amber { background: #fef3c7; }
    .tone-amber .team-name-input, .tone-amber .team-score { color: #92400e; }
    .tone-amber .add-point-btn { background: #f59e0b; }
    .tone-amber .minus-point-btn { background: #b45309; }
    .tone-teal { background: #ccfbf1; }
    .tone-teal .team-name-input, .tone-teal .team-score { color: #115e59; }
    .tone-teal .add-point-btn { background: #14b8a6; }
    .tone-teal .minus-point-btn { background: #0f766e; }
    .tone-violet { background: #ede9fe; }
    .tone-violet .team-name-input, .tone-violet .team-score { color: #5b21b6; }
    .tone-violet .add-point-btn { background: #8b5cf6; }
    .tone-violet .minus-point-btn { background: #6d28d9; }
    .tone-lime { background: #ecfccb; }
    .tone-lime .team-name-input, .tone-lime .team-score { color: #3f6212; }
    .tone-lime .add-point-btn { background: #84cc16; }
    .tone-lime .minus-point-btn { background: #4d7c0f; }
    .team-tools {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: .5rem;
    }
    .ghost {
      font-size: .9rem;
      background: #e2e8f0;
      color: #334155;
      border: 0;
      border-radius: .4rem;
      padding: .5rem 1rem;
      font-weight: 800;
      cursor: pointer;
      font-family: inherit;
    }
    .ghost:hover { background: #cbd5e1; }
    .reset-link {
      background: none;
      border: 0;
      color: #64748b;
      font-size: .9rem;
      cursor: pointer;
      font-family: inherit;
      margin-bottom: 1.4rem;
    }
    .reset-link:hover { color: #4f46e5; }
    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.4rem;
    }
    #unit-select {
      background: #f1f5f9;
      border: 2px solid #e2e8f0;
      color: #334155;
      font-weight: 800;
      padding: .5rem 1rem;
      border-radius: .6rem;
      font-family: inherit;
    }
    #unit-select:focus { outline: none; border-color: #6366f1; }
    .timer-box {
      display: flex;
      align-items: center;
      gap: .5rem;
      background: #1e293b;
      color: #fff;
      font-weight: 800;
      padding: .5rem;
      border-radius: .6rem;
    }
    #timer-display { width: 4rem; text-align: center; font-size: 1.1rem; }
    #timer-display.timer-urgent { color: #ef4444; animation: pulse-red 1s infinite; }
    .timer-edit {
      display: flex;
      align-items: center;
      gap: .25rem;
      border-left: 1px solid #475569;
      padding-left: .5rem;
    }
    #timer-setting {
      background: #334155;
      color: #fff;
      width: 3rem;
      text-align: center;
      font-weight: 800;
      border: 0;
      border-radius: .4rem;
      font-family: inherit;
      padding: .2rem;
    }
    #timer-setting:focus { outline: 2px solid #6366f1; }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }
    .toggles { display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; }
    .toggle-wrap { display: flex; align-items: center; }
    .toggle-wrap span { margin-right: .45rem; font-size: .85rem; font-weight: 800; color: #475569; }
    .switch { position: relative; display: inline-block; width: 2.5rem; height: 1.5rem; }
    .toggle-checkbox {
      position: absolute;
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 999px;
      background: #fff;
      border: 4px solid #d1d5db;
      appearance: none;
      -webkit-appearance: none;
      cursor: pointer;
      left: 0;
      top: 0;
      margin: 0;
      z-index: 1;
    }
    .toggle-label {
      display: block;
      overflow: hidden;
      height: 1.5rem;
      border-radius: 999px;
      background: #d1d5db;
      cursor: pointer;
    }
    .toggle-checkbox:checked { right: 0; left: auto; border-color: #4f46e5; }
    .toggle-checkbox:checked + .toggle-label { background: #4f46e5; }
    .flip-card {
      perspective: 1000px;
      cursor: pointer;
      margin-bottom: 1.4rem;
      height: 350px;
    }
    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform .6s cubic-bezier(.4, .2, .2, 1);
      transform-style: preserve-3d;
      border-radius: .75rem;
      box-shadow: inset 0 2px 8px rgba(15, 23, 42, .08);
    }
    .flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
    .flip-card-front, .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      border-radius: .75rem;
    }
    .flip-card-front { background: #4f46e5; color: #fff; }
    .flip-card-back { background: #4338ca; color: #fff; transform: rotateY(180deg); }
    #image-display {
      width: 12rem;
      height: 12rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #image-display img, .word-thumb img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: .5rem;
    }
    #word-display-text, #translation-display {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 900;
      margin: 0;
      color: #fff;
    }
    .word-display-text { animation: pop-in .5s cubic-bezier(.68, -.55, .27, 1.55); }
    #flip-hint {
      color: #c7d2fe;
      margin-top: 1rem;
      font-size: .85rem;
      font-weight: 700;
      animation: pulse 1.4s infinite;
    }
    .actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    @media (min-width: 640px) {
      .actions { grid-template-columns: 1fr 1fr 1fr; }
    }
    .btn {
      width: 100%;
      color: #fff;
      font-weight: 800;
      border: 0;
      border-radius: .6rem;
      padding: .85rem 1.4rem;
      cursor: pointer;
      font-family: inherit;
      font-size: 1rem;
      box-shadow: 0 8px 16px rgba(15, 23, 42, .12);
    }
    .btn:hover { transform: scale(1.03); }
    .btn-next { background: #6366f1; }
    .btn-next:hover { background: #4338ca; }
    .btn-start { background: #10b981; }
    .btn-start:hover { background: #059669; }
    .btn-start.is-paused { background: #eab308; }
    .btn-start.is-paused:hover { background: #ca8a04; }
    .btn-reset { background: #f59e0b; }
    .btn-reset:hover { background: #d97706; }
    .btn-back { background: #6366f1; }
    .footer-tools {
      margin-top: 1.4rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    .btn-upload { background: #4b5563; font-size: .9rem; padding: .5rem 1rem; box-shadow: none; width: auto; }
    .btn-upload:hover { background: #374151; transform: none; }
    .btn-clear { background: #ef4444; font-size: .9rem; padding: .5rem 1rem; box-shadow: none; width: auto; }
    .btn-clear:hover { background: #dc2626; transform: none; }
    .list-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .list-head h2 { margin: 0; font-size: 1.4rem; color: #334155; }
    .list-hint { font-size: .9rem; color: #64748b; margin-bottom: 1rem; }
    #word-list-container {
      max-height: 70vh;
      overflow-y: auto;
      text-align: left;
      padding: 1rem;
      background: #f8fafc;
      border-radius: .6rem;
    }
    .unit-block { margin-bottom: 1.5rem; }
    .unit-block h3 {
      font-size: 1.2rem;
      color: #4338ca;
      margin: 0 0 .75rem;
      position: sticky;
      top: 0;
      background: #f8fafc;
      padding: .5rem 0;
    }
    .words-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
    @media (min-width: 768px) { .words-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (min-width: 1024px) { .words-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
    .word-card {
      background: #fff;
      padding: .75rem;
      border-radius: .6rem;
      box-shadow: 0 1px 3px rgba(15, 23, 42, .08);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
    }
    .remove-word-btn {
      position: absolute;
      top: .25rem;
      right: .25rem;
      width: 1.5rem;
      height: 1.5rem;
      background: #e2e8f0;
      color: #64748b;
      border: 0;
      border-radius: 999px;
      cursor: pointer;
    }
    .remove-word-btn:hover { background: #ef4444; color: #fff; }
    .word-card-image-trigger {
      width: 6rem;
      height: 6rem;
      background: #e2e8f0;
      border-radius: .4rem;
      margin-bottom: .5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .word-card-image-trigger:hover { background: #cbd5e1; }
    .edit-en-input, .edit-ko-input {
      background: transparent;
      border: 0;
      text-align: center;
      width: 100%;
      font-family: inherit;
      border-radius: .3rem;
      padding: .15rem;
    }
    .edit-en-input { font-weight: 800; color: #1e293b; }
    .edit-ko-input { font-size: .9rem; color: #64748b; margin-top: .2rem; }
    .edit-en-input:focus, .edit-ko-input:focus { outline: 1px solid #6366f1; background: #f8fafc; }
    .add-word-btn {
      background: transparent;
      border: 2px dashed #cbd5e1;
      padding: .75rem;
      border-radius: .6rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      font-weight: 800;
      font-size: .9rem;
    }
    .add-word-btn:hover { border-color: #6366f1; }
    .drag-over-highlight {
      outline: 3px dashed #4f46e5;
      outline-offset: 4px;
      background: #e0e7ff;
    }
    .modal {
      position: fixed;
      inset: 0;
      z-index: 50;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,.5);
      display: none;
    }
    .modal.open { display: flex; }
    .modal-card {
      background: #fff;
      border-radius: .75rem;
      box-shadow: 0 20px 40px rgba(15, 23, 42, .2);
      padding: 1.4rem;
      width: min(24rem, calc(100% - 2rem));
      text-align: left;
    }
    .modal-card h3 { margin: 0 0 .4rem; }
    .modal-card p { color: #475569; margin: 0 0 1.2rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: .75rem; }
    .btn-cancel { background: #e2e8f0; color: #1e293b; box-shadow: none; width: auto; }
    .btn-danger { background: #dc2626; box-shadow: none; width: auto; }
    .loading {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,.8);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1rem;
      z-index: 40;
    }
    @keyframes pop-in {
      0% { transform: scale(.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulse-red {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .55; }
    }
    @media (max-width: 700px) {
      .shell { padding: 1rem; }
      .scoreboard.cols-3 { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <div id="loading-overlay" class="loading hidden">
      <p id="loading-text">Loading…</p>
    </div>
    <div class="header">
      <input type="text" id="game-title" value="__TITLE__" readonly>
      <button type="button" id="view-words-btn" title="View Word Lists">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
      </button>
    </div>
    <p class="sub">Show the word to the actor. Classmates guess before the timer runs out!</p>

    <div id="game-view">
      <div id="scoreboard-container" class="scoreboard cols-2"></div>
      <div class="team-tools">
        <button type="button" id="add-team-btn" class="ghost">+ Add Team</button>
        <button type="button" id="remove-team-btn" class="ghost">- Remove Team</button>
      </div>
      <button type="button" id="reset-scores-btn" class="reset-link">Reset All Scores</button>
      <div class="controls">
        <select id="unit-select"><option value="all">All Units</option></select>
        <div class="timer-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span id="timer-display">01:00</span>
          <div class="timer-edit">
            <input type="number" id="timer-setting" value="60" min="10" max="300" step="5" title="Set timer in seconds">
            <span style="color:#94a3b8;font-size:.85rem">sec</span>
          </div>
        </div>
        <div class="toggles">
          <div class="toggle-wrap">
            <span>English</span>
            <div class="switch">
              <input type="checkbox" id="english-toggle" class="toggle-checkbox" checked>
              <label for="english-toggle" class="toggle-label"></label>
            </div>
          </div>
          <div class="toggle-wrap">
            <span>Korean</span>
            <div class="switch">
              <input type="checkbox" id="korean-toggle" class="toggle-checkbox">
              <label for="korean-toggle" class="toggle-label"></label>
            </div>
          </div>
          <div class="toggle-wrap">
            <span>Images</span>
            <div class="switch">
              <input type="checkbox" id="image-toggle" class="toggle-checkbox" checked>
              <label for="image-toggle" class="toggle-label"></label>
            </div>
          </div>
        </div>
      </div>
      <div id="word-container" class="flip-card">
        <div id="flip-card-inner" class="flip-card-inner">
          <div class="flip-card-front">
            <div id="image-display" class="hidden"></div>
            <p id="word-display-text">Click Next Word, then show this to the actor!</p>
            <p id="flip-hint" class="hidden">(Click card to flip)</p>
          </div>
          <div class="flip-card-back">
            <p id="translation-display"></p>
          </div>
        </div>
      </div>
      <div class="actions">
        <button type="button" id="next-word-btn" class="btn btn-next">Next Word</button>
        <button type="button" id="start-pause-btn" class="btn btn-start">Start</button>
        <button type="button" id="reset-timer-btn" class="btn btn-reset">Reset Timer</button>
      </div>
      <div class="footer-tools">
        <button type="button" id="upload-images-btn" class="btn btn-upload">Upload Custom Images</button>
        <button type="button" id="clear-images-btn" class="btn btn-clear hidden">Clear Images</button>
        <input type="file" id="image-upload-input" multiple accept="image/*" class="hidden">
      </div>
    </div>

    <div id="word-list-view" class="hidden">
      <div class="list-head">
        <h2>Vocabulary Word Lists</h2>
        <button type="button" id="back-to-game-btn" class="btn btn-back" style="width:auto">Back to Game</button>
      </div>
      <div class="list-hint">Click a card to upload, or drag and drop an image onto a card. You can also paste an image named like the word (for example, tall.jpg).</div>
      <div id="word-list-container"></div>
      <input type="file" id="word-list-image-upload" accept="image/*" class="hidden">
    </div>
  </div>

  <div id="confirmation-modal" class="modal">
    <div class="modal-card">
      <h3 id="modal-title">Are you sure?</h3>
      <p id="modal-message">This action cannot be undone.</p>
      <div class="modal-actions">
        <button type="button" id="modal-cancel-btn" class="btn btn-cancel">Cancel</button>
        <button type="button" id="modal-confirm-btn" class="btn btn-danger">Confirm</button>
      </div>
    </div>
  </div>

  <script>
    const GAME_TITLE = __TITLE_JSON__;
    const GAME_LEVEL = __LEVEL_JSON__;
    const GAME_BOOK = __BOOK_JSON__;
    const DOWNLOAD_NAME = __DOWNLOAD_NAME_JSON__;
    const IMAGE_KEY_PREFIX = __STORAGE_KEY_JSON__;
    const vocabByUnit = __VOCAB_BY_UNIT__;
    const TEAM_TONES = ["blue", "rose", "amber", "teal", "violet", "lime"];

    function playTimeUpBeep() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        function tone(freq, start, dur) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = freq;
          osc.type = "sine";
          gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
          gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + start);
          osc.stop(ctx.currentTime + start + dur + 0.02);
        }
        tone(261.6, 0, 0.18);
        tone(196, 0.2, 0.18);
      } catch (e) {}
    }

    const els = {
      loadingOverlay: document.getElementById("loading-overlay"),
      loadingText: document.getElementById("loading-text"),
      gameView: document.getElementById("game-view"),
      gameTitle: document.getElementById("game-title"),
      wordListView: document.getElementById("word-list-view"),
      viewWordsBtn: document.getElementById("view-words-btn"),
      backToGameBtn: document.getElementById("back-to-game-btn"),
      wordListContainer: document.getElementById("word-list-container"),
      wordListImageUpload: document.getElementById("word-list-image-upload"),
      scoreboardContainer: document.getElementById("scoreboard-container"),
      addTeamBtn: document.getElementById("add-team-btn"),
      removeTeamBtn: document.getElementById("remove-team-btn"),
      resetScoresBtn: document.getElementById("reset-scores-btn"),
      unitSelect: document.getElementById("unit-select"),
      timerDisplay: document.getElementById("timer-display"),
      timerSetting: document.getElementById("timer-setting"),
      wordContainer: document.getElementById("word-container"),
      flipHint: document.getElementById("flip-hint"),
      imageDisplay: document.getElementById("image-display"),
      wordDisplayText: document.getElementById("word-display-text"),
      translationDisplay: document.getElementById("translation-display"),
      englishToggle: document.getElementById("english-toggle"),
      koreanToggle: document.getElementById("korean-toggle"),
      imageToggle: document.getElementById("image-toggle"),
      nextWordBtn: document.getElementById("next-word-btn"),
      startPauseBtn: document.getElementById("start-pause-btn"),
      resetTimerBtn: document.getElementById("reset-timer-btn"),
      uploadImagesBtn: document.getElementById("upload-images-btn"),
      clearImagesBtn: document.getElementById("clear-images-btn"),
      imageUploadInput: document.getElementById("image-upload-input"),
      modal: document.getElementById("confirmation-modal"),
      modalTitle: document.getElementById("modal-title"),
      modalMessage: document.getElementById("modal-message"),
      modalConfirmBtn: document.getElementById("modal-confirm-btn"),
      modalCancelBtn: document.getElementById("modal-cancel-btn")
    };

    let teams = [{ name: "Team 1", score: 0 }, { name: "Team 2", score: 0 }];
    let currentUnit = "all";
    let lastWord = {};
    let shownWords = {};
    let timer = null;
    let timeLeft = 60;
    let isTimerRunning = false;
    let isPaused = false;
    let imageCache = {};
    let wordToUploadFor = null;
    let lastDragTarget = null;
    let modalConfirmCallback = null;

    function imageKey(wordId) {
      return IMAGE_KEY_PREFIX + String(wordId || "").toLowerCase();
    }

    function showLoading(message) {
      if (!els.loadingOverlay) return;
      els.loadingText.textContent = message;
      els.loadingOverlay.classList.remove("hidden");
    }
    function hideLoading() {
      if (!els.loadingOverlay) return;
      els.loadingOverlay.classList.add("hidden");
    }
    function showConfirmationModal(title, message, onConfirm) {
      els.modalTitle.textContent = title;
      els.modalMessage.textContent = message;
      modalConfirmCallback = onConfirm;
      els.modal.classList.add("open");
    }
    function hideConfirmationModal() {
      els.modal.classList.remove("open");
      modalConfirmCallback = null;
    }
    function updateScores() {
      document.querySelectorAll(".team-score").forEach(function (el, index) {
        if (teams[index]) el.textContent = teams[index].score;
      });
    }
    function renderScoreboard() {
      const count = teams.length;
      els.scoreboardContainer.className = "scoreboard cols-" + count + (count > 4 ? " small" : "");
      els.scoreboardContainer.innerHTML = "";
      teams.forEach(function (team, index) {
        const tone = TEAM_TONES[index % TEAM_TONES.length];
        const card = document.createElement("div");
        card.className = "team-card tone-" + tone;
        card.innerHTML =
          '<input type="text" value="' + team.name.replace(/"/g, "&quot;") + '" data-index="' + index + '" class="team-name-input">' +
          '<p class="team-score">' + team.score + "</p>" +
          '<div class="point-row">' +
          '<button type="button" data-index="' + index + '" class="add-point-btn">+1</button>' +
          '<button type="button" data-index="' + index + '" class="minus-point-btn">-1</button>' +
          "</div>";
        els.scoreboardContainer.appendChild(card);
      });
    }
    function populateUnits() {
      els.unitSelect.innerHTML = "";
      const allOption = document.createElement("option");
      allOption.value = "all";
      allOption.textContent = "All Units";
      els.unitSelect.appendChild(allOption);
      const unitKeys = Object.keys(vocabByUnit || {});
      els.unitSelect.disabled = unitKeys.length === 0;
      unitKeys.forEach(function (unitId) {
        const option = document.createElement("option");
        option.value = unitId;
        option.textContent = (vocabByUnit[unitId] && vocabByUnit[unitId].name) || unitId;
        els.unitSelect.appendChild(option);
      });
    }
    function updateWordCardDisplay() {
      if (!lastWord.en) return;
      const showEn = els.englishToggle.checked;
      const showKo = els.koreanToggle.checked;
      const showImg = els.imageToggle.checked;
      const imageUrl = imageCache[String(lastWord.en).toLowerCase()];
      els.wordDisplayText.classList.add("hidden");
      els.translationDisplay.classList.add("hidden");
      els.imageDisplay.classList.add("hidden");
      els.flipHint.classList.add("hidden");
      els.imageDisplay.innerHTML = "";
      if (showEn) {
        els.wordDisplayText.classList.remove("hidden");
        els.flipHint.classList.remove("hidden");
      }
      if (showKo) {
        els.translationDisplay.classList.remove("hidden");
        if (!showEn) els.flipHint.classList.remove("hidden");
      }
      if (showImg) {
        if (imageUrl) {
          const img = document.createElement("img");
          img.src = imageUrl;
          img.alt = lastWord.en;
          els.imageDisplay.appendChild(img);
          els.imageDisplay.classList.remove("hidden");
          els.flipHint.classList.remove("hidden");
        } else if (!showEn) {
          els.wordDisplayText.classList.remove("hidden");
          els.flipHint.classList.remove("hidden");
        }
      }
    }
    function displayNewWord() {
      if (!vocabByUnit || !Object.keys(vocabByUnit).length) {
        els.wordDisplayText.textContent = "No Words Available!";
        return;
      }
      els.wordContainer.classList.remove("flipped");
      var allWordsInUnit = currentUnit === "all"
        ? Object.keys(vocabByUnit).reduce(function (acc, id) {
            return acc.concat((vocabByUnit[id] && vocabByUnit[id].words) || []);
          }, [])
        : ((vocabByUnit[currentUnit] && vocabByUnit[currentUnit].words) || []);
      if (!allWordsInUnit.length) {
        els.wordDisplayText.textContent = "No words in this unit!";
        return;
      }
      if (!shownWords[currentUnit]) shownWords[currentUnit] = [];
      var available = allWordsInUnit.filter(function (word) {
        return shownWords[currentUnit].indexOf(word.en) === -1;
      });
      if (!available.length) {
        shownWords[currentUnit] = [];
        available = allWordsInUnit;
      }
      var newWord = available[Math.floor(Math.random() * available.length)];
      shownWords[currentUnit].push(newWord.en);
      lastWord = newWord;
      els.wordDisplayText.textContent = newWord.en;
      els.translationDisplay.textContent = newWord.ko;
      updateWordCardDisplay();
      els.wordDisplayText.classList.remove("word-display-text");
      setTimeout(function () { els.wordDisplayText.classList.add("word-display-text"); }, 10);
    }
    function handleResetTimer() {
      clearInterval(timer);
      isTimerRunning = false;
      isPaused = false;
      timeLeft = parseInt(els.timerSetting.value, 10) || 60;
      els.timerSetting.disabled = false;
      updateTimerDisplay();
      els.startPauseBtn.textContent = "Start";
      els.startPauseBtn.classList.remove("is-paused");
    }
    function updateTimerDisplay() {
      var minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
      var seconds = (timeLeft % 60).toString().padStart(2, "0");
      els.timerDisplay.textContent = minutes + ":" + seconds;
      if (timeLeft <= 10 && timeLeft > 0) els.timerDisplay.classList.add("timer-urgent");
      else els.timerDisplay.classList.remove("timer-urgent");
    }
    function handleStartPause() {
      if (isTimerRunning) {
        clearInterval(timer);
        isTimerRunning = false;
        isPaused = true;
        els.startPauseBtn.textContent = "Resume";
        els.startPauseBtn.classList.add("is-paused");
        return;
      }
      if (!isPaused) timeLeft = parseInt(els.timerSetting.value, 10) || 60;
      els.timerSetting.disabled = true;
      isTimerRunning = true;
      isPaused = false;
      els.startPauseBtn.textContent = "Pause";
      els.startPauseBtn.classList.remove("is-paused");
      timer = setInterval(function () {
        timeLeft -= 1;
        updateTimerDisplay();
        if (timeLeft <= 0) {
          handleResetTimer();
          els.wordDisplayText.textContent = "Time's Up!";
          playTimeUpBeep();
        }
      }, 1000);
    }
    function processAndSaveImage(file, wordKey) {
      if (!file || !file.type || file.type.indexOf("image/") !== 0 || !wordKey) return;
      var wordId = String(wordKey).toLowerCase();
      var reader = new FileReader();
      reader.onload = function (e) {
        imageCache[wordId] = e.target.result;
        try {
          localStorage.setItem(imageKey(wordId), e.target.result);
          els.clearImagesBtn.classList.remove("hidden");
        } catch (err) {
          alert("Could not save image. Storage may be full.");
          delete imageCache[wordId];
        }
        if (!els.wordListView.classList.contains("hidden")) renderWordListPage();
      };
      reader.readAsDataURL(file);
    }
    function loadImagesFromLocalStorage() {
      var found = false;
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf(IMAGE_KEY_PREFIX) === 0) {
          var wordId = key.slice(IMAGE_KEY_PREFIX.length);
          imageCache[wordId] = localStorage.getItem(key);
          found = true;
        }
      }
      if (found) els.clearImagesBtn.classList.remove("hidden");
    }
    function clearAllImages() {
      showConfirmationModal("Delete All Images?", "This will permanently delete all your uploaded images from this browser.", function () {
        var keysToRemove = [];
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key && key.indexOf(IMAGE_KEY_PREFIX) === 0) keysToRemove.push(key);
        }
        keysToRemove.forEach(function (key) { localStorage.removeItem(key); });
        imageCache = {};
        els.imageDisplay.innerHTML = "";
        els.imageDisplay.classList.add("hidden");
        els.clearImagesBtn.classList.add("hidden");
        if (!els.wordListView.classList.contains("hidden")) renderWordListPage();
      });
    }
    function handleBulkImageUpload(event) {
      var files = event.target.files;
      if (!files || !files.length) return;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var wordKey = file.name.split(".").slice(0, -1).join(".");
        processAndSaveImage(file, wordKey);
      }
      alert(files.length + " image(s) are being processed.");
    }
    function renderWordListPage() {
      els.wordListContainer.innerHTML = "";
      var ids = Object.keys(vocabByUnit || {});
      if (!ids.length) {
        els.wordListContainer.innerHTML = '<p style="text-align:center;color:#64748b">No word list loaded.</p>';
        return;
      }
      ids.forEach(function (unitId) {
        var unit = vocabByUnit[unitId];
        var section = document.createElement("div");
        section.className = "unit-block";
        var header = document.createElement("h3");
        header.textContent = unit.name;
        section.appendChild(header);
        var grid = document.createElement("div");
        grid.className = "words-grid";
        (unit.words || []).forEach(function (word, index) {
          var card = document.createElement("div");
          card.className = "word-card";
          var removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "remove-word-btn";
          removeBtn.innerHTML = "&times;";
          removeBtn.title = "Remove Word";
          removeBtn.dataset.unitId = unitId;
          removeBtn.dataset.wordIndex = String(index);
          var imageEl = document.createElement("div");
          imageEl.className = "word-card-image-trigger";
          imageEl.dataset.wordEn = word.en;
          var imageUrl = imageCache[String(word.en).toLowerCase()];
          if (imageUrl) {
            var img = document.createElement("img");
            img.src = imageUrl;
            img.alt = word.en;
            imageEl.appendChild(img);
          } else {
            imageEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
          }
          var enInput = document.createElement("input");
          enInput.type = "text";
          enInput.className = "edit-en-input";
          enInput.value = word.en;
          enInput.dataset.unitId = unitId;
          enInput.dataset.wordIndex = String(index);
          var koInput = document.createElement("input");
          koInput.type = "text";
          koInput.className = "edit-ko-input";
          koInput.value = word.ko;
          koInput.dataset.unitId = unitId;
          koInput.dataset.wordIndex = String(index);
          card.appendChild(removeBtn);
          card.appendChild(imageEl);
          card.appendChild(enInput);
          card.appendChild(koInput);
          grid.appendChild(card);
        });
        var addCard = document.createElement("div");
        addCard.className = "add-word-btn";
        addCard.dataset.unitId = unitId;
        addCard.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg><span>Add Word</span>';
        grid.appendChild(addCard);
        section.appendChild(grid);
        els.wordListContainer.appendChild(section);
      });
    }

    function setupEventListeners() {
      els.scoreboardContainer.addEventListener("click", function (e) {
        var index = e.target.dataset.index;
        if (index === undefined) return;
        if (e.target.classList.contains("add-point-btn")) teams[index].score += 1;
        else if (e.target.classList.contains("minus-point-btn") && teams[index].score > 0) teams[index].score -= 1;
        updateScores();
      });
      els.scoreboardContainer.addEventListener("input", function (e) {
        var index = e.target.dataset.index;
        if (index !== undefined && e.target.classList.contains("team-name-input")) {
          teams[index].name = e.target.value;
        }
      });
      els.addTeamBtn.addEventListener("click", function () {
        if (teams.length < 6) {
          teams.push({ name: "Team " + (teams.length + 1), score: 0 });
          renderScoreboard();
        }
      });
      els.removeTeamBtn.addEventListener("click", function () {
        if (teams.length > 1) {
          teams.pop();
          renderScoreboard();
        }
      });
      els.resetScoresBtn.addEventListener("click", function () {
        showConfirmationModal("Reset Scores?", "Are you sure you want to reset all team scores to 0?", function () {
          teams.forEach(function (team) { team.score = 0; });
          updateScores();
        });
      });
      els.unitSelect.addEventListener("change", function (e) {
        currentUnit = e.target.value;
        els.wordDisplayText.textContent = "Click 'Next Word'!";
        els.translationDisplay.classList.add("hidden");
        els.wordContainer.classList.remove("flipped");
        handleResetTimer();
      });
      els.nextWordBtn.addEventListener("click", function () {
        displayNewWord();
        handleResetTimer();
      });
      els.startPauseBtn.addEventListener("click", handleStartPause);
      els.resetTimerBtn.addEventListener("click", handleResetTimer);
      els.timerSetting.addEventListener("input", function () {
        if (!isTimerRunning && !isPaused) {
          timeLeft = parseInt(els.timerSetting.value, 10) || 60;
          updateTimerDisplay();
        }
      });
      els.uploadImagesBtn.addEventListener("click", function () { els.imageUploadInput.click(); });
      els.imageUploadInput.addEventListener("change", handleBulkImageUpload);
      els.clearImagesBtn.addEventListener("click", clearAllImages);
      els.wordContainer.addEventListener("click", function () {
        if (lastWord.en) els.wordContainer.classList.toggle("flipped");
      });
      function handleToggleChange(event) {
        var toggles = [els.englishToggle, els.koreanToggle, els.imageToggle];
        var checkedCount = toggles.filter(function (t) { return t.checked; }).length;
        if (checkedCount === 0) {
          event.target.checked = true;
          return;
        }
        updateWordCardDisplay();
      }
      els.englishToggle.addEventListener("change", handleToggleChange);
      els.koreanToggle.addEventListener("change", handleToggleChange);
      els.imageToggle.addEventListener("change", handleToggleChange);
      els.viewWordsBtn.addEventListener("click", function () {
        els.gameView.classList.add("hidden");
        renderWordListPage();
        els.wordListView.classList.remove("hidden");
      });
      els.backToGameBtn.addEventListener("click", function () {
        els.wordListView.classList.add("hidden");
        els.gameView.classList.remove("hidden");
      });
      els.wordListContainer.addEventListener("click", function (e) {
        var addBtn = e.target.closest(".add-word-btn");
        if (addBtn) {
          vocabByUnit[addBtn.dataset.unitId].words.push({ en: "New Word", ko: "새 단어" });
          renderWordListPage();
          return;
        }
        var removeBtn = e.target.closest(".remove-word-btn");
        if (removeBtn) {
          var unitId = removeBtn.dataset.unitId;
          var wordIndex = removeBtn.dataset.wordIndex;
          var wordEn = vocabByUnit[unitId].words[wordIndex].en;
          showConfirmationModal("Remove Word?", 'Are you sure you want to remove "' + wordEn + '"?', function () {
            vocabByUnit[unitId].words.splice(wordIndex, 1);
            renderWordListPage();
          });
          return;
        }
        var trigger = e.target.closest(".word-card-image-trigger");
        if (trigger) {
          wordToUploadFor = trigger.dataset.wordEn;
          els.wordListImageUpload.click();
        }
      });
      els.wordListImageUpload.addEventListener("change", function (event) {
        var file = event.target.files[0];
        if (!file || !wordToUploadFor) return;
        processAndSaveImage(file, wordToUploadFor);
        wordToUploadFor = null;
        event.target.value = "";
      });
      els.wordListContainer.addEventListener("dragover", function (e) {
        e.preventDefault();
        var target = e.target.closest(".word-card-image-trigger");
        if (target) {
          if (lastDragTarget && lastDragTarget !== target) lastDragTarget.classList.remove("drag-over-highlight");
          target.classList.add("drag-over-highlight");
          lastDragTarget = target;
        }
      });
      els.wordListContainer.addEventListener("dragleave", function () {
        if (lastDragTarget) {
          lastDragTarget.classList.remove("drag-over-highlight");
          lastDragTarget = null;
        }
      });
      els.wordListContainer.addEventListener("drop", function (e) {
        e.preventDefault();
        if (lastDragTarget) lastDragTarget.classList.remove("drag-over-highlight");
        var target = e.target.closest(".word-card-image-trigger");
        var files = e.dataTransfer.files;
        if (target && files.length > 0) processAndSaveImage(files[0], target.dataset.wordEn);
        lastDragTarget = null;
      });
      els.wordListContainer.addEventListener("paste", function (e) {
        var items = e.clipboardData.items;
        var found = false;
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            var file = items[i].getAsFile();
            var wordKey = file.name.split(".").slice(0, -1).join(".");
            if (wordKey) {
              processAndSaveImage(file, wordKey);
              found = true;
            }
          }
        }
        if (found) alert("Pasted image(s) are being processed based on their filename.");
      });
      els.wordListContainer.addEventListener("change", function (e) {
        if (e.target.classList.contains("edit-en-input")) {
          var unitId = e.target.dataset.unitId;
          var wordIndex = e.target.dataset.wordIndex;
          var oldEn = vocabByUnit[unitId].words[wordIndex].en;
          var newEn = e.target.value.trim();
          if (newEn && oldEn !== newEn) {
            vocabByUnit[unitId].words[wordIndex].en = newEn;
            var oldKey = oldEn.toLowerCase();
            var newKey = newEn.toLowerCase();
            if (imageCache[oldKey]) {
              imageCache[newKey] = imageCache[oldKey];
              delete imageCache[oldKey];
              try {
                localStorage.setItem(imageKey(newKey), imageCache[newKey]);
                localStorage.removeItem(imageKey(oldKey));
              } catch (err) {}
            }
            var trigger = e.target.closest(".word-card").querySelector(".word-card-image-trigger");
            if (trigger) trigger.dataset.wordEn = newEn;
          }
        }
        if (e.target.classList.contains("edit-ko-input")) {
          vocabByUnit[e.target.dataset.unitId].words[e.target.dataset.wordIndex].ko = e.target.value.trim();
        }
      });
      els.modalCancelBtn.addEventListener("click", hideConfirmationModal);
      els.modalConfirmBtn.addEventListener("click", function () {
        if (modalConfirmCallback) modalConfirmCallback();
        hideConfirmationModal();
      });
    }

    els.gameTitle.value = GAME_TITLE;
    document.title = GAME_TITLE;
    setupEventListeners();
    populateUnits();
    renderScoreboard();
    handleResetTimer();
    loadImagesFromLocalStorage();
    hideLoading();
  </script>
</body>
</html>
`,
    quizQuizTrade: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap");
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif; background: #f1f5f9; color: #0f172a; padding: 1.5rem; }
    .controls { max-width: 56rem; margin: 0 auto 1.5rem; display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; background: #fff; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.12); padding: 1.5rem 1.75rem; }
    h1 { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; color: #4338ca; width: 100%; margin-bottom: .25rem; }
    .hint { color: #64748b; font-size: .95rem; width: 100%; margin-bottom: .5rem; }
    select, button { font: inherit; font-weight: 800; padding: .5rem .9rem; border-radius: 8px; border: 2px solid #e2e8f0; background: #fff; cursor: pointer; }
    .primary { background: #6366f1; color: #fff; border-color: #6366f1; }
    .how-to { max-width: 56rem; margin: 0 auto 1.5rem; background: #eef2ff; border-radius: 1rem; padding: 1rem 1.25rem; font-size: .95rem; line-height: 1.6; }
    .how-to strong { display: block; margin-bottom: .25rem; }
    .how-to ol { padding-left: 1.25rem; }

    .cards { max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    .card { border: 1px dashed #94a3b8; padding: 1.25rem; min-height: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; position: relative; }
    .card-q { background: #fff; }
    .card-a { background: #f1f5f9; border-top: 2px dashed #475569; }
    .card .label { position: absolute; top: 6px; left: 10px; font-size: .65rem; color: #94a3b8; text-transform: uppercase; }
    .card .main { font-size: 1.3rem; font-weight: 700; }
    .card .sub { font-size: 1rem; color: #475569; margin-top: .25rem; }

    @media print {
      .controls, .how-to { display: none !important; }
      body { padding: 0; background: #fff; }
      .cards { page-break-inside: avoid; }
      .card { border: 1px dashed #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .card-a { background: #f5f5f5 !important; }
      @page { size: A4 portrait; margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="controls">
    <h1 id="title">__TITLE__</h1>
    <p class="hint">Print, cut along dashed lines, fold each pair in half. Question on front, answer on back.</p>
    <label>Unit <select id="unitSelect"></select></label>
    <label>Direction <select id="dirSelect"><option value="en2ko">English → Korean</option><option value="ko2en">Korean → English</option></select></label>
    <button type="button" class="primary" onclick="window.print()">Print</button>
  </div>
  <div class="how-to">
    <strong>How to play Quiz-Quiz-Trade</strong>
    <ol>
      <li>Each student gets one folded card.</li>
      <li>Stand up, hand up, pair up with a classmate.</li>
      <li>Partner A reads their question. Partner B answers.</li>
      <li>Partner B reads their question. Partner A answers.</li>
      <li>Trade cards and find a new partner.</li>
    </ol>
  </div>
  <div class="cards" id="cards"></div>

  <script>
    var TITLE = __TITLE_JSON__;
    var VOCAB = __VOCAB_BY_UNIT__;
    document.getElementById("title").textContent = TITLE;
    var unitSelect = document.getElementById("unitSelect");
    var dirSelect = document.getElementById("dirSelect");
    var cardsEl = document.getElementById("cards");
    var keys = Object.keys(VOCAB);

    var allOpt = document.createElement("option");
    allOpt.value = "all"; allOpt.textContent = "All units";
    unitSelect.appendChild(allOpt);
    keys.forEach(function(k) {
      var o = document.createElement("option");
      o.value = k; o.textContent = VOCAB[k].name;
      unitSelect.appendChild(o);
    });

    function getWords(unitId) {
      if (unitId === "all") return keys.reduce(function(a, k) { return a.concat(VOCAB[k].words || []); }, []);
      return (VOCAB[unitId] && VOCAB[unitId].words) || [];
    }

    function render() {
      var words = getWords(unitSelect.value);
      var dir = dirSelect.value;
      cardsEl.innerHTML = "";
      words.forEach(function(w, i) {
        var q = dir === "en2ko" ? w.en : (w.ko || w.en);
        var a = dir === "en2ko" ? (w.ko || "—") : w.en;
        cardsEl.innerHTML +=
          '<div class="card card-q"><span class="label">Q ' + (i+1) + '</span><span class="main">' + q + '</span></div>' +
          '<div class="card card-a"><span class="label">A ' + (i+1) + '</span><span class="main">' + a + '</span></div>';
      });
    }

    unitSelect.addEventListener("change", render);
    dirSelect.addEventListener("change", render);
    render();
  </script>
</body>
</html>
`,
    fanNPick: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap");
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif; background: #f1f5f9; color: #0f172a; padding: 1.5rem; }
    .controls { max-width: 56rem; margin: 0 auto 1.5rem; display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; background: #fff; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.12); padding: 1.5rem 1.75rem; }
    h1 { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; color: #4338ca; width: 100%; margin-bottom: .25rem; }
    .hint { color: #64748b; font-size: .95rem; width: 100%; margin-bottom: .5rem; }
    select, button { font: inherit; font-weight: 800; padding: .5rem .9rem; border-radius: 8px; border: 2px solid #e2e8f0; background: #fff; cursor: pointer; }
    .primary { background: #6366f1; color: #fff; border-color: #6366f1; }
    .how-to { max-width: 56rem; margin: 0 auto 1.5rem; background: #eef2ff; border-radius: 1rem; padding: 1rem 1.25rem; font-size: .95rem; line-height: 1.6; }
    .how-to strong { display: block; margin-bottom: .25rem; }
    .how-to ol { padding-left: 1.25rem; }
    .roles { max-width: 800px; margin: 0 auto 1.5rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem; text-align: center; font-size: .8rem; }
    .roles div { background: #e0e7ff; border-radius: 8px; padding: .6rem .4rem; font-weight: 600; }

    .cards { max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    .card { border: 1px dashed #94a3b8; padding: 1.25rem; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: #fff; }
    .card .num { font-size: 2rem; font-weight: 900; color: #6366f1; }
    .card .main { font-size: 1.1rem; font-weight: 700; margin-top: .35rem; }
    .card .answer { font-size: .95rem; color: #475569; margin-top: .25rem; }

    @media print {
      .controls, .how-to, .roles { display: none !important; }
      body { padding: 0; background: #fff; }
      .card { border: 1px dashed #000; }
      @page { size: A4 portrait; margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="controls">
    <h1 id="title">__TITLE__</h1>
    <p class="hint">Print numbered cards. Students fan cards, one picks, one reads, one answers, one coaches.</p>
    <label>Unit <select id="unitSelect"></select></label>
    <button type="button" class="primary" onclick="window.print()">Print</button>
  </div>
  <div class="how-to">
    <strong>How to play Fan-N-Pick</strong>
    <ol>
      <li>One student fans the cards face-down.</li>
      <li>Student 2 picks a card by number.</li>
      <li>Student 3 reads the question aloud.</li>
      <li>Student 4 answers.</li>
      <li>Student 1 coaches or praises, then roles rotate.</li>
    </ol>
  </div>
  <div class="roles">
    <div>1 Fan</div><div>2 Pick</div><div>3 Read</div><div>4 Coach</div>
  </div>
  <div class="cards" id="cards"></div>

  <script>
    var TITLE = __TITLE_JSON__;
    var VOCAB = __VOCAB_BY_UNIT__;
    document.getElementById("title").textContent = TITLE;
    var unitSelect = document.getElementById("unitSelect");
    var cardsEl = document.getElementById("cards");
    var keys = Object.keys(VOCAB);

    var allOpt = document.createElement("option");
    allOpt.value = "all"; allOpt.textContent = "All units";
    unitSelect.appendChild(allOpt);
    keys.forEach(function(k) {
      var o = document.createElement("option");
      o.value = k; o.textContent = VOCAB[k].name;
      unitSelect.appendChild(o);
    });

    function getWords(unitId) {
      if (unitId === "all") return keys.reduce(function(a, k) { return a.concat(VOCAB[k].words || []); }, []);
      return (VOCAB[unitId] && VOCAB[unitId].words) || [];
    }

    function render() {
      var words = getWords(unitSelect.value);
      cardsEl.innerHTML = "";
      words.forEach(function(w, i) {
        cardsEl.innerHTML +=
          '<div class="card"><span class="num">#' + (i+1) + '</span><span class="main">' + w.en + '</span><span class="answer">' + (w.ko || '') + '</span></div>';
      });
    }

    unitSelect.addEventListener("change", render);
    render();
  </script>
</body>
</html>
`,
    findSomeoneWho: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap");
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif; background: #f1f5f9; color: #0f172a; padding: 1.5rem; }
    .controls { max-width: 56rem; margin: 0 auto 1.5rem; display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; background: #fff; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.12); padding: 1.5rem 1.75rem; }
    h1 { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; color: #4338ca; width: 100%; margin-bottom: .25rem; }
    .hint { color: #64748b; font-size: .95rem; width: 100%; margin-bottom: .5rem; }
    select, button { font: inherit; font-weight: 800; padding: .5rem .9rem; border-radius: 8px; border: 2px solid #e2e8f0; background: #fff; cursor: pointer; }
    .primary { background: #6366f1; color: #fff; border-color: #6366f1; }
    .how-to { max-width: 56rem; margin: 0 auto 1.5rem; background: #eef2ff; border-radius: 1rem; padding: 1rem 1.25rem; font-size: .95rem; line-height: 1.6; }
    .how-to strong { display: block; margin-bottom: .25rem; }
    .how-to ol { padding-left: 1.25rem; }

    .grid-wrap { max-width: 800px; margin: 0 auto; }
    .grid-title { font-size: 1.1rem; font-weight: 700; text-align: center; margin-bottom: .75rem; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 2px solid #334155; }
    .grid.cols-4 { grid-template-columns: repeat(4, 1fr); }
    .cell { border: 1px solid #94a3b8; padding: 1rem .75rem; min-height: 110px; display: flex; flex-direction: column; justify-content: space-between; }
    .cell .prompt { font-size: .9rem; font-weight: 600; margin-bottom: .5rem; }
    .cell .name-line { border-bottom: 1px solid #64748b; height: 1.5rem; margin-top: auto; font-size: .75rem; color: #94a3b8; }

    @media print {
      .controls, .how-to { display: none !important; }
      body { padding: 0; background: #fff; }
      .grid-wrap { max-width: 100%; }
      @page { size: A4 portrait; margin: 12mm; }
    }
  </style>
</head>
<body>
  <div class="controls">
    <h1 id="title">__TITLE__</h1>
    <p class="hint">Print one worksheet per student. Walk around, find a classmate who can answer each cell, write their name.</p>
    <label>Unit <select id="unitSelect"></select></label>
    <label>Grid <select id="sizeSelect"><option value="3">3 × 3 (9 words)</option><option value="4">4 × 4 (16 words)</option></select></label>
    <button type="button" class="primary" onclick="window.print()">Print</button>
  </div>
  <div class="how-to">
    <strong>How to play Find Someone Who</strong>
    <ol>
      <li>Stand up with your worksheet and a pencil.</li>
      <li>Find a classmate. Ask them the question in one cell.</li>
      <li>If they answer correctly, write their name on that cell.</li>
      <li>You may not use the same classmate twice in a row.</li>
      <li>Try to fill all cells!</li>
    </ol>
  </div>
  <div class="grid-wrap">
    <div class="grid-title" id="gridTitle">Find Someone Who…</div>
    <div class="grid" id="grid"></div>
  </div>

  <script>
    var TITLE = __TITLE_JSON__;
    var VOCAB = __VOCAB_BY_UNIT__;
    document.getElementById("title").textContent = TITLE;
    var unitSelect = document.getElementById("unitSelect");
    var sizeSelect = document.getElementById("sizeSelect");
    var gridEl = document.getElementById("grid");
    var keys = Object.keys(VOCAB);

    var allOpt = document.createElement("option");
    allOpt.value = "all"; allOpt.textContent = "All units";
    unitSelect.appendChild(allOpt);
    keys.forEach(function(k) {
      var o = document.createElement("option");
      o.value = k; o.textContent = VOCAB[k].name;
      unitSelect.appendChild(o);
    });

    function getWords(unitId) {
      if (unitId === "all") return keys.reduce(function(a, k) { return a.concat(VOCAB[k].words || []); }, []);
      return (VOCAB[unitId] && VOCAB[unitId].words) || [];
    }

    function shuffle(arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      return arr;
    }

    function render() {
      var cols = parseInt(sizeSelect.value, 10);
      var total = cols * cols;
      var words = shuffle(getWords(unitSelect.value).slice());
      while (words.length < total && words.length > 0) {
        words = words.concat(shuffle(getWords(unitSelect.value).slice()));
      }
      words = words.slice(0, total);
      gridEl.className = "grid" + (cols === 4 ? " cols-4" : "");
      gridEl.innerHTML = "";
      words.forEach(function(w) {
        gridEl.innerHTML +=
          '<div class="cell"><div class="prompt">…can say the Korean for "<strong>' + w.en + '</strong>"</div><div class="name-line">Name: ___________</div></div>';
      });
    }

    unitSelect.addEventListener("change", render);
    sizeSelect.addEventListener("change", render);
    render();
  </script>
</body>
</html>
`,
    showdown: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap");
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif; background: #f1f5f9; color: #0f172a; padding: 1.5rem; }
    .controls { max-width: 56rem; margin: 0 auto 1.5rem; display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; background: #fff; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.12); padding: 1.5rem 1.75rem; }
    h1 { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; color: #4338ca; width: 100%; margin-bottom: .25rem; }
    .hint { color: #64748b; font-size: .95rem; width: 100%; margin-bottom: .5rem; }
    select, button { font: inherit; font-weight: 800; padding: .5rem .9rem; border-radius: 8px; border: 2px solid #e2e8f0; background: #fff; cursor: pointer; }
    .primary { background: #6366f1; color: #fff; border-color: #6366f1; }
    .how-to { max-width: 56rem; margin: 0 auto 1.5rem; background: #eef2ff; border-radius: 1rem; padding: 1rem 1.25rem; font-size: .95rem; line-height: 1.6; }
    .how-to strong { display: block; margin-bottom: .25rem; }
    .how-to ol { padding-left: 1.25rem; }

    .cards { max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    .card { border: 1px dashed #94a3b8; padding: 1.25rem; min-height: 130px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: #fff; position: relative; }
    .card .num { position: absolute; top: 6px; left: 10px; font-size: .7rem; color: #94a3b8; }
    .card .main { font-size: 1.3rem; font-weight: 700; }
    .card .fold-answer { margin-top: auto; padding-top: .75rem; border-top: 1px dashed #cbd5e1; font-size: .85rem; color: #475569; width: 100%; text-align: center; }
    .card .fold-label { font-size: .6rem; color: #94a3b8; text-transform: uppercase; }

    @media print {
      .controls, .how-to { display: none !important; }
      body { padding: 0; background: #fff; }
      .card { border: 1px dashed #000; }
      @page { size: A4 portrait; margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="controls">
    <h1 id="title">__TITLE__</h1>
    <p class="hint">Print and cut. Captain reads the question. Everyone writes an answer. Captain says "Showdown!" — flip and compare.</p>
    <label>Unit <select id="unitSelect"></select></label>
    <label>Direction <select id="dirSelect"><option value="en2ko">English → Korean</option><option value="ko2en">Korean → English</option></select></label>
    <button type="button" class="primary" onclick="window.print()">Print</button>
  </div>
  <div class="how-to">
    <strong>How to play Showdown</strong>
    <ol>
      <li>Team captain reads the card question aloud.</li>
      <li>Everyone writes their answer face-down (no peeking).</li>
      <li>Captain says "Showdown!" — everyone flips their answer.</li>
      <li>Team checks answers. Coach anyone who got it wrong.</li>
      <li>Next card — rotate captain.</li>
    </ol>
  </div>
  <div class="cards" id="cards"></div>

  <script>
    var TITLE = __TITLE_JSON__;
    var VOCAB = __VOCAB_BY_UNIT__;
    document.getElementById("title").textContent = TITLE;
    var unitSelect = document.getElementById("unitSelect");
    var dirSelect = document.getElementById("dirSelect");
    var cardsEl = document.getElementById("cards");
    var keys = Object.keys(VOCAB);

    var allOpt = document.createElement("option");
    allOpt.value = "all"; allOpt.textContent = "All units";
    unitSelect.appendChild(allOpt);
    keys.forEach(function(k) {
      var o = document.createElement("option");
      o.value = k; o.textContent = VOCAB[k].name;
      unitSelect.appendChild(o);
    });

    function getWords(unitId) {
      if (unitId === "all") return keys.reduce(function(a, k) { return a.concat(VOCAB[k].words || []); }, []);
      return (VOCAB[unitId] && VOCAB[unitId].words) || [];
    }

    function render() {
      var words = getWords(unitSelect.value);
      var dir = dirSelect.value;
      cardsEl.innerHTML = "";
      words.forEach(function(w, i) {
        var q = dir === "en2ko" ? w.en : (w.ko || w.en);
        var a = dir === "en2ko" ? (w.ko || "—") : w.en;
        cardsEl.innerHTML +=
          '<div class="card"><span class="num">#' + (i+1) + '</span><span class="main">' + q + '</span>' +
          '<div class="fold-answer"><span class="fold-label">fold / cover</span><br>' + a + '</div></div>';
      });
    }

    unitSelect.addEventListener("change", render);
    dirSelect.addEventListener("change", render);
    render();
  </script>
</body>
</html>
`,
    rallyCoach: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap");
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif; background: #f1f5f9; color: #0f172a; padding: 1.5rem; }
    .controls { max-width: 56rem; margin: 0 auto 1.5rem; display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; background: #fff; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.12); padding: 1.5rem 1.75rem; }
    h1 { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; color: #4338ca; width: 100%; margin-bottom: .25rem; }
    .hint { color: #64748b; font-size: .95rem; width: 100%; margin-bottom: .5rem; }
    select, button { font: inherit; font-weight: 800; padding: .5rem .9rem; border-radius: 8px; border: 2px solid #e2e8f0; background: #fff; cursor: pointer; }
    .primary { background: #6366f1; color: #fff; border-color: #6366f1; }
    .how-to { max-width: 56rem; margin: 0 auto 1.5rem; background: #eef2ff; border-radius: 1rem; padding: 1rem 1.25rem; font-size: .95rem; line-height: 1.6; }
    .how-to strong { display: block; margin-bottom: .25rem; }
    .how-to ol { padding-left: 1.25rem; }

    .cards { max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    .card { border: 1px dashed #94a3b8; padding: 1rem; min-height: 120px; display: flex; flex-direction: column; background: #fff; }
    .card .partner { font-size: .7rem; font-weight: 700; color: #6366f1; text-transform: uppercase; margin-bottom: .3rem; }
    .card .task { font-size: 1rem; font-weight: 600; }
    .card .answer-fold { margin-top: auto; padding-top: .5rem; border-top: 1px dashed #cbd5e1; font-size: .8rem; color: #64748b; }

    @media print {
      .controls, .how-to { display: none !important; }
      body { padding: 0; background: #fff; }
      .card { border: 1px dashed #000; }
      @page { size: A4 portrait; margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="controls">
    <h1 id="title">__TITLE__</h1>
    <p class="hint">Print pair cards. Partner A solves while Partner B coaches, then switch.</p>
    <label>Unit <select id="unitSelect"></select></label>
    <button type="button" class="primary" onclick="window.print()">Print</button>
  </div>
  <div class="how-to">
    <strong>How to play RallyCoach</strong>
    <ol>
      <li>Partners sit side by side with the card set.</li>
      <li>Partner A reads the left task and writes the answer.</li>
      <li>Partner B watches and coaches (no writing yet).</li>
      <li>Partners check the answer (fold open).</li>
      <li>Switch roles for the next card — Partner B writes, Partner A coaches.</li>
    </ol>
  </div>
  <div class="cards" id="cards"></div>

  <script>
    var TITLE = __TITLE_JSON__;
    var VOCAB = __VOCAB_BY_UNIT__;
    document.getElementById("title").textContent = TITLE;
    var unitSelect = document.getElementById("unitSelect");
    var cardsEl = document.getElementById("cards");
    var keys = Object.keys(VOCAB);

    var allOpt = document.createElement("option");
    allOpt.value = "all"; allOpt.textContent = "All units";
    unitSelect.appendChild(allOpt);
    keys.forEach(function(k) {
      var o = document.createElement("option");
      o.value = k; o.textContent = VOCAB[k].name;
      unitSelect.appendChild(o);
    });

    function getWords(unitId) {
      if (unitId === "all") return keys.reduce(function(a, k) { return a.concat(VOCAB[k].words || []); }, []);
      return (VOCAB[unitId] && VOCAB[unitId].words) || [];
    }

    function render() {
      var words = getWords(unitSelect.value);
      cardsEl.innerHTML = "";
      words.forEach(function(w, i) {
        var partnerLabel = (i % 2 === 0) ? "Partner A" : "Partner B";
        cardsEl.innerHTML +=
          '<div class="card"><span class="partner">' + partnerLabel + ' — Card ' + (Math.floor(i/2)+1) + '</span>' +
          '<span class="task">Write the Korean for: <strong>' + w.en + '</strong></span>' +
          '<div class="answer-fold">fold → ' + (w.ko || '—') + '</div></div>';
      });
    }

    unitSelect.addEventListener("change", render);
    render();
  </script>
</body>
</html>
`,
    sentenceScramble: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&display=swap");
    * { box-sizing: border-box; }
    html, body { margin: 0; }
    body { font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif; background: #f1f5f9; color: #0f172a; min-height: 100vh; }
    select, button, input { font: inherit; font-weight: 800; }
    .topbar { position: sticky; top: 0; z-index: 20; background: #fff; border-bottom: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(15,23,42,.06); padding: .75rem 1.25rem; display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; }
    .topbar h1 { margin: 0 auto 0 0; font-size: 1.25rem; font-weight: 900; color: #be185d; }
    select { padding: .5rem .8rem; border-radius: .6rem; border: 2px solid #e2e8f0; background: #f8fafc; color: #334155; }
    .btn { border: 0; border-radius: .6rem; padding: .55rem 1rem; cursor: pointer; color: #fff; background: #db2777; }
    .btn:hover { filter: brightness(1.07); }
    .btn.slate { background: #e2e8f0; color: #334155; }
    .btn.green { background: #10b981; }
    .btn.amber { background: #f59e0b; }
    .btn.indigo { background: #6366f1; }
    .btn:disabled { opacity: .45; cursor: default; filter: none; }
    .wrap { max-width: 68rem; margin: 0 auto; padding: 1.25rem; }
    .stage { background: #fff; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(15,23,42,.15); padding: 1.5rem; text-align: center; }
    .meta { display: flex; justify-content: space-between; color: #64748b; font-weight: 800; font-size: .95rem; margin-bottom: .4rem; }
    .prompt { font-size: 1.15rem; color: #475569; font-weight: 800; margin: .25rem 0 1rem; }
    .tray { position: relative; display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: .8rem; min-height: 8rem; padding: 1.4rem; background: #fdf2f8; border: 3px dashed #f9a8d4; border-radius: 1rem; touch-action: none; user-select: none; -webkit-user-select: none; }
    .tray.solved { background: #f0fdf4; border: 3px solid #86efac; }
    .chip { font-size: clamp(1.3rem, 3vw, 2rem); font-weight: 900; padding: .5rem 1.1rem; border-radius: .8rem; background: #fff; border: 3px solid #f472b6; color: #0f172a; cursor: grab; box-shadow: 0 4px 0 #f9a8d4; white-space: nowrap; }
    .chip.placeholder { background: transparent; border-style: dashed; border-color: #f9a8d4; color: transparent; box-shadow: none; }
    .chip.locked { background: #e0e7ff; border-color: #6366f1; box-shadow: 0 4px 0 #a5b4fc; cursor: default; }
    .chip.ok { background: #dcfce7; border-color: #22c55e; box-shadow: 0 4px 0 #86efac; }
    .chip.bad { background: #fee2e2; border-color: #ef4444; box-shadow: 0 4px 0 #fca5a5; }
    .ghost { position: fixed; z-index: 100; pointer-events: none; margin: 0; transform: scale(1.1) rotate(-2deg); box-shadow: 0 18px 30px rgba(15,23,42,.28); cursor: grabbing; }
    .feedback { min-height: 2.6rem; margin-top: 1rem; font-size: 1.45rem; font-weight: 900; color: #15803d; }
    .feedback.try { color: #b45309; font-size: 1.15rem; }
    .actions { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; margin-top: .75rem; }
    .actions .btn { font-size: 1.1rem; padding: .8rem 1.5rem; }
    .award { display: flex; flex-wrap: wrap; gap: .5rem; justify-content: center; margin-top: .9rem; }
    .award .btn { padding: .6rem 1.1rem; }
    .scores { margin-top: 1.25rem; background: #fff; border-radius: 1rem; padding: 1rem; box-shadow: 0 10px 25px -10px rgba(15,23,42,.12); }
    .scores-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: .75rem; flex-wrap: wrap; gap: .5rem; }
    .scores-head h2 { margin: 0; font-size: 1.2rem; color: #334155; }
    .teams { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: .75rem; }
    .team { border-radius: .8rem; padding: .75rem; text-align: center; }
    .team input { width: 100%; text-align: center; border: 0; background: transparent; font-size: 1.1rem; font-weight: 900; color: inherit; }
    .team .score { font-size: 2.2rem; font-weight: 900; }
    .team .row { display: flex; gap: .4rem; }
    .team .row button { flex: 1; border: 0; border-radius: .5rem; padding: .3rem; font-size: 1.2rem; cursor: pointer; color: #fff; }
    .how { color: #64748b; font-size: .9rem; margin-top: 1rem; text-align: center; }
    @media (max-width: 640px) { .topbar h1 { width: 100%; } .wrap { padding: .75rem; } .stage { padding: 1rem; } }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>__TITLE__</h1>
    <label>Unit <select id="unit"></select></label>
    <button type="button" class="btn slate" id="restart">🔀 Shuffle sentences</button>
  </div>

  <div class="wrap">
    <div class="stage">
      <div class="meta"><span id="count">Sentence 1 / 1</span><span id="words">0 words</span></div>
      <p class="prompt">Drag the words into the right order!</p>
      <div class="tray" id="tray"></div>
      <div class="feedback" id="feedback"></div>
      <div class="award" id="award"></div>
      <div class="actions">
        <button type="button" class="btn green" id="checkBtn">✔ Check</button>
        <button type="button" class="btn indigo" id="hintBtn">💡 Hint</button>
        <button type="button" class="btn amber" id="revealBtn">👀 Reveal</button>
        <button type="button" class="btn" id="nextBtn">Next ➜</button>
      </div>
    </div>

    <div class="scores">
      <div class="scores-head">
        <h2>Scoreboard</h2>
        <div style="display:flex;gap:.5rem">
          <button type="button" class="btn slate" id="addTeam">+ Team</button>
          <button type="button" class="btn slate" id="removeTeam">− Team</button>
          <button type="button" class="btn slate" id="resetScores">Reset</button>
        </div>
      </div>
      <div class="teams" id="teams"></div>
    </div>
    <p class="how">A student from each team comes to the board. Hint locks the next correct word in place (purple). Check colours each word: green = right spot.</p>
  </div>

  <script>
    var TITLE = __TITLE_JSON__;
    var DATA = __ACTIVITY_DATA__;
    var UNITS = (DATA.units || []).map(function (u, i) { return { id: u.id || ("u" + (i + 1)), name: u.name || ("Unit " + (i + 1)), sentences: (u.sentences || []).filter(Boolean) }; }).filter(function (u) { return u.sentences.length; });
    var TONES = [["#dbeafe", "#1e40af", "#3b82f6"], ["#ffe4e6", "#9f1239", "#f43f5e"], ["#fef3c7", "#92400e", "#f59e0b"],
                 ["#ccfbf1", "#115e59", "#14b8a6"], ["#ede9fe", "#5b21b6", "#8b5cf6"], ["#ecfccb", "#3f6212", "#84cc16"]];

    function $(id) { return document.getElementById(id); }
    var tray = $("tray");
    var queue = [], qi = 0, answer = [], locked = 0, solved = false, drag = null, lastSwap = 0;
    var teams = [{ name: "Team 1", score: 0 }, { name: "Team 2", score: 0 }];

    function shuffle(a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }

    function populate() {
      var sel = $("unit");
      var o = document.createElement("option"); o.value = "all"; o.textContent = "All units"; sel.appendChild(o);
      UNITS.forEach(function (u) { var op = document.createElement("option"); op.value = u.id; op.textContent = u.name; sel.appendChild(op); });
    }

    function buildQueue() {
      var v = $("unit").value;
      var pool = v === "all" ? UNITS.reduce(function (a, u) { return a.concat(u.sentences); }, [])
                             : UNITS.filter(function (u) { return u.id === v; })[0].sentences;
      queue = shuffle(pool); qi = 0; load();
    }

    function load() {
      var s = String(queue[qi]).replace(/\\s+/g, " ").trim();
      answer = s.split(" ");
      locked = 0; solved = false;
      var order = shuffle(answer), guard = 0;
      while (answer.length > 1 && order.join(" ") === s && guard++ < 30) order = shuffle(answer);
      tray.innerHTML = ""; tray.classList.remove("solved");
      order.forEach(function (w) { var c = document.createElement("div"); c.className = "chip"; c.textContent = w; tray.appendChild(c); });
      setFeedback("", false);
      $("award").innerHTML = "";
      $("count").textContent = "Sentence " + (qi + 1) + " / " + queue.length;
      $("words").textContent = answer.length + " words";
      setButtons();
    }

    function setButtons() {
      $("checkBtn").disabled = solved; $("hintBtn").disabled = solved; $("revealBtn").disabled = solved;
    }
    function setFeedback(text, tryAgain) {
      var f = $("feedback"); f.textContent = text; f.classList.toggle("try", !!tryAgain);
    }

    // FLIP animation: other words glide out of the way
    function flip(mutate) {
      var els = Array.prototype.slice.call(tray.children);
      var first = els.map(function (el) { return el.getBoundingClientRect(); });
      mutate();
      els.forEach(function (el, i) {
        var l = el.getBoundingClientRect();
        var dx = first[i].left - l.left, dy = first[i].top - l.top;
        if (!dx && !dy) return;
        el.style.transition = "none";
        el.style.transform = "translate(" + dx + "px," + dy + "px)";
        void el.offsetWidth;
        el.style.transition = "transform .22s ease";
        el.style.transform = "";
      });
    }

    function clearMarks() {
      Array.prototype.forEach.call(tray.children, function (c) { if (!c.classList.contains("locked")) c.classList.remove("ok", "bad"); });
    }

    tray.addEventListener("pointerdown", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip || solved || drag || chip.classList.contains("locked")) return;
      e.preventDefault();
      var r = chip.getBoundingClientRect();
      clearMarks();
      setFeedback("", false);
      var ghost = chip.cloneNode(true);
      ghost.classList.add("ghost");
      ghost.style.left = r.left + "px"; ghost.style.top = r.top + "px"; ghost.style.width = r.width + "px";
      document.body.appendChild(ghost);
      chip.classList.add("placeholder");
      drag = { chip: chip, ghost: ghost, dx: e.clientX - r.left, dy: e.clientY - r.top };
    });

    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      drag.ghost.style.left = (e.clientX - drag.dx) + "px";
      drag.ghost.style.top = (e.clientY - drag.dy) + "px";
      if (Date.now() - lastSwap < 140) return;
      var tr = tray.getBoundingClientRect();
      var px = e.clientX - tr.left, py = e.clientY - tr.top;
      var best = null, bd = Infinity, after = false;
      Array.prototype.forEach.call(tray.children, function (c) {
        if (c === drag.chip || c.classList.contains("locked")) return;
        var cx = c.offsetLeft + c.offsetWidth / 2, cy = c.offsetTop + c.offsetHeight / 2;
        var d = Math.abs(px - cx) + Math.abs(py - cy) * 2.5;
        if (d < bd) { bd = d; best = c; after = px > cx; }
      });
      if (!best) return;
      var ref = after ? best.nextSibling : best;
      if (ref === drag.chip || ref === drag.chip.nextSibling) return;
      lastSwap = Date.now();
      var chip = drag.chip;
      flip(function () { tray.insertBefore(chip, ref); });
    });

    function endDrag() {
      if (!drag) return;
      var chip = drag.chip, ghost = drag.ghost;
      drag = null;
      var r = chip.getBoundingClientRect();
      ghost.style.transition = "left .18s ease, top .18s ease, transform .18s ease, box-shadow .18s ease";
      ghost.style.left = r.left + "px"; ghost.style.top = r.top + "px";
      ghost.style.transform = "none"; ghost.style.boxShadow = "none";
      setTimeout(function () { ghost.remove(); chip.classList.remove("placeholder"); }, 190);
    }
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    function check() {
      if (solved) return;
      var all = true;
      Array.prototype.forEach.call(tray.children, function (c, i) {
        var ok = c.textContent === answer[i];
        c.classList.toggle("ok", ok); c.classList.toggle("bad", !ok);
        if (!ok) all = false;
      });
      if (all) win(true);
      else setFeedback("Not yet! Green words are in the right spot. Try again.", true);
    }

    function win(points) {
      solved = true;
      tray.classList.add("solved");
      setFeedback("🎉 " + answer.join(" "), false);
      setButtons();
      var award = $("award"); award.innerHTML = "";
      if (!points) return;
      teams.forEach(function (t, i) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "btn"; b.style.background = TONES[i % TONES.length][2];
        b.textContent = "+1 " + t.name;
        b.addEventListener("click", function () {
          t.score += 1; renderTeams();
          Array.prototype.forEach.call(award.children, function (x) { x.disabled = true; });
          b.textContent = "✔ " + t.name;
        });
        award.appendChild(b);
      });
    }

    function hint() {
      if (solved || locked >= answer.length) return;
      var w = answer[locked];
      var chips = Array.prototype.slice.call(tray.children);
      var c = chips.slice(locked).filter(function (x) { return x.textContent === w; })[0];
      clearMarks();
      flip(function () { tray.insertBefore(c, tray.children[locked]); });
      c.classList.add("locked");
      locked++;
      if (locked >= answer.length - 1) { check(); }
    }

    function reveal() {
      if (solved) return;
      flip(function () {
        answer.forEach(function (w, i) {
          var chips = Array.prototype.slice.call(tray.children);
          var c = chips.slice(i).filter(function (x) { return x.textContent === w; })[0];
          tray.insertBefore(c, tray.children[i]);
        });
      });
      Array.prototype.forEach.call(tray.children, function (c) { c.classList.remove("bad"); c.classList.add("ok"); });
      win(false);
    }

    function next() {
      qi++;
      if (qi >= queue.length) { queue = shuffle(queue); qi = 0; }
      load();
    }

    function renderTeams() {
      var box = $("teams"); box.innerHTML = "";
      teams.forEach(function (t, i) {
        var tone = TONES[i % TONES.length];
        var d = document.createElement("div");
        d.className = "team"; d.style.background = tone[0]; d.style.color = tone[1];
        d.innerHTML = '<input type="text"><div class="score"></div><div class="row"><button type="button">−</button><button type="button">+</button></div>';
        var inp = d.querySelector("input"); inp.value = t.name;
        inp.addEventListener("input", function () { t.name = inp.value; });
        d.querySelector(".score").textContent = t.score;
        var btns = d.querySelectorAll(".row button");
        btns[0].style.background = tone[1]; btns[1].style.background = tone[2];
        btns[0].addEventListener("click", function () { if (t.score > 0) t.score--; renderTeams(); });
        btns[1].addEventListener("click", function () { t.score++; renderTeams(); });
        box.appendChild(d);
      });
    }

    $("checkBtn").addEventListener("click", check);
    $("hintBtn").addEventListener("click", hint);
    $("revealBtn").addEventListener("click", reveal);
    $("nextBtn").addEventListener("click", next);
    $("restart").addEventListener("click", buildQueue);
    $("unit").addEventListener("change", buildQueue);
    $("addTeam").addEventListener("click", function () { if (teams.length < 6) { teams.push({ name: "Team " + (teams.length + 1), score: 0 }); renderTeams(); } });
    $("removeTeam").addEventListener("click", function () { if (teams.length > 1) { teams.pop(); renderTeams(); } });
    $("resetScores").addEventListener("click", function () { teams.forEach(function (t) { t.score = 0; }); renderTeams(); });

    populate();
    renderTeams();
    buildQueue();
  </script>
</body>
</html>
`,
    gapFill: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&display=swap");
    * { box-sizing: border-box; }
    html, body { margin: 0; }
    body { font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif; background: #f1f5f9; color: #0f172a; min-height: 100vh; }
    select, button, input { font: inherit; font-weight: 800; }
    .topbar { position: sticky; top: 0; z-index: 20; background: #fff; border-bottom: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(15,23,42,.06); padding: .75rem 1.25rem; display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; }
    .topbar h1 { margin: 0 auto 0 0; font-size: 1.25rem; font-weight: 900; color: #be185d; }
    select { padding: .5rem .8rem; border-radius: .6rem; border: 2px solid #e2e8f0; background: #f8fafc; color: #334155; }
    .toggle { display: inline-flex; align-items: center; gap: .35rem; color: #475569; font-size: .95rem; cursor: pointer; }
    .toggle input { width: 1.1rem; height: 1.1rem; accent-color: #db2777; }
    .btn { border: 0; border-radius: .6rem; padding: .55rem 1rem; cursor: pointer; color: #fff; background: #db2777; }
    .btn:hover { filter: brightness(1.07); }
    .btn.slate { background: #e2e8f0; color: #334155; }
    .btn.amber { background: #f59e0b; }
    .btn.indigo { background: #6366f1; }
    .wrap { max-width: 76rem; margin: 0 auto; padding: 1.25rem; display: grid; grid-template-columns: 1fr 17rem; gap: 1.25rem; align-items: start; }
    .paper { background: #fff; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(15,23,42,.15); padding: 1.75rem 2rem; }
    .paper-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: .5rem; border-bottom: 3px solid #fbcfe8; padding-bottom: .6rem; margin-bottom: 1rem; }
    .paper-head h2 { margin: 0; font-size: clamp(1.5rem, 3vw, 2.1rem); font-weight: 900; }
    .by { color: #64748b; font-weight: 800; }
    .lines p { margin: 0; font-size: clamp(1.25rem, 2.6vw, 1.8rem); line-height: 2.1; font-weight: 700; }
    .lines p.gap { height: .9rem; }
    .blank { display: inline-flex; align-items: center; justify-content: center; position: relative; vertical-align: middle; height: 2.6rem; padding: 0 .6rem; margin: 0 .15rem; border: 0; border-radius: .55rem; cursor: pointer; background: #fce7f3; box-shadow: inset 0 -4px 0 #f9a8d4; color: #9d174d; font-size: inherit; font-weight: 900; transition: transform .15s; }
    .blank:hover { transform: translateY(-2px); }
    .blank .num { position: absolute; top: -.55rem; left: -.35rem; background: #db2777; color: #fff; border-radius: 999px; font-size: .75rem; min-width: 1.35rem; height: 1.35rem; display: grid; place-items: center; padding: 0 .25rem; }
    .blank .mask { letter-spacing: .12em; color: #be185d; opacity: .8; }
    .blank .word { display: none; color: #dc2626; text-decoration: underline; text-underline-offset: 4px; }
    .blank.open { background: transparent; box-shadow: none; animation: pop .35s ease; }
    .blank.open .mask { display: none; }
    .blank.open .word { display: inline; }
    .blank.open .num { background: #94a3b8; }
    .blank.pick { animation: pulse 1s ease-in-out infinite; background: #fde68a; box-shadow: inset 0 -4px 0 #f59e0b, 0 0 0 4px #fcd34d; }
    @keyframes pop { 0% { transform: scale(.6); } 70% { transform: scale(1.12); } 100% { transform: scale(1); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
    .bar { display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; }
    .bar .count { margin-left: auto; color: #64748b; font-weight: 900; }
    .side { display: flex; flex-direction: column; gap: 1rem; position: sticky; top: 5.5rem; }
    .panel { background: #fff; border-radius: 1rem; padding: 1rem; box-shadow: 0 10px 25px -10px rgba(15,23,42,.12); }
    .panel h3 { margin: 0 0 .6rem; font-size: 1.05rem; color: #334155; }
    .bank { display: flex; flex-wrap: wrap; gap: .4rem; }
    .bank span { background: #f1f5f9; border: 2px solid #e2e8f0; border-radius: .5rem; padding: .2rem .55rem; font-weight: 900; font-size: 1.05rem; }
    .bank span.used { text-decoration: line-through; opacity: .4; }
    .team { border-radius: .7rem; padding: .55rem .7rem; display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; }
    .team input { flex: 1; min-width: 0; border: 0; background: transparent; font-weight: 900; color: inherit; }
    .team .score { font-size: 1.6rem; font-weight: 900; min-width: 2rem; text-align: center; }
    .team button { border: 0; border-radius: .45rem; width: 2rem; height: 2rem; cursor: pointer; color: #fff; font-size: 1.1rem; }
    .team-tools { display: flex; gap: .4rem; }
    .team-tools .btn { flex: 1; padding: .4rem; font-size: .85rem; }
    .hidden { display: none !important; }
    @media (max-width: 900px) { .wrap { grid-template-columns: 1fr; } .side { position: static; } }
    @media (max-width: 640px) { .topbar h1 { width: 100%; } .wrap { padding: .75rem; } .paper { padding: 1.1rem; } }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>__TITLE__</h1>
    <label>Unit <select id="unit"></select></label>
    <label>Blanks <select id="level"><option value="book">Book blanks</option><option value="more">Book + extra blanks</option></select></label>
    <label class="toggle"><input type="checkbox" id="bankToggle" checked> Word bank</label>
    <label class="toggle"><input type="checkbox" id="letterToggle"> First-letter hint</label>
    <button type="button" class="btn slate" id="reset">↺ New board</button>
  </div>

  <div class="wrap">
    <div class="paper">
      <div class="paper-head"><h2 id="ptitle"></h2><span class="by" id="pby"></span></div>
      <div class="lines" id="lines"></div>
      <div class="bar">
        <button type="button" class="btn amber" id="randomBtn">🎯 Random blank</button>
        <button type="button" class="btn indigo" id="allBtn">👀 Reveal all</button>
        <button type="button" class="btn slate" id="hideBtn">🙈 Hide all</button>
        <span class="count" id="count"></span>
      </div>
    </div>
    <div class="side">
      <div class="panel" id="bankPanel">
        <h3>Word bank</h3>
        <div class="bank" id="bank"></div>
      </div>
      <div class="panel">
        <h3>Teams</h3>
        <div id="teams"></div>
        <div class="team-tools">
          <button type="button" class="btn slate" id="addTeam">+ Team</button>
          <button type="button" class="btn slate" id="removeTeam">− Team</button>
          <button type="button" class="btn slate" id="resetScores">Reset</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Model Writing passages from the answer key; [brackets] = the red blanks in the book
    var TITLE = __TITLE_JSON__;
    var DATA = __ACTIVITY_DATA__;
    var UNITS = (DATA.units || []).map(function (u, i) { return { id: u.id || ("u" + (i + 1)), name: u.name || ("Unit " + (i + 1)), title: u.title || u.name || ("Unit " + (i + 1)), by: u.by || "", lines: (u.lines || []).map(function (l) { return String(l == null ? "" : l); }) }; }).filter(function (u) { return u.lines.length; });
    var STOP = { the: 1, and: 1, but: 1, you: 1, are: 1, can: 1, too: 1, with: 1, our: 1, your: 1, its: 1, i: 1, "i'm": 1, dear: 1 };
    var TONES = [["#dbeafe", "#1e40af", "#3b82f6"], ["#ffe4e6", "#9f1239", "#f43f5e"], ["#fef3c7", "#92400e", "#f59e0b"],
                 ["#ccfbf1", "#115e59", "#14b8a6"], ["#ede9fe", "#5b21b6", "#8b5cf6"], ["#ecfccb", "#3f6212", "#84cc16"]];

    function $(id) { return document.getElementById(id); }
    var blanks = [];
    var teams = [{ name: "Team 1", score: 0 }, { name: "Team 2", score: 0 }];

    function shuffle(a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }

    function addExtra(line) {
      var words = line.split(" "), cand = [];
      words.forEach(function (w, i) {
        var core = w.replace(/[^A-Za-z'’-]/g, "");
        if (core.length >= 3 && !STOP[core.toLowerCase()]) cand.push(i);
      });
      if (!cand.length) return [line];
      var i = cand[Math.floor(Math.random() * cand.length)];
      var m = words[i].match(/^([^A-Za-z']*)([A-Za-z'’-]+)(.*)$/);
      if (!m) return [line];
      var before = words.slice(0, i).join(" ") + (i ? " " : "") + m[1];
      var after = m[3] + (i < words.length - 1 ? " " : "") + words.slice(i + 1).join(" ");
      return [before, m[2], after];
    }

    function mask(ans) {
      var showFirst = $("letterToggle").checked;
      return ans.split("").map(function (ch, i) {
        if (ch === " ") return "\\u00a0\\u00a0";
        if (/[^A-Za-z0-9]/.test(ch)) return ch;
        return (showFirst && i === 0) ? ch : "_";
      }).join("");
    }

    function makeBlank(ans) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "blank";
      var n = blanks.length + 1;
      b.innerHTML = '<span class="num">' + n + '</span><span class="mask"></span><span class="word"></span>';
      b.querySelector(".mask").textContent = mask(ans);
      b.querySelector(".word").textContent = ans;
      var item = { ans: ans, el: b, open: false };
      b.addEventListener("click", function () { setOpen(item, !item.open); });
      blanks.push(item);
      return b;
    }

    function setOpen(item, open) {
      item.open = open;
      item.el.classList.toggle("open", open);
      item.el.classList.remove("pick");
      update();
    }

    function render() {
      var u = UNITS.filter(function (x) { return x.id === $("unit").value; })[0];
      var extra = $("level").value === "more";
      $("ptitle").textContent = u.title;
      $("pby").textContent = u.by;
      var box = $("lines"); box.innerHTML = ""; blanks = [];
      u.lines.forEach(function (line) {
        var p = document.createElement("p");
        if (!line) { p.className = "gap"; box.appendChild(p); return; }
        var parts = line.split(/\\[([^\\]]+)\\]/);
        if (extra && parts.length === 1) parts = addExtra(line);
        parts.forEach(function (t, i) {
          if (i % 2 === 0) { if (t) p.appendChild(document.createTextNode(t)); }
          else p.appendChild(makeBlank(t));
        });
        box.appendChild(p);
      });
      renderBank();
      update();
    }

    function renderBank() {
      var bank = $("bank"); bank.innerHTML = "";
      shuffle(blanks.map(function (b) { return b.ans; })).forEach(function (w) {
        var s = document.createElement("span"); s.textContent = w; bank.appendChild(s);
      });
    }

    function update() {
      var opened = blanks.filter(function (b) { return b.open; });
      $("count").textContent = opened.length + " / " + blanks.length + " revealed";
      var used = {};
      opened.forEach(function (b) { used[b.ans] = (used[b.ans] || 0) + 1; });
      Array.prototype.forEach.call($("bank").children, function (s) {
        var w = s.textContent;
        if (used[w]) { s.classList.add("used"); used[w]--; } else s.classList.remove("used");
      });
    }

    function randomBlank() {
      var closed = blanks.filter(function (b) { return !b.open; });
      blanks.forEach(function (b) { b.el.classList.remove("pick"); });
      if (!closed.length) return;
      var pick = closed[Math.floor(Math.random() * closed.length)];
      pick.el.classList.add("pick");
      pick.el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function renderTeams() {
      var box = $("teams"); box.innerHTML = "";
      teams.forEach(function (t, i) {
        var tone = TONES[i % TONES.length];
        var d = document.createElement("div");
        d.className = "team"; d.style.background = tone[0]; d.style.color = tone[1];
        d.innerHTML = '<input type="text"><button type="button">−</button><span class="score"></span><button type="button">+</button>';
        var inp = d.querySelector("input"); inp.value = t.name;
        inp.addEventListener("input", function () { t.name = inp.value; });
        d.querySelector(".score").textContent = t.score;
        var btns = d.querySelectorAll("button");
        btns[0].style.background = tone[1]; btns[1].style.background = tone[2];
        btns[0].addEventListener("click", function () { if (t.score > 0) t.score--; renderTeams(); });
        btns[1].addEventListener("click", function () { t.score++; renderTeams(); });
        box.appendChild(d);
      });
    }

    UNITS.forEach(function (u) { var o = document.createElement("option"); o.value = u.id; o.textContent = u.name; $("unit").appendChild(o); });
    $("unit").addEventListener("change", render);
    $("level").addEventListener("change", render);
    $("reset").addEventListener("click", render);
    $("bankToggle").addEventListener("change", function () { $("bankPanel").classList.toggle("hidden", !this.checked); });
    $("letterToggle").addEventListener("change", function () {
      blanks.forEach(function (b) { b.el.querySelector(".mask").textContent = mask(b.ans); });
    });
    $("randomBtn").addEventListener("click", randomBlank);
    $("allBtn").addEventListener("click", function () { blanks.forEach(function (b) { if (!b.open) setOpen(b, true); }); });
    $("hideBtn").addEventListener("click", function () { blanks.forEach(function (b) { if (b.open) setOpen(b, false); }); });
    $("addTeam").addEventListener("click", function () { if (teams.length < 6) { teams.push({ name: "Team " + (teams.length + 1), score: 0 }); renderTeams(); } });
    $("removeTeam").addEventListener("click", function () { if (teams.length > 1) { teams.pop(); renderTeams(); } });
    $("resetScores").addEventListener("click", function () { teams.forEach(function (t) { t.score = 0; }); renderTeams(); });

    renderTeams();
    render();
  </script>
</body>
</html>
`,
    writingCards: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&display=swap");
    * { box-sizing: border-box; }
    html, body { margin: 0; }
    body { font-family: Nunito, "Segoe UI", "Malgun Gothic", sans-serif; background: #f1f5f9; color: #0f172a; min-height: 100vh; }
    select, button, input { font: inherit; font-weight: 800; }
    .topbar { position: sticky; top: 0; z-index: 20; background: #fff; border-bottom: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(15,23,42,.06); padding: .75rem 1.25rem; display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; }
    .topbar h1 { margin: 0 auto 0 0; font-size: 1.25rem; font-weight: 900; color: #be185d; }
    select { padding: .5rem .8rem; border-radius: .6rem; border: 2px solid #e2e8f0; background: #f8fafc; color: #334155; }
    .seg { display: inline-flex; border: 2px solid #e2e8f0; border-radius: .6rem; overflow: hidden; }
    .seg button { border: 0; background: #f8fafc; color: #475569; padding: .45rem .8rem; cursor: pointer; }
    .seg button.on { background: #db2777; color: #fff; }
    .btn { border: 0; border-radius: .6rem; padding: .55rem 1rem; cursor: pointer; color: #fff; background: #db2777; }
    .btn:hover { filter: brightness(1.07); }
    .btn.slate { background: #e2e8f0; color: #334155; }
    .btn.indigo { background: #6366f1; }
    .wrap { max-width: 56rem; margin: 0 auto; padding: 1.25rem; }
    .nav { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-bottom: .9rem; }
    .nav .btn { font-size: 1.1rem; }
    .nav .pos { color: #64748b; font-weight: 900; }
    .card { background: #fff; border-radius: 1.1rem; box-shadow: 0 25px 50px -12px rgba(15,23,42,.18); overflow: hidden; }
    .card-head { padding: 1.1rem 1.5rem; text-align: center; }
    .card-head h2 { margin: 0; font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 900; letter-spacing: .03em; text-transform: uppercase; }
    .card-body { padding: 1.4rem 2rem 1.8rem; }
    .card-body p { margin: 0; font-size: clamp(1.25rem, 2.8vw, 1.85rem); line-height: 2.15; font-weight: 700; }
    .blank { display: inline-block; min-width: 6.5rem; margin: 0 .15rem; padding: 0 .55rem; border: 0; border-bottom: 3px solid #94a3b8; border-radius: .5rem .5rem 0 0; background: #f8fafc; color: #2563eb; font-size: inherit; font-weight: 900; cursor: pointer; text-align: center; line-height: 1.5; vertical-align: baseline; }
    .blank:hover { background: #eff6ff; }
    .blank.empty { color: #cbd5e1; }
    .blank.spinning { color: #93c5fd; }
    .blank.landed { animation: land .3s ease; }
    .blank[contenteditable="true"] { outline: 3px solid #6366f1; background: #fff; cursor: text; }
    .pron { border: 0; background: #fef9c3; color: #854d0e; border-radius: .4rem; padding: 0 .3rem; font-size: inherit; font-weight: 900; cursor: pointer; }
    @keyframes land { 0% { transform: translateY(-8px) scale(1.1); } 100% { transform: none; } }
    .footer { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; align-items: center; margin-top: 1rem; }
    .footer .btn { font-size: 1.1rem; padding: .75rem 1.4rem; }
    .tip { text-align: center; color: #475569; font-weight: 800; margin: 1rem 0 0; font-size: 1.05rem; }
    .tip small { display: block; color: #94a3b8; font-weight: 700; margin-top: .3rem; font-size: .85rem; }
    @media (max-width: 640px) { .topbar h1 { width: 100%; } .wrap { padding: .75rem; } .card-body { padding: 1rem; } }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>__TITLE__</h1>
    <label>Card <select id="cardSel"></select></label>
    <div class="seg" id="modeSeg">
      <button type="button" data-mode="spin" class="on">🎰 Spin</button>
      <button type="button" data-mode="blank">🗣 Say it</button>
      <button type="button" data-mode="type">✎ Type</button>
    </div>
    <div class="seg" id="pronSeg">
      <button type="button" data-p="he" class="on">He</button>
      <button type="button" data-p="she">She</button>
    </div>
  </div>

  <div class="wrap">
    <div class="nav">
      <button type="button" class="btn slate" id="prevBtn">◀</button>
      <span class="pos" id="pos"></span>
      <button type="button" class="btn slate" id="nextBtn">▶</button>
    </div>
    <div class="card">
      <div class="card-head" id="cardHead"><h2 id="cardTitle"></h2></div>
      <div class="card-body" id="cardBody"></div>
    </div>
    <div class="footer">
      <button type="button" class="btn" id="spinAll">🎰 Spin all</button>
      <button type="button" class="btn slate" id="clearBtn">Clear</button>
      <button type="button" class="btn indigo" id="readBtn">🔊 Read aloud</button>
    </div>
    <p class="tip" id="tip"></p>
  </div>

  <script>
    // Frames from the Writing Assignment Cards. {cat} = blank, {cat#id} = linked blank, {He}/{he}/{his}/{him} = pronoun.
    var TITLE = __TITLE_JSON__;
    var DATA = __ACTIVITY_DATA__;
    var PALETTE = ["#fbcfe8", "#bfdbfe", "#bbf7d0", "#fed7aa"];
    var CARDS = (DATA.cards || []).filter(function (c) { return c && Array.isArray(c.lines) && c.lines.length; }).map(function (c, i) { return { id: c.id || ("c" + (i + 1)), title: c.title || ("Card " + (i + 1)), color: c.color || PALETTE[i % PALETTE.length], lines: c.lines.map(String) }; });

    // Word pools built from the unit word lists and model answers
    var POOLS = DATA.pools || {};
    var PRON = { he: { He: "He", he: "he", his: "his", him: "him" }, she: { He: "She", he: "she", his: "her", him: "her" } };
    var TIPS = {
      spin: "Read it aloud together. Does it make sense, or is it silly? 🤪 Fix the silly parts!<small>Click any blank to spin just that one.</small>",
      blank: "Choose a student to say the card with their own words.<small>Stuck? Click a blank to spin an idea.</small>",
      type: "Collect the class's ideas: click a blank and type. Press Enter to finish.<small>Use this to build a class model before writing.</small>"
    };

    function $(id) { return document.getElementById(id); }
    var idx = 0, mode = "spin", pron = "he";
    var stateByCard = {};
    var spinning = 0;

    function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
    function shuffle(a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }
    function card() { return CARDS[idx]; }
    function values() { var id = card().id; if (!stateByCard[id]) stateByCard[id] = {}; return stateByCard[id]; }

    // Parse a card into a list of blanks {key, cat}
    function blanksOf(c) {
      var list = [], seen = {}, n = 0;
      c.lines.forEach(function (line) {
        line.replace(/\\{(\\w+)(?:#(\\w+))?\\}/g, function (m, cat, link) {
          if (PRON.he[cat]) return m;
          var key = link ? "L_" + link : "b" + (n++);
          if (!seen[key]) { seen[key] = 1; list.push({ key: key, cat: cat }); }
          return m;
        });
      });
      return list;
    }

    function poolFor(cat) {
      if (cat === "among") {
        var v = values();
        var picks = blanksOf(card()).filter(function (b) { return b.cat === "thing" && v[b.key]; }).map(function (b) { return v[b.key]; });
        return picks.length ? picks : POOLS.thing;
      }
      return (POOLS[cat] && POOLS[cat].length) ? POOLS[cat] : ["…"];
    }

    function render() {
      var c = card(), v = values();
      $("cardTitle").textContent = c.title;
      $("cardHead").style.background = c.color;
      $("pos").textContent = (idx + 1) + " / " + CARDS.length;
      $("cardSel").value = c.id;
      var body = $("cardBody"); body.innerHTML = "";
      var n = 0;
      c.lines.forEach(function (line) {
        var p = document.createElement("p");
        var re = /\\{(\\w+)(?:#(\\w+))?\\}/g, last = 0, m;
        while ((m = re.exec(line))) {
          if (m.index > last) p.appendChild(document.createTextNode(line.slice(last, m.index)));
          last = re.lastIndex;
          var cat = m[1];
          if (PRON.he[cat]) {
            var pb = document.createElement("button");
            pb.type = "button"; pb.className = "pron"; pb.textContent = PRON[pron][cat];
            pb.title = "Switch He / She";
            pb.addEventListener("click", function () { setPron(pron === "he" ? "she" : "he"); });
            p.appendChild(pb);
            continue;
          }
          var key = m[2] ? "L_" + m[2] : "b" + (n++);
          p.appendChild(makeBlank(key, cat, v[key]));
        }
        if (last < line.length) p.appendChild(document.createTextNode(line.slice(last)));
        body.appendChild(p);
      });
    }

    function makeBlank(key, cat, val) {
      var b = document.createElement("span");
      b.className = "blank" + (val ? "" : " empty");
      b.dataset.key = key; b.dataset.cat = cat;
      b.textContent = val || "\\u00a0";
      b.tabIndex = 0;
      b.addEventListener("click", function () {
        if (b.isContentEditable) return;
        if (mode === "type") startEdit(b);
        else spinOne(key, cat);
      });
      return b;
    }

    function blankEls(key) { return document.querySelectorAll('.blank[data-key="' + key + '"]'); }

    function startEdit(b) {
      b.contentEditable = "true";
      if (b.classList.contains("empty")) b.textContent = "";
      b.focus();
      var r = document.createRange(); r.selectNodeContents(b);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      function finish() {
        b.removeEventListener("blur", finish);
        b.contentEditable = "false";
        var t = b.textContent.replace(/\\s+/g, " ").trim();
        var v = values();
        if (t) v[b.dataset.key] = t; else delete v[b.dataset.key];
        render();
      }
      b.addEventListener("blur", finish);
      b.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); b.blur(); } });
    }

    function spinOne(key, cat, forced, delay) {
      var pool = poolFor(cat);
      var final = forced || rand(pool);
      var els = blankEls(key);
      spinning++;
      setTimeout(function () {
        var ticks = 0;
        var t = setInterval(function () {
          ticks++;
          Array.prototype.forEach.call(els, function (el) { el.classList.remove("empty"); el.classList.add("spinning"); el.textContent = rand(pool); });
          if (ticks >= 9) {
            clearInterval(t);
            values()[key] = final;
            Array.prototype.forEach.call(els, function (el) {
              el.classList.remove("spinning"); el.textContent = final;
              el.classList.remove("landed"); void el.offsetWidth; el.classList.add("landed");
            });
            spinning--;
          }
        }, 60);
      }, delay || 0);
    }

    function spinAll() {
      var list = blanksOf(card());
      var used = {};
      // times go in order through the afternoon
      var timeBlanks = list.filter(function (b) { return b.cat === "time"; });
      var times = shuffle(POOLS.time || []).slice(0, timeBlanks.length).sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); });
      var thingPicks = [];
      var step = 0;
      list.forEach(function (b) {
        if (b.cat === "among") return;
        var pick;
        if (b.cat === "time") pick = times.shift();
        else {
          var pool = (POOLS[b.cat] && POOLS[b.cat].length) ? POOLS[b.cat] : ["…"];
          var avail = pool.filter(function (x) { return !(used[b.cat] || []).includes(x); });
          pick = rand(avail.length ? avail : pool);
          (used[b.cat] = used[b.cat] || []).push(pick);
        }
        if (b.cat === "thing") thingPicks.push(pick);
        spinOne(b.key, b.cat, pick, step++ * 110);
      });
      list.filter(function (b) { return b.cat === "among"; }).forEach(function (b) {
        spinOne(b.key, b.cat, rand(thingPicks.length ? thingPicks : POOLS.thing), step++ * 110);
      });
    }

    function readAloud() {
      if (!("speechSynthesis" in window)) return;
      var text = card().title + ". " + Array.prototype.map.call($("cardBody").children, function (p) { return p.textContent.replace(/\\u00a0/g, " blank "); }).join(" ");
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; u.rate = 0.85;
      speechSynthesis.speak(u);
    }

    function setMode(m) {
      mode = m;
      Array.prototype.forEach.call($("modeSeg").children, function (b) { b.classList.toggle("on", b.dataset.mode === m); });
      $("tip").innerHTML = TIPS[m];
      if (m === "blank") { stateByCard[card().id] = {}; render(); }
      else if (m === "spin" && !Object.keys(values()).length) { render(); spinAll(); }
      else render();
    }

    function setPron(p) {
      pron = p;
      Array.prototype.forEach.call($("pronSeg").children, function (b) { b.classList.toggle("on", b.dataset.p === p); });
      render();
    }

    function go(i) {
      idx = (i + CARDS.length) % CARDS.length;
      render();
      if (mode === "spin" && !Object.keys(values()).length) spinAll();
    }

    CARDS.forEach(function (c) { var o = document.createElement("option"); o.value = c.id; o.textContent = c.title; $("cardSel").appendChild(o); });
    $("cardSel").addEventListener("change", function () { go(CARDS.map(function (c) { return c.id; }).indexOf(this.value)); });
    $("prevBtn").addEventListener("click", function () { go(idx - 1); });
    $("nextBtn").addEventListener("click", function () { go(idx + 1); });
    Array.prototype.forEach.call($("modeSeg").children, function (b) { b.addEventListener("click", function () { setMode(b.dataset.mode); }); });
    Array.prototype.forEach.call($("pronSeg").children, function (b) { b.addEventListener("click", function () { setPron(b.dataset.p); }); });
    $("spinAll").addEventListener("click", function () { render(); spinAll(); });
    $("clearBtn").addEventListener("click", function () { stateByCard[card().id] = {}; render(); });
    $("readBtn").addEventListener("click", readAloud);

    $("tip").innerHTML = TIPS.spin;
    render();
    spinAll();
  </script>
</body>
</html>
`
  },
  packs: {"early-writers-1:jumpingOx":{"bookId":"early-writers-1","activityId":"jumpingOx","cefr":"A1","title":"Early Writers 1 Jumping OX","units":{"1":{"title":"Unit 1: About Me","description":"have / has, am / is / are","questions":[{"text":"I have a goldfish.","correct":true,"explanation":"Good! I/you/we/they use 'have'."},{"text":"I has a rabbit.","correct":false,"explanation":"Incorrect. Use 'have' with I: 'I have a rabbit.'"},{"text":"I am ten years old.","correct":true,"explanation":"Good! Use 'am' with I."},{"text":"My name is Minho.","correct":true,"explanation":"Good!"},{"text":"She have a cat.","correct":false,"explanation":"Incorrect. 'She has a cat.'"},{"text":"I like soccer.","correct":true,"explanation":"Good!"},{"text":"I is a student.","correct":false,"explanation":"Incorrect. 'I am a student.'"},{"text":"This is my pet.","correct":true,"explanation":"Good!"},{"text":"He have brown hair.","correct":false,"explanation":"Incorrect. 'He has brown hair.'"},{"text":"I live in Seoul.","correct":true,"explanation":"Good!"}]},"2":{"title":"Unit 2: My Family","description":"Family words, is / are","questions":[{"text":"This is my grandma.","correct":true,"explanation":"Good!"},{"text":"My dad are brave.","correct":false,"explanation":"Incorrect. One person: 'My dad is brave.'"},{"text":"My brother is shy.","correct":true,"explanation":"Good!"},{"text":"My parents are kind.","correct":true,"explanation":"Good! Use 'are' with two people."},{"text":"My mom have long hair.","correct":false,"explanation":"Incorrect. 'My mom has long hair.'"},{"text":"I love my family.","correct":true,"explanation":"Good!"},{"text":"My sister are funny.","correct":false,"explanation":"Incorrect. 'My sister is funny.'"},{"text":"We are a happy family.","correct":true,"explanation":"Good!"},{"text":"He is my uncle.","correct":true,"explanation":"Good!"},{"text":"They is my cousins.","correct":false,"explanation":"Incorrect. 'They are my cousins.'"}]},"3":{"title":"Unit 3: My Monster","description":"has + body parts, 3rd person -s","questions":[{"text":"She has four arms.","correct":true,"explanation":"Good!"},{"text":"The monster dance.","correct":false,"explanation":"Incorrect. Add -s: 'The monster dances.'"},{"text":"He eats candy.","correct":true,"explanation":"Good! He/she/it + -s."},{"text":"My monster is green.","correct":true,"explanation":"Good!"},{"text":"It have three eyes.","correct":false,"explanation":"Incorrect. 'It has three eyes.'"},{"text":"She has big teeth.","correct":true,"explanation":"Good!"},{"text":"The monster run fast.","correct":false,"explanation":"Incorrect. 'The monster runs fast.'"},{"text":"He likes ice cream.","correct":true,"explanation":"Good!"},{"text":"It have a long tail.","correct":false,"explanation":"Incorrect. 'It has a long tail.'"},{"text":"My monster is not scary.","correct":true,"explanation":"Good!"}]},"4":{"title":"Unit 4: Wanted","description":"has + adjectives, word order","questions":[{"text":"She has long black hair.","correct":true,"explanation":"Good! Adjective order: long + black + hair."},{"text":"He has a mustache small.","correct":false,"explanation":"Incorrect. Adjective before the noun: 'He has a small mustache.'"},{"text":"Someone took my headphones!","correct":true,"explanation":"Good!"},{"text":"He has a big nose.","correct":true,"explanation":"Good!"},{"text":"She has eyes blue.","correct":false,"explanation":"Incorrect. 'She has blue eyes.'"},{"text":"The man is tall and thin.","correct":true,"explanation":"Good!"},{"text":"He have a beard.","correct":false,"explanation":"Incorrect. 'He has a beard.'"},{"text":"She wears a red hat.","correct":true,"explanation":"Good!"},{"text":"He has hair short.","correct":false,"explanation":"Incorrect. 'He has short hair.'"},{"text":"I saw him at the park.","correct":true,"explanation":"Good!"}]},"5":{"title":"Unit 5: My Room","description":"there is / there are, prepositions","questions":[{"text":"There is a clock above my desk.","correct":true,"explanation":"Good!"},{"text":"My shoes is under the bed.","correct":false,"explanation":"Incorrect. 'My shoes are under the bed.'"},{"text":"My clothes go there.","correct":true,"explanation":"Good!"},{"text":"There are posters on the wall.","correct":true,"explanation":"Good! 'There are' for plural."},{"text":"There is two chairs in my room.","correct":false,"explanation":"Incorrect. 'There are two chairs in my room.'"},{"text":"The lamp is next to the bed.","correct":true,"explanation":"Good!"},{"text":"There are a window near my desk.","correct":false,"explanation":"Incorrect. One window: 'There is a window near my desk.'"},{"text":"My books are on the shelf.","correct":true,"explanation":"Good!"},{"text":"The pillow are on the bed.","correct":false,"explanation":"Incorrect. One pillow: 'The pillow is on the bed.'"},{"text":"I like my room.","correct":true,"explanation":"Good!"}]},"6":{"title":"Unit 6: My Friend and I","description":"like + -ing, both","questions":[{"text":"I like making videos.","correct":true,"explanation":"Good! like + -ing."},{"text":"I don't like listen to music.","correct":false,"explanation":"Incorrect. Use -ing: 'I don't like listening to music.'"},{"text":"We enjoy hiking together.","correct":true,"explanation":"Good!"},{"text":"My friend likes drawing.","correct":true,"explanation":"Good!"},{"text":"She like play soccer.","correct":false,"explanation":"Incorrect. 'She likes playing soccer.'"},{"text":"We both like pizza.","correct":true,"explanation":"Good!"},{"text":"He don't like homework.","correct":false,"explanation":"Incorrect. 'He doesn't like homework.'"},{"text":"I like reading books.","correct":true,"explanation":"Good!"},{"text":"We both likes games.","correct":false,"explanation":"Incorrect. After we, no -s: 'We both like games.'"},{"text":"My friend and I are happy.","correct":true,"explanation":"Good!"}]},"7":{"title":"Unit 7: My Favorite Season","description":"because, like + -ing","questions":[{"text":"I play in the leaves.","correct":true,"explanation":"Good!"},{"text":"I like fall because I like eat pumpkin pie.","correct":false,"explanation":"Incorrect. like + -ing: 'I like eating pumpkin pie.'"},{"text":"I like summer because I like playing baseball.","correct":true,"explanation":"Good!"},{"text":"Winter is cold.","correct":true,"explanation":"Good!"},{"text":"I like spring because I like see flowers.","correct":false,"explanation":"Incorrect. 'I like seeing flowers.'"},{"text":"Fall is my favorite season.","correct":true,"explanation":"Good!"},{"text":"I like swim in summer.","correct":false,"explanation":"Incorrect. 'I like swimming in summer.'"},{"text":"We make a snowman in winter.","correct":true,"explanation":"Good!"},{"text":"She like winter because it is snowy.","correct":false,"explanation":"Incorrect. 'She likes winter because it is snowy.'"},{"text":"I wear a coat in winter.","correct":true,"explanation":"Good!"}]},"8":{"title":"Unit 8: Everyday Life","description":"can / can't + base verb","questions":[{"text":"I can juggle.","correct":true,"explanation":"Good! can + base verb."},{"text":"Can you swim fast?","correct":true,"explanation":"Good!"},{"text":"I can't speaks Spanish.","correct":false,"explanation":"Incorrect. After can/can't, use the base verb: 'I can't speak Spanish.'"},{"text":"She can ride a bike.","correct":true,"explanation":"Good!"},{"text":"He can to cook dinner.","correct":false,"explanation":"Incorrect. No 'to' after can: 'He can cook dinner.'"},{"text":"I can't dance well.","correct":true,"explanation":"Good!"},{"text":"They can plays soccer.","correct":false,"explanation":"Incorrect. 'They can play soccer.'"},{"text":"Can she sing?","correct":true,"explanation":"Good!"},{"text":"I can cooking.","correct":false,"explanation":"Incorrect. Use the base verb: 'I can cook.'"},{"text":"We can help our teacher.","correct":true,"explanation":"Good!"}]}}},"write-now-1:jumpingOx":{"bookId":"write-now-1","activityId":"jumpingOx","cefr":"A1","title":"Write Now 1 Jumping OX","units":{"1":{"title":"Unit 1: My Family and I","description":"am / is / are, have / has","questions":[{"text":"He is tall.","correct":true,"explanation":"Good! Use 'is' with he/she/it."},{"text":"She have curly hair.","correct":false,"explanation":"Incorrect. She/he/it uses 'has': 'She has curly hair.'"},{"text":"They are students.","correct":true,"explanation":"Good! Use 'are' with they/we/you."},{"text":"I am ten years old.","correct":true,"explanation":"Good! Use 'am' with I."},{"text":"My sister are kind.","correct":false,"explanation":"Incorrect. 'sister' is singular: 'My sister is kind.'"},{"text":"We has a big family.","correct":false,"explanation":"Incorrect. We/they/I use 'have': 'We have a big family.'"},{"text":"My dad has short hair.","correct":true,"explanation":"Good! 'has' is correct with he."},{"text":"I is happy.","correct":false,"explanation":"Incorrect. Use 'am' with I: 'I am happy.'"},{"text":"You are my brother.","correct":true,"explanation":"Good! Use 'are' with you."},{"text":"She is not tall.","correct":true,"explanation":"Good! Negative of is: 'is not'."}]},"2":{"title":"Unit 2: My Friend Daisy","description":"Adjectives and 3rd person -s","questions":[{"text":"My friend is kind.","correct":true,"explanation":"Good!"},{"text":"He is not funny.","correct":true,"explanation":"Good! 'is not' is the negative."},{"text":"She play the piano.","correct":false,"explanation":"Incorrect. Add -s for he/she/it: 'She plays the piano.'"},{"text":"I help people.","correct":true,"explanation":"Good! No -s after I."},{"text":"Daisy like cats.","correct":false,"explanation":"Incorrect. 'Daisy likes cats.'"},{"text":"He is smart and funny.","correct":true,"explanation":"Good! Two adjectives with 'and'."},{"text":"She don't like soccer.","correct":false,"explanation":"Incorrect. He/she/it uses 'doesn't': 'She doesn't like soccer.'"},{"text":"They are good friends.","correct":true,"explanation":"Good!"},{"text":"He help his mom.","correct":false,"explanation":"Incorrect. 'He helps his mom.'"},{"text":"My friend is shy.","correct":true,"explanation":"Good!"}]},"3":{"title":"Unit 3: School Market Day","description":"this / these, have, 3rd person -s","questions":[{"text":"I have a teddy bear.","correct":true,"explanation":"Good!"},{"text":"She sell old things.","correct":false,"explanation":"Incorrect. 'She sells old things.'"},{"text":"This is a soccer ball.","correct":true,"explanation":"Good! 'This is' for one thing."},{"text":"I buy a jacket.","correct":true,"explanation":"Good!"},{"text":"These is my books.","correct":false,"explanation":"Incorrect. 'These are my books.'"},{"text":"He has a toy car.","correct":true,"explanation":"Good!"},{"text":"This are my pencils.","correct":false,"explanation":"Incorrect. Use 'These are' for plural."},{"text":"We sell cookies at the market.","correct":true,"explanation":"Good!"},{"text":"She have a backpack.","correct":false,"explanation":"Incorrect. 'She has a backpack.'"},{"text":"I want this jacket.","correct":true,"explanation":"Good! 'this' + singular noun."}]},"4":{"title":"Unit 4: What a Messy Room!","description":"there is / there are, prepositions","questions":[{"text":"The room is messy.","correct":true,"explanation":"Good!"},{"text":"My shoes is under the bed.","correct":false,"explanation":"Incorrect. Shoes are plural: 'My shoes are under the bed.'"},{"text":"There is a chair next to the bed.","correct":true,"explanation":"Good! 'There is' for one thing."},{"text":"Please clean your room.","correct":true,"explanation":"Good! Imperative (command) is correct."},{"text":"There are a book on the desk.","correct":false,"explanation":"Incorrect. One book: 'There is a book on the desk.'"},{"text":"The lamp is on the table.","correct":true,"explanation":"Good! Preposition 'on'."},{"text":"There is many toys on the floor.","correct":false,"explanation":"Incorrect. Plural: 'There are many toys on the floor.'"},{"text":"My bag is under the chair.","correct":true,"explanation":"Good!"},{"text":"The clothes is in the closet.","correct":false,"explanation":"Incorrect. Clothes are plural: 'The clothes are in the closet.'"},{"text":"There are two pillows on the bed.","correct":true,"explanation":"Good! 'There are' for two or more."}]},"5":{"title":"Unit 5: My Favorite Thing","description":"have / has, this is, parts of things","questions":[{"text":"I have a toy truck.","correct":true,"explanation":"Good!"},{"text":"The bike have two wheels.","correct":false,"explanation":"Incorrect. It/the bike uses 'has': 'The bike has two wheels.'"},{"text":"This is my favorite thing.","correct":true,"explanation":"Good!"},{"text":"The robot has two arms.","correct":true,"explanation":"Good!"},{"text":"It have four legs.","correct":false,"explanation":"Incorrect. 'It has four legs.'"},{"text":"My doll has long hair.","correct":true,"explanation":"Good!"},{"text":"This are my favorite toys.","correct":false,"explanation":"Incorrect. 'These are my favorite toys.'"},{"text":"The car has a red door.","correct":true,"explanation":"Good!"},{"text":"She have a new kite.","correct":false,"explanation":"Incorrect. 'She has a new kite.'"},{"text":"I like this robot.","correct":true,"explanation":"Good!"}]},"6":{"title":"Unit 6: Welcome to My Town!","description":"there is / there are + places","questions":[{"text":"There is a library in my town.","correct":true,"explanation":"Good! 'There is' for one place."},{"text":"The fire station are big.","correct":false,"explanation":"Incorrect. One station: 'The fire station is big.'"},{"text":"I look around the museum.","correct":true,"explanation":"Good!"},{"text":"We go to the playground.","correct":true,"explanation":"Good!"},{"text":"There are a park near my house.","correct":false,"explanation":"Incorrect. One park: 'There is a park near my house.'"},{"text":"There are many stores on this street.","correct":true,"explanation":"Good! 'There are' for many stores."},{"text":"The museum have old pictures.","correct":false,"explanation":"Incorrect. 'The museum has old pictures.'"},{"text":"My town is small and quiet.","correct":true,"explanation":"Good!"},{"text":"There is two schools in my town.","correct":false,"explanation":"Incorrect. Two schools: 'There are two schools in my town.'"},{"text":"We can play at the playground.","correct":true,"explanation":"Good! 'can' + base verb."}]},"7":{"title":"Unit 7: Different but Together","description":"like + -ing, don't / doesn't","questions":[{"text":"I like painting pictures.","correct":true,"explanation":"Good! like + -ing."},{"text":"She don't like coffee.","correct":false,"explanation":"Incorrect. She/he/it uses 'doesn't': 'She doesn't like coffee.'"},{"text":"We both ride a bike.","correct":true,"explanation":"Good!"},{"text":"He likes watching TV.","correct":true,"explanation":"Good! He likes + -ing."},{"text":"I like swim in the pool.","correct":false,"explanation":"Incorrect. Use -ing: 'I like swimming in the pool.'"},{"text":"They like playing soccer.","correct":true,"explanation":"Good!"},{"text":"He like read books.","correct":false,"explanation":"Incorrect. 'He likes reading books.'"},{"text":"I don't like rainy days.","correct":true,"explanation":"Good! I/we/they use 'don't'."},{"text":"We both likes music.","correct":false,"explanation":"Incorrect. After 'we', no -s: 'We both like music.'"},{"text":"She likes drawing pictures.","correct":true,"explanation":"Good!"}]},"8":{"title":"Unit 8: My Busy Day","description":"Daily routines, then, 3rd person -s","questions":[{"text":"I get up at seven.","correct":true,"explanation":"Good!"},{"text":"I eat dinner in the evening.","correct":true,"explanation":"Good!"},{"text":"She do her homework.","correct":false,"explanation":"Incorrect. 'She does her homework.'"},{"text":"Then I take a shower.","correct":true,"explanation":"Good! 'Then' starts the next step."},{"text":"He get up at eight.","correct":false,"explanation":"Incorrect. 'He gets up at eight.'"},{"text":"I brush my teeth every morning.","correct":true,"explanation":"Good!"},{"text":"She go to school at eight.","correct":false,"explanation":"Incorrect. 'She goes to school at eight.'"},{"text":"First, I eat breakfast.","correct":true,"explanation":"Good! Comma after 'First'."},{"text":"Then she take a bus.","correct":false,"explanation":"Incorrect. 'Then she takes a bus.'"},{"text":"I go to bed at nine.","correct":true,"explanation":"Good!"}]}}},"write-now-1:jeopardy":{"bookId":"write-now-1","activityId":"jeopardy","cefr":"A1","title":"Write Now 1 Review","units":{"Unit 1: My Family and I":[{"q":"Hair that has rings, not flat.","a":"curly"},{"q":"Not short. Like a basketball player.","a":"tall"},{"q":"A little fat in a cute way.","a":"chubby"},{"q":"Not fat. A small body.","a":"thin"},{"q":"Hair that is flat, not curly.","a":"straight"},{"q":"Not tall.","a":"short"},{"q":"A boy or girl who goes to school.","a":"student"},{"q":"A boy in your family with the same parents.","a":"brother"},{"q":"A girl in your family with the same parents.","a":"sister"},{"q":"Has a lot of power in the body.","a":"strong"},{"q":"Nice to look at. Beautiful.","a":"pretty"},{"q":"A person you like to play with.","a":"friend"},{"q":"How old you are.","a":"age"},{"q":"Your arms, legs, and head are parts of this.","a":"body"},{"q":"It grows on your head.","a":"hair"}],"Unit 2: My Friend Daisy":[{"q":"Good at thinking and learning.","a":"smart"},{"q":"Nice and helpful to people.","a":"kind"},{"q":"Not afraid of danger.","a":"brave"},{"q":"Makes you laugh.","a":"funny"},{"q":"Quiet with new people. A little afraid to talk.","a":"shy"},{"q":"Not loud.","a":"quiet"},{"q":"Not strong.","a":"weak"},{"q":"To tell people your name.","a":"introduce"},{"q":"To say something to someone.","a":"tell"},{"q":"A book of things that happen.","a":"story"},{"q":"The one you like the most.","a":"favorite"},{"q":"Red, blue, and green are this.","a":"color"},{"q":"To do good things for other people.","a":"help people"},{"q":"To make music with a piano.","a":"play the piano"},{"q":"School work you do at home.","a":"do homework"}],"Unit 3: School Market Day":[{"q":"You hold this over your head in the rain.","a":"umbrella"},{"q":"A round ball you kick.","a":"soccer ball"},{"q":"A soft toy bear.","a":"teddy bear"},{"q":"Shoes for running and sports.","a":"sneakers"},{"q":"A band you wear in your hair.","a":"hairband"},{"q":"A small glass ball children play with.","a":"marble"},{"q":"To give something for money.","a":"sell"},{"q":"A plate for food.","a":"dish"},{"q":"Something children play with.","a":"toy"},{"q":"You wear these on your feet.","a":"shoes"},{"q":"A warm coat you wear.","a":"jacket"},{"q":"A place to buy and sell things.","a":"market"},{"q":"To get something with money.","a":"buy"},{"q":"Things that are not new.","a":"old things"},{"q":"A warm shirt for cold days.","a":"sweater"}],"Unit 4: What a Messy Room!":[{"q":"You sit on this.","a":"chair"},{"q":"A piece of furniture with drawers.","a":"dresser"},{"q":"A small carpet on the floor.","a":"rug"},{"q":"A tall place to hang clothes.","a":"wardrobe"},{"q":"You sleep on this.","a":"bed"},{"q":"Cloth that covers a window.","a":"curtain"},{"q":"Soft shoes for the house.","a":"slippers"},{"q":"You open this to go in a room.","a":"door"},{"q":"A flat top with legs. You eat here.","a":"table"},{"q":"A box you can carry things in.","a":"basket"},{"q":"Not clean. Things are everywhere.","a":"messy"},{"q":"A big dirty mix of things.","a":"mess"},{"q":"A bag you wear on your back.","a":"backpack"},{"q":"The one you like the most.","a":"favorite"},{"q":"To make a room neat.","a":"clean"}],"Unit 5: My Favorite Thing":[{"q":"A small truck you play with.","a":"toy truck"},{"q":"You ride this. It has two wheels.","a":"bike"},{"q":"A toy machine that can look like a person.","a":"robot"},{"q":"The place you sit.","a":"seat"},{"q":"A round part that turns on a bike.","a":"wheel"},{"q":"You put things in this round box.","a":"basket"},{"q":"You write with this.","a":"pencil"},{"q":"To own something.","a":"have"},{"q":"A board with wheels you stand on.","a":"skateboard"},{"q":"You open this to go inside.","a":"door"},{"q":"The one you like the most.","a":"favorite"},{"q":"An object. A stuff item.","a":"thing"},{"q":"A person who drives a car.","a":"driver"},{"q":"You have two. They hold things.","a":"arm"},{"q":"You walk with these.","a":"leg"}],"Unit 6: Welcome to My Town!":[{"q":"A shop with toys.","a":"toy store"},{"q":"A place with many books.","a":"library"},{"q":"Firefighters work here.","a":"fire station"},{"q":"A big shop for food.","a":"supermarket"},{"q":"A place with swings and slides.","a":"playground"},{"q":"A place to eat a meal.","a":"restaurant"},{"q":"Trains stop here.","a":"train station"},{"q":"A place to see art and old things.","a":"museum"},{"q":"A tall house for offices or homes.","a":"building"},{"q":"The place where you live, with streets and shops.","a":"town"},{"q":"To walk and see many places.","a":"look around"},{"q":"A person who stops fires.","a":"firefighter"},{"q":"A picture made with paint.","a":"painting"},{"q":"A stone or metal person in a park.","a":"statue"},{"q":"Carrots and broccoli are this.","a":"vegetable"}],"Unit 7: Different but Together":[{"q":"To eat a cold sweet treat.","a":"eat ice cream"},{"q":"To make pictures with paint.","a":"paint pictures"},{"q":"To go on a bike.","a":"ride a bike"},{"q":"To play with small building toys.","a":"play with blocks"},{"q":"To help plants get big.","a":"grow plants"},{"q":"To look at shows on television.","a":"watch TV"},{"q":"To have a hot brown drink.","a":"drink coffee"},{"q":"To fly a toy in the wind with a string.","a":"fly kites"},{"q":"To hear songs.","a":"listen to music"},{"q":"To make a car go.","a":"drive a car"},{"q":"Your uncle or aunt's child.","a":"cousin"},{"q":"Not the same.","a":"different"},{"q":"To move on your feet.","a":"walk"},{"q":"This one and that one. Two people.","a":"both"},{"q":"To look at funny picture books.","a":"read comics"}],"Unit 8: My Busy Day":[{"q":"To have a class for the violin.","a":"have violin lessons"},{"q":"To give food to your dog.","a":"feed my dog"},{"q":"To leave bed in the morning.","a":"get up"},{"q":"To run slowly with your father.","a":"jog with my dad"},{"q":"To learn numbers at home or school.","a":"study math"},{"q":"To have food at night.","a":"eat dinner"},{"q":"You have many things to do.","a":"busy"},{"q":"To finish school work at home.","a":"do my homework"},{"q":"To wash your body with water.","a":"take a shower"},{"q":"To give water to a plant.","a":"water my plant"},{"q":"To have food in the morning.","a":"eat breakfast"},{"q":"The time after afternoon, before night.","a":"evening"},{"q":"Next. After that.","a":"then"},{"q":"To put books in your bag.","a":"pack my backpack"},{"q":"Prepared. You can start.","a":"ready"}]}},"write-now-1:vocabulary":{"bookId":"write-now-1","activityId":"vocabulary","cefr":"A1","title":"Write Now 1 Vocabulary","vocabByUnit":{"1":{"name":"Unit 1: My Family and I","words":[{"en":"tall","ko":"키가 큰"},{"en":"short","ko":"키가 작은"},{"en":"chubby","ko":"통통한"},{"en":"thin","ko":"마른"},{"en":"straight","ko":"곧은 (머리)"},{"en":"curly","ko":"곱슬곱슬한 (머리)"},{"en":"healthy","ko":"건강한"},{"en":"skinny","ko":"날씬한"},{"en":"strong","ko":"힘이 센"},{"en":"weak","ko":"약한"},{"en":"grandpa","ko":"할아버지"},{"en":"grandma","ko":"할머니"},{"en":"uncle","ko":"삼촌"},{"en":"aunt","ko":"이모, 고모"},{"en":"kind","ko":"친절한"}]},"2":{"name":"Unit 2: My Friend Daisy","words":[{"en":"funny","ko":"재미있는"},{"en":"smart","ko":"똑똑한"},{"en":"brave","ko":"용감한"},{"en":"kind","ko":"친절한"},{"en":"shy","ko":"수줍은"},{"en":"quiet","ko":"조용한"},{"en":"curious","ko":"호기심 많은"},{"en":"friendly","ko":"친근한"},{"en":"talkative","ko":"말이 많은"},{"en":"playful","ko":"장난기 많은"},{"en":"read books","ko":"책을 읽다"},{"en":"watch birds","ko":"새를 관찰하다"},{"en":"play baseball","ko":"야구를 하다"},{"en":"climb trees","ko":"나무를 오르다"},{"en":"help people","ko":"사람들을 돕다"}]},"3":{"name":"Unit 3: School Market Day","words":[{"en":"umbrella","ko":"우산"},{"en":"sneakers","ko":"운동화"},{"en":"teddy bear","ko":"곰인형"},{"en":"marble","ko":"구슬"},{"en":"soccer ball","ko":"축구공"},{"en":"hairband","ko":"머리띠"},{"en":"skateboard","ko":"스케이트보드"},{"en":"flowerpot","ko":"화분"},{"en":"baseball glove","ko":"야구 글러브"},{"en":"basketball","ko":"농구공"},{"en":"crayons","ko":"크레용"},{"en":"ruler","ko":"자"},{"en":"necklace","ko":"목걸이"},{"en":"toy car","ko":"장난감 자동차"},{"en":"doll","ko":"인형"}]},"4":{"name":"Unit 4: What a Messy Room!","words":[{"en":"bed","ko":"침대"},{"en":"chair","ko":"의자"},{"en":"dresser","ko":"서랍장"},{"en":"curtain","ko":"커튼"},{"en":"rug","ko":"양탄자"},{"en":"wardrobe","ko":"옷장"},{"en":"clock","ko":"시계"},{"en":"pillow","ko":"베개"},{"en":"blanket","ko":"담요"},{"en":"baseball bat","ko":"야구 방망이"},{"en":"table","ko":"탁자"},{"en":"basket","ko":"바구니"},{"en":"bookcase","ko":"책장"},{"en":"sofa","ko":"소파"},{"en":"lamp","ko":"램프"}]},"5":{"name":"Unit 5: My Favorite Thing","words":[{"en":"basket","ko":"바구니"},{"en":"robot","ko":"로봇"},{"en":"bike","ko":"자전거"},{"en":"wheel","ko":"바퀴"},{"en":"toy truck","ko":"장난감 트럭"},{"en":"seat","ko":"좌석"},{"en":"backpack","ko":"배낭"},{"en":"door","ko":"문"},{"en":"headlight","ko":"헤드라이트"},{"en":"ribbon","ko":"리본"},{"en":"hat","ko":"모자"},{"en":"soft fur","ko":"부드러운 털"},{"en":"handle","ko":"손잡이"},{"en":"pocket","ko":"주머니"},{"en":"strap","ko":"끈"}]},"6":{"name":"Unit 6: Welcome to My Town!","words":[{"en":"library","ko":"도서관"},{"en":"playground","ko":"놀이터"},{"en":"supermarket","ko":"슈퍼마켓"},{"en":"toy store","ko":"장난감 가게"},{"en":"fire station","ko":"소방서"},{"en":"restaurant","ko":"식당"},{"en":"museum","ko":"박물관"},{"en":"zoo","ko":"동물원"},{"en":"bakery","ko":"빵집"},{"en":"bookstore","ko":"서점"},{"en":"pet shop","ko":"애완동물 가게"},{"en":"park","ko":"공원"},{"en":"hospital","ko":"병원"},{"en":"bank","ko":"은행"},{"en":"post office","ko":"우체국"}]},"7":{"name":"Unit 7: Different but Together","words":[{"en":"paint pictures","ko":"그림을 그리다"},{"en":"play with blocks","ko":"블록놀이를 하다"},{"en":"grow plants","ko":"식물을 기르다"},{"en":"ride a bike","ko":"자전거를 타다"},{"en":"watch TV","ko":"TV를 보다"},{"en":"eat ice cream","ko":"아이스크림을 먹다"},{"en":"play video games","ko":"비디오 게임을 하다"},{"en":"watch movies","ko":"영화를 보다"},{"en":"play tennis","ko":"테니스를 치다"},{"en":"fly kites","ko":"연을 날리다"},{"en":"listen to music","ko":"음악을 듣다"},{"en":"play the piano","ko":"피아노를 치다"},{"en":"swim","ko":"수영하다"},{"en":"catch bugs","ko":"벌레를 잡다"},{"en":"sing songs","ko":"노래를 부르다"}]},"8":{"name":"Unit 8: My Busy Day","words":[{"en":"get up","ko":"일어나다"},{"en":"feed my dog","ko":"개에게 먹이를 주다"},{"en":"eat dinner","ko":"저녁을 먹다"},{"en":"study math","ko":"수학을 공부하다"},{"en":"have violin lessons","ko":"바이올린 수업을 받다"},{"en":"jog with my dad","ko":"아빠와 조깅하다"},{"en":"take a shower","ko":"샤워하다"},{"en":"brush teeth","ko":"이를 닦다"},{"en":"get dressed","ko":"옷을 입다"},{"en":"comb hair","ko":"머리를 빗다"},{"en":"exercise","ko":"운동하다"},{"en":"wash face","ko":"세수하다"},{"en":"water plants","ko":"식물에 물을 주다"},{"en":"do homework","ko":"숙제를 하다"},{"en":"go to school","ko":"학교에 가다"}]}}},"write-now-2:jumpingOx":{"bookId":"write-now-2","activityId":"jumpingOx","cefr":"A1","title":"Write Now 2 Jumping OX","units":{"1":{"title":"Unit 1: I Can Do It by Myself","description":"can / can't + chores","questions":[{"text":"I can make my bed.","correct":true,"explanation":"Good! can + base verb."},{"text":"I can cooking dinner.","correct":false,"explanation":"Incorrect. After can, use the base verb: 'I can cook dinner.'"},{"text":"She can pack her backpack.","correct":true,"explanation":"Good!"},{"text":"He can washes the dishes.","correct":false,"explanation":"Incorrect. No -s after can: 'He can wash the dishes.'"},{"text":"I can't mop the floor.","correct":true,"explanation":"Good! can't + base verb."},{"text":"I can to walk to school.","correct":false,"explanation":"Incorrect. Do not use 'to' after can: 'I can walk to school.'"},{"text":"They can fold towels.","correct":true,"explanation":"Good!"},{"text":"She cans set the table.","correct":false,"explanation":"Incorrect. Never add -s to can: 'She can set the table.'"},{"text":"Can you brush your teeth?","correct":true,"explanation":"Good! Questions: Can + subject + base verb?"},{"text":"I can't doing the laundry.","correct":false,"explanation":"Incorrect. 'I can't do the laundry.'"}]},"2":{"title":"Unit 2: We're on a Picnic","description":"Present continuous: am/is/are + -ing","questions":[{"text":"We are playing frisbee.","correct":true,"explanation":"Good! are + -ing for now."},{"text":"She is take pictures.","correct":false,"explanation":"Incorrect. Use -ing: 'She is taking pictures.'"},{"text":"He is riding a bike.","correct":true,"explanation":"Good!"},{"text":"They is blowing bubbles.","correct":false,"explanation":"Incorrect. They uses 'are': 'They are blowing bubbles.'"},{"text":"I am lying in the sun.","correct":true,"explanation":"Good! I + am + -ing."},{"text":"We are enjoy the picnic.","correct":false,"explanation":"Incorrect. Add -ing: 'We are enjoying the picnic.'"},{"text":"Dad is making a campfire.","correct":true,"explanation":"Good!"},{"text":"She are writing a letter.","correct":false,"explanation":"Incorrect. She uses 'is': 'She is writing a letter.'"},{"text":"The sun is shining.","correct":true,"explanation":"Good!"},{"text":"I am play volleyball now.","correct":false,"explanation":"Incorrect. 'I am playing volleyball now.'"}]},"3":{"title":"Unit 3: What Do You Do After School?","description":"Frequency adverbs: always, usually, often, sometimes","questions":[{"text":"I usually play catch after school.","correct":true,"explanation":"Good! Adverb before the main verb."},{"text":"I play often chess.","correct":false,"explanation":"Incorrect. Put the adverb before the verb: 'I often play chess.'"},{"text":"She always takes lessons.","correct":true,"explanation":"Good!"},{"text":"He sometimes go rollerblading.","correct":false,"explanation":"Incorrect. He/she + -s: 'He sometimes goes rollerblading.'"},{"text":"We often practice dancing.","correct":true,"explanation":"Good!"},{"text":"Always I do housework.","correct":false,"explanation":"Incorrect. Put 'always' after I: 'I always do housework.'"},{"text":"They usually have fun after school.","correct":true,"explanation":"Good!"},{"text":"She don't often play catch.","correct":false,"explanation":"Incorrect. 'She doesn't often play catch.'"},{"text":"I sometimes water the plants.","correct":true,"explanation":"Good!"},{"text":"He usually eats breakfast.","correct":true,"explanation":"Good! Frequency adverb before the verb."}]},"4":{"title":"Unit 4: When I Grow Up","description":"want to be, will + base verb","questions":[{"text":"I want to be a teacher.","correct":true,"explanation":"Good! want to + base verb."},{"text":"She want to be a singer.","correct":false,"explanation":"Incorrect. 'She wants to be a singer.'"},{"text":"He will work hard.","correct":true,"explanation":"Good! will + base verb."},{"text":"I will be a astronaut.","correct":false,"explanation":"Incorrect. Use 'an' before a vowel sound: 'I will be an astronaut.'"},{"text":"When I grow up, I will save people.","correct":true,"explanation":"Good!"},{"text":"He will performs on stage.","correct":false,"explanation":"Incorrect. After will, no -s: 'He will perform on stage.'"},{"text":"I want to be a firefighter.","correct":true,"explanation":"Good!"},{"text":"She will to be famous.","correct":false,"explanation":"Incorrect. No 'to' after will: 'She will be famous.'"},{"text":"They want to share their food.","correct":true,"explanation":"Good!"},{"text":"I wants to be a chef.","correct":false,"explanation":"Incorrect. I uses 'want': 'I want to be a chef.'"}]},"5":{"title":"Unit 5: My Secret Closet","description":"there is / there are, in / on / under","questions":[{"text":"There is a trophy on the top shelf.","correct":true,"explanation":"Good! 'There is' for one thing."},{"text":"There are a T-shirt in the closet.","correct":false,"explanation":"Incorrect. One T-shirt: 'There is a T-shirt in the closet.'"},{"text":"My cap is on the shelf.","correct":true,"explanation":"Good!"},{"text":"There is many game cards in the box.","correct":false,"explanation":"Incorrect. Plural: 'There are many game cards in the box.'"},{"text":"The gloves are under the travel bag.","correct":true,"explanation":"Good!"},{"text":"My racket are in the closet.","correct":false,"explanation":"Incorrect. One racket: 'My racket is in the closet.'"},{"text":"There is a drone next to the trophy.","correct":true,"explanation":"Good!"},{"text":"The clothes is on the shelf.","correct":false,"explanation":"Incorrect. Clothes are plural: 'The clothes are on the shelf.'"},{"text":"This is my secret closet.","correct":true,"explanation":"Good!"},{"text":"There are two caps on the top.","correct":true,"explanation":"Good! 'There are' for two."}]},"6":{"title":"Unit 6: My Favorite Food","description":"like / don't like, taste adjectives","questions":[{"text":"I like yogurt because it is sour.","correct":true,"explanation":"Good!"},{"text":"Popcorn are crunchy.","correct":false,"explanation":"Incorrect. Popcorn is usually uncountable here: 'Popcorn is crunchy.'"},{"text":"The berries taste sweet.","correct":true,"explanation":"Good!"},{"text":"I don't likes soda.","correct":false,"explanation":"Incorrect. After don't, use the base verb: 'I don't like soda.'"},{"text":"Cheese smells delicious.","correct":true,"explanation":"Good!"},{"text":"Nachos is spicy.","correct":false,"explanation":"Incorrect. Nachos are plural: 'Nachos are spicy.'"},{"text":"This dessert is fresh and sweet.","correct":true,"explanation":"Good!"},{"text":"She like salty popcorn.","correct":false,"explanation":"Incorrect. 'She likes salty popcorn.'"},{"text":"I don't like spicy food.","correct":true,"explanation":"Good!"},{"text":"The yogurt taste sour.","correct":false,"explanation":"Incorrect. It/the yogurt + -s: 'The yogurt tastes sour.'"}]},"7":{"title":"Unit 7: Drawing My Feelings","description":"I feel + adjective, because","questions":[{"text":"I feel glad because my classmate is kind.","correct":true,"explanation":"Good! feel + adjective."},{"text":"I feel sadly today.","correct":false,"explanation":"Incorrect. Use an adjective, not an adverb: 'I feel sad today.'"},{"text":"She is scared of the noisy dog.","correct":true,"explanation":"Good!"},{"text":"He feel nervous before the exam.","correct":false,"explanation":"Incorrect. 'He feels nervous before the exam.'"},{"text":"I am excited about the party.","correct":true,"explanation":"Good!"},{"text":"The room is gloomy and dark.","correct":true,"explanation":"Good!"},{"text":"I feel angrily at my neighbor.","correct":false,"explanation":"Incorrect. Use the adjective: 'I feel angry at my neighbor.'"},{"text":"She feels sad because her toy is missing.","correct":true,"explanation":"Good!"},{"text":"They is glad today.","correct":false,"explanation":"Incorrect. 'They are glad today.'"},{"text":"I feel nervous, but I can do it.","correct":true,"explanation":"Good!"}]},"8":{"title":"Unit 8: My Robot Friend","description":"can + chores, put away / turn off","questions":[{"text":"The robot can write a letter.","correct":true,"explanation":"Good!"},{"text":"It can turning off the light.","correct":false,"explanation":"Incorrect. After can, use the base verb: 'It can turn off the light.'"},{"text":"Please put away the boxes.","correct":true,"explanation":"Good! Phrasal verb 'put away'."},{"text":"Don't shout in the hallway.","correct":true,"explanation":"Good!"},{"text":"The robot can solves a math problem.","correct":false,"explanation":"Incorrect. No -s after can: 'The robot can solve a math problem.'"},{"text":"Please take out the cans.","correct":true,"explanation":"Good!"},{"text":"It can to recycle cans.","correct":false,"explanation":"Incorrect. No 'to' after can: 'It can recycle cans.'"},{"text":"Don't throw away the paper.","correct":true,"explanation":"Good!"},{"text":"The robot play a song.","correct":false,"explanation":"Incorrect. Add -s, or use can: 'The robot plays a song' / 'The robot can play a song.'"},{"text":"I can help my robot friend.","correct":true,"explanation":"Good!"}]}}},"early-writers-2:jumpingOx":{"bookId":"early-writers-2","activityId":"jumpingOx","cefr":"A1","title":"Early Writers 2 Jumping OX","units":{"1":{"title":"Unit 1: My School","description":"Capital letters, word order, school places","questions":[{"text":"This is my school.","correct":true,"explanation":"Good! Sentences start with a capital letter."},{"text":"this is the gym.","correct":false,"explanation":"Incorrect. Start with a capital: 'This is the gym.'"},{"text":"Welkome to my school!","correct":false,"explanation":"Incorrect. Spelling: 'Welcome to my school!'"},{"text":"We learn new songs in the hall.","correct":false,"explanation":"Incorrect. Songs are in the music room: 'We learn new songs in the music room.'"},{"text":"We books read in the library.","correct":false,"explanation":"Incorrect. Word order: 'We read books in the library.'"},{"text":"We lunch eat in the cafeteria.","correct":false,"explanation":"Incorrect. Word order: 'We eat lunch in the cafeteria.'"},{"text":"Theese are the classrooms.","correct":false,"explanation":"Incorrect. Spelling: 'These are the classrooms.'"},{"text":"We eat lunch in the cafeteria.","correct":true,"explanation":"Good!"},{"text":"we play in the playground.","correct":false,"explanation":"Incorrect. Capital W: 'We play in the playground.'"},{"text":"This is the library.","correct":true,"explanation":"Good!"}]},"2":{"title":"Unit 2: My Style","description":"Frequency adverbs and clothes words","questions":[{"text":"He never wears sandals.","correct":true,"explanation":"Good! never + verb."},{"text":"What's style my?","correct":false,"explanation":"Incorrect. Word order: 'What's my style?'"},{"text":"Often, I wear tank shirts.","correct":false,"explanation":"Incorrect. The clothes word is 'tank tops'."},{"text":"I wear often shorts.","correct":false,"explanation":"Incorrect. Put the adverb before the verb: 'I often wear shorts.'"},{"text":"I usually wear skirts, shirts and sandals.","correct":false,"explanation":"Incorrect. Use a comma before 'and' in a list: 'skirts, shirts, and sandals'."},{"text":"My favorite color is brown.","correct":true,"explanation":"Good!"},{"text":"I usually wear jeans.","correct":true,"explanation":"Good!"},{"text":"I wear never hats.","correct":false,"explanation":"Incorrect. 'I never wear hats.'"},{"text":"She have a red jacket.","correct":false,"explanation":"Incorrect. 'She has a red jacket.'"},{"text":"He always wears sneakers.","correct":true,"explanation":"Good!"}]},"3":{"title":"Unit 3: My Special Recipe","description":"Sequence words: First, Next, Then, Finally","questions":[{"text":"First, get some bread.","correct":true,"explanation":"Good! Comma after First."},{"text":"Try my soup special.","correct":false,"explanation":"Incorrect. Adjective before the noun: 'Try my special soup.'"},{"text":"Next, toast the water.","correct":false,"explanation":"Incorrect. We boil water: 'Next, boil the water.'"},{"text":"finally, eat your soup.","correct":false,"explanation":"Incorrect. Capital F: 'Finally, eat your soup.'"},{"text":"Now it's to ready drink!","correct":false,"explanation":"Incorrect. Word order: 'Now it's ready to drink!'"},{"text":"Then put the strawberries on top.","correct":true,"explanation":"Good!"},{"text":"Next, cut the bananas.","correct":true,"explanation":"Good! Comma after Next."},{"text":"First mix the eggs.","correct":false,"explanation":"Incorrect. Put a comma after First: 'First, mix the eggs.'"},{"text":"Finally, enjoy your snack.","correct":true,"explanation":"Good!"},{"text":"Then you add some milk.","correct":true,"explanation":"Good!"}]},"4":{"title":"Unit 4: My Birthday","description":"will, on + day, party phrases","questions":[{"text":"We will sing karaoke.","correct":true,"explanation":"Good! will + base verb."},{"text":"You will come to my party?","correct":false,"explanation":"Incorrect. Questions: 'Will you come to my party?'"},{"text":"It's at Friday.","correct":false,"explanation":"Incorrect. Use 'on' with days: 'It's on Friday.'"},{"text":"We will has a sleepover.","correct":false,"explanation":"Incorrect. After will, use the base verb: 'We will have a sleepover.'"},{"text":"There will be pizza.","correct":true,"explanation":"Good!"},{"text":"We'll make fun together!","correct":false,"explanation":"Incorrect. The phrase is 'have fun': 'We'll have fun together!'"},{"text":"My party is on Saturday.","correct":true,"explanation":"Good! Capitalize the day."},{"text":"We will eating cake.","correct":false,"explanation":"Incorrect. 'We will eat cake.'"},{"text":"Will you bring a gift?","correct":true,"explanation":"Good!"},{"text":"The party is on friday.","correct":false,"explanation":"Incorrect. Capitalize Friday: 'on Friday'."}]},"5":{"title":"Unit 5: At the Park","description":"Present continuous: is/are + -ing","questions":[{"text":"She is swimming.","correct":true,"explanation":"Good! is + -ing."},{"text":"Now see I a boy.","correct":false,"explanation":"Incorrect. Word order: 'Now, I see a boy.'"},{"text":"He's fish.","correct":false,"explanation":"Incorrect. Use -ing: 'He's fishing.'"},{"text":"She's sliding on a swing.","correct":false,"explanation":"Incorrect. On a swing we say 'She's swinging.'"},{"text":"They're playing Frisbee.","correct":true,"explanation":"Good!"},{"text":"He is running in the park.","correct":true,"explanation":"Good!"},{"text":"They is riding bikes.","correct":false,"explanation":"Incorrect. They uses 'are': 'They are riding bikes.'"},{"text":"I am sitting on a bench.","correct":true,"explanation":"Good!"},{"text":"She are playing catch.","correct":false,"explanation":"Incorrect. 'She is playing catch.'"},{"text":"The children are laughing.","correct":true,"explanation":"Good!"}]},"6":{"title":"Unit 6: Last Winter","description":"Past simple: was/were, -ed, irregular verbs","questions":[{"text":"We played in the snow.","correct":true,"explanation":"Good! Regular past: play → played."},{"text":"It is snowy last winter.","correct":false,"explanation":"Incorrect. Past time needs 'was': 'It was snowy last winter.'"},{"text":"Last wintir was fun.","correct":false,"explanation":"Incorrect. Spelling: 'Last winter was fun.'"},{"text":"I playd games with my grandma.","correct":false,"explanation":"Incorrect. Spelling: 'I played games with my grandma.'"},{"text":"We even saw a rabbit!","correct":true,"explanation":"Good! saw is the past of see."},{"text":"It was cold last winter.","correct":true,"explanation":"Good!"},{"text":"We go to the mountain last year.","correct":false,"explanation":"Incorrect. Past of go is went: 'We went to the mountain last year.'"},{"text":"I made a snowman.","correct":true,"explanation":"Good! made is the past of make."},{"text":"They was happy.","correct":false,"explanation":"Incorrect. They uses 'were': 'They were happy.'"},{"text":"We had hot chocolate.","correct":true,"explanation":"Good! had is the past of have."}]},"7":{"title":"Unit 7: My Dream","description":"will / I'll + jobs","questions":[{"text":"I think I will be a cook.","correct":true,"explanation":"Good! will + be + job."},{"text":"I'm teach soccer classes.","correct":false,"explanation":"Incorrect. Future: 'I'll teach soccer classes.'"},{"text":"I think I will building houses.","correct":false,"explanation":"Incorrect. After will, use the base verb: 'I think I will build houses.'"},{"text":"To have a firefighter is my dream!","correct":false,"explanation":"Incorrect. We say 'To be a firefighter is my dream!'"},{"text":"i'll stop fires, too.","correct":false,"explanation":"Incorrect. Capital I: 'I'll stop fires, too.'"},{"text":"I will be a teacher.","correct":true,"explanation":"Good!"},{"text":"She will helps sick people.","correct":false,"explanation":"Incorrect. After will, no -s: 'She will help sick people.'"},{"text":"My dream is to be a singer.","correct":true,"explanation":"Good!"},{"text":"He will to fly a plane.","correct":false,"explanation":"Incorrect. No 'to' after will: 'He will fly a plane.'"},{"text":"I'll work hard every day.","correct":true,"explanation":"Good!"}]},"8":{"title":"Unit 8: How to Get There","description":"Directions: Walk, Turn, Go straight","questions":[{"text":"Walk through the park.","correct":true,"explanation":"Good!"},{"text":"Go strait on Ox Street.","correct":false,"explanation":"Incorrect. Spelling: 'Go straight on Ox Street.'"},{"text":"Cross right on Nola Street.","correct":false,"explanation":"Incorrect. We say 'Turn right on Nola Street.'"},{"text":"Walked two blocks.","correct":false,"explanation":"Incorrect. Directions use the base verb: 'Walk two blocks.'"},{"text":"The restaurant will be on your left.","correct":true,"explanation":"Good!"},{"text":"Turn left at the library.","correct":true,"explanation":"Good!"},{"text":"Go straights two blocks.","correct":false,"explanation":"Incorrect. 'Go straight for two blocks.'"},{"text":"The store is on your right.","correct":true,"explanation":"Good!"},{"text":"Turn to left on Main Street.","correct":false,"explanation":"Incorrect. 'Turn left on Main Street.'"},{"text":"Walk two blocks, then turn right.","correct":true,"explanation":"Good!"}]}}},"the-best-writing-starter-2:sentenceScramble":{"title":"The Best Writing Starter 2 Sentence Scramble","cefr":"A1","units":[{"id":"u1","name":"Unit 01: Fun at the Playground","sentences":["We play on the monkey bars.","Rachel can hang upside down.","Fred and Rachel can swing from bar to bar.","But I can't swing from bar to bar.","We have fun every day.","I can't climb up the slide.","Rachel can't stand on the jungle gym.","Fred can't stand on the swing.","Olivia can stand on the swing.","Tom and Lily can hang on the bars."]},{"id":"u2","name":"Unit 02: Morning Routine","sentences":["Every morning, I get up at 7 o'clock.","First, I wash my face.","Then I get dressed.","Lastly, I eat breakfast.","At 8 o'clock, I'm ready for school.","At 6 o'clock, I get up.","At 9 o'clock, the class begins.","Then I meet my friend.","First, I walk to school.","Lastly, I go to my classroom."]},{"id":"u3","name":"Unit 03: To My Teacher","sentences":["I want to know about you.","Do you live near school?","Do you have a pet?","Do you like our class?","Do you like playing mobile games?","Do you like teaching?","Do you live in an apartment?","I'm happy to be in your class.","Do you have a hobby?"]},{"id":"r1","name":"Review 01: Secret Santa","sentences":["I'm your Secret Santa.","I know a lot about you.","You live near the subway station.","You come to school at 8:45 a.m.","Your favorite subject is science.","You like the color green.","This is a small gift.","I hope you like it."]},{"id":"u4","name":"Unit 04: My Favorite Things","sentences":["My favorite color is purple.","It makes me look cool.","It makes me feel excited.","I'm good at kicking a ball.","I'm good at catching a ball.","I'm good at throwing a ball.","My favorite subject is art.","I like my blue backpack.","It makes me feel calm."]},{"id":"u5","name":"Unit 05: My Feelings","sentences":["Sometimes I feel angry.","Loud music makes me angry.","Farewells make me sad.","Having no friends makes me sad.","Eating out makes me glad.","Losing a game makes me angry.","School holidays make me glad.","Gifts make me glad.","Sometimes I feel bored."]},{"id":"u6","name":"Unit 06: At the Fair","sentences":["At the fair, I want to ride a water ride.","I like to cool off.","I want to watch a parade.","I like to hear its music.","I like to eat churros and cotton candy.","I like to remember the happy time.","I want to drive a bumper car.","I want to buy a balloon.","I want to ride a Ferris wheel."]},{"id":"u7","name":"Unit 07: My Favorite Places","sentences":["I have favorite places at school.","My first favorite place is the cafeteria.","I can have lunch with friends.","I can read storybooks.","I can play hide-and-seek.","I can play basketball.","I can do an experiment.","My favorite place is the music room.","I love my school!"]},{"id":"u8","name":"Unit 08: To My Classmate","sentences":["You are nice and polite.","You often make me laugh.","You often make me giggle.","You often make me cry.","You are good at singing.","Let's be good friends.","See you at school.","You are clever and quiet.","You are nice and caring."]},{"id":"r2","name":"Review 02: My Least Favorite Sport","sentences":["My least favorite sport is baseball.","I don't like to play baseball.","It makes me tired.","I'm not good at hitting a ball.","My second least favorite sport is tennis.","I don't like sports that much.","It makes me bored."]}]},"the-best-writing-starter-2:gapFill":{"title":"The Best Writing Starter 2 Gap Fill","cefr":"A1","units":[{"id":"u1","name":"Unit 01: Fun at the Playground","title":"Fun at the Playground","by":"By Lucas Parker","lines":["My friends and I go to the playground every day.","We play on the monkey bars.","","We all can hang on the [bars].","","[Rachel] can hang upside down.","I can, too. But Fred [can't].","","[Fred] and Rachel can swing from bar to bar.","But I can't swing from bar to [bar].","Fred and Rachel can help me.","","We have fun every day."]},{"id":"u2","name":"Unit 02: Morning Routine","title":"Morning Routine","by":"","lines":["Every morning, I get up at 7 o'clock.","[First], I wash my face.","Then I get dressed.","Lastly, I [eat] breakfast.","","At 8 o'clock, I'm [ready] for school.","First, I walk to school.","Then I meet my friends.","[Lastly], I go to my classroom.","","[At 9 o'clock], I take a class."]},{"id":"u3","name":"Unit 03: To My Teacher","title":"To My Teacher","by":"","lines":["Dear Mr. Brown,","","I'm Nicky Gray.","I want to know about you.","","Do you live in [town]?","Do you live near school?","Do you have a [hobby]?","Do you [have] a pet?","Do you like our [class]?","Do you like [camping]?","Do you like playing mobile games?","I'm happy to be in your class.","","Sincerely,","Nicky"]},{"id":"u4","name":"Unit 04: My Favorite Things","title":"My Favorite Things","by":"","lines":["My favorite [color] is purple.","It makes me look cool.","I like my purple jacket.","","My favorite sport is [soccer].","It makes me feel excited.","I'm good at [running] fast.","I'm good at kicking a ball.","","My favorite [subject] is art.","It makes me feel [happy].","I'm good at drawing flowers."]},{"id":"r1","name":"Review 01: Secret Santa","title":"Secret Santa","by":"","lines":["Dear Daniel,","","I'm your Secret [Santa].","I know a lot [about] you.","","You live [near] the subway station.","You come to school [at] 8:45 a.m.","You like the [color] green.","Your favorite [subject] is science.","Your favorite [sport] is baseball.","","This is a small [gift]. It's a comic book.","I [hope] you like it.","","Love,","Your Secret Santa"]},{"id":"u5","name":"Unit 05: My Feelings","title":"My Feelings","by":"By Ella Hanson","lines":["Sometimes I feel [angry].","Homework makes me angry.","Loud music [makes] me angry.","Losing a game makes me angry.","","Sometimes I feel sad.","[Farewells] make me sad.","Sad movies make me sad.","Having no friends makes me sad.","","Sometimes I feel glad.","School holidays make me [glad].","Gifts make me glad.","[Eating] snacks makes me glad."]},{"id":"u6","name":"Unit 06: At the Fair","title":"At the Fair","by":"","lines":["At the fair, I want to ride a [water] ride.","I like to cool off.","","I want to [watch] a parade.","I like to hear its music.","","I want to buy some [snacks].","I like to [eat] churros and cotton candy.","","I want to take pictures.","I like to [remember] the happy time."]},{"id":"u7","name":"Unit 07: My Favorite Places","title":"Favorite Places at School","by":"By Tracy Simons","lines":["I have favorite places at school.","","My [first] favorite place is the cafeteria.","I can eat hamburgers.","I can have [lunch] with friends.","","My second favorite place is the [library].","I can read storybooks.","I can do my [homework].","","My [third] favorite place is the gym.","I can play catch.","I can play basketball.","","I love my school!"]},{"id":"u8","name":"Unit 08: To My Classmate","title":"To My Classmate","by":"","lines":["Hi Terry,","","How are you doing?","I'm your classmate, Annie.","","You are [nice] and [polite].","You are [funny] and clever.","You often make me [laugh].","You are good at sports.","You are good at singing.","You are [good at] math.","","Let's be good friends.","See you at school.","","Yours,","Annie"]},{"id":"r2","name":"Review 02: My Least Favorite Sport","title":"My Least Favorite Sport","by":"","lines":["My [least] favorite sport is baseball.","I don't like to [play] baseball.","It makes me [tired].","I'm not good at [hitting] a ball.","","My second least favorite sport is tennis.","I don't like to play tennis.","It [makes] me bored.","I'm not good at running [fast].","","I don't like sports that much."]}]},"the-best-writing-starter-2:writingCards":{"title":"The Best Writing Starter 2 Writing Card Spinner","cefr":"A1","cards":[{"id":"teacher","title":"My Favorite Teacher","color":"#fbcfe8","lines":["At my school, there are many teachers.","My favorite teacher is {teacher}.","{He} has {looks}.","{He} is {trait} and {trait}.","{He} likes {ing}.","I like {his} class very much.","I can't wait for the next class!"]},{"id":"thing","title":"My Favorite Thing","color":"#bfdbfe","lines":["I have a lot of things.","I have {thing}, {thing} and {thing}.","Among them, my favorite item is {among}.","It is very {thingadj} and {thingadj}.","It makes me {feel}.","I like it very much."]},{"id":"buddy","title":"Playground Buddy","color":"#bbf7d0","lines":["My playground buddy is {name}.","We go to the playground every day.","We play on the {equip} and {equip}.","Our favorite thing is the {equip}.","We can both {pgact}.","It is so much fun!"]},{"id":"weekdays","title":"My Weekdays","color":"#fed7aa","lines":["I am usually very busy during the weekdays.","I go to school every day.","After school, my busy day starts.","Here are some things I do after school.","At {time}, I {after}.","At {time}, I {after}.","At {time}, I {after}.","At {time}, I {after}.","Phew! How busy I am!"]},{"id":"ride","title":"Least Favorite Ride","color":"#fbcfe8","lines":["My least favorite ride at the amusement park is {ride}.","It is {ridedesc}.","I don't like it because it makes me {ridefeel}.","However, my {person} really likes it.","{He} thinks it is {fun}.","How strange!"]},{"id":"happy","title":"Feeling Happy","color":"#bfdbfe","lines":["There are some things that make me happy.","First, {ing} makes me happy.","Second, {ing} makes me happy, too.","Last but not least, {ing} makes me really happy!","These things make me happy and I love them all."]},{"id":"friend","title":"My Best Friend","color":"#bbf7d0","lines":["My best friend is {name#bf}.","{He} is very {trait} and {trait}.","{He} has {hair} hair.","{He} likes {ing}.","{He} also likes {ing}.","We {weact} together.","{name#bf} is my best friend ever!","I love {him} so much."]},{"id":"place","title":"A Perfect Place at School","color":"#fed7aa","lines":["I have some perfect places at my school.","The first one is {place}.","I can {placeact} there.","The second one is {place}.","I can {placeact} there.","The last one is {place}.","I can {placeact} there.","Where is your perfect place at school?"]}],"pools":{"teacher":["Mr. Brown","Ms. Smith","Mr. Kim","Ms. Lee","Mr. Park","Ms. Jung"],"name":["Olivia","Mark","Rachel","Fred","Tom","Lily","Daniel","Annie","Kevin","Taylor","Illia","Mia"],"looks":["long black hair","short blonde hair","big round glasses","a nice smile","curly brown hair","a cool watch"],"trait":["kind","funny","clever","brave","caring","polite","quiet","calm","cool","nice"],"ing":["singing","dancing","drawing","writing","playing soccer","playing badminton","ice skating","reading storybooks","eating chocolate","playing mobile games","taking pictures","camping","playing tag","running fast","eating out"],"thing":["a drone","a guitar","a tent","a comic book","a purple jacket","a blue backpack","a lollipop","a balloon","a soccer ball","a teddy bear"],"thingadj":["cool","pretty","big","small","fast","soft","colorful","old","new"],"feel":["happy","glad","excited","calm","sleepy","scared","bored","angry","sad","tired"],"equip":["swing","slide","seesaw","jungle gym","merry-go-round","monkey bars"],"pgact":["hang upside down","swing high","climb up the slide","stand on the swing","swing from bar to bar","jump off the swing"],"time":["2 o'clock","3 o'clock","4 o'clock","5 o'clock","6 o'clock","7 o'clock","8 o'clock","9 o'clock"],"after":["take a class","study English","do my homework","play badminton","eat out","meet my friend","play the piano","read storybooks","play tag","go to the library","play basketball","eat dinner"],"ride":["the roller coaster","the Ferris wheel","the water ride","the bumper cars","the merry-go-round","the swing ride"],"ridedesc":["very slow and boring","too fast and scary","too high","very wet","too loud","very bumpy"],"ridefeel":["sleepy","scared","bored","tired","sick","angry"],"person":["little brother","little sister","mom","dad","best friend","grandma"],"fun":["fun","exciting","cool","great","amazing"],"hair":["short blonde","long black","curly brown","short black","long red"],"weact":["study English","play tag","play catch","have lunch","play basketball","read storybooks","play hide-and-seek","ride bikes"],"place":["the library","the gym","the music room","the science lab","the cafeteria","the classroom","the playground"],"placeact":["read my favorite books","play basketball","enjoy nice music","do an experiment","have lunch with friends","study English","play the drum","play tag"]}},"best-writing-starter-1:jumpingOx":{"bookId":"best-writing-starter-1","cefr":"A1","activityId":"jumpingOx","title":"The Best Writing Starter 1 Jumping OX","units":{"1":{"title":"About Me","description":"I am / I am not + describing words.","questions":[{"text":"I am a student.","correct":true,"explanation":"Correct: I am a student."},{"text":"I is tall.","correct":false,"explanation":"Use 'am' with I: I am tall."},{"text":"I am not quiet.","correct":true,"explanation":"Correct: I am not + adjective."},{"text":"I not am short.","correct":false,"explanation":"'not' comes after am: I am not short."},{"text":"My name is Danny.","correct":true,"explanation":"Correct!"},{"text":"I am eight year old.","correct":false,"explanation":"Use 'years': I am eight years old."},{"text":"I am a smart.","correct":false,"explanation":"No 'a' before a describing word alone: I am smart."},{"text":"I am funny and cool.","correct":true,"explanation":"Correct!"}]},"2":{"title":"My Family","description":"He is / She is + jobs and describing words.","questions":[{"text":"My mother is a doctor.","correct":true,"explanation":"Correct!"},{"text":"My father is a teacher. She is kind.","correct":false,"explanation":"Father = he: He is kind."},{"text":"My brother are a student.","correct":false,"explanation":"One person uses 'is': My brother is a student."},{"text":"I live with my family.","correct":true,"explanation":"Correct!"},{"text":"My mother is police officer.","correct":false,"explanation":"Use 'a': My mother is a police officer."},{"text":"My father is an office worker.","correct":true,"explanation":"Correct: 'an' before office."},{"text":"My sister is a artist.","correct":false,"explanation":"Use 'an' before a vowel sound: an artist."},{"text":"She is smart and caring.","correct":true,"explanation":"Correct!"}]},"3":{"title":"My Things","description":"I have... It is / They are + two adjectives.","questions":[{"text":"I have a pencil case.","correct":true,"explanation":"Correct!"},{"text":"It is big and purple.","correct":true,"explanation":"Correct!"},{"text":"I have shoes. It is small and cute.","correct":false,"explanation":"Shoes = they: They are small and cute."},{"text":"I has a computer.","correct":false,"explanation":"Use 'have' with I: I have a computer."},{"text":"They're new and cool.","correct":true,"explanation":"Correct!"},{"text":"I have a glasses.","correct":false,"explanation":"No 'a' with glasses: I have glasses."},{"text":"It is old and slowly.","correct":false,"explanation":"Use the adjective: It is old and slow."},{"text":"It's new and cool.","correct":true,"explanation":"Correct!"}]},"4":{"title":"Pets","description":"Pet names, colors, has a tail.","questions":[{"text":"Molly is my pet dog.","correct":true,"explanation":"Correct!"},{"text":"She has a short tail.","correct":true,"explanation":"Correct!"},{"text":"He have a long tail.","correct":false,"explanation":"Use 'has' with he: He has a long tail."},{"text":"Kitty is my friend's pet cat.","correct":true,"explanation":"Correct!"},{"text":"Birdy is a yellow.","correct":false,"explanation":"No 'a': Birdy is yellow."},{"text":"He is a cat cute.","correct":false,"explanation":"Adjective first: He is a cute cat."},{"text":"Noel is my friends pet lizard.","correct":false,"explanation":"Use 's: my friend's pet lizard."},{"text":"She is a friendly dog.","correct":true,"explanation":"Correct!"}]},"5":{"title":"Snacks","description":"like / likes / doesn't like.","questions":[{"text":"I like vanilla ice cream.","correct":true,"explanation":"Correct!"},{"text":"Ella likes chocolate chip cookies.","correct":true,"explanation":"Correct!"},{"text":"Ella don't like chips.","correct":false,"explanation":"With she/Ella use doesn't: Ella doesn't like chips."},{"text":"Justin and I like chips.","correct":true,"explanation":"Correct!"},{"text":"Justin like cookies.","correct":false,"explanation":"Add -s: Justin likes cookies."},{"text":"Alex doesn't likes candies.","correct":false,"explanation":"After doesn't, no -s: Alex doesn't like candies."},{"text":"Stacy like sandwiches.","correct":false,"explanation":"Add -s: Stacy likes sandwiches."},{"text":"We all like snacks.","correct":true,"explanation":"Correct!"}]},"6":{"title":"Birthday Invitation","description":"on + date/day, at + time, to + place.","questions":[{"text":"Please come to my birthday party.","correct":true,"explanation":"Correct!"},{"text":"It's on April 22nd.","correct":true,"explanation":"Correct: on + date."},{"text":"It is in Saturday.","correct":false,"explanation":"Days use 'on': It is on Saturday."},{"text":"Please come at 3 p.m.","correct":true,"explanation":"Correct: at + time."},{"text":"Please come in my house.","correct":false,"explanation":"Use 'to': Please come to my house."},{"text":"Please come on 12:30 p.m.","correct":false,"explanation":"Times use 'at': Please come at 12:30 p.m."},{"text":"My birthday is in May 31st.","correct":false,"explanation":"Dates use 'on': My birthday is on May 31st."},{"text":"It's my 7th birthday.","correct":true,"explanation":"Correct!"}]},"7":{"title":"We Are the Same","description":"You have... I have..., too. We have the same...","questions":[{"text":"You have big brown eyes.","correct":true,"explanation":"Correct!"},{"text":"I have a round nose, too.","correct":true,"explanation":"Correct!"},{"text":"You has a small mouth.","correct":false,"explanation":"Use 'have' with you: You have a small mouth."},{"text":"I have big ears, to.","correct":false,"explanation":"Spelling: too."},{"text":"We have the same eyes.","correct":true,"explanation":"Correct!"},{"text":"I have eyes big.","correct":false,"explanation":"Adjective first: I have big eyes."},{"text":"You have a big ears.","correct":false,"explanation":"No 'a' with ears: You have big ears."},{"text":"I look like my mom.","correct":true,"explanation":"Correct!"}]},"8":{"title":"My Room","description":"There is / There are + in, on, under.","questions":[{"text":"There is a teddy bear.","correct":true,"explanation":"Correct!"},{"text":"There are clothes.","correct":true,"explanation":"Correct!"},{"text":"There is slippers.","correct":false,"explanation":"Slippers = many: There are slippers."},{"text":"My teddy bear is on the bed.","correct":true,"explanation":"Correct!"},{"text":"My clothes is in the closet.","correct":false,"explanation":"Clothes = many: My clothes are in the closet."},{"text":"My slippers are under the desk.","correct":true,"explanation":"Correct!"},{"text":"There are a lamp.","correct":false,"explanation":"One thing: There is a lamp."},{"text":"My doll are on the dresser.","correct":false,"explanation":"One doll: My doll is on the dresser."}]}}},"best-writing-starter-1:jeopardy":{"bookId":"best-writing-starter-1","cefr":"A1","activityId":"jeopardy","title":"The Best Writing Starter 1","units":{"About Me":[{"q":"A young male child.","a":"boy"},{"q":"A young female child.","a":"girl"},{"q":"A person who learns at school.","a":"student"},{"q":"A person who teaches a class.","a":"teacher"},{"q":"Not tall.","a":"short"},{"q":"Good at thinking; clever.","a":"smart"},{"q":"This person makes you laugh.","a":"funny"},{"q":"Does not talk much.","a":"quiet"}],"My Family":[{"q":"Your mom's or dad's father.","a":"grandfather"},{"q":"Your mom's or dad's mother.","a":"grandmother"},{"q":"A person who helps sick people.","a":"doctor"},{"q":"A person who paints and draws.","a":"artist"},{"q":"A person who keeps the town safe.","a":"police officer"},{"q":"A person who works in an office.","a":"office worker"},{"q":"Nice and good to others.","a":"kind"},{"q":"Thinks about others and helps them.","a":"caring"}],"My Things":[{"q":"You wear these to see better.","a":"glasses"},{"q":"You keep your pencils in it.","a":"pencil case"},{"q":"A phone that can use apps.","a":"smartphone"},{"q":"You carry books to school in it.","a":"backpack"},{"q":"You wear these on your feet.","a":"shoes"},{"q":"The opposite of old.","a":"new"},{"q":"The opposite of fast.","a":"slow"},{"q":"It has many colors.","a":"colorful"}],"Pets":[{"q":"This animal says meow.","a":"cat"},{"q":"This animal says woof.","a":"dog"},{"q":"This animal can fly and sing.","a":"bird"},{"q":"This animal swims in water.","a":"fish"},{"q":"A small animal with long ears that hops.","a":"rabbit"},{"q":"A small animal with scales and a long tail.","a":"lizard"},{"q":"An animal that lives with you at home.","a":"pet"},{"q":"The long part at the back of a dog.","a":"tail"}],"Snacks":[{"q":"A cold, sweet snack in a cone.","a":"ice cream"},{"q":"You eat this at the movies. It pops!","a":"popcorn"},{"q":"Thin, crunchy snacks made from potatoes.","a":"potato chips"},{"q":"Sweet baked snacks, sometimes with chocolate chips.","a":"cookies"},{"q":"Bread with ham or cheese inside.","a":"sandwiches"},{"q":"A green, cool flavor of ice cream.","a":"mint ice cream"},{"q":"Small, hard, sweet snacks.","a":"candies"},{"q":"A sausage in a bun.","a":"hot dogs"}],"Birthday Invitation":[{"q":"The first month of the year.","a":"January"},{"q":"The last month of the year.","a":"December"},{"q":"The day after Friday.","a":"Saturday"},{"q":"The day before Monday.","a":"Sunday"},{"q":"You eat a meal here and pay.","a":"restaurant"},{"q":"You swim here.","a":"pool"},{"q":"You watch movies or plays here.","a":"theater"},{"q":"You skate on ice here.","a":"ice rink"}],"We Are the Same":[{"q":"You see with these.","a":"eyes"},{"q":"You hear with these.","a":"ears"},{"q":"You smell with this.","a":"nose"},{"q":"You eat and talk with this.","a":"mouth"},{"q":"The part of your face under your mouth.","a":"chin"},{"q":"The part of your face above your eyes.","a":"forehead"},{"q":"Shaped like a circle.","a":"round"},{"q":"Not different.","a":"same"}],"My Room":[{"q":"You sleep on it.","a":"bed"},{"q":"You sit on it.","a":"chair"},{"q":"You keep your clothes in it.","a":"closet"},{"q":"You study and write at it.","a":"desk"},{"q":"A soft toy bear.","a":"teddy bear"},{"q":"Soft shoes you wear at home.","a":"slippers"},{"q":"The cat is ___ the table. (below it)","a":"under"},{"q":"Shirts, pants and dresses.","a":"clothes"}]}},"best-writing-starter-1:sentenceScramble":{"bookId":"best-writing-starter-1","cefr":"A1","activityId":"sentenceScramble","title":"The Best Writing Starter 1 Sentence Scramble","units":[{"name":"Unit 01: About Me","sentences":["My name is Danny.","I am eight years old.","I am a student.","I am not quiet.","I am not short.","I am a girl.","I am funny.","I am not big.","I am smart."]},{"name":"Unit 02: My Family","sentences":["I live with my family.","My mother is a doctor.","She is funny.","My father is a teacher.","He is kind.","My brother is a student.","My mother is a police officer.","My father is an office worker.","I love my family."]},{"name":"Unit 03: My Things","sentences":["I have a pencil case.","It is big and purple.","It is old and slow.","They are small and cute.","They're new and cool.","I have a backpack.","It is big and yellow.","I have a smartphone.","It is small and red."]},{"name":"Unit 04: Pets","sentences":["Molly is my pet dog.","She has a short tail.","She is a friendly dog.","Kitty is my friend's pet cat.","He has a long tail.","He is a cute cat.","Birdy is my pet bird.","He is a colorful bird.","My dream pet is a cat."]},{"name":"Review 01: Colorful Family","sentences":["This is my family.","My mother has long brown hair.","She likes the color red.","My brother has short red hair.","He likes the color green.","My sister has straight orange hair.","I have short black hair.","We are a family with many colors!"]},{"name":"Unit 05: Snacks","sentences":["My friends and I like snacks.","I like vanilla ice cream.","Ella likes chocolate chip cookies.","Ella doesn't like chips.","Justin doesn't like cookies.","Justin and I like chips.","We all like snacks.","Stacy likes sandwiches.","Alex doesn't like candies."]},{"name":"Unit 06: Birthday Invitation","sentences":["You are invited!","Please come to my birthday party.","It's my 7th birthday.","It's on April 22nd.","It is on Saturday.","Please come at 3 p.m.","Please come to my house.","Hope to see you!","My birthday is on May 31st."]},{"name":"Unit 07: We Are the Same","sentences":["I like you, Grandma.","You have big brown eyes.","I have big brown eyes, too.","We have the same eyes.","You have a round nose.","You have a small mouth.","I look like my mom.","I have small eyes.","I miss you!"]},{"name":"Unit 08: My Room","sentences":["I like my room.","There is a teddy bear.","My teddy bear is on the bed.","There are clothes.","My clothes are in the closet.","My pictures are on the dresser.","My slippers are under the desk.","My doll is on the dresser.","My lamp is on the table."]},{"name":"Review 02: My Classroom","sentences":["I like my classroom.","There are four orange desks in the classroom.","There are three blue globes on the desk.","There is one white screen on the wall.","There is one red clock on the wall.","I sit next to Hailey.","She has long brown hair.","Sera sits next to me."]}]},"best-writing-starter-1:gapFill":{"bookId":"best-writing-starter-1","cefr":"A1","activityId":"gapFill","title":"The Best Writing Starter 1 Gap Fill","units":[{"name":"Unit 01: About Me","title":"About Me","by":"","lines":["My name is Danny.","I am eight [years] old.","I am a [student].","","I am [funny].","I am [cool].","I am [not] quiet.","","I am [tall].","I am not [short].","I am not [big]."]},{"name":"Unit 02: My Family","title":"My Family","by":"By Amy Lee","lines":["I am Amy.","I live with my [family].","","My [mother] is a doctor.","[She] is funny.","","My father is a [teacher].","He is [kind].","","My brother is a [student].","He is [smart].","","I love my family."]},{"name":"Unit 03: My Things","title":"My Things","by":"","lines":["I have a [pencil case].","It is big [and] purple.","","I have a computer.","It is old and [slow].","","I have [shoes].","[They are] small and cute.","","I have glasses.","They're [new] and cool."]},{"name":"Unit 04: Pets","title":"Pets","by":"","lines":["Molly is my pet [dog].","Molly is brown.","She [has] a short tail.","She is a [friendly] dog.","","Kitty is my [friend's] pet cat.","Kitty is gray.","He has a long [tail].","He is a [cute] cat."]},{"name":"Review 01: Colorful Family","title":"My Colorful Family","by":"","lines":["My name is Leo.","This is my [family].","","My mother has long brown [hair].","She likes the [color] red.","My brother has short red hair.","He [likes] the color green.","My sister has [straight] orange hair.","She likes the color blue.","I have short black hair.","I like the color white.","","We are a family with many [colors]!"]},{"name":"Unit 05: Snacks","title":"Snacks","by":"By Jamie Spark","lines":["My friends and I like [snacks].","","I like vanilla [ice cream].","I like butter cookies.","","Ella [likes] chocolate chip cookies.","Ella [doesn't] like chips.","","Justin doesn't like [cookies].","Justin and I [like] chips.","Justin and Ella like mint ice cream.","","We all like snacks.","But we all like [different] snacks."]},{"name":"Unit 06: Birthday Invitation","title":"To Jessica","by":"","lines":["You are [invited]!","Please come to my birthday [party].","","It's my 7th birthday.","It's [on] April 22nd.","It is on [Saturday].","","Please come [at] 3 p.m.","Please come to my [house].","Hope to see you!","","From Emily"]},{"name":"Unit 07: We Are the Same","title":"Dear Grandma","by":"","lines":["Dear Grandma,","","I like you, Grandma.","","You have big brown [eyes].","I have big brown eyes, [too].","We have the [same] eyes.","","You have a [round] nose.","I have a round [nose], too.","We have the same nose.","","I miss you!","","Love,","Luke"]},{"name":"Unit 08: My Room","title":"Dear Diary","by":"","lines":["Friday, July 1st","Dear Diary,","","I like my [room].","","There [is] a teddy bear.","My teddy bear is [on] the bed.","","There [are] clothes.","My clothes are [in] the closet.","","There are pictures.","My pictures are on the [dresser].","","There are slippers.","My slippers are [under] the desk.","","Rachel"]},{"name":"Review 02: My Classroom","title":"My Classroom","by":"","lines":["Friday, September 7th","Dear Diary,","","I like my [classroom].","","There are four orange [desks] in the classroom.","There are three blue [globes] on the desk.","There is one white screen on the [wall].","There is one red [clock] on the wall.","","I sit [next to] Hailey.","She has long brown hair.","","Sam"]}]},"best-writing-starter-1:writingCards":{"bookId":"best-writing-starter-1","cefr":"A1","activityId":"writingCards","title":"The Best Writing Starter 1 Writing Card Spinner","cards":[{"title":"The Best Cook","lines":["The best cook in my family is {cook}.","The dishes {he} can make are {thing}, {thing}, and {thing}.","The best one is {among}."]},{"title":"About Me","lines":["I can describe myself with these three words.","1. {trait}","2. {trait}","3. {trait}"]},{"title":"My Favorite Animal","lines":["My favorite animal is the {animal}.","I like it because it is very {animaladj}.","It has {feature}.","It looks {look}."]},{"title":"What's in My Bag","lines":["I packed a few things in my schoolbag today.","I packed {bagthing}, {bagthing}, and {bagthing}.","Tomorrow, I will pack {bagthing} and {bagthing}."]},{"title":"Birthday Invitation List","lines":["My birthday is on {month} {date}.","I want to invite my friends to my birthday party.","Here is the list.","1. {guest}","2. {guest}","3. {guest}","4. {guest}"]},{"title":"Healthy and Unhealthy Snacks","lines":["The {healthy} is a healthy snack.","It is healthy because it has {good}.","The {unhealthy} is an unhealthy snack.","It is unhealthy because it is {bad}."]},{"title":"My Closet","lines":["My closet is full of outfits.","I have these in my closet.","1. {clothes}","2. {clothes}","3. {clothes}","4. {clothes}"]},{"title":"We Look Alike","lines":["Some of my friends look like me.","{name#f1} has {face#x1}.","I have {face#x1}, too.","{name#f2} has {face#x2}.","I have {face#x2}, too.","I like my friends!"]}],"pools":{"cook":["my father","my mother","my grandmother","my grandfather","my big sister","my uncle"],"thing":["pizza","cookies","steak","fried rice","spaghetti","pancakes","curry","sandwiches"],"trait":["tall","smart","friendly","funny","kind","quiet","cool","caring","short"],"animal":["giant panda","rabbit","penguin","dolphin","tiger","koala","lizard","hamster"],"animaladj":["funny","cute","smart","friendly","fast","big","pretty"],"feature":["black and white fur","long ears","a long tail","big eyes","soft fur","a short tail"],"look":["cute","funny","cool","strong","pretty","friendly"],"bagthing":["my homework","colored pencils","a water bottle","my pencil case","my glasses","a notebook","my smartphone","candies","cookies","a book"],"month":["January","February","March","April","May","June","July","August","September","October","November","December"],"date":["1st","3rd","7th","12th","22nd","25th","31st"],"guest":["Mr. Johnson, my teacher","Samuel Brown","Olivia Anderson","Emily Grace","Peter Jackson","my best friend Mia","my cousin Leo"],"healthy":["fruit","salad","milk","yogurt","carrot","banana"],"good":["vitamins","calcium","protein","fiber"],"unhealthy":["soda","candy bar","chocolate cake","hot dog","donut"],"bad":["too sweet","too salty","too oily","full of sugar"],"clothes":["many shirts","three jackets","many sweaters","four bags","two pairs of jeans","five caps","many socks","two dresses"],"name":["Rina","Jake","Mia","Leo","Amy","Sam","Hailey","Ted"],"face":["big eyes","a round nose","small ears","a big smile","curly hair","short black hair","brown eyes","a small mouth"]}},"the-best-writing-starter-3:jumpingOx":{"bookId":"the-best-writing-starter-3","cefr":"A1","activityId":"jumpingOx","title":"The Best Writing Starter 3 Jumping OX","units":{"1":{"title":"Dream Jobs","description":"want to be / like to + verb; wants / likes with he and she.","questions":[{"text":"I want to be a musician.","correct":true,"explanation":"Correct!"},{"text":"I like to write songs.","correct":true,"explanation":"Correct: like to + verb."},{"text":"She want to be a vet.","correct":false,"explanation":"Add -s with she: She wants to be a vet."},{"text":"Kelly wants to be a content creator.","correct":true,"explanation":"Correct!"},{"text":"He likes make videos.","correct":false,"explanation":"Use 'to': He likes to make videos."},{"text":"I want to be a artist.","correct":false,"explanation":"Use 'an' before a vowel sound: an artist."},{"text":"He like to try new foods.","correct":false,"explanation":"Add -s with he: He likes to try new foods."},{"text":"She's really good at it!","correct":true,"explanation":"Correct!"}]},"2":{"title":"Tastes of Food","description":"It has ... in it, so it's + taste.","questions":[{"text":"The pizza is delicious.","correct":true,"explanation":"Correct!"},{"text":"It has lemon in it, so it's sour.","correct":true,"explanation":"Correct!"},{"text":"It have pepper in it, so it's spicy.","correct":false,"explanation":"Use 'has' with it: It has pepper in it."},{"text":"The cupcakes are tasty.","correct":true,"explanation":"Correct!"},{"text":"The pasta are good.","correct":false,"explanation":"One dish: The pasta is good."},{"text":"They have chocolate in them, so they're sweet.","correct":true,"explanation":"Correct: they + them."},{"text":"The hamburgers is good.","correct":false,"explanation":"Many: The hamburgers are good."},{"text":"It has sugar in them, so it's sweet.","correct":false,"explanation":"It goes with 'it': It has sugar in it."}]},"3":{"title":"My Daily Routine","description":"in the morning / at night; at + time, around + time.","questions":[{"text":"In the morning, I wake up at seven.","correct":true,"explanation":"Correct!"},{"text":"I eat breakfast at seven thirty.","correct":true,"explanation":"Correct!"},{"text":"I does my homework around three.","correct":false,"explanation":"Use 'do' with I: I do my homework."},{"text":"In the night, I write a diary.","correct":false,"explanation":"Say 'At night': At night, I write a diary."},{"text":"I take the school bus around eight twenty.","correct":true,"explanation":"Correct!"},{"text":"In afternoon, I come home at two.","correct":false,"explanation":"Use 'the': In the afternoon."},{"text":"I have dinner on seven.","correct":false,"explanation":"Times use 'at': I have dinner at seven."},{"text":"I go to sleep around ten.","correct":true,"explanation":"Correct!"}]},"4":{"title":"Animals vs. Humans","description":"..., but humans ...; Both ... and humans can ...","questions":[{"text":"Fish have scales, but humans have skin.","correct":true,"explanation":"Correct!"},{"text":"Fish can't run, but humans can.","correct":true,"explanation":"Correct!"},{"text":"Both fish and humans can swim.","correct":true,"explanation":"Correct!"},{"text":"Fish lives in the water.","correct":false,"explanation":"Fish (many) live: Fish live in the water."},{"text":"Fish can't blink their eyes, but humans can't.","correct":false,"explanation":"Humans CAN blink: but humans can."},{"text":"Birds have feathers, but humans has skin.","correct":false,"explanation":"Use 'have': humans have skin."},{"text":"Both birds and humans can sings.","correct":false,"explanation":"After can, no -s: can sing."},{"text":"Humans live on land.","correct":true,"explanation":"Correct!"}]},"5":{"title":"Fun Time with My Family","description":"When it's ..., we usually ... But sometimes, ...","questions":[{"text":"When it's snowy, we usually stay home.","correct":true,"explanation":"Correct!"},{"text":"We watch TV and eat cookies.","correct":true,"explanation":"Correct!"},{"text":"But sometimes, we go out and make a snowman.","correct":true,"explanation":"Correct!"},{"text":"When it's windy, we stays home.","correct":false,"explanation":"Use 'stay' with we: we stay home."},{"text":"We usually goes out.","correct":false,"explanation":"Use 'go' with we: We usually go out."},{"text":"Sometimes we takes a walk.","correct":false,"explanation":"Use 'take' with we: we take a walk."},{"text":"When it windy, we stay home.","correct":false,"explanation":"Add 'is': When it's windy."},{"text":"We go on a picnic and eat sandwiches.","correct":true,"explanation":"Correct!"}]},"6":{"title":"My Busy Weekend","description":"I'm going to + verb; First, Second ... Finally.","questions":[{"text":"I'm going to play soccer.","correct":true,"explanation":"Correct!"},{"text":"First, I'm going to buy some books.","correct":true,"explanation":"Correct!"},{"text":"I'm going to went to a party.","correct":false,"explanation":"After 'going to' use the base verb: go."},{"text":"Finally, I'm going to walk my dog.","correct":true,"explanation":"Correct!"},{"text":"I going to see a movie.","correct":false,"explanation":"Add 'am': I'm going to see a movie."},{"text":"I'm going to helping around the house.","correct":false,"explanation":"Use the base verb: help."},{"text":"Second, I'm go to meet my friends.","correct":false,"explanation":"Say 'I'm going to meet my friends.'"},{"text":"What a weekend!","correct":true,"explanation":"Correct!"}]},"7":{"title":"Packing List","description":"will / won't + verb; his and her.","questions":[{"text":"I will take my swimsuit and shorts.","correct":true,"explanation":"Correct!"},{"text":"I won't take my books.","correct":true,"explanation":"Correct!"},{"text":"She'll take her tablet to read e-books.","correct":true,"explanation":"Correct!"},{"text":"He will takes his drone.","correct":false,"explanation":"After will, no -s: He will take his drone."},{"text":"Dad will take her sunglasses.","correct":false,"explanation":"Dad = his: Dad will take his sunglasses."},{"text":"I won't takes my RC car.","correct":false,"explanation":"After won't, no -s: I won't take my RC car."},{"text":"Mom will take his sundress.","correct":false,"explanation":"Mom = her: Mom will take her sundress."},{"text":"I'll take my laptop to play video games.","correct":true,"explanation":"Correct!"}]},"8":{"title":"Gifts for Friends","description":"I'll give ... to ... because ...","questions":[{"text":"I'll give a flower pot to Jenny.","correct":true,"explanation":"Correct!"},{"text":"I'll give gloves to Tom because the weather is very cold.","correct":true,"explanation":"Correct!"},{"text":"I'll give socks for Leo.","correct":false,"explanation":"Use 'to': I'll give socks to Leo."},{"text":"I'll gives a book to Jenny.","correct":false,"explanation":"After I'll, no -s: I'll give."},{"text":"His mitt is too small.","correct":true,"explanation":"Correct!"},{"text":"I'll give a mitt to Jack because he mitt is too small.","correct":false,"explanation":"Use 'his': because his mitt is too small."},{"text":"She love drawing.","correct":false,"explanation":"Add -s with she: She loves drawing."},{"text":"Christmas is coming.","correct":true,"explanation":"Correct!"}]}}},"the-best-writing-starter-3:jeopardy":{"bookId":"the-best-writing-starter-3","cefr":"A1","activityId":"jeopardy","title":"The Best Writing Starter 3","units":{"Dream Jobs":[{"q":"A doctor for animals.","a":"vet"},{"q":"A person who acts in movies and plays.","a":"actor"},{"q":"A person who plays and writes music.","a":"musician"},{"q":"A person who makes videos for YouTube.","a":"content creator"},{"q":"A person who paints and draws pictures.","a":"artist"},{"q":"A person who keeps people safe.","a":"police officer"},{"q":"To make new songs.","a":"write songs"},{"q":"To look after pets and other animals.","a":"take care of animals"}],"Tastes of Food":[{"q":"Lemons taste like this.","a":"sour"},{"q":"Candy and cake taste like this.","a":"sweet"},{"q":"Chips and bacon taste like this.","a":"salty"},{"q":"Food with lots of pepper tastes like this.","a":"spicy"},{"q":"Just picked or made; not old.","a":"fresh"},{"q":"Meat that comes from a cow.","a":"beef"},{"q":"A small cake for one person.","a":"cupcake"},{"q":"A red fruit used in salads and sauce.","a":"tomato"}],"My Daily Routine":[{"q":"To stop sleeping and open your eyes.","a":"wake up"},{"q":"To eat the evening meal.","a":"have dinner"},{"q":"To write about your day in a book.","a":"write a diary"},{"q":"To ride the bus to school.","a":"take the school bus"},{"q":"To go back to your house.","a":"come home"},{"q":"To go to bed.","a":"go to sleep"},{"q":"The time from noon until evening.","a":"in the afternoon"},{"q":"The time when it is dark and you sleep.","a":"at night"}],"Animals vs. Humans":[{"q":"Small hard plates on a fish's body.","a":"scales"},{"q":"Fish breathe with these.","a":"gills"},{"q":"Humans breathe with these.","a":"lungs"},{"q":"Fish swim with these.","a":"fins"},{"q":"It covers the outside of your body.","a":"skin"},{"q":"To close and open your eyes very fast.","a":"blink"},{"q":"The dry ground, not water.","a":"land"},{"q":"The two together.","a":"both"}],"Fun Time with My Family":[{"q":"To eat food outside in the park.","a":"go on a picnic"},{"q":"To build a man out of snow.","a":"make a snowman"},{"q":"To walk slowly for fun.","a":"take a walk"},{"q":"To play a game on a board with family.","a":"play a board game"},{"q":"Weather with lots of wind.","a":"windy"},{"q":"Weather with lots of snow.","a":"snowy"},{"q":"To not go out; to stay in the house.","a":"stay home"},{"q":"Most of the time.","a":"usually"}],"My Busy Weekend":[{"q":"To clean and do chores at home.","a":"help around the house"},{"q":"To take your dog outside for a walk.","a":"walk my dog"},{"q":"To watch a film at the theater.","a":"see a movie"},{"q":"To go to a fun event with music and cake.","a":"go to a party"},{"q":"The number word after fourth.","a":"fifth"},{"q":"At the end; the last one.","a":"finally"},{"q":"To go and see a person or place.","a":"visit"},{"q":"To kick a ball with a team.","a":"play soccer"}],"Packing List":[{"q":"A light summer dress.","a":"sundress"},{"q":"You wear these to see underwater.","a":"swimming goggles"},{"q":"Clothes you wear to swim.","a":"swimsuit"},{"q":"A small flying machine with a camera.","a":"drone"},{"q":"A toy car you drive with a remote.","a":"RC car"},{"q":"A flat touch computer for e-books.","a":"tablet"},{"q":"Short pants for hot weather.","a":"shorts"},{"q":"To record a movie with a camera.","a":"shoot a video"}],"Gifts for Friends":[{"q":"You wear these on your hands in winter.","a":"gloves"},{"q":"You wear it around your neck.","a":"scarf"},{"q":"You wear these on your feet inside shoes.","a":"socks"},{"q":"A baseball player catches with it.","a":"baseball mitt"},{"q":"You grow a plant in it.","a":"flower pot"},{"q":"A can of fish.","a":"tuna can"},{"q":"A word that gives a reason.","a":"because"},{"q":"To hand something to a person.","a":"give"}]}},"the-best-writing-starter-3:sentenceScramble":{"bookId":"the-best-writing-starter-3","cefr":"A1","activityId":"sentenceScramble","title":"The Best Writing Starter 3 Sentence Scramble","units":[{"name":"Unit 01: Dream Jobs","sentences":["My friends and I have dream jobs.","I want to be a musician.","I like to write songs and play the guitar.","Kelly wants to be a content creator.","She likes to make videos.","She's really good at it!","Shawn wants to be a chef.","He likes to try new foods.","I wish our dreams come true.","I want to be a vet."]},{"name":"Unit 02: Tastes of Food","sentences":["There are many different tastes in food.","The pizza is delicious.","It has bacon in it, so it's salty.","It has pepper in it, so it's spicy.","It has lemon in it, so it's sour.","The cupcakes are tasty.","My favorite food is steak.","It's savory and salty.","The salad is delicious."]},{"name":"Unit 03: My Daily Routine","sentences":["I have busy weekdays.","In the morning, I wake up at seven.","I eat breakfast at seven thirty.","I take the school bus around eight twenty.","In the afternoon, I come home at two.","I do my homework around three.","In the evening, I practice the piano at six.","At night, I write a diary at nine.","I go to sleep around ten."]},{"name":"Unit 04: Animals vs. Humans","sentences":["This is my report on fish and humans.","Fish and humans are very different.","Fish live in the water, but humans live on land.","Fish have scales, but humans have skin.","Fish can't run, but humans can.","Both fish and humans can swim.","Fish and humans are both amazing!","Birds have feathers, but humans have skin.","Both birds and humans can sing."]},{"name":"Review 01: Meeting a Friend","sentences":["Do you want to hang out?","What time do you want to meet?","Let's meet at three thirty.","Where do you want to go?","Let's go to the shopping mall.","I will see you there.","I want to buy a new comic book.","I usually meet my friends at the bookstore."]},{"name":"Unit 05: Fun Time with My Family","sentences":["My family does many fun activities together.","When it's snowy, we usually stay home.","We watch TV and eat cookies.","But sometimes, we go out and make a snowman.","When it's windy, we usually stay home.","We play a board game and eat snacks.","When it's warm, we usually go out.","We go on a picnic and eat sandwiches.","We always have a great time."]},{"name":"Unit 06: My Busy Weekend","sentences":["I have so much to do this weekend.","First, I'm going to play soccer with friends.","Second, I'm going to go to a party.","Third, I'm going to see a movie.","Fourth, I'm going to buy some books.","Fifth, I'm going to help around the house.","Finally, I'm going to walk my dog.","What a weekend!","I'm going to clean my room."]},{"name":"Unit 07: Packing List","sentences":["My family is packing for the summer vacation.","Mom will take her sundress and sunhat.","She'll take her tablet to read e-books.","She won't take her work.","Dad will take his swimming goggles and sunglasses.","He'll take his drone to shoot a video.","I will take my swimsuit and shorts.","I'll take my laptop to play video games.","I won't take my books."]},{"name":"Unit 08: Gifts for Friends","sentences":["Christmas is coming.","I think of gifts for my friends.","I'll give a baseball mitt to Jack.","His mitt is too small.","I'll give gloves to Tom because the weather is very cold.","I'll give a flower pot to Jenny because she loves flowers.","I'll give socks to Leo because his socks are too old.","I'll give a scarf to Amy.","I want a book."]},{"name":"Review 02: I Want a Pet","sentences":["For my birthday, I really want a parrot.","I will take good care of it.","First, I'll feed the parrot.","Second, I'll clean up the parrot's poop.","Third, I'll play with the parrot every day.","Finally, I'll give the parrot a bath.","I'll be a good child.","Please let me have a parrot."]}]},"the-best-writing-starter-3:gapFill":{"bookId":"the-best-writing-starter-3","cefr":"A1","activityId":"gapFill","title":"The Best Writing Starter 3 Gap Fill","units":[{"name":"Unit 01: Dream Jobs","title":"Dream Jobs","by":"By Blair Kirt","lines":["My friends and I have dream [jobs].","","I want to be a [musician].","I like to [write songs] and play the guitar.","","My best friend Kelly [wants] to be a content creator.","She likes to [make videos] and create content for YouTube.","She's really good at it!","","My close friend Shawn wants to be a chef.","He likes to [try new foods] and cook for others.","","I wish our [dreams] come true."]},{"name":"Unit 02: Tastes of Food","title":"Tastes of Food","by":"","lines":["There are many different [tastes] in food.","","The pizza is [delicious].","It has bacon in it, so it's [salty].","","The pasta is good.","It has [pepper] in it, so it's spicy.","","The lemonade is good.","It has lemon in it, [so] it's sour.","","The cupcakes are tasty.","They have chocolate in [them], so they're sweet.","","I enjoy all the salty, spicy, sour, and [sweet] tastes."]},{"name":"Unit 03: My Daily Routine","title":"My Daily Routine","by":"","lines":["I have busy [weekdays].","","In the morning, I [wake up] at seven.","I eat breakfast at seven thirty.","I take the [school bus] around eight twenty.","","[In the afternoon], I come home at two.","I do my homework [around] three.","","In the evening, I [practice] the piano at six.","I have dinner around seven.","","At night, I write a [diary] at nine.","I go to sleep around ten."]},{"name":"Unit 04: Animals vs. Humans","title":"Fish vs. Humans","by":"By Sophia Brown","lines":["This is my report on fish and humans.","","Fish and humans are very [different].","Fish live in the water, but humans live on [land].","Fish have [scales], but humans have skin.","Fish can't run, [but] humans can.","Fish can't [blink] their eyes, but humans can.","","Fish and humans are similar in some ways.","[Both] fish and humans can swim.","Both fish and humans can eat seaweed.","","Fish and humans are both amazing!"]},{"name":"Review 01: Meeting a Friend","title":"My Text Message","by":"","lines":["Dorothy: Hey, do you want to [hang out]?","Me: Hi, Dorothy. Sure.","Dorothy: What [time] do you want to meet?","Me: I came home around three.","Let's [meet] at three thirty.","Dorothy: Great! Where do you want to go?","Me: Let's go to the [shopping mall].","Dorothy: Okay. I will see you there.","Me: After that, let's go to the [bookstore].","I want to [buy] a new comic book.","Dorothy: Sounds good. See you then!"]},{"name":"Unit 05: Fun Time with My Family","title":"Fun Time with My Family","by":"By Robert Scott","lines":["My family does many fun activities together.","","When it's [snowy], we usually stay home.","We watch TV and eat cookies.","But sometimes, we go out and make a [snowman].","","When it's windy, we [usually] stay home.","We play a [board game] and eat snacks.","But [sometimes], we go out and take a walk.","","When it's warm, we usually [go out].","We go on a [picnic] and eat sandwiches.","But sometimes, we stay home and read books.","","We always have a great time."]},{"name":"Unit 06: My Busy Weekend","title":"My Busy Weekend","by":"","lines":["I have so much to do this weekend.","[First], I'm going to play soccer with friends.","Second, I'm [going] to go to a party.","Third, I'm going to meet my friends and [see a movie].","Fourth, I'm going to [buy] some books at the bookstore.","[Fifth], I'm going to help around the house.","[Finally], I'm going to walk my dog, Max.","","What a weekend!"]},{"name":"Unit 07: Packing List","title":"Packing List","by":"","lines":["My family is [packing] for the summer vacation.","","Mom will take her [sundress] and sunhat.","She'll take her tablet to read e-books.","She [won't] take her work.","","Dad will take [his] swimming goggles and sunglasses.","He'll take his drone to [shoot a video].","He won't take his RC car.","","I will take my [swimsuit] and shorts.","I'll take my laptop to play video games.","I won't take my books."]},{"name":"Unit 08: Gifts for Friends","title":"Dear Diary","by":"","lines":["Tuesday, December 15th","Dear Diary,","","Christmas is coming.","I think of [gifts] for my friends.","","I'll give a baseball mitt to Jack [because] his mitt is too small.","I'll give [gloves] to Tom because the weather is very cold.","I'll [give] a flower pot to Jenny because she loves flowers.","I'll give colored pencils to Christina because she [loves] drawing.","","Amelia"]},{"name":"Review 02: I Want a Pet","title":"Dear Mom and Dad","by":"","lines":["Dear Mom and Dad,","","For my birthday, I really [want] a parrot.","I will take good [care] of it.","First, I'll [feed] the parrot.","Second, I'll [clean up] the parrot's poop.","Third, I'll play with the parrot [every day].","Fourth, I'll clean up the parrot's cage.","Finally, I'll [give] the parrot a bath.","","I'll be a good [child].","Please let me have a parrot.","","Yours,","Jake"]}]},"the-best-writing-starter-3:writingCards":{"bookId":"the-best-writing-starter-3","cefr":"A1","activityId":"writingCards","title":"The Best Writing Starter 3 Writing Card Spinner","cards":[{"title":"My Dream Job","lines":["I want to be {job}.","I like to {jobact} and {jobact}.","My best friend {name#bf} wants to be {job}.","{He} likes to {jobact}.","{He}'s really good at it!","I wish our dreams come true."]},{"title":"Tastes of Food","lines":["There are many different tastes in food.","The {food} is delicious.","It has {ingredient} in it, so it's {taste}.","The {food} is tasty.","It has {ingredient} in it, so it's {taste}.","I enjoy all the {taste} tastes."]},{"title":"My Daily Routine","lines":["I have busy weekdays.","In the morning, I {morning} at {mtime}.","In the afternoon, I {afternoon} at {atime}.","In the evening, I {evening} around {etime}.","At night, I {night} around {ntime}."]},{"title":"Animals vs. Humans","lines":["This is my report on {animal#a} and humans.","The {animal#a} live {home}, but humans live in houses.","The {animal#a} have {part}, but humans have skin.","The {animal#a} can't {cant}, but humans can.","Both {animal#a} and humans can {both}.","They are both amazing!"]},{"title":"Fun Time with My Family","lines":["My family does many fun activities together.","When it's {weather}, we usually stay home.","We {indoor} and eat {snack}.","But sometimes, we go out and {outdoor}.","We always have a great time."]},{"title":"My Busy Weekend","lines":["I have so much to do this weekend.","First, I'm going to {plan}.","Second, I'm going to {plan}.","Third, I'm going to {plan}.","Finally, I'm going to {plan}.","What a weekend!"]},{"title":"Packing List","lines":["My family is packing for the summer vacation.","I will take my {item} and {item}.","I'll take my {gadget} to {gadgetact}.","I won't take my {notake}.","My {relative} will take {his} {item}.","{He} won't take {his} {notake}."]},{"title":"Gifts for Friends","lines":["Christmas is coming.","I think of gifts for my friends.","I'll give {gift} to {name} because {reason}.","I'll give {gift} to {name} because {reason}.","I'll give {gift} to {name} because {reason}."]},{"title":"I Want a Pet","lines":["Dear Mom and Dad,","For my birthday, I really want {pet#p}.","I will take good care of it.","First, I'll {care}.","Second, I'll {care}.","Finally, I'll {care}.","Please let me have {pet#p}."]}],"pools":{"job":["a vet","an actor","an artist","a musician","a content creator","a police officer","a chef","a scientist","a firefighter"],"jobact":["take care of animals","write songs","play the guitar","make videos","draw pictures","dance","sing","try new foods","cook for others","help other people"],"name":["Kelly","Shawn","Kevin","Susan","Jack","Jenny","Tom","Amy","Leo","Luke"],"food":["pizza","pasta","salad","taco","cupcake","sandwich","soup","lemonade"],"ingredient":["bacon","pepper","lemon","chocolate","tomato","beef","sugar","ham","cheese"],"taste":["salty","spicy","sour","sweet","fresh","savory"],"morning":["wake up","eat breakfast","take the school bus","walk to school"],"mtime":["six thirty","seven","seven fifteen","seven thirty","eight twenty"],"afternoon":["have lunch","take classes","come home","do my homework"],"atime":["twelve thirty","one","two","three","three thirty"],"evening":["have dinner","practice the piano","spend time with family","watch TV"],"etime":["six","six thirty","seven","seven twenty","eight"],"night":["write a diary","go to sleep","listen to music","read a book"],"ntime":["nine","nine thirty","ten","ten thirty"],"animal":["fish","birds","dogs","frogs","cats","rabbits"],"home":["in the water","in a nest","in a pond","in a hole","in the forest"],"part":["scales","feathers","fur","fins","gills","wings"],"cant":["talk","run","blink their eyes","use their hands","read books","ride a bike"],"both":["swim","walk","sing","eat fish","sleep","run","jump"],"weather":["snowy","windy","rainy","cold","hot","cloudy"],"indoor":["watch TV","play a board game","make cookies","read books","play video games"],"snack":["cookies","snacks","popcorn","fruit","sandwiches"],"outdoor":["make a snowman","take a walk","go on a picnic","ride a bike","fly a kite","play soccer"],"plan":["play soccer with friends","go to a party","see a movie","buy some books","help around the house","walk my dog","visit my grandma","do my homework","clean my room"],"item":["swimsuit","shorts","sundress","sunhat","swimming goggles","sunglasses","cap"],"gadget":["tablet","laptop","drone","camera","smartphone"],"gadgetact":["read e-books","play video games","shoot a video","watch animations","take pictures"],"notake":["books","homework","RC car","computer","blocks","work"],"relative":["dad","mom","brother","sister","grandpa","grandma"],"gift":["a baseball mitt","a flower pot","gloves","a scarf","socks","a tuna can","a chocolate bar","colored pencils","a book"],"reason":["his mitt is too small","the weather is very cold","she loves flowers","she loves drawing","his socks are too old","her cat loves tuna","he loves chocolate","she loves reading books"],"pet":["a puppy","a kitten","a parrot","an iguana","a hamster","a rabbit"],"care":["feed it","give it a bath","clean up its poop","play with it every day","clean its cage","walk it every day"]}}}
};
