function Recipe({
    name,
    thumbnail,
    instructions,
    unselectRecipe,
}: {
    name: string;
    thumbnail: string;
    instructions: string;
    unselectRecipe: () => void;
}) {
  return (
    <div className="recipe">
      <button onClick={unselectRecipe}>Back to list</button>
      <h2>{name}</h2>
      <img src={thumbnail} alt={name} width="300" />
      <p>{instructions}</p>
    </div>
  );
}

export default Recipe;