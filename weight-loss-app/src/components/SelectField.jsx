// Labeled native <select> styled by daisyUI. `options` is [{ value, label }].
export default function SelectField({ id, label, value, onChange, options, placeholder = 'Select…', required = true }) {
  return (
    <fieldset className="fieldset">
      <label className="fieldset-legend" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="select w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </fieldset>
  );
}
