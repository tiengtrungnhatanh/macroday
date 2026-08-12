import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Moon, RotateCcw, Sun } from 'lucide-react';
import type { DayRecord, MacroKey } from './types';
import { DEFAULT_TARGETS } from './constants/macros';
import { DEFAULT_FOODS } from './data/foods';
import { loadState, saveState, todayKey } from './utils/storage';
import { totalMacros } from './utils/calculations';
import { FoodTracker } from './components/FoodTracker';
import { MacroDonut } from './components/MacroDonut';
import { MacroPanel } from './components/MacroPanel';
import { RemainingToday } from './components/RemainingToday';
import { FoodDatabase } from './components/FoodDatabase';

const targetKeys: MacroKey[] = ['calories', 'protein', 'carb', 'fat', 'fiber'];

export default function App() {
  const [state, setState] = useState(loadState);
  const [date, setDate] = useState(todayKey());
  const [active, setActive] = useState<MacroKey>('calories');
  const [showDatabase, setShowDatabase] = useState(false);
  const fallbackDay: DayRecord = { date, targets: { ...DEFAULT_TARGETS }, foods: [] };
  const day = state.days[date] ?? fallbackDay;
  const foods = useMemo(() => [...DEFAULT_FOODS, ...state.sheetFoods, ...state.customFoods
    .filter((food) => food.name.trim())
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'))], [state.customFoods]);
  const totals = useMemo(() => totalMacros(day.foods, foods), [day.foods, foods]);

  useEffect(() => {
    saveState(state);
    document.documentElement.dataset.theme = state.theme;
  }, [state]);

  const patchDay = (patch: Partial<DayRecord>) => {
    setState((previous) => ({
      ...previous,
      days: { ...previous.days, [date]: { ...day, ...patch } }
    }));
  };

  const newDay = () => {
    if (!confirm('Bạn có chắc muốn bắt đầu ngày mới?')) return;
    const next = new Date();
    next.setDate(next.getDate() + 1);
    const nextDate = next.toLocaleDateString('en-CA');
    setDate(nextDate);
    setState((previous) => ({
      ...previous,
      days: { ...previous.days, [nextDate]: { date: nextDate, targets: { ...day.targets }, foods: [] } }
    }));
  };

  return <main className="app-shell">
    <header>
      <div><p className="brand">MACRODAY</p><h1>Theo dõi macro hôm nay</h1>
        <p className="muted"><CalendarDays size={15} />{new Date(`${date}T12:00:00`).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>
      <div className="header-actions">
        <button className="icon-button" aria-label="Đổi giao diện sáng tối" onClick={() => setState((current) => ({ ...current, theme: current.theme === 'light' ? 'dark' : 'light' }))}>{state.theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}</button>
        <button className="new-day" onClick={newDay}><RotateCcw size={17} />Ngày mới</button>
      </div>
    </header>
    <section className="target-bar"><div className="target-title"><p>MỤC TIÊU MỖI NGÀY</p><span>Điều chỉnh để theo dõi tiến độ của bạn</span></div><div className="target-inputs">{targetKeys.map((key) => <label key={key}><span>{key === 'calories' ? 'Calories' : key === 'carb' ? 'Carb' : key === 'fat' ? 'Chất béo' : key === 'fiber' ? 'Chất xơ' : 'Protein'}</span>
      <div><input type="number" min="0" value={day.targets[key]} onChange={(event) => patchDay({ targets: { ...day.targets, [key]: Number(event.target.value) } })} /><small>{key === 'calories' ? 'kcal' : 'g'}</small></div>
    </label>)}</div></section>
    <FoodTracker entries={day.foods} foods={foods} onChange={(foods) => patchDay({ foods })} />
    <section className="progress"><div className="section-heading compact"><div><p className="eyebrow">TIẾN ĐỘ TRONG NGÀY</p><h2>Macro tổng quan</h2></div></div>
      <div className="progress-content"><MacroDonut totals={totals} targets={day.targets} active={active} onSelect={setActive} /><MacroPanel active={active} totals={totals} targets={day.targets} onSelect={setActive} /></div>
    </section>
    <RemainingToday totals={totals} targets={day.targets} />
    <section className="database-toggle"><button onClick={() => setShowDatabase(!showDatabase)}>{showDatabase ? 'Ẩn database thực phẩm' : 'Quản lý database thực phẩm'}</button></section>
    {showDatabase && <FoodDatabase foods={state.customFoods} sheetFoods={state.sheetFoods} onSheetChange={(sheetFoods) => setState((current) => ({ ...current, sheetFoods }))} onChange={(customFoods) => setState((current) => ({ ...current, customFoods }))} />}
  </main>;
}
