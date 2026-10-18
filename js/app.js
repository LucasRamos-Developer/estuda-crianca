import * as E from './engine.js';
import { icon } from './icons.js';
import * as C from './curriculum.js';
import { sfx, setSound, confetti, vibrate } from './fx.js';

const $app = document.getElementById('app');
const $ov = document.getElementById('overlay');
const $modal = document.getElementById('modal');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const S = () => E.state;
const PRAISE = ['Muito bem!', 'Isso aí!', 'Mandou bem!', 'Certo!', 'Excelente!', 'Perfeito!'];
const OPS = ['add', 'sub', 'mul', 'div'];
const OP_NAME = { add: 'Adição', sub: 'Subtração', mul: 'Multiplicação', div: 'Divisão', mix: 'Misturado' };
const OP_SHORT = { add: '+', sub: '−', mul: '×', div: '÷', mix: '±' };
const OP_UNIT = { add: 'add', sub: 'subt', mul: 'mul', div: 'div' };
const OP_COLOR = { add: 'purple', sub: 'orange', mul: 'green', div: 'blue', mix: 'red' };
const LEVEL_NAMES = ['Aprender', 'Fixação', 'Domínio'];
const OP_TAB = { add: 'Somar', sub: 'Tirar', mul: 'Vezes', div: 'Dividir' };
const OP_VERB = { add: 'somar', sub: 'tirar', mul: 'vezes', div: 'dividir' };
const CH_MODES = [['quiz', 'clipboard', 'Perguntas', 'Responda a tabuada toda'], ['time', 'clock', '1 minuto', 'Quantas você acerta?'], ['survival', 'heart', '3 vidas', 'Até errar 3 vezes']];
const WEEKDAY = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const CAN_SPEAK = 'speechSynthesis' in window;
const pct = (x) => (x == null ? '—' : `${Math.round(x * 100)}%`);
const fmtTime = (ms) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const fmtDur = (ms) => { const m = Math.round(ms / 60000); return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}min`; };
const fmtDate = (ts) => new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const YEAR = () => S().profile.year || 3;
const subjGlyph = (s, size = 26) => (s.icon ? icon(s.icon, size) : `<span class="glyph">${s.glyph}</span>`);
const initial = () => esc((S().profile.name || '?').trim().charAt(0).toUpperCase());

const ui = {
  subj: 'all',
  tab: 'learn', pop: null, parentOk: false, pin: '', pinStep: null, pinFirst: '',
  testOp: 'mul', gridOp: 'mul', tableOp: 'mul',
  chOp: 'mul', chN: 'all', chMode: 'quiz',
  onbName: '', onbGoal: 20, onbYear: 3,
};
let session = null;
let walk = null;
let studyNode = null;
let after = [];

// ---------- Render principal ----------
function render() {
  setSound(S().settings.sound);
  if (!S().profile.name) { renderOnboarding(); return; }
  $app.innerHTML = nav() + `<div class="main">${topbar()}<main class="page page-${ui.tab}">${TABS[ui.tab]()}</main></div>`;
}

function topbar() {
  const on = E.todayXp() > 0;
  return `<header class="topbar">
    <button class="avatar" data-a="tab" data-v="progress" aria-label="Meu progresso">${initial()}</button>
    <div class="chip streak ${on ? '' : 'off'}" title="Dias seguidos">${icon('flame', 22)}${E.streak()}</div>
    <div class="chip xp" title="XP de hoje / meta">${icon('bolt', 22)}${E.todayXp()}/${S().settings.goal}</div>
    <div class="chip stars" title="Estrelas">${icon('star', 22)}${E.totalStars()}</div>
  </header>`;
}

function nav() {
  const items = [['learn', 'home', 'Trilha'], ['challenges', 'bolt', 'Desafios'], ['progress', 'chart', 'Progresso'], ['parents', 'lock', 'Pais']];
  return `<nav class="nav"><div class="brand">Estuda Criança</div>${items.map(([id, ic, label]) => `<button class="${ui.tab === id || (id === 'learn' && ui.tab === 'table') ? 'on' : ''}" data-a="tab" data-v="${id}">${icon(ic, 26)}<span>${label}</span></button>`).join('')}</nav>`;
}

const TABS = { learn: renderLearn, table: renderTable, challenges: renderChallenges, progress: renderProgress, parents: renderParents };

// ---------- Trilha ----------
const OFFSETS = [0, 44, 66, 44, 0, -44, -66, -44];

function renderLearn() {
  const year = YEAR();
  const crs = C.course(year);
  if (!crs.subjects.some((s) => s.id === ui.subj)) ui.subj = 'all';
  const cur = ui.subj === 'all' ? null : crs.subjects.find((s) => s.id === ui.subj);
  const picker = `<div class="subj-current">
    <span class="sic c-${cur ? cur.color : 'green'}">${cur ? subjGlyph(cur, 24) : icon('layers', 24)}</span>
    <div class="grow"><small>Estudando agora · ${year}º ano</small><b>${cur ? cur.full : 'Trilha padrão'}</b></div>
    <button class="btn white sm" data-a="pick-subj">Escolher matéria</button>
  </div>`;
  if (!cur) {
    const done = crs.all.filter((n) => E.stars(n.id) >= 1).length;
    return `${picker}
      <div class="unit-banner c-green"><div><small>${year}º ano · Trilha padrão</small><h2>Um pouco de cada matéria</h2><p>Um passo de cada matéria, em sequência · ${done}/${crs.all.length} feitos</p></div><div class="big">${icon('layers', 44)}</div></div>
      <div class="path">${pathNodes(year, crs.all, true)}</div>`;
  }
  const prog = C.subjectProgress(year, cur.id);
  const tools = cur.id === 'ma' ? `<button class="tool-card c-green" data-a="tab" data-v="table">${icon('book', 26)}<div class="grow"><b>Tabuadas</b><small>Ver, ouvir e aprender as tabuadas de somar, tirar, multiplicar e dividir</small></div>${icon('right', 22)}</button>` : '';
  return `${picker}${tools}${cur.units.map((u, i) => `<section class="unit">
      <div class="unit-banner c-${cur.color}"><div><small>${cur.full} · ${year}º ano · Unidade ${i + 1}</small><h2>${esc(u.title)}</h2>
        <p>${i === 0 ? `${prog.done}/${prog.total} passos feitos` : `${u.nodes.length} passos`}</p></div><div class="big">${subjGlyph(cur, 40)}</div></div>
      <div class="path">${pathNodes(year, u.nodes, false)}</div>
    </section>`).join('')}
    ${cur.authored ? '' : '<p class="muted center small">Este ano ainda usa as habilidades da BNCC para estudo. Perguntas novas serão adicionadas aos poucos.</p>'}`;
}

// Grade para escolher a matéria (ou a trilha padrão)
function pickSubject() {
  const year = YEAR();
  const crs = C.course(year);
  const all = crs.all;
  const doneAll = all.filter((n) => E.stars(n.id) >= 1).length;
  const tile = (id, color, glyph, name, sub) => `<button class="subj-tile c-${color} ${ui.subj === id ? 'on' : ''}" data-a="subj" data-v="${id}">
    <span class="sic">${glyph}</span><b>${name}</b><small>${sub}</small></button>`;
  showModal(`<h2>O que você quer estudar?</h2><p>${year}º ano</p>
    <div class="subj-grid">
      ${tile('all', 'green', icon('layers', 26), 'Trilha padrão', `Todas as matérias · ${doneAll}/${all.length}`)}
      ${crs.subjects.map((sb) => { const p = C.subjectProgress(year, sb.id); return tile(sb.id, sb.color, subjGlyph(sb, 26), sb.full, `${p.done}/${p.total} passos`); }).join('')}
    </div>
    <button class="btn ghost" data-a="modal-close">Fechar</button>`);
}

function pathNodes(year, nodes, showSubj) {
  const cur = C.currentId(year, nodes);
  return nodes.map((n, j) => {
    const open = C.unlocked(year, n);
    const st = E.stars(n.id);
    const off = OFFSETS[j % OFFSETS.length];
    const isCur = n.id === cur;
    const subj = C.subjectById(n.subj);
    const cls = !open ? 'locked' : st >= 3 ? 'gold' : '';
    const inner = n.kind === 'gen' ? (n.review ? icon('star', 30) : n.icon) : n.kind === 'check' ? icon('book', 28) : subjGlyph(subj, 28);
    const starsHtml = open ? `<div class="node-stars">${[0, 1, 2].map((i) => `<span class="${i < st ? 'on' : ''}">${icon('star', 14)}</span>`).join('')}</div>` : '';
    return `<div class="node-row c-${n.color}">
      <div class="node-wrap" style="transform:translateX(${off}px)">
        ${isCur && ui.pop !== n.id ? `<div class="start-bubble">${st ? 'Praticar' : 'Começar'}</div>` : ''}
        ${isCur ? `<div class="ring" style="--p:${(st / 3) * 100}%"></div>` : ''}
        <button class="node ${cls}" data-a="node" data-v="${n.id}" aria-label="${esc(n.title)}">${inner}</button>
        ${starsHtml}
        ${showSubj ? `<span class="node-subj">${subj.name}</span>` : ''}
      </div>
      ${ui.pop === n.id ? nodePopover(n, open, st, off) : ''}
    </div>`;
  }).join('');
}

function nodePopover(n, open, st, off) {
  const subj = C.subjectById(n.subj);
  if (!open) {
    return `<div class="node-pop locked" style="--ax:${off}px"><small>${subj.full}</small><h3>${esc(n.title)}</h3><p>Complete o passo anterior desta unidade para liberar.</p></div>`;
  }
  const lvl = n.kind === 'check' ? 'Estudo pela BNCC: leia e marque o que já sabe.'
    : st >= 3 ? 'Nível máximo! Pratique para não esquecer.' : `Nível ${st + 1} de 3 · ${LEVEL_NAMES[st]}`;
  const btn = n.kind === 'check' ? 'Estudar · +5 XP' : `Estudar e responder · +${n.review ? 15 : 10} XP`;
  return `<div class="node-pop" style="--ax:${off}px">
    <small>${subj.full}</small><h3>${esc(n.title)}</h3><p>${lvl}</p>
    <button class="btn white" data-a="start" data-v="${n.id}">${btn}</button>
  </div>`;
}

// Tela de estudo antes de responder
function renderStudy(n) {
  const subj = C.subjectById(n.subj);
  let body;
  let foot = '<div class="lesson-foot"><button class="btn" data-a="study-go">Responder</button></div>';
  if (n.kind === 'gen') {
    const st = E.nodeStudy(n.gen);
    const isTable = E.unitById(n.gen.unit)?.table;
    body = `<div class="tag">${isTable ? 'Veja a tabuada' : 'Veja os exemplos'}</div>
      <h2 class="q-title">${esc(n.title)}</h2>
      ${st.rows.length ? `<div class="study-grid ${isTable ? '' : 'examples'}">${st.rows.map((r) => `<div>${r}</div>`).join('')}</div>` : ''}
      <div class="tip">${icon('bulb', 22)}<span>${esc(st.tip)}</span></div>
      ${isTable ? `<button class="btn white" data-a="study-walk">${icon('book', 22)} Aprender conta por conta</button>` : ''}`;
  } else if (n.kind === 'check') {
    body = `<div class="tag">${subj.full} · Estudo</div>
      <h2 class="q-title">O que aprender</h2>
      <div class="skill-list">${n.skills.map((code) => `<div class="skill"><b>${code}</b><p>${esc(C.skillByCode(code)?.text || '')}</p></div>`).join('')}</div>
      <div class="tip">${icon('bulb', 22)}<span>Leia com um adulto, procure exemplos no livro da escola e marque como está.</span></div>`;
    foot = `<div class="lesson-foot two-even">
      <button class="btn white" data-a="check-mark" data-v="1">Ainda estou aprendendo</button>
      <button class="btn" data-a="check-mark" data-v="3">Já sei!</button></div>`;
  } else {
    body = `<div class="tag">${subj.full}</div>
      <h2 class="q-title">${esc(n.title)}</h2>
      <p class="lead">${esc(n.intro)}</p>
      ${n.passage ? `<div class="passage">${esc(n.passage)}</div>` : ''}
      <ul class="points">${n.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      ${n.example ? `<div class="tip">${icon('bulb', 22)}<span class="pre">${esc(n.example)}</span></div>` : ''}
      ${n.skills.length ? `<p class="muted small">BNCC: ${n.skills.join(', ')}</p>` : '<p class="muted small">Currículo da rede municipal de Joinville</p>'}`;
  }
  $ov.innerHTML = `<div class="screen"><div class="inner">
    <div class="lesson-top"><button class="icon-btn" data-a="study-close" aria-label="Fechar">${icon('x', 26)}</button>
      <div class="progress"><div class="fill" style="width:0"></div></div></div>
    <div class="lesson-body c-${n.color}">${body}</div>
    ${foot}
  </div></div>`;
}

// ---------- Aba Tabuada (livrinho com as 9 tabuadas) ----------
function renderTable() {
  const op = ui.tableOp;
  return `<button class="back-link" data-a="go-subj" data-v="ma">${icon('left', 20)} Matemática</button>
  <h1 class="page-title">Tabuadas</h1>
  <div class="op-tabs">${OPS.map((o) => `<button class="op-tab c-${OP_COLOR[o]} ${o === op ? 'on' : ''}" data-a="table-op" data-v="${o}"><b>${OP_SHORT[o]}</b><span>${OP_TAB[o]}</span></button>`).join('')}</div>
  <div class="book c-${OP_COLOR[op]}">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="tcard" data-a="table-open" data-v="${n}">
    <h3>Tabuada do ${n}</h3>
    <ol>${E.tableRows(op, n).map((r) => `<li><span>${r.a} ${E.SYM[op]} ${r.b} =</span><b>${r.res}</b></li>`).join('')}</ol>
  </button>`).join('')}</div>
  <p class="muted center small">Toque numa tabuada para ver grande, ouvir e praticar.</p>`;
}

