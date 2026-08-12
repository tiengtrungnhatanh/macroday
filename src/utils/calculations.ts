import type { Food, FoodEntry, MacroKey, Macros } from '../types';
export const emptyMacros = (): Macros => ({ calories: 0, protein: 0, carb: 0, fat: 0, fiber: 0 });
export const entryMacros = (entry: FoodEntry, foods: Food[]): Macros => {
  const food = foods.find((item) => item.id === entry.foodId);
  if (!food) return emptyMacros();
  const factor = Math.max(0, entry.grams || 0) / (food.baseGrams || 100);
  return { calories: food.kcal * factor, protein: food.protein * factor, carb: food.carb * factor, fat: food.fat * factor, fiber: food.fiber * factor };
};
export const totalMacros = (entries: FoodEntry[], foods: Food[]): Macros => entries.reduce((total, entry) => {
  const item = entryMacros(entry, foods);
  (Object.keys(total) as MacroKey[]).forEach((key) => { total[key] += item[key]; });
  return total;
}, emptyMacros());
export const formatNumber = (value: number, decimals = 1) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(value);
export const formatWhole = (value: number) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value);
