export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="page-header">
      {eyebrow ? <span className="page-header__eyebrow">{eyebrow}</span> : null}
      <div className="page-header__content">
        <div>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {children ? <div className="page-header__actions">{children}</div> : null}
      </div>
    </div>
  );
}
