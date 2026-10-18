# Roadmap de estudos — Ensino Fundamental em Joinville

Este roadmap reúne **o que se estuda em cada ano**, do 1º ao 9º, na rede pública municipal de Joinville (SC). Ele também
planeja os **jogos** e **simulados** do app Estuda Criança.

- [Jogos por matéria](jogos.md): um jogo para cada matéria, com regras, conteúdo por ano e formato dos dados.
- [Simulados por etapa](simulados.md): um por trimestre e um final, com boletim por matéria.
- Conteúdo programático por ano: [1º](1-ano.md) · [2º](2-ano.md) · **[3º](3-ano.md)** · [4º](4-ano.md) · [5º](5-ano.md) ·
  [6º](6-ano.md) · [7º](7-ano.md) · [8º](8-ano.md) · [9º](9-ano.md)

## Onde estamos

| Ano | Conteúdo programático | Trilha escrita no app | Jogos | Simulados |
|---|---|---|---|---|
| 3º | Completo, por trimestre, com a classificação da rede | Sim (todas as matérias) | 9 jogos | 4 simulados |
| 1º, 2º, 4º–9º | Habilidades da BNCC e páginas do currículo de Joinville | Estudo pela BNCC ("Já sei" / "Ainda estou aprendendo") | Planejados | Planejados |

Próximos passos, em ordem:
1. No 3º ano, escrever os passos que faltam na trilha (marcados como "a fazer" em [3-ano.md](3-ano.md)).
2. Levantar o 4º ano por trimestre no PDF de Joinville, como foi feito no 3º, e criar `ano4.json` de conteúdo, jogos e simulados.
3. Seguir com 2º, 5º, 1º e depois os anos finais.

## Como o currículo de Joinville está organizado

A rede municipal usa a **BNCC** (MEC, 2018), o **Currículo Base do Território Catarinense** (2019) e o
**Currículo da Rede Municipal de Ensino de Joinville**, publicado pela Secretaria de Educação em 10/11/2022.

- **Ensino Fundamental de 9 anos:** anos iniciais (1º ao 5º) e anos finais (6º ao 9º).
- **Trimestres:** cada ano é dividido em 1º, 2º e 3º trimestre. O currículo diz em qual trimestre cada habilidade é trabalhada,
  e algumas se repetem nos três.
- **Classificação de cada habilidade** (revisão de 2022):
  - **Focal (AF):** aprendizagem principal, que precisa ser garantida no trimestre.
  - **Complementar (AC):** amplia e apoia as focais.
  - **Fluência (EF):** expectativa de fluência em Língua Portuguesa e Matemática (ler, escrever e calcular com autonomia).
- **Língua Inglesa** começa no **3º ano** na rede municipal. A BNCC só tem códigos de Inglês do 6º ao 9º ano; do 3º ao 5º
  a rede usa objetivos próprios.
- **Ensino Religioso** é componente da rede, sem caráter confessional: estuda a diversidade de tradições e de filosofias de vida.

### Códigos da BNCC

`EF03MA07` = **EF** (Ensino Fundamental) + **03** (ano; blocos como 15 = 1º ao 5º, 35 = 3º ao 5º, 69 = 6º ao 9º)
+ **MA** (componente) + **07** (número da habilidade).

Componentes: LP Língua Portuguesa · MA Matemática · CI Ciências · HI História · GE Geografia · AR Arte · EF Educação Física ·
LI Língua Inglesa · ER Ensino Religioso.

### Onde achar cada ano no currículo de Joinville

Páginas do PDF de cada área (o número impresso na página é outro):

| Área (PDF) | 1º | 2º | 3º | 4º | 5º | 6º | 7º | 8º | 9º |
|---|---|---|---|---|---|---|---|---|---|
| Matemática | 6 | 17 | 31 | 43 | 59 | 71 | 80 | 88 | 94 |
| Linguagens · Português | 9 | 24 | 44 | 64 | 86 | 107 | 130 | 163 | 196 |
| Linguagens · Ed. Física | 233 | 239 | 245 | 251 | 258 | 266 | 276 | 286 | 294 |
| Linguagens · Arte | 308 | 318 | 326 | 334 | 343 | 351 | 361 | 368 | 377 |
| Linguagens · Inglês | — | — | 393 | 398 | 403 | 408 | 419 | 431 | 441 |
| Ciências da Natureza | 5 | 7 | 9 | 12 | 15 | 18 | 21 | 25 | 29 |
| Ciências Humanas · Geografia | 4 | 7 | 10 | 13 | 16 | 19 | 22 | 27 | 33 |
| Ciências Humanas · História | 42 | 44 | 47 | 51 | 55 | 58 | 65 | 70 | 79 |
| Ensino Religioso | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 12 | 14 |

As tabelas dos PDFs são imagens: o texto não pode ser copiado. Para levantar outro ano, abra as páginas acima e anote, por
trimestre, os códigos BNCC e a classificação (AF, AC, EF), como em [3-ano.md](3-ano.md).

## Rotina sugerida em casa (3º ano)

| Dia | 15 a 20 minutos |
|---|---|
| Segunda | Matemática: trilha + Mercadinho |
| Terça | Português: trilha + Soletrando |
| Quarta | Outros: Ciências e Geografia + Classifica! ou Onde fica? |
| Quinta | Matemática: tabuada (1 minuto) + Português: leitura em voz alta |
| Sexta | Outros: História, Arte, Inglês + um jogo à escolha |
| Fim do trimestre | Simulado do trimestre; os pais olham o boletim na Área dos pais |

## Como atualizar

- Conteúdo da trilha: `data/conteudo/anoN.json` · jogos: `data/jogos/anoN.json` · simulados: `data/simulados/anoN.json`.
- Depois de editar: `node tools/validar-conteudo.mjs`.
- Para atualizar as tabelas "No app" deste roadmap: `python3 tools/gerar-roadmap.py`.

## Fontes

- Brasil. MEC. **Base Nacional Comum Curricular** (2018). https://basenacionalcomum.mec.gov.br/
- Santa Catarina. **Currículo Base da Educação Infantil e do Ensino Fundamental do Território Catarinense** (2019).
- Joinville. Secretaria de Educação. **Currículo da Rede Municipal de Ensino de Joinville** (2022).
  https://www.joinville.sc.gov.br/publicacoes/curriculo-da-rede-municipal-de-ensino-de-joinville/
- Joinville. **Política de Alfabetização e Letramento da Rede Municipal de Ensino** (2024).
- Mapa: Natural Earth (domínio público), pelo pacote world-atlas. Obras de arte: Wikimedia Commons (domínio público).
