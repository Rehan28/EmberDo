import { todayDate, monthKey, MONTH_NAMES } from '../utils/date';
import { monthlyCompletion, heatColor } from '../utils/completion';
import HeatLegend from './HeatLegend';

export default function MonthStrip({ monthlyData }) {
  const now = todayDate();
  const months = [];
  for (let i = 11; i >= 0; i--) months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  return (
    <div>
      <div className="heat-strip heat-strip-months">
        {months.map((m, i) => {
          const k = monthKey(m);
          const pct = monthlyCompletion(monthlyData[k]);
          const title = `${MONTH_NAMES[m.getMonth()]} ${m.getFullYear()}: ${pct === null ? 'no data' : pct + '%'}`;
          return (
            <div key={i} className="heat-month-box" style={{ background: heatColor(pct) }} title={title}>
              <span>{MONTH_NAMES[m.getMonth()]}</span>
            </div>
          );
        })}
      </div>
      <HeatLegend />
    </div>
  );
}
