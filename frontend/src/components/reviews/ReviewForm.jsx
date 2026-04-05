import { useState } from 'react';
import { reviewService } from '../../api/reviewService';
import { useNotification } from '../../hooks/useNotification';
import { validateReviewForm } from '../../utils/validators';
import { Button } from '../common/Button';
import { TextAreaField } from '../common/TextAreaField';

export function ReviewForm({ userId, onCreated }) {
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateReviewForm(form);

    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    try {
      setSubmitting(true);
      await reviewService.create({
        reviewed_user_id: Number(userId),
        rating: Number(form.rating),
        comment: form.comment,
      });
      notify('Review-ul a fost adaugat cu succes.', 'success');
      setForm({ rating: 5, comment: '' });
      onCreated();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <div className="section-card__header">
        <h2>Adauga un review</h2>
        <p>Ofera feedback autentic pentru a creste increderea in comunitate.</p>
      </div>

      <label className="field">
        <span className="field__label">Rating</span>
        <select
          className="field__input"
          value={form.rating}
          onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>{value} stele</option>
          ))}
        </select>
      </label>

      <TextAreaField
        label="Comentariu"
        rows="5"
        placeholder="Spune pe scurt cum a fost experienta ta."
        value={form.comment}
        onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
        helperText={`${form.comment.length}/500 caractere`}
      />

      <Button type="submit" loading={submitting}>Publica review</Button>
    </form>
  );
}
