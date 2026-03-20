'use client';

import { createHtmlDocument } from '@/engine/generators/base-generator';

export default function EmailPreview({ html }: { html: string }) {
  const srcDoc = createHtmlDocument(html);
  return <iframe title="معاينة البريد" className="h-[520px] w-full rounded-2xl border border-slate-200 bg-white" srcDoc={srcDoc} />;
}
