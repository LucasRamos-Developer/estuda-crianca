# Estuda Criança

App de estudos feito para **estudantes de Joinville (SC)**, do **1º ao 9º ano do Ensino Fundamental**. Segue a **BNCC** e o
**currículo da rede municipal de ensino de Joinville**, com trilhas por matéria, tabuadas, jogos, simulados por trimestre e
curiosidades. Visual inspirado no Duolingo, simples e sem anúncios.

**Acesse:** https://lucasramos-developer.github.io/estuda-crianca/

## Funciona no navegador e pode ser instalado

- **No navegador:** basta abrir o link, no celular, tablet ou computador. Não precisa de cadastro nem de login.
- **Instalado (salvo no aparelho):** o app é um PWA e pode ir para a tela inicial como um aplicativo.
  - Android (Chrome): menu ⋮ → *Instalar app* ou *Adicionar à tela inicial*.
  - iPhone/iPad (Safari): botão *Compartilhar* → *Adicionar à Tela de Início*.
  - Computador (Chrome ou Edge): ícone de instalar na barra de endereço.
- **Offline:** depois do primeiro acesso, funciona sem internet. Quando há internet, o app busca sozinho o conteúdo novo.

## Privacidade: nenhuma informação é coletada

- **O progresso fica salvo só no aparelho**, no armazenamento local do navegador. Nada vai para servidor nenhum.
- **Vários estudantes no mesmo navegador:** irmãos ou colegas podem usar o mesmo celular ou computador, cada um com o seu
  progresso separado (até 8 estudantes por aparelho).
- **O app não captura nenhuma informação:** não tem conta, login, cookies, anúncios, rastreamento nem estatísticas de uso.
  O nome da criança, o ano escolar, o PIN dos pais e todo o histórico ficam só no aparelho.
- O app só baixa os próprios arquivos (telas, lições e jogos) do site onde está publicado. Como em qualquer site, o
  serviço de hospedagem (GitHub Pages) pode registrar acessos técnicos, mas o app não envia dados da criança.
- A voz que lê as lições usa as vozes do aparelho ou do navegador e lê apenas o conteúdo das lições, nunca o nome
  ou o progresso.
- Um relatório só sai do aparelho quando um adulto escolhe, na Área dos pais, *Enviar no WhatsApp*, *Compartilhar*
  ou *Copiar texto*.

## O progresso é por aparelho

- Cada aparelho e cada navegador têm o seu próprio progresso. Estudar no celular não aparece no computador.
- No mesmo aparelho, **cada estudante tem o seu progresso**. Ao abrir o app com dois ou mais estudantes, aparece
  "Quem vai estudar?". Para trocar depois, toque no avatar no topo da tela (ou em *Configurações → Estudantes*).
- Limpar os dados do navegador ou desinstalar o app **apaga o progresso** daquele aparelho.
- **Para levar o progresso para outro lugar, exporte:**
  1. No aparelho de origem: *Configurações → Área dos pais → Exportar backup* (de um estudante) ou
     *Exportar todos os estudantes*. Isso gera um arquivo `.json`.
  2. No outro aparelho: *Configurações → Área dos pais → Importar backup* e escolha o arquivo. O backup de um estudante
     pode entrar como **novo estudante** ou **substituir** o progresso de quem está estudando.
- Também dá para fazer o backup só para guardar uma cópia. O relatório em **PDF** (*imprimir / salvar em PDF*) serve para
  mostrar o desempenho à escola ou à família.

## Como funciona

- No primeiro acesso, a criança informa o **nome** e o **ano escolar**, e as trilhas são montadas para esse ano
  (dá para trocar depois em *Configurações*).
- **Estudantes:** pelo avatar no topo dá para trocar de estudante ou adicionar outro. Cada um tem nome, ano, trilhas,
  estrelas, XP, sequência, jogos e simulados próprios. Remover um estudante só é possível na Área dos pais, com o PIN.
- **Menu:**
  - Matemática (abas Trilha, Tabuada e Jogos)
  - Português (abas Trilha e Jogos)
  - Outros (abas Trilha e Jogos): Ciências, História, Geografia, Arte, Educação Física, Inglês e Ensino Religioso,
    com filtro por matéria
  - Desafios (abas Desafios, Simulados e Jogos)
  - Configurações: nome e ano, Meu progresso, Área dos pais, Curiosidades, Sons e voz, Sobre o app
- **Trilhas:** cada passo mostra uma explicação curta e depois perguntas, em 3 níveis (estrelas). As unidades funcionam
  como acordeão: brancas em andamento e destacadas na cor da matéria quando concluídas. As abas trocam com um toque ou
  deslizando o dedo.
- **Matemática** é a trilha principal: tabuadas de adição, subtração, multiplicação e divisão do 1 ao 9 (para ver, ouvir
  e aprender conta por conta), contas maiores e os tópicos do ano escolar.
- **3º ano:** conteúdo escrito para todas as matérias, ligado aos códigos da BNCC, com a história e a geografia de
  Joinville e o Inglês da rede municipal (que começa no 3º ano).
