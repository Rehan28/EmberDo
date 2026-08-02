import { useEffect, useState } from 'react';
import { api } from '../api';
import { monthKey, MONTH_NAMES, todayDate, uid } from '../utils/date';
import { monthlyCompletion } from '../utils/completion';
import ProgressBar from '../components/ProgressBar';
import MonthStrip from '../components/MonthStrip';
import { useToast } from '../components/ToastContext';

export default function MonthlyTab({ monthOffset, setMonthOffset }) {
  const [monthlyMap, setMonthlyMap] = useState({});
  const [text, setText] = useState('');
  const [points, setPoints] = useState(30);
  const showToast = useToast();

  const now = todayDate();
  const md = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const k = monthKey(md);
  const month = monthlyMap[k] || { goals: [] };
  const pct = monthlyCompletion(month);

  useEffect(() => {
    let active = true;
    api
      .getAllMonthly()
      .then((map) => {
        if (active) setMonthlyMap(map);
      })
      .catch(() => showToast('Could not load monthly data', true));
    return () => {
      active = false;
    };
  }, []);

  async function persist(key, updated) {
    setMonthlyMap((prev) => ({ ...prev, [key]: updated }));
    try {
      await api.putMonthly(key, updated);
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
    const p = Math.max(1, Math.min(100, parseInt(points, 10) || 30));
    persist(k, { goals: [...month.goals, { id: uid(), text: t, points: p, completed: false }] });
    setText('');
  }
  function toggleGoal(id) {
    persist(k, { goals: month.goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)) });
  }
  function deleteGoal(id) {
    persist(k, { goals: month.goals.filter((g) => g.id !== id) });
  }
  function navMonth(delta) {
    setMonthOffset((prev) => Math.min(0, delta === 0 ? 0 : prev + delta));
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Monthly</div>
          <h1>
            {MONTH_NAMES[md.getMonth()]} {md.getFullYear()}
          </h1>
        </div>
        <div className="date-nav">
          <button className="icon-btn" onClick={() => navMonth(-1)}>
            &larr;
          </button>
          <button className="btn-ghost" onClick={() => navMonth(0)} disabled={monthOffset === 0}>
            This month
          </button>
          <button className="icon-btn" onClick={() => navMonth(1)} disabled={monthOffset >= 0}>
            &rarr;
          </button>
        </div>
      </div>

      <ProgressBar pct={pct} label="Month's completion" />

      <section className="card">
        <h2>Monthly Goals</h2>
        <div className="task-list">
          {month.goals.length === 0 && <div className="empty-row">Set a few goals for this month.</div>}
          {month.goals.map((g) => (
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
            placeholder="A goal for this month..."
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
        <h2>Last 12 Months</h2>
        <MonthStrip monthlyData={monthlyMap} />
      </section>
    </>
  );
}
