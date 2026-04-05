export function formatDateTime(value) {
  if (!value) return '—';

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
