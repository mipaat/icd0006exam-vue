import type { IRole } from "./IRole";

export interface IUserWithRoles {
    id: string,
    userName: string,
    roles: IRole[],
}