import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../api/rideService';
import { Button } from '../components/common/Button';
import { InputField } from '../components/common/InputField';
import { PageHeader } from '../components/common/PageHeader';
import { SectionCard } from '../components/common/SectionCard';
import { useNotification } from '../hooks/useNotification';
import { validateRideForm } from '../utils/validators';

export function CreateRidePage() {
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    departure_time: '',
    available_seats: 1,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateRideForm(form);
    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    try {
      setLoading(true);
      await rideService.create({
        ...form,
        available_seats: Number(form.available_seats),
        price: Number(form.price),
      });
      notify('Cursa a fost publicată cu succes.', 'success');
      navigate('/rides');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack stack--lg">
      <PageHeader
        eyebrow="Publicare cursă"
        title="Adaugă o cursă nouă"
        description="Completează traseul, ora plecării, locurile disponibile și prețul per loc."
      />

      <SectionCard
        title="Detalii cursă"
        description="Introdu datele principale ale cursei. Toate câmpurile sunt validate înainte de publicare."
      >
        <form className="grid-form" onSubmit={handleSubmit}>
          <div className="grid grid--2">
            <InputField
              label="Origine"
              placeholder="Ex. Chișinău"
              value={form.origin}
              onChange={(event) => setForm((current) => ({ ...current, origin: event.target.value }))}
            />
            <InputField
              label="Destinație"
              placeholder="Ex. Bălți"
              value={form.destination}
              onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))}
            />
          </div>

          <div className="grid grid--3">
            <InputField
              label="Data și ora plecării"
              type="datetime-local"
              value={form.departure_time}
              onChange={(event) => setForm((current) => ({ ...current, departure_time: event.target.value }))}
            />
            <InputField
              label="Locuri disponibile"
              type="number"
              min="1"
              value={form.available_seats}
              onChange={(event) => setForm((current) => ({ ...current, available_seats: event.target.value }))}
            />
            <InputField
              label="Preț per loc (MDL)"
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
            />
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/rides')}>
              Înapoi la curse
            </Button>
            <Button type="submit" loading={loading}>
              Publică cursa
            </Button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}