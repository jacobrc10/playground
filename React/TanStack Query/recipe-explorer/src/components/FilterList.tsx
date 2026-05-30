function FilterList({
  categories,
  categoriesLoading,
  categoriesError,
  selectedCategories,
  setSelectedCategories,
}: {
  categories: Category[] | undefined;
  categoriesLoading: boolean;
  categoriesError: boolean;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  if (categoriesLoading) {
    return <p>Loading categories...</p>;
  }

  if (categoriesError) {
    return <p>Error fetching categories.</p>;
  }
  return (
    <div className="categories">
      <h2>Categories</h2>
      <ul>
        {categories?.map((category: Category) => (
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
  );
}

export default FilterList;