import type { IRecipeSearch } from "@/dto/input/IRecipeSearch";
import { BaseAuthenticatedService } from "./BaseAuthenticatedService";
import type { IRecipeWithIngredients } from "@/dto/IRecipeWithIngredients";

export class RecipeService extends BaseAuthenticatedService {
    constructor() {
        super('recipes/');
    }

    async getRecipes(search: IRecipeSearch) {
        const params = new URLSearchParams();
        if (search.nameQuery) {
            params.append("nameQuery", search.nameQuery);
        }
        if (search.includesIngredientQuery) {
            params.append("includesIngredientQuery", search.includesIngredientQuery);
        }
        if (search.excludesIngredientQuery) {
            params.append("excludesIngredientQuery", search.excludesIngredientQuery);
        }
        if (search.minPrepareTime) {
            params.append("minPrepareTime", Math.round(search.minPrepareTime).toString());
        }
        if (search.maxPrepareTime) {
            params.append("maxPrepareTime", Math.round(search.maxPrepareTime).toString());
        }
        if (search.filterServable) {
            params.append("filterServable", search.filterServable.toString());
        }
        if (search.servings) {
            params.append("servings", search.servings.toString());
        }
        if (search.privacyFilter) {
            params.append("privacyFilter", search.privacyFilter);
        }
        const queryString = params.toString();
        return (await this.get<IRecipeWithIngredients[]>(`getRecipes?${queryString}`)).data;
    }
}