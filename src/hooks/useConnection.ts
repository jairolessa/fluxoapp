import * as Network from 'expo-network';

export type ConnectionInfo = {
  online: boolean;
  label: string;
};

const TYPE_LABEL: Partial<Record<Network.NetworkStateType, string>> = {
  [Network.NetworkStateType.WIFI]: 'Wi-Fi',
  [Network.NetworkStateType.CELLULAR]: 'Dados móveis',
  [Network.NetworkStateType.ETHERNET]: 'Cabo de rede',
  [Network.NetworkStateType.VPN]: 'VPN',
};

/** Live connection status from the device (Wi-Fi, mobile data or offline). */
export function useConnection(): ConnectionInfo {
  const state = Network.useNetworkState();
  const online = Boolean(state.isConnected) && state.isInternetReachable !== false;
  if (!online) return { online: false, label: 'Sem conexão' };
  return { online: true, label: (state.type && TYPE_LABEL[state.type]) ?? 'Conectado' };
}
