import { useRouter } from 'expo-router';
import NewTransactionScreen from '../../src/screens/new-transaction/NewTransactionScreen';
import { transactionStore } from '../../src/services/transactionStore';

export default function NewTransactionRoute() {
  const router = useRouter();

  return (
    <NewTransactionScreen
      onSave={async (input) => {
        await transactionStore.add(input);
        router.navigate('/extrato');
      }}
    />
  );
}
