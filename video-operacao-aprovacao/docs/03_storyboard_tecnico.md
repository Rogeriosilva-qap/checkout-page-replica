# Storyboard técnico

## Padrões globais
- **Resolução:** 1080×1920, 30 fps, sRGB, AgX (contraste "Medium High")
- **Motor:** Cycles CPU (não há GPU), 64 amostras + OpenImageDenoise; prévia com 16 amostras a 50%
- **Nota de cor:** a capa é preta e vermelha; o cenário fica marinho, e o vermelho do vídeo usa o mesmo tom da capa para manter a marca coerente
- **Paleta:** marinho `#070B14` (fundo) · marinho `#0E1A33` (superfícies) · branco `#F2F4F7` · vermelho `#D7263D` (só para acento e alerta)
- **Luz-base:** key de área quente-neutra a 45° (4500 K) · rim azul-fria atrás · fill fraco; mundo quase preto
- **Câmera:** lente de 50 mm (35 mm nos planos abertos), DOF f/2.8, movimentos com easing, sem tremor artificial
- **Área segura (Reels/TikTok):** texto entre y = 250 px e y = 1500 px; margens laterais de 90 px (a interface cobre topo, base e lateral direita)
- **Tipografia:** Poppins ExtraBold / Medium, a mesma família visual da capa (em `assets/fontes/`; usa a fonte padrão do Blender como fallback); títulos com no mínimo 90 px de altura de versal
- **Transições:** corte seco ou empurrão de câmera, sem efeitos de pacote

## Cena a cena

| # | Quadros | Plano / câmera | Objetos 3D e materiais | Texto | Luz / acento |
|---|---|---|---|---|---|
| 1 | 1–210 | Dolly-in lento (z 0,6 m) sobre uma mesa escura; foco puxa dos livros para o texto | Mesa de marinho fosco com reflexo suave · pilha de 3 livros (capa de tecido marinho, páginas off-white) · celular com tela emissiva fraca · quepe genérico **fora de cena**, só a silhueta, ou omitido | Linha 1 entra em q. 20; linha 2 em q. 110; disclaimer em q. 140 | Fio vermelho fino sob o título |
| 2 | 211–450 | Câmera orbita 15° ao redor do celular | Celular em destaque; balões de chat em vidro fosco | "A IA PODE ERRAR." / "E ERRAR COM CONFIANÇA." | Pulso vermelho único no balão |
| 3 | 451–810 | Plano frontal; empurrão do balão para o cartão de lei | Balão com a resposta ilustrativa da Demonstração A → "ou futura" sublinhado + ✗ ERRO · cartão de papel com o art. 25 | Selo "EXEMPLO ILUSTRATIVO · ERRO PROPOSITAL" fixo do início ao fim | Destaque branco em "atual ou iminente" |
| 4 | 811–1140 | Close no celular, câmera sobe 5° | Celular com o trecho do modelo P02 digitado (2 caracteres por quadro) | Rótulo "TRECHO DO MODELO P02" + 3 linhas + rodapé | Cursor vermelho |
| 5 | 1141–1500 | Travelling lateral sobre 5 blocos | Blocos de metal escovado marinho, faces com relevo; setas brancas | Número + palavra + legenda do livro (Figura 1); bloco 3 em destaque no centro | Cada bloco acende com rim branco ao entrar |
| 6 | 1501–1800 | Giro de 20° no livro, depois enquadramento estático | E-book 3D com a **capa real** (`assets/referencias/capa.png`, 1333×2000, proporção 2:3) · espessura proporcional a 70 páginas | 60 MODELOS · 3 DEMONSTRAÇÕES · R$ 47,00 | Preço em branco com tarja vermelha |
| 7 | 1801–1950 | Estático, leve recuo | Fundo limpo | ACESSE O LINK DA BIO | Vermelho cheio no CTA |

## Pipeline
1. `scripts/cena0N_*.py` gera a cena e renderiza PNGs em `renders/cena0N/`
2. Validação da cena (você aprova) e só então a próxima
3. `scripts/montagem_ffmpeg.sh` junta as sequências + narração + trilha em `output/operacao_aprovacao_v1.mp4` (H.264, CRF 18, AAC 192k, `+faststart`)
