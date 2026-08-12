export type MacroKey = 'calories' | 'protein' | 'carb' | 'fat' | 'fiber';
export type Macros = Record<MacroKey, number>;
export interface Food { id: string; name: string; baseGrams?: number; kcal: number; protein: number; carb: number; fat: number; fiber: number; }
export interface FoodEntry { id: string; foodId?: string; name: string; grams: number; cooked: boolean; }
export interface DayRecord { date: string; targets: Macros; foods: FoodEntry[]; }
export interface AppState { days: Record<string, DayRecord>; customFoods: Food[]; sheetFoods: Food[]; theme: 'light' | 'dark'; }
