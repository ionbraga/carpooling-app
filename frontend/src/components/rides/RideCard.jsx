import { Link } from 'react-router-dom';
import { formatCurrency, formatDateTime, getInitials } from '../../utils/formatters';
import { Button } from '../common/Button';

export function RideCard({ ride, isAuthenticated, isOwnRide, canBook, onBook }) {
  return (
    <article className={`card ride-card ${isOwnRide ? 'ride-card--own' : ''}`}>
      <div className="ride-card__top">
        <div className="ride-route">
          <span className="ride-route__city">{ride.origin}</span>
          <span className="ride-route__arrow">→</span>
          <span className="ride-route__city">{ride.destination}</span>
        </div>

        <div className="ride-card__badges">
          {isOwnRide ? (
            <span className="status-pill status-pill--info">
              Cursa mea
            </span>
          ) : null}

          <span
            className={`status-pill ${
              Number(ride.available_seats) > 0
                ? 'status-pill--success'
                : 'status-pill--warning'
            }`}
          >
            {Number(ride.available_seats) > 0
              ? `${ride.available_seats} locuri libere`
              : 'Fără locuri disponibile'}
          </span>
        </div>
      </div>

      <div className="ride-card__meta grid grid--3">
        <div>
          <span className="meta-label">Plecare</span>
          <strong>{formatDateTime(ride.departure_time)}</strong>
        </div>

        <div>
          <span className="meta-label">Preț / loc</span>
          <strong>{formatCurrency(ride.price)}</strong>
        </div>

        <div>
          <span className="meta-label">Șofer</span>
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
        <Link
          className="btn btn--ghost btn--md"
          to={`/reviews/${ride.driver_id}`}
          state={{ userName: ride.driver_name }}
        >
          Vezi review-uri șofer
        </Link>

        {isOwnRide ? (
          <Link className="btn btn--primary btn--md" to="/rides/my">
            Gestionează cursa
          </Link>
        ) : Number(ride.available_seats) <= 0 ? (
          <Button disabled>
            Cursă ocupată
          </Button>
        ) : isAuthenticated ? (
          <Button onClick={() => onBook(ride)}>
            Rezervă loc
          </Button>
        ) : (
          <Link className="btn btn--primary btn--md" to="/login">
            Autentifică-te pentru rezervare
          </Link>
        )}
      </div>
    </article>
  );
}