- **Outros anos:** por enquanto, estudo pelas habilidades da BNCC ("Ainda estou aprendendo" / "Já sei") e treino de
  contas. O conteúdo escrito chega aos poucos.
- **Jogos das matérias** (3º ano): Soletrando (Português), Mercadinho (Matemática), Classifica! (Ciências),
  Linha do tempo (História), Onde fica?, com mapa-múndi (Geografia), Quem pintou? (Arte), Adivinha! (Educação Física),
  Listen and pick (Inglês) e Jogo da memória (Ensino Religioso).
- **Simulados** (3º ano): um por trimestre, como na rede de Joinville, e um final. São 20 questões, sem ajuda, com
  boletim por matéria.
- **Desafios de contas:** perguntas, 1 minuto ou 3 vidas, além do desafio do dia, da revisão surpresa, do teste de
  progresso e do treino dos erros.
- **Curiosidades:** a cada versão nova, entra pelo menos uma curiosidade nova em cada matéria, e as antigas continuam.
- **Área dos pais** (protegida por um PIN do aparelho, criado no primeiro acesso a ela): progresso por matéria,
  habilidades da BNCC, simulados, jogos, relatório em PDF e em texto, estudantes deste aparelho, backup e configurações.

## Próximas funcionalidades

- Conteúdo escrito, jogos e simulados dos outros anos, começando pelo 4º (veja o [roadmap](roadmap/README.md)).
- Terminar a trilha escrita do 3º ano (Português e Arte são os que mais faltam).
- Novos jogos: relógio (horas), caça-sílabas, ditado de frases, estados do Brasil no mapa.

## Roadmap

A pasta [`roadmap/`](roadmap/README.md) traz o conteúdo programático de cada ano (1º ao 9º), com base na BNCC e no
currículo da rede municipal de Joinville. O 3º ano está completo, por trimestre. Também estão lá os planos dos
[jogos](roadmap/jogos.md) e dos [simulados](roadmap/simulados.md).

## Para quem mantém o projeto

### Rodar na rede local

```bash
./serve.sh          # porta 8080
```

O script mostra o endereço para abrir em outros aparelhos da mesma Wi-Fi. Pela rede local (http), o modo offline e o
"instalar" não funcionam; no GitHub Pages (https), funciona tudo.

### Publicar

Um push na `main` faz o GitHub Pages publicar sozinho. Antes de publicar (regras completas em [`CLAUDE.md`](CLAUDE.md)):

1. Acrescente pelo menos **uma curiosidade nova por matéria** em `data/curiosidades.json`, sem apagar as existentes.
2. Rode `node tools/validar-conteudo.mjs --publicar`.
3. Se mudou HTML, CSS, JS ou ícones, aumente a versão do cache em `sw.js` (`estuda-v12` → `estuda-v13`). Senão os
   aparelhos continuam com a versão antiga.

### Atualizar o conteúdo (JSON)

Todo o conteúdo fica em arquivos JSON, separados do código, e pode ser atualizado com uma rotina própria:

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
- Para criar o conteúdo de outro ano, basta adicionar `data/conteudo/anoN.json`. Enquanto o arquivo não existir, o app usa
  a BNCC.

Rotina sugerida:

```bash
node tools/validar-conteudo.mjs              # confere conteúdo, jogos, simulados, mapa e imagens
node tools/validar-conteudo.mjs --publicar   # antes de publicar: nenhuma curiosidade apagada e 1 nova por matéria
python3 tools/gerar-roadmap.py               # atualiza as tabelas "No app" de roadmap/N-ano.md
git add data && git commit -m "Atualiza conteúdo" && git push
```

**Offline:** os JSON usam "rede primeiro" no service worker. Com internet, o app pega a versão nova; sem internet, usa a
última cópia salva. Por isso, **atualizar JSON não exige mudar a versão do cache**. Se criar um novo `anoN.json`
(conteúdo, jogos ou simulados) ou uma imagem nova em `data/arte/`, adicione-o também na lista `DATA` do `sw.js`, para ele
já ficar salvo na primeira visita.

### Estrutura

```
index.html, manifest.webmanifest, sw.js, serve.sh
css/style.css          visual (celular, tablet e computador)
js/app.js              telas e interação
js/curriculum.js       monta as trilhas por ano e matéria
js/engine.js           contas geradas, progresso por estudante (salvo no aparelho), conquistas
js/games.js            jogos das matérias (soletrar, linha do tempo, mapa, memória...)
js/icons.js, js/fx.js  ícones e sons
data/                  conteúdo em JSON (BNCC, curiosidades, trilhas, jogos e simulados por ano)
roadmap/               conteúdo programático por ano, jogos e simulados
tools/                 validar-conteudo.mjs, gerar-mapa.mjs, gerar-roadmap.py
```

## Fontes

- Base Nacional Comum Curricular (BNCC), MEC, versão final de 2018.
- Currículo Base da Educação Infantil e do Ensino Fundamental do Território Catarinense (2019).
- Currículo da Rede Municipal de Ensino de Joinville (SED, 2022).
- Mapa: Natural Earth (domínio público). Obras de arte: Wikimedia Commons (domínio público).
