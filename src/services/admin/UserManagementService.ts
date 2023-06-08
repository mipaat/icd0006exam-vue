import type { IUserFilters } from "@/dto/input/IUserFilters";
import { BaseAuthenticatedService } from "../BaseAuthenticatedService";
import type { IdentityService } from "../IdentityService";
import { type IUserWithRoles } from "@/dto/identity/IUserWithRoles";

export class UserManagementService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super("admin/ManageUsers/", identityService);
    }

    async listAll(filters: IUserFilters): Promise<IUserWithRoles[]> {
        const query = `listAll?nameQuery=${filters.nameQuery ? encodeURIComponent(filters.nameQuery) : ''}`;
        return (await this.get<IUserWithRoles[]>(query)).data;
    }

    async listAllRoleNames(): Promise<string[]> {
        return (await this.get<string[]>("listAllRoleNames")).data;
    }

    async addToRole(userId: string, roleName: string): Promise<void> {
        await this.post(`addRole?userId=${userId}&roleName=${encodeURIComponent(roleName)}`);
    }

    async removeFromRole(userId: string, roleName: string): Promise<void> {
        await this.delete(`removeRole?userId=${userId}&roleName=${encodeURIComponent(roleName)}`);
    }
}