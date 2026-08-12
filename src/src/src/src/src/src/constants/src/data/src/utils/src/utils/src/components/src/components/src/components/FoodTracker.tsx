import { Plus } from 'lucide-react';
import type { Food, FoodEntry } from '../types';
import { FoodItem } from './FoodItem';
export function FoodTracker({ entries, foods, onChange }: { entries: FoodEntry[]; foods: Food[]; onChange: (items: FoodEntry[]) => void }) {
  const add = () => onChange([...entries, { id: crypto.randomUUID(), name: '', grams: 0, cooked: true }]);
  return <section><div className="section-heading"><div><p className="eyebrow">NHẬT KÝ HÔM NAY</p><h2>Thực phẩm hôm nay</h2><p className="muted">Khối lượng mặc định là sau khi đã nấu chín.</p></div><button className="outline-button" onClick={add}><Plus size={18} /> Thêm thực phẩm</button></div><div className="food-list">{entries.map((entry) => <FoodItem key={entry.id} entry={entry} foods={foods} onChange={(next) => onChange(entries.map((item) => item.id === entry.id ? next : item))} onDelete={() => onChange(entries.filter((item) => item.id !== entry.id))} />)}</div>{entries.length === 0 && <button className="empty-add" onClick={add}><Plus size={20} /> Thêm thực phẩm đầu tiên</button>}</section>;
}
