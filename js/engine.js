// Motor do app: conteúdo, gerador de questões, progresso e conquistas.

// ---------- Utilidades ----------
let R = Math.random;
export const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
const pick = (arr) => arr[Math.floor(R() * arr.length)];
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function weightedPick(items, weightOf) {
  const ws = items.map(weightOf);
  let t = R() * ws.reduce((s, w) => s + w, 0);
  for (let i = 0; i < items.length; i++) {
    t -= ws[i];
    if (t <= 0) return items[i];
  }
  return items[items.length - 1];
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(s) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}
export function withSeed(seedStr, fn) {
  const prev = R;
  R = mulberry32(hashStr(seedStr));
  try { return fn(); } finally { R = prev; }
}
export function dayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
const pl = (n, s, p) => `${n} ${n === 1 ? s : p}`;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export const SYM = { add: '+', mul: '×', div: '÷', sub: '−' };

// ---------- Conteúdo ----------
const ADD_TIPS = {
  1: 'Somar 1 é só pular para o próximo número! 7 + 1 = 8.',
  2: 'Pule de 2 em 2, como um sapinho: 6 + 2 → 7, 8.',
  3: 'Comece no número maior e conte 3 dedinhos para frente.',
  4: 'Conte 4 para frente a partir do maior. Ou complete o 10: 8 + 4 = 8 + 2 + 2 = 12.',
  5: 'Uma mão inteira! Somar 5 é contar uma mão cheia de dedos.',
  6: 'Complete o 10: 7 + 6 = 7 + 3 + 3 = 13.',
  7: 'Complete o 10: 8 + 7 = 8 + 2 + 5 = 15.',
  8: 'Somar 8 é somar 10 e tirar 2: 6 + 8 = 16 − 2 = 14.',
  9: 'Somar 9 é somar 10 e tirar 1: 7 + 9 = 17 − 1 = 16.',
};

const MUL_TIPS = {
  1: 'Todo número vezes 1 é ele mesmo! 1 × 7 = 7.',
  2: 'É o dobro! 2 × 7 é o mesmo que 7 + 7.',
  3: 'Some três vezes: 3 × 4 = 4 + 4 + 4 = 12.',
  4: 'É o dobro do dobro! 4 × 6: o dobro de 6 é 12, o dobro de 12 é 24.',
  5: 'Os resultados sempre terminam em 0 ou 5. Conte de 5 em 5!',
  6: 'Faça a tabuada do 3 e dobre: 6 × 4 = dobro de 12 = 24.',
  7: 'Você já sabe muitas! 7 × 3 = 3 × 7. Só faltam poucas novas.',
  8: 'É o dobro da tabuada do 4: 8 × 3 = dobro de 12 = 24.',
  9: 'Truque: a soma dos algarismos do resultado dá 9! 9 × 4 = 36 → 3 + 6 = 9.',
};

export const SUB_LEVELS = [
  { title: 'Subtração até 10', tip: 'Conte para trás! 9 − 3: 8, 7, 6. Resposta 6.' },
  { title: 'Subtração até 20', tip: 'Tire primeiro até chegar no 10: 15 − 7 = 15 − 5 − 2 = 8.' },
  { title: 'Dezenas exatas', tip: 'Pense sem o zero: 70 − 30 é como 7 − 3 = 4, então 40.' },
  { title: 'Dois algarismos', tip: 'Arme a conta: unidades com unidades, dezenas com dezenas. 58 − 23 = 35.' },
  { title: 'Com empréstimo', tip: 'Se em cima é menor, peça 1 dezena emprestada ao vizinho: ela vale 10 unidades! 52 − 27: 12 − 7 = 5 e 4 − 2 = 2 → 25.' },
  { title: 'Centenas exatas', tip: 'Pense sem os zeros: 700 − 300 é como 7 − 3 = 4, então 400.' },
  { title: 'Três algarismos', tip: 'Arme a conta e comece pelas unidades: 586 − 243 = 343.' },
  { title: 'Três algarismos com empréstimo', tip: 'Empreste do vizinho quando precisar: 432 − 175 = 257.' },
  { title: 'Subtração misturada', tip: 'Um pouco de tudo! Leia com calma e arme a conta.' },
];

const SUBT_TIP = (n) => `Tirar ${n} é o contrário de somar ${n}: se ${n} + 4 = ${n + 4}, então ${n + 4} − ${n} = 4.`;
const DIV_TIP = (n) => `Dividir é o contrário de multiplicar: se ${n} × 8 = ${n * 8}, então ${n * 8} ÷ ${n} = 8.`;

const tableUnit = (id, op, title, subtitle, color, label) => ({
  id, op, title, subtitle, color, sym: SYM[op], table: true,
  nodes: range(1, 9).map((n) => ({ id: `${id}-${n}`, unit: id, op, n, title: label(n), icon: `${SYM[op]}${n}` })),
});

export const UNITS = [
  tableUnit('add', 'add', 'Adição', 'Tabuada de adição do 1 ao 9', 'purple', (n) => `Tabuada do ${n} de adição`),
  tableUnit('subt', 'sub', 'Subtração', 'Tabuada de subtração do 1 ao 9', 'orange', (n) => `Tabuada do ${n} de subtração`),
  tableUnit('mul', 'mul', 'Multiplicação', 'Tabuada de multiplicação do 1 ao 9', 'green', (n) => `Tabuada do ${n} de multiplicação`),
  tableUnit('div', 'div', 'Divisão', 'Tabuada de divisão do 1 ao 9', 'blue', (n) => `Tabuada do ${n} de divisão`),
  {
    id: 'sub', op: 'sub', title: 'Contas maiores', subtitle: 'Subtração com dezenas e centenas', color: 'red', sym: SYM.sub,
    nodes: SUB_LEVELS.map((l, i) => ({ id: `sub-${i + 1}`, unit: 'sub', op: 'sub', n: i + 1, title: l.title, icon: `${i + 1}` })),
  },
];
for (const u of UNITS) {
  u.nodes.push({ id: `${u.id}-rev`, unit: u.id, op: u.op, review: true, title: `Revisão: ${u.title.toLowerCase()}`, icon: '' });
}
export const ALL_NODES = UNITS.flatMap((u) => u.nodes);
export const nodeById = (id) => ALL_NODES.find((n) => n.id === id);
export const unitById = (id) => UNITS.find((u) => u.id === id);

export function nodeStudy(node) {
  if (node.review) return { tip: 'Revisão: um pouco de tudo desta unidade, com mais atenção no que você erra.', rows: [] };
  if (node.unit === 'sub') {
    const lv = SUB_LEVELS[node.n - 1];
    const rows = withSeed(node.id, () => range(1, 6).map(() => { const [a, b] = SUB_GEN[node.n - 1](); return `${a} − ${b} = ${a - b}`; }));
    return { tip: lv.tip, rows };
  }
  const tip = { add: ADD_TIPS[node.n], sub: SUBT_TIP(node.n), mul: MUL_TIPS[node.n], div: DIV_TIP(node.n) }[node.op];
  return { tip, rows: tableRows(node.op, node.n).map((r) => `${r.a} ${SYM[r.op]} ${r.b} = ${r.res}`) };
}

