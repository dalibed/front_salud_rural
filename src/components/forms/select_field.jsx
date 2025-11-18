export default function selectfield({ label, options, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Seleccione...</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
