import { NextFunction, Response, Request } from 'express';
import { Ingredient, Recipe } from '../models';
import { ErrorResponse } from '../utils';
import { Types } from 'mongoose';

export class RecipeController {
    // Fetch All Recipe
    static async fetchAllRecipe(req: Request, res: Response, next: NextFunction) {
        const recipes = await Recipe.find({});
        res.status(200).json({success: true, data: recipes, message: 'Recipes fetched'});
    }
    // Fetch Recipe
    static async fetchRecipe(req: Request, res: Response, next: NextFunction) {
        const recipeId = req.params.recipeId;
        const aggregatePipeline = [
            {$match: {_id: Types.ObjectId(recipeId)}},
            {$lookup: {
                from: Ingredient.collection.name,
                let: {ingredientId: '$Ingredients._id', usedQuantity: '$Ingredients.usedQuantity'},
                pipeline: [
                    {$match: { 
                        $expr: {
                            $in: ['$_id', '$$ingredientId']
                        }
                    }},
                    {$addFields: {usedQuantity: '$$usedQuantity'}}
                ],
                as: 'ingredients'
            }},
            {$lookup: {
                from: Recipe.collection.name,
                let: {recipeId: '$Recipes._id', usedQuantity: '$Recipes.usedQuantity'},
                pipeline: [
                    {$match: { 
                        $expr: {
                            $in: ['$_id', '$$recipeId']
                        }
                    }},
                    {$addFields: {usedQuantity: '$$usedQuantity'}}
                ],
                as: 'recipes'
            }},
            {$addFields: {totalCost: 0}}
        ];
        let recipe: any = await Recipe.aggregate(aggregatePipeline);
        if(recipe.length < 1) {
            next(new ErrorResponse('Recipe not found.', 404));
        }
        let ingredients = recipe[recipe.length - 1].ingredients;
        let recipesInRecipe = recipe[recipe.length - 1].recipes;
        let ingredient_cost = 0
        let recipe_cost = 0
        for(let i = 0; i<ingredients.length; i++) {
            let ingredient_quantity = ingredients[i].usedQuantity[i];
            ingredients[i].usedQuantity =  ingredient_quantity;
            ingredient_cost += ingredients[i].restockHistory[ingredients[i].restockHistory.length - 1].unitCost;
        }
        for(let j = 0; j<recipesInRecipe.length; j++) {
            let recipe_quantity = recipesInRecipe[j].usedQuantity;
            recipesInRecipe[j].usedQuantity = recipe_quantity;
            recipe_cost += recipesInRecipe[j].restockHistory[recipesInRecipe[j].restockHistory.length - 1].unitCost;
        }
        recipe[recipe.length -1 ].Ingredients = ingredients;
        recipe[recipe.length -1 ].Recipes = recipesInRecipe;
        delete recipe[recipe.length - 1].ingredients;
        delete recipe[recipe.length - 1].recipes;
        recipe[recipe.length -1 ].totalCost = ingredient_cost + recipe_cost;
        res.status(200).json({success: true, data: recipe, message: 'Recipe fetched.'});
    }
    // Add a New Recipe with _id
    static async addRecipe(req: Request, res: Response, next: NextFunction) {
        const newRecipe = await Recipe.create(req.body);
        res.status(201).json({success: true, data: newRecipe, message: 'Added recipe.'});
    }
    // Update a Recipe with _id
    static async updateRecipe(req: Request, res: Response, next: NextFunction) {
        const recipeId = req.params.recipeId;
        const updateArgs = {
            name: null,
            image: null,
            $push: {
                Ingredients: null,
                Recipes: null,
                restockHistory: null
            }
        };
        req.body.name ? updateArgs.name = req.body.name : delete updateArgs.name;
        req.body.image ? updateArgs.image = req.body.image : delete updateArgs.image;
        req.body.Ingredients ? updateArgs.$push.Ingredients = req.body.Ingredients : delete updateArgs.$push.Ingredients;
        req.body.Recipes ? updateArgs.$push.Recipes = req.body.Recipes : delete updateArgs.$push.Recipes;
        req.body.name ? updateArgs.$push.restockHistory = req.body.restockHistory : delete updateArgs.$push.restockHistory;
        const recipe = await Recipe.findOneAndUpdate({_id: recipeId}, updateArgs, {new: true, runValidators: true});
        res.status(200).json({success: true, data: recipe, message: 'Recipe updated.'});
    }
    // Remove a recipe with _id
    static async removeRecipe(req: Request, res: Response, next: NextFunction) {
        const recipeId = req.params._id;
        const promise_array = [
            Recipe.updateMany({}, {$pull: {Recipes: {_id: recipeId}}}),
            Recipe.findOneAndDelete({_id: recipeId})
        ];
        const recipe_removed = await Promise.all(promise_array);
        res.status(200).json({success: true, data: recipe_removed[1], message: 'Recipe removed'});
    }
}