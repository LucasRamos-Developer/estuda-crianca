#!/usr/bin/env node
// Gera data/mapas/mundo.json (mapa-múndi em SVG para o jogo "Onde fica?").
// Fonte: Natural Earth 110m (domínio público), pelo pacote world-atlas@2.0.2:
//   curl -L -o countries-110m.json https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json
// Uso: node tools/gerar-mapa.mjs countries-110m.json
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = process.argv[2];
if (!src) { console.log('Uso: node tools/gerar-mapa.mjs countries-110m.json'); process.exit(1); }
const topo = JSON.parse(fs.readFileSync(src, 'utf8'));

// Continentes: am (América), eu (Europa), af (África), as (Ásia), oc (Oceania), an (Antártida)
const CONT = { am: 'América', eu: 'Europa', af: 'África', as: 'Ásia', oc: 'Oceania', an: 'Antártida' };
// Parte da América (para o nível "América do Sul")
const SUL = ['032', '068', '076', '152', '170', '218', '238', '328', '600', '604', '740', '858', '862'];
// id ISO numérico -> [nome em português, continente]
const PAISES = {
  '004': ['Afeganistão', 'as'], '008': ['Albânia', 'eu'], '010': ['Antártida', 'an'], '012': ['Argélia', 'af'],
  '024': ['Angola', 'af'], '031': ['Azerbaijão', 'as'], '032': ['Argentina', 'am'], '036': ['Austrália', 'oc'],
  '040': ['Áustria', 'eu'], '044': ['Bahamas', 'am'], '050': ['Bangladesh', 'as'], '051': ['Armênia', 'as'],
  '056': ['Bélgica', 'eu'], '064': ['Butão', 'as'], '068': ['Bolívia', 'am'], '070': ['Bósnia e Herzegovina', 'eu'],
  '072': ['Botsuana', 'af'], '076': ['Brasil', 'am'], '084': ['Belize', 'am'], '090': ['Ilhas Salomão', 'oc'],
  '096': ['Brunei', 'as'], '100': ['Bulgária', 'eu'], '104': ['Mianmar', 'as'], '108': ['Burundi', 'af'],
  '112': ['Belarus', 'eu'], '116': ['Camboja', 'as'], '120': ['Camarões', 'af'], '124': ['Canadá', 'am'],
  '140': ['República Centro-Africana', 'af'], '144': ['Sri Lanka', 'as'], '148': ['Chade', 'af'], '152': ['Chile', 'am'],
  '156': ['China', 'as'], '158': ['Taiwan', 'as'], '170': ['Colômbia', 'am'], '178': ['Congo', 'af'],
  '180': ['República Democrática do Congo', 'af'], '188': ['Costa Rica', 'am'], '191': ['Croácia', 'eu'], '192': ['Cuba', 'am'],
  '196': ['Chipre', 'as'], '203': ['Tchéquia', 'eu'], '204': ['Benin', 'af'], '208': ['Dinamarca', 'eu'],
  '214': ['República Dominicana', 'am'], '218': ['Equador', 'am'], '222': ['El Salvador', 'am'], '226': ['Guiné Equatorial', 'af'],
  '231': ['Etiópia', 'af'], '232': ['Eritreia', 'af'], '233': ['Estônia', 'eu'], '238': ['Ilhas Malvinas', 'am'],
  '242': ['Fiji', 'oc'], '246': ['Finlândia', 'eu'], '250': ['França', 'eu'], '260': ['Terras Austrais Francesas', 'an'],
  '262': ['Djibuti', 'af'], '266': ['Gabão', 'af'], '268': ['Geórgia', 'as'], '270': ['Gâmbia', 'af'],
  '275': ['Palestina', 'as'], '276': ['Alemanha', 'eu'], '288': ['Gana', 'af'], '300': ['Grécia', 'eu'],
  '304': ['Groenlândia', 'am'], '320': ['Guatemala', 'am'], '324': ['Guiné', 'af'], '328': ['Guiana', 'am'],
  '332': ['Haiti', 'am'], '340': ['Honduras', 'am'], '348': ['Hungria', 'eu'], '352': ['Islândia', 'eu'],
  '356': ['Índia', 'as'], '360': ['Indonésia', 'as'], '364': ['Irã', 'as'], '368': ['Iraque', 'as'],
  '372': ['Irlanda', 'eu'], '376': ['Israel', 'as'], '380': ['Itália', 'eu'], '384': ['Costa do Marfim', 'af'],
  '388': ['Jamaica', 'am'], '392': ['Japão', 'as'], '398': ['Cazaquistão', 'as'], '400': ['Jordânia', 'as'],
  '404': ['Quênia', 'af'], '408': ['Coreia do Norte', 'as'], '410': ['Coreia do Sul', 'as'], '414': ['Kuwait', 'as'],
  '417': ['Quirguistão', 'as'], '418': ['Laos', 'as'], '422': ['Líbano', 'as'], '426': ['Lesoto', 'af'],
  '428': ['Letônia', 'eu'], '430': ['Libéria', 'af'], '434': ['Líbia', 'af'], '440': ['Lituânia', 'eu'],
  '442': ['Luxemburgo', 'eu'], '450': ['Madagascar', 'af'], '454': ['Malawi', 'af'], '458': ['Malásia', 'as'],
  '466': ['Mali', 'af'], '478': ['Mauritânia', 'af'], '484': ['México', 'am'], '496': ['Mongólia', 'as'],
  '498': ['Moldávia', 'eu'], '499': ['Montenegro', 'eu'], '504': ['Marrocos', 'af'], '508': ['Moçambique', 'af'],
  '512': ['Omã', 'as'], '516': ['Namíbia', 'af'], '524': ['Nepal', 'as'], '528': ['Países Baixos', 'eu'],
  '540': ['Nova Caledônia', 'oc'], '548': ['Vanuatu', 'oc'], '554': ['Nova Zelândia', 'oc'], '558': ['Nicarágua', 'am'],
  '562': ['Níger', 'af'], '566': ['Nigéria', 'af'], '578': ['Noruega', 'eu'], '586': ['Paquistão', 'as'],
  '591': ['Panamá', 'am'], '598': ['Papua-Nova Guiné', 'oc'], '600': ['Paraguai', 'am'], '604': ['Peru', 'am'],
  '608': ['Filipinas', 'as'], '616': ['Polônia', 'eu'], '620': ['Portugal', 'eu'], '624': ['Guiné-Bissau', 'af'],
  '626': ['Timor-Leste', 'as'], '630': ['Porto Rico', 'am'], '634': ['Catar', 'as'], '642': ['Romênia', 'eu'],
  '643': ['Rússia', 'eu'], '646': ['Ruanda', 'af'], '682': ['Arábia Saudita', 'as'], '686': ['Senegal', 'af'],
  '688': ['Sérvia', 'eu'], '694': ['Serra Leoa', 'af'], '703': ['Eslováquia', 'eu'], '704': ['Vietnã', 'as'],
  '705': ['Eslovênia', 'eu'], '706': ['Somália', 'af'], '710': ['África do Sul', 'af'], '716': ['Zimbábue', 'af'],
  '724': ['Espanha', 'eu'], '728': ['Sudão do Sul', 'af'], '729': ['Sudão', 'af'], '732': ['Saara Ocidental', 'af'],
  '740': ['Suriname', 'am'], '748': ['Essuatíni', 'af'], '752': ['Suécia', 'eu'], '756': ['Suíça', 'eu'],
  '760': ['Síria', 'as'], '762': ['Tadjiquistão', 'as'], '764': ['Tailândia', 'as'], '768': ['Togo', 'af'],
  '780': ['Trinidad e Tobago', 'am'], '784': ['Emirados Árabes Unidos', 'as'], '788': ['Tunísia', 'af'], '792': ['Turquia', 'as'],
  '795': ['Turcomenistão', 'as'], '800': ['Uganda', 'af'], '804': ['Ucrânia', 'eu'], '807': ['Macedônia do Norte', 'eu'],
  '818': ['Egito', 'af'], '826': ['Reino Unido', 'eu'], '834': ['Tanzânia', 'af'], '840': ['Estados Unidos', 'am'],
  '854': ['Burkina Faso', 'af'], '858': ['Uruguai', 'am'], '860': ['Uzbequistão', 'as'], '862': ['Venezuela', 'am'],
  '887': ['Iêmen', 'as'], '894': ['Zâmbia', 'af'],
};
// Sem id no arquivo de origem (usamos o nome): Kosovo, Chipre do Norte, Somalilândia
const SEM_ID = { Kosovo: ['xk', 'Kosovo', 'eu'], 'N. Cyprus': ['xnc', 'Chipre do Norte', 'as'], Somaliland: ['xso', 'Somalilândia', 'af'] };

