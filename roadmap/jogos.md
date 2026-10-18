# Jogos por matéria

[Voltar ao roadmap](README.md) · [Simulados](simulados.md)

Cada matéria tem pelo menos um jogo. O **mesmo jogo serve para todos os anos**; muda só o conteúdo, que fica em
`data/jogos/anoN.json`. O 3º ano já está no app (Desafios → Jogos das matérias, e um atalho no topo de cada trilha).
Os outros anos ganham o jogo quando o arquivo do ano for criado.

Regras comuns a todos os jogos:

- Partidas curtas (5 a 10 rodadas), sem vidas, sem tempo, sem ajuda: a criança vê a resposta certa e uma explicação ao errar.
- Cada acerto e cada erro conta para a habilidade da BNCC indicada no JSON (aparece na Área dos pais).
- XP: 10 por partida, mais 5 se acertar tudo. O app guarda partidas e melhor aproveitamento de cada jogo.
- Funciona offline: JSON, mapa e imagens ficam no cache.
- Sem emojis e sem mascote; ícones simples.

| Matéria | Jogo | Tipo no JSON | Mecânica |
|---|---|---|---|
| Língua Portuguesa | [Soletrando](#soletrando-língua-portuguesa) | `soletrando` | Ouvir a palavra e escrever num teclado de letras |
| Matemática | [Mercadinho](#mercadinho-matemática) | `mercadinho` | Total, troco, multiplicação de preços e troca de notas |
| Ciências | [Classifica!](#classifica-ciências) | `classifica` | Pôr cada ser ou objeto na caixa certa |
| História | [Linha do tempo](#linha-do-tempo-história) | `linha` | Ordenar fatos do mais antigo para o mais recente |
| Geografia | [Onde fica?](#onde-fica-geografia) | `mapa` | Tocar no mapa o país ou o continente |
| Arte | [Quem pintou?](#quem-pintou-arte) | `pintor` | Ver a obra e escolher o artista |
| Educação Física | [Adivinha!](#adivinha-educação-física) | `pistas` | Descobrir a brincadeira ou o esporte por pistas |
| Língua Inglesa | [Listen and pick](#listen-and-pick-língua-inglesa) | `ouvir` | Ouvir a palavra em inglês e escolher o significado |
| Ensino Religioso | [Jogo da memória](#jogo-da-memória-ensino-religioso) | `memoria` | Formar pares: tradição e espaço, festa ou símbolo |

---

## Soletrando (Língua Portuguesa)

**Objetivo:** escrever corretamente palavras do ano, com atenção às regras de ortografia e acentuação.

**Como funciona:** o app fala a palavra, uma frase com ela e a palavra de novo (voz pt-BR; botão para ouvir outra vez).
A frase aparece na tela com a palavra escondida e o número de letras. A criança monta a palavra num teclado de letras
na ordem do alfabeto, com acentos e ç (no computador também vale o teclado físico). Se errar só o acento, o app avisa:
"Quase! Só faltou acertar o acento".

**Níveis do 3º ano:** lh, nh e ch (EF03LP03) · r ou rr, s ou ss (EF03LP01) · c ou qu, g ou gu (EF03LP01) ·
m antes de p e b, til (EF03LP01) · acentos (EF03LP04) · h, x e ch (EF35LP13).

**Por ano:**

| Ano | Conteúdo das palavras |
|---|---|
| 1º–2º | Sílabas simples (CV: bola, gato), depois CVC e CCV (porta, prato); nomes de colegas e objetos da sala |
| 3º | Dígrafos, r/rr, s/ss, c/qu, g/gu, nasalização, acentos, h inicial |
| 4º–5º | s/z/ss/ç, x/ch, -ão/-am, sufixos -oso, -eza, -ês, palavras de uso frequente com grafia irregular |
| 6º–9º | Homônimos e parônimos (cela/sela), -ção/-são/-ssão, porquês, hífen, acentuação pela regra |

```json
"lp": { "tipo": "soletrando", "titulo": "Soletrando", "desc": "...",
  "niveis": [ { "nome": "lh, nh e ch", "skill": "EF03LP03",
                "itens": [ ["abelha", "A abelha faz mel."] ] } ] }
```
A frase **precisa conter a palavra** (o validador confere).

---

## Mercadinho (Matemática)

**Objetivo:** usar dinheiro em situações de compra: somar preços, calcular troco, multiplicar e trocar notas.

**Como funciona:** cada rodada mostra os produtos com o preço e uma pergunta. A resposta vai no teclado numérico.
Os tipos de pergunta se misturam:
- **Total:** "Comprei lápis e suco. Quanto gastei?" (EF03MA05)
- **Troco:** "Comprei caderno e paguei com uma nota de R$ 20. Quanto recebo de troco?" (EF03MA24)
- **Vezes:** "Comprei 3 unidades de pipa, cada uma por R$ 6. Quanto gastei?" (EF03MA07)
- **Notas:** "Quantas notas de R$ 5 são precisas para formar R$ 20?" (EF03MA24)

**Por ano:** 1º–2º moedas e notas até R$ 20, só somar · 3º reais inteiros até R$ 100 · 4º–5º centavos, troco com
moedas, compras com várias unidades · 6º–9º desconto, porcentagem, parcelas e orçamento da família.

```json
"ma": { "tipo": "mercadinho", "titulo": "Mercadinho", "notas": [2, 5, 10, 20, 50, 100],
  "produtos": [ ["lápis", 2], ["caderno", 12] ] }
```

O Mercadinho fica junto da Matemática, que já tem os desafios de tabuada (perguntas, 1 minuto e 3 vidas).

---

## Classifica! (Ciências)

**Objetivo:** reconhecer características dos seres vivos e organizá-los em grupos.

**Como funciona:** aparece o nome de um ser ou objeto e as caixas do grupo (botões fixos). A criança toca na caixa certa.
Depois aparece uma explicação curta ("Come grãos, minhocas e insetos").

**Rodadas do 3º ano:**
- Ser vivo ou não vivo? (EF03CI04)
- Animal ou vegetal? Com fauna e flora da região de Joinville: bugio, caranguejo do mangue, palmito-juçara, araucária (EF03CI06)
- O que ele come? Carnívoro, herbívoro ou onívoro (EF03CI04)
- Cobertura do corpo: pelos, penas, escamas ou pele lisa (EF03CI06)
- Como nasce? De ovo ou da barriga da mãe (EF03CI05)

**Por ano:** 1º–2º materiais (madeira, plástico, metal), dia e noite · 4º–5º microrganismos, estados físicos da água,
cadeias alimentares, vertebrados e invertebrados · 6º–9º reinos, misturas e substâncias, ecossistemas, órgãos e sistemas.

```json
"ci": { "tipo": "classifica", "rodadas": [ { "nome": "O que ele come?", "skill": "EF03CI04",
  "caixas": ["Carnívoro", "Herbívoro", "Onívoro"],
  "itens": [ ["Galinha", "Onívoro", "Come grãos, minhocas e insetos."] ] } ] }
```
A caixa de cada item precisa existir em `caixas` (o validador confere).

---

## Linha do tempo (História)

**Objetivo:** perceber a passagem do tempo, a ordem dos acontecimentos, mudanças e permanências.

**Como funciona:** aparecem 4 ou 5 fatos embaralhados. A criança toca neles do mais antigo para o mais recente,
e eles vão para as posições 1, 2, 3... (dá para desfazer tocando de novo). Na correção aparece a ordem certa com as datas.

**Rodadas do 3º ano:**
- História de Joinville: sambaquis, povos Guarani e Xokleng, casamento de Dona Francisca e do príncipe de Joinville (1843),
  barca Colon e Colônia Dona Francisca (9/3/1851), Festa das Flores (1936), Festival de Dança (1983), Bolshoi (2000) (EF03HI01)
- Como as pessoas se comunicam: carta, telefone, rádio, televisão, computador, celular (EF03HI08)
- Meios de transporte: canoa, carroça, trem, automóvel, 14-Bis, chegada à Lua (EF03HI12)
- A vida de uma criança: nascer, andar, falar, escola, ler sozinha, 3º ano (EF03HI02)

**Por ano:** 1º–2º rotina do dia, a vida da criança e da família (antes, agora, depois) · 4º–5º Santa Catarina, povos
indígenas, chegada dos portugueses, escravidão e abolição, imigração · 6º–9º Antiguidade, Idade Média, Grandes
Navegações, Brasil Colônia, Império e República, guerras mundiais, ditadura e redemocratização.

```json
"hi": { "tipo": "linha", "rodadas": [ { "nome": "História de Joinville", "skill": "EF03HI01",
  "fatos": [ ["Chegam os imigrantes da barca Colon", "9 de março de 1851"] ] } ] }
```
Os fatos ficam **na ordem certa** no arquivo (do mais antigo para o mais recente); o app embaralha.

---

## Onde fica? (Geografia)

**Objetivo:** localizar continentes e países no mapa e entender a posição do Brasil e de Joinville no mundo.

**Como funciona:** o app mostra o nome ("Argentina") e um mapa que dá para tocar. A criança toca no país (ou em qualquer
país do continente pedido) e confere. Na correção, o certo fica verde e o tocado fica vermelho. Cada nível aproxima o mapa
na região (mundo, América do Sul, Europa).

**Níveis do 3º ano** (EF03GE06, representações cartográficas):
- Continentes (América, Europa, África, Ásia, Oceania, Antártida)
- América do Sul: o Brasil e os vizinhos
- Países grandes do mundo
- Europa dos imigrantes: Alemanha, Suíça e Noruega, de onde vieram os fundadores de Joinville, e outros

**Por ano:** 1º–2º planta da sala e da casa, direita e esquerda (sem mapa-múndi) · 4º–5º estados e regiões do Brasil,
capitais, Santa Catarina e suas cidades · 6º–9º todos os países, oceanos, linhas imaginárias, blocos econômicos.
Para estados do Brasil será preciso um segundo mapa (`data/mapas/brasil.json`, gerado do mesmo jeito).

**Mapa:** `data/mapas/mundo.json`, gerado uma vez com `node tools/gerar-mapa.mjs countries-110m.json` a partir do Natural Earth
(domínio público). Traz o nome em português, o continente e o contorno de cada país, e as regiões de aproximação.

```json
"ge": { "tipo": "mapa", "skill": "EF03GE06", "niveis": [
  { "nome": "Continentes", "regiao": "mundo", "por": "continente", "alvos": ["am", "eu", "af", "as", "oc", "an"] },
  { "nome": "América do Sul", "regiao": "america-do-sul", "alvos": ["076", "032"] } ] }
```
Os alvos são os códigos numéricos ISO dos países (076 = Brasil). O validador confere se existem no mapa.

---

## Quem pintou? (Arte)

**Objetivo:** apreciar obras de arte, reconhecer artistas e estilos e conhecer a arte brasileira e catarinense.

**Como funciona:** aparece a obra e 4 nomes de artistas. Depois da resposta vem uma curiosidade
("O nome deste quadro deu origem ao Impressionismo"). Algumas rodadas são só texto, para artistas cujas obras ainda
têm direitos autorais.

**3º ano** (EF15AR01, contextos e práticas; matrizes estéticas): Van Gogh (2 obras), Leonardo da Vinci, Vermeer, Hokusai, Klimt,
Monet (2), Seurat, **Victor Meirelles** (nasceu em Florianópolis), Pedro Américo e Almeida Júnior. Em texto: Tarsila do Amaral,
Portinari, Anita Malfatti e Volpi.

**Direitos autorais:** só entram imagens em **domínio público**, baixadas do Wikimedia Commons e reduzidas para cerca de 520 px
(`data/arte/`). Cada obra guarda `fonte` e `licenca`. No Brasil a obra entra em domínio público 70 anos depois da morte
do artista. Tarsila (morreu em 1973) e Portinari (1962) ainda não estão, por isso aparecem só em perguntas de texto.

**Por ano:** 1º–2º obras com animais, brincadeiras e cores fortes · 4º–5º arte rupestre, arte indígena, barroco mineiro,
modernismo · 6º–9º movimentos artísticos, arquitetura, música e teatro por épocas.

```json
"ar": { "tipo": "pintor", "skill": "EF15AR01",
  "obras": [ { "titulo": "A noite estrelada", "pintor": "Vincent van Gogh", "ano": "1889",
    "img": "arte/van-gogh-noite-estrelada.jpg", "curiosidade": "...",
    "fonte": "https://commons.wikimedia.org/wiki/File:...", "licenca": "Domínio público (Wikimedia Commons)" } ],
  "pintores": ["Pablo Picasso", "Frida Kahlo"],
  "texto": [ ["Qual artista brasileira pintou o Abaporu?", ["Tarsila do Amaral", "..."], "explicação"] ] }
```
Ao acrescentar uma imagem, inclua também o caminho dela na lista `DATA` do `sw.js`, para ficar offline.

---

## Adivinha! (Educação Física)

**Objetivo:** conhecer regras e características de brincadeiras, jogos, lutas, danças, ginásticas e esportes.

**Como funciona:** aparece uma pista e 4 opções. Se não souber, a criança pede "Mais uma pista" (até 3). Na correção o app diz
com quantas pistas acertou. A ideia é praticar depois, no quintal ou na escola.

**3º ano:** amarelinha, queimada, pega-pega, pular corda, cabo de guerra, peteca e jogo da onça (de origem indígena),
pipa (com o alerta sobre cerol) (EF35EF01) · capoeira (EF35EF13) · ginástica (EF35EF07) · balé e o Bolshoi de Joinville (EF35EF09) ·
vôlei, taco e futebol (EF35EF05).

**Por ano:** 1º–2º brincadeiras e jogos populares · 4º–5º esportes de invasão, lutas do Brasil, danças do mundo ·
6º–9º regras oficiais, lutas do mundo, práticas de aventura (skate, parkour, orientação).

```json
"ef": { "tipo": "pistas", "itens": [ { "resposta": "Amarelinha", "skill": "EF35EF01",
  "pistas": ["Desenha-se no chão com giz.", "Tem casas numeradas.", "Você pula num pé só."],
  "erradas": ["Pega-pega", "Queimada", "Cabo de guerra"] } ] }
```

---

## Listen and pick (Língua Inglesa)

**Objetivo:** reconhecer palavras em inglês pelo som e ampliar o vocabulário.

**Como funciona:** o app fala a palavra em inglês (voz en-US, mais devagar) e mostra a palavra escrita. A criança escolhe
o significado entre 4 opções do mesmo tema.

**3º ano**, como no currículo de Joinville (que começa o Inglês no 3º ano): Greetings, School, Colors, Shapes (1º trimestre) ·
Family, Pets, Numbers (2º trimestre) · Toys, Fruits (3º trimestre).

**Por ano:** 4º–5º rotina, roupas, comidas, partes do corpo, lugares da cidade · 6º–9º verbos, frases do dia a dia, países e
nacionalidades, profissões (com as habilidades EF06LI a EF09LI).

```json
"li": { "tipo": "ouvir", "grupos": [ { "nome": "Colors", "itens": [ ["red", "vermelho"], ["blue", "azul"] ] } ] }
```

---

## Jogo da memória (Ensino Religioso)

**Objetivo:** conhecer e respeitar a diversidade de tradições religiosas (e também quem não segue nenhuma), com
seus espaços, festas e símbolos. A linguagem é descritiva e não ensina que uma crença é melhor que outra.

**Como funciona:** 8 cartas viradas (4 pares). A criança vira duas por vez; se formarem par, ficam abertas. São 3 tabuleiros
por partida e cada tabuleiro conta como acerto se terminar com até 4 erros.

**Rodadas do 3º ano:** Espaços religiosos: igreja, sinagoga, mesquita, templo budista, terreiro, opy, mandir (EF03ER01) ·
Festas e celebrações: Natal, Páscoa, Hanukkah, Ramadã, Diwali, Festa de Iemanjá, Vesak (EF03ER03) ·
Símbolos e roupas: cruz, estrela de Davi, lua crescente, roda do Dharma, quipá, hijab, fio de contas, om (EF03ER05).

**Por ano:** 1º–2º eu e o outro, nomes, símbolos e festas da família · 4º–5º ritos de passagem, lideranças, textos orais e
escritos · 6º–9º textos sagrados, filosofias de vida, ética, direitos humanos.

```json
"er": { "tipo": "memoria", "rodadas": [ { "nome": "Espaços religiosos", "skill": "EF03ER01",
  "pares": [ ["Igreja", "Cristianismo"], ["Sinagoga", "Judaísmo"] ] } ] }
```

---

## Próximos jogos (ideias)

- **Relógio** (Matemática): mexer os ponteiros até a hora pedida (EF03MA23).
- **Caça-sílabas** (Português, 1º–2º): formar palavras arrastando sílabas.
- **Ditado de frases** (Português, 4º–5º): o Soletrando com frases curtas e pontuação.
- **Qual estado?** (Geografia, 4º–5º): mapa do Brasil com estados e capitais.
- **Quiz das fases da Lua** (Ciências): imagens simples desenhadas em SVG.