// ---------- Fatos ----------
const SUB_GEN = [
  () => { const a = ri(2, 10); return [a, ri(1, a)]; },
  () => { const a = ri(11, 20); return [a, ri(2, a - 1)]; },
  () => { const a = ri(2, 9); return [a * 10, ri(1, a - 1) * 10]; },
  () => {
    const ta = ri(2, 9), tb = ri(1, ta - 1), ua = ri(1, 9), ub = ri(0, ua);
    return [ta * 10 + ua, tb * 10 + ub];
  },
  () => {
    const ta = ri(2, 9), tb = ri(1, ta - 1), ua = ri(0, 8), ub = ri(ua + 1, 9);
    return [ta * 10 + ua, tb * 10 + ub];
  },
  () => { const a = ri(2, 9); return [a * 100, ri(1, a - 1) * 100]; },
  () => {
    const ha = ri(2, 9), hb = ri(1, ha - 1), ta = ri(0, 9), tb = ri(0, ta), ua = ri(0, 9), ub = ri(0, ua);
    return [ha * 100 + ta * 10 + ua, hb * 100 + tb * 10 + ub];
  },
  () => {
    const ha = ri(2, 9), hb = ri(1, ha - 1), ua = ri(0, 8), ub = ri(ua + 1, 9), ta = ri(0, 9), tb = ri(0, 9);
    return [ha * 100 + ta * 10 + ua, hb * 100 + tb * 10 + ub];
  },
  () => SUB_GEN[ri(1, 7)](),
];

export function factAdd(a, b) { return { op: 'add', a, b, res: a + b, key: `a:${a}:${b}` }; }
// Tabuada clássica da subtração: (n + k) − n = k
export function factSubT(n, k) { return { op: 'sub', a: n + k, b: n, res: k, key: `t:${n}:${k}` }; }
export function factMul(a, b) { return { op: 'mul', a, b, res: a * b, key: `m:${a}:${b}` }; }
export function factDiv(n, q) { return { op: 'div', a: n * q, b: n, res: q, key: `d:${n}:${q}` }; }
export function factSub(level) {
  const [a, b] = SUB_GEN[level - 1]();
  return { op: 'sub', a, b, res: a - b, key: `s:${level}`, level };
}

export function factLabel(key) {
  const [t, x, y] = key.split(':').map((v, i) => (i ? Number(v) : v));
  if (t === 'a') return `${x} + ${y} = ${x + y}`;
  if (t === 'm') return `${x} × ${y} = ${x * y}`;
  if (t === 'd') return `${x * y} ÷ ${x} = ${y}`;
  if (t === 't') return `${x + y} − ${x} = ${y}`;
  return SUB_LEVELS[x - 1]?.title || key;
}

// ---------- Distratores ----------
function borrowMistake(a, b) {
  const sa = String(a), sb = String(b).padStart(sa.length, '0');
  return Number([...sa].map((d, i) => Math.abs(Number(d) - Number(sb[i]))).join(''));
}
function distractors(f, target, isMissing) {
  const c = new Set();
  const add = (v) => { if (Number.isInteger(v) && v >= 0 && v !== target) c.add(v); };
  if (!isMissing) {
    if (f.op === 'add') { if (f.a * f.b <= 30) add(f.a * f.b); add(f.res + 10); add(f.a + f.b + 1); }
    if (f.op === 'mul') { add(f.a * (f.b + 1)); if (f.b > 1) add(f.a * (f.b - 1)); add((f.a + 1) * f.b); if (f.a > 1) add((f.a - 1) * f.b); add(f.a + f.b); }
    if (f.op === 'div') { add(f.res + 1); add(f.res - 1); add(f.b); add(f.res + 2); }
    if (f.op === 'sub') { add(borrowMistake(f.a, f.b)); add(f.res + 10); add(f.res - 10); add(f.a + f.b); }
  }
  [1, -1, 2, -2].forEach((d) => add(target + d));
  if (target >= 10) { add(target + 10); add(target - 10); }
  const list = shuffle([...c]).slice(0, 3);
  let k = 3;
  while (list.length < 3) { if (!list.includes(target + k)) list.push(target + k); k++; }
  return list;
}

// ---------- Questões ----------

const STORIES = {
  add: [
    (a, b) => `Lia tinha ${pl(a, 'bolinha de gude', 'bolinhas de gude')} e ganhou mais ${b}. Quantas bolinhas ela tem agora?`,
    (a, b) => `No parquinho há ${pl(a, 'criança', 'crianças')} e chegaram mais ${b}. Quantas crianças estão lá?`,
    (a, b) => `Um time fez ${pl(a, 'gol', 'gols')} no primeiro tempo e ${b} no segundo. Quantos gols fez no jogo?`,
    (a, b) => `Comprei um suco de R$ ${a} e um pão de R$ ${b}. Quantos reais gastei?`,
    (a, b) => `Numa árvore há ${pl(a, 'passarinho', 'passarinhos')}. Pousaram mais ${b}. Quantos passarinhos há agora?`,
  ],
  mul: [
    (g, e) => `Cada pacote tem ${pl(e, 'figurinha', 'figurinhas')}. Quantas figurinhas há em ${pl(g, 'pacote', 'pacotes')}?`,
    (g, e) => `Em cada mesa sentam ${pl(e, 'criança', 'crianças')}. Quantas crianças cabem em ${pl(g, 'mesa', 'mesas')}?`,
    (g, e) => `Um picolé custa R$ ${e}. Quanto custam ${pl(g, 'picolé', 'picolés')}?`,
    (g, e) => `Cada caixa tem ${pl(e, 'lápis de cor', 'lápis de cor')}. Quantos lápis há em ${pl(g, 'caixa', 'caixas')}?`,
    (g, e) => `Cada joaninha tem ${pl(e, 'pintinha', 'pintinhas')}. Quantas pintinhas têm ${pl(g, 'joaninha', 'joaninhas')} juntas?`,
  ],
  div: [
    (D, n) => `${pl(D, 'bala foi dividida', 'balas foram divididas')} igualmente entre ${pl(n, 'amigo', 'amigos')}. Quantas balas cada um ganhou?`,
    (D, n) => `Tenho ${pl(D, 'figurinha', 'figurinhas')} e colo ${n} em cada página. Quantas páginas vou completar?`,
    (D, n) => `A professora vai guardar ${pl(D, 'lápis', 'lápis')} em ${pl(n, 'estojo', 'estojos')}, a mesma quantidade em cada. Quantos lápis vão em cada estojo?`,
    (D, n) => `${pl(D, 'criança vai', 'crianças vão')} andar de barco e cada barco leva ${n}. Quantos barcos precisamos?`,
  ],
  sub: [
    (a, b) => `Ana tinha ${pl(a, 'figurinha', 'figurinhas')} e deu ${b} para o irmão. Com quantas figurinhas ela ficou?`,
    (a, b) => `Um ônibus tinha ${pl(a, 'passageiro', 'passageiros')}. Desceram ${b}. Quantos passageiros ficaram?`,
    (a, b) => `Pedro tinha R$ ${a} e gastou R$ ${b}. Quantos reais sobraram?`,
    (a, b) => `Um álbum tem ${pl(a, 'espaço', 'espaços')} e já foram coladas ${b} figurinhas. Quantas faltam colar?`,
    (a, b) => `Na escola há ${pl(a, 'aluno', 'alunos')}. ${b} foram ao passeio. Quantos ficaram na escola?`,
  ],
};

