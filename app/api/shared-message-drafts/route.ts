
import { NextRequest, NextResponse } from 'next/server';

const TABLE = 'shared_message_drafts';

function getConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return null;
  }
  return { url, serviceRoleKey };
}

type SharedRecordRow = {
  id: string;
  department: string;
  subject: string;
  html: string;
  plain_text: string;
  created_at: string;
  week_label: string;
  start_date: string;
  label: string;
  snapshot: unknown;
};

function mapRow(row: SharedRecordRow) {
  return {
    id: row.id,
    department: row.department,
    subject: row.subject,
    html: row.html,
    plainText: row.plain_text,
    createdAt: row.created_at,
    weekLabel: row.week_label,
    startDate: row.start_date,
    label: row.label,
    snapshot: row.snapshot,
  };
}

async function supabaseRequest(path: string, init?: RequestInit) {
  const config = getConfig();
  if (!config) {
    throw new Error('MISSING_SUPABASE_CONFIG');
  }

  const response = await fetch(`${config.url}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  return response;
}

async function getLatestTwo() {
  const response = await supabaseRequest(`/${TABLE}?select=id,department,subject,html,plain_text,created_at,week_label,start_date,label,snapshot&order=created_at.desc&limit=2`);
  if (!response.ok) {
    throw new Error('LOAD_FAILED');
  }
  const rows = (await response.json()) as SharedRecordRow[];
  return rows.map(mapRow);
}

async function cleanupToLastTwo() {
  const response = await supabaseRequest(`/${TABLE}?select=id&order=created_at.desc`);
  if (!response.ok) {
    throw new Error('CLEANUP_LIST_FAILED');
  }
  const rows = (await response.json()) as Array<{ id: string }>;
  const extraIds = rows.slice(2).map((item) => item.id).filter(Boolean);
  if (!extraIds.length) return;

  const filter = extraIds.map((id) => `"${id.replaceAll('"', '')}"`).join(',');
  const deleteResponse = await supabaseRequest(`/${TABLE}?id=in.(${filter})`, {
    method: 'DELETE',
  });
  if (!deleteResponse.ok) {
    throw new Error('CLEANUP_DELETE_FAILED');
  }
}

export async function GET() {
  try {
    const records = await getLatestTwo();
    return NextResponse.json({ records });
  } catch (error) {
    const message = error instanceof Error && error.message === 'MISSING_SUPABASE_CONFIG'
      ? 'مطلوب ربط Supabase أولًا لتفعيل آخر معاملتين مشتركتين.'
      : 'تعذر تحميل آخر معاملتين مشتركتين.';
    return NextResponse.json({ error: message, records: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const record = body?.record;
    if (!record?.id || !record?.department || !record?.subject || !record?.html) {
      return NextResponse.json({ error: 'بيانات المعاملة غير مكتملة.' }, { status: 400 });
    }

    const payload = {
      id: String(record.id),
      department: String(record.department),
      subject: String(record.subject),
      html: String(record.html),
      plain_text: String(record.plainText || ''),
      created_at: String(record.createdAt || new Date().toISOString()),
      week_label: String(record.weekLabel || ''),
      start_date: String(record.startDate || ''),
      label: String(record.label || ''),
      snapshot: record.snapshot ?? null,
    };

    const saveResponse = await supabaseRequest(`/${TABLE}`, {
      method: 'POST',
      headers: {
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!saveResponse.ok) {
      return NextResponse.json({ error: 'تعذر حفظ المعاملة المشتركة.' }, { status: 500 });
    }

    await cleanupToLastTwo();
    const records = await getLatestTwo();
    return NextResponse.json({ records });
  } catch (error) {
    const message = error instanceof Error && error.message === 'MISSING_SUPABASE_CONFIG'
      ? 'مطلوب ربط Supabase أولًا لتفعيل آخر معاملتين مشتركتين.'
      : 'تعذر حفظ المعاملة المشتركة.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'معرف المعاملة مفقود.' }, { status: 400 });
    }

    const deleteResponse = await supabaseRequest(`/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!deleteResponse.ok) {
      return NextResponse.json({ error: 'تعذر حذف المعاملة.' }, { status: 500 });
    }

    const records = await getLatestTwo();
    return NextResponse.json({ records });
  } catch (error) {
    const message = error instanceof Error && error.message === 'MISSING_SUPABASE_CONFIG'
      ? 'مطلوب ربط Supabase أولًا لتفعيل آخر معاملتين مشتركتين.'
      : 'تعذر حذف المعاملة.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
