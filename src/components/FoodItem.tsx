import { Trash2 } from 'lucide-react';
import type { Food, FoodEntry, MacroKey } from '../types';
import { MACROS } from '../constants/macros';
import { entryMacros, formatNumber } from '../utils/calculations';
interface Props { entry: FoodEntry; foods: Food[]; onChange: (next: FoodEntry) => void; onDelete: () => void; }
export function FoodItem({ entry, foods, onChange, onDelete }: Props) {
  const selected = foods.find((food) => food.id === entry.foodId);
  const macros = entryMacros(entry, foods);
  const keys: MacroKey[] = ['calories', 'protein', 'carb', 'fat', 'fiber'];
  return <article className="food-card">
    <div className="food-top"><div><label>Loại thực phẩm</label><select value={entry.foodId ?? 'custom'} onChange={(e) => { const value = e.target.value; const food = foods.find((item) => item.id === value); onChange({ ...entry, foodId: value === 'custom' ? undefined : value, name: food?.name ?? '' }); }}><option value="custom">Tự nhập thực phẩm…</option>{foods.map((food) => <option key={food.id} value={food.id}>{food.name}</option>)}</select></div><button className="icon-button" onClick={onDelete} aria-label="Xóa thực phẩm"><Trash2 size={18} /></button></div>
    {!selected && <div><label>Tên thực phẩm / món ăn</label><input value={entry.name} placeholder="Ví dụ: Cá basa nướng không dầu" onChange={(e) => onChange({ ...entry, name: e.target.value })} /><p className="unknown">Chưa có dữ liệu dinh dưỡng</p></div>}
    <div className="grams-row"><div><label>Khối lượng chín (g)</label><input type="text" inputMode="decimal" value={entry.grams || ''} placeholder="0" onChange={(e) => onChange({ ...entry, grams: Number(e.target.value.replace(',', '.')) || 0 })} /></div><div><label>Cách nấu</label><div className="cooked">Đã chín</div></div></div>
    <div className="item-macros">{keys.map((key) => <div key={key}><span>{MACROS[key].label}</span><strong>{formatNumber(macros[key])} {MACROS[key].unit}</strong></div>)}</div>
  </article>;
}