function openTable(n) {
  const op = ui.tableOp;
  sfx.tap();
  showModal(`<div class="c-${OP_COLOR[op]}"><h2 class="tbig-title">Tabuada do ${n}</h2><span class="muted">${OP_NAME[op]}</span></div>
    <ol class="tbig c-${OP_COLOR[op]}">${E.tableRows(op, n).map((r) => `<li><span>${r.a} ${E.SYM[op]} ${r.b} =</span><b>${r.res}</b></li>`).join('')}</ol>
    ${CAN_SPEAK ? speakBtn('table-speak', n, 'Ouvir a tabuada') : ''}
    <button class="btn white" data-a="walk-start" data-v="${n}">${icon('book', 20)} Aprender conta por conta</button>
    <button class="btn" data-a="table-quiz" data-v="${n}">Desafio desta tabuada</button>
    <button class="btn ghost" data-a="modal-close">Fechar</button>`);
}

function dotsHtml(v) {
  if (!v) return '';
  const dot = (cls = '') => `<i class="dot ${cls}"></i>`;
  if (v.type === 'add') {
    return `<div class="dots inline"><div class="dgrp">${dot('c0').repeat(v.a)}</div><span class="dsym">+</span><div class="dgrp">${dot('c1').repeat(v.b)}</div></div>`;
  }
  if (v.type === 'sub') {
    return `<div class="dots inline"><div class="dgrp">${Array.from({ length: v.total }, (_, i) => dot(i >= v.total - v.gone ? 'gone' : 'c1')).join('')}</div></div>`;
  }
  return `<div class="dots">${Array.from({ length: v.groups }, (_, g) => `<div class="dgrp">${dot(`c${g % 4}`).repeat(v.each)}</div>`).join('')}</div>`;
}

function explainHtml(r) {
  const ex = E.explainFact(r);
  return `${dotsHtml(ex.visual)}<div class="help-lines">${ex.lines.map((l) => `<div>${esc(l)}</div>`).join('')}</div>`;
}

// Voz: fala uma ou várias linhas; o mesmo botão vira "Parar" enquanto fala
let speakLeft = 0;
function setSpeaking(on) { document.body.classList.toggle('is-speaking', on); }
function stopSpeak() {
  speakLeft = 0;
  if (CAN_SPEAK) window.speechSynthesis.cancel();
  setSpeaking(false);
}
function speak(lines) {
  if (!CAN_SPEAK || !S().settings.sound) return;
  stopSpeak();
  try {
    const synth = window.speechSynthesis;
    const voice = synth.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('pt'));
    const list = [].concat(lines);
    speakLeft = list.length;
    setSpeaking(true);
    for (const text of list) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'pt-BR';
      u.rate = 0.9;
      if (voice) u.voice = voice;
      u.onend = u.onerror = () => { speakLeft = Math.max(0, speakLeft - 1); if (!speakLeft) setSpeaking(false); };
      synth.speak(u);
    }
  } catch { setSpeaking(false); }
}
// Toque no botão de voz: se está falando, para; senão, fala
function toggleSpeak(lines) {
  if (document.body.classList.contains('is-speaking')) stopSpeak();
  else speak(lines);
}
const speakBtn = (action, v, label, cls = 'btn white') => `<button class="${cls} spk" data-a="${action}" data-v="${v}">
  <span class="when-off">${icon('speaker', 20)}${label ? ` ${label}` : ''}</span><span class="when-on">${icon('stop', 20)}${label ? ' Parar' : ''}</span></button>`;

// ---------- Aprender passo a passo ----------
function startWalk(op, n, then) {
  closeModal();
  ui.pop = null;
  walk = { op, n, rows: E.tableRows(op, n), idx: 0, shown: false, then };
  document.body.classList.add('lock');
  renderWalk();
}

function walkNext() {
  if (!walk) return;
  stopSpeak();
  if (!walk.shown) { walk.shown = true; sfx.correct(); } else { walk.idx++; walk.shown = false; sfx.tap(); }
  renderWalk();
}

function renderWalk() {
  const w = walk;
  const total = w.rows.length;
  const color = OP_COLOR[w.op];
  if (w.idx >= total) {
    $ov.innerHTML = `<div class="screen"><div class="inner">
      <div class="result">
        <div class="big-badge c-${color}">${icon('check', 64)}</div>
        <h1>Você viu toda a tabuada do ${w.n}!</h1>
        <p class="muted big-p">Agora é hora de responder.</p>
      </div>
      <div class="result-foot">
        <button class="btn" data-a="walk-apply">Responder a lição</button>
        <button class="btn white" data-a="walk-again">${icon('refresh', 20)} Ver de novo</button>
        <button class="btn ghost" data-a="walk-close">Voltar</button>
      </div>
    </div></div>`;
    sfx.complete();
    return;
  }
  const r = w.rows[w.idx];
  $ov.innerHTML = `<div class="screen"><div class="inner">
    <div class="lesson-top">
      <button class="icon-btn" data-a="walk-close" aria-label="Fechar">${icon('x', 26)}</button>
      <div class="progress"><div class="fill" style="width:${((w.idx + (w.shown ? 1 : 0)) / total) * 100}%"></div></div>
      <button class="skip-btn" data-a="walk-apply">Pular</button>
    </div>
    <div class="lesson-body c-${color}">
      <div class="tag">${OP_NAME[w.op]} · Tabuada do ${w.n} · ${w.idx + 1} de ${total}</div>
      <div class="q-card">
        <div class="expr-big">${r.a} ${E.SYM[r.op]} ${r.b} = ${w.shown ? `<span class="ans">${r.res}</span>` : '<span class="qm">?</span>'}</div>
        ${CAN_SPEAK && w.shown ? speakBtn('speak-fact', w.idx, '', 'speak-btn') : ''}
      </div>
      ${w.shown ? explainHtml(r) : `${dotsHtml(E.explainFact(r).visual)}<p class="muted center big-p">Pense um pouquinho. Olhe as bolinhas!</p>`}
    </div>
    <div class="lesson-foot two">
      <button class="btn white" data-a="walk-prev" ${w.idx === 0 ? 'disabled' : ''} aria-label="Anterior">${icon('left', 22)}</button>
      <button class="btn ${w.shown ? '' : 'orange'}" data-a="walk-next">${w.shown ? 'Próxima' : 'Ver resposta'}</button>
    </div>
  </div></div>`;
  if (w.shown) speak(E.speakText(r));
}

