import { useLocalSearchParams, useRouter } from 'expo-router';
import { confirmAction } from '../../src/services/confirm';
import { noticeStore } from '../../src/services/noticeStore';
import { transactionStore } from '../../src/services/transactionStore';
import { useTransaction } from '../../src/hooks/useTransactions';
import TransactionDetailScreen from '../../src/screens/transaction-detail/TransactionDetailScreen';

export default function TransactionDetailRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId?.slice(0, 80) ?? '';
  const { transaction, ready } = useTransaction(id);

  return (
    <TransactionDetailScreen
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/extrato'))}
      onDelete={async () => {
        const ok = await confirmAction('Excluir movimentação?', 'Esta ação não pode ser desfeita.', 'Excluir');
        if (!ok) return;
        try {
          await transactionStore.remove(id);
          noticeStore.show('Movimentação excluída.');
          if (router.canGoBack()) router.back();
          else router.replace('/extrato');
        } catch {
          noticeStore.show('Não foi possível excluir. Tente novamente.', 'error');
        }
      }}
      onChangeCategory={() => router.push({ pathname: '/transaction/[id]/category', params: { id } })}
      ready={ready}
      transaction={transaction}
    />
  );
}
