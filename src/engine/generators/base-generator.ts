export function createHtmlDocument(html: string) {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><style>body{font-family:Cairo,sans-serif;line-height:1.9;color:#111827}table{width:100%;border-collapse:collapse}th,td{text-align:right}</style></head><body>${html}</body></html>`;
}