function closeOverlay() {
  walk = null;
  studyNode = null;
  stopSpeak();
  $ov.innerHTML = '';
  document.body.classList.remove('lock');
  render();
}

function walkApply() {
  const w = walk;
  walk = null;
  stopSpeak();
  if (w.then) w.then();
  else startNodeLesson(`${OP_UNIT[w.op]}-${w.n}`, true);
}

// ---------- Início de lições ----------
// Passo da trilha do ano; tabuadas fora do ano viram um passo "avulso" do motor de contas
function resolveNode(id) {
  const n = C.findNode(YEAR(), id);
  if (n) return n;
  const g = E.nodeById(id);
  return g ? { id: g.id, kind: 'gen', gen: g, title: g.title, icon: g.icon, skills: [], subj: 'ma', color: 'green', review: g.review } : null;
}
function lessonGo(id) {
  const n = resolveNode(id);
  startSession({ kind: 'lesson', nodeId: id, title: n.title, questions: C.lessonQuestions(n), retry: true, help: n.kind === 'gen' });
}
function startNodeLesson(id, skipStudy = false) {
  const n = resolveNode(id);
  if (!n) return;
  if (skipStudy || (n.kind === 'gen' && n.review)) return lessonGo(id);
  closeModal();
  ui.pop = null;
  studyNode = n;
  document.body.classList.add('lock');
  renderStudy(n);
}
function checkMark(starsValue) {
  const n = studyNode;
  const res = E.markStudied(n.id, n.title, starsValue);
  studyNode = null;
  sfx.complete();
  if (starsValue >= 3) confetti();
  toast(starsValue >= 3 ? 'Muito bem! Marcado como aprendido.' : 'Anotado! Continue estudando.');
  closeOverlay();
  if (res.streakAfter > res.streakBefore) { after = []; document.body.classList.add('lock'); streakScreen(res.streakAfter); session = { ended: true, result: true }; }
}

// ---------- Desafios ----------
function renderChallenges() {
  const s = S();
  const dailyDone = s.daily[E.dayKey()];
  const weak = E.weakFacts(30).length;
  const seen = C.course(YEAR()).subjects.flatMap((x) => x.nodes).filter((n) => n.kind !== 'check' && E.stars(n.id) >= 1).length;
  const { chOp: op, chN: n, chMode: mode } = ui;
  const rec = E.record(mode, op, n);
  const recLabel = mode === 'quiz' ? (rec ? `Melhor: ${rec}/${n === 'all' ? 20 : 10}` : 'Ainda sem nota') : `Recorde: ${rec}`;
  const card = (act, ic, color, title, desc, info, btn, done = false, extra = '') => `<div class="card ${done ? 'done' : ''}">
    <div class="card-top"><div class="ic c-${color}">${icon(ic, 28)}</div><div class="grow"><h3>${title}</h3><p>${desc}</p></div></div>
    ${extra}
    <div class="rec">${info}</div>
    <button class="btn ${color === 'purple' ? 'purple' : color === 'orange' ? 'orange' : color === 'green' ? '' : 'blue'}" data-a="ch" data-v="${act}" ${done ? 'disabled' : ''}>${btn}</button>
  </div>`;
  return `<h1 class="page-title">Desafios</h1>
  <section class="builder c-${OP_COLOR[op]}">
    <h2>Matemática · desafio de contas</h2>
    <div class="b-step"><span class="b-label">1. Operação</span>
      <div class="op-tabs small">${OPS.map((o) => `<button class="op-tab c-${OP_COLOR[o]} ${o === op ? 'on' : ''}" data-a="ch-op" data-v="${o}"><b>${OP_SHORT[o]}</b><span>${OP_TAB[o]}</span></button>`).join('')}</div></div>
    <div class="b-step"><span class="b-label">2. Qual tabuada?</span>
      <div class="num-pick">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => `<button class="${n === k ? 'on' : ''}" data-a="ch-n" data-v="${k}">${k}</button>`).join('')}<button class="all ${n === 'all' ? 'on' : ''}" data-a="ch-n" data-v="all">Todas</button></div></div>
    <div class="b-step"><span class="b-label">3. Tipo de desafio</span>
      <div class="modes">${CH_MODES.map(([m, ic, label, desc]) => `<button class="mode ${m === mode ? 'on' : ''}" data-a="ch-mode" data-v="${m}">${icon(ic, 24)}<b>${label}</b><small>${desc}</small></button>`).join('')}</div></div>
    <div class="b-go"><span class="rec">${recLabel}</span><button class="btn" data-a="ch" data-v="table">Começar · ${n === 'all' ? 'todas as tabuadas' : `tabuada do ${n}`} de ${OP_VERB[op]}</button></div>
  </section>
  <h2 class="section-title">Desafios de todas as matérias</h2>
  <div class="cards">
    ${card('daily', 'calendar', 'orange', 'Desafio do dia', '10 contas misturadas. Ganhe +20 XP.', dailyDone != null ? `Feito hoje: ${dailyDone}/10` : 'Novo desafio disponível', dailyDone != null ? 'Volte amanhã' : 'Jogar', dailyDone != null)}
    ${card('test', 'clipboard', 'purple', 'Teste de progresso', '2 contas de cada tabuada, sem ajuda. No final sai um boletim.', (() => { const t = s.tests.find((x) => x.op === ui.testOp); return t ? `Último: ${t.score}/${t.total}` : 'Ainda não fez'; })(), `Testar ${OP_NAME[ui.testOp].toLowerCase()}`, false,
      `<div class="seg mini">${OPS.map((o) => `<button class="${ui.testOp === o ? 'on' : ''}" data-a="test-op" data-v="${o}">${OP_SHORT[o]}</button>`).join('')}</div>`)}
    ${card('surprise', 'shuffle', 'green', 'Revisão surpresa', 'Perguntas de todas as matérias que você já estudou na trilha.', seen ? `${seen} ${seen === 1 ? 'lição estudada' : 'lições estudadas'}` : 'Faça uma lição da trilha para liberar', 'Jogar', !seen)}
    ${card('errors', 'target', 'blue', 'Treino dos erros', 'Pratique as contas que você mais erra.', weak ? `${weak} ${weak === 1 ? 'conta' : 'contas'} para treinar` : 'Nenhum erro para treinar', 'Treinar', !weak)}
  </div>`;
}

function startTableChallenge(op, n, mode) {
  const name = n === 'all' ? `Todas as tabuadas de ${OP_VERB[op]}` : `Tabuada do ${n} de ${OP_VERB[op]}`;
  if (mode === 'quiz') return startSession({ kind: 'quiz', op, n, title: name, questions: E.tableQuiz(op, n), retry: false, help: true });
  if (mode === 'time') return startSession({ kind: 'time', op, n, title: `1 minuto · ${name}`, instant: true, timeLimit: 60000, gen: () => E.tableChallengeQuestion(op, n) });
  return startSession({ kind: 'survival', op, n, title: `3 vidas · ${name}`, instant: true, hearts: 3, gen: () => E.tableChallengeQuestion(op, n) });
}

function startChallenge(kind) {
  const s = S();
  if (kind === 'table') return startTableChallenge(ui.chOp, ui.chN, ui.chMode);
  if (kind === 'daily') {
    if (s.daily[E.dayKey()] != null) return toast('Você já fez o desafio de hoje. Volte amanhã!');
    startSession({ kind, title: 'Desafio do dia', questions: E.dailyQuestions(), retry: false, help: true });
  }
  if (kind === 'surprise') {
    const qs = C.surpriseQuestions(YEAR());
    if (!qs.length) return toast('Complete pelo menos uma lição na trilha primeiro.');
    startSession({ kind, title: 'Revisão surpresa', questions: qs, retry: true, help: true });
  }
  if (kind === 'test') {
    const op = ui.testOp;
    startSession({ kind, op, title: `Teste de progresso · ${OP_NAME[op]}`, questions: E.testQuestions(op), retry: false });
  }
  if (kind === 'errors') {
    const qs = E.errorQuestions();
    if (!qs.length) return toast('Você ainda não tem erros para treinar.');
    startSession({ kind, title: 'Treino dos erros', questions: qs, retry: true, help: true });
  }
}

