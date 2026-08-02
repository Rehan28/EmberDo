import { heatColor } from '../utils/completion';

export default function ProgressBar({ pct, label }) {
  const p = pct === null ? 0 : pct;
  const display = pct === null ? 'No items yet' : pct + '%';
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{label}</span>
        <span className="progress-pct">{display}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: p + '%', background: heatColor(pct) }} />
      </div>
    </div>
  );
}
