import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import QuoteModal from './components/QuoteModal';
import { ToastProvider } from './components/ToastContext';
import DailyTab from './tabs/DailyTab';
import WeeklyTab from './tabs/WeeklyTab';
import MonthlyTab from './tabs/MonthlyTab';
import HabitsTab from './tabs/HabitsTab';
import NotesTab from './tabs/NotesTab';
import { randomQuote } from './data/quotes';
import { dateKey, todayDate } from './utils/date';
import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('daily');
  const [dayOffset, setDayOffset] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [habitDayOffset, setHabitDayOffset] = useState(0);
  const [quote, setQuote] = useState(null);

  function showQuote() {
    setQuote(randomQuote());
  }
  function closeQuote() {
    setQuote(null);
  }

  // Show the daily reflection quote once per day, the first time the app loads.
  useEffect(() => {
    const tk = dateKey(todayDate());
    api
      .getMeta()
      .then((meta) => {
        if (meta.lastQuoteDate !== tk) {
          api.putMeta({ lastQuoteDate: tk }).catch(() => {});
          setTimeout(showQuote, 500);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ToastProvider>
      <div id="app">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onReflect={showQuote} />
        <main className="content">
          {activeTab === 'daily' && <DailyTab dayOffset={dayOffset} setDayOffset={setDayOffset} />}
          {activeTab === 'weekly' && <WeeklyTab weekOffset={weekOffset} setWeekOffset={setWeekOffset} />}
          {activeTab === 'monthly' && <MonthlyTab monthOffset={monthOffset} setMonthOffset={setMonthOffset} />}
          {activeTab === 'habits' && (
            <HabitsTab habitDayOffset={habitDayOffset} setHabitDayOffset={setHabitDayOffset} />
          )}
          {activeTab === 'notes' && <NotesTab />}
        </main>
      </div>
      <QuoteModal quote={quote} onAnother={showQuote} onClose={closeQuote} />
    </ToastProvider>
  );
}
