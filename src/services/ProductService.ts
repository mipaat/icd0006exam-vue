import type { IProduct } from '@/dto/IProduct';
import { BaseAuthenticatedService, type IAxiosRetryConfig } from './BaseAuthenticatedService';
import type { IProductCreateData } from '@/dto/input/IProductCreateData';

export class ProductService extends BaseAuthenticatedService {
    constructor() {
        super('products/');
    }

    async getAll(): Promise<IProduct[]> {
        const result = await this.get<IProduct[]>('getAll', {
            allowUnauthenticated: true,
            refreshAttempted: false
        } as IAxiosRetryConfig);
        return result.data;
    }

    async create(product: IProductCreateData): Promise<void> {
        await this.post("create", product);
    }

    async getById(id: string): Promise<IProduct> {
        return (await this.get<IProduct>(`getById?id=${id}`, {
            allowUnauthenticated: true,
            refreshAttempted: false
        } as IAxiosRetryConfig)).data;
    }

    async deleteProduct(id: string): Promise<void> {
        await this.delete(`delete?id=${id}`);
    }

    async editProduct(product: IProduct): Promise<void> {
        await this.put("edit", product);
    }
}
