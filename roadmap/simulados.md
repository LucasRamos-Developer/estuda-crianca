# Simulados por etapa

[Voltar ao roadmap](README.md) · [Jogos](jogos.md)

A rede municipal de Joinville organiza o ano em **3 trimestres**. Cada ano do app terá:

| Simulado | Quando fazer | Conteúdo |
|---|---|---|
| 1º trimestre | Fim de maio | O que o currículo traz no 1º trimestre |
| 2º trimestre | Fim de agosto ou setembro | 2º trimestre e retomada das habilidades de fluência |
| 3º trimestre | Fim de novembro | 3º trimestre |
| Final | Dezembro, ou antes de mudar de ano | Revisão do ano todo |

As datas são só sugestões; confira o calendário escolar da SED de Joinville.

## Como é cada simulado no app

- **20 questões novas**, que não aparecem na trilha: Matemática 5, Português 5, Ciências 2, História 2, Geografia 2,
  Arte 1, Educação Física 1, Inglês 1 (a partir do 3º ano) e Ensino Religioso 1.
- As questões vêm **na ordem das matérias**, como numa prova. O título mostra a matéria da questão.
- **Sem ajuda e sem segunda chance.** Ao errar, a criança vê a resposta certa e uma explicação curta.
- No fim aparece o **boletim por matéria** (acertos de cada uma) e a frase "Para revisar", com as matérias abaixo de 60%.
- O resultado fica salvo no aparelho: aparece em Desafios ("Última nota"), na **Área dos pais**, no **relatório em PDF**
  e no relatório em texto. Vale 20 XP e há conquistas ("Primeiro simulado", "Nota alta").
- Dá para refazer quantas vezes quiser; a Área dos pais mostra o histórico.

## 3º ano (pronto no app)

Arquivo: `data/simulados/ano3.json`.

| Simulado | Temas |
|---|---|
| 1º trimestre | Números até 3.000, adição e subtração, horas · ortografia, sílabas, receitas e cartas · som e luz · Joinville e seus grupos · cidade e campo |
| 2º trimestre | Números até 6.000, multiplicação, divisão, metade, dinheiro e sólidos · acentos, prefixos, publicidade e cartas · animais · marcos da memória · mapas e legendas |
| 3º trimestre | Números até 9.999, partes, medidas e tempo · poemas, rimas, cordel, verbos e pontuação · Terra, céu e solo · espaços públicos · água e consumo |
| Final | Revisão do ano todo |

Cada questão tem o código da habilidade BNCC e segue a distribuição do currículo de Joinville no [3º ano](3-ano.md).

## Formato do arquivo

```json
{ "ano": 3, "versao": "2026-10-18",
  "simulados": [
    { "id": "y3-sim-1", "titulo": "Simulado do 1º trimestre", "etapa": 1, "temas": "texto curto",
      "questoes": {
        "ma": [ ["Enunciado?", ["certa", "errada 1", "errada 2", "errada 3"], "explicação", "EF03MA01"] ],
        "lp": [ ... ], "ci": [ ... ], "hi": [ ... ], "ge": [ ... ], "ar": [ ... ], "ef": [ ... ], "li": [ ... ], "er": [ ... ]
      } } ] }
```

- A **resposta certa vem primeiro**; o app embaralha.
- O 4º item (habilidade) é opcional. Em Inglês do 3º ao 5º ano fica vazio, porque a BNCC não tem código para esses anos.
- `id` não pode repetir. O validador (`node tools/validar-conteudo.mjs`) confere alternativas repetidas e códigos BNCC.

## Plano para os outros anos

| Ano | Foco dos simulados | Avaliação externa |
|---|---|---|
| 1º | Letras, sons e sílabas; números até 100; o corpo; eu e minha família (questões com leitura em voz alta pelo app) | — |
| 2º | Leitura de frases e textos curtos; números até 1.000; adição e subtração; seres vivos | SAEB (alfabetização) |
| 4º | Números até 100 mil; multiplicação e divisão; frações; Santa Catarina; gêneros textuais | — |
| 5º | Números decimais; porcentagem simples; interpretação de textos; Brasil e regiões | SAEB (Português e Matemática) |
| 6º–8º | Um simulado por trimestre com questões no estilo das provas da rede | — |
| 9º | Revisão do Ensino Fundamental | SAEB (Português e Matemática; Ciências por amostra) |

No 5º e no 9º ano vale acrescentar um **simulado no estilo SAEB**, só com Português e Matemática e questões de interpretação.
