import { Link } from 'react-router-dom';
import { formatCurrency, formatDateTime, getInitials } from '../../utils/formatters';
import { Button } from '../common/Button';

export function RideCard({ ride, isAuthenticated, canBook, onBook }) {
  return (
    <article className="card ride-card">
      <div className="ride-card__top">
        <div className="ride-route">
          <span className="ride-route__city">{ride.origin}</span>
          <span className="ride-route__arrow">→</span>
          <span className="ride-route__city">{ride.destination}</span>
        </div>
        <span className={`status-pill ${Number(ride.available_seats) > 0 ? 'status-pill--success' : 'status-pill--warning'}`}>
          {Number(ride.available_seats) > 0 ? `${ride.available_seats} locuri libere` : 'Fara locuri disponibile'}
        </span>
      </div>

      <div className="ride-card__meta grid grid--3">
        <div>
          <span className="meta-label">Plecare</span>
          <strong>{formatDateTime(ride.departure_time)}</strong>
        </div>
        <div>
          <span className="meta-label">Pret / loc</span>
          <strong>{formatCurrency(ride.price)}</strong>
        </div>
        <div>
          <span className="meta-label">Sofer</span>
          <div className="driver-mini">
            <span className="driver-mini__avatar">{getInitials(ride.driver_name)}</span>
            <div>
              <strong>{ride.driver_name}</strong>
              <small>{ride.driver_email}</small>
            </div>
          </div>
        </div>
      </div>

      <div className="ride-card__actions">
        <Link className="btn btn--ghost btn--md" to={`/reviews/${ride.driver_id}`}>
          Vezi review-uri sofer
        </Link>
        {isAuthenticated ? (
          <Button onClick={() => onBook(ride)} disabled={!canBook}>
            {canBook ? 'Rezerva loc' : 'Nu poti rezerva'}
          </Button>
        ) : (
          <Link className="btn btn--primary btn--md" to="/login">
            Autentifica-te pentru rezervare
          </Link>
        )}
      </div>
    </article>
  );
}
