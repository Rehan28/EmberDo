import { addDays, dateKey, fmtDateLong, MONTH_NAMES } from '../utils/date';
import { heatColor } from '../utils/completion';
import HeatLegend from './HeatLegend';

function buildYearWeeks(endDate) {
  const end = new Date(endDate);
  const start = addDays(end, -364);
  start.setDate(start.getDate() - start.getDay()); // back to Sunday
  const days = [];
  let cur = new Date(start);
  while (cur <= end) {
    days.push(new Date(cur));
    cur = addDays(cur, 1);
  }
  while (days[days.length - 1].getDay() !== 6) days.push(addDays(days[days.length - 1], 1));
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

export default function YearHeatmap({ endDate, valueFn }) {
  const weeks = buildYearWeeks(endDate);
  const end = new Date(endDate);
  let lastMonth = -1;

  return (
    <div>
      <div className="heatmap-year">
        <div className="heat-months" style={{ gridTemplateColumns: `repeat(${weeks.length},11px)` }}>
          {weeks.map((w, i) => {
            const first = w[0];
            let label = '';
            if (first.getMonth() !== lastMonth && first <= end) {
              label = MONTH_NAMES[first.getMonth()];
              lastMonth = first.getMonth();
            }
            return (
              <span key={i} className="heat-month-label">
                {label}
              </span>
            );
          })}
        </div>
        <div className="heat-grid" style={{ gridTemplateColumns: `repeat(${weeks.length},11px)` }}>
          {weeks.map((w, i) => (
            <div className="heat-col" key={i}>
              {w.map((d, j) => {
                if (d > end) return <div key={j} className="heat-cell heat-future" />;
                const k = dateKey(d);
                const pct = valueFn(k);
                const title = `${fmtDateLong(d)}: ${pct === null ? 'no data' : pct + '%'}`;
                return <div key={j} className="heat-cell" style={{ background: heatColor(pct) }} title={title} />;
              })}
            </div>
          ))}
        </div>
      </div>
      <HeatLegend />
    </div>
  );
}
