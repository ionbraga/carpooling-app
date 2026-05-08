export function formatDateTime(value) {
  if (!value) return '—';

  const normalizedValue = String(value)
    .trim()
    .replace(' ', 'T')
    .replace(/Z$/, '');

  const match = normalizedValue.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
  );

  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const hour = match[4];
    const minute = match[5];

    const formattedDate = new Intl.DateTimeFormat('ro-RO', {
      dateStyle: 'medium',
    }).format(new Date(year, month - 1, day));

    return `${formattedDate}, ${hour}:${minute}`;
  }

  return new Intl.DateTimeFormat('ro-RO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatCurrency(value) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return '—';
  }

  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'MDL',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((item) => item[0]?.toUpperCase() ?? '').join('') || 'RT';
}