// ---------- Projeção de Miller, ajustada a 1000 de largura ----------
const W = 1000;
const LAT_MIN = -76; // corta o fundo da Antártida (fica uma faixa para tocar)
const LAT_MAX = 84;
const millerY = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * (lat * Math.PI / 180)));
const K = W / (2 * Math.PI);
const Y0 = millerY(LAT_MAX);
const project = ([lon, lat]) => {
  const la = Math.max(LAT_MIN, Math.min(LAT_MAX, lat));
  return [(lon + 180) / 360 * W, (Y0 - millerY(la)) * K];
};
const H = Math.round((Y0 - millerY(LAT_MIN)) * K);

// ---------- Decodificação do TopoJSON ----------
const { scale, translate } = topo.transform;
const arcs = topo.arcs.map((arc) => {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * scale[0] + translate[0], y * scale[1] + translate[1]]; });
});
const arcPts = (i) => (i >= 0 ? arcs[i] : arcs[~i].slice().reverse());
function ring(idxs) {
  const pts = [];
  idxs.forEach((i, k) => { const a = arcPts(i); pts.push(...(k ? a.slice(1) : a)); });
  // Anéis que cruzam a linha de data (Rússia, Fiji): mantém a longitude contínua para não riscar o mapa
  let off = 0;
  return pts.map(([lon, lat], k) => {
    if (k) {
      const prev = pts[k - 1][0];
      if (lon - prev > 180) off -= 360;
      else if (prev - lon > 180) off += 360;
    }
    return [lon + off, lat];
  });
}
const r1 = (v) => Math.round(v * 10) / 10;
function ringPath(pts) {
  let d = '';
  let prev = null;
  for (const p of pts.map(project)) {
    const q = [r1(p[0]), r1(p[1])];
    if (prev && q[0] === prev[0] && q[1] === prev[1]) continue;
    d += prev ? `L${q[0]} ${q[1]}` : `M${q[0]} ${q[1]}`;
    prev = q;
  }
  return `${d}Z`;
}
// Comprime "L" repetidos (SVG aceita coordenadas seguidas sem a letra)
const compact = (d) => d.replace(/L/g, ' ').replace(/ -/g, '-');

