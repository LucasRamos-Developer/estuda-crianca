#!/usr/bin/env node
// Valida os arquivos de conteúdo (data/*.json) antes de publicar.
// Uso: node tools/validar-conteudo.mjs     (sai com código 1 se encontrar erro)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SUBJECTS = ['ma', 'lp', 'ci', 'hi', 'ge', 'ar', 'ef', 'li', 'er'];
const errors = [];
const warns = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warns.push(`${f}: ${m}`);

function readJson(rel) {
  const file = path.join(ROOT, rel);
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { err(rel, `JSON inválido (${e.message})`); return null; }
}

// ---------- BNCC ----------
const bncc = readJson('data/bncc.json');
const codes = new Set();
if (bncc) {
  if (!Array.isArray(bncc)) err('data/bncc.json', 'deve ser uma lista');
  else for (const [i, row] of bncc.entries()) {
    if (!Array.isArray(row) || row.length !== 4) { err('data/bncc.json', `linha ${i}: formato [código, componente, anos, texto]`); continue; }
    const [code, comp, years, text] = row;
    if (!/^EF\d{2}[A-Z]{2}\d{2}$/.test(code)) err('data/bncc.json', `código inválido: ${code}`);
    if (codes.has(code)) err('data/bncc.json', `código repetido: ${code}`);
    codes.add(code);
    if (!/^[A-Z]{2}$/.test(comp) || !/^[1-9]+$/.test(years) || !text) err('data/bncc.json', `dados incompletos em ${code}`);
  }
}

// ---------- Conteúdo por ano ----------
const ids = new Set();
const dir = path.join(ROOT, 'data/conteudo');
for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const rel = `data/conteudo/${name}`;
  const data = readJson(rel);
  if (!data) continue;
  const m = name.match(/^ano([1-9])\.json$/);
  if (!m) { err(rel, 'o nome deve ser anoN.json (N de 1 a 9)'); continue; }
  if (data.ano !== Number(m[1])) err(rel, `"ano" deve ser ${m[1]}`);
  if (!data.materias || typeof data.materias !== 'object') { err(rel, 'falta o objeto "materias"'); continue; }
  for (const [subj, units] of Object.entries(data.materias)) {
    if (!SUBJECTS.includes(subj)) err(rel, `matéria desconhecida "${subj}" (use: ${SUBJECTS.join(', ')})`);
    if (!Array.isArray(units)) { err(rel, `${subj}: deve ser uma lista de unidades`); continue; }
    for (const u of units) {
      if (!u.unit) err(rel, `${subj}: unidade sem "unit" (título)`);
      for (const n of u.nodes || []) {
        if (n.gen) continue; // passo gerado pelo motor de contas (ex.: "mul-3")
        const where = `${subj} / ${n.id || '(sem id)'}`;
        if (!n.id || !/^y[1-9]-[a-z]{2}-\w+$/.test(n.id)) err(rel, `${where}: id deve ser como "y3-ma-12"`);
        if (ids.has(n.id)) err(rel, `${where}: id repetido`);
        ids.add(n.id);
        if (!n.title) err(rel, `${where}: falta "title"`);
        if (!n.intro) err(rel, `${where}: falta "intro"`);
        if (!Array.isArray(n.points) || !n.points.length) err(rel, `${where}: falta "points"`);
        for (const c of n.skills || []) if (codes.size && !codes.has(c)) err(rel, `${where}: código BNCC inexistente ${c}`);
        if (!Array.isArray(n.q) || n.q.length < 3) err(rel, `${where}: precisa de pelo menos 3 perguntas em "q"`);
        for (const [i, q] of (n.q || []).entries()) {
          const [text, opts] = q;
          if (!text || !Array.isArray(opts) || opts.length < 2) { err(rel, `${where}: pergunta ${i + 1} mal formada ([enunciado, [certa, erradas...], explicação?])`); continue; }
          if (new Set(opts).size !== opts.length) err(rel, `${where}: pergunta ${i + 1} tem alternativas repetidas`);
          if (opts.length === 2 && !(opts.includes('Verdadeiro') && opts.includes('Falso'))) warn(rel, `${where}: pergunta ${i + 1} só tem 2 alternativas`);
        }
      }
    }
  }
}

// ---------- Curiosidades ----------
const cur = readJson('data/curiosidades.json');
if (cur) {
  for (const [k, v] of Object.entries(cur)) {
    if (k === 'versao') continue;
    if (k === 'fontes') { for (const f of v) if (!f.name || !/^https:\/\//.test(f.url || '')) err('data/curiosidades.json', 'fonte precisa de "name" e "url" https'); continue; }
    if (!SUBJECTS.includes(k)) { err('data/curiosidades.json', `matéria desconhecida "${k}"`); continue; }
    if (!Array.isArray(v) || v.some((t) => typeof t !== 'string' || !t.trim())) err('data/curiosidades.json', `${k}: deve ser uma lista de textos`);
  }
}

for (const w of warns) console.log(`aviso  ${w}`);
for (const e of errors) console.log(`ERRO   ${e}`);
console.log(errors.length ? `\n${errors.length} erro(s). Corrija antes de publicar.` : `\nConteúdo OK (${codes.size} habilidades BNCC, ${ids.size} passos escritos).`);
process.exit(errors.length ? 1 : 0);
