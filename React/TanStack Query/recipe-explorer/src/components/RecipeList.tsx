import { useState } from "react";
import Pagination from "./Pagination";
import { RECIPES_PER_PAGE } from "../constants/constants";

function RecipeList({
  page,
  recipes,
  setSelectedRecipe,
  setPage,
}: {
  page: number;
  recipes: any[];
  setSelectedRecipe: (recipe: any) => void;
  setPage: (page: number) => void;
}) {
  if (recipes.length === 0) {
    return <p>No recipes found.</p>;
  }

  const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);
  const paginatedRecipes = recipes.slice(
    (page - 1) * RECIPES_PER_PAGE,
    page * RECIPES_PER_PAGE,
  );

  return (
    <div className="recipes">
      {paginatedRecipes.map((meal: any) => (
        <div key={meal.idMeal} className="recipe-card">
          <button onClick={() => setSelectedRecipe(meal)}>
            <h3>{meal.strMeal}</h3>
          </button>
        </div>
      ))}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default RecipeList;
