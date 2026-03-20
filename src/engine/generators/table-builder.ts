export function createSimpleKeyValueTable(rows: { label: string; value: string }[]) {
  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      ${rows.map((row) => `<tr><td style="width:35%;padding:10px;border:1px solid #d1d5db;background:#f8fafc;"><strong>${row.label}</strong></td><td style="padding:10px;border:1px solid #d1d5db;">${row.value}</td></tr>`).join('')}
    </table>
  `;
}
