# Estuda Criança

App de estudos (PWA) para o **ensino fundamental, do 1º ao 9º ano**, com base na **BNCC** e no que é ensinado
na rede de **Joinville (SC)**. Visual inspirado no Duolingo. Funciona no celular, tablet e computador, e **offline**
depois do primeiro acesso (quando publicado em HTTPS, como no GitHub Pages).

Site: https://lucasramos-developer.github.io/estuda-crianca/

## Como funciona

- No primeiro acesso, a criança informa o nome e **o ano escolar**. A trilha é montada para esse ano
  (dá para trocar depois em *Pais → Configurações*).
- **Três trilhas**:
  - **Matemática** (principal): o app de matemática completo (tabuadas de somar, tirar, multiplicar e dividir do 1 ao 9
    e contas maiores) e depois os tópicos de matemática do ano escolar. As tabuadas para ver e ouvir ficam no topo.
  - **Português**: trilha própria com os conteúdos do ano.
  - **Outros**: Ciências, História, Geografia, Arte, Educação Física, Inglês e Ensino Religioso juntas,
    com filtro para estudar uma matéria só.
- **Menu**: Matemática (abas Trilha, Tabuada e Jogos), Português e Outros (abas Trilha e Jogos), Desafios (abas Desafios,
  Simulados e Jogos) e Configurações
  (Meu progresso, Área dos pais, Curiosidades, Sons e voz, Sobre o app).
- Cada passo mostra uma **explicação curta** e depois **perguntas**. Cada passo tem 3 níveis (estrelas).
- As abas trocam com toque ou deslizando o dedo. As unidades da trilha funcionam como acordeão (uma aberta por vez):
  brancas em andamento e destacadas na cor da matéria quando concluídas.
- **3º ano**: conteúdo completo escrito para todas as matérias, ligado aos códigos da BNCC,
  com História e Geografia de Joinville e Inglês dos anos iniciais (rede municipal).
- **Outros anos**: os passos usam as habilidades da BNCC para estudo e auto-avaliação ("Ainda estou aprendendo" /
  "Já sei"), mais treino de contas na Matemática dos anos iniciais. Perguntas escritas serão adicionadas aos poucos.
- **Matemática → Tabuadas**: as tabuadas de somar, tirar, multiplicar e dividir para ver, ouvir e aprender conta por conta.
- **Desafios**: desafio de contas de Matemática (perguntas, 1 minuto, 3 vidas), **simulados**, **jogos das matérias**,
  desafio do dia, revisão surpresa de todas as matérias, teste de progresso (boletim) e treino dos erros.
- **Jogos das matérias** (3º ano): Soletrando (Português), Mercadinho (Matemática), Classifica! (Ciências), Linha do tempo
  (História), Onde fica? com mapa-múndi (Geografia), Quem pintou? (Arte), Adivinha! (Educação Física), Listen and pick (Inglês)
  e Jogo da memória (Ensino Religioso). Ficam em Desafios e num atalho no topo de cada trilha.
- **Simulados** (3º ano): um por trimestre, como na rede de Joinville, e um final. São 20 questões sem ajuda, e no fim
  sai o boletim por matéria.
- **Pais** (com PIN criado no primeiro acesso): progresso por matéria, situação de cada habilidade da BNCC, simulados, jogos,
  relatório para **imprimir / salvar em PDF**, relatório em texto (WhatsApp), **backup em JSON** e configurações.

O progresso fica salvo **no aparelho**. Use *Pais → Exportar backup* para guardar ou trocar de aparelho.

## Roadmap

A pasta [`roadmap/`](roadmap/README.md) traz o conteúdo programático de cada ano (1º ao 9º), com base na BNCC e no currículo
da rede municipal de Joinville. O 3º ano está completo, por trimestre. A pasta também tem os planos dos
[jogos](roadmap/jogos.md) e dos [simulados](roadmap/simulados.md).

## Rodar na rede local

```bash
./serve.sh          # porta 8080
```

O script mostra o endereço para abrir em outros aparelhos da mesma Wi-Fi.
Pela rede local (http) o modo offline e o "instalar" não funcionam; no GitHub Pages (https) funciona tudo.

## Publicar

