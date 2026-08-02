import { useEffect, useState } from 'react';
import { api } from '../api';
import { addDays, dateKey, fmtDateShort, startOfWeek, todayDate, uid } from '../utils/date';
import { weeklyCompletion } from '../utils/completion';
import ProgressBar from '../components/ProgressBar';
import WeekStrip from '../components/WeekStrip';
import { useToast } from '../components/ToastContext';

export default function WeeklyTab({ weekOffset, setWeekOffset }) {
  const [weeklyMap, setWeeklyMap] = useState({});
  const [text, setText] = useState('');
  const [points, setPoints] = useState(20);
  const showToast = useToast();

  const ws = addDays(startOfWeek(todayDate()), weekOffset * 7);
  const we = addDays(ws, 6);
  const k = dateKey(ws);
  const week = weeklyMap[k] || { goals: [] };
  const pct = weeklyCompletion(week);

  useEffect(() => {
    let active = true;
    api
      .getAllWeekly()
      .then((map) => {
        if (active) setWeeklyMap(map);
      })
      .catch(() => showToast('Could not load weekly data', true));
    return () => {
      active = false;
    };
  }, []);

  async function persist(key, updated) {
    setWeeklyMap((prev) => ({ ...prev, [key]: updated }));
    try {
      await api.putWeekly(key, updated);
    } catch {
      showToast('Could not save — storage error', true);
    }
  }

  function addGoal() {
    const t = text.trim();
    if (!t) {
      showToast('Add some text first', true);
      return;
    }
    const p = Math.max(1, Math.min(100, parseInt(points, 10) || 20));
    persist(k, { goals: [...week.goals, { id: uid(), text: t, points: p, completed: false }] });
    setText('');
  }
  function toggleGoal(id) {
    persist(k, { goals: week.goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)) });
  }
  function deleteGoal(id) {
    persist(k, { goals: week.goals.filter((g) => g.id !== id) });
  }
  function navWeek(delta) {
    setWeekOffset((prev) => Math.min(0, delta === 0 ? 0 : prev + delta));
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Weekly</div>
          <h1>
            {fmtDateShort(ws)} &ndash; {fmtDateShort(we)}, {we.getFullYear()}
          </h1>
        </div>
        <div className="date-nav">
          <button className="icon-btn" onClick={() => navWeek(-1)}>
            &larr;
          </button>
          <button className="btn-ghost" onClick={() => navWeek(0)} disabled={weekOffset === 0}>
            This week
          </button>
          <button className="icon-btn" onClick={() => navWeek(1)} disabled={weekOffset >= 0}>
            &rarr;
          </button>
        </div>
      </div>

      <ProgressBar pct={pct} label="Week's completion" />

      <section className="card">
        <h2>Weekly Goals</h2>
        <div className="task-list">
          {week.goals.length === 0 && <div className="empty-row">Set a few goals for this week.</div>}
          {week.goals.map((g) => (
            <div className={`task-row ${g.completed ? 'task-done' : ''}`} key={g.id}>
              <input type="checkbox" checked={g.completed} onChange={() => toggleGoal(g.id)} />
              <span className="task-text">{g.text}</span>
              <span className="badge">+{g.points}</span>
              <button className="icon-btn" onClick={() => deleteGoal(g.id)} title="Delete">
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="add-row">
          <input
            type="text"
            placeholder="A goal for this week..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="number"
            min="1"
            max="100"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            title="Points (1-100)"
          />
          <button className="btn-primary" onClick={addGoal}>
            Add
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Last 50 Weeks</h2>
        <WeekStrip weeklyData={weeklyMap} />
      </section>
    </>
  );
}
