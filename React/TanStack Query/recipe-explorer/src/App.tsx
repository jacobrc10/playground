import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";
import LetterNav from "./components/LetterNav";
import FilterList from "./components/FilterList";
import RecipeList from "./components/RecipeList";
import Recipe from "./components/Recipe";
import Header from "./components/Header";
import { fetchRecipesByLetter, fetchCategories } from "./api/recipes";

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [queryLetter, setQueryLetter] = useState("a");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);    

  const {
    data: recipeData,
    isLoading: recipesLoading,
    isError: recipesError,
  }: {
    data: Recipe[] | undefined;
    isLoading: boolean;
    isError: boolean;
  } = useQuery<Recipe[]>({
    queryKey: ["allRecipesStartingWith", queryLetter],
    queryFn: () => fetchRecipesByLetter(queryLetter),
  });

  const {
    data: categoryData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  }: {
    data: Category[] | undefined;
    isLoading: boolean;
    isError: boolean;
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (recipeData && recipeData.length > 0) {
      if (selectedCategories.length === 0) {
        setFilteredRecipes(recipeData);
      } else {
        setFilteredRecipes(
          recipeData.filter((meal: Recipe) =>
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
          {recipeData && recipeData.length === 0 && (
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
