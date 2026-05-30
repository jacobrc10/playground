import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [queryLetter, setQueryLetter] = useState('a');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);


  const { data: recipes, isLoading: recipesLoading, isError: recipesError } = useQuery({
    queryKey: ['allRecipesStartingWith', queryLetter],
    queryFn: async () => {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=` + queryLetter);
      await new Promise(resolve => setTimeout(resolve, 500));
      return response.json();
    },
  });

  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return response.json();
    },
  });

  useEffect(() => {
    if (recipes?.meals) {
      if (selectedCategories.length === 0) {
        setFilteredRecipes(recipes.meals);
      } else {
        setFilteredRecipes(recipes.meals.filter((meal: any) => selectedCategories.includes(meal.strCategory)));
      }
    } else {
      setFilteredRecipes([]);
    }
  }, [recipes, selectedCategories]);


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
            All the tasty recipes in one location. Powered by React and TanStack Query.
          </p>
        </div>
        {!selectedRecipe && (
          <div className="search">
            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].map((letter) => (
              <button
                key={letter}
                onClick={() => setQueryLetter(letter)}
                disabled={queryLetter === letter}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        {categoriesLoading && <p>Loading categories...</p>}
        {categoriesError && <p>Error fetching categories.</p>}
        {categories && (
          <div className="categories">
            <h2>Categories</h2>
            <ul>
              {categories.categories.map((category: any) => (
                <li key={category.idCategory}>
                  <input
                    type="checkbox"
                    id={category.idCategory}
                    name={category.strCategory}
                    value={category.strCategory}
                    checked={selectedCategories.includes(category.strCategory)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category.strCategory]);
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== category.strCategory));
                      }
                    }}
                  />
                  <label htmlFor={category.idCategory}>{category.strCategory}</label>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="recipes">
          {!selectedRecipe && filteredRecipes.map((meal: any) => (
            <div key={meal.idMeal} className="recipe-card">
              <button onClick={() => setSelectedRecipe(meal)}>
                <h3>{meal.strMeal}</h3>
              </button>
            </div>
          ))}
          {!selectedRecipe && !recipes?.meals && <p>No recipes found for letter "{queryLetter.toUpperCase()}".</p>}
          {selectedRecipe && (
            <div className="recipe-details">
              <h2>{selectedRecipe.strMeal}</h2>
              <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} width="300" />
              <p>{selectedRecipe.strInstructions}</p>
              <button onClick={() => setSelectedRecipe(null)}>Back to recipes</button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default App
