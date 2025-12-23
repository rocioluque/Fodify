import { api } from "../lib/api";
import type { Recipe } from "../types/Recipe";
import type { RecipePayload } from "../types/RecipePayload";
import type { RecipeCreatePayload } from "../types/RecipeCreatePayload";

// =======================
// Recipes
// =======================

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

async function getAllRecipes(): Promise<RecipesResponse> {
  return await api.get("/recipes");
}

async function getRecipeById(id: number): Promise<Recipe> {
  const res = await api.get<Recipe>(`/recipes/${id}`);
  return res.data;
}

async function deleteRecipes(id: number | undefined) {
  return await api.delete(`/recipes/${id}`);
}

async function createRecipe(body: RecipeCreatePayload) {
  return await api.post("/recipes/add", body);
}

async function updateRecipe(id: number, body: RecipePayload) {
  return await api.put(`/recipes/${id}`, {
    name: body.name,
    ingredients: body.ingredients,
    instructions: body.instructions,
    prepTimeMinutes: body.prepTimeMinutes,
    cookTimeMinutes: body.cookTimeMinutes,
    servings: body.servings,
    difficulty: body.difficulty,
    cuisine: body.cuisine,
    caloriesPerServing: body.caloriesPerServing,
    tags: body.tags,
    image: body.image,
    mealType: body.mealType,
  });
};

// =======================
// Users
// =======================

async function getAllUsers() {
  return await api.get("/users");
}

export {
  getAllRecipes,
  getRecipeById,
  deleteRecipes,
  createRecipe,
  updateRecipe,
  getAllUsers,
};
