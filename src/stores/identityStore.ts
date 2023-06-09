import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import { JWT_KEY, REFRESH_TOKEN_KEY } from '@/localStorage/LocalStorageKeys';
import type { IRefreshToken } from '@/dto/identity/IRefreshToken';
import { DecodedJWT } from '@/dto/identity/DecodedJWT';
import type { IRecipe } from '@/dto/IRecipe';

const storedJwt = localStorage.getItem(JWT_KEY);
const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

let readRefreshToken: IRefreshToken | null = null;
if (storedRefreshToken) {
    const parsedStoredRefreshToken = JSON.parse(storedRefreshToken);
    readRefreshToken = {
        token: parsedStoredRefreshToken['token'],
        expiresAt: new Date(parsedStoredRefreshToken['expiresAt'])
    };
}

const readJwt = storedJwt ? new DecodedJWT(storedJwt) : null;

export const useIdentityStore = defineStore('identityStore', () => {
    const jwt = ref(readJwt);
    const refreshToken = ref(readRefreshToken);
    const ongoingRefreshPromise = ref(null as Promise<string | null> | null);

    const isLoggedIn = computed(() => {
        return jwt.value && refreshToken.value;
    });

    const isRefreshTokenExpired = () => {
        if (!refreshToken.value) return true;
        return refreshToken.value.expiresAt.getTime() < new Date().getTime() + 5000;
    };

    const isJwtExpired = () => {
        if (!jwt.value) return true;
        return jwt.value.expiresAt.getTime() < new Date().getTime() + 5000;
    };

    const isAllowedToManageRecipe = (recipe: IRecipe) => {
        return jwt.value?.isAdmin || (recipe.creator?.id && recipe.creator.id === jwt.value?.id);
    };

    const loginRequired = computed(() => {
        return !isLoggedIn.value || isRefreshTokenExpired();
    });

    const clearAll = () => {
        jwt.value = null;
        refreshToken.value = null;
    }

    if (!readJwt || !readRefreshToken) {
        clearAll();
    }

    watch(jwt, (newJwt) => {
        if (newJwt) {
            localStorage.setItem(JWT_KEY, newJwt.token);
        } else {
            localStorage.removeItem(JWT_KEY);
        }
    });

    watch(refreshToken, (newRefreshToken) => {
        if (newRefreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(newRefreshToken));
        } else {
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
    });

    return { jwt, refreshToken, isLoggedIn, isRefreshTokenExpired, loginRequired, clearAll, isJwtExpired, ongoingRefreshPromise, isAllowedToManageRecipe };
});
