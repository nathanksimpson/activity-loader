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
`
  },
  packs: {"early-writers-1:jumpingOx":{"bookId":"early-writers-1","activityId":"jumpingOx","cefr":"A1","title":"Early Writers 1 Jumping OX","units":{"1":{"title":"Unit 1: About Me","description":"have / has, am / is / are","questions":[{"text":"I have a goldfish.","correct":true,"explanation":"Good! I/you/we/they use 'have'."},{"text":"I has a rabbit.","correct":false,"explanation":"Incorrect. Use 'have' with I: 'I have a rabbit.'"},{"text":"I am ten years old.","correct":true,"explanation":"Good! Use 'am' with I."},{"text":"My name is Minho.","correct":true,"explanation":"Good!"},{"text":"She have a cat.","correct":false,"explanation":"Incorrect. 'She has a cat.'"},{"text":"I like soccer.","correct":true,"explanation":"Good!"},{"text":"I is a student.","correct":false,"explanation":"Incorrect. 'I am a student.'"},{"text":"This is my pet.","correct":true,"explanation":"Good!"},{"text":"He have brown hair.","correct":false,"explanation":"Incorrect. 'He has brown hair.'"},{"text":"I live in Seoul.","correct":true,"explanation":"Good!"}]},"2":{"title":"Unit 2: My Family","description":"Family words, is / are","questions":[{"text":"This is my grandma.","correct":true,"explanation":"Good!"},{"text":"My dad are brave.","correct":false,"explanation":"Incorrect. One person: 'My dad is brave.'"},{"text":"My brother is shy.","correct":true,"explanation":"Good!"},{"text":"My parents are kind.","correct":true,"explanation":"Good! Use 'are' with two people."},{"text":"My mom have long hair.","correct":false,"explanation":"Incorrect. 'My mom has long hair.'"},{"text":"I love my family.","correct":true,"explanation":"Good!"},{"text":"My sister are funny.","correct":false,"explanation":"Incorrect. 'My sister is funny.'"},{"text":"We are a happy family.","correct":true,"explanation":"Good!"},{"text":"He is my uncle.","correct":true,"explanation":"Good!"},{"text":"They is my cousins.","correct":false,"explanation":"Incorrect. 'They are my cousins.'"}]},"3":{"title":"Unit 3: My Monster","description":"has + body parts, 3rd person -s","questions":[{"text":"She has four arms.","correct":true,"explanation":"Good!"},{"text":"The monster dance.","correct":false,"explanation":"Incorrect. Add -s: 'The monster dances.'"},{"text":"He eats candy.","correct":true,"explanation":"Good! He/she/it + -s."},{"text":"My monster is green.","correct":true,"explanation":"Good!"},{"text":"It have three eyes.","correct":false,"explanation":"Incorrect. 'It has three eyes.'"},{"text":"She has big teeth.","correct":true,"explanation":"Good!"},{"text":"The monster run fast.","correct":false,"explanation":"Incorrect. 'The monster runs fast.'"},{"text":"He likes ice cream.","correct":true,"explanation":"Good!"},{"text":"It have a long tail.","correct":false,"explanation":"Incorrect. 'It has a long tail.'"},{"text":"My monster is not scary.","correct":true,"explanation":"Good!"}]},"4":{"title":"Unit 4: Wanted","description":"has + adjectives, word order","questions":[{"text":"She has long black hair.","correct":true,"explanation":"Good! Adjective order: long + black + hair."},{"text":"He has a mustache small.","correct":false,"explanation":"Incorrect. Adjective before the noun: 'He has a small mustache.'"},{"text":"Someone took my headphones!","correct":true,"explanation":"Good!"},{"text":"He has a big nose.","correct":true,"explanation":"Good!"},{"text":"She has eyes blue.","correct":false,"explanation":"Incorrect. 'She has blue eyes.'"},{"text":"The man is tall and thin.","correct":true,"explanation":"Good!"},{"text":"He have a beard.","correct":false,"explanation":"Incorrect. 'He has a beard.'"},{"text":"She wears a red hat.","correct":true,"explanation":"Good!"},{"text":"He has hair short.","correct":false,"explanation":"Incorrect. 'He has short hair.'"},{"text":"I saw him at the park.","correct":true,"explanation":"Good!"}]},"5":{"title":"Unit 5: My Room","description":"there is / there are, prepositions","questions":[{"text":"There is a clock above my desk.","correct":true,"explanation":"Good!"},{"text":"My shoes is under the bed.","correct":false,"explanation":"Incorrect. 'My shoes are under the bed.'"},{"text":"My clothes go there.","correct":true,"explanation":"Good!"},{"text":"There are posters on the wall.","correct":true,"explanation":"Good! 'There are' for plural."},{"text":"There is two chairs in my room.","correct":false,"explanation":"Incorrect. 'There are two chairs in my room.'"},{"text":"The lamp is next to the bed.","correct":true,"explanation":"Good!"},{"text":"There are a window near my desk.","correct":false,"explanation":"Incorrect. One window: 'There is a window near my desk.'"},{"text":"My books are on the shelf.","correct":true,"explanation":"Good!"},{"text":"The pillow are on the bed.","correct":false,"explanation":"Incorrect. One pillow: 'The pillow is on the bed.'"},{"text":"I like my room.","correct":true,"explanation":"Good!"}]},"6":{"title":"Unit 6: My Friend and I","description":"like + -ing, both","questions":[{"text":"I like making videos.","correct":true,"explanation":"Good! like + -ing."},{"text":"I don't like listen to music.","correct":false,"explanation":"Incorrect. Use -ing: 'I don't like listening to music.'"},{"text":"We enjoy hiking together.","correct":true,"explanation":"Good!"},{"text":"My friend likes drawing.","correct":true,"explanation":"Good!"},{"text":"She like play soccer.","correct":false,"explanation":"Incorrect. 'She likes playing soccer.'"},{"text":"We both like pizza.","correct":true,"explanation":"Good!"},{"text":"He don't like homework.","correct":false,"explanation":"Incorrect. 'He doesn't like homework.'"},{"text":"I like reading books.","correct":true,"explanation":"Good!"},{"text":"We both likes games.","correct":false,"explanation":"Incorrect. After we, no -s: 'We both like games.'"},{"text":"My friend and I are happy.","correct":true,"explanation":"Good!"}]},"7":{"title":"Unit 7: My Favorite Season","description":"because, like + -ing","questions":[{"text":"I play in the leaves.","correct":true,"explanation":"Good!"},{"text":"I like fall because I like eat pumpkin pie.","correct":false,"explanation":"Incorrect. like + -ing: 'I like eating pumpkin pie.'"},{"text":"I like summer because I like playing baseball.","correct":true,"explanation":"Good!"},{"text":"Winter is cold.","correct":true,"explanation":"Good!"},{"text":"I like spring because I like see flowers.","correct":false,"explanation":"Incorrect. 'I like seeing flowers.'"},{"text":"Fall is my favorite season.","correct":true,"explanation":"Good!"},{"text":"I like swim in summer.","correct":false,"explanation":"Incorrect. 'I like swimming in summer.'"},{"text":"We make a snowman in winter.","correct":true,"explanation":"Good!"},{"text":"She like winter because it is snowy.","correct":false,"explanation":"Incorrect. 'She likes winter because it is snowy.'"},{"text":"I wear a coat in winter.","correct":true,"explanation":"Good!"}]},"8":{"title":"Unit 8: Everyday Life","description":"can / can't + base verb","questions":[{"text":"I can juggle.","correct":true,"explanation":"Good! can + base verb."},{"text":"Can you swim fast?","correct":true,"explanation":"Good!"},{"text":"I can't speaks Spanish.","correct":false,"explanation":"Incorrect. After can/can't, use the base verb: 'I can't speak Spanish.'"},{"text":"She can ride a bike.","correct":true,"explanation":"Good!"},{"text":"He can to cook dinner.","correct":false,"explanation":"Incorrect. No 'to' after can: 'He can cook dinner.'"},{"text":"I can't dance well.","correct":true,"explanation":"Good!"},{"text":"They can plays soccer.","correct":false,"explanation":"Incorrect. 'They can play soccer.'"},{"text":"Can she sing?","correct":true,"explanation":"Good!"},{"text":"I can cooking.","correct":false,"explanation":"Incorrect. Use the base verb: 'I can cook.'"},{"text":"We can help our teacher.","correct":true,"explanation":"Good!"}]}}},"write-now-1:jumpingOx":{"bookId":"write-now-1","activityId":"jumpingOx","cefr":"A1","title":"Write Now 1 Jumping OX","units":{"1":{"title":"Unit 1: My Family and I","description":"am / is / are, have / has","questions":[{"text":"He is tall.","correct":true,"explanation":"Good! Use 'is' with he/she/it."},{"text":"She have curly hair.","correct":false,"explanation":"Incorrect. She/he/it uses 'has': 'She has curly hair.'"},{"text":"They are students.","correct":true,"explanation":"Good! Use 'are' with they/we/you."},{"text":"I am ten years old.","correct":true,"explanation":"Good! Use 'am' with I."},{"text":"My sister are kind.","correct":false,"explanation":"Incorrect. 'sister' is singular: 'My sister is kind.'"},{"text":"We has a big family.","correct":false,"explanation":"Incorrect. We/they/I use 'have': 'We have a big family.'"},{"text":"My dad has short hair.","correct":true,"explanation":"Good! 'has' is correct with he."},{"text":"I is happy.","correct":false,"explanation":"Incorrect. Use 'am' with I: 'I am happy.'"},{"text":"You are my brother.","correct":true,"explanation":"Good! Use 'are' with you."},{"text":"She is not tall.","correct":true,"explanation":"Good! Negative of is: 'is not'."}]},"2":{"title":"Unit 2: My Friend Daisy","description":"Adjectives and 3rd person -s","questions":[{"text":"My friend is kind.","correct":true,"explanation":"Good!"},{"text":"He is not funny.","correct":true,"explanation":"Good! 'is not' is the negative."},{"text":"She play the piano.","correct":false,"explanation":"Incorrect. Add -s for he/she/it: 'She plays the piano.'"},{"text":"I help people.","correct":true,"explanation":"Good! No -s after I."},{"text":"Daisy like cats.","correct":false,"explanation":"Incorrect. 'Daisy likes cats.'"},{"text":"He is smart and funny.","correct":true,"explanation":"Good! Two adjectives with 'and'."},{"text":"She don't like soccer.","correct":false,"explanation":"Incorrect. He/she/it uses 'doesn't': 'She doesn't like soccer.'"},{"text":"They are good friends.","correct":true,"explanation":"Good!"},{"text":"He help his mom.","correct":false,"explanation":"Incorrect. 'He helps his mom.'"},{"text":"My friend is shy.","correct":true,"explanation":"Good!"}]},"3":{"title":"Unit 3: School Market Day","description":"this / these, have, 3rd person -s","questions":[{"text":"I have a teddy bear.","correct":true,"explanation":"Good!"},{"text":"She sell old things.","correct":false,"explanation":"Incorrect. 'She sells old things.'"},{"text":"This is a soccer ball.","correct":true,"explanation":"Good! 'This is' for one thing."},{"text":"I buy a jacket.","correct":true,"explanation":"Good!"},{"text":"These is my books.","correct":false,"explanation":"Incorrect. 'These are my books.'"},{"text":"He has a toy car.","correct":true,"explanation":"Good!"},{"text":"This are my pencils.","correct":false,"explanation":"Incorrect. Use 'These are' for plural."},{"text":"We sell cookies at the market.","correct":true,"explanation":"Good!"},{"text":"She have a backpack.","correct":false,"explanation":"Incorrect. 'She has a backpack.'"},{"text":"I want this jacket.","correct":true,"explanation":"Good! 'this' + singular noun."}]},"4":{"title":"Unit 4: What a Messy Room!","description":"there is / there are, prepositions","questions":[{"text":"The room is messy.","correct":true,"explanation":"Good!"},{"text":"My shoes is under the bed.","correct":false,"explanation":"Incorrect. Shoes are plural: 'My shoes are under the bed.'"},{"text":"There is a chair next to the bed.","correct":true,"explanation":"Good! 'There is' for one thing."},{"text":"Please clean your room.","correct":true,"explanation":"Good! Imperative (command) is correct."},{"text":"There are a book on the desk.","correct":false,"explanation":"Incorrect. One book: 'There is a book on the desk.'"},{"text":"The lamp is on the table.","correct":true,"explanation":"Good! Preposition 'on'."},{"text":"There is many toys on the floor.","correct":false,"explanation":"Incorrect. Plural: 'There are many toys on the floor.'"},{"text":"My bag is under the chair.","correct":true,"explanation":"Good!"},{"text":"The clothes is in the closet.","correct":false,"explanation":"Incorrect. Clothes are plural: 'The clothes are in the closet.'"},{"text":"There are two pillows on the bed.","correct":true,"explanation":"Good! 'There are' for two or more."}]},"5":{"title":"Unit 5: My Favorite Thing","description":"have / has, this is, parts of things","questions":[{"text":"I have a toy truck.","correct":true,"explanation":"Good!"},{"text":"The bike have two wheels.","correct":false,"explanation":"Incorrect. It/the bike uses 'has': 'The bike has two wheels.'"},{"text":"This is my favorite thing.","correct":true,"explanation":"Good!"},{"text":"The robot has two arms.","correct":true,"explanation":"Good!"},{"text":"It have four legs.","correct":false,"explanation":"Incorrect. 'It has four legs.'"},{"text":"My doll has long hair.","correct":true,"explanation":"Good!"},{"text":"This are my favorite toys.","correct":false,"explanation":"Incorrect. 'These are my favorite toys.'"},{"text":"The car has a red door.","correct":true,"explanation":"Good!"},{"text":"She have a new kite.","correct":false,"explanation":"Incorrect. 'She has a new kite.'"},{"text":"I like this robot.","correct":true,"explanation":"Good!"}]},"6":{"title":"Unit 6: Welcome to My Town!","description":"there is / there are + places","questions":[{"text":"There is a library in my town.","correct":true,"explanation":"Good! 'There is' for one place."},{"text":"The fire station are big.","correct":false,"explanation":"Incorrect. One station: 'The fire station is big.'"},{"text":"I look around the museum.","correct":true,"explanation":"Good!"},{"text":"We go to the playground.","correct":true,"explanation":"Good!"},{"text":"There are a park near my house.","correct":false,"explanation":"Incorrect. One park: 'There is a park near my house.'"},{"text":"There are many stores on this street.","correct":true,"explanation":"Good! 'There are' for many stores."},{"text":"The museum have old pictures.","correct":false,"explanation":"Incorrect. 'The museum has old pictures.'"},{"text":"My town is small and quiet.","correct":true,"explanation":"Good!"},{"text":"There is two schools in my town.","correct":false,"explanation":"Incorrect. Two schools: 'There are two schools in my town.'"},{"text":"We can play at the playground.","correct":true,"explanation":"Good! 'can' + base verb."}]},"7":{"title":"Unit 7: Different but Together","description":"like + -ing, don't / doesn't","questions":[{"text":"I like painting pictures.","correct":true,"explanation":"Good! like + -ing."},{"text":"She don't like coffee.","correct":false,"explanation":"Incorrect. She/he/it uses 'doesn't': 'She doesn't like coffee.'"},{"text":"We both ride a bike.","correct":true,"explanation":"Good!"},{"text":"He likes watching TV.","correct":true,"explanation":"Good! He likes + -ing."},{"text":"I like swim in the pool.","correct":false,"explanation":"Incorrect. Use -ing: 'I like swimming in the pool.'"},{"text":"They like playing soccer.","correct":true,"explanation":"Good!"},{"text":"He like read books.","correct":false,"explanation":"Incorrect. 'He likes reading books.'"},{"text":"I don't like rainy days.","correct":true,"explanation":"Good! I/we/they use 'don't'."},{"text":"We both likes music.","correct":false,"explanation":"Incorrect. After 'we', no -s: 'We both like music.'"},{"text":"She likes drawing pictures.","correct":true,"explanation":"Good!"}]},"8":{"title":"Unit 8: My Busy Day","description":"Daily routines, then, 3rd person -s","questions":[{"text":"I get up at seven.","correct":true,"explanation":"Good!"},{"text":"I eat dinner in the evening.","correct":true,"explanation":"Good!"},{"text":"She do her homework.","correct":false,"explanation":"Incorrect. 'She does her homework.'"},{"text":"Then I take a shower.","correct":true,"explanation":"Good! 'Then' starts the next step."},{"text":"He get up at eight.","correct":false,"explanation":"Incorrect. 'He gets up at eight.'"},{"text":"I brush my teeth every morning.","correct":true,"explanation":"Good!"},{"text":"She go to school at eight.","correct":false,"explanation":"Incorrect. 'She goes to school at eight.'"},{"text":"First, I eat breakfast.","correct":true,"explanation":"Good! Comma after 'First'."},{"text":"Then she take a bus.","correct":false,"explanation":"Incorrect. 'Then she takes a bus.'"},{"text":"I go to bed at nine.","correct":true,"explanation":"Good!"}]}}},"write-now-1:jeopardy":{"bookId":"write-now-1","activityId":"jeopardy","cefr":"A1","title":"Write Now 1 Review","units":{"Unit 1: My Family and I":[{"q":"Hair that has rings, not flat.","a":"curly"},{"q":"Not short. Like a basketball player.","a":"tall"},{"q":"A little fat in a cute way.","a":"chubby"},{"q":"Not fat. A small body.","a":"thin"},{"q":"Hair that is flat, not curly.","a":"straight"},{"q":"Not tall.","a":"short"},{"q":"A boy or girl who goes to school.","a":"student"},{"q":"A boy in your family with the same parents.","a":"brother"},{"q":"A girl in your family with the same parents.","a":"sister"},{"q":"Has a lot of power in the body.","a":"strong"},{"q":"Nice to look at. Beautiful.","a":"pretty"},{"q":"A person you like to play with.","a":"friend"},{"q":"How old you are.","a":"age"},{"q":"Your arms, legs, and head are parts of this.","a":"body"},{"q":"It grows on your head.","a":"hair"}],"Unit 2: My Friend Daisy":[{"q":"Good at thinking and learning.","a":"smart"},{"q":"Nice and helpful to people.","a":"kind"},{"q":"Not afraid of danger.","a":"brave"},{"q":"Makes you laugh.","a":"funny"},{"q":"Quiet with new people. A little afraid to talk.","a":"shy"},{"q":"Not loud.","a":"quiet"},{"q":"Not strong.","a":"weak"},{"q":"To tell people your name.","a":"introduce"},{"q":"To say something to someone.","a":"tell"},{"q":"A book of things that happen.","a":"story"},{"q":"The one you like the most.","a":"favorite"},{"q":"Red, blue, and green are this.","a":"color"},{"q":"To do good things for other people.","a":"help people"},{"q":"To make music with a piano.","a":"play the piano"},{"q":"School work you do at home.","a":"do homework"}],"Unit 3: School Market Day":[{"q":"You hold this over your head in the rain.","a":"umbrella"},{"q":"A round ball you kick.","a":"soccer ball"},{"q":"A soft toy bear.","a":"teddy bear"},{"q":"Shoes for running and sports.","a":"sneakers"},{"q":"A band you wear in your hair.","a":"hairband"},{"q":"A small glass ball children play with.","a":"marble"},{"q":"To give something for money.","a":"sell"},{"q":"A plate for food.","a":"dish"},{"q":"Something children play with.","a":"toy"},{"q":"You wear these on your feet.","a":"shoes"},{"q":"A warm coat you wear.","a":"jacket"},{"q":"A place to buy and sell things.","a":"market"},{"q":"To get something with money.","a":"buy"},{"q":"Things that are not new.","a":"old things"},{"q":"A warm shirt for cold days.","a":"sweater"}],"Unit 4: What a Messy Room!":[{"q":"You sit on this.","a":"chair"},{"q":"A piece of furniture with drawers.","a":"dresser"},{"q":"A small carpet on the floor.","a":"rug"},{"q":"A tall place to hang clothes.","a":"wardrobe"},{"q":"You sleep on this.","a":"bed"},{"q":"Cloth that covers a window.","a":"curtain"},{"q":"Soft shoes for the house.","a":"slippers"},{"q":"You open this to go in a room.","a":"door"},{"q":"A flat top with legs. You eat here.","a":"table"},{"q":"A box you can carry things in.","a":"basket"},{"q":"Not clean. Things are everywhere.","a":"messy"},{"q":"A big dirty mix of things.","a":"mess"},{"q":"A bag you wear on your back.","a":"backpack"},{"q":"The one you like the most.","a":"favorite"},{"q":"To make a room neat.","a":"clean"}],"Unit 5: My Favorite Thing":[{"q":"A small truck you play with.","a":"toy truck"},{"q":"You ride this. It has two wheels.","a":"bike"},{"q":"A toy machine that can look like a person.","a":"robot"},{"q":"The place you sit.","a":"seat"},{"q":"A round part that turns on a bike.","a":"wheel"},{"q":"You put things in this round box.","a":"basket"},{"q":"You write with this.","a":"pencil"},{"q":"To own something.","a":"have"},{"q":"A board with wheels you stand on.","a":"skateboard"},{"q":"You open this to go inside.","a":"door"},{"q":"The one you like the most.","a":"favorite"},{"q":"An object. A stuff item.","a":"thing"},{"q":"A person who drives a car.","a":"driver"},{"q":"You have two. They hold things.","a":"arm"},{"q":"You walk with these.","a":"leg"}],"Unit 6: Welcome to My Town!":[{"q":"A shop with toys.","a":"toy store"},{"q":"A place with many books.","a":"library"},{"q":"Firefighters work here.","a":"fire station"},{"q":"A big shop for food.","a":"supermarket"},{"q":"A place with swings and slides.","a":"playground"},{"q":"A place to eat a meal.","a":"restaurant"},{"q":"Trains stop here.","a":"train station"},{"q":"A place to see art and old things.","a":"museum"},{"q":"A tall house for offices or homes.","a":"building"},{"q":"The place where you live, with streets and shops.","a":"town"},{"q":"To walk and see many places.","a":"look around"},{"q":"A person who stops fires.","a":"firefighter"},{"q":"A picture made with paint.","a":"painting"},{"q":"A stone or metal person in a park.","a":"statue"},{"q":"Carrots and broccoli are this.","a":"vegetable"}],"Unit 7: Different but Together":[{"q":"To eat a cold sweet treat.","a":"eat ice cream"},{"q":"To make pictures with paint.","a":"paint pictures"},{"q":"To go on a bike.","a":"ride a bike"},{"q":"To play with small building toys.","a":"play with blocks"},{"q":"To help plants get big.","a":"grow plants"},{"q":"To look at shows on television.","a":"watch TV"},{"q":"To have a hot brown drink.","a":"drink coffee"},{"q":"To fly a toy in the wind with a string.","a":"fly kites"},{"q":"To hear songs.","a":"listen to music"},{"q":"To make a car go.","a":"drive a car"},{"q":"Your uncle or aunt's child.","a":"cousin"},{"q":"Not the same.","a":"different"},{"q":"To move on your feet.","a":"walk"},{"q":"This one and that one. Two people.","a":"both"},{"q":"To look at funny picture books.","a":"read comics"}],"Unit 8: My Busy Day":[{"q":"To have a class for the violin.","a":"have violin lessons"},{"q":"To give food to your dog.","a":"feed my dog"},{"q":"To leave bed in the morning.","a":"get up"},{"q":"To run slowly with your father.","a":"jog with my dad"},{"q":"To learn numbers at home or school.","a":"study math"},{"q":"To have food at night.","a":"eat dinner"},{"q":"You have many things to do.","a":"busy"},{"q":"To finish school work at home.","a":"do my homework"},{"q":"To wash your body with water.","a":"take a shower"},{"q":"To give water to a plant.","a":"water my plant"},{"q":"To have food in the morning.","a":"eat breakfast"},{"q":"The time after afternoon, before night.","a":"evening"},{"q":"Next. After that.","a":"then"},{"q":"To put books in your bag.","a":"pack my backpack"},{"q":"Prepared. You can start.","a":"ready"}]}},"write-now-1:vocabulary":{"bookId":"write-now-1","activityId":"vocabulary","cefr":"A1","title":"Write Now 1 Vocabulary","vocabByUnit":{"1":{"name":"Unit 1: My Family and I","words":[{"en":"tall","ko":"키가 큰"},{"en":"short","ko":"키가 작은"},{"en":"chubby","ko":"통통한"},{"en":"thin","ko":"마른"},{"en":"straight","ko":"곧은 (머리)"},{"en":"curly","ko":"곱슬곱슬한 (머리)"},{"en":"healthy","ko":"건강한"},{"en":"skinny","ko":"날씬한"},{"en":"strong","ko":"힘이 센"},{"en":"weak","ko":"약한"},{"en":"grandpa","ko":"할아버지"},{"en":"grandma","ko":"할머니"},{"en":"uncle","ko":"삼촌"},{"en":"aunt","ko":"이모, 고모"},{"en":"kind","ko":"친절한"}]},"2":{"name":"Unit 2: My Friend Daisy","words":[{"en":"funny","ko":"재미있는"},{"en":"smart","ko":"똑똑한"},{"en":"brave","ko":"용감한"},{"en":"kind","ko":"친절한"},{"en":"shy","ko":"수줍은"},{"en":"quiet","ko":"조용한"},{"en":"curious","ko":"호기심 많은"},{"en":"friendly","ko":"친근한"},{"en":"talkative","ko":"말이 많은"},{"en":"playful","ko":"장난기 많은"},{"en":"read books","ko":"책을 읽다"},{"en":"watch birds","ko":"새를 관찰하다"},{"en":"play baseball","ko":"야구를 하다"},{"en":"climb trees","ko":"나무를 오르다"},{"en":"help people","ko":"사람들을 돕다"}]},"3":{"name":"Unit 3: School Market Day","words":[{"en":"umbrella","ko":"우산"},{"en":"sneakers","ko":"운동화"},{"en":"teddy bear","ko":"곰인형"},{"en":"marble","ko":"구슬"},{"en":"soccer ball","ko":"축구공"},{"en":"hairband","ko":"머리띠"},{"en":"skateboard","ko":"스케이트보드"},{"en":"flowerpot","ko":"화분"},{"en":"baseball glove","ko":"야구 글러브"},{"en":"basketball","ko":"농구공"},{"en":"crayons","ko":"크레용"},{"en":"ruler","ko":"자"},{"en":"necklace","ko":"목걸이"},{"en":"toy car","ko":"장난감 자동차"},{"en":"doll","ko":"인형"}]},"4":{"name":"Unit 4: What a Messy Room!","words":[{"en":"bed","ko":"침대"},{"en":"chair","ko":"의자"},{"en":"dresser","ko":"서랍장"},{"en":"curtain","ko":"커튼"},{"en":"rug","ko":"양탄자"},{"en":"wardrobe","ko":"옷장"},{"en":"clock","ko":"시계"},{"en":"pillow","ko":"베개"},{"en":"blanket","ko":"담요"},{"en":"baseball bat","ko":"야구 방망이"},{"en":"table","ko":"탁자"},{"en":"basket","ko":"바구니"},{"en":"bookcase","ko":"책장"},{"en":"sofa","ko":"소파"},{"en":"lamp","ko":"램프"}]},"5":{"name":"Unit 5: My Favorite Thing","words":[{"en":"basket","ko":"바구니"},{"en":"robot","ko":"로봇"},{"en":"bike","ko":"자전거"},{"en":"wheel","ko":"바퀴"},{"en":"toy truck","ko":"장난감 트럭"},{"en":"seat","ko":"좌석"},{"en":"backpack","ko":"배낭"},{"en":"door","ko":"문"},{"en":"headlight","ko":"헤드라이트"},{"en":"ribbon","ko":"리본"},{"en":"hat","ko":"모자"},{"en":"soft fur","ko":"부드러운 털"},{"en":"handle","ko":"손잡이"},{"en":"pocket","ko":"주머니"},{"en":"strap","ko":"끈"}]},"6":{"name":"Unit 6: Welcome to My Town!","words":[{"en":"library","ko":"도서관"},{"en":"playground","ko":"놀이터"},{"en":"supermarket","ko":"슈퍼마켓"},{"en":"toy store","ko":"장난감 가게"},{"en":"fire station","ko":"소방서"},{"en":"restaurant","ko":"식당"},{"en":"museum","ko":"박물관"},{"en":"zoo","ko":"동물원"},{"en":"bakery","ko":"빵집"},{"en":"bookstore","ko":"서점"},{"en":"pet shop","ko":"애완동물 가게"},{"en":"park","ko":"공원"},{"en":"hospital","ko":"병원"},{"en":"bank","ko":"은행"},{"en":"post office","ko":"우체국"}]},"7":{"name":"Unit 7: Different but Together","words":[{"en":"paint pictures","ko":"그림을 그리다"},{"en":"play with blocks","ko":"블록놀이를 하다"},{"en":"grow plants","ko":"식물을 기르다"},{"en":"ride a bike","ko":"자전거를 타다"},{"en":"watch TV","ko":"TV를 보다"},{"en":"eat ice cream","ko":"아이스크림을 먹다"},{"en":"play video games","ko":"비디오 게임을 하다"},{"en":"watch movies","ko":"영화를 보다"},{"en":"play tennis","ko":"테니스를 치다"},{"en":"fly kites","ko":"연을 날리다"},{"en":"listen to music","ko":"음악을 듣다"},{"en":"play the piano","ko":"피아노를 치다"},{"en":"swim","ko":"수영하다"},{"en":"catch bugs","ko":"벌레를 잡다"},{"en":"sing songs","ko":"노래를 부르다"}]},"8":{"name":"Unit 8: My Busy Day","words":[{"en":"get up","ko":"일어나다"},{"en":"feed my dog","ko":"개에게 먹이를 주다"},{"en":"eat dinner","ko":"저녁을 먹다"},{"en":"study math","ko":"수학을 공부하다"},{"en":"have violin lessons","ko":"바이올린 수업을 받다"},{"en":"jog with my dad","ko":"아빠와 조깅하다"},{"en":"take a shower","ko":"샤워하다"},{"en":"brush teeth","ko":"이를 닦다"},{"en":"get dressed","ko":"옷을 입다"},{"en":"comb hair","ko":"머리를 빗다"},{"en":"exercise","ko":"운동하다"},{"en":"wash face","ko":"세수하다"},{"en":"water plants","ko":"식물에 물을 주다"},{"en":"do homework","ko":"숙제를 하다"},{"en":"go to school","ko":"학교에 가다"}]}}},"write-now-2:jumpingOx":{"bookId":"write-now-2","activityId":"jumpingOx","cefr":"A1","title":"Write Now 2 Jumping OX","units":{"1":{"title":"Unit 1: I Can Do It by Myself","description":"can / can't + chores","questions":[{"text":"I can make my bed.","correct":true,"explanation":"Good! can + base verb."},{"text":"I can cooking dinner.","correct":false,"explanation":"Incorrect. After can, use the base verb: 'I can cook dinner.'"},{"text":"She can pack her backpack.","correct":true,"explanation":"Good!"},{"text":"He can washes the dishes.","correct":false,"explanation":"Incorrect. No -s after can: 'He can wash the dishes.'"},{"text":"I can't mop the floor.","correct":true,"explanation":"Good! can't + base verb."},{"text":"I can to walk to school.","correct":false,"explanation":"Incorrect. Do not use 'to' after can: 'I can walk to school.'"},{"text":"They can fold towels.","correct":true,"explanation":"Good!"},{"text":"She cans set the table.","correct":false,"explanation":"Incorrect. Never add -s to can: 'She can set the table.'"},{"text":"Can you brush your teeth?","correct":true,"explanation":"Good! Questions: Can + subject + base verb?"},{"text":"I can't doing the laundry.","correct":false,"explanation":"Incorrect. 'I can't do the laundry.'"}]},"2":{"title":"Unit 2: We're on a Picnic","description":"Present continuous: am/is/are + -ing","questions":[{"text":"We are playing frisbee.","correct":true,"explanation":"Good! are + -ing for now."},{"text":"She is take pictures.","correct":false,"explanation":"Incorrect. Use -ing: 'She is taking pictures.'"},{"text":"He is riding a bike.","correct":true,"explanation":"Good!"},{"text":"They is blowing bubbles.","correct":false,"explanation":"Incorrect. They uses 'are': 'They are blowing bubbles.'"},{"text":"I am lying in the sun.","correct":true,"explanation":"Good! I + am + -ing."},{"text":"We are enjoy the picnic.","correct":false,"explanation":"Incorrect. Add -ing: 'We are enjoying the picnic.'"},{"text":"Dad is making a campfire.","correct":true,"explanation":"Good!"},{"text":"She are writing a letter.","correct":false,"explanation":"Incorrect. She uses 'is': 'She is writing a letter.'"},{"text":"The sun is shining.","correct":true,"explanation":"Good!"},{"text":"I am play volleyball now.","correct":false,"explanation":"Incorrect. 'I am playing volleyball now.'"}]},"3":{"title":"Unit 3: What Do You Do After School?","description":"Frequency adverbs: always, usually, often, sometimes","questions":[{"text":"I usually play catch after school.","correct":true,"explanation":"Good! Adverb before the main verb."},{"text":"I play often chess.","correct":false,"explanation":"Incorrect. Put the adverb before the verb: 'I often play chess.'"},{"text":"She always takes lessons.","correct":true,"explanation":"Good!"},{"text":"He sometimes go rollerblading.","correct":false,"explanation":"Incorrect. He/she + -s: 'He sometimes goes rollerblading.'"},{"text":"We often practice dancing.","correct":true,"explanation":"Good!"},{"text":"Always I do housework.","correct":false,"explanation":"Incorrect. Put 'always' after I: 'I always do housework.'"},{"text":"They usually have fun after school.","correct":true,"explanation":"Good!"},{"text":"She don't often play catch.","correct":false,"explanation":"Incorrect. 'She doesn't often play catch.'"},{"text":"I sometimes water the plants.","correct":true,"explanation":"Good!"},{"text":"He usually eats breakfast.","correct":true,"explanation":"Good! Frequency adverb before the verb."}]},"4":{"title":"Unit 4: When I Grow Up","description":"want to be, will + base verb","questions":[{"text":"I want to be a teacher.","correct":true,"explanation":"Good! want to + base verb."},{"text":"She want to be a singer.","correct":false,"explanation":"Incorrect. 'She wants to be a singer.'"},{"text":"He will work hard.","correct":true,"explanation":"Good! will + base verb."},{"text":"I will be a astronaut.","correct":false,"explanation":"Incorrect. Use 'an' before a vowel sound: 'I will be an astronaut.'"},{"text":"When I grow up, I will save people.","correct":true,"explanation":"Good!"},{"text":"He will performs on stage.","correct":false,"explanation":"Incorrect. After will, no -s: 'He will perform on stage.'"},{"text":"I want to be a firefighter.","correct":true,"explanation":"Good!"},{"text":"She will to be famous.","correct":false,"explanation":"Incorrect. No 'to' after will: 'She will be famous.'"},{"text":"They want to share their food.","correct":true,"explanation":"Good!"},{"text":"I wants to be a chef.","correct":false,"explanation":"Incorrect. I uses 'want': 'I want to be a chef.'"}]},"5":{"title":"Unit 5: My Secret Closet","description":"there is / there are, in / on / under","questions":[{"text":"There is a trophy on the top shelf.","correct":true,"explanation":"Good! 'There is' for one thing."},{"text":"There are a T-shirt in the closet.","correct":false,"explanation":"Incorrect. One T-shirt: 'There is a T-shirt in the closet.'"},{"text":"My cap is on the shelf.","correct":true,"explanation":"Good!"},{"text":"There is many game cards in the box.","correct":false,"explanation":"Incorrect. Plural: 'There are many game cards in the box.'"},{"text":"The gloves are under the travel bag.","correct":true,"explanation":"Good!"},{"text":"My racket are in the closet.","correct":false,"explanation":"Incorrect. One racket: 'My racket is in the closet.'"},{"text":"There is a drone next to the trophy.","correct":true,"explanation":"Good!"},{"text":"The clothes is on the shelf.","correct":false,"explanation":"Incorrect. Clothes are plural: 'The clothes are on the shelf.'"},{"text":"This is my secret closet.","correct":true,"explanation":"Good!"},{"text":"There are two caps on the top.","correct":true,"explanation":"Good! 'There are' for two."}]},"6":{"title":"Unit 6: My Favorite Food","description":"like / don't like, taste adjectives","questions":[{"text":"I like yogurt because it is sour.","correct":true,"explanation":"Good!"},{"text":"Popcorn are crunchy.","correct":false,"explanation":"Incorrect. Popcorn is usually uncountable here: 'Popcorn is crunchy.'"},{"text":"The berries taste sweet.","correct":true,"explanation":"Good!"},{"text":"I don't likes soda.","correct":false,"explanation":"Incorrect. After don't, use the base verb: 'I don't like soda.'"},{"text":"Cheese smells delicious.","correct":true,"explanation":"Good!"},{"text":"Nachos is spicy.","correct":false,"explanation":"Incorrect. Nachos are plural: 'Nachos are spicy.'"},{"text":"This dessert is fresh and sweet.","correct":true,"explanation":"Good!"},{"text":"She like salty popcorn.","correct":false,"explanation":"Incorrect. 'She likes salty popcorn.'"},{"text":"I don't like spicy food.","correct":true,"explanation":"Good!"},{"text":"The yogurt taste sour.","correct":false,"explanation":"Incorrect. It/the yogurt + -s: 'The yogurt tastes sour.'"}]},"7":{"title":"Unit 7: Drawing My Feelings","description":"I feel + adjective, because","questions":[{"text":"I feel glad because my classmate is kind.","correct":true,"explanation":"Good! feel + adjective."},{"text":"I feel sadly today.","correct":false,"explanation":"Incorrect. Use an adjective, not an adverb: 'I feel sad today.'"},{"text":"She is scared of the noisy dog.","correct":true,"explanation":"Good!"},{"text":"He feel nervous before the exam.","correct":false,"explanation":"Incorrect. 'He feels nervous before the exam.'"},{"text":"I am excited about the party.","correct":true,"explanation":"Good!"},{"text":"The room is gloomy and dark.","correct":true,"explanation":"Good!"},{"text":"I feel angrily at my neighbor.","correct":false,"explanation":"Incorrect. Use the adjective: 'I feel angry at my neighbor.'"},{"text":"She feels sad because her toy is missing.","correct":true,"explanation":"Good!"},{"text":"They is glad today.","correct":false,"explanation":"Incorrect. 'They are glad today.'"},{"text":"I feel nervous, but I can do it.","correct":true,"explanation":"Good!"}]},"8":{"title":"Unit 8: My Robot Friend","description":"can + chores, put away / turn off","questions":[{"text":"The robot can write a letter.","correct":true,"explanation":"Good!"},{"text":"It can turning off the light.","correct":false,"explanation":"Incorrect. After can, use the base verb: 'It can turn off the light.'"},{"text":"Please put away the boxes.","correct":true,"explanation":"Good! Phrasal verb 'put away'."},{"text":"Don't shout in the hallway.","correct":true,"explanation":"Good!"},{"text":"The robot can solves a math problem.","correct":false,"explanation":"Incorrect. No -s after can: 'The robot can solve a math problem.'"},{"text":"Please take out the cans.","correct":true,"explanation":"Good!"},{"text":"It can to recycle cans.","correct":false,"explanation":"Incorrect. No 'to' after can: 'It can recycle cans.'"},{"text":"Don't throw away the paper.","correct":true,"explanation":"Good!"},{"text":"The robot play a song.","correct":false,"explanation":"Incorrect. Add -s, or use can: 'The robot plays a song' / 'The robot can play a song.'"},{"text":"I can help my robot friend.","correct":true,"explanation":"Good!"}]}}},"early-writers-2:jumpingOx":{"bookId":"early-writers-2","activityId":"jumpingOx","cefr":"A1","title":"Early Writers 2 Jumping OX","units":{"1":{"title":"Unit 1: My School","description":"Capital letters, word order, school places","questions":[{"text":"This is my school.","correct":true,"explanation":"Good! Sentences start with a capital letter."},{"text":"this is the gym.","correct":false,"explanation":"Incorrect. Start with a capital: 'This is the gym.'"},{"text":"Welkome to my school!","correct":false,"explanation":"Incorrect. Spelling: 'Welcome to my school!'"},{"text":"We learn new songs in the hall.","correct":false,"explanation":"Incorrect. Songs are in the music room: 'We learn new songs in the music room.'"},{"text":"We books read in the library.","correct":false,"explanation":"Incorrect. Word order: 'We read books in the library.'"},{"text":"We lunch eat in the cafeteria.","correct":false,"explanation":"Incorrect. Word order: 'We eat lunch in the cafeteria.'"},{"text":"Theese are the classrooms.","correct":false,"explanation":"Incorrect. Spelling: 'These are the classrooms.'"},{"text":"We eat lunch in the cafeteria.","correct":true,"explanation":"Good!"},{"text":"we play in the playground.","correct":false,"explanation":"Incorrect. Capital W: 'We play in the playground.'"},{"text":"This is the library.","correct":true,"explanation":"Good!"}]},"2":{"title":"Unit 2: My Style","description":"Frequency adverbs and clothes words","questions":[{"text":"He never wears sandals.","correct":true,"explanation":"Good! never + verb."},{"text":"What's style my?","correct":false,"explanation":"Incorrect. Word order: 'What's my style?'"},{"text":"Often, I wear tank shirts.","correct":false,"explanation":"Incorrect. The clothes word is 'tank tops'."},{"text":"I wear often shorts.","correct":false,"explanation":"Incorrect. Put the adverb before the verb: 'I often wear shorts.'"},{"text":"I usually wear skirts, shirts and sandals.","correct":false,"explanation":"Incorrect. Use a comma before 'and' in a list: 'skirts, shirts, and sandals'."},{"text":"My favorite color is brown.","correct":true,"explanation":"Good!"},{"text":"I usually wear jeans.","correct":true,"explanation":"Good!"},{"text":"I wear never hats.","correct":false,"explanation":"Incorrect. 'I never wear hats.'"},{"text":"She have a red jacket.","correct":false,"explanation":"Incorrect. 'She has a red jacket.'"},{"text":"He always wears sneakers.","correct":true,"explanation":"Good!"}]},"3":{"title":"Unit 3: My Special Recipe","description":"Sequence words: First, Next, Then, Finally","questions":[{"text":"First, get some bread.","correct":true,"explanation":"Good! Comma after First."},{"text":"Try my soup special.","correct":false,"explanation":"Incorrect. Adjective before the noun: 'Try my special soup.'"},{"text":"Next, toast the water.","correct":false,"explanation":"Incorrect. We boil water: 'Next, boil the water.'"},{"text":"finally, eat your soup.","correct":false,"explanation":"Incorrect. Capital F: 'Finally, eat your soup.'"},{"text":"Now it's to ready drink!","correct":false,"explanation":"Incorrect. Word order: 'Now it's ready to drink!'"},{"text":"Then put the strawberries on top.","correct":true,"explanation":"Good!"},{"text":"Next, cut the bananas.","correct":true,"explanation":"Good! Comma after Next."},{"text":"First mix the eggs.","correct":false,"explanation":"Incorrect. Put a comma after First: 'First, mix the eggs.'"},{"text":"Finally, enjoy your snack.","correct":true,"explanation":"Good!"},{"text":"Then you add some milk.","correct":true,"explanation":"Good!"}]},"4":{"title":"Unit 4: My Birthday","description":"will, on + day, party phrases","questions":[{"text":"We will sing karaoke.","correct":true,"explanation":"Good! will + base verb."},{"text":"You will come to my party?","correct":false,"explanation":"Incorrect. Questions: 'Will you come to my party?'"},{"text":"It's at Friday.","correct":false,"explanation":"Incorrect. Use 'on' with days: 'It's on Friday.'"},{"text":"We will has a sleepover.","correct":false,"explanation":"Incorrect. After will, use the base verb: 'We will have a sleepover.'"},{"text":"There will be pizza.","correct":true,"explanation":"Good!"},{"text":"We'll make fun together!","correct":false,"explanation":"Incorrect. The phrase is 'have fun': 'We'll have fun together!'"},{"text":"My party is on Saturday.","correct":true,"explanation":"Good! Capitalize the day."},{"text":"We will eating cake.","correct":false,"explanation":"Incorrect. 'We will eat cake.'"},{"text":"Will you bring a gift?","correct":true,"explanation":"Good!"},{"text":"The party is on friday.","correct":false,"explanation":"Incorrect. Capitalize Friday: 'on Friday'."}]},"5":{"title":"Unit 5: At the Park","description":"Present continuous: is/are + -ing","questions":[{"text":"She is swimming.","correct":true,"explanation":"Good! is + -ing."},{"text":"Now see I a boy.","correct":false,"explanation":"Incorrect. Word order: 'Now, I see a boy.'"},{"text":"He's fish.","correct":false,"explanation":"Incorrect. Use -ing: 'He's fishing.'"},{"text":"She's sliding on a swing.","correct":false,"explanation":"Incorrect. On a swing we say 'She's swinging.'"},{"text":"They're playing Frisbee.","correct":true,"explanation":"Good!"},{"text":"He is running in the park.","correct":true,"explanation":"Good!"},{"text":"They is riding bikes.","correct":false,"explanation":"Incorrect. They uses 'are': 'They are riding bikes.'"},{"text":"I am sitting on a bench.","correct":true,"explanation":"Good!"},{"text":"She are playing catch.","correct":false,"explanation":"Incorrect. 'She is playing catch.'"},{"text":"The children are laughing.","correct":true,"explanation":"Good!"}]},"6":{"title":"Unit 6: Last Winter","description":"Past simple: was/were, -ed, irregular verbs","questions":[{"text":"We played in the snow.","correct":true,"explanation":"Good! Regular past: play → played."},{"text":"It is snowy last winter.","correct":false,"explanation":"Incorrect. Past time needs 'was': 'It was snowy last winter.'"},{"text":"Last wintir was fun.","correct":false,"explanation":"Incorrect. Spelling: 'Last winter was fun.'"},{"text":"I playd games with my grandma.","correct":false,"explanation":"Incorrect. Spelling: 'I played games with my grandma.'"},{"text":"We even saw a rabbit!","correct":true,"explanation":"Good! saw is the past of see."},{"text":"It was cold last winter.","correct":true,"explanation":"Good!"},{"text":"We go to the mountain last year.","correct":false,"explanation":"Incorrect. Past of go is went: 'We went to the mountain last year.'"},{"text":"I made a snowman.","correct":true,"explanation":"Good! made is the past of make."},{"text":"They was happy.","correct":false,"explanation":"Incorrect. They uses 'were': 'They were happy.'"},{"text":"We had hot chocolate.","correct":true,"explanation":"Good! had is the past of have."}]},"7":{"title":"Unit 7: My Dream","description":"will / I'll + jobs","questions":[{"text":"I think I will be a cook.","correct":true,"explanation":"Good! will + be + job."},{"text":"I'm teach soccer classes.","correct":false,"explanation":"Incorrect. Future: 'I'll teach soccer classes.'"},{"text":"I think I will building houses.","correct":false,"explanation":"Incorrect. After will, use the base verb: 'I think I will build houses.'"},{"text":"To have a firefighter is my dream!","correct":false,"explanation":"Incorrect. We say 'To be a firefighter is my dream!'"},{"text":"i'll stop fires, too.","correct":false,"explanation":"Incorrect. Capital I: 'I'll stop fires, too.'"},{"text":"I will be a teacher.","correct":true,"explanation":"Good!"},{"text":"She will helps sick people.","correct":false,"explanation":"Incorrect. After will, no -s: 'She will help sick people.'"},{"text":"My dream is to be a singer.","correct":true,"explanation":"Good!"},{"text":"He will to fly a plane.","correct":false,"explanation":"Incorrect. No 'to' after will: 'He will fly a plane.'"},{"text":"I'll work hard every day.","correct":true,"explanation":"Good!"}]},"8":{"title":"Unit 8: How to Get There","description":"Directions: Walk, Turn, Go straight","questions":[{"text":"Walk through the park.","correct":true,"explanation":"Good!"},{"text":"Go strait on Ox Street.","correct":false,"explanation":"Incorrect. Spelling: 'Go straight on Ox Street.'"},{"text":"Cross right on Nola Street.","correct":false,"explanation":"Incorrect. We say 'Turn right on Nola Street.'"},{"text":"Walked two blocks.","correct":false,"explanation":"Incorrect. Directions use the base verb: 'Walk two blocks.'"},{"text":"The restaurant will be on your left.","correct":true,"explanation":"Good!"},{"text":"Turn left at the library.","correct":true,"explanation":"Good!"},{"text":"Go straights two blocks.","correct":false,"explanation":"Incorrect. 'Go straight for two blocks.'"},{"text":"The store is on your right.","correct":true,"explanation":"Good!"},{"text":"Turn to left on Main Street.","correct":false,"explanation":"Incorrect. 'Turn left on Main Street.'"},{"text":"Walk two blocks, then turn right.","correct":true,"explanation":"Good!"}]}}}}
};
