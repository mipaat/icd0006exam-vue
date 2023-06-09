<script setup lang="ts">
import ProductExistencesComponent from '@/components/ProductExistencesComponent.vue';
import type { IProduct } from '@/dto/IProduct';
import { ProductService } from '@/services/ProductService';
import { useIdentityStore } from '@/stores/identityStore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const identityStore = useIdentityStore();
const route = useRoute();
const id = route.query.id?.toString();
if (!id) {
    throw new Error('ID is required');
}

const product = ref(null as IProduct | null);
const productService = new ProductService();

onMounted(async () => {
    product.value = await productService.getById(id);
});
</script>

<template>
    <div v-if="!product">LOADING</div>
    <template v-else>
        <h1>Details</h1>

        <div>
            <h4>Product</h4>
            <hr />
            <dl class="row">
                <dt class="col-sm-2">Name</dt>
                <dd class="col-sm-10">{{ product.name }}</dd>
                <dt class="col-sm-2">Unit</dt>
                <dd class="col-sm-10">{{ product.unit }}</dd>
                <dt class="col-sm-2">Product existences</dt>
                <dd class="col-sm-10">
                    <ProductExistencesComponent />
                </dd>
            </dl>
        </div>
        <div>
            <template v-if="identityStore.jwt?.isAdmin">
                <RouterLink :to="{name: 'productEdit', query: {id: product.id}}">Edit</RouterLink>
            </template>
            <RouterLink :to="{name: 'products'}">Back to List</RouterLink>
        </div>
    </template>
</template>
