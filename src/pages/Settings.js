import { useState, useEffect } from "react";
import "../styles/Recipes.css";
import { API_URL } from "../config";


export default function Settings() {
    const [settings, setSettings] = useState({
        "--background-color": "#fff",
        "--background-light": "#fff",
        "--primary-color": "rgb(255, 0, 86)",
        "--shadow-color": "rgba(0,0,0,0.2)",
        "--text-color": "#0A0A0A",
        "--text-light": "#575757",
        "--font-size": "16px",
        "--animation-speed": 2,
    });

    // Existing functionality
    const [recipeSuggestions, setRecipeSuggestions] = useState("");
    const [pageSuggestions, setPageSuggestions] = useState("");

    const handleRecipeSuggestionsChange = (e) => {
        setRecipeSuggestions(e.target.value);
    };

    const handlePageSuggestionsChange = (e) => {
        setPageSuggestions(e.target.value);
    };

    const handleSubmitRecipeSuggestions = () => {
        alert(`Recipe Suggestions submitted: ${recipeSuggestions}`);
        setRecipeSuggestions("");
    };

    const handleSubmitPageSuggestions = () => {
        alert(`Page review submitted: ${pageSuggestions}`);
        setPageSuggestions("");
    };

    // New Add Recipe functionality
    
    const [recipeTitle, setRecipeTitle] = useState("");
    const [recipeDescription, setRecipeDescription] = useState("");
    const [recipeCategory, setRecipeCategory] = useState("Breakfast");
    const [recipeIngredients, setRecipeIngredients] = useState("");
    const [recipeSteps, setRecipeSteps] = useState("");
    const [recipeImage, setRecipeImage] = useState("");

    const handleAddRecipe = async () => {
        const newRecipe = {
            title: recipeTitle,
            description: recipeDescription,
            category: recipeCategory,
            ingredients: recipeIngredients.split("\n"),
            steps: recipeSteps.split("\n"),
            image: recipeImage || "https://via.placeholder.com/150",
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRecipe),
            });

            if (!response.ok) throw new Error("Failed to add recipe");
            alert("Recipe added successfully!");

            // Clear form
            setRecipeTitle("");
            setRecipeDescription("");
            setRecipeCategory("Breakfast");
            setRecipeIngredients("");
            setRecipeSteps("");
            setRecipeImage("");
        } catch (error) {
            console.error("Error adding recipe:", error);
            alert("Failed to add recipe. Please try again.");
        }
    };

    return (
        <div>
            {/* Recipe Suggestions Section */}
            <div className="section d-block">
                <h2>Suggestions To Add New Recipe</h2>
                <div className="options-container">
                    <textarea
                        value={recipeSuggestions}
                        onChange={handleRecipeSuggestionsChange}
                        placeholder="Enter your suggestions here..."
                        rows="4"
                        className="suggestions-textarea"
                    ></textarea>
                </div>
                <div className="submit-container">
                    <button
                        className="submit-btn"
                        onClick={handleSubmitRecipeSuggestions}
                        disabled={!recipeSuggestions.trim()}
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Page Suggestions Section */}
            <div className="section d-block">
                <h2>Review About The Page</h2>
                <div className="options-container">
                    <textarea
                        value={pageSuggestions}
                        onChange={handlePageSuggestionsChange}
                        placeholder="Enter your review here..."
                        rows="4"
                        className="suggestions-textarea"
                    ></textarea>
                </div>
                <div className="submit-container">
                    <button
                        className="submit-btn"
                        onClick={handleSubmitPageSuggestions}
                        disabled={!pageSuggestions.trim()}
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Add Recipe Section */}
            
            <div className="add-recipe-section">
                <h2>Add a New Recipe</h2>
                <div className="form-container">
                    <input
                        type="text"
                        value={recipeTitle}
                        onChange={(e) => setRecipeTitle(e.target.value)}
                        placeholder="Recipe Title"
                        className="input-field"
                    />
                    <textarea
                        value={recipeDescription}
                        onChange={(e) => setRecipeDescription(e.target.value)}
                        placeholder="Recipe Description"
                        rows="2"
                        className="input-field"
                    ></textarea>
                    <select
                        value={recipeCategory}
                        onChange={(e) => setRecipeCategory(e.target.value)}
                        className="input-field"
                    >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Desserts">Desserts</option>
                    </select>
                    <textarea
                        value={recipeIngredients}
                        onChange={(e) => setRecipeIngredients(e.target.value)}
                        placeholder="Ingredients (one per line)"
                        rows="4"
                        className="input-field"
                    ></textarea>
                    <textarea
                        value={recipeSteps}
                        onChange={(e) => setRecipeSteps(e.target.value)}
                        placeholder="Steps (one per line)"
                        rows="4"
                        className="input-field"
                    ></textarea>
                    <input
                        type="text"
                        value={recipeImage}
                        onChange={(e) => setRecipeImage(e.target.value)}
                        placeholder="Image URL (optional)"
                        className="input-field"
                    />
                    <button
                        className="submit-btn"
                        onClick={handleAddRecipe}
                        disabled={
                            !recipeTitle.trim() ||
                            !recipeDescription.trim() ||
                            !recipeIngredients.trim() ||
                            !recipeSteps.trim()
                        }
                    >
                        Add Recipe
                    </button>
                </div>
            </div>
        </div>
    );
}
