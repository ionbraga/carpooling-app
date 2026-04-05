import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { rideService } from '../api/rideService';
import { BookingModal } from '../components/rides/BookingModal';
import { RideCard } from '../components/rides/RideCard';
import { RideFilters } from '../components/rides/RideFilters';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

export function RidesPage() {
  const [rides, setRides] = useState([]);
  const [filters, setFilters] = useState({ origin: '', destination: '', only_available: false });
  const [loading, setLoading] = useState(true);
  const [activeRide, setActiveRide] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const { notify } = useNotification();

  const loadRides = async (activeFilters = filters) => {
    try {
      setLoading(true);
      const response = await rideService.getAll(activeFilters);
      setRides(response.data);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRides();
  }, []);

  const statistics = useMemo(() => {
    const total = rides.length;
    const available = rides.filter((ride) => Number(ride.available_seats) > 0).length;
    const uniqueDrivers = new Set(rides.map((ride) => ride.driver_id)).size;

    return { total, available, uniqueDrivers };
  }, [rides]);

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFilterSubmit = async (event) => {
    event.preventDefault();
    await loadRides(filters);
  };

  const handleResetFilters = async () => {
    const nextFilters = { origin: '', destination: '', only_available: false };
    setFilters(nextFilters);
    await loadRides(nextFilters);
  };

  return (
    <div className="stack stack--lg">
      <PageHeader
        eyebrow="Curse disponibile"
        title="Găsește rapid o cursă potrivită"
        description="Filtrează după plecare și destinație, vezi locurile disponibile și rezervă direct din platformă."
      >
        {isAuthenticated ? (
          <Link className="btn btn--primary btn--md" to="/rides/create">
            Publică o cursă
          </Link>
        ) : null}
      </PageHeader>

      <div className="stats-grid stats-grid--compact">
        <StatCard label="Curse afișate" value={statistics.total} />
        <StatCard label="Cu locuri disponibile" value={statistics.available} accent="teal" />
        <StatCard label="Șoferi activi" value={statistics.uniqueDrivers} accent="purple" />
      </div>

      <RideFilters
        filters={filters}
        onChange={handleFilterChange}
        onSubmit={handleFilterSubmit}
        onReset={handleResetFilters}
      />

      {loading ? (
        <Loader label="Se încarcă lista curselor..." />
      ) : rides.length === 0 ? (
        <EmptyState
          title="Nu există curse pentru filtrele selectate"
          description="Încearcă alte criterii de căutare sau publică tu prima cursă."
          action={
            isAuthenticated ? (
              <Link className="btn btn--primary btn--md" to="/rides/create">
                Adaugă o cursă
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="ride-list">
          {rides.map((ride) => {
            const canBook =
              Number(ride.available_seats) > 0 &&
              (!user || Number(user.id) !== Number(ride.driver_id));

            return (
              <RideCard
                key={ride.id}
                ride={ride}
                isAuthenticated={isAuthenticated}
                canBook={canBook}
                onBook={setActiveRide}
              />
            );
          })}
        </div>
      )}

      {activeRide ? (
        <BookingModal
          ride={activeRide}
          onClose={() => setActiveRide(null)}
          onBooked={() => loadRides(filters)}
        />
      ) : null}
    </div>
  );
}