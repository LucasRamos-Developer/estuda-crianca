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
- **Menu**: Matemática (abas Trilha e Tabuada), Português, Outros, Desafios e Configurações
  (Meu progresso, Área dos pais, Sons e voz, Sobre o app).
- Cada passo mostra uma **explicação curta** e depois **perguntas**. Cada passo tem 3 níveis (estrelas).
- **3º ano**: conteúdo completo escrito para todas as matérias, ligado aos códigos da BNCC,
  com História e Geografia de Joinville e Inglês dos anos iniciais (rede municipal).
- **Outros anos**: os passos usam as habilidades da BNCC para estudo e auto-avaliação ("Ainda estou aprendendo" /
  "Já sei"), mais treino de contas na Matemática dos anos iniciais. Perguntas escritas serão adicionadas aos poucos.
- **Matemática → Tabuadas**: as tabuadas de somar, tirar, multiplicar e dividir para ver, ouvir e aprender conta por conta.
- **Desafios**: desafio do dia, revisão surpresa de todas as matérias, teste de progresso (boletim), treino dos erros
  e desafio de contas de Matemática (perguntas, 1 minuto, 3 vidas).
- **Pais** (com PIN criado no primeiro acesso): progresso por matéria, situação de cada habilidade da BNCC,
  relatório para **imprimir / salvar em PDF**, relatório em texto (WhatsApp), **backup em JSON** e configurações.

O progresso fica salvo **no aparelho**. Use *Pais → Exportar backup* para guardar ou trocar de aparelho.

## Rodar na rede local

```bash
./serve.sh          # porta 8080
```

O script mostra o endereço para abrir em outros aparelhos da mesma Wi-Fi.
Pela rede local (http) o modo offline e o "instalar" não funcionam; no GitHub Pages (https) funciona tudo.

## Publicar

Push na `main` → o GitHub Pages publica sozinho. **Ao mudar qualquer arquivo, aumente a versão do cache** em `sw.js`
(`estuda-v8` → `estuda-v9`), senão os aparelhos continuam com a versão antiga.

## Atualizar o conteúdo (JSON)

Todo o conteúdo fica em arquivos JSON, separados do código. Dá para atualizar com uma rotina própria:

```
data/bncc.json                 habilidades da BNCC: [código, componente, anos, texto]
data/curiosidades.json         "Você sabia?": { "versao", "fontes": [...], "ma": [textos], "lp": [...], ... }
data/conteudo/anoN.json        trilhas escritas do N-ésimo ano: { "ano": N, "versao", "materias": { "ma": [unidades], ... } }
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
node tools/validar-conteudo.mjs     # confere formato, ids, códigos BNCC e perguntas (sai com erro se algo estiver errado)
git add data && git commit -m "Atualiza conteúdo" && git push
```

**Offline:** os JSON usam "rede primeiro" no service worker. Com internet, o app pega a versão nova; sem internet, usa a
última cópia salva. Por isso, **atualizar JSON não exige mudar a versão do cache**. Só mude `CACHE` em `sw.js` quando alterar
HTML, CSS, JS ou ícones. Se criar um novo `anoN.json`, adicione-o também na lista `DATA` do `sw.js` para ele já ficar salvo
na primeira visita.

## Estrutura

```
index.html, manifest.webmanifest, sw.js, serve.sh
css/style.css          visual (celular, tablet e computador)
js/app.js              telas e interação
js/curriculum.js       monta as trilhas por ano e matéria
js/engine.js           contas geradas, progresso, conquistas
data/                  conteúdo em JSON (BNCC, curiosidades, trilhas por ano)
tools/                 validar-conteudo.mjs
js/icons.js, js/fx.js  ícones e sons
```


## Fontes

- Base Nacional Comum Curricular (BNCC), MEC — versão final de 2018.
- Currículo Base da Educação Infantil e do Ensino Fundamental do Território Catarinense (2019).
- Currículo da rede municipal de ensino de Joinville.
