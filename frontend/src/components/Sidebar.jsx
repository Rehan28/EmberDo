const TABS = [
  { id: 'daily', label: 'Daily', icon: '\u25CF' },
  { id: 'weekly', label: 'Weekly', icon: '\u25A3' },
  { id: 'monthly', label: 'Monthly', icon: '\u25A0' },
  { id: 'habits', label: 'Habits', icon: '\u2605' },
  { id: 'notes', label: 'Notes', icon: '\u270E' },
];

export default function Sidebar({ activeTab, onTabChange, onReflect }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div className="brand-text">
          <span className="brand-title">Ember</span>
          <span className="brand-sub">Discipline Tracker</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-item ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <button className="reflect-btn" onClick={onReflect}>
          ✨ Reflect
        </button>
        <div className="sidebar-note">Everything here is saved to your database.</div>
      </div>
    </aside>
  );
}
