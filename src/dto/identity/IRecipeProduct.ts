import type { IProduct } from "../IProduct";

export interface IRecipeProduct {
    id: string,
    product: IProduct,
    amount: number,
}