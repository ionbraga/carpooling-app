import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../api/bookingService';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { useNotification } from '../hooks/useNotification';
import { formatCurrency, formatDateTime, getInitials } from '../utils/formatters';

function getBookingStatusLabel(booking) {
  if (booking.status === 'cancelled') {
    return 'Anulată';
  }

  if (booking.ride_status === 'cancelled') {
    return 'Cursă anulată';
  }

  if (new Date(booking.departure_time) <= new Date()) {
    return 'Finalizată';
  }

  return 'Confirmată';
}

function getBookingStatusClass(booking) {
  if (
    booking.status === 'confirmed' &&
    booking.ride_status === 'active' &&
    new Date(booking.departure_time) > new Date()
  ) {
    return 'status-pill status-pill--success';
  }

  return 'status-pill status-pill--warning';
}

function canCancelBooking(booking) {
  return (
    booking.status === 'confirmed' &&
    booking.ride_status === 'active' &&
    new Date(booking.departure_time) > new Date()
  );
}

export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const { notify } = useNotification();

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMine();
      setBookings(response.data);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const stats = useMemo(() => {
    const activeBookings = bookings.filter(
      (booking) =>
        booking.status === 'confirmed' &&
        booking.ride_status === 'active' &&
        new Date(booking.departure_time) > new Date()
    );

    const totalSeats = activeBookings.reduce(
      (acc, booking) => acc + Number(booking.seats_booked || 0),
      0
    );

    const totalBudget = activeBookings.reduce(
      (acc, booking) => acc + Number(booking.price || 0) * Number(booking.seats_booked || 0),
      0
    );

    return {
      count: activeBookings.length,
      totalSeats,
      totalBudget,
    };
  }, [bookings]);

  const handleCancelBooking = async (booking) => {
    const confirmed = window.confirm(
      `Sigur vrei să anulezi rezervarea pentru cursa ${booking.origin} → ${booking.destination}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoadingId(booking.id);
      await bookingService.cancel(booking.id);
      notify('Rezervarea a fost anulată cu succes.', 'success');
      await loadBookings();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="my-bookings-page stack stack--lg">
      <PageHeader
        eyebrow="Rezervările mele"
        title="Gestionează locurile rezervate"
        description="Vezi cursele rezervate, șoferii asociați și costul estimat al călătoriilor tale."
      />

      <div className="stats-grid stats-grid--compact">
        <StatCard label="Rezervări active" value={stats.count} />
        <StatCard label="Locuri active" value={stats.totalSeats} accent="teal" />
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

                <span className={getBookingStatusClass(booking)}>
                  {getBookingStatusLabel(booking)}
                </span>
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

                <div className="booking-card__actions">
                  {canCancelBooking(booking) ? (
                    <Button
                      variant="ghost"
                      size="md"
                      loading={actionLoadingId === booking.id}
                      onClick={() => handleCancelBooking(booking)}
                    >
                      Anulează rezervarea
                    </Button>
                  ) : null}

                  <Link className="btn btn--ghost btn--md" to={`/reviews/${booking.driver_id}`}>
                    Vezi / adaugă review
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}