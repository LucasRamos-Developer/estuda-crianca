// Conteúdo do 3º ano — BNCC + Currículo Base do Território Catarinense + Joinville.
// Cada pergunta: [enunciado, [resposta certa, erradas...], explicação opcional].
// A resposta certa vem sempre primeiro; o app embaralha. Verdadeiro/Falso: ['Verdadeiro','Falso'] ou ['Falso','Verdadeiro'].
const VF = ['Verdadeiro', 'Falso'];
const FV = ['Falso', 'Verdadeiro'];

export default {
  // ---------------- LÍNGUA PORTUGUESA ----------------
  lp: [
    {
      unit: 'Letras e sons',
      nodes: [
        {
          id: 'y3-lp-1', title: 'C ou QU? G ou GU?', skills: ['EF03LP01'],
          intro: 'Algumas letras mudam de som dependendo da vogal que vem depois. Para não errar, preste atenção no som.',
          points: [
            'Antes de E e I, o som de K se escreve com QU: queijo, quilo.',
            'Antes de E e I, o som de "guê" se escreve com GU: guerra, guitarra.',
            'Entre vogais, o R forte se escreve RR (carro) e o S com som de "ss" se escreve SS (pássaro).',
            'Antes de P e B usamos M: campo, bombom. O til (~) também marca som nasal: mão, pão.',
          ],
          example: 'casa, queijo, quilo · gato, guerra, guitarra · caro / carro · casa / cassa',
          q: [
            ['Qual palavra está escrita certo?', ['queijo', 'keijo', 'cueijo', 'queiju']],
            ['Complete: um ___ilo de arroz.', ['qu', 'c', 'k', 'g'], 'Antes do I, o som de K é escrito com QU: quilo.'],
            ['Complete: a fo___eira da festa junina.', ['gu', 'g', 'j', 'qu'], 'Fogueira: antes do E, o som de "guê" se escreve com GU.'],
            ['Complete: o ca___o do papai (veículo).', ['rr', 'r', 'h', 'rh'], 'Entre vogais, o R forte é RR: carro.'],
            ['Complete: o pá___aro voou.', ['ss', 's', 'z', 'ç'], 'Entre vogais, para o som de "ss" usamos SS: pássaro.'],
            ['Complete: o ca___po de futebol.', ['m', 'n', 'nh', 'ã'], 'Antes de P e B usamos M: campo.'],
            ['Qual está escrita certo?', ['leite', 'leiti', 'leitu', 'leiri'], 'No final da palavra, falamos "i", mas escrevemos E.'],
            ['Qual está escrita certo?', ['menino', 'minino', 'meninu', 'mininu']],
          ],
        },
        {
          id: 'y3-lp-2', title: 'LH, NH e CH', skills: ['EF03LP03', 'EF03LP02'],
          intro: 'Dígrafo são duas letras que, juntas, fazem um som só. LH, NH e CH são dígrafos muito usados.',
          points: [
            'LH: abelha, palhaço, olho.',
            'NH: aranha, ninho, banho.',
            'CH: chuva, chave, bicho.',
            'Toda sílaba tem pelo menos uma vogal: pra-to, chu-va, ba-nho.',
          ],
          example: 'o-lho · a-ra-nha · chu-va',
          q: [
            ['Complete: a abe___a faz mel.', ['lh', 'nh', 'ch', 'li']],
            ['Complete: a ara___a fez uma teia.', ['nh', 'lh', 'ch', 'n']],
            ['Complete: caiu muita ___uva.', ['ch', 'x', 'nh', 'lh']],
            ['Dígrafo é…', ['duas letras que fazem um só som', 'duas palavras juntas', 'uma letra maiúscula', 'um sinal de pontuação']],
            ['Qual palavra tem dígrafo?', ['olho', 'bola', 'sapo', 'casa']],
            ['Toda sílaba tem pelo menos uma…', ['vogal', 'consoante', 'letra maiúscula', 'acento']],
            ['Complete: o pa___aço do circo.', ['lh', 'nh', 'ch', 'l']],
          ],
        },
      ],
    },
    {
      unit: 'Sílabas e acentos',
      nodes: [
        {
          id: 'y3-lp-3', title: 'Contando sílabas', skills: ['EF03LP05'],
          intro: 'Sílaba é cada pedacinho da palavra que falamos de uma vez. Bata palmas para contar!',
          points: [
            'Monossílaba: 1 sílaba (sol, pão).',
            'Dissílaba: 2 sílabas (ca-sa).',
            'Trissílaba: 3 sílabas (bo-ne-ca).',
            'Polissílaba: 4 ou mais sílabas (bor-bo-le-ta).',
          ],
          example: 'sol (1) · ca-sa (2) · bo-ne-ca (3) · bor-bo-le-ta (4)',
          q: [
            ['"Sol" tem quantas sílabas?', ['1 (monossílaba)', '2 (dissílaba)', '3 (trissílaba)', '4 (polissílaba)']],
            ['"Bo-ne-ca" é uma palavra…', ['trissílaba', 'dissílaba', 'monossílaba', 'polissílaba']],
            ['"Bor-bo-le-ta" é uma palavra…', ['polissílaba', 'trissílaba', 'dissílaba', 'monossílaba']],
            ['"Ca-sa" é uma palavra…', ['dissílaba', 'monossílaba', 'trissílaba', 'polissílaba']],
            ['Qual palavra é monossílaba?', ['pão', 'sapo', 'janela', 'abacate']],
            ['Polissílaba é a palavra que tem…', ['4 sílabas ou mais', 'só 1 sílaba', '2 sílabas', '3 sílabas']],
            ['Quantas sílabas tem "Joinville" (Join-vil-le)?', ['3', '2', '4', '1']],
          ],
        },
        {
          id: 'y3-lp-4', title: 'Sílaba tônica', skills: ['EF03LP06'],
          intro: 'Sílaba tônica é a sílaba que falamos com mais força. Fale a palavra devagar e descubra qual é.',
          points: [
            'Oxítona: a tônica é a última sílaba (ca-FÉ, ja-ca-RÉ).',
            'Paroxítona: a tônica é a penúltima (ME-sa, ca-DEI-ra).',
            'Proparoxítona: a tônica é a antepenúltima (LÂM-pa-da, MÉ-di-co).',
            'Toda proparoxítona tem acento.',
          ],
          example: 'ca-FÉ (oxítona) · ME-sa (paroxítona) · LÂM-pa-da (proparoxítona)',
          q: [
            ['Sílaba tônica é a sílaba…', ['falada com mais força', 'que sempre tem acento', 'do começo da palavra', 'mais comprida']],
            ['Em "café", a sílaba tônica é…', ['fé', 'ca', 'as duas', 'nenhuma']],
            ['"Café" é uma palavra…', ['oxítona', 'paroxítona', 'proparoxítona', 'monossílaba']],
            ['"Mesa" é uma palavra…', ['paroxítona', 'oxítona', 'proparoxítona', 'polissílaba']],
            ['"Lâmpada" é uma palavra…', ['proparoxítona', 'paroxítona', 'oxítona', 'monossílaba']],
            ['Toda palavra proparoxítona tem acento.', VF],
            ['Em "janela", qual é a sílaba tônica?', ['ne', 'ja', 'la', 'nenhuma']],
          ],
        },
        {
          id: 'y3-lp-5', title: 'Acento agudo e circunflexo', skills: ['EF03LP04'],
          intro: 'O acento mostra a sílaba mais forte e se o som é aberto ou fechado.',
          points: [
            'Acento agudo (´): som aberto, como em pé, avó, café.',
            'Acento circunflexo (^): som fechado, como em você, avô.',
            'Levam acento os monossílabos fortes terminados em A, E, O: pá, pé, nó.',
            'Levam acento as oxítonas terminadas em A, E, O (com ou sem S): sofá, você, jacarés.',
          ],
          example: 'avó (aberto) · avô (fechado) · sofá · você',
          q: [
            ['Qual está escrita certo?', ['sofá', 'sofa', 'sôfa', 'sófa']],
            ['Qual está escrita certo?', ['você', 'vocé', 'voce', 'vôce']],
            ['Qual está escrita certo?', ['pé', 'pe', 'pê', 'pè']],
            ['O acento circunflexo (^) deixa o som…', ['fechado, como em avô', 'aberto, como em avó', 'mais comprido', 'sem som']],
            ['A mãe da sua mãe é a sua…', ['avó', 'avô', 'avo', 'avõ']],
            ['Qual palavra oxítona precisa de acento?', ['jacaré', 'tatu', 'urubu', 'papel']],
          ],
        },
      ],
    },
    {
      unit: 'Frases e pontuação',
      nodes: [
        {
          id: 'y3-lp-6', title: 'Pontuação e diálogo', skills: ['EF03LP07', 'EF35LP07'],
          intro: 'Os sinais de pontuação ajudam a ler com a entonação certa.',
          points: [
            'Ponto final (.): termina uma frase que afirma algo.',
            'Ponto de interrogação (?): faz uma pergunta.',
            'Ponto de exclamação (!): mostra surpresa, alegria, susto.',
            'No diálogo: dois-pontos (:) antes da fala e travessão (—) no começo da fala do personagem.',
          ],
          example: 'A menina perguntou:\n— Você quer brincar?',
          q: [
            ['Qual sinal usamos no fim de uma pergunta?', ['?', '!', '.', ':']],
            ['"Que susto___" Qual sinal mostra surpresa?', ['!', '?', '.', ':']],
            ['Em diálogos, a fala do personagem começa com…', ['travessão (—)', 'vírgula', 'ponto final', 'parênteses']],
            ['Antes da fala do personagem, depois de "disse", usamos…', ['dois-pontos (:)', 'ponto de interrogação', 'ponto final', 'travessão duplo']],
            ['O ponto final serve para…', ['terminar uma frase que afirma algo', 'fazer pergunta', 'mostrar susto', 'separar sílabas']],
            ['Qual frase é uma pergunta?', ['Onde está meu lápis?', 'Meu lápis caiu.', 'Que lápis lindo!', 'Peguei o lápis.']],
          ],
        },
      ],
    },
    {
      unit: 'Classes de palavras',
      nodes: [
        {
          id: 'y3-lp-7', title: 'Substantivo e verbo', skills: ['EF03LP08'],
          intro: 'Nas frases, algumas palavras dão nome às coisas e outras mostram ações.',
          points: [
            'Substantivo: dá nome a pessoas, animais, objetos, lugares e sentimentos (menina, gato, escola, Joinville).',
            'Verbo: indica ação (correr, pular, latir).',
            'Na frase, quem faz a ação é o agente: "A MENINA chutou a bola".',
          ],
          example: 'O cachorro (substantivo) late (verbo).',
          q: [
            ['Substantivo é a palavra que dá nome a…', ['pessoas, animais, objetos e lugares', 'ações', 'qualidades', 'números']],
            ['Verbo é a palavra que indica…', ['ação, como correr e pular', 'nome de objeto', 'qualidade', 'lugar']],
            ['Em "O cachorro late", qual é o verbo?', ['late', 'cachorro', 'O', 'nenhum']],
            ['Em "A menina chutou a bola", quem faz a ação?', ['a menina', 'a bola', 'chutou', 'ninguém']],
            ['Qual palavra é substantivo?', ['escola', 'correr', 'bonito', 'depressa']],
            ['Qual palavra é verbo?', ['pular', 'mesa', 'azul', 'feliz']],
          ],
        },
        {
          id: 'y3-lp-8', title: 'Adjetivos', skills: ['EF03LP09'],
          intro: 'Adjetivo é a palavra que diz como é o substantivo: dá uma qualidade ou característica.',
          points: [
            'Exemplos: bonito, alto, azul, alegre, quente.',
            '"Gato preguiçoso": preguiçoso é o adjetivo de gato.',
            'Adjetivos deixam o texto mais rico e detalhado.',
          ],
          example: 'A sopa quente. O céu azul. A menina alegre.',
          q: [
            ['Adjetivo é a palavra que…', ['dá uma qualidade ao substantivo', 'indica ação', 'dá nome às coisas', 'liga duas frases']],
            ['Em "gato preguiçoso", o adjetivo é…', ['preguiçoso', 'gato', 'os dois', 'nenhum']],
            ['Qual palavra é adjetivo?', ['alegre', 'correr', 'casa', 'ontem']],
            ['Complete com um adjetivo: "O céu está ____."', ['azul', 'nadar', 'janela', 'mesa']],
            ['Em "a sopa quente", a palavra "quente" diz…', ['como é a sopa', 'o que a sopa faz', 'onde está a sopa', 'quando foi a sopa']],
          ],
        },
        {
          id: 'y3-lp-9', title: 'Prefixos e sufixos', skills: ['EF03LP10'],
          intro: 'Podemos criar palavras novas colocando pedacinhos no começo (prefixo) ou no fim (sufixo).',
          points: [
            'Prefixo IN-/DES- dá ideia de contrário: feliz → infeliz, fazer → desfazer.',
            'Prefixo RE- dá ideia de repetir: fazer → refazer.',
            'Sufixo -INHO/-INHA dá ideia de pequeno: casa → casinha.',
            'Sufixo -EIRO indica profissão: pão → padeiro.',
          ],
          example: 'feliz → infeliz · casa → casinha · pão → padeiro',
          q: [
            ['Feliz → infeliz. O "in-" deu ideia de…', ['contrário', 'tamanho pequeno', 'lugar', 'profissão']],
            ['Pão → padeiro. O "-eiro" indica…', ['profissão', 'contrário', 'coisa pequena', 'tempo passado']],
            ['Casa → casinha. O "-inha" indica…', ['tamanho pequeno', 'tamanho grande', 'contrário', 'profissão']],
            ['Qual palavra significa "fazer de novo"?', ['refazer', 'desfazer', 'fazendo', 'feito']],
            ['"Desamarrar" significa…', ['soltar o que estava amarrado', 'amarrar de novo', 'amarrar bem forte', 'comprar uma amarra']],
          ],
        },
      ],
    },
    {
      unit: 'Leitura e textos',
      nodes: [
        {
          id: 'y3-lp-10', title: 'Ler e entender', skills: ['EF15LP03', 'EF35LP03', 'EF35LP04', 'EF35LP05'],
          intro: 'Leia o texto com calma. Depois responda: o que está escrito, o que dá para entender e qual é a ideia principal.',
          passage: 'Lia plantou uma semente de feijão num copo com algodão molhado. Todos os dias ela colocava o copo perto da janela e regava um pouquinho. Depois de uma semana, apareceu um brotinho verde. Lia ficou tão feliz que mostrou para toda a família.',
          points: [
            'Informação explícita: está escrita no texto.',
            'Informação implícita: não está escrita, mas dá para descobrir pelas pistas.',
            'Ideia principal: o assunto mais importante do texto.',
          ],
          q: [
            ['Onde Lia plantou a semente?', ['num copo com algodão molhado', 'no jardim', 'num vaso de terra', 'na escola']],
            ['Por que Lia colocava o copo perto da janela?', ['para a planta receber luz', 'para esfriar a água', 'para esconder o copo', 'para secar o algodão']],
            ['Qual é a ideia principal do texto?', ['uma semente que cresceu com cuidado', 'a família de Lia', 'a janela da casa', 'um copo quebrado']],
            ['No texto, "brotinho" quer dizer…', ['plantinha que está nascendo', 'flor grande', 'fruta madura', 'semente seca']],
            ['Quanto tempo demorou para aparecer o broto?', ['uma semana', 'um dia', 'um mês', 'um ano']],
            ['Como Lia se sentiu?', ['feliz', 'triste', 'com medo', 'com raiva']],
          ],
        },
        {
          id: 'y3-lp-11', title: 'Receita, carta e diário', skills: ['EF03LP11', 'EF03LP12', 'EF03LP16', 'EF03LP17'],
          intro: 'Cada tipo de texto (gênero) tem um jeito próprio de ser organizado.',
          points: [
            'Receita: lista de ingredientes e modo de fazer, com verbos de ordem (misture, coloque, asse).',
            'Carta pessoal: local e data, saudação ("Querida vovó,"), mensagem, despedida e assinatura.',
            'Diário: a pessoa conta o que viveu e sentiu no dia.',
            'Instruções de montagem: passos numerados para montar algo.',
          ],
          q: [
            ['Uma receita tem…', ['ingredientes e modo de fazer', 'personagens e conflito', 'manchete', 'rimas']],
            ['Qual frase parece de um modo de fazer?', ['Misture a farinha com o leite.', 'Ontem misturei a farinha.', 'Que farinha boa!', 'Você misturou?']],
            ['Uma carta pessoal começa com…', ['local, data e saudação', 'a manchete', 'lista de ingredientes', 'a moral da história']],
            ['No final da carta, colocamos…', ['despedida e assinatura', 'ingredientes', 'a manchete', 'o modo de fazer']],
            ['Diário é um texto em que a pessoa…', ['conta o que viveu e sentiu no dia', 'ensina a fazer um bolo', 'vende um produto', 'dá notícia para a cidade']],
            ['Qual texto serve para ensinar a montar um brinquedo?', ['instruções de montagem', 'poema', 'carta pessoal', 'notícia']],
          ],
        },
        {
          id: 'y3-lp-12', title: 'Notícia e propaganda', skills: ['EF03LP18', 'EF03LP19', 'EF35LP16'],
          intro: 'Notícias informam fatos. Propagandas tentam convencer.',
          points: [
            'Manchete: o título da notícia, chama a atenção para o fato.',
            'A notícia responde: o quê, quem, quando, onde e como.',
            'Propaganda usa cores, imagens, letras grandes e slogan para convencer.',
          ],
          example: 'Manchete: "Festival de Dança movimenta Joinville em julho"',
          q: [
            ['Manchete é…', ['o título da notícia', 'o fim da notícia', 'a assinatura', 'a legenda da foto']],
            ['A notícia informa sobre…', ['um fato que aconteceu de verdade', 'uma história de fadas', 'como fazer um bolo', 'os sentimentos do autor']],
            ['A propaganda quer…', ['convencer a pessoa a comprar ou fazer algo', 'contar um sonho', 'ensinar tabuada', 'registrar o dia']],
            ['Slogan é…', ['uma frase curta e fácil de lembrar', 'um tipo de carta', 'o nome do jornal', 'um verbo']],
            ['Cores fortes e letras grandes no anúncio servem para…', ['chamar a atenção', 'esconder informações', 'deixar o texto maior', 'nada']],
          ],
        },
        {
          id: 'y3-lp-13', title: 'Histórias e poemas', skills: ['EF35LP23', 'EF35LP26', 'EF35LP27', 'EF35LP29'],
          intro: 'Histórias têm personagens, lugar, tempo e um problema para resolver. Poemas brincam com sons e rimas.',
          points: [
            'Personagens: quem participa da história.',
            'Cenário: onde e quando a história acontece.',
            'Conflito: o problema; desfecho: como ele se resolve.',
            'No poema: cada linha é um verso; um grupo de versos é uma estrofe; rima é som igual no final.',
          ],
          example: 'Da janela vejo a panela (janela / panela rimam)',
          q: [
            ['Personagens de uma história são…', ['quem participa da história', 'o lugar onde ela acontece', 'o título', 'o desenho da capa']],
            ['O lugar e o tempo onde a história acontece formam o…', ['cenário', 'conflito', 'verso', 'título']],
            ['O problema que aparece na história é o…', ['conflito', 'final feliz', 'título', 'verso']],
            ['Rima é quando as palavras…', ['terminam com o mesmo som', 'começam com a mesma letra', 'têm o mesmo tamanho', 'são verbos']],
            ['Qual par de palavras rima?', ['janela / panela', 'casa / bola', 'sol / lua', 'mesa / copo']],
            ['Cada linha de um poema é um…', ['verso', 'parágrafo', 'capítulo', 'título']],
            ['Um grupo de versos forma uma…', ['estrofe', 'frase', 'rima', 'manchete']],
          ],
        },
      ],
    },
  ],

  // ---------------- MATEMÁTICA ----------------
  ma: [
    {
      unit: 'Números até 1000',
      nodes: [
        {
          id: 'y3-ma-1', title: 'Centenas, dezenas e unidades', skills: ['EF03MA01', 'EF03MA02'],
          intro: 'Nosso sistema de numeração agrupa de 10 em 10. Cada posição do número tem um valor.',
          points: [
            '10 unidades = 1 dezena; 10 dezenas = 1 centena; 10 centenas = 1 milhar (1000).',
            'Em 482: o 4 vale 400, o 8 vale 80 e o 2 vale 2.',
            'Decompor: 537 = 500 + 30 + 7.',
          ],
          example: '482 = 4 centenas + 8 dezenas + 2 unidades',
          q: [
            ['Como se escreve "trezentos e quarenta e cinco"?', ['345', '3045', '354', '30045']],
            ['No número 482, o 4 vale…', ['400', '40', '4', '4000']],
            ['Qual é o maior número?', ['809', '790', '798', '800']],
            ['500 + 30 + 7 =', ['537', '5307', '573', '735']],
            ['Quantas dezenas tem 1 centena?', ['10', '100', '1', '1000']],
            ['Mil é igual a…', ['10 centenas', '10 dezenas', '100 unidades', '1 centena']],
            ['Qual número vem logo depois de 399?', ['400', '390', '3910', '401']],
            ['Como se escreve 608 por extenso?', ['seiscentos e oito', 'seiscentos e oitenta', 'sessenta e oito', 'seis mil e oito']],
          ],
        },
        {
          id: 'y3-ma-2', title: 'Reta numérica e sequências', skills: ['EF03MA04', 'EF03MA10', 'EF03MA11'],
          intro: 'Na reta numérica os números ficam em ordem. Em uma sequência, descobrimos a regra que se repete.',
          points: [
            'Andar para a direita na reta = somar; para a esquerda = tirar.',
            '5, 10, 15, 20: a regra é somar 5.',
            'Contas diferentes podem dar o mesmo resultado: 6 + 4 = 7 + 3.',
          ],
          q: [
            ['Na reta: 10, 20, 30, __, 50', ['40', '35', '60', '45']],
            ['Qual é a regra da sequência 5, 10, 15, 20?', ['somar 5', 'somar 10', 'tirar 5', 'dobrar']],
            ['Continue: 100, 90, 80, __', ['70', '60', '85', '90']],
            ['Complete: 3, 6, 9, 12, __', ['15', '14', '13', '18']],
            ['Qual conta dá o mesmo resultado que 6 + 4?', ['7 + 3', '6 + 5', '5 + 4', '2 + 9']],
            ['12 − 2 tem o mesmo resultado que…', ['15 − 5', '12 − 3', '11 − 2', '10 − 1']],
          ],
        },
      ],
    },
    {
      unit: 'Somar e tirar',
      nodes: [
        { gen: 'add-rev', skills: ['EF03MA03', 'EF03MA05'] },
        { gen: 'subt-rev', skills: ['EF03MA03', 'EF03MA05'] },
        { gen: 'sub-4', skills: ['EF03MA05', 'EF03MA06'] },
        { gen: 'sub-5', skills: ['EF03MA05', 'EF03MA06'] },
        { gen: 'sub-7', skills: ['EF03MA05', 'EF03MA06'] },
      ],
    },
    {
      unit: 'Multiplicação',
      nodes: [
        { gen: 'mul-2', skills: ['EF03MA03', 'EF03MA07'] },
        { gen: 'mul-3', skills: ['EF03MA03', 'EF03MA07'] },
        { gen: 'mul-4', skills: ['EF03MA03', 'EF03MA07'] },
        { gen: 'mul-5', skills: ['EF03MA03', 'EF03MA07'] },
      ],
    },
    {
      unit: 'Divisão e partes',
      nodes: [
        { gen: 'div-2', skills: ['EF03MA08'] },
        { gen: 'div-3', skills: ['EF03MA08'] },
        { gen: 'div-4', skills: ['EF03MA08'] },
        { gen: 'div-5', skills: ['EF03MA08'] },
        {
          id: 'y3-ma-3', title: 'Metade, terça e quarta parte', skills: ['EF03MA09'],
          intro: 'Dividir em partes iguais tem nomes especiais.',
          points: [
            'Metade: dividir por 2. Terça parte: por 3. Quarta parte: por 4.',
            'Quinta parte: por 5. Décima parte: por 10.',
            'A metade de 10 é 5, porque 10 ÷ 2 = 5.',
          ],
          q: [
            ['Metade de 10 é…', ['5', '2', '10', '20']],
            ['A terça parte de 12 é…', ['4', '3', '6', '9']],
            ['A quarta parte de 20 é…', ['5', '4', '10', '16']],
            ['A quinta parte de 15 é…', ['3', '5', '10', '15']],
            ['A décima parte de 30 é…', ['3', '10', '30', '300']],
            ['Uma pizza foi dividida em 4 pedaços iguais. Cada pedaço é…', ['a quarta parte', 'a metade', 'a terça parte', 'a décima parte']],
          ],
        },
        {
          id: 'y3-ma-4', title: 'Divisão com resto', skills: ['EF03MA08'],
          intro: 'Nem toda divisão é exata. Quando sobra alguma coisa, isso é o resto.',
          points: [
            '13 balas para 4 crianças: cada uma ganha 3 (4 × 3 = 12) e sobra 1.',
            'Resto zero: a divisão é exata, não sobra nada.',
            'O resto é sempre menor que o número pelo qual dividimos.',
          ],
          q: [
            ['13 balas para 4 crianças. Cada uma ganha quantas e quantas sobram?', ['3 e sobra 1', '4 e sobra 1', '3 e sobram 2', '2 e sobram 5']],
            ['17 ÷ 5 dá…', ['3 e resto 2', '3 e resto 1', '4 e resto 2', '2 e resto 7']],
            ['Tenho 20 figurinhas e colo 6 por página. Quantas páginas ficam completas?', ['3 (sobram 2)', '4', '2 (sobram 8)', '5']],
            ['Resto zero quer dizer que…', ['a divisão é exata, não sobra nada', 'sobrou tudo', 'não dá para dividir', 'o resultado é zero']],
            ['10 ÷ 3 dá…', ['3 e resto 1', '3 e resto 0', '4 e resto 1', '2 e resto 4']],
          ],
        },
      ],
    },
    {
      unit: 'Geometria',
      nodes: [
        {
          id: 'y3-ma-5', title: 'Figuras espaciais', skills: ['EF03MA13', 'EF03MA14'],
          intro: 'Figuras espaciais têm volume: dá para pegar na mão. Muitos objetos parecem com elas.',
          points: [
            'Esfera: bola. Cubo: dado. Cone: casquinha de sorvete.',
            'Cilindro: lata. Bloco retangular: caixa de sapato. Pirâmide: base com pontas que se encontram em cima.',
            'O cubo tem 6 faces, todas quadradas.',
          ],
          q: [
            ['Uma bola de futebol parece uma…', ['esfera', 'cubo', 'cone', 'cilindro']],
            ['Um dado parece um…', ['cubo', 'esfera', 'cone', 'pirâmide']],
            ['Uma casquinha de sorvete parece um…', ['cone', 'cubo', 'cilindro', 'esfera']],
            ['Uma lata de suco parece um…', ['cilindro', 'cone', 'cubo', 'pirâmide']],
            ['Uma caixa de sapato parece um…', ['bloco retangular', 'esfera', 'cone', 'cilindro']],
            ['Quantas faces tem um cubo?', ['6', '4', '8', '12']],
            ['Qual figura rola em qualquer direção?', ['esfera', 'cubo', 'pirâmide', 'bloco retangular']],
          ],
        },
        {
          id: 'y3-ma-6', title: 'Figuras planas e caminhos', skills: ['EF03MA15', 'EF03MA16', 'EF03MA12'],
          intro: 'Figuras planas são "chatas", desenhadas no papel. Também aprendemos a descrever caminhos.',
          points: [
            'Triângulo: 3 lados. Quadrado: 4 lados iguais. Retângulo: 4 lados, os opostos iguais.',
            'Vértice: o ponto onde dois lados se encontram.',
            'Figuras congruentes: mesma forma e mesmo tamanho.',
            'Croqui: desenho simples de um lugar visto de cima, com pontos de referência.',
          ],
          q: [
            ['Quantos lados tem um triângulo?', ['3', '4', '5', '6']],
            ['O quadrado tem…', ['4 lados iguais', '4 lados, 2 grandes e 2 pequenos', '3 lados', '5 lados']],
            ['Vértice é…', ['o ponto onde dois lados se encontram', 'o meio da figura', 'o lado mais comprido', 'a cor da figura']],
            ['Quantos vértices tem um quadrado?', ['4', '3', '2', '8']],
            ['Figuras congruentes são…', ['iguais em forma e tamanho', 'da mesma cor', 'de tamanhos diferentes', 'sempre círculos']],
            ['Você está de frente para a escola, vira à direita e depois à direita de novo. Agora fica…', ['de costas para a escola', 'de frente para a escola', 'de lado', 'no mesmo lugar']],
            ['Croqui é…', ['um desenho simples de um lugar visto de cima', 'uma foto', 'uma conta', 'um poema']],
          ],
        },
      ],
    },
    {
      unit: 'Medidas',
      nodes: [
        {
          id: 'y3-ma-7', title: 'Comprimento', skills: ['EF03MA17', 'EF03MA18', 'EF03MA19'],
          intro: 'Medimos comprimento com régua, fita métrica ou trena.',
          points: [
            '1 metro (m) = 100 centímetros (cm).',
            '1 centímetro = 10 milímetros (mm).',
            'Se medirmos com palmos, cada pessoa encontra um resultado diferente: por isso usamos unidades padronizadas.',
          ],
          q: [
            ['Para medir o comprimento de uma mesa usamos…', ['régua ou fita métrica', 'balança', 'relógio', 'termômetro']],
            ['1 metro tem quantos centímetros?', ['100', '10', '1000', '60']],
            ['1 centímetro tem quantos milímetros?', ['10', '100', '1000', '5']],
            ['Qual unidade é melhor para medir a altura de uma porta?', ['metro', 'milímetro', 'litro', 'quilograma']],
            ['Medindo a mesma mesa com palmos, pessoas diferentes acham números diferentes porque…', ['cada palmo tem um tamanho', 'a mesa muda de tamanho', 'a régua quebrou', 'o metro muda']],
            ['O tamanho de uma formiga é medido melhor em…', ['milímetros', 'metros', 'litros', 'quilos']],
          ],
        },
        {
          id: 'y3-ma-8', title: 'Massa e capacidade', skills: ['EF03MA20', 'EF03MA21'],
          intro: 'Massa é o "peso" (medido com balança). Capacidade é quanto cabe num recipiente.',
          points: [
            '1 quilograma (kg) = 1000 gramas (g).',
            '1 litro (L) = 1000 mililitros (mL).',
            'Leia os rótulos: leite em litros, arroz em quilos, iogurte em gramas.',
          ],
          q: [
            ['Para saber quanto pesa uma melancia usamos…', ['balança', 'régua', 'relógio', 'fita métrica']],
            ['1 quilograma tem quantos gramas?', ['1000', '100', '10', '500']],
            ['1 litro tem quantos mililitros?', ['1000', '100', '10', '500']],
            ['O leite costuma ser vendido em…', ['litros', 'metros', 'centímetros', 'horas']],
            ['O que pesa mais: 1 kg de algodão ou 1 kg de ferro?', ['Os dois pesam igual', 'O ferro', 'O algodão', 'Depende da cor']],
            ['Um copo de água tem mais ou menos…', ['200 mililitros', '20 litros', '2 mililitros', '200 litros']],
          ],
        },
        {
          id: 'y3-ma-9', title: 'Horas e tempo', skills: ['EF03MA22', 'EF03MA23'],
          intro: 'Usamos relógios para saber as horas e quanto tempo dura cada atividade.',
          points: [
            '1 hora = 60 minutos; 1 minuto = 60 segundos.',
            'Meia hora = 30 minutos.',
            'No relógio de ponteiros: o pequeno marca as horas, o grande marca os minutos.',
            'Duração: se começa às 13h e termina às 15h, durou 2 horas.',
          ],
          q: [
            ['1 hora tem quantos minutos?', ['60', '100', '30', '24']],
            ['1 minuto tem quantos segundos?', ['60', '100', '10', '30']],
            ['O ponteiro pequeno do relógio marca…', ['as horas', 'os minutos', 'os segundos', 'os dias']],
            ['Meia hora são…', ['30 minutos', '50 minutos', '15 minutos', '60 minutos']],
            ['A aula começou às 13h e terminou às 15h. Durou…', ['2 horas', '1 hora', '3 horas', '15 horas']],
            ['O filme começou às 14h30 e durou 1 hora. Terminou às…', ['15h30', '14h31', '16h', '15h']],
          ],
        },
        {
          id: 'y3-ma-10', title: 'Dinheiro', skills: ['EF03MA24'],
          intro: 'Usamos o real (R$). Precisamos saber trocar, comparar valores e calcular o troco.',
          points: [
            '1 real = 100 centavos. 2 moedas de 50 centavos = 1 real.',
            'Troco: o que pagamos menos o preço. Pagou R$ 10 por R$ 7 → troco de R$ 3.',
          ],
          q: [
            ['Quantas moedas de 50 centavos formam 1 real?', ['2', '5', '10', '4']],
            ['Comprei um lanche de R$ 7 e paguei com R$ 10. O troco foi…', ['R$ 3', 'R$ 17', 'R$ 7', 'R$ 2']],
            ['Uma nota de R$ 20 vale quantas notas de R$ 5?', ['4', '2', '5', '10']],
            ['Qual valor é o maior?', ['R$ 12,50', 'R$ 12,05', 'R$ 10,90', 'R$ 9,99']],
            ['Um caderno custa R$ 8. Dois cadernos custam…', ['R$ 16', 'R$ 10', 'R$ 18', 'R$ 8']],
            ['Quantas moedas de 25 centavos formam 1 real?', ['4', '5', '2', '25']],
          ],
        },
      ],
    },
    {
      unit: 'Gráficos e chances',
      nodes: [
        {
          id: 'y3-ma-11', title: 'Tabelas, gráficos e chances', skills: ['EF03MA25', 'EF03MA26', 'EF03MA27', 'EF03MA28'],
          intro: 'Tabelas e gráficos organizam informações. Também pensamos no que tem mais ou menos chance de acontecer.',
          passage: 'Fruta preferida da turma — Banana: 8 · Maçã: 5 · Uva: 10 · Morango: 7',
          points: [
            'A barra mais alta do gráfico mostra o mais escolhido.',
            'Para saber o total, somamos todos os valores.',
            'Um dado comum tem 6 faces: pode sair 1, 2, 3, 4, 5 ou 6.',
          ],
          q: [
            ['Qual fruta foi a mais escolhida?', ['Uva', 'Banana', 'Maçã', 'Morango']],
            ['Quantas crianças escolheram banana?', ['8', '5', '10', '7']],
            ['Quantas crianças votaram ao todo?', ['30', '28', '25', '20']],
            ['A uva teve quantos votos a mais que a maçã?', ['5', '3', '10', '2']],
            ['Ao jogar um dado comum, quais números podem sair?', ['1, 2, 3, 4, 5 ou 6', 'só números pares', 'de 1 a 10', 'só o 6']],
            ['Numa caixa com 9 bolas azuis e 1 vermelha, é mais provável tirar uma bola…', ['azul', 'vermelha', 'as duas têm a mesma chance', 'verde']],
          ],
        },
      ],
    },
  ],

  // ---------------- CIÊNCIAS ----------------
  ci: [
    {
      unit: 'Som e luz',
      nodes: [
        {
          id: 'y3-ci-1', title: 'O som', skills: ['EF03CI01', 'EF03CI03'],
          intro: 'O som acontece quando algo vibra. A vibração chega até nossos ouvidos.',
          points: [
            'Tambor, violão e até nossas cordas vocais vibram para fazer som.',
            'Bater mais forte deixa o som mais alto (mais intenso).',
            'Sons muito altos podem prejudicar a audição: use fone com volume baixo.',
          ],
          q: [
            ['O som é produzido quando os objetos…', ['vibram', 'ficam parados', 'esfriam', 'mudam de cor']],
            ['Bater mais forte no tambor deixa o som…', ['mais alto', 'mais baixo', 'sem som', 'colorido']],
            ['Ouvir música muito alta no fone pode…', ['prejudicar a audição', 'melhorar a audição', 'não fazer diferença', 'limpar o ouvido']],
            ['Um elástico esticado faz som quando tocado porque…', ['vibra', 'esquenta', 'brilha', 'cresce']],
            ['Qual atitude protege os ouvidos?', ['usar volume baixo no fone', 'colocar objetos no ouvido', 'gritar perto dos colegas', 'ficar colado na caixa de som']],
          ],
        },
        {
          id: 'y3-ci-2', title: 'A luz', skills: ['EF03CI02', 'EF03CI03'],
          intro: 'A luz passa por alguns materiais, é refletida por outros e bloqueada por outros.',
          points: [
            'Transparente: deixa a luz passar (vidro, água).',
            'Opaco: bloqueia a luz e forma sombra (parede, madeira).',
            'Espelho: reflete a luz.',
            'Cuide da visão: leia com boa luz e nunca olhe direto para o Sol.',
          ],
          q: [
            ['Objetos transparentes, como o vidro da janela…', ['deixam a luz passar', 'bloqueiam toda a luz', 'produzem luz', 'fazem barulho']],
            ['O espelho…', ['reflete a luz', 'absorve todo o som', 'é opaco e escuro', 'produz calor']],
            ['A sombra aparece quando um objeto opaco…', ['bloqueia a luz', 'deixa a luz passar', 'faz barulho', 'fica molhado']],
            ['Uma parede é um objeto…', ['opaco', 'transparente', 'luminoso', 'líquido']],
            ['Para cuidar da visão devemos…', ['ler em lugar bem iluminado', 'olhar direto para o Sol', 'ler no escuro', 'ficar colado na TV']],
            ['O arco-íris aparece quando a luz do Sol passa pelas…', ['gotas de água', 'folhas', 'pedras', 'paredes']],
          ],
        },
      ],
    },
    {
      unit: 'Animais',
      nodes: [
        {
          id: 'y3-ci-3', title: 'Como vivem os animais', skills: ['EF03CI04', 'EF03CI05'],
          intro: 'Os animais se alimentam, se locomovem e se reproduzem de formas diferentes, e mudam ao longo da vida.',
          points: [
            'Herbívoros comem plantas; carnívoros comem outros animais; onívoros comem os dois.',
            'Alguns nascem de ovos (galinha, sapo); outros se desenvolvem na barriga da mãe e mamam (cachorro, ser humano).',
            'Borboleta: ovo → lagarta → casulo (pupa) → borboleta. Sapo: ovo → girino → sapo.',
          ],
          q: [
            ['Animais que comem só plantas são chamados de…', ['herbívoros', 'carnívoros', 'onívoros', 'insetívoros']],
            ['Animais que comem outros animais são…', ['carnívoros', 'herbívoros', 'vegetais', 'frutívoros']],
            ['O ser humano come plantas e animais; por isso é…', ['onívoro', 'herbívoro', 'carnívoro', 'planta']],
            ['A lagarta vira casulo e depois…', ['borboleta', 'girino', 'pintinho', 'peixe']],
            ['O filhote de sapo que vive na água se chama…', ['girino', 'lagarta', 'pintinho', 'alevino']],
            ['A galinha se reproduz por meio de…', ['ovos', 'sementes', 'raízes', 'folhas']],
            ['O filhote de cachorro se alimenta primeiro de…', ['leite da mãe', 'sementes', 'insetos', 'folhas']],
          ],
        },
        {
          id: 'y3-ci-4', title: 'Grupos de animais', skills: ['EF03CI06'],
          intro: 'Podemos agrupar os animais pelo que têm no corpo: penas, pelos, escamas, antenas, patas.',
          points: [
            'Aves: penas e bico (papagaio, galinha).',
            'Mamíferos: pelos e mamam quando filhotes (gato, morcego, baleia).',
            'Peixes: escamas e nadadeiras. Répteis como a cobra também têm escamas.',
            'Insetos: 6 patas e antenas (formiga, abelha).',
          ],
          q: [
            ['Animais com penas e bico são…', ['aves', 'peixes', 'mamíferos', 'insetos']],
            ['Animais com escamas e nadadeiras que vivem na água são…', ['peixes', 'aves', 'mamíferos', 'insetos']],
            ['O corpo do gato é coberto por…', ['pelos', 'penas', 'escamas', 'casco']],
            ['Os insetos têm…', ['6 patas e antenas', '4 patas e pelos', 'penas', 'nadadeiras']],
            ['Qual destes animais é uma ave?', ['papagaio', 'morcego', 'golfinho', 'sapo']],
            ['O corpo da cobra é coberto por…', ['escamas', 'penas', 'pelos', 'antenas']],
          ],
        },
      ],
    },
    {
      unit: 'Terra e solo',
      nodes: [
        {
          id: 'y3-ci-5', title: 'Nosso planeta e o céu', skills: ['EF03CI07', 'EF03CI08'],
          intro: 'A Terra é redonda (esférica) e tem muita água. No céu vemos o Sol de dia e a Lua e as estrelas à noite.',
          points: [
            'A maior parte da superfície da Terra é coberta por água.',
            'O globo terrestre representa a Terra em forma de bola; o mapa a representa no papel.',
            'O Sol é uma estrela. A Lua pode aparecer à noite e, às vezes, de dia.',
          ],
          q: [
            ['A Terra tem formato…', ['esférico, parecido com uma bola', 'plano como uma mesa', 'quadrado', 'de triângulo']],
            ['A maior parte da superfície da Terra é coberta por…', ['água', 'areia', 'gelo', 'florestas']],
            ['O globo terrestre é…', ['uma representação da Terra em forma de bola', 'uma estrela', 'um mapa da escola', 'um planeta de verdade']],
            ['O Sol aparece no céu durante…', ['o dia', 'a noite', 'só no inverno', 'nunca']],
            ['A Lua pode ser vista…', ['à noite e às vezes de dia', 'só ao meio-dia', 'nunca', 'só quando chove']],
            ['O Sol é uma…', ['estrela', 'lua', 'nuvem', 'galáxia pequena']],
          ],
        },
        {
          id: 'y3-ci-6', title: 'O solo', skills: ['EF03CI09', 'EF03CI10'],
          intro: 'O solo é a camada de terra onde crescem as plantas. Existem tipos diferentes de solo.',
          points: [
            'Arenoso: grãos maiores, a água passa rápido.',
            'Argiloso: segura mais água e fica grudento quando molhado.',
            'Com húmus (restos de plantas e animais): ótimo para plantar.',
            'Minhocas cavam túneis e ajudam a água e o ar a entrarem no solo.',
          ],
          q: [
            ['O solo arenoso…', ['deixa a água passar rápido', 'segura toda a água', 'é feito de vidro', 'é sempre preto']],
            ['O solo argiloso…', ['segura mais água e fica grudento', 'deixa a água passar muito rápido', 'é feito de areia de praia', 'não existe']],
            ['O solo com húmus é bom para…', ['plantar', 'fazer vidro', 'fazer praia', 'nada']],
            ['Um uso importante do solo é…', ['plantar alimentos', 'fazer nuvens', 'produzir luz', 'guardar o mar']],
            ['Queimadas e lixo jogado no chão…', ['estragam o solo', 'deixam o solo mais saudável', 'não mudam nada', 'fazem chover']],
            ['As minhocas ajudam o solo porque…', ['cavam túneis e deixam ar e água entrarem', 'comem as raízes', 'secam a terra', 'deixam o solo duro']],
          ],
        },
      ],
    },
  ],

  // ---------------- HISTÓRIA (com Joinville) ----------------
  hi: [
    {
      unit: 'Joinville: como tudo começou',
      nodes: [
        {
          id: 'y3-hi-1', title: 'Antes da colônia', skills: ['EF03HI01', 'EF03HI02'],
          intro: 'Muito antes da cidade existir, a região de Joinville já era habitada.',
          points: [
            'Há milhares de anos, povos antigos viviam perto da Baía da Babitonga e deixaram os sambaquis.',
            'Sambaquis são montes feitos de conchas, ossos e objetos desses povos.',
            'Depois, povos indígenas viveram na região.',
            'O Museu Arqueológico de Sambaqui de Joinville guarda objetos desses povos.',
          ],
          q: [
            ['Antes da chegada dos imigrantes, a região de Joinville…', ['já era habitada por povos indígenas e povos dos sambaquis', 'nunca teve moradores', 'era só de imigrantes alemães', 'era coberta de neve']],
            ['Sambaquis são…', ['montes de conchas, ossos e objetos deixados por povos antigos', 'prédios modernos', 'rios da cidade', 'festas alemãs']],
            ['Qual museu de Joinville guarda objetos dos povos dos sambaquis?', ['Museu Arqueológico de Sambaqui', 'Museu do Futebol', 'Museu do Louvre', 'Museu do Ipiranga']],
            ['Fontes históricas (fotos, objetos, documentos) servem para…', ['conhecer o passado', 'prever o tempo', 'fazer contas', 'nada']],
          ],
        },
        {
          id: 'y3-hi-2', title: 'A fundação de Joinville', skills: ['EF03HI01', 'EF03HI05'],
          intro: 'Joinville começou como a Colônia Dona Francisca, formada por imigrantes europeus.',
          points: [
            'Fundação: 9 de março de 1851.',
            'Os primeiros imigrantes vieram da Alemanha, da Suíça e da Noruega, no barco Colon.',
            'As terras eram da princesa Dona Francisca, filha de Dom Pedro I, casada com o Príncipe de Joinville. Daí vem o nome da cidade.',
            'Depois chegaram muitos outros grupos, de várias partes do Brasil e do mundo.',
          ],
          q: [
            ['Joinville foi fundada em…', ['9 de março de 1851', '7 de setembro de 1822', '22 de abril de 1500', '1º de janeiro de 2000']],
            ['A colônia que deu origem a Joinville se chamava…', ['Colônia Dona Francisca', 'Colônia Blumenau', 'Vila Rica', 'Nova Lisboa']],
            ['Os primeiros imigrantes vieram principalmente da…', ['Alemanha, Suíça e Noruega', 'Japão e China', 'Itália e Espanha', 'Argentina e Chile']],
            ['O nome Joinville homenageia…', ['o Príncipe de Joinville, marido da princesa Francisca', 'um rio', 'um pescador', 'uma flor']],
            ['O barco dos primeiros imigrantes se chamava…', ['Colon', 'Titanic', 'Santa Maria', 'Pinta']],
            ['Joinville faz aniversário em março.', VF],
          ],
        },
      ],
    },
    {
      unit: 'Patrimônio e memória',
      nodes: [
        {
          id: 'y3-hi-3', title: 'Patrimônios de Joinville', skills: ['EF03HI04', 'EF03HI05', 'EF03HI06'],
          intro: 'Patrimônio é aquilo que é importante para a história e a cultura e por isso deve ser preservado.',
          points: [
            'Rua das Palmeiras: palmeiras-imperiais plantadas há mais de cem anos.',
            'Casas em estilo enxaimel: estrutura de madeira aparente, trazida pelos imigrantes.',
            'Museu Nacional de Imigração e Colonização e Cemitério do Imigrante guardam a memória dos primeiros moradores.',
            'Nomes de ruas e monumentos lembram pessoas e fatos importantes.',
          ],
          q: [
            ['Patrimônio histórico é…', ['algo importante da história que deve ser preservado', 'um prédio novo', 'qualquer carro antigo', 'um brinquedo']],
            ['A Rua das Palmeiras é famosa por…', ['palmeiras-imperiais plantadas há mais de cem anos', 'ter praia', 'ser um shopping', 'ser um aeroporto']],
            ['Casas com estrutura de madeira aparente, trazidas pela cultura alemã, são chamadas de…', ['enxaimel', 'iglu', 'oca', 'arranha-céu']],
            ['O Museu Nacional de Imigração e Colonização conta a história…', ['dos imigrantes que formaram a cidade', 'dos dinossauros', 'do espaço', 'do futebol']],
            ['Nomes de ruas e monumentos servem para…', ['lembrar pessoas e fatos importantes', 'enfeitar placas sem motivo', 'confundir as pessoas', 'marcar velocidade']],
            ['O Cemitério do Imigrante é patrimônio porque…', ['guarda a memória dos primeiros moradores da colônia', 'é novo', 'é um parque de diversões', 'é uma escola']],
          ],
        },
      ],
    },
    {
      unit: 'Cidade e campo, ontem e hoje',
      nodes: [
        {
          id: 'y3-hi-4', title: 'Espaços públicos e privados', skills: ['EF03HI09', 'EF03HI10'],
          intro: 'Na cidade existem espaços de todos (públicos), espaços da família (domésticos) e áreas para proteger a natureza.',
          points: [
            'Públicos: ruas, praças, escolas públicas, hospitais, Prefeitura, Câmara de Vereadores.',
            'Prefeitura: administra a cidade. Câmara de Vereadores: cria e vota as leis da cidade.',
            'Áreas de conservação ambiental protegem a natureza, como manguezais e matas.',
          ],
          q: [
            ['Qual é um espaço público?', ['praça', 'seu quarto', 'a cozinha da sua casa', 'o quintal do vizinho']],
            ['A Prefeitura cuida…', ['da administração da cidade', 'só das escolas particulares', 'da casa das pessoas', 'do clima']],
            ['Na Câmara de Vereadores, os vereadores…', ['criam e votam leis da cidade', 'dão aulas', 'cuidam dos animais', 'vendem comida']],
            ['Área de conservação ambiental é um lugar para…', ['proteger a natureza', 'construir fábricas', 'jogar lixo', 'fazer estacionamento']],
            ['No espaço doméstico (sua casa), quem combina as regras é…', ['a família', 'o prefeito', 'o vereador', 'o diretor da escola']],
          ],
        },
        {
          id: 'y3-hi-5', title: 'Trabalho e lazer: antes e agora', skills: ['EF03HI07', 'EF03HI08', 'EF03HI11', 'EF03HI12'],
          intro: 'O jeito de viver, trabalhar e brincar muda com o tempo, mas algumas coisas permanecem.',
          points: [
            'No começo da colônia, muitas famílias viviam no campo: plantavam e criavam animais.',
            'Hoje Joinville é conhecida pelas indústrias e é a maior cidade de Santa Catarina.',
            'No campo, máquinas como o trator ajudam no trabalho.',
            'Brincadeiras como pular corda passaram de geração em geração.',
          ],
          q: [
            ['No começo da colônia, muitas famílias de Joinville viviam…', ['no campo, plantando e criando animais', 'em prédios altos', 'em estações espaciais', 'em navios']],
            ['Hoje Joinville é muito conhecida por suas…', ['indústrias', 'minas de ouro', 'pirâmides', 'geleiras']],
            ['Uma máquina que ajuda no trabalho do campo é o…', ['trator', 'elevador', 'computador de escritório', 'patinete']],
            ['Uma brincadeira antiga que ainda existe hoje é…', ['pular corda', 'videogame', 'celular', 'tablet']],
            ['Antes da luz elétrica, as casas eram iluminadas com…', ['lampiões e velas', 'lâmpadas de LED', 'celulares', 'televisão']],
          ],
        },
      ],
    },
  ],

  // ---------------- GEOGRAFIA (com Joinville) ----------------
  ge: [
    {
      unit: 'Joinville: o lugar onde vivo',
      nodes: [
        {
          id: 'y3-ge-1', title: 'Paisagens de Joinville', skills: ['EF03GE04'],
          intro: 'Joinville fica no norte de Santa Catarina, entre a serra e o mar.',
          points: [
            'A Baía da Babitonga fica perto da cidade e tem muitos manguezais.',
            'O Rio Cachoeira atravessa o centro da cidade.',
            'A Serra do Mar fica a oeste. Chove bastante em Joinville.',
            'Joinville é a cidade com mais moradores de Santa Catarina.',
          ],
          q: [
            ['Joinville fica no estado de…', ['Santa Catarina', 'Paraná', 'São Paulo', 'Rio Grande do Sul']],
            ['Joinville fica na região…', ['norte de Santa Catarina', 'oeste de Santa Catarina', 'sul de Santa Catarina', 'serra gaúcha']],
            ['A baía que fica perto de Joinville se chama…', ['Baía da Babitonga', 'Baía de Guanabara', 'Baía de Todos os Santos', 'Baía de Paranaguá']],
            ['O rio que atravessa o centro de Joinville é o…', ['Rio Cachoeira', 'Rio Amazonas', 'Rio Tietê', 'Rio São Francisco']],
            ['A serra perto de Joinville se chama…', ['Serra do Mar', 'Serra Gaúcha', 'Serra da Mantiqueira', 'Serra do Japi']],
            ['O manguezal é importante porque…', ['é berçário de peixes, caranguejos e aves', 'é um deserto', 'não tem vida', 'é feito de concreto']],
            ['Joinville é a cidade com mais habitantes de Santa Catarina.', VF],
          ],
        },
        {
          id: 'y3-ge-2', title: 'Culturas que formam Joinville', skills: ['EF03GE01', 'EF03GE02', 'EF03GE03'],
          intro: 'Joinville foi formada por muitos grupos: povos indígenas, imigrantes europeus e pessoas de todo o Brasil.',
          points: [
            'Festa das Flores: exposição de flores, especialmente orquídeas.',
            'Festival de Dança e Escola do Teatro Bolshoi: Joinville é a "Cidade da Dança".',
            'Também é chamada de "Cidade das Flores" e "Cidade das Bicicletas".',
            'Povos e comunidades tradicionais: indígenas, quilombolas, pescadores artesanais.',
          ],
          q: [
            ['A Festa das Flores de Joinville é famosa pelas…', ['orquídeas', 'praias', 'corridas de carro', 'neve']],
            ['Joinville é chamada de "Cidade da Dança" por causa…', ['do Festival de Dança e da Escola do Teatro Bolshoi', 'das praias', 'do futebol', 'do carnaval']],
            ['A Escola do Teatro Bolshoi é ligada a um famoso teatro da…', ['Rússia', 'França', 'Japão', 'Argentina']],
            ['Joinville também é conhecida como "Cidade das…"', ['Flores', 'Pedras', 'Areias', 'Neves']],
            ['São povos e comunidades tradicionais:', ['indígenas, quilombolas e pescadores artesanais', 'só moradores de prédios', 'só turistas', 'robôs']],
            ['Um prato típico da cultura alemã nas festas de Joinville é…', ['cuca', 'sushi', 'acarajé', 'taco mexicano']],
          ],
        },
      ],
    },
    {
      unit: 'Mapas e representações',
      nodes: [
        {
          id: 'y3-ge-3', title: 'Mapas, legendas e direções', skills: ['EF03GE06', 'EF03GE07'],
          intro: 'Mapas, plantas, maquetes e fotos aéreas representam lugares.',
          points: [
            'Legenda: explica o que cada cor e símbolo significam.',
            'No mapa, azul geralmente representa água.',
            'Maquete: representação em miniatura (3D).',
            'Rosa dos ventos: norte, sul, leste e oeste. O Sol nasce no leste.',
          ],
          q: [
            ['A legenda de um mapa serve para…', ['explicar o que cada símbolo e cor significam', 'dar o nome do autor', 'mostrar a hora', 'enfeitar']],
            ['No mapa, a cor azul geralmente representa…', ['água: rios, lagos e mar', 'florestas', 'estradas', 'cidades']],
            ['Uma foto tirada de um avião mostra o lugar visto…', ['de cima', 'de lado', 'de baixo', 'de dentro']],
            ['Maquete é…', ['uma representação em miniatura de um lugar', 'um tipo de rio', 'uma música', 'uma planta']],
            ['A rosa dos ventos mostra…', ['as direções norte, sul, leste e oeste', 'a temperatura', 'as horas', 'a altura']],
            ['O Sol nasce do lado…', ['leste', 'oeste', 'norte', 'sul']],
          ],
        },
      ],
    },
    {
      unit: 'Natureza, água e consumo',
      nodes: [
        {
          id: 'y3-ge-4', title: 'Recursos da natureza', skills: ['EF03GE05', 'EF03GE10', 'EF03GE11'],
          intro: 'Tiramos da natureza alimentos, minerais e energia. Precisamos usar com cuidado.',
          points: [
            'Cultivados: arroz, feijão, banana (agricultura).',
            'Extraídos: ferro, areia, pedra (mineração); peixes (pesca).',
            'A água das usinas hidrelétricas gera energia elétrica.',
            'Fábricas e máquinas podem poluir o ar e a água.',
          ],
          q: [
            ['O arroz e o feijão vêm…', ['da agricultura', 'da mineração', 'da pesca', 'da fábrica de metal']],
            ['Ferro e areia são exemplos de produtos…', ['extraídos da natureza', 'cultivados', 'pescados', 'feitos por animais']],
            ['A água também é usada para gerar…', ['energia elétrica nas hidrelétricas', 'areia', 'petróleo', 'vento']],
            ['Uma fábrica que solta muita fumaça polui…', ['o ar', 'só o mar', 'nada', 'o fogo']],
            ['A pesca é uma atividade importante na Baía da Babitonga.', VF],
          ],
        },
        {
          id: 'y3-ge-5', title: 'Água e lixo', skills: ['EF03GE08', 'EF03GE09'],
          intro: 'Usamos água todos os dias. Também produzimos lixo. Dá para cuidar dos dois.',
          points: [
            'Reduzir, reutilizar e reciclar: gerar menos lixo.',
            'Feche a torneira ao escovar os dentes e tome banhos curtos.',
            'Lixo na rua entope bueiros e piora as enchentes, que acontecem em Joinville quando chove muito.',
          ],
          q: [
            ['Reduzir, reutilizar e reciclar significa…', ['gerar menos lixo, usar de novo e transformar materiais', 'jogar tudo fora', 'comprar mais', 'queimar o lixo']],
            ['Qual atitude economiza água?', ['fechar a torneira ao escovar os dentes', 'lavar a calçada com mangueira todo dia', 'tomar banho muito longo', 'deixar a torneira pingando']],
            ['O lixo jogado na rua e nos rios pode…', ['entupir bueiros e piorar as enchentes', 'limpar o rio', 'alimentar bem os peixes', 'não causar nada']],
            ['Garrafa PET, papel e latinha podem ser…', ['reciclados', 'plantados', 'comidos', 'queimados sem problema']],
            ['Jogar óleo de cozinha na pia é bom para o meio ambiente.', FV],
          ],
        },
      ],
    },
  ],

  // ---------------- ARTE ----------------
  ar: [
    {
      unit: 'Linguagens da arte',
      nodes: [
        {
          id: 'y3-ar-1', title: 'Artes visuais e cores', skills: ['EF15AR01', 'EF15AR02', 'EF15AR04'],
          intro: 'Artes visuais são as que vemos: desenho, pintura, colagem, escultura, fotografia.',
          points: [
            'Cores primárias: vermelho, amarelo e azul.',
            'Misturas: azul + amarelo = verde; vermelho + amarelo = laranja; vermelho + azul = roxo.',
            'Elementos: ponto, linha, forma, cor e espaço.',
            'Escultura tem três dimensões: dá para ver por vários lados.',
          ],
          q: [
            ['As cores primárias são…', ['vermelho, amarelo e azul', 'verde, roxo e laranja', 'preto e branco', 'rosa e marrom']],
            ['Azul + amarelo =', ['verde', 'roxo', 'laranja', 'marrom']],
            ['Vermelho + amarelo =', ['laranja', 'verde', 'roxo', 'azul']],
            ['Vermelho + azul =', ['roxo', 'verde', 'laranja', 'amarelo']],
            ['Colagem é uma arte feita…', ['colando papéis, tecidos e outros materiais', 'só com lápis', 'com sons', 'com passos de dança']],
            ['Escultura é uma obra…', ['em três dimensões, vista por vários lados', 'só desenhada no papel', 'feita de sons', 'escrita']],
          ],
        },
        {
          id: 'y3-ar-2', title: 'Música', skills: ['EF15AR13', 'EF15AR14', 'EF15AR15'],
          intro: 'Música é a organização de sons e silêncios. Podemos fazer música até com o corpo.',
          points: [
            'Agudo: som fino (apito). Grave: som grosso (tambor grande).',
            'Ritmo: a organização dos sons e pausas no tempo.',
            'Percussão corporal: palmas, estalos, batidas no peito.',
            'Instrumentos de corda (violão), sopro (flauta) e percussão (tambor).',
          ],
          q: [
            ['Som agudo é…', ['fino, como um apito', 'grosso, como um trovão', 'silêncio', 'sempre alto']],
            ['Som grave é…', ['grosso, como um tambor grande', 'fino, como um passarinho', 'silêncio', 'sempre baixo']],
            ['Bater palmas e estalar os dedos é fazer música com…', ['o próprio corpo', 'instrumento de corda', 'computador', 'instrumento de sopro']],
            ['Ritmo é…', ['a organização dos sons e silêncios no tempo', 'a cor da música', 'o nome do cantor', 'o volume']],
            ['O violão é um instrumento de…', ['cordas', 'sopro', 'percussão', 'teclas']],
            ['A flauta é um instrumento de…', ['sopro', 'cordas', 'percussão', 'teclas']],
          ],
        },
        {
          id: 'y3-ar-3', title: 'Dança e teatro', skills: ['EF15AR08', 'EF15AR09', 'EF15AR18', 'EF15AR21'],
          intro: 'Na dança, o corpo e o movimento contam histórias. No teatro, atores interpretam personagens.',
          points: [
            'Joinville recebe todo ano, em julho, o Festival de Dança, um dos maiores do mundo.',
            'Balé, dança de rua e danças populares são tipos de dança.',
            'No teatro: atores, personagens, cenário, figurino e público.',
          ],
          q: [
            ['Na dança usamos principalmente…', ['o corpo e o movimento', 'pincéis', 'lápis', 'tesoura']],
            ['O Festival de Dança de Joinville acontece todo ano em…', ['julho', 'dezembro', 'março', 'maio']],
            ['No teatro, quem interpreta os personagens é o…', ['ator ou a atriz', 'pintor', 'escultor', 'maestro']],
            ['Cenário, no teatro, é…', ['o ambiente montado no palco', 'a música', 'o público', 'o ingresso']],
            ['Balé é um tipo de…', ['dança', 'pintura', 'escultura', 'instrumento']],
          ],
        },
        {
          id: 'y3-ar-4', title: 'Cultura popular e patrimônio', skills: ['EF15AR24', 'EF15AR25'],
          intro: 'Festas, brincadeiras, músicas e saberes de um povo fazem parte da cultura e também são patrimônio.',
          points: [
            'Patrimônio imaterial: festas, danças, músicas, comidas e saberes.',
            'A cultura brasileira tem influências indígenas, africanas e europeias, entre outras.',
            'Boi de Mamão: brincadeira tradicional de Santa Catarina.',
          ],
          q: [
            ['Patrimônio imaterial são…', ['festas, danças, músicas e saberes de um povo', 'só prédios', 'só estátuas', 'carros antigos']],
            ['Cantigas de roda fazem parte da…', ['cultura popular', 'tecnologia espacial', 'química', 'astronomia']],
            ['A cultura brasileira tem influências…', ['indígenas, africanas e europeias, entre outras', 'só europeias', 'só americanas', 'nenhuma']],
            ['O Boi de Mamão é uma brincadeira tradicional de…', ['Santa Catarina', 'Japão', 'Alasca', 'Egito']],
            ['Artesão é quem…', ['faz objetos à mão, como cestos e cerâmica', 'dirige ônibus', 'vende ingressos', 'conserta carros']],
          ],
        },
      ],
    },
  ],

  // ---------------- EDUCAÇÃO FÍSICA ----------------
  ef: [
    {
      unit: 'Práticas corporais',
      nodes: [
        {
          id: 'y3-ef-1', title: 'Brincadeiras e jogos populares', skills: ['EF35EF01', 'EF35EF02', 'EF35EF03', 'EF35EF04'],
          intro: 'Brincadeiras e jogos populares passam de geração em geração e vêm de várias culturas.',
          points: [
            'Amarelinha, pega-pega, esconde-esconde: brincadeiras populares.',
            'Peteca: origem indígena. Mancala (jogo com sementes): origem africana.',
            'Combinar regras e respeitar os colegas deixa a brincadeira segura para todos.',
          ],
          q: [
            ['Amarelinha, pega-pega e esconde-esconde são…', ['brincadeiras populares', 'esportes olímpicos', 'lutas', 'danças']],
            ['A peteca é uma brincadeira de origem…', ['indígena', 'japonesa', 'americana', 'russa']],
            ['Mancala, jogo de tabuleiro com sementes, tem origem…', ['africana', 'indígena', 'chinesa', 'alemã']],
            ['Para brincar com segurança devemos…', ['combinar regras e respeitar os colegas', 'empurrar os outros', 'brincar na rua sem cuidado', 'não ouvir ninguém']],
          ],
        },
        {
          id: 'y3-ef-2', title: 'Esportes', skills: ['EF35EF05', 'EF35EF06'],
          intro: 'Esportes têm regras oficiais e competições. Existem esportes de rede, de invasão e de campo e taco.',
          points: [
            'Rede: cada time de um lado (vôlei).',
            'Invasão: entrar no campo do adversário para marcar (futebol, basquete, handebol).',
            'Campo e taco: rebater a bola (taco, beisebol).',
            'Fair play: jogar limpo e respeitar o adversário.',
          ],
          q: [
            ['Vôlei é um esporte de…', ['rede', 'invasão', 'taco', 'luta']],
            ['Futebol e basquete são esportes de…', ['invasão', 'rede', 'campo e taco', 'precisão']],
            ['O taco (bets) é um esporte de…', ['campo e taco', 'rede', 'invasão', 'luta']],
            ['Antes de fazer exercícios é bom…', ['aquecer o corpo e beber água', 'comer muito', 'dormir', 'ficar parado']],
            ['Fair play quer dizer…', ['jogar limpo e respeitar o adversário', 'ganhar de qualquer jeito', 'não seguir regras', 'brigar']],
            ['Esporte é diferente de brincadeira porque tem regras oficiais e competições.', VF],
          ],
        },
        {
          id: 'y3-ef-3', title: 'Ginástica, danças e lutas', skills: ['EF35EF07', 'EF35EF09', 'EF35EF13', 'EF35EF15'],
          intro: 'Ginástica, danças e lutas também são práticas corporais, cada uma com seus movimentos e regras.',
          points: [
            'Ginástica: rolamentos, estrela, equilíbrios e saltos.',
            'Danças populares do Brasil: frevo, samba, forró.',
            'Lutas: capoeira (matriz africana, afro-brasileira), judô (Japão). Luta tem regras e respeito; briga não.',
          ],
          q: [
            ['Rolamento, estrela e equilíbrio são elementos da…', ['ginástica', 'natação', 'luta', 'corrida']],
            ['A capoeira é uma luta de matriz…', ['africana (afro-brasileira)', 'japonesa', 'indígena', 'europeia']],
            ['Luta é diferente de briga porque…', ['tem regras e respeito ao colega', 'machuca de propósito', 'não tem regras', 'não tem professor']],
            ['Frevo e samba são danças…', ['populares do Brasil', 'do Japão', 'da Rússia', 'da China']],
            ['O judô é uma luta de origem…', ['japonesa', 'africana', 'brasileira', 'indígena']],
          ],
        },
      ],
    },
  ],

  // ---------------- INGLÊS (rede municipal de Joinville, anos iniciais) ----------------
  li: [
    {
      unit: 'First words',
      nodes: [
        {
          id: 'y3-li-1', title: 'Greetings · Cumprimentos', skills: [],
          intro: 'Em inglês também cumprimentamos e agradecemos.',
          points: ['Hello = Olá · Goodbye = Tchau', 'Good morning = Bom dia · Good night = Boa noite', 'Thank you = Obrigado(a) · Please = Por favor', 'What is your name? = Qual é o seu nome?'],
          q: [
            ['"Good morning" quer dizer…', ['Bom dia', 'Boa noite', 'Tchau', 'Obrigado']],
            ['"Hello" significa…', ['Olá', 'Tchau', 'Por favor', 'Desculpe']],
            ['"Goodbye" significa…', ['Tchau', 'Bom dia', 'Obrigado', 'Olá']],
            ['"Thank you" significa…', ['Obrigado(a)', 'Por favor', 'De nada', 'Olá']],
            ['"What is your name?" quer dizer…', ['Qual é o seu nome?', 'Quantos anos você tem?', 'Onde você mora?', 'Como você está?']],
            ['Qual é a resposta para "How old are you?"', ['I am 9 years old.', 'My name is Ana.', 'I am fine.', 'Goodbye.']],
          ],
        },
        {
          id: 'y3-li-2', title: 'Colors and numbers', skills: [],
          intro: 'Cores e números em inglês.',
          points: ['red = vermelho · blue = azul · yellow = amarelo · green = verde', 'one 1 · two 2 · three 3 · four 4 · five 5', 'six 6 · seven 7 · eight 8 · nine 9 · ten 10'],
          q: [
            ['"Blue" é…', ['azul', 'vermelho', 'verde', 'amarelo']],
            ['"Red" é…', ['vermelho', 'azul', 'preto', 'branco']],
            ['"Yellow" é…', ['amarelo', 'verde', 'roxo', 'rosa']],
            ['"Green" é…', ['verde', 'cinza', 'marrom', 'laranja']],
            ['"Three" é o número…', ['3', '13', '30', '8']],
            ['"Ten" é o número…', ['10', '2', '12', '100']],
            ['Como se diz 7 em inglês?', ['seven', 'six', 'eleven', 'nine']],
          ],
        },
        {
          id: 'y3-li-3', title: 'Animals', skills: [],
          intro: 'Nomes de animais em inglês.',
          points: ['dog = cachorro · cat = gato', 'bird = pássaro · fish = peixe', 'horse = cavalo · cow = vaca · duck = pato'],
          q: [
            ['"Dog" é…', ['cachorro', 'gato', 'pássaro', 'peixe']],
            ['"Cat" é…', ['gato', 'cachorro', 'vaca', 'rato']],
            ['"Bird" é…', ['pássaro', 'urso', 'sapo', 'cavalo']],
            ['"Fish" é…', ['peixe', 'galinha', 'porco', 'leão']],
            ['Como se diz "cavalo" em inglês?', ['horse', 'house', 'cow', 'duck']],
          ],
        },
        {
          id: 'y3-li-4', title: 'Family and school', skills: [],
          intro: 'Família e objetos da escola em inglês.',
          points: ['mother = mãe · father = pai', 'brother = irmão · sister = irmã', 'book = livro · pencil = lápis · school = escola'],
          q: [
            ['"Mother" é…', ['mãe', 'pai', 'irmã', 'avó']],
            ['"Father" é…', ['pai', 'mãe', 'tio', 'irmão']],
            ['"Brother" é…', ['irmão', 'irmã', 'primo', 'avô']],
            ['"Book" é…', ['livro', 'caneta', 'mesa', 'mochila']],
            ['"Pencil" é…', ['lápis', 'borracha', 'régua', 'caderno']],
            ['Como se diz "escola" em inglês?', ['school', 'house', 'book', 'table']],
          ],
        },
      ],
    },
  ],

  // ---------------- ENSINO RELIGIOSO ----------------
  er: [
    {
      unit: 'Diversidade religiosa',
      nodes: [
        {
          id: 'y3-er-1', title: 'Espaços religiosos', skills: ['EF03ER01', 'EF03ER02'],
          intro: 'Cada tradição religiosa tem seus espaços de encontro e celebração. Todos merecem respeito.',
          points: [
            'Igreja (cristianismo), sinagoga (judaísmo), mesquita (islamismo).',
            'Templo (budismo, hinduísmo e outras), terreiro (religiões de matriz africana, como candomblé e umbanda).',
            'A natureza também pode ser espaço sagrado, como para muitos povos indígenas.',
          ],
          q: [
            ['Igrejas, templos, sinagogas, mesquitas e terreiros são…', ['espaços religiosos de diferentes tradições', 'escolas', 'lojas', 'hospitais']],
            ['A sinagoga é o espaço religioso do…', ['judaísmo', 'islamismo', 'budismo', 'hinduísmo']],
            ['A mesquita é o espaço religioso do…', ['islamismo', 'judaísmo', 'cristianismo', 'candomblé']],
            ['O terreiro é espaço de religiões…', ['de matriz africana, como candomblé e umbanda', 'do Japão', 'da Grécia antiga', 'só europeias']],
            ['Diante de religiões diferentes da nossa, devemos ter…', ['respeito', 'deboche', 'medo', 'raiva']],
          ],
        },
        {
          id: 'y3-er-2', title: 'Celebrações e festas', skills: ['EF03ER03', 'EF03ER04'],
          intro: 'As tradições religiosas têm festas, orações, cerimônias e peregrinações.',
          points: [
            'Natal e Páscoa: cristianismo.',
            'Ramadã (mês de jejum e oração): islamismo.',
            'Hanucá (festa das luzes): judaísmo. Diwali (festa das luzes): hinduísmo.',
            'Peregrinação: viagem a um lugar considerado sagrado.',
          ],
          q: [
            ['Natal e Páscoa são festas importantes do…', ['cristianismo', 'budismo', 'islamismo', 'judaísmo']],
            ['O Ramadã é um mês de jejum e oração do…', ['islamismo', 'cristianismo', 'hinduísmo', 'budismo']],
            ['Hanucá, a festa das luzes, é celebrada no…', ['judaísmo', 'islamismo', 'budismo', 'cristianismo']],
            ['Diwali, a festa das luzes, é celebrada no…', ['hinduísmo', 'judaísmo', 'islamismo', 'cristianismo']],
            ['Peregrinação é…', ['uma viagem a um lugar sagrado', 'uma festa de aniversário', 'um tipo de roupa', 'uma comida']],
          ],
        },
        {
          id: 'y3-er-3', title: 'Roupas e símbolos', skills: ['EF03ER05', 'EF03ER06'],
          intro: 'Roupas, acessórios e símbolos (indumentárias) ajudam a mostrar a identidade de cada tradição.',
          points: [
            'Hijab: véu usado por muitas mulheres muçulmanas.',
            'Quipá: pequeno chapéu usado no judaísmo.',
            'Monges budistas costumam usar túnicas laranja ou vinho.',
            'Nas religiões de matriz africana, roupas brancas são muito usadas em rituais.',
          ],
          q: [
            ['Indumentária é…', ['a roupa e os acessórios usados em uma tradição', 'um prédio', 'uma música', 'um livro']],
            ['Muitas mulheres muçulmanas usam um véu chamado…', ['hijab', 'quipá', 'batina', 'boné']],
            ['O quipá é um pequeno chapéu usado no…', ['judaísmo', 'budismo', 'islamismo', 'candomblé']],
            ['Monges budistas costumam usar…', ['túnicas laranja ou vinho', 'terno e gravata', 'uniforme de futebol', 'roupa de mergulho']],
            ['Roupas e símbolos religiosos ajudam a mostrar…', ['a identidade de cada tradição', 'o time preferido', 'a idade da pessoa', 'a profissão']],
          ],
        },
      ],
    },
  ],
};
