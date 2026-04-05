import { formatDateTime, getInitials } from '../../utils/formatters';

export function ReviewList({ reviews }) {
  return (
    <div className="review-list">
      {reviews.map((review) => (
        <article key={review.id} className="card review-card">
          <div className="review-card__header">
            <div className="driver-mini">
              <span className="driver-mini__avatar">{getInitials(review.reviewer_name)}</span>
              <div>
                <strong>{review.reviewer_name}</strong>
                <small>{review.reviewer_email}</small>
              </div>
            </div>
            <div className="review-card__rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
          </div>
          <p className="review-card__comment">{review.comment || 'Utilizatorul nu a lasat comentariu text.'}</p>
          <span className="meta-label">Publicat: {formatDateTime(review.created_at)}</span>
        </article>
      ))}
    </div>
  );
}
