# Vídeo · Método Bússola (Operação Aprovação)

Vídeo vertical educativo, 1080 × 1920, 30 fps, 63,7 s, baseado na Operação 01 do
*Guia Concurseiro Policial Cibernético*. **Versão final com a locução do autor**
(`narracao-metodo-bussola.wav`, convertida sem edição do áudio de WhatsApp enviado).

## Arquivos

| Arquivo | O que é |
|---|---|
| `saida/metodo-bussola.mp4` | Vídeo final: voz + trilha original + efeitos, −15 LUFS (padrão de redes) |
| `saida/metodo-bussola.srt` | Legendas pt-BR sincronizadas à fala, até 2 linhas |
| `narracao-metodo-bussola.txt` | Texto falado (atualizado: "inteligência artificial", como está na locução) |
| `narracao-metodo-bussola.wav` | Locução usada no vídeo |
| `projeto/palavras.json` | Tempo de cada palavra da locução (transcrição Whisper) |
| `projeto/roteiro.json` | Fonte das legendas (texto exibido e texto falado) |
| `projeto/timeline.json` / `timeline.js` | Tempos de legendas, palavras e cenas (gerados) |
| `projeto/index.html` | Composição e animação editáveis (HTML/CSS/JS, função pura do tempo) |
| `projeto/assets/` | Logo da Operação Aprovação (extraída do PDF) e fonte Montserrat (OFL) |
| `tools/transcribe.py` | Transcreve a locução com tempo por palavra |
| `tools/sync.py` | Encaixa legendas, destaques e cortes na fala e gera o `.srt` |
| `tools/trilha.py` | Compõe a trilha original e os efeitos, sincronizados aos cortes |
| `tools/render.mjs` | Renderiza no Chromium, mixa o áudio e codifica com ffmpeg |

## Sincronização

- Cada legenda entra e sai na fala real; a palavra que está sendo dita fica em vermelho.
- Os destaques acompanham a palavra: "travou" (tremida), "matéria" (Português em destaque),
  "confira" (selo de conferência), "verbal" (divisão), "resolver"/"corrigir" (checklist),
  "peso"/"dificuldade"/"base" (critérios), "Alfa" (selo), "quarta"/"19" (agenda),
  "revisar" e "margem" (blocos da semana).
- Trocas de cena acontecem nas pausas entre parágrafos.

## Áudio

- Voz: só filtro de graves (70 Hz) e nivelamento em −16 LUFS; timbre e ritmo preservados.
- Trilha: **composição original gerada em código** (`tools/trilha.py`), sem amostras ou
  músicas de terceiros, portanto sem risco de direitos autorais. Pulso tático em Ré menor,
  100 BPM; no gancho só pad e "tique de relógio"; bateria e baixo entram com o Método
  Bússola; acorde final no fechamento. Fica 12–19 dB abaixo da voz e abaixa sozinha
  quando há fala (ducking).
- Efeitos: whoosh nas trocas de cena e cliques discretos nos destaques.

## Refazer

```
./build.sh                 # sincroniza, gera trilha e renderiza
./build.sh --sem-sync      # usa um timeline.json ajustado à mão
./build.sh --sem-trilha    # só a voz
```

Trocou a locução? Salve o novo arquivo como `narracao-metodo-bussola.wav` e rode
`python3 tools/transcribe.py CAMINHO_DO_MODELO_WHISPER` antes do `./build.sh`
(sem transcrição, o sync usa as pausas do áudio).

## Ver e editar

- Abrir `projeto/index.html` no navegador e clicar: toca a animação (com o áudio, se houver).
- `projeto/index.html?t=27.5` congela num instante.
- `node tools/render.mjs --stills 5,27.5` gera PNGs em `saida/stills/`.

Requisitos: Python 3 (numpy, scipy; faster-whisper só para transcrever), Node com Playwright/Chromium, ffmpeg.

## Cenas (tempos finais)

| Cena | Início | Conteúdo |
|---|---|---|
| Gancho | 0,0 s | Edital estilizado + "O que estudar primeiro?"; Método Bússola entra em 4,7 s |
| 1 · Extração | 9,3 s | Lista organizada por matéria, Português em destaque, "Confira no edital e nas retificações", selo "Exemplo ilustrativo" |
| 2 · Fatiamento | 20,2 s | "Concordância verbal e nominal" se divide; "verbal" vira o cartão "Resolver 5 questões + corrigir os erros" |
| 3 · Priorização | 29,8 s | Peso na prova (dado do seu edital) · Sua dificuldade · Assuntos de base → Alfa/Bravo/Charlie; cartão vai para Alfa "neste exemplo: se for Alfa para você" |
| 4 · Calendário | 46,3 s | O mesmo cartão vai para "QUA · 19h"; revisão na quinta e margem para imprevistos no sábado |
| Fechamento | 57,6 s | Logo + "Salve e marque sua primeira tarefa" |

Área segura: títulos entre y 226–560, palco até y ~1300, legendas a partir de y 1352
e nada útil abaixo de y ~1510 (controles de Reels/TikTok/Shorts).
