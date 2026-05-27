import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['allRecipesStartingWithA'],
    queryFn: async () => {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=a');
      await new Promise(resolve => setTimeout(resolve, 500));
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
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
        <div className="recipes">
          {data?.meals.map((meal: any) => (
            <div key={meal.idMeal} className="recipe-card">
              <img src={meal.strMealThumb} alt={meal.strMeal} height="200" />
              <h3>{meal.strMeal}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default App
