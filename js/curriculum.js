// Trilhas por ano e por matéria (BNCC + conteúdo escrito para Joinville).
import * as E from './engine.js';

export const SUBJECTS = [
  { id: 'ma', comp: 'MA', name: 'Matemática', full: 'Matemática', color: 'green', glyph: '123' },
  { id: 'lp', comp: 'LP', name: 'Português', full: 'Língua Portuguesa', color: 'blue', glyph: 'Aa' },
  { id: 'ci', comp: 'CI', name: 'Ciências', full: 'Ciências', color: 'teal', icon: 'flask' },
  { id: 'hi', comp: 'HI', name: 'História', full: 'História', color: 'orange', icon: 'landmark' },
  { id: 'ge', comp: 'GE', name: 'Geografia', full: 'Geografia', color: 'purple', icon: 'globe' },
  { id: 'ar', comp: 'AR', name: 'Arte', full: 'Arte', color: 'pink', icon: 'palette' },
  { id: 'ef', comp: 'EF', name: 'Ed. Física', full: 'Educação Física', color: 'red', icon: 'ball' },
  { id: 'li', comp: 'LI', name: 'Inglês', full: 'Língua Inglesa', color: 'yellow', glyph: 'En' },
  { id: 'er', comp: 'ER', name: 'Ens. Religioso', full: 'Ensino Religioso', color: 'gray', icon: 'sun' },
];
export const subjectById = (id) => SUBJECTS.find((s) => s.id === id);
// Trilhas principais: Matemática e Português. As demais formam a trilha Geral.
export const MAIN = ['ma', 'lp'];
export const isGeral = (id) => !MAIN.includes(id);

// Conteúdo escrito por ano, carregado de data/conteudo/anoN.json (atualizável sem mexer no código)
const AUTHORED = {};
const cache = {};
async function getJson(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}
export async function loadContent(year) {
  if (year in AUTHORED) return AUTHORED[year];
  try {
    const data = await getJson(`./data/conteudo/ano${year}.json`);
    AUTHORED[year] = data.materias || null;
  } catch { AUTHORED[year] = null; }
  delete cache[year];
  return AUTHORED[year];
}

// Curiosidades (data/curiosidades.json)
let CURIOS = { fontes: [] };
export async function loadCurios() {
  try { CURIOS = await getJson('./data/curiosidades.json'); } catch { /* sem curiosidades offline na 1ª vez */ }
  return CURIOS;
}
export const curios = () => CURIOS;

// ---------- BNCC ----------
let BNCC = [];
export async function loadBncc() {
  if (BNCC.length) return BNCC;
  try {
    BNCC = (await getJson('./data/bncc.json')).map(([code, comp, years, text]) => ({ code, comp, years: years.split('').map(Number), text }));
  } catch { BNCC = []; }
  return BNCC;
}
export const skillByCode = (code) => BNCC.find((s) => s.code === code);
export const skillsFor = (comp, year) => BNCC.filter((s) => s.comp === comp && s.years.includes(year));

const short = (t, n = 46) => {
  const s = t.replace(/\s+/g, ' ').trim();
  return s.length <= n ? s.replace(/\.$/, '') : `${s.slice(0, n).replace(/\s+\S*$/, '')}…`;
};

// ---------- Montagem da trilha ----------
export function course(year) {
  if (cache[year]) return cache[year];
  const authored = AUTHORED[year] || {};
  const subjects = [];
  for (const subj of SUBJECTS) {
    let units = [];
    if (subj.id === 'ma') {
      // O app de matemática completo (tabuadas de +, −, ×, ÷ e contas maiores) vem primeiro
      units = E.UNITS.map((u) => ({ title: `${u.title}: ${u.subtitle.toLowerCase()}`, core: true, nodes: u.nodes.map((n) => makeNode({ gen: n.id, skills: [] }, subj)) }));
    }
    if (authored[subj.id]) {
      // Tópicos do ano escritos; na Matemática, sem repetir as tabuadas que já estão no núcleo
      const yearUnits = authored[subj.id]
        .map((u) => ({ title: u.unit, nodes: u.nodes.filter((n) => !(subj.id === 'ma' && n.gen)).map((n) => makeNode(n, subj)) }))
        .filter((u) => u.nodes.length);
      units.push(...yearUnits);
    } else {
      const skills = skillsFor(subj.comp, year);
      const groups = [];
      for (let i = 0; i < skills.length; i += 3) groups.push(skills.slice(i, i + 3));
      const nodes = groups.map((g, i) => makeNode({
        id: `y${year}-${subj.id}-b${i + 1}`, check: true, title: short(g[0].text), skills: g.map((s) => s.code),
      }, subj));
      for (let i = 0; i < nodes.length; i += 6) units.push({ title: `Habilidades ${i / 6 + 1}`, nodes: nodes.slice(i, i + 6) });
    }
    if (!units.length) continue;
    units.forEach((u, ui) => u.nodes.forEach((n, ni) => { n.unitIdx = ui; n.idx = ni; }));
    subjects.push({ ...subj, units, nodes: units.flatMap((u) => u.nodes), authored: !!authored[subj.id] });
  }
  // Trilha Geral: alterna as outras matérias, um passo de cada vez
  const geral = [];
  const queues = subjects.filter((s) => isGeral(s.id)).map((s) => s.nodes.slice());
  while (queues.some((q) => q.length)) for (const q of queues) if (q.length) geral.push(q.shift());
  cache[year] = { year, subjects, geral };
  return cache[year];
}

