import { Button } from '../common/Button';
import { InputField } from '../common/InputField';

export function RideFilters({ filters, onChange, onSubmit, onReset }) {
  return (
    <form className="card filters-card" onSubmit={onSubmit}>
      <div className="grid grid--3">
        <InputField
          label="Plecare"
          name="origin"
          placeholder="Ex. Chisinau"
          value={filters.origin}
          onChange={onChange}
        />
        <InputField
          label="Destinatie"
          name="destination"
          placeholder="Ex. Balti"
          value={filters.destination}
          onChange={onChange}
        />
        <label className="checkbox-field">
          <span className="field__label">Disponibilitate</span>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              name="only_available"
              checked={filters.only_available}
              onChange={onChange}
            />
            <span>Afiseaza doar cursele cu locuri disponibile</span>
          </label>
        </label>
      </div>
      <div className="filters-card__actions">
        <Button type="submit">Aplica filtre</Button>
        <Button type="button" variant="secondary" onClick={onReset}>Reseteaza</Button>
      </div>
    </form>
  );
}
