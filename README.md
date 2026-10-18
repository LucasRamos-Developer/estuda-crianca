# Tabuada

PWA simples para crianças (3º ano) aprenderem as tabuadas de **somar, tirar, multiplicar e dividir do 1 ao 9**,
com visual inspirado no Duolingo. Funciona no celular, tablet e computador, e **offline** depois do primeiro acesso
(quando publicado em HTTPS, como no GitHub Pages).

## Como funciona

- **Trilha**: 4 unidades de tabuada (+, −, ×, ÷) e uma unidade de contas maiores de subtração.
  Cada lição **mostra a tabuada** e depois a criança **responde**. Tem 3 níveis: Aprender, Fixação e Domínio.
- **Tabuada**: escolha a operação e o número para ver a tabuada simples.
  1. **Veja** (ou ouça em voz alta), 2. **Aprenda** conta por conta com bolinhas e explicação, 3. **Responda** a lição.
  O botão *Esconder* oculta os resultados para a criança testar a memória.
- **Ajuda** em cada pergunta: dicas de como fazer a conta (contar nos dedos, completar o 10, dobro, truque do 9, conta armada…).
- **Desafios**: Desafio do dia, Revisão surpresa, Teste de progresso (gera um boletim por tabuada),
  Contra o relógio, Sobrevivência, Mestre da tabuada e Treino dos erros.
- **Progresso**: sequência de dias, XP, conquistas e mapa das tabuadas.
- **Pais** (com PIN): resumo, acerto por operação, gráfico de 14 dias, contas com mais erros, mapa de domínio,
  testes de progresso, histórico, relatório para WhatsApp, backup e configurações.

O progresso fica salvo **no aparelho** (localStorage). Use *Pais → Exportar backup* para guardar ou trocar de aparelho.

## Rodar na rede local (celular, tablet e PC na mesma Wi-Fi)

```bash
./serve.sh          # porta 8080
./serve.sh 3000     # outra porta
```

O script mostra o endereço para abrir nos outros aparelhos, por exemplo `http://192.168.1.2:8080`.
Se não abrir, libere a porta no firewall do computador (ex.: `sudo ufw allow 8080`).

> Pela rede local (http) o app funciona normalmente, mas o modo offline e o "instalar na tela inicial"
> só funcionam em `localhost` ou em HTTPS. Para ter tudo, use o GitHub Pages.

## Publicar no GitHub Pages

1. Faça commit e push dos arquivos para o branch `main`.
2. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`** → Save.
3. Em ~1 minuto o app estará em `https://<seu-usuario>.github.io/app-matematica/`.
4. No celular ou tablet, abra o link e use **"Adicionar à tela inicial"** para instalar como app.

## Atualizando o app

O service worker (`sw.js`) guarda os arquivos para funcionar offline.
**Sempre que mudar algum arquivo, aumente a versão** em `sw.js` (`tabuada-v3` → `tabuada-v4`),
senão os aparelhos continuam com a versão antiga. A nova versão aparece ao abrir o app pela segunda vez.

## Estrutura

```
index.html             página principal
manifest.webmanifest   dados do app instalável
sw.js                  cache offline
serve.sh               servidor para a rede local
css/style.css          visual (celular, tablet e computador)
js/app.js              telas e interação
js/engine.js           tabuadas, gerador de perguntas, explicações, dicas, progresso e conquistas
js/icons.js            ícones em SVG
js/fx.js               sons (WebAudio) e confete
fonts/nunito.woff2     fonte Nunito (SIL Open Font License)
icons/                 ícones do app
```
