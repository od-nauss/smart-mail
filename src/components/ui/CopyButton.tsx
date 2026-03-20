'use client';

import { copyToClipboard } from '@/core/utils';
import { useToast } from '@/contexts/ToastContext';
import Button from './Button';

export default function CopyButton({ text }: { text: string }) {
  const toast = useToast();
  return <Button variant="secondary" onClick={async () => { await copyToClipboard(text); toast.success('تم نسخ المحتوى'); }}>نسخ</Button>;
}
