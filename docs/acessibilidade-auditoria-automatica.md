# Auditoria automática de acessibilidade (axe-core)

**Método:** build web do app (`expo export -p web`), 11 telas percorridas com Playwright (Chromium, 390×844) e análise com axe-core, regras WCAG 2.0/2.1 A e AA. Relatórios brutos: [antes](evidencias-axe-antes.json) e [depois](evidencias-axe-depois.json). Não substitui teste com VoiceOver/TalkBack em aparelho.

| Regra | Antes (nós) | Depois (nós) | Correção |
|---|---:|---:|---|
| `aria-required-attr` (WCAG 4.1.2): `radio`/`checkbox` sem `aria-checked` | 12 | 0 | `aria-checked` em `Chip` e no checkbox de termos |
| `label-content-name-mismatch` (WCAG 2.5.3): nome acessível sem o texto visível | 12 | 0 | rótulos de `TransactionListItem` e do cartão de resumo do Início começam pelo texto visível, na mesma ordem |
| Total | 24 | 0 | |

## Outras verificações (build web)

- **Zoom 200%** (viewport de 195 px de largura): sem rolagem horizontal da página em login, cadastro, Início, Nova e Orçamento; abaixo de 300 px a barra de abas esconde os textos e mantém o nome acessível; tipos de movimentação quebram de linha.
- **Daltonismo** (protanopia, deuteranopia, tritanopia via emulação do Chromium): receita/despesa e erros continuam distinguíveis por texto, sinal (+/−) e símbolo (✓/✕).
- **Erros de formulário:** mensagens com `role=alert` e região viva.
- **Página não encontrada:** nova rota `+not-found` com texto claro e botão "Voltar ao início".
- **Fluxo automatizado:** 15 passos passaram após as mudanças (seletores atualizados para os novos rótulos).

## Limites

Pendentes e dependentes de pessoas/aparelho: tarefa completa com VoiceOver/TalkBack e retestes com usuários.
