import type { IProduct } from '@/dto/IProduct';
import { BaseAuthenticatedService, type IAxiosRetryConfig } from './BaseAuthenticatedService';
import type { IProductCreateData } from '@/dto/input/IProductCreateData';
import type { IProductExistence } from '@/dto/IProductExistence';
import type { IProductExistenceData } from '@/dto/input/IProductExistenceData';

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

    async getExistences(): Promise<IProductExistence[]> {
        return (await this.get<IProductExistence[]>('getExistences')).data;
    }

    async getExistenceById(id: string): Promise<IProductExistence> {
        return (await this.get<IProductExistence>(`getExistenceById?id=${id}`)).data;
    }

    async createExistence(data: IProductExistenceData): Promise<void> {
        await this.post('createExistence', data);
    }

    async updateExistence(id: string, data: IProductExistenceData): Promise<void> {
        await this.put(`updateExistence?id=${id}`, data);
    }

    async deleteExistence(id: string): Promise<void> {
        await this.delete(`deleteExistence?id=${id}`);
    }
}

export function getProductTotalAmount(product: IProduct, existences: IProductExistence[]): number {
    return getExistencesFor(product, existences).map(e => e.amount).reduce((p, c) => p + c, 0);
}

export function getExistencesFor(product: IProduct, existences: IProductExistence[]): IProductExistence[] {
    return existences.filter(e => e.product.id === product.id);
}