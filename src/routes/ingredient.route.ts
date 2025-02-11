import { Router } from "express";
import { IngredientController } from "../controllers";
import { requestHandler } from "../utils";

export const ingredientRoutes = Router();
ingredientRoutes.get('/', requestHandler(IngredientController.fetchAllIngredient));
ingredientRoutes.get('/:ingredientId', requestHandler(IngredientController.fetchIngredient));
ingredientRoutes.post('/', requestHandler(IngredientController.addIngredient));
ingredientRoutes.post('/:ingredientId', requestHandler(IngredientController.updateIngredient));
ingredientRoutes.delete('/:ingredientId', requestHandler(IngredientController.removeIngredient));