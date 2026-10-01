'use server';

import { getAdminToken } from '@/lib/admin-session';
import { changeAdminPin } from '@/lib/neon-api';
import { getCurrentProfile } from '@/lib/current-user';

export type PinState = {
  error?: string;
  success?: string;
};

export async function changePinAction(
  _prev: PinState | null,
  formData: FormData
): Promise<PinState> {
  await getCurrentProfile();

  const token = await getAdminToken();
  if (!token) return { error: 'Sesi admin tidak tersedia.' };

  const currentPin = String(formData.get('current_pin') || '').trim();
  const newPin = String(formData.get('new_pin') || '').trim();
  const confirmPin = String(formData.get('confirm_pin') || '').trim();

  if (!/^\d{6}$/.test(currentPin)) {
    return { error: 'PIN saat ini harus 6 digit.' };
  }

  if (!/^\d{6}$/.test(newPin)) {
    return { error: 'PIN baru harus 6 digit.' };
  }

  if (newPin !== confirmPin) {
    return { error: 'Konfirmasi PIN baru tidak sama.' };
  }

  if (newPin === currentPin) {
    return { error: 'PIN baru harus berbeda dari PIN lama.' };
  }

  try {
    await changeAdminPin(token, currentPin, newPin);
    return { success: 'PIN admin berhasil diperbarui.' };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Gagal memperbarui PIN.',
    };
  }
}
