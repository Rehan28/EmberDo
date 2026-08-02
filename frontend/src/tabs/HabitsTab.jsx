import { useEffect, useState } from 'react';
import { api } from '../api';
import { addDays, dateKey, fmtDateLong, todayDate, uid } from '../utils/date';
import { habitCompletionForDate } from '../utils/completion';
import ProgressBar from '../components/ProgressBar';
import YearHeatmap from '../components/YearHeatmap';
import { useToast } from '../components/ToastContext';

export default function HabitsTab({ habitDayOffset, setHabitDayOffset }) {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [name, setName] = useState('');
  const showToast = useToast();

  const d = addDays(todayDate(), habitDayOffset);
  const k = dateKey(d);
  const pct = habitCompletionForDate(habits, logs, k);
  const log = logs[k] || {};

  useEffect(() => {
    let active = true;
    api
      .getHabits()
      .then((data) => {
        if (active) {
          setHabits(data.habits || []);
          setLogs(data.logs || {});
        }
      })
      .catch(() => showToast('Could not load habits', true));
    return () => {
      active = false;
    };
  }, []);

  async function persist(nextHabits, nextLogs) {
    setHabits(nextHabits);
    setLogs(nextLogs);
    try {
      await api.putHabits({ habits: nextHabits, logs: nextLogs });
    } catch {
      showToast('Could not save — storage error', true);
    }
  }

  function addHabit() {
    const n = name.trim();
    if (!n) {
      showToast('Name the habit first', true);
      return;
    }
    persist([...habits, { id: uid(), name: n }], logs);
    setName('');
  }
  function toggleHabit(id) {
    const nextLog = { ...(logs[k] || {}) };
    nextLog[id] = !nextLog[id];
    persist(habits, { ...logs, [k]: nextLog });
  }
  function deleteHabit(id) {
    if (!confirm('Remove this habit? Its history will be kept but it will no longer be tracked.')) return;
    persist(
      habits.filter((h) => h.id !== id),
      logs
    );
  }
  function navHabitDay(delta) {
    setHabitDayOffset((prev) => Math.min(0, delta === 0 ? 0 : prev + delta));
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Habits</div>
          <h1>{fmtDateLong(d)}</h1>
        </div>
        <div className="date-nav">
          <button className="icon-btn" onClick={() => navHabitDay(-1)}>
            &larr;
          </button>
          <button className="btn-ghost" onClick={() => navHabitDay(0)} disabled={habitDayOffset === 0}>
            Today
          </button>
          <button className="icon-btn" onClick={() => navHabitDay(1)} disabled={habitDayOffset >= 0}>
            &rarr;
          </button>
        </div>
      </div>

      <ProgressBar pct={pct} label="Today's habits" />

      <section className="card">
        <h2>Habit Checklist</h2>
        <div className="task-list">
          {habits.length === 0 && <div className="empty-row">Add a habit below to start tracking it.</div>}
          {habits.map((h) => (
            <div className={`task-row ${log[h.id] ? 'task-done' : ''}`} key={h.id}>
              <input type="checkbox" checked={!!log[h.id]} onChange={() => toggleHabit(h.id)} />
              <span className="task-text">{h.name}</span>
              <button className="icon-btn" onClick={() => deleteHabit(h.id)} title="Remove habit">
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="add-row">
          <input
            type="text"
            placeholder="New habit, e.g. Fajr on time"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn-primary" onClick={addHabit}>
            Add habit
          </button>
        </div>
      </section>

      <section className="card">
        <h2>365-Day Heatmap</h2>
        <YearHeatmap endDate={todayDate()} valueFn={(key) => habitCompletionForDate(habits, logs, key)} />
      </section>
    </>
  );
}
