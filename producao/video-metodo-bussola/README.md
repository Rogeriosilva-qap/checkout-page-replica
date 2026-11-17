# Vídeo · Método Bússola (Operação Aprovação)

Vídeo vertical educativo, 1080 × 1920, 30 fps, baseado na Operação 01 do
*Guia Concurseiro Policial Cibernético*. **Versão atual: PRÉVIA** — tempos
estimados, sem locução (o selo "PRÉVIA · VOZ PENDENTE" some sozinho quando o
áudio entra).

## Arquivos

| Arquivo | O que é |
|---|---|
| `narracao-metodo-bussola.txt` | Só o texto falado, para gerar a voz no "Ouvir / Ler em voz alta" do Claude |
| `saida/metodo-bussola-PREVIA.mp4` | Prévia renderizada (62 s, faixa de áudio muda) |
| `saida/metodo-bussola.srt` | Legendas pt-BR, até 2 linhas |
| `projeto/roteiro.json` | Fonte das legendas (texto exibido e texto falado) |
| `projeto/timeline.json` / `timeline.js` | Tempos de cada legenda e cena (gerados) |
| `projeto/index.html` | Composição e animação editáveis (HTML/CSS/JS, função pura do tempo) |
| `projeto/assets/` | Logo da Operação Aprovação (extraída do PDF) e fonte Montserrat (OFL) |
| `tools/sync.py` | Calcula tempos (estimados ou a partir do áudio) e gera o `.srt` |
| `tools/render.mjs` | Renderiza quadro a quadro no Chromium e codifica com ffmpeg |

## Quando a voz estiver pronta

1. Salve o áudio nesta pasta como `narracao-metodo-bussola.wav` (ou `.mp3` / `.m4a`).
2. Rode `./build.sh`.

O `sync.py` detecta as pausas reais da locução e encaixa nelas os cortes de cena,
os destaques e as legendas; a voz não é alterada. Sai `saida/metodo-bussola.mp4`
(sem o selo de prévia) e um `.srt` novo. Se algum corte precisar de ajuste fino,
edite `start`/`end` em `projeto/timeline.json` e rode `./build.sh --sem-sync`.

Trilha: nenhuma foi incluída. Se o autor autorizar um arquivo, ele deve ser
mixado abaixo da narração.

## Ver e editar

- Abrir `projeto/index.html` no navegador e clicar: toca a animação (com o áudio, se houver).
- `projeto/index.html?t=27.5` congela num instante.
- `node tools/render.mjs --stills 5,27.5` gera PNGs em `saida/stills/`.

Requisitos: Python 3, Node com Playwright/Chromium, ffmpeg.

## Cenas (tempos da prévia)

| Cena | Início | Conteúdo |
|---|---|---|
| Gancho | 0,0 s | Edital estilizado + "O que estudar primeiro?"; Método Bússola entra depois do gancho |
| 1 · Extração | 10,2 s | Lista organizada por matéria, Português em destaque, "Confira no edital e nas retificações", selo "Exemplo ilustrativo" |
| 2 · Fatiamento | 20,3 s | "Concordância verbal e nominal" se divide; "verbal" vira o cartão "Resolver 5 questões + corrigir os erros" |
| 3 · Priorização | 30,2 s | Peso na prova (dado do seu edital) · Sua dificuldade · Assuntos de base → Alfa/Bravo/Charlie; cartão vai para Alfa "neste exemplo: se for Alfa para você" |
| 4 · Calendário | 43,9 s | O mesmo cartão vai para "QUA · 19h"; revisão na quinta e margem para imprevistos no sábado |
| Fechamento | 55,4 s | Logo + "Salve e marque sua primeira tarefa" |

Área segura: títulos entre y 226–560, palco até y ~1300, legendas a partir de y 1352
e nada útil abaixo de y ~1510 nem à direita de x 940 (controles de Reels/TikTok/Shorts).
