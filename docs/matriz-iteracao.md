# Matriz de iteração do Fluxo

Origem de cada linha: **H** = avaliação heurística ([documento](avaliacao-heuristica.md)); **A** = auditoria de acessibilidade; **R** = relato do autor; **U** = teste com usuários (ainda não aplicado). Validação refere-se ao build web.

| ID | Origem | Tela / fluxo | Problema | Decisão | Antes → depois | Validação |
|---|---|---|---|---|---|---|
| I-01 | H1 | Nova movimentação, orçamento, categoria | Sem confirmação visível de salvar; `Alert` não aparece na web | `NoticeHost` (✓/✕, região viva, 3,5 s) | alerta que some → aviso consistente no topo | e2e: aviso e `role=alert` presentes |
| I-02 | H3 | Detalhes | Não era possível excluir lançamento | Botão "Excluir movimentação" + confirmação (`confirmAction`) | sem saída → reversível antes de executar | e2e: cancelar mantém, confirmar remove |
| I-03 | H5 | Login, cadastro, nova, redefinir | Toque repetido durante envio | `PrimaryButton loading` (spinner, `busy`) | duplicável → bloqueado | e2e: fluxos concluem sem duplicar |
| I-04 | H4 | Login, cadastro | Botão próprio, estados diferentes | Trocado por `PrimaryButton` | 2 estilos → 1 componente | inspeção + e2e login/cadastro |
| I-05 | A | Cadastro | Checkbox `#16A34A` com 3,30:1 | `#166534` | 3,30 → 7,13:1 | script de contraste |
| I-06 | A | Todos os campos escuros | Placeholder `#64748B`, 3,07:1 | `placeholderOnDark` | 3,07 → 5,71:1 | script de contraste |
| I-07 | A | Campos e chips | Borda 1,72:1 e sem anel de foco nos chips | `fieldBorder` (3,07:1) + foco 3 px | borda fraca → visível | script + inspeção |
| I-08 | R | Orçamento | Autor não conseguia editar orçamento | Atalho no Perfil + tela de edição | 1 entrada → 2 | e2e: edita e salva pelo Perfil |
| I-09 | H9 | Formulários | Erro só por cor, sem anúncio | `role=alert` + ✕ no aviso | só cor → cor + símbolo + anúncio | inspeção |
| I-10 | H7 | Extrato | Lista pesada | `FlatList` virtualizada, `memo`, busca sem acento | — | e2e: 37 linhas na 1ª janela, 44 no dado |
| I-11 | H4 | Rotas | Nome em português (`transacao`) fora do padrão | Renomeado para `transaction` | inconsistente → padronizado | e2e + `tsc` |
| U-01…U-n | U | A definir | Preencher após o Think Aloud | | | Reteste da tarefa afetada |

## Ciclo aplicado

```
medir (heurística / auditoria / relato) → priorizar por severidade → corrigir → validar → registrar
```

## Inventário das 12 telas

Login, Cadastro, Redefinir senha, Nome de exibição, Início, Extrato, Nova movimentação, Perfil, Orçamento, Editar orçamento, Detalhes da movimentação, Categoria da movimentação.

## Navegação

Stack raiz (autenticação, detalhes, orçamento) e Tabs (Início, Extrato, Nova, Perfil), com redirecionamento por sessão.