const TITLES = {
  expr: 'Quanto é?',
  missing: 'Qual número está faltando?',
  tf: 'Verdadeiro ou falso?',
  visual: 'Conte e responda',
  story: 'Resolva o probleminha',
};

export function buildQuestion(f, kind, mode) {
  const q = { ...f, kind, mode, title: TITLES[kind] };
  const s = SYM[f.op];
  if (kind === 'visual') {
    const ok = (f.op === 'add' && f.res <= 20)
      || (f.op === 'mul' && f.res <= 40 && f.a <= 8 && f.b <= 8)
      || (f.op === 'div' && f.a <= 36 && f.b > 1)
      || (f.op === 'sub' && f.a <= 20);
    if (!ok) kind = q.kind = 'expr', q.title = TITLES.expr;
  }
  if (kind === 'tf') {
    const shown = R() < 0.5 ? f.res : distractors(f, f.res, false)[0];
    q.text = `${f.a} ${s} ${f.b} = ${shown}`;
    q.answer = shown === f.res;
    q.mode = 'tf';
    q.solution = `${f.a} ${s} ${f.b} = ${f.res}`;
    return q;
  }
  q.answer = f.res;
  q.solution = `${f.a} ${s} ${f.b} = ${f.res}`;
  if (kind === 'expr') q.text = `${f.a} ${s} ${f.b} = ?`;
  if (kind === 'missing') {
    if (f.op === 'div' && R() < 0.5) { q.text = `? ${s} ${f.b} = ${f.res}`; q.answer = f.a; }
    else { q.text = `${f.a} ${s} ? = ${f.res}`; q.answer = f.b; }
  }
  if (kind === 'visual') {
    q.visual = explainFact(f).visual;
    if (f.op === 'add') q.text = `${pl(f.a, 'bolinha', 'bolinhas')} mais ${pl(f.b, 'bolinha', 'bolinhas')}. Quantas ao todo?`;
    if (f.op === 'mul') q.text = `${pl(f.a, 'grupo', 'grupos')} com ${pl(f.b, 'bolinha', 'bolinhas')} em cada. Quantas ao todo?`;
    if (f.op === 'div') { q.visual = { type: 'sub', total: f.a, gone: 0 }; q.text = `Reparta ${pl(f.a, 'bolinha', 'bolinhas')} em ${pl(f.b, 'grupo igual', 'grupos iguais')}. Quantas em cada grupo?`; }
    if (f.op === 'sub') q.text = `Tinha ${pl(f.a, 'bolinha', 'bolinhas')} e ${f.b} foram riscadas. Quantas sobraram?`;
  }
  if (kind === 'story') {
    const t = pick(STORIES[f.op]);
    q.text = t(f.a, f.b);
  }
  if (q.mode === 'choice') q.options = shuffle([q.answer, ...distractors(f, q.answer, kind === 'missing')]);
  return q;
}

// Mistura de tipos por nível (estrelas atuais do nó)
const MIX = [
  [['expr', 'choice', 3], ['visual', 'choice', 2], ['tf', 'tf', 2], ['expr', 'keypad', 2], ['story', 'choice', 1]],
  [['expr', 'keypad', 3], ['missing', 'choice', 2], ['expr', 'choice', 1], ['story', 'choice', 2], ['tf', 'tf', 1], ['visual', 'choice', 1]],
  [['expr', 'keypad', 4], ['missing', 'keypad', 3], ['story', 'keypad', 2], ['expr', 'choice', 1]],
];
function questionsFromFacts(facts, level) {
  const mix = MIX[Math.min(level, 2)];
  return facts.map((f, i) => {
    const [kind, mode] = i === 0 && level === 0 ? ['expr', 'choice'] : weightedPick(mix, (m) => m[2]);
    return buildQuestion(f, kind, mode);
  });
}

// ---------- Estado / persistência ----------
const KEY = 'tabuada-v1';
const fresh = () => ({
  v: 1,
  created: Date.now(),
  profile: { name: '', year: 3 },
  settings: { sound: true, goal: 30, unlockAll: false },
  xp: 0,
  days: {},
  nodes: {},
  facts: {},
  skills: {},
  best: { time: { add: 0, mul: 0, div: 0, sub: 0, mix: 0 }, survival: 0, master: 0, streak: 0, ch: {} },
  tests: [],
  games: {},
  simulados: [],
  daily: {},
  ach: {},
  flags: {},
  log: [],
});

function merge(base, data) {
  for (const k of Object.keys(data || {})) {
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && data[k] && typeof data[k] === 'object' && !Array.isArray(data[k])) merge(base[k], data[k]);
    else base[k] = data[k];
  }
  return base;
}

// Vários estudantes no mesmo aparelho: um índice (estuda-perfis) e um estado por estudante (estuda-perfil-<id>).
// Tudo fica só no localStorage deste navegador.
const INDEX = 'estuda-perfis';
const pkey = (id) => `estuda-perfil-${id}`;
export const MAX_PROFILES = 8;
const readJson = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const writeJson = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

let index = readJson(INDEX);
// Migração: o progresso antigo (tabuada-v1) vira o 1º estudante. A chave antiga fica como cópia de segurança.
if (!index || !Array.isArray(index.order)) {
  index = { v: 1, active: null, order: [], pin: null, next: 1 };
  const old = readJson(KEY);
  if (old && old.profile && old.profile.name) {
    const st = merge(fresh(), old);
    index.pin = st.settings.pin || null;
    delete st.settings.pin;
    writeJson(pkey('p1'), st);
    index.order = ['p1'];
    index.active = 'p1';
    index.next = 2;
  }
  writeJson(INDEX, index);
}
const saveIndex = () => writeJson(INDEX, index);

function load(id = index.active) {
  const data = id ? readJson(pkey(id)) : null;
  const st = merge(fresh(), data || {});
  delete st.settings.pin;
  return st;
}
export let state = load();
export function save() {
  if (!index.active) {
    // Primeiro acesso: o estudante é criado quando o nome é preenchido
    if (!state.profile.name) return;
    const id = `p${index.next++}`;
    index.order.push(id);
    index.active = id;
    saveIndex();
  }
  state.seen = Date.now();
  writeJson(pkey(index.active), state);
}
export function resetAll(keepProfile = true) {
  const keep = keepProfile ? { profile: state.profile, settings: state.settings, created: state.created } : {};
  state = merge(fresh(), keep);
  save();
}

// ---------- Estudantes deste aparelho ----------
export const activeId = () => index.active;
export function profiles() {
  return index.order.map((id) => {
    const st = id === index.active ? state : load(id);
    const days = st.days || {};
    let streak = 0;
    const d = new Date();
    if (!(days[dayKey(d)]?.xp > 0)) d.setDate(d.getDate() - 1);
    while (days[dayKey(d)]?.xp > 0) { streak++; d.setDate(d.getDate() - 1); }
    return { id, name: st.profile.name, year: st.profile.year, xp: st.xp, streak, seen: st.seen || st.created, created: st.created };
  });
}
export function switchProfile(id) {
  if (!index.order.includes(id)) return false;
  if (index.active) save();
  index.active = id;
  saveIndex();
  state = load(id);
  return true;
}
// Prepara um estudante novo; ele é gravado quando o nome for preenchido (save)
export function newProfile() {
  if (index.order.length >= MAX_PROFILES) return false;
  if (index.active) save();
  index.active = null;
  state = fresh();
  return true;
}
// Volta para quem estava estudando (ao cancelar "Adicionar estudante")
export function cancelNewProfile(id) {
  if (!index.active && id) switchProfile(id);
}
export function deleteProfile(id) {
  const i = index.order.indexOf(id);
  if (i < 0) return;
  index.order.splice(i, 1);
  try { localStorage.removeItem(pkey(id)); localStorage.removeItem(`estuda-ui-${id}`); } catch { /* sem armazenamento */ }
  if (index.active === id) {
    index.active = index.order[Math.min(i, index.order.length - 1)] || null;
    state = load(index.active);
  }
  saveIndex();
}
export const getPin = () => index.pin;
export function setPin(pin) { index.pin = pin; saveIndex(); }

