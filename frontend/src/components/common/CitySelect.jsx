import { useMemo, useState } from 'react';
import { moldovaCities } from '../../data/moldovaCities';

function normalizeCity(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function CitySelect({ label, value, onChange, placeholder, helperText }) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredCities = useMemo(() => {
    const searchValue = normalizeCity(value);

    if (!searchValue) {
      return moldovaCities.slice(0, 8);
    }

    return moldovaCities
      .filter((city) => normalizeCity(city).includes(searchValue))
      .slice(0, 8);
  }, [value]);

  const handleSelectCity = (city) => {
    onChange(city);
    setIsOpen(false);
  };

  return (
    <div className="city-select">
      <label className="field">
        <span className="field__label">{label}</span>

        <div className="city-select__wrapper">
          <input
            className="field__input city-select__input"
            type="text"
            value={value}
            placeholder={placeholder}
            autoComplete="off"
            onFocus={() => setIsOpen(true)}
            onChange={(event) => {
              onChange(event.target.value);
              setIsOpen(true);
            }}
            onBlur={() => {
              setTimeout(() => setIsOpen(false), 120);
            }}
          />

          {isOpen && (
            <div className="city-select__menu">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className="city-select__option"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelectCity(city)}
                  >
                    {city}
                  </button>
                ))
              ) : (
                <div className="city-select__empty">
                  Nu a fost găsită nicio localitate.
                </div>
              )}
            </div>
          )}
        </div>

        {helperText ? <span className="field__helper">{helperText}</span> : null}
      </label>
    </div>
  );
}