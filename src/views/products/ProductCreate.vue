<script setup lang="ts">
import type { IProductCreateData } from '@/dto/input/IProductCreateData';
import { ref } from 'vue';
import { ProductService } from '@/services/ProductService';
import { useRouter } from 'vue-router';

const router = useRouter();
const product = ref({name: '', unit: null} as IProductCreateData);
const productService = new ProductService();

async function submit(event: Event) {
    event.preventDefault();
    await productService.create(product.value);
    await router.push({name: 'products'});
}
</script>

<template>
    <h1>Create</h1>

    <h4>Product</h4>
    <hr />
    <div class="row">
        <div class="col-md-4">
            <form @submit="submit">
                <div class="form-group">
                    <label class="control-label">Name</label>
                    <input class="form-control" v-model="product.name"/>
                    <label class="control-label">Unit</label>
                    <input class="form-control" v-model="product.unit" />
                </div>
                <div class="form-group">
                    <input type="submit" value="Create" class="btn btn-primary" />
                </div>
            </form>
        </div>
    </div>

    <div>
        <RouterLink :to="{name: 'products'}">Back to List</RouterLink>
    </div>
</template>
