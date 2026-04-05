import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../api/bookingService';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { useNotification } from '../hooks/useNotification';
import { formatCurrency, formatDateTime, getInitials } from '../utils/formatters';

export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        const response = await bookingService.getMine();
        setBookings(response.data);
      } catch (error) {
        notify(error.message, 'error');
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [notify]);

  const stats = useMemo(() => {
    const totalSeats = bookings.reduce((acc, booking) => acc + Number(booking.seats_booked || 0), 0);
    const totalBudget = bookings.reduce(
      (acc, booking) => acc + Number(booking.price || 0) * Number(booking.seats_booked || 0),
      0
    );

    return {
      count: bookings.length,
      totalSeats,
      totalBudget,
    };
  }, [bookings]);

  return (
    <div className="stack stack--lg">
      <PageHeader
        eyebrow="Rezervările mele"
        title="Gestionează locurile rezervate"
        description="Vezi cursele rezervate, șoferii asociați și costul estimat al călătoriilor tale."
      />

      <div className="stats-grid stats-grid--compact">
        <StatCard label="Rezervări totale" value={stats.count} />
        <StatCard label="Locuri rezervate" value={stats.totalSeats} accent="teal" />
        <StatCard label="Cost estimat" value={formatCurrency(stats.totalBudget)} accent="purple" />
      </div>

      {loading ? (
        <Loader label="Se încarcă rezervările..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="Nu ai rezervări încă"
          description="Explorează cursele disponibile și rezervă direct din pagina de curse."
          action={
            <Link className="btn btn--primary btn--md" to="/rides">
              Vezi cursele
            </Link>
          }
        />
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article key={booking.id} className="card booking-card">
              <div className="ride-card__top">
                <div className="ride-route">
                  <span className="ride-route__city">{booking.origin}</span>
                  <span className="ride-route__arrow">→</span>
                  <span className="ride-route__city">{booking.destination}</span>
                </div>
                <span className="status-pill status-pill--success">{booking.status}</span>
              </div>

              <div className="grid grid--3 booking-card__meta">
                <div>
                  <span className="meta-label">Plecare</span>
                  <strong>{formatDateTime(booking.departure_time)}</strong>
                </div>
                <div>
                  <span className="meta-label">Locuri rezervate</span>
                  <strong>{booking.seats_booked}</strong>
                </div>
                <div>
                  <span className="meta-label">Cost estimat</span>
                  <strong>{formatCurrency(Number(booking.price) * Number(booking.seats_booked))}</strong>
                </div>
              </div>

              <div className="booking-card__footer">
                <div className="driver-mini">
                  <span className="driver-mini__avatar">{getInitials(booking.driver_name)}</span>
                  <div>
                    <strong>{booking.driver_name}</strong>
                    <small>{booking.driver_email}</small>
                  </div>
                </div>

                <Link className="btn btn--ghost btn--md" to={`/reviews/${booking.driver_id}`}>
                  Vezi / adaugă review
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}