// ---------- Progresso (criança) ----------
function renderProgress() {
  const s = S();
  const t = E.totals();
  const goalP = Math.min(100, (E.todayXp() / s.settings.goal) * 100);
  const week = E.lastDays(7);
  const maxXp = Math.max(10, ...week.map((d) => d.xp));
  return `<div class="report-head"><div class="avatar lg">${initial()}</div><div><h2>${esc(s.profile.name)}</h2><span class="muted">Estudando desde ${new Date(s.created).toLocaleDateString('pt-BR')}</span></div></div>
  <div class="goal"><div class="ic c-yellow">${icon(goalP >= 100 ? 'trophy' : 'target', 30)}</div><div class="grow"><b>Meta de hoje</b> <span class="muted">${E.todayXp()} / ${s.settings.goal} XP</span><div class="bar"><i style="width:${goalP}%"></i></div></div></div>
  <div class="two-col">
    <div>
      <h2 class="section-title">Estatísticas</h2>
      <div class="stats-grid">
        ${stat('flame', 'orange', E.streak(), 'dias seguidos')}
        ${stat('trophy', 'yellow', s.best.streak, 'recorde de dias')}
        ${stat('bolt', 'blue', s.xp, 'XP total')}
        ${stat('star', 'yellow', `${E.totalStars()}/${E.ALL_NODES.length * 3}`, 'estrelas')}
        ${stat('check', 'green', t.c, 'contas certas')}
        ${stat('target', 'red', pct(t.q ? t.c / t.q : null), 'de acerto')}
      </div>
    </div>
    <div>
      <h2 class="section-title">Últimos 7 dias</h2>
      ${barChart(week, (d) => d.xp, maxXp, (d) => WEEKDAY[d.date.getDay()])}
    </div>
  </div>
  <h2 class="section-title">Matérias do ${YEAR()}º ano</h2>
  ${subjectBars()}
  <h2 class="section-title">Minhas tabuadas</h2>
  ${gridPicker()}
  ${masteryGrid(ui.gridOp)}
  <h2 class="section-title">Conquistas</h2>
  <div class="ach-grid">${E.ACHIEVEMENTS.map((a) => `<div class="ach ${s.ach[a.id] ? 'on' : 'off'}"><span class="ach-ic">${icon('medal', 28)}</span><b>${a.title}</b><small>${a.desc}</small></div>`).join('')}</div>`;
}

function subjectBars() {
  return `<div class="subj-bars">${C.course(YEAR()).subjects.map((sb) => {
    const p = C.subjectProgress(YEAR(), sb.id);
    return `<button class="subj-bar c-${sb.color}" data-a="go-subj" data-v="${sb.id}"><span class="sic">${subjGlyph(sb, 22)}</span>
      <div class="grow"><div class="sb-top"><b>${sb.full}</b><small>${p.done}/${p.total} passos</small></div>
      <div class="bar"><i style="width:${p.max ? (p.stars / p.max) * 100 : 0}%"></i></div></div></button>`;
  }).join('')}</div>`;
}

const stat = (ic, color, val, label) => `<div class="stat"><span class="sic c-${color}">${icon(ic, 22)}</span><div><b>${val}</b><small>${label}</small></div></div>`;

function barChart(days, valOf, max, labelOf) {
  const k = E.dayKey();
  return `<div class="chart">${days.map((d) => `<div class="col ${d.key === k ? 'today' : ''}"><em>${valOf(d) || ''}</em><i style="height:${(valOf(d) / max) * 100}%"></i><span>${labelOf(d)}</span></div>`).join('')}</div>`;
}

function masteryGrid(op) {
  const pre = { add: 'a', sub: 't', mul: 'm', div: 'd' }[op];
  const ks = E.tableKs(op);
  const head = `<div class="h">${E.SYM[op]}</div>` + ks.map((k) => `<div class="h">${k}</div>`).join('');
  let rows = '';
  for (let a = 1; a <= 9; a++) {
    rows += `<div class="h">${a}</div>`;
    for (const k of ks) {
      const key = `${pre}:${a}:${k}`;
      const label = op === 'add' || op === 'sub' ? a + k : a * k;
      rows += `<button class="cell m${E.mastery(key)}" data-a="fact" data-v="${key}">${label}</button>`;
    }
  }
  const hint = {
    add: 'Linha = número, coluna = quanto somou. O número é o resultado.',
    sub: 'Linha = quanto tirou, coluna = resultado. O número é de onde tirou.',
    mul: 'Linha = tabuada, coluna = vezes. O número é o resultado.',
    div: 'Linha = dividir por, coluna = resultado. O número é o que foi dividido.',
  }[op];
  return `<div class="mgrid">${head}${rows}</div>
  <div class="legend"><span><i></i>Não praticou</span><span><i class="m1"></i>Precisa treinar</span><span><i class="m2"></i>Aprendendo</span><span><i class="m3"></i>Dominado</span></div>
  <p class="muted small">${hint} Toque num quadrado para ver detalhes.</p>`;
}

const gridPicker = () => `<div class="seg wrap">${OPS.map((op) => `<button class="${ui.gridOp === op ? 'on' : ''}" data-a="grid-op" data-v="${op}">${OP_SHORT[op]} ${OP_NAME[op]}</button>`).join('')}</div>`;

// ---------- Pais ----------
function renderParents() {
  const s = S();
  if (!s.settings.pin || !ui.parentOk) {
    if (!s.settings.pin && ui.pinStep !== 'confirm') ui.pinStep = 'new';
    if (s.settings.pin) ui.pinStep = 'enter';
    const title = { new: 'Crie um PIN de 4 números', confirm: 'Repita o PIN', enter: 'Área dos pais' }[ui.pinStep];
    const sub = { new: 'Primeiro acesso: escolha 4 números que só o adulto saiba. Ele protege a área dos pais.', confirm: 'Digite o mesmo PIN de novo para confirmar.', enter: 'Digite o PIN que você criou no primeiro acesso.' }[ui.pinStep];
    return `<div class="pin-box">
      <div class="big-badge c-blue">${icon('lock', 48)}</div><h1 class="page-title">${title}</h1><p class="muted">${sub}</p>
      <div class="pin-dots">${[0, 1, 2, 3].map((i) => `<i class="${ui.pin.length > i ? 'on' : ''}"></i>`).join('')}</div>
      ${keypadHtml('pin')}
      ${ui.pinStep === 'enter' ? '<button class="btn ghost" data-a="pin-forgot">Esqueci o PIN</button>' : ''}
    </div>`;
  }
  return parentReport();
}

function parentReport() {
  const s = S();
  const t = E.totals();
  const last = s.log[0];
  const days14 = E.lastDays(14);
  const max14 = Math.max(10, ...days14.map((d) => d.q));
  const studied = days14.filter((d) => d.q > 0).length;
  const ms14 = days14.reduce((a, d) => a + d.ms, 0);
  const opStars = (op) => {
    const nodes = E.UNITS.filter((u) => u.op === op).flatMap((u) => u.nodes);
    return `${nodes.reduce((a, n) => a + E.stars(n.id), 0)}/${nodes.length * 3}`;
  };
  const weak = E.weakFacts(10);
  const accPill = (acc, n) => (n ? `<span class="pill ${acc >= 0.8 ? 'g' : acc >= 0.5 ? 'y' : 'r'}">${pct(acc)}</span>` : '<span class="pill n">—</span>');
  return `<div class="report-head"><div class="avatar lg">${initial()}</div><div class="grow"><h2>${esc(s.profile.name)}</h2>
    <span class="muted">${last ? `Último acesso: ${fmtDate(last.ts)}` : 'Ainda não fez nenhuma atividade'}</span></div>
    <div class="head-btns"><button class="btn blue sm" data-a="print-report">${icon('printer', 20)} PDF</button><button class="btn white sm" data-a="share">${icon('share', 20)} Texto</button></div></div>
  <h2 class="section-title">Resumo</h2>
  <div class="stats-grid wide">
    ${stat('flame', 'orange', `${E.streak()} <small>(rec. ${s.best.streak})</small>`, 'dias seguidos')}
    ${stat('clock', 'blue', fmtDur(t.ms), 'tempo estudado')}
    ${stat('pencil', 'purple', t.q, 'contas respondidas')}
    ${stat('target', 'red', pct(t.q ? t.c / t.q : null), 'de acerto')}
    ${stat('book', 'green', t.l, 'atividades feitas')}
    ${stat('star', 'yellow', `${E.totalStars()}/${E.ALL_NODES.length * 3}`, 'estrelas')}
  </div>
  <h2 class="section-title">Matérias do ${YEAR()}º ano</h2>
  ${subjectBars()}
  <h2 class="section-title">Habilidades da BNCC (${YEAR()}º ano)</h2>
  ${skillsHtml(YEAR())}
  <div class="two-col">
    <div>
      <h2 class="section-title">Matemática por operação</h2>
      <div class="box"><table class="table">
        <tr><th>Operação</th><th class="r">Contas</th><th class="r">Acerto</th><th class="r">Tempo</th><th class="r">Estrelas</th></tr>
        ${OPS.map((op) => { const o = E.opStats(op); return `<tr><td>${OP_NAME[op]}</td><td class="r">${o.total}</td><td class="r">${accPill(o.acc, o.total)}</td><td class="r">${o.avgMs ? `${(o.avgMs / 1000).toFixed(1)}s` : '—'}</td><td class="r">${opStars(op)}</td></tr>`; }).join('')}
      </table></div>
    </div>
    <div>
      <h2 class="section-title">Últimos 14 dias</h2>
      ${barChart(days14, (d) => d.q, max14, (d) => d.date.getDate())}
      <p class="muted small">Contas por dia · estudou ${studied} de 14 dias · ${fmtDur(ms14)} no período</p>
    </div>
  </div>
  <h2 class="section-title">Pontos de atenção</h2>
  <div class="box">${weak.length ? `<table class="table"><tr><th>Conta</th><th class="r">Erros</th><th class="r">Acerto</th></tr>${weak.map((w) => `<tr><td><b>${esc(w.label)}</b></td><td class="r">${w.w} de ${w.c + w.w}</td><td class="r">${accPill(1 - w.rate, 1)}</td></tr>`).join('')}</table>` : '<p class="muted">Nenhum erro registrado ainda.</p>'}</div>
  <h2 class="section-title">Mapa de domínio</h2>
  ${gridPicker()}
  ${masteryGrid(ui.gridOp)}
  <div class="two-col">
    <div>
      <h2 class="section-title">Testes de progresso</h2>
      <div class="box">${s.tests.length ? `<table class="table"><tr><th>Quando</th><th>Op.</th><th class="r">Nota</th><th>Tabuadas 1 a 9</th></tr>
        ${s.tests.slice(0, 12).map((x) => `<tr><td>${fmtDate(x.ts)}</td><td>${OP_SHORT[x.op]}</td><td class="r"><b>${x.score}/${x.total}</b></td><td><span class="test-dots">${x.per.map((c, i) => `<i class="t${c}" title="${esc(E.testGroupLabel(x.op, i + 1))}: ${c}/2">${i + 1}</i>`).join('')}</span></td></tr>`).join('')}</table>
        <div class="legend"><span><i class="m3"></i>2 de 2</span><span><i class="m2"></i>1 de 2</span><span><i class="m1"></i>0 de 2</span></div>` : '<p class="muted">Nenhum teste feito ainda. Fica em Desafios, Teste de progresso.</p>'}</div>
      <h2 class="section-title">Contas maiores de subtração</h2>
      <div class="box"><table class="table"><tr><th>Nível</th><th class="r">Contas</th><th class="r">Acerto</th></tr>
        ${E.SUB_LEVELS.map((l, i) => { const f = s.facts[`s:${i + 1}`]; const n = f ? f.c + f.w : 0; return `<tr><td>${i + 1}. ${l.title}</td><td class="r">${n}</td><td class="r">${accPill(n ? f.c / n : 0, n)}</td></tr>`; }).join('')}
      </table></div>
    </div>
    <div>
      <h2 class="section-title">Histórico</h2>
      <div class="box">${s.log.length ? `<table class="table"><tr><th>Quando</th><th>Atividade</th><th class="r">Nota</th><th class="r">Tempo</th></tr>
        ${s.log.slice(0, 20).map((l) => `<tr><td>${fmtDate(l.ts)}</td><td>${esc(l.title)}</td><td class="r">${l.total ? `${l.score}/${l.total}` : l.score}</td><td class="r">${fmtTime(l.ms)}</td></tr>`).join('')}</table>` : '<p class="muted">Sem atividades ainda.</p>'}</div>
    </div>
  </div>
  <div class="two-col">
    <div>
      <h2 class="section-title">Configurações</h2>
      <div class="box">
        <div class="setting"><div class="grow"><label for="nameInput">Nome da criança</label><input class="text-input" id="nameInput" maxlength="20" value="${esc(s.profile.name)}"></div></div>
        <div class="setting col"><label>Ano escolar<small>Monta a trilha com as matérias desse ano</small></label>
          <div class="year-pick">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) => `<button class="${YEAR() === y ? 'on' : ''}" data-a="set-year" data-v="${y}">${y}º</button>`).join('')}</div></div>
        <div class="setting"><label>Meta diária<small>XP por dia</small></label><div class="seg">${[10, 20, 30, 50].map((g) => `<button class="${s.settings.goal === g ? 'on' : ''}" data-a="goal" data-v="${g}">${g}</button>`).join('')}</div></div>
        <div class="setting"><label>Sons e voz</label><button class="switch ${s.settings.sound ? 'on' : ''}" data-a="toggle" data-v="sound" aria-label="Sons"></button></div>
        <div class="setting"><label>Liberar todas as lições<small>Para pular o que a criança já sabe</small></label><button class="switch ${s.settings.unlockAll ? 'on' : ''}" data-a="toggle" data-v="unlockAll" aria-label="Liberar todas"></button></div>
      </div>
    </div>
    <div>
      <h2 class="section-title">Backup</h2>
      <p class="muted small" style="margin-bottom:10px">O progresso fica salvo só neste aparelho. Faça backup para não perder ou para passar para outro aparelho.</p>
      <div class="btn-col">
        <button class="btn white" data-a="export">${icon('download', 20)} Exportar backup</button>
        <button class="btn white" data-a="import">${icon('upload', 20)} Importar backup</button>
        <button class="btn white" data-a="pin-change">${icon('key', 20)} Trocar PIN</button>
        <button class="btn red" data-a="reset">${icon('trash', 20)} Zerar progresso</button>
        <button class="btn ghost" data-a="parent-lock">${icon('lock', 20)} Sair da área dos pais</button>
      </div>
    </div>
  </div>
  <input type="file" id="importFile" accept="application/json,.json" hidden>`;
}

