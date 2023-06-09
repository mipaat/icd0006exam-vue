<script setup lang="ts">
import type { IProduct } from '@/dto/IProduct';
import { useIdentityStore } from '@/stores/identityStore';
import { onMounted, ref } from 'vue';
import ProductExistencesComponent from '@/components/ProductExistencesComponent.vue';
import { ProductService } from '@/services/ProductService';

const identityStore = useIdentityStore();
const products = ref(null as IProduct[] | null);
const productService = new ProductService();

onMounted(async () => {
    products.value = await productService.getAll();
});

</script>

<template>
    <h1>Products</h1>

    <p v-if="identityStore.jwt?.isAdmin">
        <RouterLink :to="{ name: 'productCreate' }">Create new</RouterLink>
    </p>
    <table class="table" v-if="products">
        <thead>
            <tr>
                <th>Name</th>
                <th>Product existences</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr :key="product.id" v-for="product in products">
                <td>
                    <RouterLink :to="{ name: 'productDetails', query: { id: product.id } }">
                        {{ product.name }}
                    </RouterLink>
                </td>
                <td>
                    <ProductExistencesComponent :products="[product]" />
                </td>
                <td>
                    <template v-if="identityStore.jwt?.isAdmin">
                        <RouterLink class="btn btn-primary" :to="{name: 'productEdit', query: {id: product.id}}">Edit</RouterLink>
                        <RouterLink class="btn btn-danger" :to="{name: 'productDelete', query: {id: product.id}}">Delete</RouterLink>
                    </template>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-else>LOADING</div>
</template>
