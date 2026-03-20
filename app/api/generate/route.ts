import { NextResponse } from 'next/server';
import { getTemplateById } from '@/lib/templates';
import { DEFAULT_SIGNATURE } from '@/lib/constants';
import { replaceTableTokens } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { templateId, data } = await request.json();
    const template = getTemplateById(templateId);

    if (!template) {
      return NextResponse.json({ error: 'القالب غير موجود' }, { status: 404 });
    }

    const subject = replaceTableTokens(template.generateSubject(data), data);
    const body = replaceTableTokens(template.generateBody(data), data);

    return NextResponse.json({
      subject,
      body,
      signature: DEFAULT_SIGNATURE,
      fullText: `الموضوع: ${subject}\n\n${body}\n\n${DEFAULT_SIGNATURE}`,
    });
  } catch {
    return NextResponse.json({ error: 'تعذر توليد الرسالة' }, { status: 500 });
  }
}
