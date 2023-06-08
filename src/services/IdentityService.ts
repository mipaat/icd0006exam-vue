import { type IJWTResponse } from '../dto/identity/IJWTResponse';
import { type IRefreshTokenData } from '../dto/identity/IRefreshTokenData';
import { BaseService } from './BaseService';
import { isAxiosResponse } from '@/utils/Utils';

export class IdentityService extends BaseService {
    constructor() {
        super('identity/account/');
    }

    async register(
        username: string,
        password: string
    ): Promise<IJWTResponse> {
        const result = await this.post<IJWTResponse>('register', { username, password });
        if (isAxiosResponse(result)) {
            return result.data;
        }
        return result;
    }

    async login(username: string, password: string): Promise<IJWTResponse> {
        const result = await this.post<IJWTResponse>('login', { username: username, password });
        if (isAxiosResponse<IJWTResponse>(result)) {
            return result.data;
        }
        return result;
    }

    async logout(refreshToken: string, jwt: string): Promise<void> {
        await this.post('logout', { refreshToken: refreshToken, jwt: jwt });
    }

    async refreshToken(
        data: IRefreshTokenData
    ): Promise<IJWTResponse> {
        const result = await this.post<IJWTResponse>('refreshToken', data);
        if (isAxiosResponse<IJWTResponse>(result)) {
            return result.data;
        }
        return result;
    }
}
