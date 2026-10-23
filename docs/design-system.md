# Design system do Fluxo

Fonte única: `src/theme/tokens.ts`. Nenhuma tela deve usar cor, tamanho ou espaçamento fora desses tokens (exceção conhecida: login e cadastro mantêm uma paleta local de campos, listada em "Limites").

## Princípios

1. **Clareza financeira primeiro:** valores e estados (receita, despesa, limite) são legíveis antes de decorativos.
2. **Nunca só cor:** receita/despesa e sucesso/erro também usam texto, sinal ou símbolo (✓ / ✕).
3. **Toda ação responde:** pressionar, carregar, salvar e errar têm resposta visível e anunciada.
4. **Acessível por padrão:** contraste de texto ≥ 4,5:1, alvos ≥ 44×44, rótulos sempre visíveis.

## Cores (contraste calculado pela fórmula de luminância relativa da WCAG 2.0)

| Token | Hex | Uso | Par | Razão |
|---|---|---|---|---:|
| `navy` | `#0F172A` | fundo das telas | texto `surface` | 17,85:1 |
| `rowSurface` | `#1E293B` | linhas, campos | texto `mutedOnDark` | 9,85:1 |
| `surface` | `#FFFFFF` | cartões, texto sobre escuro | texto `navy` | 17,85:1 |
| `primary` | `#166534` | botão primário, links | texto branco | 7,13:1 |
| `danger` | `#B91C1C` | botão excluir, erros em cartão | texto branco | 6,47:1 |
| `mutedOnDark` | `#CBD5E1` | texto de apoio no escuro | sobre `navy` | 12,02:1 |
| `muted` | `#64748B` | texto de apoio no claro | sobre branco | 4,76:1 |
| `incomeOnDark` | `#86EFAC` | receitas | sobre `rowSurface` | 10,42:1 |
| `expenseOnDark` | `#FCA5A5` | despesas | sobre `rowSurface` | 7,71:1 |
| `warningOnDark` | `#FCD34D` | limite próximo (≥ 80%) | sobre `rowSurface` | 10,15:1 |
| `accent` | `#4ADE80` | aba ativa, links, anel de foco | sobre `navy` | 10,25:1 |
| `placeholderOnDark` | `#94A3B8` | placeholder | sobre `rowSurface` | 5,71:1 |
| `successSurface` / `primary` | `#DCFCE7` / `#166534` | aviso de sucesso | texto sobre fundo | 6,49:1 |
| `errorSurface` / `errorText` | `#FEE2E2` / `#7F1D1D` | aviso de erro | texto sobre fundo | 8,20:1 |
| `fieldBorder` | `#64748B` | borda de campo e chip (não texto) | sobre `rowSurface` | 3,07:1 |

Cores removidas por reprovarem: `#16A34A` com texto branco (3,30:1) e `muted` como placeholder no escuro (3,07:1).

## Tipografia

| Token | Tamanho | Uso |
|---|---:|---|
| `caption` | 12 | metadados |
| `label` | 14 | rótulos, avisos |
| `body` | 15 | texto corrido |
| `button` | 16 | botões |
| `title` | 18 | títulos de cartão |
| `screenTitle` | 28 | título da tela |
| `amount` | 32 | valores de destaque |

Pesos: 400, 600, 700, 800. Linhas: 18, 22, 24, 36.

## Espaçamento, raio, movimento

- Espaçamento: 4, 8, 16, 24, 32 (`xs`…`xl`).
- Raios: controle 12, cartão 24, pílula 999.
- Alvo mínimo: `minTouchTarget = 44`.
- Movimento: 120 ms (rápido), 220 ms (base), aviso some em 3,5 s. Animações são puladas quando o sistema pede "reduzir movimento".

## Componentes

| Componente | Variações e estados | Acessibilidade |
|---|---|---|
| `PrimaryButton` | `primary`, `secondary`, `danger`; normal, pressionado (opacidade 0,82 + escala 0,98), foco (anel 3 px), desabilitado, carregando (spinner + rótulo "Salvando…") | `role=button`, `disabled`/`busy`, `accessibilityHint` opcional, altura ≥ 44 |
| `FormField` | rótulo sempre visível; normal, foco (borda 2 px `accent`), erro (borda + mensagem) | `accessibilityLabel`, mensagem com `role=alert` e região viva |
| `Chip` | desmarcado, marcado, pressionado, foco | `role=radio`, `checked`, altura ≥ 44 |
| `TransactionListItem` | pressionado, foco; memoizado | rótulo completo: tipo, descrição, categoria, valor, data |
| `NoticeHost` | sucesso (✓) e erro (✕); entra com animação, fecha ao tocar ou em 3,5 s | `role=alert`, região viva, anúncio por leitor de tela, alvo ≥ 44 |
| `Screen` | título, botão voltar com foco | botão "Voltar à tela anterior" |

## Estados padronizados

| Estado | Como aparece |
|---|---|
| Carregando | `ActivityIndicator` com rótulo ("Carregando movimentações") |
| Vazio | cartão com explicação e próxima ação (ex.: "Nada encontrado") |
| Erro de campo | mensagem sob o campo, só após tocar no campo |
| Erro de operação | aviso vermelho com ✕ no topo |
| Sucesso | aviso verde com ✓ no topo |
| Destrutivo | confirmação nativa antes de executar (Excluir, Sair) |

## Limites conhecidos

- Login e cadastro ainda têm paleta local de campos (claros, sobre cartão branco); os contrastes foram auditados, mas não vêm dos tokens.
- A verificação de contraste é calculada; não houve teste com leitor de tela (TalkBack/VoiceOver) em aparelho.
- WCAG 2.0 não exige contraste de elementos gráficos; `fieldBorder` segue 3:1 por boa prática (critério da 2.1).
