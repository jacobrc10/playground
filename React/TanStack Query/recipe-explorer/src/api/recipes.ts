import { API_BASE } from "../constants/constants";

export const fetchRecipesByLetter = async (letter: string): Promise<Recipe[]> => {
  const response = await fetch(
    `${API_BASE}/search.php?f=${letter}`,
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await response.json();
  const recipes : Recipe[] = data.meals || [];
  return recipes;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(
    `${API_BASE}/categories.php`,
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await response.json();
  const categories : Category[] = data.categories || [];
  return categories;
};