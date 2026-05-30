function RecipeList({
  recipes,
  setSelectedRecipe,
} : { 
  recipes: any[];
  setSelectedRecipe: (recipe: any) => void;
}) {
  if (recipes.length === 0) {
    return <p>No recipes found.</p>;
  }

  return (
    <div className="recipes">
      {recipes.map((meal: any) => (
        <div key={meal.idMeal} className="recipe-card">
          <button onClick={() => setSelectedRecipe(meal)}>
            <h3>{meal.strMeal}</h3>
          </button>
        </div>
      ))}
    </div>
  );
}

export default RecipeList;