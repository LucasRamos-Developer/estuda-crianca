# Aprender Bia

App de estudos (PWA) para o **ensino fundamental, do 1º ao 9º ano**, com base na **BNCC** e no que é ensinado
na rede de **Joinville (SC)**. Visual inspirado no Duolingo. Funciona no celular, tablet e computador, e **offline**
depois do primeiro acesso (quando publicado em HTTPS, como no GitHub Pages).

Site: https://lucasramos-developer.github.io/estuda-crianca/

## Como funciona

- No primeiro acesso, a criança informa o nome e **o ano escolar**. A trilha é montada para esse ano
  (dá para trocar depois em *Pais → Configurações*).
- **Trilha "Tudo"**: um passo de cada matéria, em sequência. **Trilha por matéria**: Português, Matemática,
  Ciências, História, Geografia, Arte, Educação Física, Inglês e Ensino Religioso. O progresso é o mesmo nas duas.
- Cada passo mostra uma **explicação curta** e depois **perguntas**. Cada passo tem 3 níveis (estrelas).
- **3º ano**: conteúdo completo escrito para todas as matérias, ligado aos códigos da BNCC,
  com História e Geografia de Joinville e Inglês dos anos iniciais (rede municipal).
- **Outros anos**: os passos usam as habilidades da BNCC para estudo e auto-avaliação ("Ainda estou aprendendo" /
  "Já sei"), mais treino de contas na Matemática dos anos iniciais. Perguntas escritas serão adicionadas aos poucos.
- **Tabuada**: as tabuadas de somar, tirar, multiplicar e dividir para ver, ouvir e aprender conta por conta.
- **Desafios**: desafio da tabuada (perguntas, 1 minuto, 3 vidas), desafio do dia, teste de progresso (boletim),
  revisão surpresa de todas as matérias e treino dos erros.
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
(`aprender-v1` → `aprender-v2`), senão os aparelhos continuam com a versão antiga.

## Estrutura

```
index.html, manifest.webmanifest, sw.js, serve.sh
css/style.css          visual (celular, tablet e computador)
js/app.js              telas e interação
js/curriculum.js       monta as trilhas por ano e matéria
js/content/ano3.js     conteúdo escrito do 3º ano (explicações e perguntas)
js/engine.js           contas geradas, progresso, conquistas
data/bncc.json         1304 habilidades da BNCC do ensino fundamental (código, anos, texto)
js/icons.js, js/fx.js  ícones e sons
```

Para adicionar conteúdo de outro ano: crie `js/content/anoN.js` no mesmo formato do `ano3.js`
e registre em `AUTHORED` dentro de `js/curriculum.js`.

## Fontes

- Base Nacional Comum Curricular (BNCC), MEC — versão final de 2018.
- Currículo Base da Educação Infantil e do Ensino Fundamental do Território Catarinense (2019).
- Currículo da rede municipal de ensino de Joinville.
