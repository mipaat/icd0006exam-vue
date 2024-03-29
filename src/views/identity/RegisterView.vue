<script setup lang="ts">
import ValidationErrors from '@/components/ValidationErrors.vue';
import { ERestApiErrorType } from '@/dto/enums/ERestApiErrorType';
import { DecodedJWT } from '@/dto/identity/DecodedJWT';
import { type IJWTResponse } from '@/dto/identity/IJWTResponse';
import { RefreshToken } from '@/dto/identity/IRefreshToken';
import { isIRestApiErrorResponse, type IRestApiErrorResponse } from '@/dto/IRestApiErrorResponse';
import router from '@/router';
import { IdentityService } from '@/services/IdentityService';
import { useIdentityStore } from '@/stores/identityStore';
import { ref } from 'vue';

let validationErrors = ref(new Array<string>());
let username = "";
let password = "";
let confirmPassword = "";

const identityService = new IdentityService();

const register = async (event: MouseEvent) => {
    event.preventDefault();

    validationErrors.value = [];

    if (username.length === 0 || password.length === 0) {
        validationErrors.value.push("Bad input values!");
        return;
    }

    if (password !== confirmPassword) {
        validationErrors.value.push("Passwords must match!");
        return;
    }

    let jwtResponse: IJWTResponse | IRestApiErrorResponse | undefined;
    try {
        jwtResponse = await identityService.register(username, password);
    } catch (e) {
        if (isIRestApiErrorResponse(e) && [ERestApiErrorType.InvalidRegistrationData, ERestApiErrorType.UserAlreadyRegistered].includes(e.errorType)) {
            validationErrors.value.push(e.error);
            return;
        }
        validationErrors.value.push("Unknown error occurred");
        return;
    }

    const identityStore = useIdentityStore();
    identityStore.jwt = new DecodedJWT(jwtResponse.jwt);
    identityStore.refreshToken = new RefreshToken(jwtResponse);
    await router.push("/");
}
</script>

<template>
    <form>
        <h2>Create a new account.</h2>
        <hr />

        <ValidationErrors :errors="validationErrors" />

        <div class="form-floating mb-3">
            <input v-model="username" class="form-control" id="Input_Username" />
            <label for="Input_Username">Username</label>
        </div>

        <div class="form-floating mb-3">
            <input v-model="password" class="form-control" id="Input_Password" type="password" />
            <label for="Input_Password">Password</label>
        </div>

        <div class="form-floating mb-3">
            <input v-model="confirmPassword" class="form-control" id="Input_ConfirmPassword" type="password" />
            <label for="Input_ConfirmPassword">Confirm password</label>
        </div>

        <button @click="register" class="w-100 btn btn-lg btn-primary">Register</button>
    </form>
</template>