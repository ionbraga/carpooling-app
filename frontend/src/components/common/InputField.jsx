export function InputField({ label, error, helperText, ...props }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input className={`field__input ${error ? 'field__input--error' : ''}`} {...props} />
      {error ? <span className="field__error">{error}</span> : null}
      {!error && helperText ? <span className="field__helper">{helperText}</span> : null}
    </label>
  );
}