const SKILL_LABEL = ['Não iniciada', 'Estudando', 'Aprendida'];
function skillsHtml(year) {
  const status = C.skillStatus(year);
  return `<div class="skills-acc">${C.course(year).subjects.map((sb) => {
    const codes = [...new Set(sb.nodes.flatMap((n) => n.skills || []))];
    if (!codes.length) return '';
    const learned = codes.filter((c) => status[c] === 2).length;
    return `<details class="box"><summary><span class="sic c-${sb.color}">${subjGlyph(sb, 20)}</span><b>${sb.full}</b><span class="muted">${learned}/${codes.length} aprendidas</span></summary>
      <table class="table">${codes.map((code) => { const st = status[code] || 0; const k = S().skills[code];
        return `<tr><td><b>${code}</b><br><small class="muted">${esc(C.skillByCode(code)?.text || '')}</small></td><td class="r"><span class="pill ${['n', 'y', 'g'][st]}">${SKILL_LABEL[st]}</span>${k ? `<br><small class="muted">${k.c}/${k.c + k.w} certas</small>` : ''}</td></tr>`; }).join('')}</table></details>`;
  }).join('')}</div>`;
}

// Relatório completo para imprimir ou salvar em PDF
function printReport() {
  const s = S();
  const year = YEAR();
  const t = E.totals();
  const status = C.skillStatus(year);
  const crs = C.course(year);
  const subjRows = crs.subjects.map((sb) => {
    const p = C.subjectProgress(year, sb.id);
    const codes = [...new Set(sb.nodes.flatMap((n) => n.skills || []))];
    return `<tr><td>${sb.full}</td><td class="r">${p.done}/${p.total}</td><td class="r">${p.stars}/${p.max}</td><td class="r">${codes.filter((c) => status[c] === 2).length}/${codes.length}</td></tr>`;
  }).join('');
  const skillRows = crs.subjects.map((sb) => {
    const codes = [...new Set(sb.nodes.flatMap((n) => n.skills || []))];
    if (!codes.length) return '';
    return `<h3>${sb.full}</h3><table class="table">${codes.map((code) => `<tr><td><b>${code}</b> ${esc(C.skillByCode(code)?.text || '')}</td><td class="r nowrap">${SKILL_LABEL[status[code] || 0]}</td></tr>`).join('')}</table>`;
  }).join('');
  $ov.innerHTML = `<div class="screen report-screen"><div class="inner">
    <div class="lesson-top no-print"><button class="icon-btn" data-a="study-close" aria-label="Fechar">${icon('x', 26)}</button><span class="grow"></span>
      <button class="btn sm" data-a="do-print">${icon('printer', 20)} Imprimir / Salvar PDF</button></div>
    <div class="report-doc">
      <h1>Relatório de estudos — ${esc(s.profile.name)}</h1>
      <p class="muted">${year}º ano · Ensino Fundamental · referência BNCC e rede municipal de Joinville · gerado em ${new Date().toLocaleString('pt-BR')}</p>
      <h2>Resumo</h2>
      <table class="table"><tr><td>Dias seguidos (recorde)</td><td class="r">${E.streak()} (${s.best.streak})</td></tr>
        <tr><td>Tempo estudado</td><td class="r">${fmtDur(t.ms)}</td></tr>
        <tr><td>Perguntas respondidas</td><td class="r">${t.q} (${pct(t.q ? t.c / t.q : null)} de acerto)</td></tr>
        <tr><td>Atividades feitas</td><td class="r">${t.l}</td></tr>
        <tr><td>XP total</td><td class="r">${s.xp}</td></tr></table>
      <h2>Por matéria</h2>
      <table class="table"><tr><th>Matéria</th><th class="r">Passos</th><th class="r">Estrelas</th><th class="r">Habilidades aprendidas</th></tr>${subjRows}</table>
      <h2>Contas que mais erra</h2>
      ${E.weakFacts(10).length ? `<table class="table">${E.weakFacts(10).map((w) => `<tr><td>${esc(w.label)}</td><td class="r">${w.w} erro(s) em ${w.c + w.w}</td></tr>`).join('')}</table>` : '<p>Nenhum erro registrado.</p>'}
      <h2>Habilidades da BNCC</h2>
      ${skillRows}
      <h2>Últimas atividades</h2>
      <table class="table">${s.log.slice(0, 25).map((l) => `<tr><td>${fmtDate(l.ts)}</td><td>${esc(l.title)}</td><td class="r">${l.total ? `${l.score}/${l.total}` : l.score}</td></tr>`).join('')}</table>
    </div>
  </div></div>`;
  document.body.classList.add('lock');
}

function reportText() {
  const s = S();
  const t = E.totals();
  const w7 = E.lastDays(7);
  const op = (o) => { const x = E.opStats(o); return `- ${OP_NAME[o]}: ${x.total ? `${pct(x.acc)} de acerto em ${x.total} contas` : 'ainda não praticou'}`; };
  let dominated = 0;
  for (let a = 1; a <= 9; a++) for (let b = 1; b <= 10; b++) if (E.mastery(`m:${a}:${b}`) === 3) dominated++;
  const weak = E.weakFacts(6).map((w) => w.label);
  const tests = OPS.map((o) => s.tests.find((x) => x.op === o)).filter(Boolean);
  return [
    `Relatório de ${s.profile.name} - Estuda Criança (${YEAR()}º ano)`,
    `Data: ${new Date().toLocaleDateString('pt-BR')}`,
    '',
    `Sequência: ${E.streak()} dia(s) seguidos (recorde ${s.best.streak})`,
    `Estudou ${w7.filter((d) => d.q > 0).length} dos últimos 7 dias (${fmtDur(w7.reduce((a, d) => a + d.ms, 0))})`,
    `Tempo total: ${fmtDur(t.ms)}`,
    `Contas respondidas: ${t.q} (${pct(t.q ? t.c / t.q : null)} de acerto)`,
    `Estrelas: ${E.totalStars()}/${E.ALL_NODES.length * 3}`,
    '',
    ...OPS.map(op),
    `Domina ${dominated} de 90 contas da tabuada de vezes`,
    ...tests.map((x) => `Último teste de ${OP_NAME[x.op].toLowerCase()}: ${x.score}/${x.total} (${new Date(x.ts).toLocaleDateString('pt-BR')})`),
    weak.length ? `Precisa treinar: ${weak.join('; ')}` : 'Nenhum erro registrado',
  ].join('\n');
}

