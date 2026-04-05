export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state card">
      <div className="empty-state__icon">✦</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
