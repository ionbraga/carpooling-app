export function ReviewSummary({ totalReviews, averageRating }) {
  return (
    <div className="review-summary card">
      <div>
        <span className="meta-label">Scor mediu</span>
        <strong className="review-summary__value">{averageRating ? averageRating.toFixed(1) : '—'}</strong>
      </div>
      <div>
        <span className="meta-label">Numar review-uri</span>
        <strong className="review-summary__value">{totalReviews}</strong>
      </div>
      <div>
        <span className="meta-label">Interpretare</span>
        <strong className="review-summary__value">{averageRating >= 4.5 ? 'Excelent' : averageRating >= 3 ? 'Bun' : totalReviews ? 'Moderat' : 'Fara date'}</strong>
      </div>
    </div>
  );
}