function shareReport() {
  const text = reportText();
  showModal(`<h2>Relatório</h2>
    <pre class="report-pre">${esc(text)}</pre>
    ${navigator.share ? `<button class="btn blue" data-a="share-native">${icon('share', 20)} Compartilhar</button>` : ''}
    <a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(text)}">Enviar no WhatsApp</a>
    <button class="btn white" data-a="share-copy">${icon('copy', 20)} Copiar texto</button>
    <button class="btn ghost" data-a="modal-close">Fechar</button>`);
}

// ---------- Teclado numérico ----------
function keypadHtml(ctx) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'];
  return `<div class="keypad">${keys.map((k) => {
    if (k === 'del') return `<button class="del" data-a="${ctx}-key" data-v="del" aria-label="Apagar">${icon('backspace', 26)}</button>`;
    if (k === 'ok') return ctx === 'pin' ? '<span></span>' : `<button class="ok" data-a="check" aria-label="Verificar">${icon('check', 28)}</button>`;
    return `<button data-a="${ctx}-key" data-v="${k}">${k}</button>`;
  }).join('')}</div>`;
}

function pinKey(k) {
  if (k === 'del') ui.pin = ui.pin.slice(0, -1);
  else if (ui.pin.length < 4) ui.pin += k;
  sfx.tap();
  if (ui.pin.length === 4) {
    const p = ui.pin;
    ui.pin = '';
    if (ui.pinStep === 'new') { ui.pinFirst = p; ui.pinStep = 'confirm'; }
    else if (ui.pinStep === 'confirm') {
      if (p === ui.pinFirst) { S().settings.pin = p; E.save(); ui.parentOk = true; ui.pinStep = null; toast('PIN criado'); }
      else { ui.pinStep = 'new'; toast('Os PINs não batem. Tente de novo.'); vibrate(); }
    } else if (ui.pinStep === 'enter') {
      if (p === S().settings.pin) { ui.parentOk = true; ui.pinStep = null; }
      else { toast('PIN errado'); vibrate(); sfx.wrong(); }
    }
  }
  render();
}

function forgotPin() {
  const a = E.ri(12, 49), b = E.ri(12, 29);
  showModal(`<h2>Esqueci o PIN</h2><p>Para provar que é um adulto, resolva:</p>
    <div class="expr-big">${a} × ${b} = ?</div>
    <input class="text-input" id="forgotInput" inputmode="numeric" autocomplete="off">
    <button class="btn" data-a="forgot-check" data-v="${a * b}">Confirmar</button>
    <button class="btn ghost" data-a="modal-close">Cancelar</button>`);
}

// ---------- Sessões (lição / desafio) ----------
function startSession(cfg) {
  closeModal();
  ui.pop = null;
  studyNode = null;
  session = {
    ...cfg,
    queue: cfg.questions ? cfg.questions.slice() : [],
    total: cfg.questions ? cfg.questions.length : 0,
    done: 0, firstRight: 0, answered: 0, score: 0, combo: 0,
    activeMs: 0, start: Date.now(), phase: 'ask', sel: null, input: '', q: null, lastText: '',
  };
  document.body.classList.add('lock');
  nextQuestion();
  if (cfg.timeLimit) session.timer = setInterval(tickTimer, 200);
}

function nextQuestion() {
  const s = session;
  if (s.gen) {
    let q;
    let tries = 0;
    do { q = s.gen(s.score); } while (q.text === s.lastText && tries++ < 5);
    s.q = q;
  } else {
    if (!s.queue.length) return endSession();
    s.q = s.queue[0];
  }
  s.lastText = s.q.text;
  s.phase = 'ask';
  s.sel = null;
  s.input = '';
  s.qStart = Date.now();
  renderSession();
}

function tickTimer() {
  const s = session;
  if (!s || s.ended) return;
  const left = s.timeLimit - (Date.now() - s.start);
  const el = document.querySelector('#timer span');
  if (el) {
    el.textContent = Math.max(0, Math.ceil(left / 1000));
    el.parentElement.classList.toggle('low', left < 10000);
  }
  const fill = document.querySelector('.progress .fill');
  if (fill) fill.style.width = `${Math.max(0, left / s.timeLimit) * 100}%`;
  if (left <= 0) { clearInterval(s.timer); endSession(); }
}

function renderSession() {
  const s = session;
  const q = s.q;
  let progress;
  if (s.timeLimit) progress = Math.max(0, 1 - (Date.now() - s.start) / s.timeLimit);
  else if (s.gen) progress = Math.min(1, (s.score % 10) / 10);
  else progress = s.done / s.total;
  const right = s.timeLimit
    ? `<div class="timer" id="timer">${icon('clock', 20)}<span>${Math.ceil((s.timeLimit - (Date.now() - s.start)) / 1000)}</span></div>`
    : s.hearts != null ? `<div class="hearts">${[0, 1, 2].map((i) => `<span class="${i < s.hearts ? 'on' : ''}">${icon('heart', 22)}</span>`).join('')}</div>` : '';
  const badges = [
    s.gen ? `<span class="tag blue">Pontos: ${s.score}</span>` : '',
    s.combo >= 3 ? `<span class="tag orange">${icon('flame', 16)} ${s.combo} seguidas</span>` : '',
  ].join('');
  $ov.innerHTML = `<div class="screen"><div class="inner">
    <div class="lesson-top">
      <button class="icon-btn" data-a="quit" aria-label="Sair">${icon('x', 26)}</button>
      <div class="progress"><div class="fill ${s.timeLimit ? 'timed' : ''}" style="width:${progress * 100}%"></div></div>
      ${right}
    </div>
    <div class="lesson-body">
      ${badges ? `<div class="badges">${badges}</div>` : ''}
      <div class="q-row"><h2 class="q-title">${q.title}</h2>${s.help && q.op && s.phase === 'ask' ? `<button class="help-btn" data-a="help">${icon('bulb', 20)} Ajuda</button>` : ''}</div>
      ${questionCard(q)}
      ${answerArea(q)}
    </div>
    ${s.instant ? '' : sessionFoot()}
  </div></div>`;
}

function questionCard(q) {
  const textual = q.kind === 'story' || q.kind === 'visual';
  const content = textual ? `<p class="story">${esc(q.text)}</p>`
    : `<div class="expr-big">${esc(q.text).replace('?', '<span class="qm">?</span>')}</div>`;
  return `${q.passage ? `<div class="passage">${esc(q.passage)}</div>` : ''}<div class="q-card">${content}</div>${q.kind === 'visual' ? dotsHtml(q.visual) : ''}`;
}

function answerArea(q) {
  const s = session;
  const fb = s.phase === 'feedback';
  if (q.mode === 'keypad') {
    const cls = fb ? (s.lastOk ? 'right' : 'wrong') : s.input ? '' : 'empty';
    return `<div class="answer-zone"><div class="answer-box ${cls}">${s.input || '?'}</div>${fb ? '' : keypadHtml('ans')}</div>`;
  }
  const opts = q.mode === 'tf' ? [[true, 'Verdadeiro'], [false, 'Falso']] : q.options.map((o) => [o, String(o)]);
  const long = opts.some(([, label]) => label.length > 7);
  return `<div class="choices ${q.mode === 'tf' ? 'tf' : ''} ${long ? 'text-opts' : ''}">${opts.map(([v, label], i) => {
    let cls = '';
    if (fb) {
      if (v === q.answer) cls = 'right';
      else if (i === s.sel) cls = 'wrong';
    } else if (i === s.sel) cls = 'sel';
    return `<button class="option ${cls}" data-a="opt" data-v="${i}" ${fb ? 'disabled' : ''}><kbd>${i + 1}</kbd>${label}</button>`;
  }).join('')}</div>`;
}

function sessionFoot() {
  const s = session;
  if (s.phase === 'feedback') {
    const ok = s.lastOk;
    return `<div class="sheet ${ok ? 'ok' : 'bad'}"><div class="sheet-in">
      <div class="head"><div class="badge">${icon(ok ? 'check' : 'x', 32)}</div><div>
        <h3>${ok ? s.praise : 'Resposta certa:'}</h3>
        ${ok ? (s.combo >= 3 ? `<p>${s.combo} seguidas!</p>` : '') : `<p><b>${esc(s.q.solution)}</b></p>`}
      </div></div>
      <button class="btn ${ok ? '' : 'red'}" data-a="continue">Continuar</button>
    </div></div>`;
  }
  const ready = s.q.mode === 'keypad' ? s.input !== '' : s.sel != null;
  return `<div class="lesson-foot"><button class="btn" data-a="check" ${ready ? '' : 'disabled'}>Verificar</button></div>`;
}

function showHelp() {
  const s = session;
  if (!s || s.phase !== 'ask' || !s.help || !s.q.op) return;
  const h = E.hintFor(s.q);
  s.q._helped = true;
  sfx.tap();
  showModal(`<div class="big-badge c-yellow sm">${icon('bulb', 36)}</div>
    <h2>${esc(h.title)}</h2>
    <div class="help-lines">${h.lines.map((l) => `<div>${h.html && l.startsWith('<pre') ? l : esc(l)}</div>`).join('')}</div>
    <button class="btn" data-a="modal-close">Entendi</button>`);
}

function answerValue() {
  const s = session;
  const q = s.q;
  if (q.mode === 'keypad') return s.input === '' ? null : Number(s.input);
  if (s.sel == null) return null;
  return q.mode === 'tf' ? [true, false][s.sel] : q.options[s.sel];
}

