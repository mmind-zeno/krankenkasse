export function formatChf(value, { minimumFractionDigits = 1, maximumFractionDigits = 1 } = {}) {
  if (value == null || Number.isNaN(value)) return '–';
  const formatter = new Intl.NumberFormat('de-CH', {
    style: 'decimal',
    minimumFractionDigits,
    maximumFractionDigits,
  });
  return formatter.format(value);
}

