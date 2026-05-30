import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";
import LetterNav from "./components/LetterNav";
import FilterList from "./components/FilterList";
import RecipeList from "./components/RecipeList";
import Recipe from "./components/Recipe";
import Header from "./components/Header";
import { API_BASE } from "./constants/constants";

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [queryLetter, setQueryLetter] = useState("a");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [page, setPage] = useState(1);    

  const {
    data: recipeData,
    isLoading: recipesLoading,
    isError: recipesError,
  } = useQuery({
    queryKey: ["allRecipesStartingWith", queryLetter],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE}/search.php?f=${queryLetter}`,
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
        `${API_BASE}/categories.php`,
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
            page={page}
            setPage={setPage}
          />
        </div>
      </section>
    </>
  );
}

export default App;
