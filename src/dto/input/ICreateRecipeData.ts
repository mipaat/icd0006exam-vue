export interface ICreateRecipeData {
    name: string,
    isPrivate: boolean,
    servings: number,
    prepareTimeMinutes: number,
    instructions: string | null,
}