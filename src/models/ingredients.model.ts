import { Document, model, Schema } from 'mongoose';
const IngredientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Property name missing from Ingredient'],
        trim: true,
        maxlength: [200, 'Property name from Ingredient cannot exceed 200 characters']
    },
    restockHistory: [{
        quantity: {
            type: Number,
            required: [true, 'Property quantity missing from Ingredient.restockHistory'],
            min: 0
        },
        unitCost: {
            type: Number,
            required: [true, 'Property unitCost missing from Ingredient.restockHistory'],
            min: 0
        },            
    }],
    image: {
        type: String,
        required: [true, 'Property image missing from Ingredients']
    }
}, { timestamps: true });
export interface IIngredient extends Document {
    name: string;
    restockHistory: Array<{
        quantity: number,
        unitCost: number
    }>;
    image: string;
    createdAt: string;
    updatedAt: string;
}
export const Ingredient = model<IIngredient>('Ingredient', IngredientSchema);
// {
// 	_id: 
// 	name:
// 	restockHistory: [
// 		{
// 			quantity:
// 			unitCost: 
// }
// ],
// 	image:
// }
