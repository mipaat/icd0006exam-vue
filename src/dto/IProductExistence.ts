import type { IProduct } from "./IProduct";
import type { IUser } from "./identity/IUser";

export interface IProductExistence {
    id: string,
    product: IProduct,
    user: IUser,
    location: string | null,
    amount: number,
}