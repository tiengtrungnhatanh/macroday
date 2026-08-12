import type { MacroKey, Macros } from '../types';
import { MACROS } from '../constants/macros';
import { formatNumber, formatWhole } from '../utils/calculations';

const keys: MacroKey[] = ['calories', 'protein', 'carb', 'fat', 'fiber'];

export function MacroDonut({ totals, targets, active, onSelect }: { totals: Macros; targets: Macros; active: MacroKey; onSelect: (key: MacroKey) => void }) {
  const ratios = keys.map((key) => Math.min(targets[key] > 0 ? totals[key] / targets[key] : 0, 1));
  const sum = ratios.reduce((total, ratio) => total + ratio, 0) || 1;
  const labelRatios = ratios.some((ratio) => ratio > 0) ? ratios : keys.map(() => 1);
  const labelSum = labelRatios.reduce((total, ratio) => total + ratio, 0);
  let current = 0;
  const gradient = ratios.map((value, index) => { const start = current / sum * 360; current += value; return `${MACROS[keys[index]].color} ${start}deg ${current / sum * 360}deg`; }).join(', ');
  const caloriePct = targets.calories > 0 ? totals.calories / targets.calories * 100 : 0;
  return <div className="donut-wrap">
    <div className="energy-stage">
      <div className="energy-orbit orbit-one" /><div className="energy-orbit orbit-two" />
      <div className="energy-donut" style={{ background: `conic-gradient(${gradient})` }} aria-label={`Calories ${formatWhole(totals.calories)} trên ${formatWhole(targets.calories)} kcal`}>
        <div className="energy-donut-core"><span>CALORIES</span><strong>{formatWhole(totals.calories)}</strong><small>trên {formatWhole(targets.calories)} kcal</small><b>{Math.round(caloriePct)}%</b></div>
      </div>
      {keys.map((key, index) => { const before = labelRatios.slice(0, index).reduce((total, ratio) => total + ratio, 0); const angle = ((before + labelRatios[index] / 2) / labelSum) * Math.PI * 2 - Math.PI / 2 - (8 * Math.PI / 180); const pct = targets[key] > 0 ? totals[key] / targets[key] * 100 : 0; return <button key={key} className={`macro-pod pod-${key} ${active === key ? 'is-active' : ''}`} style={{ left: `${50 + Math.cos(angle) * 45}%`, top: `${50 + Math.sin(angle) * 45}%` }} onClick={() => onSelect(key)} aria-pressed={active === key}><i style={{ background: MACROS[key].color }} /><span>{MACROS[key].label}</span><strong>{formatNumber(totals[key])} <small>{MACROS[key].unit}</small></strong><em>{Math.round(pct)}%</em></button>; })}
      <p className="energy-caption">Nhấn vào chỉ số để mở bảng chi tiết</p>
    </div>
  </div>;
}
