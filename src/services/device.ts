import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { TransactionLocation } from '../domain/finance';

const RECEIPT_QUALITY = 0.6;

/** Thrown when the user denies a permission, so screens can show a friendly message. */
export class DevicePermissionError extends Error {}

type ReceiptSource = 'camera' | 'library';

/** Returns the local URI of the chosen receipt photo, or null when the user cancels. */
export async function pickReceipt(source: ReceiptSource): Promise<string | null> {
  const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: RECEIPT_QUALITY };

  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      throw new DevicePermissionError('Permita o acesso à câmera nas configurações do aparelho para fotografar comprovantes.');
    }
  }

  const result =
    source === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
  return result.canceled ? null : (result.assets[0]?.uri ?? null);
}

function describePlace(address: Location.LocationGeocodedAddress | undefined): string | undefined {
  if (!address) return undefined;
  const street = [address.street, address.streetNumber].filter(Boolean).join(', ');
  const area = address.district ?? address.subregion ?? address.city;
  return [street, area].filter(Boolean).join(' · ') || undefined;
}

/** Reads the current GPS position and, when possible, a readable place name. */
export async function getCurrentPlace(): Promise<TransactionLocation> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new DevicePermissionError('Permita o acesso à localização para registrar onde a movimentação aconteceu.');
  }

  const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const place: TransactionLocation = { latitude: coords.latitude, longitude: coords.longitude };

  try {
    const [address] = await Location.reverseGeocodeAsync(place);
    place.label = describePlace(address);
  } catch {
    // Reverse geocoding needs a network round trip; the coordinates alone are still a valid location.
  }
  return place;
}

export function mapsUrl({ latitude, longitude }: Pick<TransactionLocation, 'latitude' | 'longitude'>): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}
