import type { ERecipePrivacyFilter } from "../enums/ERecipePrivacyFilter";

export interface IRecipeSearch {
    nameQuery: string | null,
    includesIngredientQuery: string | null,
    excludesIngredientQuery: string | null,
    minPrepareTime: number | null,
    maxPrepareTime: number | null,
    filterServable: boolean | null,
    servings: number | null,
    privacyFilter: ERecipePrivacyFilter,
}