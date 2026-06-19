const csvEscapePattern = /[",\n\r]/;

function escapeCsvValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = value instanceof Date ? value.toISOString() : String(value);

  if (!csvEscapePattern.test(stringValue)) {
    return stringValue;
  }

  return `"${stringValue.replaceAll('"', '""')}"`;
}

export function toCsv<T extends Record<string, unknown>>(rows: T[], columns: Array<keyof T>) {
  const header = columns.map((column) => escapeCsvValue(String(column))).join(",");
  const body = rows.map((row) => columns.map((column) => escapeCsvValue(row[column])).join(","));

  return [header, ...body].join("\n");
}
