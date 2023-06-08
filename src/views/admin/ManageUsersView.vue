<script setup lang="ts">
import type { IUserWithRoles } from '@/dto/identity/IUserWithRoles';
import type { IUserFilters } from '@/dto/input/IUserFilters';
import { UserManagementService } from '@/services/admin/UserManagementService';
import { useIdentityStore } from '@/stores/identityStore';
import { onMounted, ref, type StyleValue } from 'vue';

interface ISelectedRole {
    name: string,
    selected: boolean,
}

interface IUserWithSelectedRoles {
    id: string,
    userName: string,
    roles: ISelectedRole[],
}

const identityStore = useIdentityStore();

const users = ref(null as IUserWithSelectedRoles[] | null);
const roles = ref(null as string[] | null);
const userManagementService = new UserManagementService();
const filters = ref({ includeOnlyNotApproved: false, nameQuery: null } as IUserFilters);
const selectedUser = ref(null as IUserWithSelectedRoles | null);

const isUserInRole = (user: IUserWithRoles, roleName: string) => {
    return user.roles.some(r => r.name.toUpperCase() === roleName.toUpperCase());
}

const getSelectedRoles = (user: IUserWithRoles, roleNames: string[]): ISelectedRole[] => {
    const result = [] as ISelectedRole[];
    for (const roleName of roleNames) {
        result.push({ name: roleName, selected: isUserInRole(user, roleName) });
    }
    return result;
}

onMounted(async () => {
    await refresh();
});

const refresh = async (event: MouseEvent | Event | null = null) => {
    event?.preventDefault();
    const fetchedUsers = await userManagementService.listAll(filters.value);
    roles.value = await userManagementService.listAllRoleNames();
    users.value = [];
    for (const fetchedUser of fetchedUsers) {
        users.value.push({
            id: fetchedUser.id,
            userName: fetchedUser.userName,
            roles: getSelectedRoles(fetchedUser, roles.value),
        } as IUserWithSelectedRoles);
    }
}

const toggleRoleMenu = (user: IUserWithSelectedRoles) => {
    if (selectedUser.value == user) {
        selectedUser.value = null;
    } else {
        selectedUser.value = user;
    }
}

const updateRole = async (user: IUserWithSelectedRoles, role: ISelectedRole) => {
    role.selected = !role.selected;
    try {
        if (role.selected) {
            await userManagementService.addToRole(user.id, role.name);
        } else {
            await userManagementService.removeFromRole(user.id, role.name);
        }
    } catch (e) {
        console.log('Error setting role:', e);
        role.selected = !role.selected;
    }
}

const getRoleMenuButtonId = (user: IUserWithSelectedRoles) => {
    return `menuButton-${user.id}`;
}

const getRoleSelectionMenuStyle = (user: IUserWithSelectedRoles): StyleValue => {
    const button = document.getElementById(getRoleMenuButtonId(user));
    const rect = button?.getBoundingClientRect();
    return {
        top: rect?.top + "px",
        left: rect?.right + "px",
    };
}

const isAllowedToManageRole = (role: ISelectedRole): boolean => {
    return (identityStore.jwt?.isAdmin ?? false) && role.name.toUpperCase() !== "ADMIN";
};

</script>

<template>
    <div>
        <h2 class="text-center mb-3">Manage users</h2>
        <template v-if="!users">
            LOADING...
        </template>
        <template v-else>
            <form @submit="refresh">
                <label for="nameQuery">Search by username</label>
                <input id="nameQuery" v-model="filters.nameQuery" />
                <input type="submit" class="btn btn-primary" @click="refresh" value="Apply" />
            </form>
            <div :key="user.id" v-for="(user) in users" class="dashboard-item">
                {{ user.userName }}<br />
                <button class="btn btn-outline-primary" :id="getRoleMenuButtonId(user)" @click="toggleRoleMenu(user)">Manage roles</button>
                <div class="popup-menu" :style="getRoleSelectionMenuStyle(user)" v-if="selectedUser?.id === user.id">
                    <div :key="role.name" v-for="role in user.roles">
                        <label>
                            {{ role.name }}
                            <input type="checkbox" :disabled="!isAllowedToManageRole(role)" :checked="role.selected" @click="updateRole(user, role)" />
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.dashboard-item {
    border-radius: 0.35rem;
    padding: 1rem;
    background-color: #d9f6ff;
}

.popup-menu {
    position: absolute;
    z-index: 1;
}
</style>