// ---------- Backup ----------
const validState = (o) => o && typeof o === 'object' && o.v === 1 && o.profile && typeof o.profile.name === 'string';
// Backup antigo (um estudante) ou de todos ({ tipo: "todos", perfis: [...] })
export function backupInfo(obj) {
  if (obj && obj.tipo === 'todos' && Array.isArray(obj.perfis)) return { all: true, count: obj.perfis.filter(validState).length };
  if (validState(obj)) return { all: false, name: obj.profile.name };
  return null;
}
function addProfile(st) {
  if (index.order.length >= MAX_PROFILES) return false;
  const id = `p${index.next++}`;
  writeJson(pkey(id), st);
  index.order.push(id);
  return id;
}
// modo: "novo" (adiciona como outro estudante) ou "substituir" (troca o progresso do estudante atual)
export function importData(obj, modo = 'substituir') {
  const info = backupInfo(obj);
  if (!info) throw new Error('Arquivo inválido');
  const clean = (o) => { const st = merge(fresh(), o); delete st.settings.pin; return st; };
  if (info.all) {
    let added = 0;
    for (const o of obj.perfis.filter(validState)) {
      const st = clean(o);
      // Mesmo estudante (mesma criação e mesmo nome): substitui; senão entra como novo
      const same = index.order.find((id) => { const x = id === index.active ? state : load(id); return x.created === st.created && x.profile.name === st.profile.name; });
      if (same) { writeJson(pkey(same), st); if (same === index.active) state = st; }
      else if (addProfile(st)) added++;
    }
    if (!index.active && index.order.length) { index.active = index.order[0]; state = load(index.active); }
    saveIndex();
    return { added };
  }
  const st = clean(obj);
  if (modo === 'novo' || !index.active) {
    if (index.active) save();
    const id = addProfile(st);
    if (!id) throw new Error('Limite de estudantes');
    index.active = id;
    saveIndex();
    state = st;
    return { added: 1 };
  }
  state = st;
  save();
  return { added: 0 };
}
export function exportData() { return JSON.stringify(state, null, 1); }
export function exportAll() {
  if (index.active) save();
  return JSON.stringify({ v: 1, tipo: 'todos', criado: Date.now(), perfis: index.order.map((id) => load(id)) }, null, 1);
}

// ---------- Estatísticas ----------
export const stars = (id) => state.nodes[id]?.stars || 0;
export const totalStars = () => ALL_NODES.reduce((s, n) => s + stars(n.id), 0);

export function isUnlocked(unitId, idx) {
  if (state.settings.unlockAll || idx === 0) return true;
  const unit = UNITS.find((u) => u.id === unitId);
  return stars(unit.nodes[idx - 1].id) >= 1;
}
export function currentIndex(unit) {
  let i = unit.nodes.findIndex((n, j) => isUnlocked(unit.id, j) && stars(n.id) === 0);
  if (i < 0) i = unit.nodes.findIndex((n, j) => isUnlocked(unit.id, j) && stars(n.id) < 3);
  return i;
}

export function today() {
  const k = dayKey();
  if (!state.days[k]) state.days[k] = { xp: 0, q: 0, c: 0, ms: 0, l: 0 };
  return state.days[k];
}
export const todayXp = () => state.days[dayKey()]?.xp || 0;