const out = { versao: new Date().toISOString().slice(0, 10), fonte: 'Natural Earth 110m (domínio público), via world-atlas@2.0.2', largura: W, altura: H, continentes: CONT, paises: {} };
for (const g of topo.objects.countries.geometries) {
  let id = g.id;
  let info = PAISES[id];
  if (!info && SEM_ID[g.properties.name]) { const [i, n, c] = SEM_ID[g.properties.name]; id = i; info = [n, c]; }
  if (!info) { console.log(`sem nome: ${g.id} ${g.properties.name}`); continue; }
  const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
  const d = polys.map((poly) => poly.map((r) => ringPath(ring(r))).join('')).join('');
  // Caixa (para centralizar e para saber se é pequeno demais para tocar)
  const xs = [], ys = [];
  for (const poly of polys) for (const p of ring(poly[0]).map(project)) { xs.push(p[0]); ys.push(p[1]); }
  const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(Math.round);
  out.paises[id] = { nome: info[0], cont: info[1], ...(SUL.includes(id) ? { sul: true } : {}), box, d: compact(d) };
}
// Regiões para aproximar o mapa: [x, y, largura, altura]
const reg = (lon0, lat1, lon1, lat0) => { const [x0, y0] = project([lon0, lat1]); const [x1, y1] = project([lon1, lat0]); return [x0, y0, x1 - x0, y1 - y0].map(Math.round); };
out.regioes = {
  mundo: [0, 0, W, H],
  'america-do-sul': reg(-95, 15, -30, -58),
  america: reg(-170, 84, -25, -58),
  europa: reg(-25, 72, 45, 34),
  africa: reg(-20, 38, 55, -36),
  asia: reg(25, 78, 150, -12),
  oceania: reg(110, 0, 180, -50),
};
const dest = path.join(ROOT, 'data/mapas/mundo.json');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out));
console.log(`${dest}: ${Object.keys(out.paises).length} países, ${Math.round(fs.statSync(dest).size / 1024)} KB, ${W}x${H}`);
