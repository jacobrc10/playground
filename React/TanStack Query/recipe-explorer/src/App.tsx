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
import Header from "./components/Header";

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

  if (selectedRecipe) {
    return (
      <>
        <Header />
        <Recipe
          name={selectedRecipe.strMeal}
          thumbnail={selectedRecipe.strMealThumb}
          instructions={selectedRecipe.strInstructions}
          unselectRecipe={() => setSelectedRecipe(null)}
        />
      </>
    );
  }

  return (
    <>
      <Header />
      <section id="center">
        <LetterNav queryLetter={queryLetter} setQueryLetter={setQueryLetter} />
        <FilterList
          categories={categoryData}
          categoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <div className="recipes">
          {!recipeData?.meals && (
            <p>No recipes found for letter "{queryLetter.toUpperCase()}".</p>
          )}
          <RecipeList
            recipes={filteredRecipes}
            setSelectedRecipe={setSelectedRecipe}
          />
        </div>
      </section>
    </>
  );
}

export default App;
