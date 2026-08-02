export function dailyCompletion(day) {
  if (!day) return null;
  const todos = day.todos || [];
  const notodos = day.notodos || [];
  const total = todos.reduce((s, t) => s + t.points, 0) + notodos.reduce((s, t) => s + t.points, 0);
  if (total === 0) return null;
  const earned =
    todos.reduce((s, t) => s + (t.completed ? t.points : 0), 0) +
    notodos.reduce((s, t) => s + (t.violated ? 0 : t.points), 0);
  return Math.round((earned / total) * 100);
}

export function weeklyCompletion(week) {
  const goals = (week && week.goals) || [];
  const total = goals.reduce((s, g) => s + g.points, 0);
  if (total === 0) return null;
  const earned = goals.reduce((s, g) => s + (g.completed ? g.points : 0), 0);
  return Math.round((earned / total) * 100);
}

export function monthlyCompletion(month) {
  const goals = (month && month.goals) || [];
  const total = goals.reduce((s, g) => s + g.points, 0);
  if (total === 0) return null;
  const earned = goals.reduce((s, g) => s + (g.completed ? g.points : 0), 0);
  return Math.round((earned / total) * 100);
}

export function habitCompletionForDate(habits, logs, key) {
  if (!habits || !habits.length) return null;
  const log = (logs && logs[key]) || {};
  const done = habits.filter((h) => log[h.id]).length;
  return Math.round((done / habits.length) * 100);
}

export function heatColor(pct) {
  if (pct === null || pct === undefined) return 'var(--heat-0)';
  if (pct === 0) return 'var(--heat-1)';
  if (pct < 25) return 'var(--heat-2)';
  if (pct < 50) return 'var(--heat-3)';
  if (pct < 75) return 'var(--heat-4)';
  if (pct < 100) return 'var(--heat-5)';
  return 'var(--heat-6)';
}
