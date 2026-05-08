import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../api/rideService';
import { Button } from '../components/common/Button';
import { CitySelect } from '../components/common/CitySelect';
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

  const formatDateTimeForInput = (date) => {
  const pad = (value) => String(value).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const getMinimumDepartureDateTime = () => {
  const date = new Date(Date.now() + 10 * 60 * 1000);
  date.setSeconds(0, 0);

  return formatDateTimeForInput(date);
};

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
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        departure_time: form.departure_time,
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
            <CitySelect
              label="Origine"
              placeholder="Ex. Chișinău"
              value={form.origin}
              onChange={(city) =>
                setForm((current) => ({
                  ...current,
                  origin: city,
                }))
              }
              helperText="Scrie câteva litere și alege localitatea din listă."
            />

            <CitySelect
              label="Destinație"
              placeholder="Ex. Bălți"
              value={form.destination}
              onChange={(city) =>
                setForm((current) => ({
                  ...current,
                  destination: city,
                }))
              }
              helperText="Destinația trebuie să fie diferită de origine."
            />
          </div>

          <div className="grid grid--3">
            <InputField
              label="Data și ora plecării"
              type="datetime-local"
              min={getMinimumDepartureDateTime()}
              value={form.departure_time}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  departure_time: event.target.value,
                }))
              }
              helperText="Alege o dată și o oră din viitor."
            />

            <InputField
              label="Locuri disponibile"
              type="number"
              min="1"
              max="8"
              step="1"
              value={form.available_seats}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  available_seats: event.target.value,
                }))
              }
              helperText="Maximum 8 locuri disponibile."
            />

            <InputField
              label="Preț per loc (MDL)"
              type="number"
              min="0"
              max="5000"
              step="1"
              value={form.price}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  price: event.target.value,
                }))
              }
              helperText="Prețul nu poate fi negativ."
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