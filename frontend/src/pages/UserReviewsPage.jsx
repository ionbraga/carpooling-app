import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { reviewService } from '../api/reviewService';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { PageHeader } from '../components/common/PageHeader';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { ReviewList } from '../components/reviews/ReviewList';
import { ReviewSummary } from '../components/reviews/ReviewSummary';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

export function UserReviewsPage() {
  const { userId } = useParams();
  const location = useLocation();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useAuth();
  const { notify } = useNotification();

  const userName = location.state?.userName;

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getByUser(userId);
      setReviews(response.data);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [userId]);

  const summary = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? reviews.reduce((acc, item) => acc + Number(item.rating), 0) / totalReviews
      : 0;

    return { totalReviews, averageRating };
  }, [reviews]);

  const canReview =
  isAuthenticated &&
  Number(user?.id) !== Number(userId) &&
  location.state?.canReview === true;

  return (
    <div className="reviews-page stack stack--lg">
      <PageHeader
        eyebrow="Evaluări utilizator"
        title={userName ? `Review-uri pentru ${userName}` : `Review-uri pentru utilizatorul #${userId}`}
        description="Vezi istoricul evaluărilor și oferă feedback după o experiență reală de călătorie."
      />

      {loading ? (
        <Loader label="Se încarcă review-urile..." />
      ) : (
        <div className="reviews-page__content">
          <div className="reviews-page__summary">
            <ReviewSummary
              totalReviews={summary.totalReviews}
              averageRating={summary.averageRating}
            />
          </div>

          {canReview ? (
            <div className="reviews-page__form">
              <ReviewForm userId={userId} onCreated={loadReviews} />
            </div>
          ) : null}

          <div className="reviews-page__list">
            {reviews.length === 0 ? (
              <EmptyState
                title="Nu există review-uri pentru acest utilizator"
                description="Fii primul care oferă feedback și contribuie la o comunitate mai sigură."
              />
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}