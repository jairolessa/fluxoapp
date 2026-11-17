# Matriz de iteração do Fluxo

Esta matriz reúne mudanças registradas na avaliação heurística, auditoria de acessibilidade, relatos do autor e sessões Think Aloud. As sessões de P1 e P2 ocorreram em 22 e 23/10/2026; resultados e contexto estão em [teste-usabilidade.md](teste-usabilidade.md). A versão apresentada na AV2 também está documentada no material de origem, que registrou U-01 a U-05 como achados ainda sem correção ou reteste concluído.

**Origens:** **H** = avaliação heurística ([documento](avaliacao-heuristica.md)); **A** = auditoria de acessibilidade; **R** = relato do autor; **U** = teste com usuários. “Implementado no código atual” indica inspeção do repositório, não validação com participantes.

| ID | Origem | Tela / fluxo | Problema | Decisão / mudança | Antes → depois | Estado e validação |
|---|---|---|---|---|---|---|
| I-01 | H1 | Nova movimentação, orçamento, categoria | Sem confirmação visível; `Alert` não aparece na web | `NoticeHost` com ✓/✕, região viva e tempo de 3,5 s | alerta ausente → aviso no topo | Registrado como validado nos passos automatizados web; requer validação de acessibilidade em aparelho |
| I-02 | H3, U-03 | Detalhes | Não era possível excluir lançamento errado; P1 também não encontrou exclusão na versão testada | Botão “Excluir movimentação” com confirmação por `confirmAction` | sem opção → exclusão confirmada antes de executar | Implementado no código atual e coberto por fluxo automatizado informado na AV2; reteste com usuário pendente |
| I-03 | H5 | Login, cadastro, nova movimentação, redefinir senha | Toque repetido durante envio | `PrimaryButton` com `loading`, spinner e bloqueio de novo toque | envio duplicável → botão ocupado | Registrado como validado nos fluxos automatizados web |
| I-04 | H4 | Login, cadastro | Botões próprios com estados diferentes | Uso de `PrimaryButton` compartilhado onde registrado | estilos separados → componente compartilhado | Registrado como validado por inspeção e fluxo automatizado |
| I-05 | A | Cadastro | Checkbox `#16A34A` com contraste 3,30:1 com texto branco | Cor `#166534` | 3,30:1 → 7,13:1 | Contraste calculado; preservar relatório/script como evidência da AV2 |
| I-06 | A | Campos escuros | Placeholder `#64748B` com contraste 3,07:1 | Token `placeholderOnDark` | 3,07:1 → 5,71:1 | Contraste calculado; preservar relatório/script como evidência da AV2 |
| I-07 | A | Campos e chips | Borda de 1,72:1 e chips sem anel de foco | `fieldBorder` e foco de 3 px | borda pouco visível → borda/foco definidos | Contraste e inspeção registrados; testar em aparelho e com usuários de tecnologia assistiva |
| I-08 | R | Início, Perfil, orçamento | Orçamento difícil de encontrar para o autor | Atalhos para orçamento no Início e Perfil | acesso pouco evidente → atalhos em duas áreas | Implementado no código atual; achado de P1 (U-02) requer reteste de descoberta |
| I-09 | H9 | Formulários e avisos | Erro dependia da cor e não era anunciado | Texto de erro, ✕ e região viva | só cor → texto/símbolo/anúncio | Registrado como implementado; anúncio real com leitor de tela ainda pendente |
| I-10 | H7 | Extrato | Lista potencialmente pesada | `FlatList`, itens memoizados e busca sem acento | renderização não virtualizada → lista virtualizada | Validação automatizada registrada: primeira janela de 37 itens e conjunto de 44 |
| I-11 | H4 | Rotas | Rota `transacao` fora do padrão adotado | Rota renomeada para `transaction` | nome inconsistente → padrão aplicado | `tsc` e fluxo automatizado registrados como validação |
| U-01 | U (P1) | Login → cadastro (T1) | P1 tentou entrar e precisou de ajuda para localizar o cadastro; 2 min; severidade 3 no registro da AV2 | “Criar conta” passou a ser botão secundário visível no login | link abaixo do formulário → botão destacado | Implementado; reteste de T1 com usuário pendente |
| U-02 | U (P1) | Início → orçamento (T5) | P1 não encontrou o orçamento; concluiu com ajuda em 2 min; severidade 3 | Atalho no resumo da home e aba dedicada “Orçamento” | acesso difícil → resumo, aba e atalhos existentes | Implementado; confirmar descoberta e concluir T5 sem ajuda em reteste |
| U-03 | U (P1), H3 | Detalhes → exclusão (T6 no roteiro inicial) | P1 não encontrou exclusão na versão testada; a tarefa foi retirada da sessão | Adicionar exclusão com confirmação (ver I-02) | indisponível na versão testada → disponível no código atual | Implementado e teste automatizado registrado; reteste com usuário pendente |
| U-04 | U (P2) | Nova movimentação (T2/T6) | Não estava claro quais campos eram obrigatórios; P2 percebeu falta de categoria depois de usar foto/localização e não sabia que foto era opcional; severidade 2 | Rótulos agora identificam valor, descrição e categoria como obrigatórios; comprovante e local informam que são opcionais | formulário sem indicação explícita → indicação textual no formulário | Implementado; conferir leitura e compreensão em reteste de T2/T6 |
| U-05 | U (P2) | Editar orçamento (T5) | Teclado cobriu Salvar e só fechou quando P2 tocou fora do campo; concluiu com ajuda em cerca de 40 s; severidade 3 | Tela agora ajusta-se ao teclado e mantém os campos e Salvar em área rolável; arrastar a tela fecha o teclado | botão vulnerável ao teclado → ajuste e rolagem da tela | Implementado; validar em aparelho e retestar T5 com usuário |

## Ciclo de iteração

```text
observar → registrar evidência → classificar e priorizar → decidir → implementar → validar → retestar
```

Uma mudança automatizada ou inspecionada não deve ser descrita como validada por usuário sem sessão de reteste correspondente. Quando a decisão for não corrigir, registrar justificativa e impacto.

## Inventário de telas registrado na AV2

Login, Cadastro, Redefinir senha, Nome de exibição, Início, Extrato, Nova movimentação, Perfil, Orçamento, Editar orçamento, Detalhes da movimentação e Categoria da movimentação.

## Navegação

Stack raiz para autenticação, detalhes e orçamento; abas para Início, Extrato, Nova movimentação e Perfil; redirecionamento conforme a sessão.
