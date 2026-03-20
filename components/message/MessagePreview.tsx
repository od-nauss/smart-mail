'use client';

import { useState, useCallback } from 'react';
import { GeneratedMessage } from '@/lib/types';
import { Button } from '../ui/Button';
import { showToast } from '../ui/Toast';
import { cn } from '@/lib/utils';

interface MessagePreviewProps {
  message: GeneratedMessage | null;
  onEdit?: () => void;
  onNew?: () => void;
  className?: string;
}

const CopyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch {
      return false;
    }
  }
}

export function MessagePreview({ message, onEdit, onNew, className }: MessagePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!message) return;

    const success = await copyText(message.fullText);

    if (success) {
      setCopied(true);
      showToast('تم نسخ الرسالة', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('تعذر نسخ الرسالة', 'error');
    }
  }, [message]);

  if (!message) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="bg-naif-gray/30 rounded-lg p-3">
        <span className="text-xs text-naif-blueGray block mb-1">الموضوع</span>
        <p className="text-sm font-medium text-naif-primary">{message.subject}</p>
      </div>

      <div className="bg-naif-white border border-naif-gray rounded-lg p-3">
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{message.body}</p>
      </div>

      <div className="text-xs text-naif-blueGray whitespace-pre-line border-t border-naif-gray pt-3">
        {message.signature}
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="gold" size="md" fullWidth onClick={handleCopy} icon={<CopyIcon />}>
          {copied ? 'تم النسخ' : 'نسخ الرسالة'}
        </Button>

        {onEdit && (
          <Button variant="outline" size="md" onClick={onEdit}>
            تعديل
          </Button>
        )}

        {onNew && (
          <Button variant="secondary" size="md" onClick={onNew}>
            جديدة
          </Button>
        )}
      </div>
    </div>
  );
}