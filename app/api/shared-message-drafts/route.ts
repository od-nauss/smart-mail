
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const TABLE = 'shared_message_drafts';
let pool: Pool | null = null;

function getDatabaseUrl() {
  return process.env.DATABASE_URL || null;
}

function getPool() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error('MISSING_DATABASE_URL');
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }

  return pool;
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

async function getLatestTwo() {
  const db = getPool();
  const result = await db.query<SharedRecordRow>(
    `select id, department, subject, html, plain_text, created_at, week_label, start_date, label, snapshot
     from ${TABLE}
     order by created_at desc
     limit 2`
  );
  return result.rows.map(mapRow);
}

async function cleanupToLastTwo() {
  const db = getPool();
  const result = await db.query<{ id: string }>(
    `select id from ${TABLE} order by created_at desc offset 2`
  );
  if (!result.rows.length) return;

  const ids = result.rows.map((row) => row.id);
  await db.query(`delete from ${TABLE} where id = any($1::text[])`, [ids]);
}

export async function GET() {
  try {
    const records = await getLatestTwo();
    return NextResponse.json({ records });
  } catch (error) {
    const message = error instanceof Error && error.message === 'MISSING_DATABASE_URL'
      ? 'مطلوب ضبط DATABASE_URL أولًا لتفعيل آخر معاملتين مشتركتين.'
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

    const db = getPool();
    await db.query(
      `insert into ${TABLE} (
        id, department, subject, html, plain_text, created_at, week_label, start_date, label, snapshot
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        String(record.id),
        String(record.department),
        String(record.subject),
        String(record.html),
        String(record.plainText || ''),
        String(record.createdAt || new Date().toISOString()),
        String(record.weekLabel || ''),
        String(record.startDate || ''),
        String(record.label || ''),
        JSON.stringify(record.snapshot ?? null),
      ]
    );

    await cleanupToLastTwo();
    const records = await getLatestTwo();
    return NextResponse.json({ records });
  } catch (error) {
    const message = error instanceof Error && error.message === 'MISSING_DATABASE_URL'
      ? 'مطلوب ضبط DATABASE_URL أولًا لتفعيل آخر معاملتين مشتركتين.'
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

    const db = getPool();
    await db.query(`delete from ${TABLE} where id = $1`, [id]);
    const records = await getLatestTwo();
    return NextResponse.json({ records });
  } catch (error) {
    const message = error instanceof Error && error.message === 'MISSING_DATABASE_URL'
      ? 'مطلوب ضبط DATABASE_URL أولًا لتفعيل آخر معاملتين مشتركتين.'
      : 'تعذر حذف المعاملة.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
