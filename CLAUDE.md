# Estuda Criança — instruções para o Claude

App de estudos (PWA, offline) do 1º ao 9º ano, com base na BNCC e no currículo da rede municipal de Joinville.
Publicado no GitHub Pages a partir da branch `main`.

## Toda vez que for publicar uma versão nova (commit + push na `main`)

1. **Curiosidades:** adicione **pelo menos uma curiosidade nova em cada matéria** em `data/curiosidades.json`
   (`ma`, `lp`, `ci`, `hi`, `ge`, `ar`, `ef`, `li`, `er`).
   - As curiosidades anteriores ficam **sempre**. A lista só cresce conforme o app é atualizado: acrescente no fim.
   - **Nunca apague nem altere** uma curiosidade existente, a não ser por **ordem direta do usuário** pedindo aquela remoção.
     Nesse caso, e só nesse, valide com `node tools/validar-conteudo.mjs --publicar --permitir-remocao`.
   - Textos originais, curtos e verdadeiros, para crianças, inspirados nas fontes do arquivo (Guia dos Curiosos,
     Manual do Mundo, Superinteressante). Não copie textos das fontes.
   - Não repita uma curiosidade que já está na lista. Atualize `"versao"` com a data do dia.
   - Mantenha a formatação do arquivo (indentação de 1 espaço) para o diff mostrar só o que é novo.
2. Rode `node tools/validar-conteudo.mjs --publicar`. Ele falha se alguma curiosidade publicada sumiu ou se alguma
   matéria ficou sem curiosidade nova (compara com `origin/main`). Só publique com o validador sem erros.
3. Se mudou HTML, CSS, JS ou ícones, aumente a versão `CACHE` em `sw.js` (ex.: `estuda-v11` → `estuda-v12`).
   Arquivos novos em `data/` precisam entrar na lista `DATA` do `sw.js`.

## Regras gerais

- Commit e push **só quando o usuário pedir**.
- Visual simples: **sem emojis e sem mascote**; ícones em SVG (`js/icons.js`). Responsivo para celular, tablet e PC.
- Conteúdo fica em JSON dentro de `data/` (o usuário tem uma rotina própria que atualiza esses arquivos); nada de conteúdo
  fixo no código. O app precisa continuar funcionando offline.
- Matemática é a trilha principal; Português tem trilha própria; as outras matérias ficam em "Outros".
- Imagens só em domínio público (com `fonte` e `licenca` no JSON).
- Roadmap do conteúdo programático em `roadmap/`; tabelas "No app" geradas por `python3 tools/gerar-roadmap.py`.
