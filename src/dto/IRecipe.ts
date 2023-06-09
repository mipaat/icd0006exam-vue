import type { IUser } from "./identity/IUser";

export interface IRecipe {
    id: string,
    name: string,
    isPrivate: boolean,
    servings: number,
    prepareTimeMinutes: number,
    instructions: string | null,
    creator: IUser | null,
}