function check() {
  const s = session;
  if (!s || s.phase !== 'ask') return;
  const v = answerValue();
  if (v == null) return;
  const q = s.q;
  const ok = v === q.answer;
  const ms = Date.now() - s.qStart;
  s.activeMs += Math.min(ms, 60000);
  if (q.key) E.recordAnswer(q, ok, ms); else E.recordSkill(q.skill, ok);
  s.lastOk = ok;
  s.answered++;
  if (ok) {
    s.combo++; s.score++;
    if (!q._tried) s.firstRight++;
    sfx.correct();
    s.praise = q._helped ? 'Certo! Com ajuda também vale.' : PRAISE[Math.floor(Math.random() * PRAISE.length)];
  } else {
    s.combo = 0;
    sfx.wrong();
    vibrate(120);
  }
  if (!s.gen) {
    s.queue.shift();
    if (ok || !s.retry || q._tried) s.done++;
    else s.queue.push({ ...q, _tried: true, _helped: false, options: q.options ? E.shuffle(q.options) : undefined });
    q._tried = true;
  }
  if (!ok && s.hearts != null) s.hearts--;
  if (q.group) { s.groups ||= {}; s.groups[q.group] = (s.groups[q.group] || 0) + (ok ? 1 : 0); }
  s.phase = 'feedback';
  renderSession();
  if (s.instant) {
    setTimeout(() => {
      if (session !== s || s.ended) return;
      if (s.hearts === 0) endSession(); else nextQuestion();
    }, ok ? 450 : 1300);
  }
}

function endSession() {
  const s = session;
  if (!s || s.ended) return;
  s.ended = true;
  clearInterval(s.timer);
  const st = S();
  const total = s.gen ? s.answered : s.total;
  const correct = s.gen ? s.score : s.firstRight;
  const perfect = !s.gen && s.firstRight === s.total;
  let xp = 10;
  let headline = 'Lição completa!';
  let sub = `Você acertou ${correct} de ${total} de primeira`;
  let extra = '';
  const record = '<p class="record">Novo recorde!</p>';
  if (s.kind === 'lesson') {
    const node = resolveNode(s.nodeId);
    xp = (node?.review ? 15 : 10) + (perfect ? 5 : 0);
    if (perfect) sub = 'Sem nenhum erro! +5 XP de bônus';
  }
  if (s.kind === 'surprise') headline = 'Revisão concluída!';
  if (s.kind === 'errors') { headline = 'Treino concluído!'; sub = 'Treinar os erros deixa você mais forte.'; }
  if (s.kind === 'daily') { xp = 20; headline = 'Desafio do dia feito!'; st.daily[E.dayKey()] = correct; }
  if (s.kind === 'test') {
    xp = 15;
    headline = 'Boletim pronto!';
    sub = `Você acertou ${correct} de ${total} em ${OP_NAME[s.op].toLowerCase()}`;
    const per = Array.from({ length: 9 }, (_, i) => s.groups?.[i + 1] || 0);
    st.tests.unshift({ ts: Date.now(), op: s.op, per, score: correct, total });
    st.tests = st.tests.slice(0, 50);
    const train = per.map((c, i) => [c, i + 1]).filter(([c]) => c < 2);
    extra = `<div class="boletim">${per.map((c, i) => `<div class="b-row"><span>${esc(E.testGroupLabel(s.op, i + 1))}</span><span>${'<i class="mark ok"></i>'.repeat(c)}${'<i class="mark no"></i>'.repeat(2 - c)}</span></div>`).join('')}</div>
      <p class="big-p">${train.length ? `Para treinar: <b>${train.map(([, n]) => `tabuada do ${n}`).join(', ')}</b>` : 'Acertou tudo! Parabéns!'}</p>`;
  }
  if (s.kind === 'quiz') {
    xp = s.n === 'all' ? 15 : 10;
    headline = correct === total ? 'Acertou tudo!' : 'Desafio concluído!';
    sub = `${s.title}: ${correct} de ${total}`;
    if (E.saveRecord('quiz', s.op, s.n, correct) && correct > 0) extra = record;
    if (s.op === 'mul' && s.n === 'all') st.best.master = Math.max(st.best.master, correct);
  }
  if (s.kind === 'time') {
    xp = Math.min(30, Math.max(1, Math.round(correct / 2)));
    headline = 'Tempo esgotado!';
    sub = `${correct} certas em 1 minuto`;
    if (E.saveRecord('time', s.op, s.n, correct) && correct > 0) extra = record;
  }
  if (s.kind === 'survival') {
    xp = Math.min(30, Math.max(1, Math.round(correct / 2)));
    headline = 'Fim de jogo!';
    sub = `Você fez ${correct} pontos`;
    if (E.saveRecord('survival', s.op, s.n, correct) && correct > 0) extra = record;
  }
  const res = E.finishSession({ kind: s.kind, title: s.title, nodeId: s.kind === 'lesson' ? s.nodeId : null, correct, total, ms: s.activeMs, xp, perfect });
  sfx.complete();
  confetti();
  const acc = total ? Math.round((correct / total) * 100) : 0;
  const achHtml = res.newAch.map((a) => `<div class="note"><span class="sic c-yellow">${icon('medal', 22)}</span><div><b>Nova conquista: ${a.title}</b><small>${a.desc}</small></div></div>`).join('');
  const starsHtml = res.starsNow != null ? `<div class="result-stars">${[0, 1, 2].map((i) => `<span class="${i < res.starsNow ? 'on' : ''}">${icon('star', 40)}</span>`).join('')}</div>` : '';
  after = [];
  if (res.streakAfter > res.streakBefore) after.push(() => streakScreen(res.streakAfter));
  $ov.innerHTML = `<div class="screen"><div class="inner">
    <div class="result">
      ${starsHtml || `<div class="big-badge c-yellow">${icon('trophy', 56)}</div>`}
      <h1>${headline}</h1>
      <p class="muted big-p">${sub}</p>
      ${extra}
      <div class="stat-cards">
        <div class="stat-card"><small>XP ganho</small><b>${icon('bolt', 20)} ${xp}</b></div>
        <div class="stat-card green"><small>${s.gen ? 'Pontos' : 'Acerto'}</small><b>${icon('target', 20)} ${s.gen ? correct : `${acc}%`}</b></div>
        <div class="stat-card blue"><small>Tempo</small><b>${icon('clock', 20)} ${fmtTime(s.activeMs)}</b></div>
      </div>
      ${res.goalReachedNow ? `<div class="note"><span class="sic c-yellow">${icon('trophy', 22)}</span><div><b>Meta diária concluída!</b><small>Você bateu a meta de hoje.</small></div></div>` : ''}
      ${achHtml}
    </div>
    <div class="result-foot"><button class="btn" data-a="result-next">Continuar</button></div>
  </div></div>`;
  session = { ended: true, result: true };
}

function streakScreen(n) {
  const days = E.lastDays(7);
  $ov.innerHTML = `<div class="screen"><div class="inner">
    <div class="result">
      <div class="big-flame">${icon('flame', 110)}</div>
      <div class="big-num">${n}</div>
      <h1 class="orange">${n === 1 ? 'dia de sequência!' : 'dias seguidos!'}</h1>
      <div class="week">${days.map((d) => `<div><small>${WEEKDAY[d.date.getDay()]}</small><span class="${d.xp > 0 ? 'on' : ''}">${d.xp > 0 ? icon('flame', 18) : ''}</span></div>`).join('')}</div>
      <p class="muted big-p">Volte amanhã para manter a sequência!</p>
    </div>
    <div class="result-foot"><button class="btn orange" data-a="result-next">Continuar</button></div>
  </div></div>`;
  sfx.correct();
}

function closeSession() {
  if (session?.timer) clearInterval(session.timer);
  session = null;
  closeOverlay();
}

function quitSession() {
  if (!session || session.ended) return closeSession();
  showModal(`<h2>Quer mesmo sair?</h2><p>Se sair agora, vai perder o progresso desta atividade.</p>
    <button class="btn" data-a="modal-close">Continuar</button>
    <button class="btn ghost danger" data-a="quit-confirm">Sair</button>`);
}

// ---------- Primeiro acesso ----------
function renderOnboarding() {
  $app.innerHTML = '';
  $ov.innerHTML = `<div class="screen"><div class="inner">
    <div class="onb">
      <div class="logo">${[['blue', 'book'], ['green', 'pencil'], ['teal', 'flask'], ['purple', 'globe']].map(([c, ic]) => `<span class="c-${c}">${icon(ic, 30)}</span>`).join('')}</div>
      <h1>Estuda Criança</h1>
      <p class="muted big-p">Estudos do ensino fundamental, com o que se aprende nas escolas de Joinville.</p>
      <label class="field"><span>Qual é o seu nome?</span>
        <input class="text-input" id="onbName" maxlength="20" placeholder="Seu nome" value="${esc(ui.onbName)}" autocomplete="off"></label>
      <div class="field"><span>Em que ano você está?</span>
        <div class="year-pick">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) => `<button class="${ui.onbYear === y ? 'on' : ''}" data-a="onb-year" data-v="${y}">${y}º</button>`).join('')}</div></div>
      <div class="field"><span>Meta por dia</span>
        <div class="seg">${[[10, 'Leve'], [20, 'Normal'], [30, 'Puxada'], [50, 'Intensa']].map(([g, l]) => `<button class="${ui.onbGoal === g ? 'on' : ''}" data-a="onb-goal" data-v="${g}">${l}<small>${g} XP</small></button>`).join('')}</div></div>
    </div>
    <div class="result-foot"><button class="btn" data-a="onb-done" id="onbBtn" ${ui.onbName.trim() ? '' : 'disabled'}>Começar</button></div>
  </div></div>`;
  const inp = document.getElementById('onbName');
  inp.addEventListener('input', () => {
    ui.onbName = inp.value;
    document.getElementById('onbBtn').disabled = !inp.value.trim();
  });
}

