import type { MacroKey, Macros } from '../types';
import { MACROS } from '../constants/macros';
import { formatNumber } from '../utils/calculations';
export function RemainingToday({ totals, targets }: { totals: Macros; targets: Macros }) { return <section className="remaining"><p className="eyebrow">TỔNG KẾT</p><h2>Còn lại hôm nay</h2><div className="remaining-grid">{(Object.keys(MACROS) as MacroKey[]).map((key) => { const diff = totals[key] - targets[key]; return <div key={key}><span>{MACROS[key].label}</span><strong className={diff > 0 ? 'over' : ''}>{diff > 0 ? `Vượt ${formatNumber(diff)}` : formatNumber(-diff)} {MACROS[key].unit}</strong></div>; })}</div></section>; }
