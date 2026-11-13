# Roteiro de produção — Operação Aprovação

Formato: 1080×1920 · 30 fps · 65 s (1950 quadros) · narração em PT-BR, cerca de 165 palavras.
Legenda: **[TELA]** = texto 3D ou sobreposição · **[VO]** = narração.

---

## Cena 1 — Abertura cinematográfica · 0:00–0:07 (q. 1–210) · v3
*Script: `scripts/cena01_abertura.py` · projeto: `blender/cena01_abertura.blend` · textos: `scripts/textos_cena01.py` (camada 2D)*
**[VO]** "Sonha em entrar para a PMGO? Um novo concurso está em discussão. E você, já começou a estudar?"
**[TELA]** `SEU SONHO É / ENTRAR PARA / A PMGO?` (0,3–4,2 s) · secundário `Novo concurso em discussão` (1,2–4,2 s)
**[IMAGEM]**
- 0–2 s: câmera rente ao asfalto molhado aproxima-se da viatura genérica, sem brasões nem inscrições
- 2–4 s: movimento lateral revela a silhueta
- 4–4,6 s: um poste em primeiro plano cobre a tela; corte
- 4,6–5,5 s: a lateral de uma estante desliza e revela a mesa; a luminária acende
- 5,5–7 s: livro de legislação, com marcadores de página, e notebook
> "Em discussão" tem só fontes secundárias (sites de cursos preparatórios, out./nov. 2026). Conferir com fonte oficial antes de publicar. Ver `04_verificacoes_pendentes.md`.
> Versões anteriores (livros + título com feixe vermelho): `renders/cena01/backup_v1/` e `backup_v2/`.

## Cena 2 — Problema · 0:07–0:15 (q. 211–450)
**[VO]** "Muita gente já estuda com inteligência artificial. O risco é copiar a resposta sem conferir. A IA pode errar, e com muita confiança."
**[TELA]** `A IA PODE ERRAR.` · `E ERRAR COM CONFIANÇA.`

## Cena 3 — Exemplo: legítima defesa · 0:15–0:27 (q. 451–810)
*Baseada na Demonstração A do e-book (p. 31–34).*
**[TELA, selo fixo]** `EXEMPLO ILUSTRATIVO · ERRO PROPOSITAL`
**[VO]** "Veja um exemplo ilustrativo, com um erro colocado de propósito. A resposta diz: a agressão deve ser atual, iminente ou futura. Parece certo. Mas compare com a lei: o artigo 25 do Código Penal fala em injusta agressão, atual ou iminente. A palavra 'futura' não está lá."
**[TELA]** Balão de chat: `A agressão deve ser atual, iminente ou futura.` → "ou futura" sublinhado e riscado em vermelho, com `✗ ERRO` (símbolo + palavra, não só cor, como no livro) → cartão do art. 25, caput, com `atual ou iminente` destacado → `✓ atual ou iminente`.
> Esta é a mesma resposta ilustrativa do e-book, identificada lá como "escrita para o guia" e "não é resultado de teste de uma ferramenta". O vídeo mantém esse aviso na tela.
> ⚠ O texto do art. 25 ainda precisa ser conferido no Planalto (ver `04_verificacoes_pendentes.md`).

## Cena 4 — Prompt de conferência · 0:27–0:38 (q. 811–1140)
*Modelo P02 do e-book, "Comparar a resposta com a fonte" (p. 14).*
**[VO]** "Para pegar esse tipo de erro, use um prompt de conferência: compare a resposta com o texto da lei, frase por frase, e marque o que é fiel, diferente ou não consta. E lembre: a conferência final é sua, na fonte."
**[TELA]** Celular 3D com o trecho do P02 sendo digitado (abreviado, rotulado `TRECHO DO MODELO P02`):
```
Compare a RESPOSTA com o TEXTO-FONTE,
frase por frase. Situação:
fiel / diferente / não consta no texto.
```
**[TELA, rodapé]** `A conferência final é sua, na fonte.`

## Cena 5 — O método · 0:38–0:50 (q. 1141–1500)
*Figura 1 do e-book (p. 6).*
**[VO]** "É o método em cinco etapas: Fonte. Pedido. Conferência. Treino. Revisão. Escolha o material, preencha o prompt, compare com a fonte, responda sem consulta e retome depois."
**[TELA]** Cinco blocos 3D numerados, com a legenda do livro embaixo de cada um:
`1 FONTE` escolher o material · `2 PEDIDO` preencher o prompt · `3 CONFERÊNCIA` comparar com a fonte · `4 TREINO` responder sem consulta · `5 REVISÃO` retomar depois
O bloco 3 fica no centro, com mais destaque (no livro: "a conferência fica no centro").

## Cena 6 — Oferta · 0:50–1:00 (q. 1501–1800)
**[VO]** "No e-book IA para Concursos Policiais você encontra 60 modelos de prompt e 3 demonstrações completas. Preço especial de lançamento: 47 reais."
**[TELA]** Capa real do e-book em 3D (livro com espessura) · `60 MODELOS DE PROMPT` · `3 DEMONSTRAÇÕES COMPLETAS` · `R$ 47,00`, com rótulo `Preço de lançamento`.
> Fatos conferidos no PDF (capa interna: "Método em 5 etapas · 3 demonstrações completas · 60 prompts prontos para preencher"; 70 páginas) e na página de vendas (R$ 47,00 no lançamento; preço cheio configurado: R$ 97,00, opcional na tela).
> Textura: `assets/referencias/capa.png` (1333×2000). Os bônus aparecem na capa, mas não são narrados, porque não fazem parte do briefing.

## Cena 7 — Encerramento · 1:00–1:05 (q. 1801–1950)
**[VO]** "Acesse o link da bio."
**[TELA]** `ACESSE O LINK DA BIO` (vermelho) + logotipo "Operação Aprovação", se o arquivo for fornecido.

---
### O que fica de fora, de propósito
Depoimentos, número de aprovados, promessa de aprovação, brasões, fardas oficiais, viaturas com grafismo da PMGO e qualquer data de edital.
