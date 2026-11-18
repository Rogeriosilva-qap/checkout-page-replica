# Vídeo TikTok/Reels · Método Bússola (Remotion)

Divulgação do *Guia Definitivo do Concurseiro Policial Cibernético* (Operação Aprovação):
o Método Bússola aplicado à linha "Lei de Execução Penal (Lei nº 7.210/1984)" de um edital
de Polícia Penal. 1080×1920, 30 fps, 990 frames (33 s), H.264 CRF 18.

## Arquivos finais (`out/`)

| Arquivo | O que é |
|---|---|
| `video-bussola-tiktok.mp4` | Versão padrão (= `-bio`) |
| `video-bussola-tiktok-bio.mp4` | CTA "LINK NA BIO", narração "O link tá na bio" |
| `video-bussola-tiktok-stories.mp4` | CTA "LINK NOS STORIES", narração "O link tá nos stories" |
| `video-bussola-tiktok-direct.mp4` | **Para anúncio:** CTA "COMENTE “BÚSSOLA”", narração "Comente BÚSSOLA que eu te mando no direct" |
| `capa-tiktok.png` | Capa (frame do segundo 1) |
| `legendas.srt` / `legendas-stories.srt` / `legendas-direct.srt` | Narração sincronizada palavra a palavra |
| `frames/segundo-XX.png` | Quadros de conferência (1, 7, 15, 20, 24, 30 s) |

## Como rodar

```
npm install
npm run studio     # abre o Remotion Studio (prop `cta`: "bio" | "stories" | "direct")
npm run render     # prepara assets e renderiza as duas versões + capa + .srt
```

`npm run render` (scripts/render-all.mjs) faz, em ordem:
1. `scripts/prepare.mjs`: verifica `public/`, grava `src/data/assets.json` e:
   - sem `public/narracao.mp3`: gera a narração no ElevenLabs (`scripts/elevenlabs.py`) e
     enxuga pausas/nivela a −14 LUFS (`scripts/processa_voz.py`) → `public/voz/`;
   - com `public/narracao.mp3`: usa o arquivo do autor (as legendas passam a ser
     distribuídas pelo tempo de cada cena, porque não há tempo por palavra);
   - gera `.cache/timeline.json` e os `.srt` (`scripts/export-timeline.ts`);
   - sem `public/musica.mp3`: compõe a trilha original (`scripts/trilha.py`).
2. Renderiza `bio` e `stories`, copia a padrão e exporta a capa.

## Onde ajustar

- **Tempos:** `src/timing.ts` (frames por cena, atraso da voz, duração do glitch). O
  `export-timeline` avisa se alguma fala ficar maior que a própria cena.
- **Cenas:** `src/scenes/Cena01Gancho.tsx` … `Cena09Cta.tsx`.
- **Micro-tópicos e prioridades:** `src/data/topicos.ts` (exemplo ilustrativo do guia).
- **Legendas:** `src/captions.ts` (agrupamento 2–4 palavras e palavras-chave em vermelho).
- **Cores, fontes e zonas seguras:** `src/theme.ts`.

## Áudio

- Voz: ElevenLabs, "Eduardo S. – Brazilian Clear & Pro" (ID `4J31DrhygVjvFsoj7BsM`),
  modelo multilingual v2, velocidade 1,2, uma fala por cena (com contexto da anterior
  e da seguinte para manter a entonação). Silêncios finais cortados e pausas internas
  encurtadas (sem acelerar a voz). Para trocar de voz:
  `python3 scripts/elevenlabs.py --voz OUTRO_ID` e depois `npm run render`.
- Trilha: **composição original gerada em código** (`scripts/trilha.py`), sem amostras de
  terceiros: tensão no gancho, bateria a partir do Método Bússola, impactos nas trocas,
  acorde final no CTA. Fica ~13 dB abaixo da voz e sobe nas pausas.
  Para usar outra música, coloque `public/musica.mp3` (com licença de uso).
- Efeito de glitch curto em cada troca de cena (`public/sfx/glitch.wav`, também gerado).

## Render neste ambiente

As fontes vêm do `@remotion/google-fonts`. Aqui o Chromium sai pelo proxy do ambiente
via `scripts/chrome-proxy.sh` (o Remotion abre o navegador em conexão direta). Na sua
máquina isso não é necessário: `render-all.mjs` só usa o wrapper quando encontra
`/opt/pw-browsers`; em outro lugar o Remotion usa o navegador dele.

## Vídeos curtos da plataforma de simulados (pré-lançamento)

| Arquivo | Composição | O que é |
|---|---|---|
| `out/video-patentes-simulados.mp4` | `PatentesSimulados` | "Qual seria a sua patente?" (26,4 s): regras de XP e as 8 patentes, de Recruta a Caveira |
| `out/video-teaser-simulados.mp4` | `TeaserSimulados` | Teaser de 10 s: "Vem aí" + 4 recursos + "Comente SIMULADO" |
| `out/legendas-patentes.srt` / `out/legendas-teaser.srt` | | Legendas |

- Código: `src/patentes/Patentes.tsx` e `src/patentes/Teaser.tsx` (tempos no topo de cada arquivo) e o kit comum `src/kit.tsx`.
- Regras de XP e nomes das patentes copiados da plataforma (`src/lib/patentes.ts` no Lovable):
  simulado = 100 XP, questão dominada = 25 XP, dia de ofensiva = 15 XP. Se mudarem, atualize `PATENTES`
  e a narração (`roteiros/patentes.json`).
- Refazer:
  ```
  python3 scripts/elevenlabs.py --roteiro roteiros/patentes.json --pasta voz-patentes --velocidade 1.15
  python3 scripts/processa_voz.py --pasta voz-patentes --saida src/data/narracao-patentes.json
  npx tsx scripts/export-shorts.ts
  python3 scripts/trilha.py --timeline .cache/timeline-patentes.json --drop simulado --cta cta --out trilha-patentes.wav
  npx remotion render src/index.ts PatentesSimulados out/video-patentes-simulados.mp4 --browser-executable=$PWD/scripts/chrome-proxy.sh
  ```
  (o teaser é igual, trocando `patentes` por `teaser`, `--drop nome` e a composição `TeaserSimulados`).
