import { useState } from 'react';
import { bookingService } from '../../api/bookingService';
import { useNotification } from '../../hooks/useNotification';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { validateBookingForm } from '../../utils/validators';
import { Button } from '../common/Button';
import { InputField } from '../common/InputField';

export function BookingModal({ ride, onClose, onBooked }) {
  const [form, setForm] = useState({ seats_booked: 1 });
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateBookingForm(form);

    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    try {
      setSubmitting(true);
      await bookingService.create({
        ride_id: ride.id,
        seats_booked: Number(form.seats_booked),
      });
      notify('Rezervarea a fost creata cu succes.', 'success');
      onBooked();
      onClose();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <div>
            <span className="page-header__eyebrow">Rezervare cursa</span>
            <h2>{ride.origin} → {ride.destination}</h2>
          </div>
          <button type="button" className="modal__close" onClick={onClose}>×</button>
        </div>

        <div className="modal__summary grid grid--2">
          <div>
            <span className="meta-label">Plecare</span>
            <strong>{formatDateTime(ride.departure_time)}</strong>
          </div>
          <div>
            <span className="meta-label">Pret / loc</span>
            <strong>{formatCurrency(ride.price)}</strong>
          </div>
        </div>

        <form className="stack" onSubmit={handleSubmit}>
          <InputField
            label="Numar locuri rezervate"
            type="number"
            min="1"
            max={ride.available_seats}
            value={form.seats_booked}
            onChange={(event) => setForm({ seats_booked: event.target.value })}
            helperText={`Disponibile acum: ${ride.available_seats}`}
          />
          <div className="modal__footer">
            <Button type="button" variant="secondary" onClick={onClose}>Anuleaza</Button>
            <Button type="submit" loading={submitting}>Confirma rezervarea</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