// ---------- Modal / toast ----------
function showModal(html) {
  $modal.innerHTML = `<div class="modal-bg" data-a="modal-bg"><div class="modal" role="dialog">${html}</div></div>`;
}
function closeModal() { $modal.innerHTML = ''; stopSpeak(); }
let toastT;
function toast(msg) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  clearTimeout(toastT);
  toastT = setTimeout(() => el.remove(), 2600);
}

function factDetail(key) {
  const f = S().facts[key];
  const label = E.factLabel(key);
  if (!f) return toast(`${label}: ainda não praticou`);
  toast(`${label}: ${f.c} acerto(s), ${f.w} erro(s), ${(f.t / 1000).toFixed(1)}s em média`);
}

function exportBackup() {
  const blob = new Blob([E.exportData()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `estuda-crianca-backup-${(S().profile.name || 'crianca').toLowerCase().replace(/[^a-z0-9]+/gi, '-')}-${E.dayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function resultNext() {
  const f = after.shift();
  if (f) f(); else closeSession();
}

// ---------- Eventos ----------
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-a]');
  const a = el?.dataset.a;
  const v = el?.dataset.v;
  if (a === 'modal-bg' && ev.target !== el) return;
  if (ui.pop && !['node', 'start'].includes(a)) { ui.pop = null; if (!a) { render(); return; } }
  if (!a) return;
  switch (a) {
    case 'tab':
      stopSpeak(); ui.tab = v; ui.pop = null;
      if (v !== 'parents') { ui.parentOk = false; ui.pin = ''; }
      sfx.tap(); render(); scrollTo(0, 0); break;
    case 'node': ui.pop = ui.pop === v ? null : v; sfx.tap(); render(); break;
    case 'start': startNodeLesson(v); break;
    case 'study-go': lessonGo(studyNode.id); break;
    case 'study-walk': { const n = studyNode; startWalk(n.gen.op, n.gen.n, () => lessonGo(n.id)); break; }
    case 'check-mark': checkMark(Number(v)); break;
    case 'go-subj': ui.tab = 'learn'; ui.subj = v; ui.pop = null; sfx.tap(); render(); scrollTo(0, 0); break;
    case 'subj': ui.subj = v; ui.pop = null; closeModal(); sfx.tap(); render(); scrollTo(0, 0); break;
    case 'pick-subj': pickSubject(); break;
    case 'study-close': closeOverlay(); break;
    case 'table-op': ui.tableOp = v; sfx.tap(); render(); break;
    case 'table-open': openTable(Number(v)); break;
    case 'table-speak': toggleSpeak(E.tableRows(ui.tableOp, Number(v)).map(E.speakText)); break;
    case 'table-quiz': startTableChallenge(ui.tableOp, Number(v), 'quiz'); break;
    case 'speak-fact': if (walk) toggleSpeak(E.speakText(walk.rows[Number(v)])); break;
    case 'walk-start': startWalk(ui.tableOp, Number(v), null); break;
    case 'walk-next': walkNext(); break;
    case 'walk-prev': if (walk && walk.idx > 0) { stopSpeak(); walk.idx--; walk.shown = true; renderWalk(); } break;
    case 'walk-close': closeOverlay(); break;
    case 'walk-again': walk.idx = 0; walk.shown = false; renderWalk(); break;
    case 'walk-apply': walkApply(); break;
    case 'ch': startChallenge(v); break;
    case 'ch-op': ui.chOp = v; sfx.tap(); render(); break;
    case 'ch-n': ui.chN = v === 'all' ? 'all' : Number(v); sfx.tap(); render(); break;
    case 'ch-mode': ui.chMode = v; sfx.tap(); render(); break;
    case 'test-op': ui.testOp = v; sfx.tap(); render(); break;
    case 'grid-op': ui.gridOp = v; sfx.tap(); render(); break;
    case 'help': showHelp(); break;
    case 'opt':
      if (session?.phase === 'ask') {
        session.sel = Number(v);
        sfx.tap();
        if (session.instant) check(); else renderSession();
      }
      break;
    case 'ans-key':
      if (session?.phase === 'ask') {
        if (v === 'del') session.input = session.input.slice(0, -1);
        else if (session.input.length < 4) session.input = (session.input + v).replace(/^0+(?=\d)/, '');
        sfx.tap();
        renderSession();
      }
      break;
    case 'check': check(); break;
    case 'continue': nextQuestion(); break;
    case 'quit': quitSession(); break;
    case 'quit-confirm': closeModal(); closeSession(); break;
    case 'result-next': resultNext(); break;
    case 'modal-close': case 'modal-bg': closeModal(); break;
    case 'pin-key': pinKey(v); break;
    case 'pin-forgot': forgotPin(); break;
    case 'forgot-check': {
      const val = document.getElementById('forgotInput').value.trim();
      if (Number(val) === Number(v)) { S().settings.pin = null; E.save(); ui.pinStep = 'new'; closeModal(); toast('Crie um novo PIN'); render(); }
      else toast('Resposta errada');
      break;
    }
    case 'pin-change': S().settings.pin = null; E.save(); ui.parentOk = false; ui.pinStep = 'new'; render(); scrollTo(0, 0); break;
    case 'parent-lock': ui.parentOk = false; ui.tab = 'learn'; render(); break;
    case 'goal': S().settings.goal = Number(v); E.save(); render(); break;
    case 'toggle': S().settings[v] = !S().settings[v]; E.save(); render(); break;
    case 'share': shareReport(); break;
    case 'share-native': navigator.share({ title: 'Relatório - Estuda Criança', text: reportText() }).catch(() => {}); break;
    case 'share-copy': navigator.clipboard?.writeText(reportText()).then(() => toast('Relatório copiado'), () => toast('Não foi possível copiar')); break;
    case 'export': exportBackup(); break;
    case 'import': document.getElementById('importFile').click(); break;
    case 'reset':
      showModal(`<h2>Zerar todo o progresso?</h2><p>Estrelas, XP, sequência e histórico serão apagados. Isso não pode ser desfeito.</p>
        <button class="btn red" data-a="reset-confirm">Sim, zerar tudo</button><button class="btn ghost" data-a="modal-close">Cancelar</button>`);
      break;
    case 'reset-confirm': E.resetAll(true); closeModal(); toast('Progresso zerado'); render(); break;
    case 'fact': factDetail(v); break;
    case 'onb-goal': ui.onbGoal = Number(v); sfx.tap(); renderOnboarding(); break;
    case 'onb-year': ui.onbYear = Number(v); sfx.tap(); renderOnboarding(); break;
    case 'set-year': S().profile.year = Number(v); E.save(); ui.subj = 'all'; toast(`Trilha do ${v}º ano`); render(); break;
    case 'print-report': printReport(); break;
    case 'do-print': window.print(); break;
    case 'onb-done': {
      if (!ui.onbName.trim()) return;
      const st = S();
      st.profile.name = ui.onbName.trim().slice(0, 20);
      st.settings.goal = ui.onbGoal;
      st.profile.year = ui.onbYear;
      st.created = Date.now();
      E.save();
      $ov.innerHTML = '';
      sfx.complete();
      render();
      break;
    }
    default: break;
  }
});

document.addEventListener('change', (ev) => {
  if (ev.target.id === 'nameInput') {
    const name = ev.target.value.trim().slice(0, 20);
    if (name) { S().profile.name = name; E.save(); toast('Nome salvo'); render(); }
  }
  if (ev.target.id === 'importFile') {
    const file = ev.target.files[0];
    if (!file) return;
    file.text().then((txt) => {
      try { E.importData(JSON.parse(txt)); toast('Backup importado'); render(); } catch { toast('Arquivo de backup inválido'); }
    });
  }
});

document.addEventListener('keydown', (ev) => {
  if (ev.target.tagName === 'INPUT') {
    if (ev.key === 'Enter' && ev.target.id === 'onbName') document.getElementById('onbBtn')?.click();
    return;
  }
  if ($modal.innerHTML) { if (ev.key === 'Escape' || ev.key === 'Enter') closeModal(); return; }
  if (walk) {
    if (ev.key === 'Escape') closeOverlay();
    else if (walk.idx >= walk.rows.length) { if (ev.key === 'Enter') walkApply(); }
    else if (['Enter', 'ArrowRight', ' '].includes(ev.key)) { ev.preventDefault(); walkNext(); }
    else if (ev.key === 'ArrowLeft' && walk.idx > 0) { walk.idx--; walk.shown = true; renderWalk(); }
    return;
  }
  if (studyNode && !session) {
    if (ev.key === 'Enter') lessonGo(studyNode.id);
    if (ev.key === 'Escape') closeOverlay();
    return;
  }
  if (!session) return;
  if (session.result) { if (ev.key === 'Enter') resultNext(); return; }
  const s = session;
  if (ev.key === 'Escape') { quitSession(); return; }
  if (ev.key === 'Enter') { if (s.phase === 'feedback') { if (!s.instant) nextQuestion(); } else check(); return; }
  if (s.phase !== 'ask') return;
  if (s.q.mode === 'keypad') {
    if (/^\d$/.test(ev.key) && s.input.length < 4) { s.input = (s.input + ev.key).replace(/^0+(?=\d)/, ''); renderSession(); }
    if (ev.key === 'Backspace') { s.input = s.input.slice(0, -1); renderSession(); }
  } else {
    const n = Number(ev.key);
    const count = s.q.mode === 'tf' ? 2 : s.q.options.length;
    if (n >= 1 && n <= count) { s.sel = n - 1; if (s.instant) check(); else renderSession(); }
  }
});

// ---------- Inicialização ----------
if (!S().profile.year) S().profile.year = 3;
C.loadBncc().then(render);
if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
