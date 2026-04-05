export function SectionCard({ title, description, children }) {
  return (
    <section className="card section-card">
      {(title || description) && (
        <div className="section-card__header">
          {title ? <h2>{title}</h2> : null}
          {description ? <p>{description}</p> : null}
        </div>
      )}
      {children}
    </section>
  );
}
