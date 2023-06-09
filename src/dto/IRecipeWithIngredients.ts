import type { IRecipe } from "./IRecipe";
import type { IRecipeProduct } from "./identity/IRecipeProduct";

export interface IRecipeWithIngredients extends IRecipe {
    recipeProducts: IRecipeProduct[],
}