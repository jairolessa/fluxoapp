import { useRouter } from 'expo-router';
import NewTransactionScreen from '../../src/screens/new-transaction/NewTransactionScreen';
import { noticeStore } from '../../src/services/noticeStore';
import { transactionStore } from '../../src/services/transactionStore';

export default function NewTransactionRoute() {
  const router = useRouter();

  return (
    <NewTransactionScreen
      onSave={async (input) => {
        await transactionStore.add(input);
        noticeStore.show('Movimentação salva no extrato.');
        router.navigate('/extrato');
      }}
    />
  );
}
