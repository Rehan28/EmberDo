import { useEffect, useState } from 'react';
import { api } from '../api';
import { addDays, dateKey, fmtDateLong, todayDate, uid } from '../utils/date';
import { dailyCompletion } from '../utils/completion';
import ProgressBar from '../components/ProgressBar';
import YearHeatmap from '../components/YearHeatmap';
import { useToast } from '../components/ToastContext';

function DeadlineBadge({ deadline, dayKey }) {
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTick((x) => x + 1), 30000);
    return () => clearInterval(id);
  }, []);
  const target = new Date(`${dayKey}T${deadline}:00`);
  const diffMs = target - new Date();
  if (diffMs <= 0) return <span className="task-deadline overdue">Overdue</span>;
  const mins = Math.round(diffMs / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return <span className="task-deadline">{(h > 0 ? h + 'h ' : '') + m + 'm left'}</span>;
}

export default function DailyTab({ dayOffset, setDayOffset }) {
  const [dailyMap, setDailyMap] = useState({});
  const [todoText, setTodoText] = useState('');
  const [todoPoints, setTodoPoints] = useState(10);
  const [todoDeadline, setTodoDeadline] = useState('');
  const [notodoText, setNotodoText] = useState('');
  const [notodoPoints, setNotodoPoints] = useState(10);
  const showToast = useToast();

  const currentDate = addDays(todayDate(), dayOffset);
  const k = dateKey(currentDate);
  const day = dailyMap[k] || { todos: [], notodos: [] };
  const pct = dailyCompletion(day);

  useEffect(() => {
    let active = true;
    api
      .getAllDaily()
      .then((map) => {
        if (active) setDailyMap(map);
      })
      .catch(() => showToast('Could not load daily data', true));
    return () => {
      active = false;
    };
  }, []);

  async function persistDay(dateStr, updatedDay) {
    setDailyMap((prev) => ({ ...prev, [dateStr]: updatedDay }));
    try {
      await api.putDaily(dateStr, updatedDay);
    } catch {
      showToast('Could not save — storage error', true);
    }
  }

  function addTask(type) {
    const text = (type === 'todo' ? todoText : notodoText).trim();
    if (!text) {
      showToast('Add some text first', true);
      return;
    }
    let points = parseInt(type === 'todo' ? todoPoints : notodoPoints, 10);
    if (isNaN(points)) points = 10;
    points = Math.max(1, Math.min(100, points));

    const updated = { todos: [...day.todos], notodos: [...day.notodos] };
    if (type === 'todo') {
      const item = { id: uid(), text, points, completed: false };
      if (todoDeadline) item.deadline = todoDeadline;
      updated.todos.push(item);
      setTodoText('');
      setTodoDeadline('');
    } else {
      updated.notodos.push({ id: uid(), text, points, violated: false });
      setNotodoText('');
    }
    persistDay(k, updated);
  }

  function toggleTodo(id) {
    persistDay(k, { ...day, todos: day.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) });
  }
  function toggleNotodo(id) {
    persistDay(k, { ...day, notodos: day.notodos.map((t) => (t.id === id ? { ...t, violated: !t.violated } : t)) });
  }
  function deleteTask(type, id) {
    if (type === 'todo') persistDay(k, { ...day, todos: day.todos.filter((t) => t.id !== id) });
    else persistDay(k, { ...day, notodos: day.notodos.filter((t) => t.id !== id) });
  }
  function navDay(delta) {
    setDayOffset((prev) => Math.min(0, delta === 0 ? 0 : prev + delta));
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Daily</div>
          <h1>{fmtDateLong(currentDate)}</h1>
        </div>
        <div className="date-nav">
          <button className="icon-btn" onClick={() => navDay(-1)}>
            &larr;
          </button>
          <button className="btn-ghost" onClick={() => navDay(0)} disabled={dayOffset === 0}>
            Today
          </button>
          <button className="icon-btn" onClick={() => navDay(1)} disabled={dayOffset >= 0}>
            &rarr;
          </button>
        </div>
      </div>

      <ProgressBar pct={pct} label="Today's completion" />

      <div className="two-col">
        <section className="card">
          <h2>
            To-Do <span className="card-sub">earn points by finishing</span>
          </h2>
          <div className="task-list">
            {day.todos.length === 0 && (
              <div className="empty-row">Nothing added yet — what will you get done today?</div>
            )}
            {day.todos.map((t) => (
              <div className={`task-row ${t.completed ? 'task-done' : ''}`} key={t.id}>
                <input type="checkbox" checked={t.completed} onChange={() => toggleTodo(t.id)} />
                <span className="task-text">{t.text}</span>
                {t.deadline && <DeadlineBadge deadline={t.deadline} dayKey={k} />}
                <span className="badge">+{t.points}</span>
                <button className="icon-btn" onClick={() => deleteTask('todo', t.id)} title="Delete">
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="add-row">
            <input
              type="text"
              placeholder="What will you do?"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="100"
              value={todoPoints}
              onChange={(e) => setTodoPoints(e.target.value)}
              title="Points (1-100)"
            />
            <input
              type="time"
              value={todoDeadline}
              onChange={(e) => setTodoDeadline(e.target.value)}
              title="Deadline (optional)"
            />
            <button className="btn-primary" onClick={() => addTask('todo')}>
              Add
            </button>
          </div>
        </section>

        <section className="card">
          <h2>
            Not-To-Do <span className="card-sub">earn points by resisting</span>
          </h2>
          <div className="task-list">
            {day.notodos.length === 0 && (
              <div className="empty-row">Add habits or urges you want to resist today.</div>
            )}
            {day.notodos.map((t) => (
              <div className={`task-row ${t.violated ? 'task-violated' : ''}`} key={t.id}>
                <button
                  className={`toggle-pill ${t.violated ? 'pill-bad' : 'pill-good'}`}
                  onClick={() => toggleNotodo(t.id)}
                >
                  {t.violated ? '\u00d7 Slipped' : '\u2713 Avoided'}
                </button>
                <span className="task-text">{t.text}</span>
                <span className="badge">+{t.points}</span>
                <button className="icon-btn" onClick={() => deleteTask('notodo', t.id)} title="Delete">
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="add-row">
            <input
              type="text"
              placeholder="What will you avoid?"
              value={notodoText}
              onChange={(e) => setNotodoText(e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="100"
              value={notodoPoints}
              onChange={(e) => setNotodoPoints(e.target.value)}
              title="Points (1-100)"
            />
            <button className="btn-primary" onClick={() => addTask('notodo')}>
              Add
            </button>
          </div>
        </section>
      </div>

      <section className="card">
        <h2>365-Day Heatmap</h2>
        <YearHeatmap endDate={todayDate()} valueFn={(key) => dailyCompletion(dailyMap[key])} />
      </section>
    </>
  );
}
