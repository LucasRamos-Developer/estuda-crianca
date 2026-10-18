#!/usr/bin/env python3
# Gera roadmap/N-ano.md a partir de data/bncc.json, dos JSON do app (conteúdo, jogos, simulados)
# e do mapeamento do currículo de Joinville por trimestre (abaixo, por enquanto só do 3º ano).
# Uso: python3 tools/gerar-roadmap.py
# Os textos de README.md, jogos.md e simulados.md são escritos à mão e não são alterados.
import json, os, sys, re

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bncc = {c: (comp, years, text) for c, comp, years, text in json.load(open(f'{ROOT}/data/bncc.json'))}

COMPS = [('ma', 'MA', 'Matemática'), ('lp', 'LP', 'Língua Portuguesa'), ('ci', 'CI', 'Ciências'), ('hi', 'HI', 'História'),
         ('ge', 'GE', 'Geografia'), ('ar', 'AR', 'Arte'), ('ef', 'EF', 'Educação Física'), ('li', 'LI', 'Língua Inglesa'), ('er', 'ER', 'Ensino Religioso')]

# Páginas do PDF de cada área do currículo de Joinville (2022) onde começa cada ano
PDF = {
    'ma': ('5. Área: Matemática', {1: '6–16', 2: '17–30', 3: '31–42', 4: '43–58', 5: '59–70', 6: '71–79', 7: '80–87', 8: '88–93', 9: '94–100'}),
    'lp': ('4. Área: Linguagens', {1: '9–23', 2: '24–43', 3: '44–63', 4: '64–85', 5: '86–106', 6: '107–129', 7: '130–162', 8: '163–195', 9: '196–228'}),
    'ef': ('4. Área: Linguagens', {1: '233–238', 2: '239–244', 3: '245–250', 4: '251–257', 5: '258–265', 6: '266–275', 7: '276–285', 8: '286–293', 9: '294–307'}),
    'ar': ('4. Área: Linguagens', {1: '308–317', 2: '318–325', 3: '326–333', 4: '334–342', 5: '343–350', 6: '351–360', 7: '361–367', 8: '368–376', 9: '377–392'}),
    'li': ('4. Área: Linguagens', {3: '393–397', 4: '398–402', 5: '403–407', 6: '408–418', 7: '419–430', 8: '431–440', 9: '441–454'}),
    'ci': ('6. Área: Ciências da Natureza', {1: '5–6', 2: '7–8', 3: '9–11', 4: '12–14', 5: '15–17', 6: '18–20', 7: '21–24', 8: '25–28', 9: '29–32'}),
    'ge': ('7. Área: Ciências Humanas', {1: '4', 2: '7–9', 3: '10–12', 4: '13–15', 5: '16–18', 6: '19–21', 7: '22–26', 8: '27–32', 9: '33–37'}),
    'hi': ('7. Área: Ciências Humanas', {1: '42–43', 2: '44–46', 3: '47–50', 4: '51–54', 5: '55–57', 6: '58–64', 7: '65–69', 8: '70–78', 9: '79–89'}),
    'er': ('8. Área: Ensino Religioso', {1: '3', 2: '4', 3: '5', 4: '6', 5: '7', 6: '8–9', 7: '10–11', 8: '12–13', 9: '14–16'}),
}

# ---------- 3º ano: distribuição por trimestre e classificação (lida do currículo de Joinville) ----------
def T(spec):
    out = []
    for item in spec.split(','):
        code, cls = item.split()
        out.append((code, cls))
    return out

