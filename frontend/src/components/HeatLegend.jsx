export default function HeatLegend() {
  const levels = [
    'var(--heat-0)',
    'var(--heat-1)',
    'var(--heat-2)',
    'var(--heat-3)',
    'var(--heat-4)',
    'var(--heat-5)',
    'var(--heat-6)',
  ];
  return (
    <div className="heat-legend">
      <span>Less</span>
      {levels.map((c, i) => (
        <div key={i} className="heat-cell" style={{ background: c }} />
      ))}
      <span>More</span>
    </div>
  );
}
