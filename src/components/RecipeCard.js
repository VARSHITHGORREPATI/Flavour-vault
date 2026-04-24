import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />

      <div className="recipe-card-info">
        <p className="recipe-title">{recipe.title}</p>
        <p className="recipe-desc">
          {recipe.description || "Explore this delicious recipe."}
        </p>

        <Link className="view-btn" to={`/recipe/${encodeURIComponent(recipe.title)}`}>
          VIEW RECIPE
        </Link>
      </div>
    </div>
  );
}