Y3 = {
    'ma': {
        1: ('Números até 3.000; adição e subtração com e sem reagrupamento; sequências; localização e trajetos; figuras planas; unidades de medida; horas; acaso',
            T('EF03MA01 EF,EF03MA02 EF,EF03MA04 AC,EF03MA05 EF,EF03MA06 AF,EF03MA10 EF,EF03MA12 AC,EF03MA15 AF,EF03MA17 AC,EF03MA18 AC,EF03MA23 AF,EF03MA25 AC')),
        2: ('Números até 6.000; fatos básicos; multiplicação por 2, 3, 4, 5 e 10; divisão; metade, terça e quarta parte; igualdade; sólidos; congruência; comprimento; área por superposição; sistema monetário; tabelas e gráficos',
            T('EF03MA01 EF,EF03MA02 EF,EF03MA03 AC,EF03MA07 AF,EF03MA08 AC,EF03MA09 AC,EF03MA11 AC,EF03MA13 AC,EF03MA16 AC,EF03MA19 AF,EF03MA21 AC,EF03MA24 AF,EF03MA26 AF,EF03MA27 AF')),
        3: ('Números até 9.999; multiplicação e divisão; quinta e décima parte; sólidos e planificações; capacidade e massa; duração de eventos; pesquisa com tabelas e gráficos',
            T('EF03MA01 EF,EF03MA02 EF,EF03MA07 AF,EF03MA08 AC,EF03MA09 AC,EF03MA11 AC,EF03MA13 AC,EF03MA14 AF,EF03MA20 AF,EF03MA22 AC,EF03MA28 AF')),
    },
    'lp': {
        0: ('O ano todo: conversa e assembleias, formação do leitor, estratégias de leitura, fluência, produção e revisão de textos',
            T('EF15LP11 AC,EF15LP12 AC,EF35LP02 AC,EF15LP01 AC,EF15LP02 AC,EF15LP03 AC,EF15LP04 AC,EF35LP03 AC,EF35LP04 AC,EF35LP05 AC,EF35LP06 AC,EF35LP01 AC,EF15LP05 AF,EF15LP06 AF,EF15LP07 AF')),
        1: ('Ortografia (c/qu, g/gu, r/rr, s/ss, o/u, e/i, nasalização, dígrafos lh, nh, ch); sílabas e sílaba tônica; adjetivo; textos instrucionais (receitas, regras, instruções de montagem); histórias em quadrinhos; cartas pessoais e diários',
            T('EF03LP01 AC,EF03LP02 AC,EF03LP03 AC,EF03LP05 AC,EF03LP06 AC,EF03LP09 AC,EF03LP11 AF,EF03LP14 AF,EF03LP15 AC,EF03LP16 AC,EF15LP14 AF,EF03LP12 AF,EF03LP13 AF,EF03LP17 AC')),
        2: ('Palavras de grafia irregular e h inicial; acentuação; prefixos e sufixos; cartas do leitor e de reclamação; publicidade e campanhas; telejornal infantil; relatos de observação e pesquisa',
            T('EF35LP13 AC,EF03LP04 AC,EF03LP10 AC,EF03LP18 AF,EF03LP20 AF,EF35LP15 AF,EF03LP23 AC,EF03LP19 AF,EF03LP21 AF,EF03LP22 AF,EF03LP24 AF,EF03LP25 AF,EF03LP26 AC')),
        3: ('Poemas, rimas e poemas visuais; cordel e repentes; declamação; substantivos e verbos; contos de fadas e lendas; narrativas (personagens, enredo, narrador); diálogos e pontuação',
            T('EF15LP17 AF,EF15LP18 AF,EF35LP23 AF,EF35LP31 AF,EF35LP27 AF,EF35LP28 AF,EF03LP27 AF,EF03LP08 AC,EF15LP15 AC,EF15LP19 AF,EF35LP29 AF,EF35LP22 AC,EF03LP07 AC,EF35LP26 AF')),
    },
    'ci': {
        1: ('Matéria e energia: som e luz, audição e visão, sons da natureza e instrumentos, materiais transparentes, translúcidos e opacos, poluição sonora e visual, cuidados com o sol',
            T('EF03CI01 AC,EF03CI02 AC,EF03CI03 AF')),
        2: ('Vida e evolução: características e desenvolvimento dos animais, cadeia alimentar, reprodução, locomoção, habitat, ciclo de vida, biomas catarinenses',
            T('EF03CI04 AF,EF03CI05 AF,EF03CI06 AC')),
        3: ('Terra e Universo: formato da Terra, sistema solar, Lua e fases, estrelas, tipos de solo e seus usos, impactos no solo',
            T('EF03CI07 AF,EF03CI08 AF,EF03CI09 AC,EF03CI10 AC')),
    },
    'hi': {
        1: ('As pessoas e os grupos que formam a cidade: história de Joinville, bairros e comunidades rurais, migrações, povos sambaquianos, indígenas, quilombolas, imigrantes; patrimônio e fontes históricas',
            T('EF03HI01 AC,EF03HI02 AC,EF03HI03 AC,EF03HI04 AC')),
        2: ('O lugar em que vive: marcos de memória (ruas, praças, monumentos, museus), linha do tempo de Joinville, grupos sociais, cidade e campo ontem e hoje',
            T('EF03HI05 AF,EF03HI06 AF,EF03HI07 AF,EF03HI08 AF')),
        3: ('Espaço público e privado: prefeitura e Câmara de Vereadores, áreas de conservação ambiental, trabalho, cultura e lazer na cidade',
            T('EF03HI09 AC,EF03HI10 AC,EF03HI11 AC,EF03HI12 AC')),
    },
    'ge': {
        1: ('O sujeito e seu lugar no mundo: cidade e campo, modos de vida, povos indígenas (Guarani, Kaingang, Xokleng), quilombolas, ribeirinhos, caiçaras',
            T('EF03GE01 AF,EF03GE02 AF,EF03GE03 AF')),
        2: ('Representações cartográficas: maquetes, legendas, mapa mental, roteiros, bairro e município de Joinville; paisagens naturais e transformadas; lixo e consumo',
            T('EF03GE06 AF,EF03GE07 AF,EF03GE04 AC,EF03GE08 AC')),
        3: ('Produção, circulação e consumo: os 5 Rs, reciclagem, usos da água, energia, matéria-prima e indústria, impactos ambientais',
            T('EF03GE09 AF,EF03GE10 AF,EF03GE11 AF,EF03GE05 AF')),
    },
    'ar': {
        1: ('Artes visuais: paisagem, arte postal, ponto, linha, forma e cor, arte local joinvilense, catarinense e brasileira, artistas imigrantes; dança folclórica catarinense e danças populares',
            T('EF15AR01 AF,EF15AR02 AF,EF15AR03 AC,EF15AR04 AF,EF15AR05 AC,EF15AR06 AC,EF15AR07 AC,EF15AR08 AC,EF15AR09 AC,EF15AR10 AC,EF15AR11 AC,EF15AR12 AC')),
        2: ('Arte concreta e neoconcreta, arte cinética (móbiles), arte e design, assemblage; teoria das cores (monocromia, policromia, cores neutras), composição abstrata; música popular, melodia, instrumentos não convencionais, registro e sonorização',
            T('EF15AR01 AF,EF15AR02 AF,EF15AR03 AC,EF15AR04 AF,EF15AR05 AC,EF15AR06 AC,EF15AR07 AC,EF15AR13 AC,EF15AR14 AC,EF15AR15 AC,EF15AR16 AC,EF15AR17 AC')),
        3: ('Artistas imigrantes, poéticas figurativas e abstratas, institutos de arte; teatro infantil, sonoplastia, criação de cenas e personagens; artes integradas: poesia visual, patrimônio imaterial, arte e tecnologia',
            T('EF15AR01 AF,EF15AR02 AF,EF15AR03 AC,EF15AR04 AF,EF15AR05 AC,EF15AR06 AC,EF15AR07 AC,EF15AR18 AC,EF15AR19 AC,EF15AR20 AC,EF15AR21 AC,EF15AR22 AC,EF15AR23 AC,EF15AR24 AC,EF15AR25 AC,EF15AR26 AC')),
    },
    'ef': {
        1: ('Brincadeiras e jogos populares do Brasil e de matriz indígena e africana; lutas do contexto comunitário e regional (jogos de oposição)',
            T('EF35EF01 AF,EF35EF02 AC,EF35EF03 AF,EF35EF04 AF,EF35EF13 AF,EF35EF14 AC,EF35EF15 AF')),
        2: ('Ginástica geral (equilíbrios, saltos, giros, rolamentos); brincadeiras de matriz indígena; danças populares do Brasil e do mundo',
            T('EF35EF07 AF,EF35EF08 AC,EF35EF01 AF,EF35EF02 AC,EF35EF03 AF,EF35EF04 AF,EF35EF09 AF,EF35EF10 AF,EF35EF11 AC,EF35EF12 AC')),
        3: ('Jogos cooperativos, de iniciação e de tabuleiro; jogos pré-desportivos: esportes de campo e taco, de rede e parede',
            T('EF35EF01 AF,EF35EF02 AC,EF35EF03 AF,EF35EF04 AF,EF35EF05 AF,EF35EF06 AC')),
    },
    'er': {
        1: ('Identidades e alteridades: espaços e territórios religiosos das diferentes tradições (a partir das famílias da turma)', T('EF03ER01 AF,EF03ER02 AC')),
        2: ('Manifestações religiosas: práticas celebrativas, cerimônias, orações, festas e peregrinações', T('EF03ER03 AF,EF03ER04 AC')),
        3: ('Manifestações religiosas: indumentárias, acessórios e símbolos religiosos', T('EF03ER05 AF,EF03ER06 AC')),
    },
}
LI3 = {
    1: 'Cumprimentos e convívio (hello, good morning, thank you); falar de si; classroom language; objetos escolares, cores e formas geométricas; palavras do inglês no dia a dia',
    2: 'Família e animais de estimação; números de 0 a 10; palavras cognatas; pequenos textos sobre a família',
    3: 'Brinquedos e frutas favoritos; apresentar-se e perguntar aos colegas; leitura rápida de pequenos textos',
}
LOCAL3 = {
    'hi': 'Sambaquis da Baía da Babitonga (Museu Arqueológico de Sambaqui de Joinville); povos Guarani e Xokleng; Colônia Dona Francisca e a barca Colon (9 de março de 1851); imigrantes alemães, suíços e noruegueses; nomes de ruas e monumentos; Festa das Flores; Festival de Dança; prefeitura e Câmara de Vereadores.',
    'ge': 'Bairro e município de Joinville no mapa; Baía da Babitonga e manguezais; Serra do Mar e Mata Atlântica; rio Cachoeira; zona rural (Estrada Bonita, Pirabeiraba); indústria e coleta seletiva da cidade; água potável e mananciais.',
    'ci': 'Fauna local: bugio, tucano, jacaré-de-papo-amarelo, caranguejo do mangue, capivara; flora: palmito-juçara, bromélias, araucária; biomas catarinenses.',
    'ar': 'Arte local joinvilense e catarinense (Victor Meirelles nasceu em Florianópolis); Festival de Dança de Joinville; Escola do Teatro Bolshoi no Brasil; danças folclóricas catarinenses.',
    'ef': 'Brincadeiras de rua e jogos de matriz indígena (peteca, jogo da onça); taco; capoeira; dança na cidade do Festival de Dança.',
}
TIPS3 = {
    'ma': ['Faça compras de mentira com notas de brinquedo: total e troco.', 'Leia horas no relógio de ponteiros todos os dias.', 'Monte sequências de 10 em 10 e de 100 em 100 com tampinhas.'],
    'lp': ['Leia em voz alta 10 minutos por dia (fluência).', 'Escreva uma receita ou um diário curto e revise junto.', 'Brinque de soletrar palavras com lh, nh, ch, rr e ss.'],
    'ci': ['Observe a Lua durante um mês e desenhe as fases.', 'Separe animais por cobertura do corpo e alimentação.', 'Teste materiais: o que deixa a luz passar?'],
    'hi': ['Monte a linha do tempo da família com fotos.', 'Visite um museu ou monumento de Joinville e conte o que viu.', 'Pergunte a avós como eram a escola e as brincadeiras.'],
    'ge': ['Desenhe o caminho de casa até a escola com legenda.', 'Faça uma maquete do quarto ou da escola.', 'Confira em casa: quanta água gastamos e como economizar.'],
    'ar': ['Reconheça obras e artistas famosos em livros e sites de museus.', 'Pinte com uma cor só (monocromia) e depois com muitas.', 'Faça um móbile com sucata.'],
    'ef': ['Ensine uma brincadeira dos pais ou avós para a turma.', 'Pratique equilíbrio e rolamentos em lugar seguro.', 'Jogue taco ou vôlei adaptado no quintal.'],
    'li': ['Diga bom dia e obrigado em inglês em casa.', 'Nomeie cores, frutas e brinquedos em inglês.', 'Cante músicas infantis em inglês.'],
    'er': ['Converse sobre as festas e tradições da família.', 'Conheça espaços religiosos diferentes, sempre com respeito.', 'Lembre: há quem tenha uma crença e há quem não tenha nenhuma.'],
}

