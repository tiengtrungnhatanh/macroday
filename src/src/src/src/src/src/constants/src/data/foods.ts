import type { Food } from '../types';
// Giá trị trung bình trên 100g thực phẩm chín. Thêm thực phẩm mới tại đây hoặc trong màn "Thực phẩm".
export const DEFAULT_FOODS: Food[] = [
  { id: 'chicken_breast', name: 'Ức gà chín, bỏ da', kcal: 165, protein: 31, carb: 0, fat: 3.6, fiber: 0 },
  { id: 'sweet_potato', name: 'Khoai lang luộc', kcal: 76, protein: 1.4, carb: 17.7, fat: 0.1, fiber: 2.5 },
  { id: 'white_rice', name: 'Cơm trắng chín', kcal: 130, protein: 2.7, carb: 28.2, fat: 0.3, fiber: 0.4 },
  { id: 'lean_beef', name: 'Thịt bò nạc chín', kcal: 200, protein: 29, carb: 0, fat: 8, fiber: 0 },
  { id: 'pork_tenderloin', name: 'Thăn lợn chín', kcal: 165, protein: 29, carb: 0, fat: 5, fiber: 0 },
  { id: 'boiled_egg', name: 'Trứng gà luộc', kcal: 155, protein: 12.6, carb: 1.1, fat: 10.6, fiber: 0 },
  { id: 'tofu', name: 'Đậu phụ chín', kcal: 90, protein: 10, carb: 2.5, fat: 5, fiber: 1 },
  { id: 'broccoli', name: 'Bông cải xanh luộc', kcal: 35, protein: 2.4, carb: 7.2, fat: 0.4, fiber: 3.3 },
  { id: 'water_spinach', name: 'Rau muống luộc', kcal: 20, protein: 2.6, carb: 3.1, fat: 0.2, fiber: 2.1 }
];
