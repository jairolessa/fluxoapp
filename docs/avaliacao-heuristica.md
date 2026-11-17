# Avaliação heurística do Fluxo (Nielsen)

**Método da avaliação heurística:** inspeção do código das 12 telas por um avaliador (o autor, com apoio de IA) e execução automatizada de 15 passos no build web (Playwright, 390×844). Esta tabela é uma avaliação individual, não uma avaliação heurística cruzada e **não é teste com usuários**.

**Evidência complementar da AV2:** o material apresentado registra testes interativos das telas em aparelho real e duas sessões Think Aloud (P1 em 22/10/2026 e P2 em 23/10/2026). Os resultados dessas sessões estão em [teste-usabilidade.md](teste-usabilidade.md), e os achados e estados de correção estão em [matriz-iteracao.md](matriz-iteracao.md). As sessões não alteram a autoria nem o método desta avaliação heurística. Vídeos, áudios ou capturas das sessões não acompanharam a documentação recebida.

**Severidade:** 0 nenhum; 1 cosmético; 2 menor; 3 grave (atrapalha tarefa importante); 4 crítico (bloqueia).

## Achados

| # | Heurística | Evidência | Problema (sev. antes) | Correção | Sev. agora |
|---|---|---|---|---|---:|
| 1 | Visibilidade do estado | Salvar lançamento/orçamento e erros usavam `Alert`; na web `Alert` não faz nada | Usuário não sabia se salvou ou falhou (3) | `NoticeHost`: aviso ✓/✕ no topo, anunciado ao leitor de tela; botões com spinner e "Salvando…" | 0 |
| 2 | Mundo real | Valores em R$, datas pt-BR, categorias do cotidiano | — | Mantido | 0 |
| 3 | Controle e liberdade | Não havia como remover lançamento errado | Erro de digitação ficava para sempre (3) | "Excluir movimentação" com confirmação; cancelar mantém a tela; voltar tem rota de reserva | 0 |
| 4 | Consistência | Login e cadastro tinham botão próprio, diferente do restante; checkbox `#16A34A` | Aparência e estados diferentes (2) | `PrimaryButton` compartilhado; checkbox `#166534` | 1 (campos de login/cadastro ainda com paleta local) |
| 5 | Prevenção de erros | Salvar habilitado sem validar; duplo toque possível | Lançamento duplicado (2) | Botão desabilitado até válido; `loading` bloqueia toque repetido; limite zero impedido; Excluir e Sair pedem confirmação | 0 |
| 6 | Reconhecimento | Campos com rótulo visível; placeholder só exemplo | Placeholder `#64748B` com 3,07:1 (2) | Token `placeholderOnDark` com 5,71:1; abas com ícone e texto | 0 |
| 7 | Flexibilidade e eficiência | Busca sem acento, filtros por tipo, atalhos Início→Orçamento e Perfil→Orçamento | Usuário não achava onde editar orçamento (3, relato do autor) | Atalhos no Início e Perfil; tela de edição por categoria | 1 (sem atalhos avançados/gestos); achado de P1 para localizar orçamento permanece em reteste (U-02) |
| 8 | Estética minimalista | Cartões, hierarquia de títulos, um destaque por tela | Não validado em telas pequenas/grandes | — | 1 (pendente em aparelho) |
| 9 | Diagnóstico de erros | Yup mostra erro sob o campo; falhas de operação viravam `Alert` | Erro só por cor e sem região viva (2) | Mensagem com `role=alert`; aviso de erro com ✕ e texto, além da cor | 0 |
| 10 | Ajuda e documentação | Estados vazios explicam o que fazer; sem tela de ajuda | — | — | 1 |

## O que foi verificado e como

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` | sem erros |
| 15 passos automatizados no web build (cadastro, busca, filtro, detalhe, categoria, nova movimentação, aviso, exclusão com confirmação, orçamento, perfil, sessão, login, redefinição) | todos passaram, sem erros de console, conforme registro da AV2 |
| Contraste (script de luminância relativa) | 24 pares, todos ≥ 4,5:1 para texto |
| Alvos de toque | `minHeight: 44` em botões, chips, linhas, links e aviso |

## Pendente (precisa de aparelho ou pessoas)

- Avaliação heurística cruzada por outro aluno e resposta do grupo avaliado (corrigiu ou justificou).
- Leitor de tela (TalkBack/VoiceOver), zoom/ampliação a 200% e simulação de daltonismo.
- Auditoria automática de acessibilidade com relatório antes e depois.
- Teste Think Aloud: há duas sessões documentadas; a AV2 recomenda mais 1 a 3 participantes e retestes dos achados U-01 a U-05 conforme `matriz-iteracao.md`.
- Evidência de gravação/captura das sessões: não acompanhou os documentos recebidos.
- Teste A/B, teste de cinco segundos, card sorting e tree testing para a entrega da AV3.