# Jogos do app por matéria (o mesmo jogo serve para todos os anos)
GAMES = {'ma': 'Mercadinho', 'lp': 'Soletrando', 'ci': 'Classifica!', 'hi': 'Linha do tempo', 'ge': 'Onde fica?', 'ar': 'Quem pintou?', 'ef': 'Adivinha!', 'li': 'Listen and pick', 'er': 'Jogo da memória'}
# Conteúdo sugerido para os jogos em cada etapa
GAME_STAGE = {
    'ma': {(1, 2): 'contar dinheiro com moedas e notas pequenas, somas até 100', (3, 5): 'total, troco e multiplicação de preços; centavos a partir do 4º ano', (6, 9): 'porcentagem, desconto, juros simples e orçamento familiar'},
    'lp': {(1, 2): 'palavras com sílabas simples (CV) e depois CVC; letras e sons', (3, 5): 'dígrafos, r/rr, s/ss/ç, acentuação, palavras irregulares', (6, 9): 'homônimos, x/ch, s/z, -ção/-são, hífen e acentuação pela regra'},
    'ci': {(1, 2): 'materiais e objetos, corpo humano, seres vivos e ambiente', (3, 5): 'grupos de animais, cadeia alimentar, microrganismos, estados físicos', (6, 9): 'células, sistemas do corpo, misturas, ecossistemas, classificação dos seres vivos'},
    'hi': {(1, 2): 'linha do tempo da criança e da família, antes e agora', (3, 5): 'história de Joinville, de Santa Catarina e do Brasil, invenções', (6, 9): 'Antiguidade, Idade Média, colonização, Império, República, século XX'},
    'ge': {(1, 2): 'casa, escola e bairro; lateralidade (direita e esquerda)', (3, 5): 'Brasil e vizinhos, estados e regiões, continentes', (6, 9): 'países do mundo, coordenadas, biomas, relevo e população'},
    'ar': {(1, 2): 'cores, formas e materiais; obras com animais e brincadeiras', (3, 5): 'pintores e movimentos (impressionismo, modernismo), arte catarinense', (6, 9): 'história da arte, arquitetura, música e teatro por épocas'},
    'ef': {(1, 2): 'brincadeiras e jogos populares', (3, 5): 'brincadeiras, ginástica, danças, lutas e esportes de campo, taco, rede e invasão', (6, 9): 'regras dos esportes, lutas do mundo, práticas de aventura'},
    'li': {(1, 2): '(sem Inglês na rede municipal)', (3, 5): 'cumprimentos, cores, números, família, animais, brinquedos, frutas', (6, 9): 'verbos, frases do dia a dia, países e profissões'},
    'er': {(1, 2): 'eu, o outro e o nós; símbolos e festas da família', (3, 5): 'espaços, festas, símbolos, ritos e lideranças religiosas', (6, 9): 'textos sagrados, filosofias de vida, ética e direitos humanos'},
}
def stage(y):
    return (1, 2) if y <= 2 else (3, 5) if y <= 5 else (6, 9)

