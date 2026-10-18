// Jogos por matéria: monta as perguntas a partir de data/jogos/anoN.json e desenha os modos especiais
// (soletrar, linha do tempo, mapa, jogo da memória). Os demais jogos usam escolha e teclado numérico.
import * as E from './engine.js';
import * as C from './curriculum.js';
import { icon } from './icons.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = (a) => E.shuffle(a.slice());
const pickN = (arr, n) => shuffle(arr).slice(0, n);
const norm = (s) => String(s ?? '').trim().toLowerCase();
const plain = (s) => norm(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
const brl = (v) => `R$ ${v}`;

export const GAME_ICON = { soletrando: 'pencil', mercadinho: 'cart', classifica: 'sort', linha: 'timeline', mapa: 'pin', pintor: 'image', pistas: 'question', ouvir: 'headphones', memoria: 'cards' };

let hooks = { render: () => {}, speak: () => {} };
export function init(h) { hooks = { ...hooks, ...h }; }

// Níveis que a criança pode escolher antes de jogar
export function levels(g) {
  if (g.niveis) return g.niveis.map((n) => n.nome);
  if (g.rodadas) return g.rodadas.map((r) => r.nome);
  if (g.grupos) return g.grupos.map((r) => r.nome);
  return [];
}
// level = índice do nível ou -1 para misturar todos
const chosen = (list, level) => (level >= 0 && list[level] ? [list[level]] : list);

// ---------- Montagem das perguntas ----------
export function build(g, level = -1) {
  const B = BUILD[g.tipo];
  return B ? B(g, level) : [];
}

const BUILD = {
  soletrando(g, level) {
    const pool = chosen(g.niveis, level).flatMap((n) => n.itens.map(([palavra, frase]) => ({ palavra, frase, skill: n.skill })));
    return pickN(pool, 8).map(({ palavra, frase, skill }) => {
      const blank = frase.replace(new RegExp(palavra, 'i'), '_'.repeat(palavra.length));
      return {
        game: true, kind: 'game', mode: 'spell', title: 'Ouça e escreva', text: blank, answer: palavra,
        say: { text: `${palavra}. ${frase} ${palavra}.`, lang: 'pt-BR' }, solution: palavra, skill,
      };
    });
  },

  mercadinho(g) {
    const P = g.produtos;
    const prod = (max = 99) => { const list = P.filter(([, p]) => p <= max); return list[Math.floor(Math.random() * list.length)]; };
    const types = shuffle(['total', 'total', 'troco', 'troco', 'vezes', 'vezes', 'notas', 'troco']);
    return types.map((t) => {
      if (t === 'total') {
        let [a, pa] = prod(30), [b, pb] = prod(30);
        while (b === a) [b, pb] = prod(30);
        return shop(`Comprei ${a} e ${b}. Quanto gastei?`, [[a, pa], [b, pb]], pa + pb, `${brl(pa + pb)} (${pa} + ${pb})`, 'EF03MA05');
      }
      if (t === 'troco') {
        const [a, pa] = prod(60);
        const nota = g.notas.find((n) => n > pa && n >= 5) || 100;
        return shop(`Comprei ${a} e paguei com uma nota de ${brl(nota)}. Quanto recebo de troco?`, [[a, pa]], nota - pa, `${brl(nota - pa)} (${nota} − ${pa})`, 'EF03MA24');
      }
      if (t === 'vezes') {
        const [a, pa] = prod(10);
        const k = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
        return shop(`Comprei ${k} unidades de ${a}, cada uma por ${brl(pa)}. Quanto gastei?`, [[a, pa]], k * pa, `${brl(k * pa)} (${k} × ${pa})`, 'EF03MA07');
      }
      const [small, big] = [[2, 10], [5, 20], [10, 50], [5, 10], [2, 20], [10, 100], [20, 100], [50, 100]][Math.floor(Math.random() * 8)];
      return shop(`Quantas notas de ${brl(small)} são precisas para formar ${brl(big)}?`, [], big / small, `${big / small} notas (${big / small} × ${small} = ${big})`, 'EF03MA24');
    });
  },

  classifica(g, level) {
    const rounds = chosen(g.rodadas, level);
    const pool = rounds.flatMap((r) => r.itens.map(([nome, caixa, why]) => ({ nome, caixa, why, r })));
    return pickN(pool, 10).map(({ nome, caixa, why, r }) => ({
      game: true, kind: 'game', mode: 'choice', fixed: true, title: r.nome, word: nome,
      options: r.caixas.slice(), answer: caixa, solution: caixa, note: why || '', skill: r.skill,
    }));
  },

  linha(g, level) {
    const rounds = chosen(g.rodadas, level);
    return Array.from({ length: 5 }, (_, i) => {
      const r = rounds[i % rounds.length];
      const n = Math.min(r.fatos.length, i < 2 ? 4 : 5);
      const idx = shuffle(r.fatos.map((_, k) => k)).slice(0, n).sort((a, b) => a - b);
      const facts = idx.map((k, rank) => ({ t: r.fatos[k][0], l: r.fatos[k][1], rank }));
      return {
        game: true, kind: 'game', mode: 'order', title: r.nome, text: 'Toque nos fatos do mais antigo para o mais recente.',
        items: shuffle(facts), answer: facts.map((f) => f.rank), solution: 'Veja a ordem certa acima.', skill: r.skill,
      };
    });
  },

  mapa(g, level) {
    const M = C.worldMap();
    if (!M) return [];
    const lv = chosen(g.niveis, level);
    const pool = lv.flatMap((n) => n.alvos.filter((id) => n.por === 'continente' ? M.continentes[id] : M.paises[id]).map((id) => ({ id, n })));
    return pickN(pool, Math.min(8, pool.length)).map(({ id, n }) => {
      const byCont = n.por === 'continente';
      const nome = byCont ? M.continentes[id] : M.paises[id].nome;
      return {
        game: true, kind: 'game', mode: 'map', title: byCont ? 'Onde fica o continente?' : 'Onde fica o país?', text: nome,
        region: n.regiao, byCont, answer: id, solution: nome, note: n.dica || '', skill: g.skill,
      };
    });
  },

  pintor(g) {
    const painters = [...new Set([...(g.pintores || []), ...g.obras.map((o) => o.pintor)])];
    const art = pickN(g.obras, 6).map((o) => ({
      game: true, kind: 'game', mode: 'choice', title: 'Quem pintou?', text: o.titulo ? `Obra: ${o.titulo}` : '',
      img: `./data/${o.img}`, imgAlt: o.titulo, options: shuffle([o.pintor, ...pickN(painters.filter((p) => p !== o.pintor), 3)]),
      answer: o.pintor, solution: o.pintor, note: `${o.titulo} (${o.ano}). ${o.curiosidade}`, skill: g.skill,
    }));
    const text = pickN(g.texto || [], 2).map(([t, opts, why]) => ({
      game: true, kind: 'game', mode: 'choice', title: 'Quem pintou?', text: t, options: shuffle(opts), answer: opts[0],
      solution: opts[0], note: why || '', skill: g.skill,
    }));
    return shuffle([...art, ...text]);
  },

  pistas(g) {
    return pickN(g.itens, 6).map((it) => ({
      game: true, kind: 'game', mode: 'choice', title: 'Adivinha!', text: 'Que brincadeira, jogo ou esporte é este?',
      clues: it.pistas, options: shuffle([it.resposta, ...it.erradas]), answer: it.resposta, solution: it.resposta, skill: it.skill,
    }));
  },

  ouvir(g, level) {
    const groups = chosen(g.grupos, level);
    const pool = groups.flatMap((gr) => gr.itens.map(([en, pt]) => ({ en, pt, gr })));
    return pickN(pool, 8).map(({ en, pt, gr }) => ({
      game: true, kind: 'game', mode: 'choice', title: 'Listen and pick', text: 'O que quer dizer?', word: en,
      say: { text: en, lang: 'en-US' }, options: shuffle([pt, ...pickN(gr.itens.map((x) => x[1]).filter((x) => x !== pt), 3)]),
      answer: pt, solution: `${en} = ${pt}`, skill: g.skill || null,
    }));
  },

  memoria(g, level) {
    const rounds = chosen(g.rodadas, level);
    return Array.from({ length: 3 }, (_, i) => {
      const r = rounds[i % rounds.length];
      const pairs = pickN(r.pares, 4);
      return {
        game: true, kind: 'game', mode: 'pairs', title: r.nome, text: 'Encontre os pares: toque em duas cartas.',
        cards: shuffle(pairs.flatMap(([a, b], p) => [{ t: a, p }, { t: b, p }])), pairs,
        answer: true, solution: pairs.map(([a, b]) => `${a}: ${b}`).join(' · '), skill: r.skill,
      };
    });
  },
};

function shop(text, items, answer, solution, skill) {
  return { game: true, kind: 'game', mode: 'keypad', title: 'Mercadinho', text, chips: items.map(([n, p]) => [n, brl(p)]), answer, solution, skill };
}

// ---------- Estado por pergunta ----------
export function prepare(s) {
  s.order = [];
  s.mapSel = null;
  s.pf = [];
  s.pm = [];
  s.miss = 0;
  s.clue = 1;
  s.lockPairs = false;
}

// ---------- Desenho ----------
export function card(q, s) {
  const say = q.say ? `<button class="speak-btn big spk" data-a="g-say" aria-label="Ouvir de novo"><span class="when-off">${icon('speaker', 30)}</span><span class="when-on">${icon('stop', 30)}</span></button>` : '';
  if (q.mode === 'spell') {
    return `<div class="q-card game-card">${say}<p class="muted">Ouça a palavra e escreva.</p><p class="story">${esc(q.text)}</p><small class="muted">${q.answer.length} letras</small></div>`;
  }
  if (q.mode === 'map') return `<div class="q-card game-card slim"><p class="muted">Toque no mapa:</p><div class="expr-big word">${esc(q.text)}</div></div>`;
  if (q.mode === 'order' || q.mode === 'pairs') return `<p class="story center">${esc(q.text)}</p>`;
  if (q.img) {
    return `<figure class="art-card"><img src="${esc(q.img)}" alt="${esc(q.imgAlt || 'Obra de arte')}" loading="eager"></figure>${q.text ? `<p class="muted center">${esc(q.text)}</p>` : ''}`;
  }
  if (q.clues) {
    const shown = q.clues.slice(0, s.clue);
    const fb = s.phase === 'feedback';
    return `<div class="q-card game-card left"><p class="story">${esc(q.text)}</p>
      <ol class="clues">${shown.map((c) => `<li>${esc(c)}</li>`).join('')}</ol>
      ${!fb && s.clue < q.clues.length ? `<button class="btn white sm" data-a="clue-more">${icon('bulb', 18)} Mais uma pista</button>` : ''}</div>`;
  }
  if (q.chips) {
    return `<div class="q-card game-card"><p class="story">${esc(q.text)}</p>${q.chips.length ? `<div class="chips">${q.chips.map(([n, p]) => `<span class="price"><b>${esc(n)}</b>${esc(p)}</span>`).join('')}</div>` : ''}</div>`;
  }
  if (q.word) return `<div class="q-card game-card">${say}<div class="expr-big word">${esc(q.word)}</div>${q.text && q.say ? `<p class="muted">${esc(q.text)}</p>` : ''}</div>`;
  return `<div class="q-card"><p class="story">${esc(q.text)}</p></div>`;
}

// Área de resposta dos modos especiais (null = usa a padrão do app)
export function answer(q, s) {
  const fb = s.phase === 'feedback';
  if (q.mode === 'spell') {
    const cls = fb ? (s.lastOk ? 'right' : 'wrong') : s.input ? '' : 'empty';
    return `<div class="answer-zone"><div class="answer-box word ${cls}">${esc(s.input) || '?'}</div>${fb ? '' : letterPad()}</div>`;
  }
  if (q.mode === 'order') {
    const n = q.items.length;
    if (fb) {
      const right = q.items.slice().sort((a, b) => a.rank - b.rank);
      return `<ol class="order-list result">${right.map((f, i) => {
        const okHere = q.items[s.order[i]]?.rank === i;
        return `<li class="${okHere ? 'right' : 'wrong'}"><span class="num">${i + 1}</span><span class="grow">${esc(f.t)}</span><small>${esc(f.l)}</small></li>`;
      }).join('')}</ol>`;
    }
    const slots = Array.from({ length: n }, (_, i) => {
      const k = s.order[i];
      return k == null ? `<li class="empty"><span class="num">${i + 1}</span><span class="grow muted">…</span></li>`
        : `<li><button data-a="ord-undo" data-v="${i}"><span class="num">${i + 1}</span><span class="grow">${esc(q.items[k].t)}</span>${icon('x', 18)}</button></li>`;
    }).join('');
    const left = q.items.map((f, k) => (s.order.includes(k) ? '' : `<button class="option" data-a="ord-pick" data-v="${k}">${esc(f.t)}</button>`)).join('');
    return `<ol class="order-list">${slots}</ol><div class="choices text-opts">${left}</div>`;
  }
  if (q.mode === 'map') return mapSvg(q, s, fb);
  if (q.mode === 'pairs') {
    return `<div class="pairs">${q.cards.map((c, i) => {
      const done = s.pm.includes(c.p);
      const open = done || s.pf.includes(i) || fb;
      return `<button class="pcard ${open ? 'open' : ''} ${done ? 'done' : ''}" data-a="pair-flip" data-v="${i}" ${done || fb ? 'disabled' : ''}>${open ? esc(c.t) : icon('cards', 26)}</button>`;
    }).join('')}</div><p class="muted center small">Erros: ${s.miss}</p>`;
  }
  return null;
}

const LETTERS = ['abcdefghi', 'jklmnopqr', 'stuvwxyzç', 'áâãéêíóôõú'];
function letterPad() {
  return `<div class="letterpad">${LETTERS.map((row) => `<div class="lp-row">${[...row].map((ch) => `<button data-a="sp-key" data-v="${ch}">${ch}</button>`).join('')}</div>`).join('')}
    <div class="lp-row"><button class="wide del" data-a="sp-del" aria-label="Apagar">${icon('backspace', 24)} Apagar</button></div></div>`;
}

// Continentes: Rússia e Turquia ficam em dois
const EXTRA_CONT = { 643: ['as'], 792: ['eu'] };
const contsOf = (id, p) => [p.cont, ...(EXTRA_CONT[id] || [])];
function inBox(b, [x, y, w, h]) { return b[2] >= x && b[0] <= x + w && b[3] >= y && b[1] <= y + h; }
function mapSvg(q, s, fb) {
  const M = C.worldMap();
  if (!M) return '<p class="muted">Mapa indisponível.</p>';
  const reg = M.regioes[q.region] || M.regioes.mundo;
  const selP = s.mapSel ? M.paises[s.mapSel] : null;
  const paths = Object.entries(M.paises).filter(([, p]) => inBox(p.box, reg)).map(([id, p]) => {
    const hit = q.byCont ? contsOf(id, p).includes(q.answer) : id === q.answer;
    let cls = q.byCont ? `ct-${p.cont}` : (q.region === 'america-do-sul' && !p.sul ? 'far' : '');
    if (fb) { if (hit) cls += ' right'; else if (id === s.mapSel) cls += ' wrong'; }
    else if (selP && (q.byCont ? p.cont === selP.cont : id === s.mapSel)) cls += ' sel';
    return `<path d="${p.d}" class="${cls}" data-a="map-pick" data-v="${id}"/>`;
  }).join('');
  const name = fb && s.mapSel && !s.lastOk ? `<p class="muted center small">Você tocou em: ${esc(q.byCont ? M.continentes[selP.cont] : selP.nome)}</p>` : '';
  return `<div class="map-wrap"><svg class="map" viewBox="${reg.join(' ')}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa">${paths}</svg></div>${name}`;
}

// ---------- Resposta ----------
export function value(q, s) {
  if (q.mode === 'spell') return s.input ? s.input : null;
  if (q.mode === 'order') return s.order.length === q.items.length ? s.order : null;
  if (q.mode === 'map') return s.mapSel;
  if (q.mode === 'pairs') return s.pm.length === q.pairs.length ? true : null;
  return undefined;
}

export function isRight(q, v, s) {
  if (q.mode === 'spell') return norm(v) === norm(q.answer);
  if (q.mode === 'order') return v.every((k, i) => q.items[k].rank === i);
  if (q.mode === 'map') {
    const p = C.worldMap()?.paises[v];
    return !!p && (q.byCont ? contsOf(v, p).includes(q.answer) : v === q.answer);
  }
  if (q.mode === 'pairs') return s.miss <= q.pairs.length;
  return v === q.answer;
}

// Texto extra na correção
export function feedbackNote(q, v, s) {
  if (q.mode === 'spell' && v && plain(v) === plain(q.answer) && norm(v) !== norm(q.answer)) return 'Quase! Só faltou acertar o acento.';
  if (q.mode === 'pairs') return `${s.miss} ${s.miss === 1 ? 'erro' : 'erros'} para achar ${q.pairs.length} pares.`;
  if (q.clues && s.lastOk) return s.clue === 1 ? 'Acertou com uma pista só!' : `Acertou com ${s.clue} pistas.`;
  return q.note || '';
}

// ---------- Toques e teclado ----------
// Retorna 'render', 'check' ou null (não é deste módulo)
export function action(a, v, s) {
  const q = s.q;
  if (a === 'g-say') { if (q.say) hooks.speak(q.say.text, q.say.lang, true); return null; }
  if (s.phase !== 'ask') return null;
  switch (a) {
    case 'sp-key': if (s.input.length < 24) s.input += v; return 'render';
    case 'sp-del': s.input = s.input.slice(0, -1); return 'render';
    case 'ord-pick': if (!s.order.includes(Number(v))) s.order.push(Number(v)); return 'render';
    case 'ord-undo': s.order.splice(Number(v), 1); return 'render';
    case 'map-pick': s.mapSel = v; return 'render';
    case 'clue-more': s.clue = Math.min(q.clues.length, s.clue + 1); return 'render';
    case 'pair-flip': {
      const i = Number(v);
      if (s.lockPairs || s.pf.includes(i) || s.pm.includes(q.cards[i].p)) return null;
      s.pf.push(i);
      if (s.pf.length === 2) {
        const [x, y] = s.pf;
        if (q.cards[x].p === q.cards[y].p) {
          s.pm.push(q.cards[x].p);
          s.pf = [];
          if (s.pm.length === q.pairs.length) return 'check';
        } else {
          s.miss++;
          s.lockPairs = true;
          setTimeout(() => { if (s.q !== q) return; s.pf = []; s.lockPairs = false; hooks.render(); }, 1000);
        }
      }
      return 'render';
    }
    default: return null;
  }
}

export function key(ev, s) {
  if (s.q.mode !== 'spell') return false;
  if (ev.key === 'Backspace') { s.input = s.input.slice(0, -1); return true; }
  if (ev.key.length === 1 && /[a-zà-üç]/i.test(ev.key) && s.input.length < 24) { s.input += ev.key.toLowerCase(); return true; }
  return false;
}
