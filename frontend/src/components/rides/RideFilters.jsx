import { Button } from '../common/Button';
import { CitySelect } from '../common/CitySelect';

export function RideFilters({ filters, onChange, onSubmit, onReset }) {
  const updateCityFilter = (name, value) => {
    onChange({
      target: {
        name,
        value,
        type: 'text',
      },
    });
  };

  return (
    <form className="card filters-card" onSubmit={onSubmit}>
      <div className="grid grid--3">
        <CitySelect
          label="Plecare"
          placeholder="Ex. Chișinău"
          value={filters.origin}
          onChange={(city) => updateCityFilter('origin', city)}
        />

        <CitySelect
          label="Destinație"
          placeholder="Ex. Bălți"
          value={filters.destination}
          onChange={(city) => updateCityFilter('destination', city)}
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

            <span>Afișează doar cursele cu locuri disponibile</span>
          </label>
        </label>
      </div>

      <div className="filters-card__actions">
        <Button type="submit">Aplică filtre</Button>

        <Button type="button" variant="secondary" onClick={onReset}>
          Resetează
        </Button>
      </div>
    </form>
  );
}