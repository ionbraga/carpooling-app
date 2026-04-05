export function StatCard({ label, value, accent = 'default' }) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">{value}</strong>
    </div>
  );
}