function makeNode(n, subj) {
  if (n.gen) {
    const g = E.nodeById(n.gen);
    return { id: g.id, kind: 'gen', gen: g, title: g.title, icon: g.icon || '', skills: n.skills, subj: subj.id, color: subj.color, review: g.review };
  }
  if (n.check) return { ...n, kind: 'check', subj: subj.id, color: subj.color };
  return { ...n, kind: 'lesson', subj: subj.id, color: subj.color };
}

export function findNode(year, id) {
  return course(year).subjects.flatMap((s) => s.nodes).find((n) => n.id === id);
}

// Um passo libera quando o anterior da mesma unidade tem pelo menos 1 estrela
export function unlocked(year, node) {
  if (E.state.settings.unlockAll || node.idx === 0) return true;
  const subj = course(year).subjects.find((s) => s.id === node.subj);
  const prev = subj.units[node.unitIdx].nodes[node.idx - 1];
  return E.stars(prev.id) >= 1;
}

export function currentId(year, nodes) {
  const open = nodes.filter((n) => unlocked(year, n));
  return (open.find((n) => E.stars(n.id) === 0) || open.find((n) => E.stars(n.id) < 3))?.id;
}

// ---------- Perguntas ----------
const shuffle = (a) => E.shuffle(a);
export function lessonQuestions(node, size = 8) {
  if (node.kind === 'gen') return E.lessonQuestions(node.gen);
  const qs = shuffle(node.q).slice(0, size);
  return qs.map(([text, opts, why]) => makeQuestion(node, text, opts, why));
}

function makeQuestion(node, text, opts, why) {
  const answer = opts[0];
  const isVF = opts.length === 2 && opts.includes('Verdadeiro') && opts.includes('Falso');
  return {
    kind: 'story', mode: 'choice', title: isVF ? 'Verdadeiro ou falso?' : 'Responda',
    text, passage: node.passage, options: isVF ? ['Verdadeiro', 'Falso'] : shuffle(opts), answer,
    solution: why ? `${answer}. ${why}` : answer, skill: node.skills?.[0] || null, nodeId: node.id,
  };
}

// Revisão surpresa: perguntas de tudo o que já foi estudado no ano
export function surpriseQuestions(year, size = 12) {
  const done = course(year).subjects.flatMap((s) => s.nodes).filter((n) => n.kind !== 'check' && E.stars(n.id) >= 1);
  if (!done.length) return [];
  const out = [];
  for (let i = 0; i < size; i++) {
    const n = done[Math.floor(Math.random() * done.length)];
    if (n.kind === 'gen') out.push(E.lessonQuestions(n.gen)[0]);
    else { const [t, o, w] = n.q[Math.floor(Math.random() * n.q.length)]; out.push(makeQuestion(n, t, o, w)); }
  }
  return out;
}

// ---------- Progresso ----------
export function subjectProgress(year, subjId) {
  const s = course(year).subjects.find((x) => x.id === subjId);
  if (!s) return { stars: 0, max: 0, done: 0, total: 0 };
  const stars = s.nodes.reduce((a, n) => a + E.stars(n.id), 0);
  return { stars, max: s.nodes.length * 3, done: s.nodes.filter((n) => E.stars(n.id) >= 1).length, total: s.nodes.length };
}

// Situação de cada habilidade BNCC do ano: 0 não iniciada, 1 estudando, 2 dominada
export function skillStatus(year) {
  const map = {};
  for (const s of course(year).subjects) {
    for (const n of s.nodes) {
      for (const code of n.skills || []) map[code] = Math.max(map[code] ?? 0, E.stars(n.id) >= 3 ? 2 : E.stars(n.id) >= 1 ? 1 : 0);
    }
  }
  return map;
}
