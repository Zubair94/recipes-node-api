import { Router } from "express";
import { RecipeController } from "../controllers";
import { requestHandler } from "../utils";

export const recipeRoutes = Router();
recipeRoutes.get('/', requestHandler(RecipeController.fetchAllRecipe));
recipeRoutes.get('/:recipeId', requestHandler(RecipeController.fetchRecipe));
recipeRoutes.post('/', requestHandler(RecipeController.addRecipe));
recipeRoutes.post('/:recipeId', requestHandler(RecipeController.updateRecipe));
recipeRoutes.delete('/:recipeId', requestHandler(RecipeController.removeRecipe));