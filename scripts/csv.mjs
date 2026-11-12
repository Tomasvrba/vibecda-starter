export function parseCSV(text) {
  text = text.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], field = '', quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') { quoted = false; closed = true; }
      else field += char;
    } else if (char === '"') {
      if (field || closed) throw new Error('Invalid CSV quoting');
      quoted = true;
    } else if (char === ',') {
      row.push(field); field = ''; closed = false;
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field); if (row.some(value => value !== '')) rows.push(row);
      row = []; field = ''; closed = false;
    } else {
      if (closed) throw new Error('Unexpected text after closing CSV quote');
      field += char;
    }
  }
  if (quoted) throw new Error('Unclosed CSV quote');
  if (field || row.length || closed) { row.push(field); rows.push(row); }
  if (!rows.length) throw new Error('CSV needs a header');
  const headers = rows.shift();
  if (new Set(headers).size !== headers.length || headers.some(h => !h)) throw new Error('CSV headers must be unique and nonempty');
  return rows.map((values, index) => {
    if (values.length !== headers.length) throw new Error(`CSV row ${index + 2}: wrong field count`);
    return Object.fromEntries(headers.map((key, i) => [key, values[i]]));
  });
}

export function writeCSV(headers, rows) {
  const quote = value => {
    let text = String(value ?? '');
    // Keep text cells from becoming spreadsheet formulas on opening the CSV.
    if (/^[=+@\-\t\r]/.test(text)) text = `'${text}`;
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return [headers, ...rows.map(row => headers.map(h => row[h]))].map(row => row.map(quote).join(',')).join('\n') + '\n';
}
