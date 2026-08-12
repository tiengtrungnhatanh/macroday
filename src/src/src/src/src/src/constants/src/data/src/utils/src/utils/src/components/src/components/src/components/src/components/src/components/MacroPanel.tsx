import type { MacroKey, Macros } from '../types';
import { MACROS } from '../constants/macros';
import { formatNumber } from '../utils/calculations';

const keys: MacroKey[] = ['calories', 'protein', 'carb', 'fat', 'fiber'];

export function MacroPanel({ active, totals, targets, onSelect }: { active: MacroKey; totals: Macros; targets: Macros; onSelect: (key: MacroKey) => void }) {
  const value = totals[active]; const target = targets[active]; const over = Math.max(0, value - target); const pct = target > 0 ? value / target * 100 : 0;
  return <div className="macro-panel">
    <div className="macro-progress-list" aria-label="Bảng tiến độ các chỉ số macro"><p>Tiến độ các chỉ số</p>{keys.map((key) => { const amount = totals[key]; const goal = targets[key]; const percentage = goal > 0 ? amount / goal * 100 : 0; const isOver = percentage > 100; return <button key={key} type="button" className={`macro-progress-row ${active === key ? 'is-active' : ''} ${isOver ? 'is-over' : ''}`} onClick={() => onSelect(key)} aria-pressed={active === key}><span className="macro-progress-title"><i style={{ background: MACROS[key].color }} />{MACROS[key].label}</span><span className="macro-progress-value">{formatNumber(amount)}<small> / {formatNumber(goal)} {MACROS[key].unit}</small></span><span className="macro-progress-bar" aria-hidden="true"><span style={{ width: `${Math.min(percentage, 100)}%`, background: MACROS[key].color }} /></span><span className="macro-progress-percent">{Math.round(percentage)}%</span></button>; })}</div>
    <div className="active-macro-card"><div className="panel-summary"><div><p className="panel-kicker" style={{ color: MACROS[active].color }}>ĐANG XEM · {MACROS[active].label}</p><div className="detail-value">{formatNumber(value)} <small>{MACROS[active].unit}</small></div></div><div className={`progress-badge ${over ? 'is-over' : ''}`}><strong>{Math.round(pct)}%</strong><span>{over ? 'Vượt mục tiêu' : 'Hoàn thành'}</span></div></div><div className="detail-grid"><div><span>Mục tiêu</span><strong>{formatNumber(target)} {MACROS[active].unit}</strong></div><div><span>{over ? 'Đã vượt' : 'Còn lại'}</span><strong>{formatNumber(over || Math.max(0, target - value))} {MACROS[active].unit}</strong></div><div><span>Tiến độ</span><strong>{Math.round(pct)}%</strong></div></div></div>
  </div>;
}