def skills_for(comp, y):
    return sorted([c for c, (cp, ys, _) in bncc.items() if cp == comp and str(y) in ys])

def short(t, n=150):
    t = re.sub(r'\s+', ' ', t).strip()
    return t if len(t) <= n else t[:n].rsplit(' ', 1)[0] + '…'

def load(p):
    try: return json.load(open(p))
    except Exception: return None

GEN_NAME = {'add': 'tabuadas de adição', 'subt': 'tabuadas de subtração', 'sub': 'contas maiores de subtração', 'mul': 'tabuadas de multiplicação', 'div': 'tabuadas de divisão'}
LBL = {'AF': 'focal', 'AC': 'complementar', 'EF': 'fluência'}

def write_year(y):
    cont = load(f'{ROOT}/data/conteudo/ano{y}.json')
    jogos = load(f'{ROOT}/data/jogos/ano{y}.json')
    sims = load(f'{ROOT}/data/simulados/ano{y}.json')
    # Habilidades cobertas no app
    cover = {}
    if cont:
        for subj, units in cont['materias'].items():
            for u in units:
                for n in u['nodes']:
                    for c in n.get('skills', []) or []:
                        cover.setdefault(c, []).append(n.get('title') or GEN_NAME.get(n['gen'].split('-')[0], 'tabuadas'))
    in_games = set()
    if jogos:
        def walk(o):
            if isinstance(o, dict):
                for k, v in o.items():
                    if k in ('skill',) and isinstance(v, str): in_games.add(v)
                    elif k == 'skills': in_games.update(v)
                    else: walk(v)
            elif isinstance(o, list):
                for v in o: walk(v)
        walk(jogos)
    in_sims = set()
    if sims:
        for s in sims['simulados']:
            for qs in s['questoes'].values():
                for q in qs:
                    if len(q) > 3 and q[3]: in_sims.add(q[3])

    L = []
    L.append(f'# {y}º ano — roadmap de estudos\n')
    L.append('[Voltar ao roadmap](README.md) · [Jogos](jogos.md) · [Simulados](simulados.md)\n')
    if y == 3:
        L.append('O ano está organizado em **3 trimestres**, como no currículo da rede municipal de Joinville (2022). '
                 'Cada habilidade traz o código da BNCC e a classificação da rede: **focal** (aprendizagem principal do trimestre), '
                 '**complementar** e **fluência** (expectativa de fluência em Português e Matemática).\n')
        L.append('Coluna **No app**: o passo da trilha que já ensina a habilidade. "jogo" e "simulado" indicam que ela também aparece nos jogos ou nos simulados; "a fazer" é o que ainda falta escrever.\n')
    else:
        L.append(f'Conteúdo programático do {y}º ano pelas habilidades da BNCC, que a rede de Joinville segue. '
                 'A distribuição por trimestre e a classificação focal/complementar estão no PDF do currículo da rede (páginas abaixo) '
                 'e serão trazidas para cá como já foi feito no [3º ano](3-ano.md).\n')
    L.append('## Matérias do ano\n')
    L.append('| Matéria | Habilidades BNCC | Currículo de Joinville (PDF, páginas) | Jogo no app |')
    L.append('|---|---|---|---|')
    for sid, comp, name in COMPS:
        n = len(skills_for(comp, y))
        pdf = PDF[sid][1].get(y)
        if sid == 'li' and not pdf: continue
        ref = f'{PDF[sid][0]}, p. {pdf}' if pdf else '—'
        hab = str(n) if n else ('próprias da rede (sem código BNCC)' if sid == 'li' else '—')
        L.append(f'| {name} | {hab} | {ref} | {GAMES[sid]} |')
    if y <= 2:
        L.append('\nNa rede municipal de Joinville, **Língua Inglesa começa no 3º ano**.\n')
    elif y <= 5:
        L.append('\nA BNCC só traz habilidades de Língua Inglesa a partir do 6º ano; do 3º ao 5º ano a rede de Joinville tem objetivos próprios.\n')

    for sid, comp, name in COMPS:
        codes = skills_for(comp, y)
        if y == 3 and sid in Y3 or (y == 3 and sid == 'li'):
            L.append(f'\n## {name}\n')
            if sid == 'li':
                for t in (1, 2, 3):
                    L.append(f'**{t}º trimestre.** {LI3[t]}\n')
            else:
                for t, (topics, items) in sorted(Y3[sid].items()):
                    L.append(f'### {"Todos os trimestres" if t == 0 else f"{t}º trimestre"}\n')
                    L.append(f'{topics}.\n')
                    L.append('| Código | Habilidade | Classificação | No app |')
                    L.append('|---|---|---|---|')
                    for code, cls in items:
                        txt = short(bncc[code][2]) if code in bncc else '(código não encontrado)'
                        app = []
                        if code in cover: app.append('; '.join(dict.fromkeys(cover[code]))[:80])
                        if code in in_games: app.append('jogo')
                        if code in in_sims: app.append('simulado')
                        L.append(f'| {code} | {txt} | {LBL[cls]} | {", ".join(app) if app else "a fazer"} |')
                    L.append('')
            if sid in LOCAL3:
                L.append(f'**Joinville e Santa Catarina:** {LOCAL3[sid]}\n')
            L.append(f'**Jogo no app:** {GAMES[sid]} ({GAME_STAGE[sid][stage(y)]}). Detalhes em [jogos.md](jogos.md).\n')
            L.append('**Como estudar em casa:**\n')
            for tip in TIPS3[sid]: L.append(f'- {tip}')
            L.append('')
            continue
        if not codes and sid != 'li': continue
        L.append(f'\n## {name}\n')
        pdf = PDF[sid][1].get(y)
        if pdf: L.append(f'Currículo de Joinville: {PDF[sid][0]}, páginas {pdf} do PDF.\n')
        if codes:
            L.append('<details><summary>Habilidades da BNCC ({})</summary>\n'.format(len(codes)))
            for c in codes:
                L.append(f'- [ ] **{c}** — {short(bncc[c][2], 220)}')
            L.append('\n</details>\n')
        elif sid == 'li':
            L.append('Objetivos próprios da rede de Joinville (sem código BNCC nos anos iniciais).\n' if y >= 3 else 'Não há Inglês neste ano na rede municipal.\n')
        L.append(f'**Jogo no app:** {GAMES[sid]} — {GAME_STAGE[sid][stage(y)]}.\n')

    L.append('\n## Simulados do ano\n')
    if sims:
        for s in sims['simulados']:
            n = sum(len(v) for v in s['questoes'].values())
            L.append(f'- **{s["titulo"]}** ({n} questões): {s.get("temas", "")}')
        L.append('')
    else:
        L.append('Planejados: um simulado por trimestre (1º, 2º e 3º) e um final, com cerca de 20 questões novas cada '
                 '(Matemática 5, Português 5, Ciências 2, História 2, Geografia 2, Arte 1, Educação Física 1, Inglês 1, Ensino Religioso 1). '
                 f'Arquivo a criar: `data/simulados/ano{y}.json`. Veja [simulados.md](simulados.md).\n')
    if y in (2, 5, 9):
        L.append({2: '**Avaliação externa:** o SAEB avalia a alfabetização no 2º ano (Língua Portuguesa e Matemática).\n',
                  5: '**Avaliação externa:** o SAEB avalia o 5º ano em Língua Portuguesa e Matemática.\n',
                  9: '**Avaliação externa:** o SAEB avalia o 9º ano em Língua Portuguesa e Matemática (e, por amostra, Ciências Humanas e da Natureza).\n'}[y])
    open(f'{ROOT}/roadmap/{y}-ano.md', 'w').write('\n'.join(L).rstrip() + '\n')
    return len(L)

os.makedirs(f'{ROOT}/roadmap', exist_ok=True)
for y in range(1, 10):
    write_year(y)
print('roadmap/1-ano.md a 9-ano.md atualizados')
# Conferência: todo código do 3º ano existe na BNCC
bad = [c for s in Y3.values() for _, items in s.values() for c, _ in items if c not in bncc]
if bad:
    print('Códigos BNCC inexistentes no mapeamento:', ', '.join(bad))
    sys.exit(1)
