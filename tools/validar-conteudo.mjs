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

// ---------- Mapa ----------
const mapa = fs.existsSync(path.join(ROOT, 'data/mapas/mundo.json')) ? readJson('data/mapas/mundo.json') : null;
if (mapa) {
  if (!mapa.paises || !mapa.regioes || !mapa.continentes) err('data/mapas/mundo.json', 'faltam "paises", "regioes" ou "continentes" (gere com tools/gerar-mapa.mjs)');
  else for (const [id, p] of Object.entries(mapa.paises)) if (!p.nome || !p.d || !mapa.continentes[p.cont]) err('data/mapas/mundo.json', `país ${id} incompleto`);
}

// ---------- Jogos por ano ----------
const TIPOS = ['soletrando', 'mercadinho', 'classifica', 'linha', 'mapa', 'pintor', 'pistas', 'ouvir', 'memoria'];
const skillOk = (rel, where, c) => { if (c && codes.size && !codes.has(c)) err(rel, `${where}: código BNCC inexistente ${c}`); };
const list = (rel, where, v, min) => { if (!Array.isArray(v) || v.length < min) { err(rel, `${where}: precisa de pelo menos ${min} itens`); return false; } return true; };
const jdir = path.join(ROOT, 'data/jogos');
let nJogos = 0;
for (const name of fs.existsSync(jdir) ? fs.readdirSync(jdir).filter((f) => f.endsWith('.json')).sort() : []) {
  const rel = `data/jogos/${name}`;
  const data = readJson(rel);
  if (!data) continue;
  const m = name.match(/^ano([1-9])\.json$/);
  if (!m || data.ano !== Number(m[1])) err(rel, 'o nome deve ser anoN.json e "ano" deve ser N');
  for (const [subj, g] of Object.entries(data.jogos || {})) {
    const w = `${subj} (${g.tipo})`;
    nJogos++;
    if (!SUBJECTS.includes(subj)) err(rel, `matéria desconhecida "${subj}"`);
    if (!TIPOS.includes(g.tipo)) { err(rel, `${w}: tipo deve ser um de ${TIPOS.join(', ')}`); continue; }
    if (!g.titulo) err(rel, `${w}: falta "titulo"`);
    skillOk(rel, w, g.skill);
    (g.skills || []).forEach((c) => skillOk(rel, w, c));
    if (g.tipo === 'soletrando' && list(rel, w, g.niveis, 1)) for (const n of g.niveis) {
      skillOk(rel, w, n.skill);
      if (list(rel, `${w} / ${n.nome}`, n.itens, 4)) for (const [p, f] of n.itens) if (!p || !f || !f.toLowerCase().includes(p.toLowerCase())) err(rel, `${w}: a frase precisa conter a palavra "${p}"`);
    }
    if (g.tipo === 'mercadinho' && list(rel, w, g.produtos, 4)) for (const [n, p] of g.produtos) if (!n || !Number.isInteger(p) || p < 1) err(rel, `${w}: produto "${n}" precisa de preço inteiro`);
    if (g.tipo === 'classifica' && list(rel, w, g.rodadas, 1)) for (const r of g.rodadas) {
      skillOk(rel, w, r.skill);
      if (list(rel, `${w} / ${r.nome}`, r.caixas, 2) && list(rel, `${w} / ${r.nome}`, r.itens, 4)) for (const [n, c] of r.itens) if (!r.caixas.includes(c)) err(rel, `${w}: "${n}" está na caixa "${c}", que não existe`);
    }
    if (g.tipo === 'linha' && list(rel, w, g.rodadas, 1)) for (const r of g.rodadas) { skillOk(rel, w, r.skill); list(rel, `${w} / ${r.nome}`, r.fatos, 4); }
    if (g.tipo === 'mapa' && list(rel, w, g.niveis, 1)) for (const n of g.niveis) {
      if (mapa && !mapa.regioes[n.regiao]) err(rel, `${w}: região "${n.regiao}" não existe no mapa`);
      if (list(rel, `${w} / ${n.nome}`, n.alvos, 3) && mapa) for (const a of n.alvos) if (!(n.por === 'continente' ? mapa.continentes[a] : mapa.paises[a])) err(rel, `${w}: alvo "${a}" não existe no mapa`);
    }
    if (g.tipo === 'pintor' && list(rel, w, g.obras, 4)) for (const o of g.obras) {
      if (!o.pintor || !o.titulo || !o.img) err(rel, `${w}: obra precisa de "pintor", "titulo" e "img"`);
      else if (!fs.existsSync(path.join(ROOT, 'data', o.img))) err(rel, `${w}: imagem data/${o.img} não encontrada`);
      if (!o.licenca || !/^https:\/\//.test(o.fonte || '')) err(rel, `${w}: obra "${o.titulo}" precisa de "fonte" (https) e "licenca"`);
    }
    if (g.tipo === 'pistas' && list(rel, w, g.itens, 4)) for (const it of g.itens) {
      skillOk(rel, w, it.skill);
      if (!it.resposta || !Array.isArray(it.pistas) || !it.pistas.length || !Array.isArray(it.erradas) || it.erradas.length < 2) err(rel, `${w}: "${it.resposta}" precisa de pistas e 2+ erradas`);
    }
    if (g.tipo === 'ouvir' && list(rel, w, g.grupos, 1)) for (const gr of g.grupos) list(rel, `${w} / ${gr.nome}`, gr.itens, 4);
    if (g.tipo === 'memoria' && list(rel, w, g.rodadas, 1)) for (const r of g.rodadas) { skillOk(rel, w, r.skill); list(rel, `${w} / ${r.nome}`, r.pares, 4); }
  }
}

// ---------- Simulados por ano ----------
const sdir = path.join(ROOT, 'data/simulados');
let nSim = 0;
for (const name of fs.existsSync(sdir) ? fs.readdirSync(sdir).filter((f) => f.endsWith('.json')).sort() : []) {
  const rel = `data/simulados/${name}`;
  const data = readJson(rel);
  if (!data) continue;
  const m = name.match(/^ano([1-9])\.json$/);
  if (!m || data.ano !== Number(m[1])) err(rel, 'o nome deve ser anoN.json e "ano" deve ser N');
  const sids = new Set();
  for (const sim of data.simulados || []) {
    nSim++;
    if (!sim.id || sids.has(sim.id)) err(rel, `simulado sem id ou id repetido: ${sim.id}`);
    sids.add(sim.id);
    if (!sim.titulo) err(rel, `${sim.id}: falta "titulo"`);
    for (const [subj, qs] of Object.entries(sim.questoes || {})) {
      if (!SUBJECTS.includes(subj)) err(rel, `${sim.id}: matéria desconhecida "${subj}"`);
      for (const [i, q] of (qs || []).entries()) {
        const [text, opts, , skill] = q;
        if (!text || !Array.isArray(opts) || opts.length < 3) err(rel, `${sim.id} / ${subj} ${i + 1}: use [enunciado, [certa, erradas...], explicação, habilidade]`);
        else if (new Set(opts).size !== opts.length) err(rel, `${sim.id} / ${subj} ${i + 1}: alternativas repetidas`);
        skillOk(rel, `${sim.id} / ${subj} ${i + 1}`, skill);
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
console.log(errors.length ? `\n${errors.length} erro(s). Corrija antes de publicar.` : `\nConteúdo OK (${codes.size} habilidades BNCC, ${ids.size} passos escritos, ${nJogos} jogos, ${nSim} simulados).`);
process.exit(errors.length ? 1 : 0);
