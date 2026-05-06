import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { rideService } from '../api/rideService';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { useNotification } from '../hooks/useNotification';
import { formatCurrency, formatDateTime } from '../utils/formatters';

function getRideStatusLabel(ride) {
  if (ride.status === 'cancelled') {
    return 'Anulată';
  }

  if (new Date(ride.departure_time) <= new Date()) {
    return 'Finalizată';
  }

  return 'Activă';
}

function getRideStatusClass(ride) {
  if (ride.status === 'active' && new Date(ride.departure_time) > new Date()) {
    return 'status-pill status-pill--success';
  }

  return 'status-pill status-pill--warning';
}

function canCancelRide(ride) {
  return ride.status === 'active' && new Date(ride.departure_time) > new Date();
}

export function MyRidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const { notify } = useNotification();

  const loadRides = useCallback(async () => {
    try {
      setLoading(true);
      const response = await rideService.getMine();
      setRides(response.data);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadRides();
  }, [loadRides]);

  const stats = useMemo(() => {
    const activeRides = rides.filter(
      (ride) => ride.status === 'active' && new Date(ride.departure_time) > new Date()
    );

    const cancelledRides = rides.filter((ride) => ride.status === 'cancelled');

    const confirmedBookings = rides.reduce(
      (acc, ride) => acc + Number(ride.confirmed_bookings_count || 0),
      0
    );

    return {
      activeCount: activeRides.length,
      cancelledCount: cancelledRides.length,
      confirmedBookings,
    };
  }, [rides]);

  const handleCancelRide = async (ride) => {
    const confirmed = window.confirm(
      `Sigur vrei să anulezi cursa ${ride.origin} → ${ride.destination}? Rezervările confirmate pentru această cursă vor fi anulate.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoadingId(ride.id);
      await rideService.cancel(ride.id);
      notify('Cursa a fost anulată cu succes.', 'success');
      await loadRides();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="my-rides-page stack stack--lg">
      <PageHeader
        eyebrow="Cursele mele"
        title="Gestionează cursele publicate"
        description="Vezi cursele create de tine, locurile disponibile, rezervările confirmate și anulează cursele dacă este necesar."
      >
        <Link className="btn btn--primary btn--md" to="/rides/create">
          Publică o cursă
        </Link>
      </PageHeader>

      <div className="stats-grid stats-grid--compact">
        <StatCard label="Curse active" value={stats.activeCount} />
        <StatCard label="Rezervări confirmate" value={stats.confirmedBookings} accent="teal" />
        <StatCard label="Curse anulate" value={stats.cancelledCount} accent="purple" />
      </div>

      {loading ? (
        <Loader label="Se încarcă cursele tale..." />
      ) : rides.length === 0 ? (
        <EmptyState
          title="Nu ai publicat curse încă"
          description="Creează prima cursă și permite pasagerilor să rezerve locuri."
          action={
            <Link className="btn btn--primary btn--md" to="/rides/create">
              Publică o cursă
            </Link>
          }
        />
      ) : (
        <div className="ride-list">
          {rides.map((ride) => (
            <article key={ride.id} className="card ride-card my-ride-card">
              <div className="ride-card__top">
                <div className="ride-route">
                  <span className="ride-route__city">{ride.origin}</span>
                  <span className="ride-route__arrow">→</span>
                  <span className="ride-route__city">{ride.destination}</span>
                </div>

                <span className={getRideStatusClass(ride)}>
                  {getRideStatusLabel(ride)}
                </span>
              </div>

              <div className="grid grid--3 ride-card__meta">
                <div>
                  <span className="meta-label">Plecare</span>
                  <strong>{formatDateTime(ride.departure_time)}</strong>
                </div>

                <div>
                  <span className="meta-label">Locuri disponibile</span>
                  <strong>{ride.available_seats}</strong>
                </div>

                <div>
                  <span className="meta-label">Preț / loc</span>
                  <strong>{formatCurrency(ride.price)}</strong>
                </div>
              </div>

              <div className="grid grid--3 ride-card__meta">
                <div>
                  <span className="meta-label">Locuri rezervate</span>
                  <strong>{ride.confirmed_seats || 0}</strong>
                </div>

                <div>
                  <span className="meta-label">Rezervări confirmate</span>
                  <strong>{ride.confirmed_bookings_count || 0}</strong>
                </div>

                <div>
                  <span className="meta-label">Status</span>
                  <strong>{getRideStatusLabel(ride)}</strong>
                </div>
              </div>

              <div className="ride-card__actions">
                {canCancelRide(ride) ? (
                  <Button
                    variant="ghost"
                    size="md"
                    loading={actionLoadingId === ride.id}
                    onClick={() => handleCancelRide(ride)}
                  >
                    Anulează cursa
                  </Button>
                ) : null}

                <Link className="btn btn--ghost btn--md" to="/rides">
                  Vezi curse disponibile
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}