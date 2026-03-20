'use client';

import { Button } from '@/components/ui/Button';
import { GeneratedMessage } from '@/lib/types';
import { useClipboard } from '@/hooks/useClipboard';
import { useToast } from '@/hooks/useToast';

interface Props {
  message: GeneratedMessage;
  onEdit: () => void;
  onNew: () => void;
}

export function MessagePreview({ message, onEdit, onNew }: Props) {
  const { copy } = useClipboard();
  const toast = useToast();

  const handleCopy = async () => {
    await copy(message.fullText);
    toast.success('تم نسخ الرسالة');
  };

  return (
    <div className="space-y-5">
      <div className="message-preview rounded-3xl p-5 sm:p-6">
        <div className="mb-5 border-b border-naif-gold/30 pb-4">
          <p className="mb-1 text-sm text-gray-500">الموضوع</p>
          <h3 className="text-lg font-bold text-naif-primary">{message.subject}</h3>
        </div>

        <div className="arabic-text whitespace-pre-wrap text-sm leading-8 text-gray-800">
          {message.body}
          {'\n\n'}
          {message.signature}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onEdit}>
          تعديل
        </Button>
        <Button variant="secondary" onClick={onNew}>
          رسالة جديدة
        </Button>
        <Button onClick={handleCopy}>
          نسخ الرسالة
        </Button>
      </div>
    </div>
  );
}
