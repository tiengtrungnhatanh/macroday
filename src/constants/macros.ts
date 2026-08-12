import type { MacroKey, Macros } from '../types';
export const DEFAULT_TARGETS: Macros = { calories: 2000, protein: 150, carb: 220, fat: 60, fiber: 30 };
export const MACROS: Record<MacroKey, { label: string; unit: string; color: string }> = {
  calories: { label: 'Calories', unit: 'kcal', color: '#f1635d' }, protein: { label: 'Protein', unit: 'g', color: '#3e8df5' }, carb: { label: 'Carb', unit: 'g', color: '#f7a21a' }, fat: { label: 'Chất béo', unit: 'g', color: '#9a68db' }, fiber: { label: 'Chất xơ', unit: 'g', color: '#39a96b' }
};
