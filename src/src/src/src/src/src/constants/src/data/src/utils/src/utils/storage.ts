import type { AppState, DayRecord } from '../types';
import { DEFAULT_TARGETS } from '../constants/macros';
const KEY = 'macro-day-v1';
export const todayKey = () => new Date().toLocaleDateString('en-CA');
const demoDay = (): DayRecord => ({ date: todayKey(), targets: { ...DEFAULT_TARGETS }, foods: [
  { id: crypto.randomUUID(), foodId: 'chicken_breast', name: 'Ức gà chín, bỏ da', grams: 175, cooked: true },
  { id: crypto.randomUUID(), foodId: 'sweet_potato', name: 'Khoai lang luộc', grams: 57, cooked: true }
] });
export const loadState = (): AppState => { try { const raw = localStorage.getItem(KEY); if (raw) { const saved = JSON.parse(raw) as Partial<AppState>; return { days: saved.days ?? {}, customFoods: saved.customFoods ?? [], sheetFoods: saved.sheetFoods ?? [], theme: saved.theme ?? 'light' }; } } catch { /* use safe defaults */ } const day = demoDay(); return { days: { [day.date]: day }, customFoods: [], sheetFoods: [], theme: 'light' }; };
export const saveState = (state: AppState) => localStorage.setItem(KEY, JSON.stringify(state));
