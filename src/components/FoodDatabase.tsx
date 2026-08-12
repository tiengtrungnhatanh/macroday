import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Food } from '../types';

const SHEET_ID = '13E6oTJBL4B9yW0UsmBBYJRWCi76U6KxmoPO6uBrsPcs';
const SHEET_GID = '1357749791';
const normalise = (value: unknown) => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
const numberValue = (value: unknown) => {
  const text = String(value ?? '').trim();
  if (!text) return 0;
  return text.includes(',') ? Number(text.replace(/\./g, '').replace(',', '.')) || 0 : Number(text) || 0;
};
const aliases = {
  name: ['name', 'ten', 'tenmon', 'tenthucpham', 'thucpham', 'monan'], grams: ['gram', 'grams', 'khoiluong', 'weight'],
  protein: ['protein', 'dam', 'chatdam'], carb: ['carb', 'carbs', 'carbohydrate', 'tinhbot', 'bot'], fat: ['fat', 'chatbeo', 'beo', 'mo'], kcal: ['kcal', 'calo', 'calories'], fiber: ['fiber', 'chatxo', 'xo']
};

const parseFoods = (raw: string): Food[] => {
  const lines = raw.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const split = (line: string) => line.includes('\t') ? line.split('\t') : line.split(/[|;]/);
  const first = split(lines[0]).map(normalise);
  const hasHeader = first.some((item) => [...aliases.name, ...aliases.kcal, ...aliases.protein, ...aliases.grams].includes(item));
  const header = hasHeader ? first : ['name', 'grams', 'protein', 'carb', 'fat', 'kcal'];
  return lines.slice(hasHeader ? 1 : 0).flatMap((line) => {
    const cells = split(line).map((cell) => cell.trim());
    const get = (accepted: string[]) => cells[header.findIndex((key) => accepted.includes(key))] ?? '';
    const name = get(aliases.name);
    return name ? [{ id: crypto.randomUUID(), name, baseGrams: numberValue(get(aliases.grams)) || 100, protein: numberValue(get(aliases.protein)), carb: numberValue(get(aliases.carb)), fat: numberValue(get(aliases.fat)), kcal: numberValue(get(aliases.kcal)), fiber: numberValue(get(aliases.fiber)) }] : [];
  });
};

type Props = { foods: Food[]; sheetFoods: Food[]; onChange: (foods: Food[]) => void; onSheetChange: (foods: Food[]) => void; };

