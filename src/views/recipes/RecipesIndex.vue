<script setup lang="ts">
import type { IRecipeWithIngredients } from '@/dto/IRecipeWithIngredients';
import { ERecipePrivacyFilter } from '@/dto/enums/ERecipePrivacyFilter';
import type { IRecipeSearch } from '@/dto/input/IRecipeSearch';
import { RecipeService } from '@/services/RecipeService';
import { useIdentityStore } from '@/stores/identityStore';
import { onMounted, ref } from 'vue';

const identityStore = useIdentityStore();
const recipes = ref(null as IRecipeWithIngredients[] | null);
const recipeService = new RecipeService();
const recipeSearch = ref({
    privacyFilter: ERecipePrivacyFilter.All
} as IRecipeSearch);

onMounted(async () => {
    recipes.value = await recipeService.getRecipes(recipeSearch.value);
});

async function submit(event: Event) {
    event.preventDefault();
    recipes.value = await recipeService.getRecipes(recipeSearch.value);
}
</script>

<template>
    <h1>Recipes</h1>

    <form @submit="submit">
        <label>
            Name search
            <input v-model="recipeSearch.nameQuery">
        </label>

        <label>
            Exclude these ingredients
            <input v-model="recipeSearch.excludesIngredientQuery">
        </label>

        <label>
            Include these ingredients
            <input v-model="recipeSearch.includesIngredientQuery">
        </label>

        <label>
            Min prepare time
            <input v-model="recipeSearch.minPrepareTime">
        </label>

        <label>
            Max prepare time
            <input v-model="recipeSearch.maxPrepareTime">
        </label>

        <label>
            Include only meals that can be prepared
            <input type="checkbox" v-model="recipeSearch.filterServable">
        </label>

        <label>
            Custom servings amount
            <input v-model="recipeSearch.servings">
        </label>

        <select v-model="recipeSearch.privacyFilter">
            <option v-for="value in Object.values(ERecipePrivacyFilter)"
            :key="value" :selected="recipeSearch.privacyFilter === value">{{ value }}</option>
        </select>

        <input type="submit" @click="submit" class="btn btn-primary" value="Search" />
    </form>

    <p>
        <RouterLink :to="{ name: 'recipeCreate' }">Create new</RouterLink>
    </p>

    <div v-if="!recipes">LOADING</div>
    <template v-else>
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Servings</th>
                    <th>Prepare time (minutes)</th>
                    <th>Ingredients</th>
                    <th>Is private?</th>
                    <th>Creator</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="recipe in recipes" :key="recipe.id">
                    <td>
                        <a
                            asp-action="Details"
                            class="btn btn-success"
                            asp-route-id="@item.Id"
                            asp-route-servings="@Model.Servings"
                        >
                            {{ recipe.name }}
                        </a>
                    </td>
                    <td>{{ recipe.servings }}</td>
                    <td>{{ recipe.prepareTimeMinutes }}</td>
                    <td>
                        <div v-for="recipeProduct in recipe.recipeProducts" :key="recipeProduct.id">
                            {{ recipeProduct.product.name }} {{ `(${recipeProduct.amount} ${recipeProduct.product.unit}s)` }}
                        </div>
                    </td>
                    <td>{{ recipe.isPrivate.toString() }}</td>
                    <td>{{ recipe.creator?.userName }}</td>
                    <td>
                        <template v-if="identityStore.isAllowedToManageRecipe(recipe)">
                            <RouterLink
                                class="btn btn-primary"
                                :to="{ name: 'recipeEdit', query: { id: recipe.id } }"
                                >Edit</RouterLink
                            >
                            <RouterLink
                                class="btn btn-primary"
                                :to="{ name: 'recipeDelete', query: { id: recipe.id } }"
                                >Delete</RouterLink
                            >
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </template>
</template>
