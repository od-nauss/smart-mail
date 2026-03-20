import type { OutlookSendPayload } from '@/core/types';

export async function sendViaOutlook(payload: OutlookSendPayload) {
  return { ok: false, payload, message: 'الإرسال المباشر غير مفعل بعد.' };
}
