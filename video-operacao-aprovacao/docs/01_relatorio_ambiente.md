# Relatório de ambiente — 13/11/2026

Resultado real dos testes feitos neste container de nuvem. Nada aqui foi suposto.

| Item | Resultado | Como foi verificado |
|---|---|---|
| Blender MCP | **Não conectado** | Busca por ferramentas "blender" na sessão: nenhuma encontrada |
| Binário do Blender | **Não instalado** | `blender --version` → `command not found` |
| `bpy` (Blender como módulo Python) | **Disponível no PyPI (5.3.0), instalação bloqueada** | `pip index versions bpy` → 5.3.0. A instalação num venv foi negada pelo controle de permissões da sessão |
| Motor de renderização | **Não verificado** | Depende do Blender/bpy instalado |
| Python | **OK — 3.13.18** | `python3 --version` |
| FFmpeg / FFprobe | **OK — 6.1.1** | `ffmpeg -version` |
| GPU | **Nenhuma** (sem `nvidia-smi`) | Render seria Cycles em CPU (4 núcleos, 15 GB RAM) |
| PDF original do e-book | **Não está no repositório** | Busca por `*.pdf` |
| Capa do e-book | **Só a referência** (`src/assets/capa-ebook.jpg.asset.json`): o arquivo fica hospedado no Lovable, não está no repositório | Leitura do `.asset.json` |
| Texto oficial do art. 25 do CP | **Não conferido** | `planalto.gov.br` está fora da rede permitida neste ambiente (falha de DNS) |

## O que precisa para o Blender funcionar

**Opção A — Blender MCP na sua máquina (recomendado para direção visual)**
O Blender MCP (por exemplo, o projeto `blender-mcp`) funciona assim: um add-on dentro do Blender aberto abre um socket local, e um servidor MCP conversa com ele. Ele precisa do Blender com interface rodando, por isso **não funciona neste container de nuvem**. Passos na sua máquina:
1. Instale o Blender 4.2 LTS ou mais recente.
2. Instale o add-on do Blender MCP (Edit → Preferences → Add-ons → Install from file) e ative-o.
3. No painel lateral do Blender (tecla N), aba do MCP, clique em "Connect".
4. Registre o servidor MCP no Claude Code local (`claude mcp add ...`, conforme o README do projeto) e abra uma sessão do Claude Code **na sua máquina**, apontando para esta pasta.

**Opção B — Render headless aqui na nuvem (sem MCP)**
Os scripts em `scripts/` são Python puro para o Blender. Para rodá-los aqui:
1. Autorizar a instalação do `bpy` 5.3.0 num ambiente virtual (cerca de 400 MB). A instalação foi bloqueada nesta sessão; você decide se libera.
2. Renderizar em Cycles/CPU. Estimativa grosseira: 20 a 60 s por quadro em 1080×1920 com denoise. A cena 1 tem 210 quadros, ou seja, de 1 a 3,5 h. Por isso o teste usa uma prévia em resolução de 50%.

**Opção C — Blender instalado na sua máquina, sem MCP**
```
blender -b -P scripts/cena01_gancho.py -- --preview
```
Esse comando renderiza a prévia da cena 1 em `renders/cena01/`.
