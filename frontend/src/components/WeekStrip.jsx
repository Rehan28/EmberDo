import { addDays, startOfWeek, todayDate, dateKey, fmtDateShort } from '../utils/date';
import { weeklyCompletion, heatColor } from '../utils/completion';
import HeatLegend from './HeatLegend';

export default function WeekStrip({ weeklyData }) {
  const thisWeek = startOfWeek(todayDate());
  const starts = [];
  for (let i = 49; i >= 0; i--) starts.push(addDays(thisWeek, -7 * i));
  return (
    <div>
      <div className="heat-strip">
        {starts.map((s, i) => {
          const k = dateKey(s);
          const pct = weeklyCompletion(weeklyData[k]);
          const title = `Week of ${fmtDateShort(s)}: ${pct === null ? 'no data' : pct + '%'}`;
          return (
            <div
              key={i}
              className="heat-cell heat-cell-lg"
              style={{ background: heatColor(pct) }}
              title={title}
            />
          );
        })}
      </div>
      <HeatLegend />
    </div>
  );
}
