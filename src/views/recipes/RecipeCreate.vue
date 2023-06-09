<script setup lang="ts">
import type { ICreateRecipeData } from '@/dto/input/ICreateRecipeData';
import { RecipeService } from '@/services/RecipeService';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const data = ref({
    name: "",
    isPrivate: false,
    servings: 0,
    prepareTimeMinutes: 0,
    instructions: null,
} as ICreateRecipeData);

const router = useRouter();

const recipeService = new RecipeService();

async function submit(event: Event) {
    event.preventDefault();
    await recipeService.create(data.value);
    await router.push({name: 'recipes'});
}
</script>

<template>
    <h1>Create</h1>

    <h4>Recipe</h4>
    <hr />
    <div class="row">
        <div class="col-md-4">
            <form @submit="submit">
                <div asp-validation-summary="ModelOnly" class="text-danger"></div>
                <div class="form-group">
                    <label>
                        Name
                        <input v-model="data.name">
                    </label>

                    <label>
                        Instructions
                        <textarea :value="data.instructions ?? ''" @change="e => data.instructions = (e.target as HTMLTextAreaElement).value" />
                    </label>

                    <label>
                        Is private?
                        <input type="checkbox" v-model="data.isPrivate">
                    </label>

                    <label>
                        Servings
                        <input v-model="data.servings">
                    </label>

                    <label>
                        Prepare time (minutes)
                        <input v-model="data.prepareTimeMinutes">
                    </label>
                </div>
                <div class="form-group">
                    <input type="submit" value="Create" class="btn btn-primary" @submit="submit" />
                </div>
            </form>
        </div>
    </div>

    <div>
        <RouterLink :to="{name: 'recipes'}">Back to List</RouterLink>
    </div>
</template>
