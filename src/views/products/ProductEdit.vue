<script setup lang="ts">
import type { IProduct } from '@/dto/IProduct';
import { ProductService } from '@/services/ProductService';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const queryId = route.query.id?.toString();
if (!queryId) throw new Error("ID is required");
const id = queryId;

const productService = new ProductService();
const product = ref(null as IProduct | null);

onMounted(async () => {
    product.value = await productService.getById(id);
});

async function submit(event: Event) {
    event.preventDefault();
    if (!product.value) return;
    await productService.editProduct(product.value);
    await router.push({name: 'products'});
}
</script>

<template>
    <h1>Edit product</h1>

    <hr />
    <div v-if="!product">LOADING</div>
    <div v-else class="row">
        <div class="col-md-4">
            <form @submit="submit">
                <div asp-validation-summary="ModelOnly" class="text-danger"></div>
                <div class="form-group">
                    <label class="control-label">Name</label>
                    <input class="form-control" v-model="product.name" />
                </div>
                <div class="form-group">
                    <label class="control-label">Unit</label>
                    <input class="form-control" v-model="product.unit" />
                </div>
                <div class="form-group">
                    <input type="submit" value="Save" class="btn btn-primary" @click="submit" />
                </div>
            </form>
        </div>
    </div>

    <div>
        <RouterLink :to="{name: 'products'}">Back to List</RouterLink>
    </div>
</template>