export function FoodDatabase({ foods, sheetFoods, onChange, onSheetChange }: Props) {
  const [pasted, setPasted] = useState('');
  const [sheetStatus, setSheetStatus] = useState('Đang kết nối database Google Sheets…');
  const add = () => onChange([...foods, { id: crypto.randomUUID(), name: '', baseGrams: 100, kcal: 0, protein: 0, carb: 0, fat: 0, fiber: 0 }]);
  const update = (id: string, key: keyof Food, value: string) => onChange(foods.map((food) => food.id === id ? { ...food, [key]: key === 'name' ? value : numberValue(value) } : food));

  useEffect(() => {
    const callback = `macroDaySheet${crypto.randomUUID().replace(/-/g, '')}`;
    const script = document.createElement('script');
    const globalWindow = window as unknown as Record<string, unknown>;
    globalWindow[callback] = (response: { table?: { cols?: { label?: string }[]; rows?: { c?: { v?: unknown }[] }[] } }) => {
      try {
        const table = response.table;
        const rows = table?.rows?.map((row) => row.c?.map((cell) => cell?.v ?? '') ?? []) ?? [];
        let headers = table?.cols?.map((column) => normalise(column.label)) ?? [];
        let dataRows = rows;
        if (!headers.some((header) => aliases.name.includes(header))) {
          const index = rows.findIndex((row) => row.some((cell) => aliases.name.includes(normalise(cell))));
          if (index < 0) throw new Error('Không tìm thấy cột tên');
          headers = rows[index].map(normalise); dataRows = rows.slice(index + 1);
        }
        const get = (row: unknown[], accepted: string[]) => row[headers.findIndex((header) => accepted.includes(header))] ?? '';
        const items: Food[] = dataRows.flatMap((row, index) => {
          const name = String(get(row, aliases.name)); const kcal = get(row, aliases.kcal); const protein = get(row, aliases.protein);
          return name && (kcal || protein) ? [{ id: `sheet-${index}-${normalise(name)}`, name, baseGrams: numberValue(get(row, aliases.grams)) || 100, kcal: numberValue(kcal), protein: numberValue(protein), carb: numberValue(get(row, aliases.carb)), fat: numberValue(get(row, aliases.fat)), fiber: numberValue(get(row, aliases.fiber)) }] : [];
        });
        if (!items.length) throw new Error('Không nhận diện được dữ liệu');
        onSheetChange(items); setSheetStatus(`Đã đồng bộ ${items.length} thực phẩm từ Google Sheets`);
      } catch { setSheetStatus('Chưa đọc được database Google Sheets.'); }
    };
    script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${SHEET_GID}&headers=2&tqx=out:json;responseHandler:${callback}`;
    script.onerror = () => setSheetStatus('Không thể kết nối Google Sheets lúc này.');
    document.head.append(script);
    return () => { script.remove(); delete globalWindow[callback]; };
  }, []);

  const imported = () => { const items = parseFoods(pasted); if (!items.length) return; onChange([...foods, ...items]); setPasted(''); alert(`Đã thêm ${items.length} thực phẩm vào database.`); };
  return <section className="database">
    <div className="section-heading"><div><p className="eyebrow">DANH MỤC CÁ NHÂN</p><h2>Thực phẩm</h2><p className="muted">Nhập số liệu theo khối lượng chuẩn của món; mặc định là 100g.</p></div><button className="outline-button" onClick={add}><Plus size={18} /> Thêm từng món</button></div>
    <div className="import-box"><label htmlFor="paste-foods">Dán nhiều thực phẩm</label><textarea id="paste-foods" value={pasted} onChange={(event) => setPasted(event.target.value)} placeholder={'Tên món | Khối lượng (g) | Protein | Carb | Mỡ | Calo\nVí dụ: Cá basa nướng không dầu | 100 | 18 | 0 | 4 | 110'} /><div className="import-actions"><p className="muted">Dán theo đúng thứ tự: Tên món → Khối lượng → Protein → Carb → Mỡ → Calo.</p><button className="outline-button primary" onClick={imported}>Thêm danh sách</button></div></div>
    <p className="sheet-status muted">{sheetFoods.length ? `Đã đồng bộ ${sheetFoods.length} thực phẩm từ Google Sheets` : sheetStatus}</p>
    {foods.length === 0 ? <p className="muted">Chưa có thực phẩm tự nhập.</p> : <div className="database-list">{foods.map((food) => <div className="database-item" key={food.id}><input value={food.name} placeholder="Tên thực phẩm" onChange={(event) => update(food.id, 'name', event.target.value)} /><label>Khối lượng (g)<input type="text" inputMode="decimal" value={food.baseGrams || 100} onChange={(event) => update(food.id, 'baseGrams', event.target.value)} /></label>{(['protein', 'carb', 'fat', 'kcal'] as const).map((key) => <label key={key}>{key === 'kcal' ? 'Calo' : key === 'fat' ? 'Mỡ' : key[0].toUpperCase() + key.slice(1)}<input type="text" inputMode="decimal" value={food[key] || ''} onChange={(event) => update(food.id, key, event.target.value)} /></label>)}<button className="icon-button" aria-label="Xóa thực phẩm" onClick={() => onChange(foods.filter((item) => item.id !== food.id))}><Trash2 size={17} /></button></div>)}</div>}
  </section>;
}