export function streak() {
  const d = new Date();
  if (!(state.days[dayKey(d)]?.xp > 0)) d.setDate(d.getDate() - 1);
  let n = 0;
  while (state.days[dayKey(d)]?.xp > 0) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function lastDays(n) {
  const out = [];
  const d = new Date();
  d.setDate(d.getDate() - (n - 1));
  for (let i = 0; i < n; i++) {
    const k = dayKey(d);
    out.push({ key: k, date: new Date(d), ...(state.days[k] || { xp: 0, q: 0, c: 0, ms: 0, l: 0 }) });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

// 0 = nunca praticou, 1 = precisa treinar, 2 = aprendendo, 3 = dominado
export function mastery(key) {
  const f = state.facts[key];
  if (!f || !f.r) return 0;
  const acc = [...f.r].filter((x) => x === '1').length / f.r.length;
  if (acc >= 0.8 && f.r.length >= 3) return 3;
  if (acc >= 0.5) return 2;
  return 1;
}
function weakness(key) {
  const f = state.facts[key];
  if (!f) return 2;
  const tot = f.c + f.w;
  return 1 + (tot ? (f.w / tot) * 4 : 0) + (f.r.endsWith('0') ? 2 : 0) + (f.t > 6000 ? 1 : 0) - (mastery(key) === 3 ? 0.5 : 0);
}

export function opStats(op) {
  const p = { add: ['a:'], mul: ['m:'], div: ['d:'], sub: ['s:', 't:'] }[op];
  let c = 0, w = 0, t = 0, n = 0;
  for (const [k, f] of Object.entries(state.facts)) {
    if (!p.some((x) => k.startsWith(x))) continue;
    c += f.c; w += f.w; t += f.t * (f.c + f.w); n += f.c + f.w;
  }
  return { c, w, total: c + w, acc: n ? c / n : null, avgMs: n ? t / n : null };
}
export function weakFacts(limit = 8) {
  return Object.entries(state.facts)
    .filter(([, f]) => f.w > 0)
    .map(([k, f]) => ({ key: k, label: factLabel(k), ...f, rate: f.w / (f.c + f.w) }))
    .sort((x, y) => y.rate - x.rate || y.w - x.w)
    .slice(0, limit);
}
export function totals() {
  let q = 0, c = 0, ms = 0, l = 0;
  for (const d of Object.values(state.days)) { q += d.q; c += d.c; ms += d.ms; l += d.l; }
  return { q, c, ms, l };
}

// ---------- Registro de respostas e sessões ----------
export function recordAnswer(q, ok, ms) {
  const f = (state.facts[q.key] ||= { c: 0, w: 0, r: '', t: 0 });
  const n = f.c + f.w;
  f.t = Math.round((f.t * n + Math.min(ms, 30000)) / (n + 1));
  ok ? f.c++ : f.w++;
  f.r = (f.r + (ok ? '1' : '0')).slice(-5);
  const d = today();
  d.q++;
  if (ok) d.c++;
  save();
}

// Respostas das perguntas escritas (por habilidade BNCC)
export function recordSkill(code, ok) {
  if (code) {
    const k = (state.skills[code] ||= { c: 0, w: 0 });
    ok ? k.c++ : k.w++;
  }
  const d = today();
  d.q++;
  if (ok) d.c++;
  save();
}

// Passo de estudo (auto-avaliação): define as estrelas direto
export function markStudied(nodeId, title, starsValue) {
  const n = (state.nodes[nodeId] ||= { stars: 0, plays: 0, best: 0 });
  n.stars = Math.max(n.stars, starsValue);
  n.plays++;
  const d = today();
  const streakBefore = streak();
  d.xp += 5; d.l++;
  state.xp += 5;
  state.best.streak = Math.max(state.best.streak, streak());
  state.log.unshift({ ts: Date.now(), kind: 'study', title, score: starsValue, total: 3, ms: 0, xp: 5 });
  state.log = state.log.slice(0, 200);
  const newAch = checkAchievements();
  save();
  return { streakBefore, streakAfter: streak(), newAch };
}

export function finishSession({ kind, title, nodeId, correct, total, ms, xp, perfect }) {
  const streakBefore = streak();
  const d = today();
  const goalBefore = d.xp >= state.settings.goal;
  d.xp += xp;
  d.ms += ms;
  d.l++;
  state.xp += xp;
  let starsNow = null;
  if (nodeId) {
    const n = (state.nodes[nodeId] ||= { stars: 0, plays: 0, best: 0 });
    n.plays++;
    n.stars = Math.min(3, n.stars + 1);
    n.best = Math.max(n.best, total ? correct / total : 0);
    starsNow = n.stars;
  }
  if (perfect) state.flags.perfect = true;
  if (kind === 'lesson') state.flags.lessons = (state.flags.lessons || 0) + 1;
  const streakAfter = streak();
  state.best.streak = Math.max(state.best.streak, streakAfter);
  state.log.unshift({ ts: Date.now(), kind, title, score: correct, total, ms, xp });
  state.log = state.log.slice(0, 200);
  const newAch = checkAchievements();
  save();
  return {
    xp, starsNow, streakBefore, streakAfter,
    goalReachedNow: !goalBefore && d.xp >= state.settings.goal,
    newAch,
  };
}

// ---------- Conquistas ----------
const unitNodes = (u) => UNITS.find((x) => x.id === u).nodes.filter((n) => !n.review);
// Recordes dos desafios de tabuada, por tipo:operação:tabuada
export const recordKey = (mode, op, n) => `${mode}:${op}:${n}`;
export const record = (mode, op, n) => state.best.ch[recordKey(mode, op, n)] || 0;
function bestOf(mode) {
  const legacy = mode === 'time' ? Math.max(0, ...Object.values(state.best.time)) : state.best.survival;
  return Math.max(legacy, 0, ...Object.entries(state.best.ch).filter(([k]) => k.startsWith(`${mode}:`)).map(([, v]) => v));
}
export function saveRecord(mode, op, n, score) {
  const k = recordKey(mode, op, n);
  const isNew = score > (state.best.ch[k] || 0);
  if (isNew) state.best.ch[k] = score;
  return isNew;
}

// Jogos por matéria: vezes jogadas, melhor aproveitamento e última partida
export function saveGame(id, correct, total) {
  const g = (state.games[id] ||= { plays: 0, best: 0, last: null });
  const rate = total ? correct / total : 0;
  const isNew = g.plays > 0 && rate > g.best;
  g.plays++;
  g.best = Math.max(g.best, rate);
  g.last = { ts: Date.now(), correct, total };
  return isNew;
}
export function saveSimulado(entry) {
  state.simulados.unshift({ ts: Date.now(), ...entry });
  state.simulados = state.simulados.slice(0, 40);
}

export const ACHIEVEMENTS = [
  { id: 'first', title: 'Primeiro passo', desc: 'Complete a primeira lição', test: () => (state.flags.lessons || 0) >= 1 },
  { id: 'perfect', title: 'Perfeito!', desc: 'Faça uma lição sem errar nada', test: () => !!state.flags.perfect },
  { id: 'streak3', title: 'Pegando fogo', desc: 'Estude 3 dias seguidos', test: () => state.best.streak >= 3 },
  { id: 'streak7', title: 'Uma semana!', desc: 'Estude 7 dias seguidos', test: () => state.best.streak >= 7 },
  { id: 'streak30', title: 'Um mês!', desc: 'Estude 30 dias seguidos', test: () => state.best.streak >= 30 },
  { id: 'c100', title: '100 acertos', desc: 'Acerte 100 contas', test: () => totals().c >= 100 },
  { id: 'c500', title: '500 acertos', desc: 'Acerte 500 contas', test: () => totals().c >= 500 },
  { id: 'c1000', title: '1000 acertos', desc: 'Acerte 1000 contas', test: () => totals().c >= 1000 },
  { id: 'addAll', title: 'Soma tudo', desc: 'Ganhe 1 estrela em toda a adição', test: () => unitNodes('add').every((n) => stars(n.id) >= 1) },
  { id: 'mulAll', title: 'Explorador da tabuada', desc: 'Ganhe 1 estrela em todas as tabuadas', test: () => unitNodes('mul').every((n) => stars(n.id) >= 1) },
  { id: 'mulGold', title: 'Tabuada de ouro', desc: 'Todas as tabuadas com 3 estrelas', test: () => unitNodes('mul').every((n) => stars(n.id) >= 3) },
  { id: 'divAll', title: 'Divide e conquista', desc: 'Ganhe 1 estrela em toda a divisão', test: () => unitNodes('div').every((n) => stars(n.id) >= 1) },
  { id: 'subAll', title: 'Craque da subtração', desc: 'Ganhe 1 estrela em toda a tabuada de tirar', test: () => unitNodes('subt').every((n) => stars(n.id) >= 1) },
  { id: 'legend', title: 'Lenda da matemática', desc: 'Todas as lições com 3 estrelas', test: () => ALL_NODES.every((n) => stars(n.id) >= 3) },
  { id: 'speed15', title: 'Relâmpago', desc: '15 pontos em 1 minuto', test: () => bestOf('time') >= 15 },
  { id: 'speed25', title: 'Foguete', desc: '25 pontos em 1 minuto', test: () => bestOf('time') >= 25 },
  { id: 'surv10', title: 'Sobrevivente', desc: '10 pontos no desafio de 3 vidas', test: () => bestOf('survival') >= 10 },
  { id: 'surv25', title: 'Invencível', desc: '25 pontos no desafio de 3 vidas', test: () => bestOf('survival') >= 25 },
  { id: 'daily5', title: 'Todo dia', desc: 'Complete 5 desafios do dia', test: () => Object.keys(state.daily).length >= 5 },
  { id: 'master', title: 'Mestre da tabuada', desc: 'Acerte 18 de 20 em todas as tabuadas de vezes', test: () => state.best.master >= 18 },
  { id: 'test', title: 'Boletim nota 10', desc: 'Acerte tudo num Teste de progresso', test: () => state.tests.some((t) => t.score === t.total) },
  { id: 'sim1', title: 'Primeiro simulado', desc: 'Faça um simulado até o fim', test: () => state.simulados.length >= 1 },
  { id: 'sim18', title: 'Nota alta', desc: 'Acerte 18 de 20 num simulado', test: () => state.simulados.some((x) => x.total >= 20 && x.score >= 18) },
  { id: 'games9', title: 'Jogador de tudo', desc: 'Jogue o jogo de 9 matérias diferentes', test: () => new Set(Object.keys(state.games).map((k) => k.split('-')[1])).size >= 9 },
  { id: 'xp1000', title: '1000 XP', desc: 'Junte 1000 pontos de experiência', test: () => state.xp >= 1000 },
];
export function checkAchievements() {
  const out = [];
  for (const a of ACHIEVEMENTS) {
    if (!state.ach[a.id] && a.test()) { state.ach[a.id] = Date.now(); out.push(a); }
  }
  return out;
}

// ---------- Montagem de lições e desafios ----------
const ALL_MUL = range(1, 9).flatMap((a) => range(1, 10).map((b) => [a, b]));
const FACT_OF = { add: factAdd, mul: factMul, div: factDiv, sub: factSubT };
const KEY_OF = { add: ([a, b]) => `a:${a}:${b}`, mul: ([a, b]) => `m:${a}:${b}`, div: ([n, q]) => `d:${n}:${q}`, sub: ([n, k]) => `t:${n}:${k}` };

function sampleWeighted(pool, n, keyOf, maxRepeat = 2) {
  const out = [];
  const count = {};
  let guard = 0;
  while (out.length < n && guard++ < 500) {
    const it = weightedPick(pool, (x) => weakness(keyOf(x)));
    const k = keyOf(it);
    if ((count[k] || 0) >= maxRepeat) continue;
    count[k] = (count[k] || 0) + 1;
    out.push(it);
  }
  return out;
}

function subLevelWeight(level) { return weakness(`s:${level}`); }

// Um fato aleatório (com peso nos erros) de um nó da trilha
function factFromNode(node) {
  if (node.unit === 'sub') return factSub(node.n);
  const pool = tableKs(node.op).map((k) => [node.n, k]);
  const [x, y] = weightedPick(pool, (p) => weakness(KEY_OF[node.op](p)));
  return FACT_OF[node.op](x, y);
}

export function lessonQuestions(node, size = 10) {
  const level = stars(node.id);
  let facts;
  if (node.review) {
    if (node.unit === 'sub') facts = range(1, size).map(() => factSub(weightedPick(range(1, 9), subLevelWeight)));
    else {
      const pool = range(2, 9).flatMap((n) => tableKs(node.op).filter((k) => k > 1).map((k) => [n, k]));
      facts = sampleWeighted(pool, size, KEY_OF[node.op], 1).map(([x, y]) => FACT_OF[node.op](x, y));
    }
    return questionsFromFacts(shuffle(facts), Math.max(1, level));
  }
  if (node.unit === 'sub') return questionsFromFacts(range(1, size).map(() => factSub(node.n)), level);
  const ks = tableKs(node.op);
  const make = (k) => FACT_OF[node.op](node.n, k);
  facts = level === 0 ? shuffle(ks).map(make)
    : sampleWeighted(ks, size, (k) => KEY_OF[node.op]([node.n, k])).map(make);
  return questionsFromFacts(facts, level);
}

function randomFact(op, difficulty = 2) {
  const maxT = [5, 7, 9][Math.min(difficulty, 2)];
  if (op === 'mix') op = pick(['add', 'mul', 'mul', 'div', 'sub']);
  if (op === 'sub' && difficulty >= 2 && R() < 0.4) return factSub(ri(1, 5));
  const pool = ALL_MUL.filter(([a]) => a <= maxT).map(([a, b]) => [a, op === 'sub' ? b - 1 : b]);
  const [x, y] = weightedPick(pool, (p) => weakness(KEY_OF[op](p)));
  return FACT_OF[op](x, y);
}

export function challengeQuestion(op, difficulty) {
  return buildQuestion(randomFact(op, difficulty), 'expr', 'choice');
}

export function dailyQuestions() {
  return withSeed(`daily-${dayKey()}`, () => {
    const facts = [
      ...shuffle(ALL_MUL.filter(([a, b]) => a > 2)).slice(0, 2).map(([a, b]) => factAdd(a, b)),
      ...shuffle(ALL_MUL.filter(([a, b]) => a > 1 && b > 1)).slice(0, 4).map(([a, b]) => factMul(a, b)),
      ...shuffle(ALL_MUL.filter(([a]) => a > 1)).slice(0, 2).map(([n, q]) => factDiv(n, q)),
      ...shuffle(ALL_MUL.filter(([a]) => a > 1)).slice(0, 2).map(([n, k]) => factSubT(n, k - 1)),
    ];
    return shuffle(facts).map((f, i) => buildQuestion(f, i % 3 === 2 ? 'story' : 'expr', i % 2 ? 'keypad' : 'choice'));
  });
}

function factFromKey(k) {
  const [t, x, y] = k.split(':');
  if (t === 'a') return factAdd(+x, +y);
  if (t === 'm') return factMul(+x, +y);
  if (t === 'd') return factDiv(+x, +y);
  if (t === 't') return factSubT(+x, +y);
  return factSub(+x);
}

export function errorQuestions(size = 10) {
  const weak = weakFacts(30).map((w) => w.key);
  if (!weak.length) return [];
  const facts = range(1, size).map((i) => factFromKey(weak[(i - 1) % weak.length]));
  return questionsFromFacts(shuffle(facts), 1);
}

// Revisão surpresa: só do que já foi visto (nós com pelo menos 1 estrela)
export const seenNodes = () => ALL_NODES.filter((n) => !n.review && stars(n.id) >= 1);
export function surpriseQuestions(size = 12) {
  const seen = seenNodes();
  if (!seen.length) return [];
  const facts = range(1, size).map(() => factFromNode(pick(seen)));
  return facts.map((f) => {
    const [kind, mode] = weightedPick(MIX[1], (m) => m[2]);
    return buildQuestion(f, kind, mode);
  });
}

export function masterQuestions() {
  return sampleWeighted(ALL_MUL.filter(([, b]) => b > 1), 20, KEY_OF.mul, 1)
    .map(([a, b]) => buildQuestion(factMul(a, b), 'expr', 'keypad'));
}

// Teste de progresso: 2 contas de cada tabuada/nível (18 no total), sem ajuda
export function testQuestions(op) {
  const qs = [];
  for (let n = 1; n <= 9; n++) {
    let facts;
    {
      const [b1, b2] = shuffle(op === 'sub' ? range(1, 9) : range(2, 10));
      facts = [FACT_OF[op](n, b1), FACT_OF[op](n, b2)];
    }
    for (const f of facts) qs.push({ ...buildQuestion(f, 'expr', 'keypad'), group: n });
  }
  return shuffle(qs);
}
export function testGroupLabel(op, n) {
  return `Tabuada do ${n} de ${{ add: 'adição', sub: 'subtração', mul: 'multiplicação', div: 'divisão' }[op]}`;
}
export function testNodeId(op, n) { return `${op}-${n}`; }

// ---------- Ajuda: dicas lúdicas para a conta atual ----------
const seq = (start, step, count) => range(0, count - 1).map((i) => start + step * i);

export function hintFor(q) {
  const { op, a, b, res } = q;
  const missing = q.kind === 'missing';
  if (op === 'add') {
    if (missing) return { title: 'Quanto falta?', lines: [`Comece no ${a} e vá pulando até chegar no ${res}.`, `Conte quantos pulinhos você deu: ${seq(a + 1, 1, Math.min(3, res - a)).join(', ')}${res - a > 3 ? ', …' : ''}`, 'O número de pulos é a resposta!'] };
    const big = Math.max(a, b), small = Math.min(a, b);
    if (a === b) return { title: 'É um dobro!', lines: [`${a} + ${a} é o dobro de ${a}.`, 'Dobros fáceis: 5 + 5 = 10, 6 + 6 = 12, 7 + 7 = 14.', `Quanto é o dobro de ${a}?`] };
    if (Math.abs(a - b) === 1) return { title: 'Quase um dobro!', lines: [`${small} + ${big} é igual a ${small} + ${small} + 1.`, `O dobro de ${small} é ${small * 2}.`, `Agora some mais 1!`] };
    if (small === 10 || big === 10) return { title: 'Somar 10 é mágico!', lines: ['Quando soma 10, o número das dezenas sobe 1.', `${small} + 10 → ponha um 1 na frente do ${small}!`] };
    if (res <= 10) return { title: 'Conte nos dedinhos!', lines: [`Guarde o ${big} na cabeça.`, `Agora levante ${small} dedinhos e conte: ${seq(big + 1, 1, small).map((x, i) => (i === small - 1 ? '?' : x)).join(', ')}`] };
    const need = 10 - big;
    if (small === 9) return { title: 'Truque do 9', lines: [`Somar 9 é somar 10 e tirar 1.`, `${big} + 10 = ${big + 10}`, `Agora tire 1 de ${big + 10}.`] };
    return { title: 'Complete o 10!', lines: [`O ${big} quer virar 10: ele precisa de ${need}.`, `Tire ${need} do ${small}: sobra ${small - need}.`, `Agora é fácil: 10 + ${small - need} = ?`] };
  }
  if (op === 'mul') {
    if (missing) return { title: 'Pulos do sapinho', lines: [`Pule de ${a} em ${a} até chegar no ${res}:`, `${seq(a, a, Math.min(4, b)).join(', ')}${b > 4 ? ', …' : ''}`, 'Quantos pulos você deu? Essa é a resposta!'] };
    const x = Math.max(a, b), k = Math.min(a, b);
    const other = (n) => (a === n ? b : a);
    if (a === 1 || b === 1) return { title: 'Vezes 1 é espelho!', lines: ['Qualquer número vezes 1 é ele mesmo.', `${a} × ${b}: olhe no espelho!`] };
    if (a === 10 || b === 10) return { title: 'Vezes 10', lines: ['Para multiplicar por 10, coloque um zero no final!', `${other(10)} → ${other(10)}0?`] };
    if (a === 2 || b === 2) return { title: 'Vezes 2 é o dobro', lines: [`${other(2)} × 2 = ${other(2)} + ${other(2)}`, 'Quanto dá essa soma?'] };
    if (a === 5 || b === 5) return { title: 'Vezes 5 é metade do 10', lines: [`${other(5)} × 10 = ${other(5) * 10}`, `Agora pegue a metade de ${other(5) * 10}!`, 'Dica: o resultado sempre termina em 0 ou 5.'] };
    if (a === 9 || b === 9) {
      const n = other(9);
      return { title: 'Truque dos dedos do 9!', lines: ['Abra as duas mãos com 10 dedos.', `Abaixe o dedo número ${n} (contando da esquerda).`, `Dedos antes dele = dezenas (${n - 1}). Dedos depois = unidades (${10 - n}).`, 'Junte os dois números!'] };
    }
    if (a === 4 || b === 4) { const n = other(4); return { title: 'Dobro do dobro', lines: [`Primeiro o dobro: ${n} + ${n} = ${n * 2}`, `Agora o dobro de ${n * 2}: ${n * 2} + ${n * 2} = ?`] }; }
    if (a === 3 || b === 3) { const n = other(3); return { title: 'Some 3 vezes', lines: [`${n} × 3 = ${n} + ${n} + ${n}`, `${n} + ${n} = ${n * 2}. Agora some mais ${n}!`] }; }
    if (a === 8 || b === 8) { const n = other(8); return { title: 'Dobra, dobra, dobra!', lines: [`${n} → dobro ${n * 2} → dobro ${n * 4} → dobro ?`, 'Dobre três vezes seguidas!'] }; }
    if (a === 6 || b === 6) { const n = other(6); return { title: 'Quebre em pedaços', lines: [`${n} × 6 = ${n} × 5 + ${n}`, `${n} × 5 = ${n * 5}`, `Agora some mais ${n}!`] }; }
    if (a === 7 || b === 7) { const n = other(7); return { title: 'Quebre em pedaços', lines: [`${n} × 7 = ${n} × 5 + ${n} × 2`, `${n} × 5 = ${n * 5} e ${n} × 2 = ${n * 2}`, `Quanto dá ${n * 5} + ${n * 2}?`] }; }
    return { title: 'Grupos iguais', lines: [`${a} grupos com ${b} em cada.`, `${Array(a).fill(b).join(' + ')} = ?`] };
  }
  if (op === 'div') {
    if (b === 1) return { title: 'Dividir por 1', lines: ['Se só tem 1 amigo, ele fica com tudo!', `${a} ÷ 1 = o próprio ${a}.`] };
    if (missing && q.answer === a) return { title: 'Pense ao contrário', lines: [`? ÷ ${b} = ${res} é o mesmo que ${b} × ${res} = ?`, 'Use a tabuada!'] };
    const lines = [`Imagine ${a} repartidos para ${b} amigos.`, `Pense na tabuada do ${b}: ${b} × ? = ${a}`, `Conte de ${b} em ${b}: ${seq(b, b, Math.min(3, res)).join(', ')}${res > 3 ? ', …' : ''} até chegar no ${a}.`, 'Quantos pulinhos?'];
    if (b === 2) lines.unshift(`Dividir por 2 é achar a metade de ${a}.`);
    return { title: 'Dividir é repartir!', lines };
  }
  // subtração
  if (missing) return { title: 'Quanto tirar?', lines: [`Comece no ${res} e conte para frente até o ${a}.`, 'Quantos números você contou? Essa é a resposta!'] };
  if (a <= 20) {
    if (b <= 5) return { title: 'Conte para trás', lines: [`Comece no ${a} e volte ${b}:`, `${seq(a - 1, -1, b).map((x, i) => (i === b - 1 ? '?' : x)).join(', ')}`] };
    if (a > 10 && b > a - 10) return { title: 'Desça até o 10', lines: [`Primeiro tire ${a - 10} para chegar no 10: ${a} − ${a - 10} = 10`, `Ainda falta tirar ${b - (a - 10)}.`, `Quanto é 10 − ${b - (a - 10)}?`] };
    return { title: 'Conte para frente', lines: [`Comece no ${b} e vá pulando até o ${a}.`, 'Quantos pulinhos você deu? Essa é a resposta!'] };
  }
  if (a % 10 === 0 && b % 10 === 0) {
    const z = a % 100 === 0 && b % 100 === 0 ? 100 : 10;
    return { title: 'Esconda os zeros!', lines: [`Pense sem os zeros: ${a / z} − ${b / z} = ${a / z - b / z}`, `Depois devolva ${z === 100 ? 'os dois zeros' : 'o zero'}!`] };
  }
  const sa = String(a), sb = String(b).padStart(sa.length, ' ');
  const names = ['unidades', 'dezenas', 'centenas'];
  const da = [...sa].reverse().map(Number);
  const db = [...String(b)].reverse().map(Number);
  const lines = ['Arme a conta, um número embaixo do outro:', `<pre class="conta">  ${sa}\n− ${sb}\n${'─'.repeat(sa.length + 2)}</pre>`];
  let borrow = 0;
  for (let i = 0; i < da.length; i++) {
    const top = da[i] - borrow, bot = db[i] || 0;
    borrow = 0;
    if (i === da.length - 1 && bot === 0 && top === 0) break;
    if (top < bot) {
      lines.push(`${names[i]}: ${top} − ${bot} não dá! Peça 1 emprestado ao vizinho → ${top + 10} − ${bot} = ${top + 10 - bot}`);
      borrow = 1;
    } else lines.push(`${names[i]}: ${top} − ${bot} = ${top - bot}`);
  }
  lines.push('Junte os números de cada casa e pronto!');
  return { title: 'Arme a conta', lines, html: true };
}

// ---------- Tabuada simples: linhas, explicações e prática ----------
export const TABLE_OPS = ['add', 'sub', 'mul', 'div'];
export const TABLE_NAME = { add: 'Adição', sub: 'Subtração', mul: 'Multiplicação', div: 'Divisão' };

// k de cada linha da tabuada (subtração vai de 0 a 9, as outras de 1 a 10)
export const tableKs = (op) => (op === 'sub' ? range(0, 9) : range(1, 10));

export function tableFact(op, n, k) {
  if (op === 'add') return factAdd(n, k);
  if (op === 'sub') return factSubT(n, k);
  if (op === 'mul') return factMul(n, k);
  return factDiv(n, k);
}
export const tableRows = (op, n) => tableKs(op).map((k) => ({ ...tableFact(op, n, k), k }));
export const factText = (f) => `${f.a} ${SYM[f.op]} ${f.b}`;

const NUM = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
  'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const TENS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
export function numWords(n) {
  if (n < 20) return NUM[n];
  if (n === 100) return 'cem';
  const t = Math.floor(n / 10), u = n % 10;
  return u ? `${TENS[t]} e ${NUM[u]}` : TENS[t];
}
const OP_WORD = { add: 'mais', sub: 'menos', mul: 'vezes', div: 'dividido por' };
export const speakText = (f) => `${numWords(f.a)} ${OP_WORD[f.op]} ${numWords(f.b)}, é igual a ${numWords(f.res)}`;

// Explicação com a resposta, para a fase "Aprender"
export function explainFact(f) {
  const { op, a, b, res } = f;
  const lines = [];
  let visual;
  if (op === 'add') {
    visual = { type: 'add', a, b };
    lines.push(`Junte ${pl(a, 'bolinha azul', 'bolinhas azuis')} com ${pl(b, 'laranja', 'laranjas')}. Ao todo são ${res}!`);
    if (b === 10) lines.push(`Somar 10 é fácil: o ${a} ganha uma dezena e vira ${res}.`);
    else if (a === b) lines.push(`É um dobro! O dobro de ${a} é ${res}.`);
    else if (res <= 10 || b <= 3) lines.push(`Comece no ${a} e conte mais ${b}: ${seq(a + 1, 1, b).join(', ')}.`);
    else lines.push(`Complete o 10: ${a} + ${10 - a} = 10, e ainda sobram ${b - (10 - a)}. Então 10 + ${b - (10 - a)} = ${res}.`);
  }
  if (op === 'sub') {
    visual = { type: 'sub', total: a, gone: b };
    lines.push(`Tinha ${pl(a, 'bolinha', 'bolinhas')} e tirei ${b}. ${res === 0 ? 'Não sobrou nenhuma!' : `Sobraram ${res}.`}`);
    if (b <= 3 && res > 0) lines.push(`Conte para trás a partir do ${a}: ${seq(a - 1, -1, b).join(', ')}.`);
    lines.push(`Confira com a soma: ${b} + ${res} = ${a}`);
  }
  if (op === 'mul') {
    visual = { type: 'groups', groups: a, each: b };
    lines.push(`${a} × ${b} é ter ${pl(a, 'grupo', 'grupos')} com ${b} em cada.`);
    if (a > 1) lines.push(`${Array(a).fill(b).join(' + ')} = ${res}`);
    const tips = {
      1: 'Vezes 1 é como um espelho: o número fica igual!',
      2: `Vezes 2 é o dobro: ${b} + ${b} = ${res}.`,
      4: `Dobro do dobro: o dobro de ${b} é ${b * 2}, e o dobro de ${b * 2} é ${res}.`,
      5: 'Na tabuada do 5, o resultado sempre termina em 0 ou 5.',
      8: `Dobra 3 vezes: ${b} → ${b * 2} → ${b * 4} → ${res}.`,
      9: `Truque do 9: os algarismos de ${res} somados dão 9${res === 90 ? ' (9 + 0)' : ` (${String(res).split('').join(' + ')})`}.`,
    };
    if (b === 10) lines.push(`Vezes 10: é só colocar um zero no final do ${a}!`);
    else if (tips[a]) lines.push(tips[a]);
    if (b < a && b > 1) lines.push(`Você já viu essa! ${b} × ${a} também é ${res}. A ordem não muda o resultado.`);
  }
  if (op === 'div') {
    visual = { type: 'groups', groups: b, each: res, share: true };
    lines.push(`Repartindo ${pl(a, 'bolinha', 'bolinhas')} em ${pl(b, 'grupo igual', 'grupos iguais')}, cada grupo fica com ${res}.`);
    lines.push(`Confira com a tabuada: ${b} × ${res} = ${a}`);
    if (b === 2) lines.push(`Dividir por 2 é achar a metade: a metade de ${a} é ${res}.`);
    if (b === 1) lines.push('Dividir por 1: um grupo só fica com tudo!');
  }
  return { lines, visual };
}

// Lição de prática de uma tabuada escolhida na aba Tabuada
export function tableQuestions(op, n, level = 0) {
  return questionsFromFacts(shuffle(tableRows(op, n)), level);
}

// ---------- Desafios de tabuada (operação + tabuada escolhida) ----------
const QUIZ_MIX = [['expr', 'keypad', 4], ['expr', 'choice', 2], ['missing', 'choice', 2], ['tf', 'tf', 1]];

function challengeFact(op, n) {
  const pool = (n === 'all' ? range(1, 9) : [n]).flatMap((t) => tableKs(op).map((k) => [t, k]));
  const [x, y] = weightedPick(pool, (p) => weakness(KEY_OF[op](p)));
  return FACT_OF[op](x, y);
}

// 10 perguntas de uma tabuada (todas as contas dela) ou 20 de todas as tabuadas
export function tableQuiz(op, n) {
  let facts;
  if (n === 'all') {
    const pool = range(1, 9).flatMap((t) => tableKs(op).map((k) => [t, k]));
    facts = sampleWeighted(pool, 20, KEY_OF[op], 1).map(([x, y]) => FACT_OF[op](x, y));
  } else facts = shuffle(tableKs(op)).map((k) => FACT_OF[op](n, k));
  return facts.map((f) => { const [kind, mode] = weightedPick(QUIZ_MIX, (m) => m[2]); return buildQuestion(f, kind, mode); });
}

// Pergunta rápida (escolha) para 1 minuto e 3 vidas
export function tableChallengeQuestion(op, n) {
  return buildQuestion(challengeFact(op, n), 'expr', 'choice');
}
