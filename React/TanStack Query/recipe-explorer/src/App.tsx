import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import LetterNav from "./components/LetterNav";
import FilterList from "./components/FilterList";
import RecipeList from "./components/RecipeList";
import Recipe from "./components/Recipe";

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [queryLetter, setQueryLetter] = useState("a");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);

  const {
    data: recipeData,
    isLoading: recipesLoading,
    isError: recipesError,
  } = useQuery({
    queryKey: ["allRecipesStartingWith", queryLetter],
    queryFn: async () => {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=` + queryLetter,
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      return response.json();
    },
  });

  const {
    data: categoryData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/categories.php`,
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      return response.json();
    },
  });

  useEffect(() => {
    if (recipeData?.meals) {
      if (selectedCategories.length === 0) {
        setFilteredRecipes(recipeData.meals);
      } else {
        setFilteredRecipes(
          recipeData.meals.filter((meal: any) =>
            selectedCategories.includes(meal.strCategory),
          ),
        );
      }
    } else {
      setFilteredRecipes([]);
    }
  }, [recipeData, selectedCategories]);

  if (recipesLoading) {
    return <div>Loading...</div>;
  }

  if (recipesError) {
    return <div>Error fetching recipes.</div>;
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Recipe Explorer</h1>
          <p>
            All the tasty recipes in one location. Powered by React and TanStack
            Query.
          </p>
        </div>
        {!selectedRecipe && (
          <LetterNav
            queryLetter={queryLetter}
            setQueryLetter={setQueryLetter}
          />
        )}
        {!selectedRecipe && (
          <FilterList
            categories={categoryData}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        )}
        <div className="recipes">
          {!selectedRecipe && !recipeData?.meals && (
            <p>No recipes found for letter "{queryLetter.toUpperCase()}".</p>
          )}
          {!selectedRecipe && (
            <RecipeList
              recipes={filteredRecipes}
              setSelectedRecipe={setSelectedRecipe}
            />
          )}
          {selectedRecipe && (
            <Recipe
              name={selectedRecipe.strMeal}
              thumbnail={selectedRecipe.strMealThumb}
              instructions={selectedRecipe.strInstructions}
              unselectRecipe={() => setSelectedRecipe(null)}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default App;