Push na `main` → o GitHub Pages publica sozinho. **Ao mudar qualquer arquivo, aumente a versão do cache** em `sw.js`
(`estuda-v11` → `estuda-v12`), senão os aparelhos continuam com a versão antiga.

## Atualizar o conteúdo (JSON)

Todo o conteúdo fica em arquivos JSON, separados do código. Dá para atualizar com uma rotina própria:

```
data/bncc.json                 habilidades da BNCC: [código, componente, anos, texto]
data/curiosidades.json         "Você sabia?": { "versao", "fontes": [...], "ma": [textos], "lp": [...], ... }
data/conteudo/anoN.json        trilhas escritas do N-ésimo ano: { "ano": N, "versao", "materias": { "ma": [unidades], ... } }
data/jogos/anoN.json           jogos das matérias do ano (formato de cada jogo em roadmap/jogos.md)
data/simulados/anoN.json       simulados do ano (formato em roadmap/simulados.md)
data/mapas/mundo.json          mapa do jogo "Onde fica?" (gerado por tools/gerar-mapa.mjs, Natural Earth)
data/arte/*.jpg                obras em domínio público do jogo "Quem pintou?" (Wikimedia Commons)
```

Formato de uma unidade em `materias`:

```json
{ "unit": "Título da unidade", "nodes": [
  { "id": "y3-ci-7", "title": "Título do passo", "skills": ["EF03CI01"],
    "intro": "Explicação curta.", "points": ["Ponto 1", "Ponto 2"], "example": "opcional", "passage": "texto para leitura (opcional)",
    "q": [ ["Pergunta?", ["resposta certa", "errada 1", "errada 2", "errada 3"], "explicação opcional"],
           ["Afirmação.", ["Verdadeiro", "Falso"]] ] }
] }
```

- A **resposta certa vem sempre primeiro**; o app embaralha as alternativas.
- Matérias: `ma`, `lp`, `ci`, `hi`, `ge`, `ar`, `ef`, `li`, `er`. Na Matemática, `{ "gen": "mul-3" }` usa uma tabuada gerada.
- Para criar o conteúdo de outro ano, basta adicionar `data/conteudo/anoN.json` (o app usa a BNCC enquanto o arquivo não existir).

Rotina sugerida:

```bash
node tools/validar-conteudo.mjs     # confere conteúdo, jogos, simulados, mapa e imagens (sai com erro se algo estiver errado)
node tools/validar-conteudo.mjs --publicar   # antes de publicar: nenhuma curiosidade apagada e 1 nova por matéria
python3 tools/gerar-roadmap.py      # atualiza as tabelas "No app" de roadmap/N-ano.md
git add data && git commit -m "Atualiza conteúdo" && git push
```

**Offline:** os JSON usam "rede primeiro" no service worker. Com internet, o app pega a versão nova; sem internet, usa a
última cópia salva. Por isso, **atualizar JSON não exige mudar a versão do cache**. Só mude `CACHE` em `sw.js` quando alterar
HTML, CSS, JS ou ícones. Se criar um novo `anoN.json` (conteúdo, jogos ou simulados) ou uma imagem nova em `data/arte/`,
adicione-o também na lista `DATA` do `sw.js` para ele já ficar salvo na primeira visita.

## Estrutura

```
index.html, manifest.webmanifest, sw.js, serve.sh
css/style.css          visual (celular, tablet e computador)
js/app.js              telas e interação
js/curriculum.js       monta as trilhas por ano e matéria
js/engine.js           contas geradas, progresso, conquistas
js/games.js            jogos das matérias (soletrar, linha do tempo, mapa, memória...)
data/                  conteúdo em JSON (BNCC, curiosidades, trilhas por ano)
roadmap/               conteúdo programático por ano, jogos e simulados
tools/                 validar-conteudo.mjs, gerar-mapa.mjs, gerar-roadmap.py
js/icons.js, js/fx.js  ícones e sons
```


## Fontes

- Base Nacional Comum Curricular (BNCC), MEC — versão final de 2018.
- Currículo Base da Educação Infantil e do Ensino Fundamental do Território Catarinense (2019).
- Currículo da Rede Municipal de Ensino de Joinville (SED, 2022).
- Mapa: Natural Earth (domínio público). Obras de arte: Wikimedia Commons (domínio público).
